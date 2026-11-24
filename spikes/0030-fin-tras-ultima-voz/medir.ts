/**
 * Prueba de concepto (propuesta 043, valoración técnica). SOLO LECTURA: no escribe nada.
 * No se importa desde `app/`; reutiliza `detectarVoz`, `proponerAjusteSilencios` y el lector de picos.
 *
 * Uso (desde cualquier carpeta, con `npm install` hecho en `app/`):
 *   node --experimental-transform-types --disable-warning=ExperimentalWarning \
 *        docs/spikes/0030-fin-tras-ultima-voz/medir.mjs <carpeta-de-biblioteca> [--detalle]
 *
 * Compara reglas para el fin de una línea sin palabras manuales en su ventana [inicio, inicio siguiente):
 *   A   actual (ADR 0018 §6.1): voz anterior al PRIMER silencio ≥ 400 ms.
 *   B   último tramo de voz de la ventana, si tras él hay un silencio ≥ 400 ms hasta el inicio siguiente.
 *   C   como B, pero un último tramo de menos de 300 ms de voz (separado por ≥ 400 ms) no cuenta.
 *   D   como B, pero la voz que empieza en los 250 ms previos al inicio siguiente es de la siguiente línea.
 *   CD  C y D juntas.
 *   A+  A cuando B no encuentra silencio final (B, y si no hay, A): mide cuánto se recupera del hueco.
 *   E<n> como A, pero salta una pausa interior de menos de n s si después hay un tramo de ≥ 300 ms de voz
 *       que no empieza en los 250 ms previos al inicio siguiente (E2t: sin guarda; E2g: sin tramo mínimo;
 *       E2s: ni lo uno ni lo otro). Es la regla recomendada en la valoración (E2).
 * «Voz dentro» de una espera: ≥ 500 ms de voz en un hueco ≥ umbral de espera (la cuenta saldría cantando).
 * Referencia: fin de la última palabra o, sin palabras, un fin fijado a mano (sin `origen_fin`). En la
 * biblioteca del Mac solo hay palabras importadas, no revisadas a mano: es aproximada. En la de Windows,
 * las canciones con fines corregidos a mano dan la referencia buena.
 * DEPURAR=1 imprime ejemplos donde E2 y A difieren.
 * Se miden los fines «como si fueran automáticos» (sin `fin_ms` ni palabras), igual que la preparación.
 * Solo imprime identificadores (8 caracteres) y cifras.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { leerNivelBase } from '../../../app/src/main/picos/formato.ts'
import { ESPERA_LEGADA, esperaSchema } from '../../../app/src/shared/espera.ts'
import { letraSchema, type Letra } from '../../../app/src/shared/letra.ts'
import {
  PARAMETROS_SILENCIOS as P,
  detectarVoz,
  proponerAjusteSilencios
} from '../../../app/src/shared/silencios.ts'

type Iv = [number, number]
const SIL = P.silencioMinimoMs
const COLA = P.margenColaMs
const TRAMO_MIN = 300
const GUARDA = 250
const QUEDA_VOZ = 150

/** Regla A: copia literal de `buscarFinVoz`. */
function reglaA(iv: readonly Iv[], a: number, b: number): number | null {
  let k = iv.findIndex(([, f]) => f > a)
  if (k === -1 || iv[k]![0] >= b) return null
  for (; k < iv.length; k++) {
    const finVoz = iv[k]![1]
    if (finVoz >= b) return null
    const sig = iv[k + 1]
    const finSil = sig ? Math.min(sig[0], b) : b
    if (finSil - finVoz >= SIL) return finVoz
    if (!sig || sig[0] >= b) return null
  }
  return null
}

/** Tramos de voz (intervalos separados por menos de SIL) dentro de [a, b). */
function tramos(
  iv: readonly Iv[],
  a: number,
  b: number
): { ini: number; fin: number; voz: number }[] {
  const res: { ini: number; fin: number; voz: number }[] = []
  for (const [i, f] of iv) {
    if (f <= a || i >= b) continue
    const ultimo = res[res.length - 1]
    if (ultimo && i - ultimo.fin < SIL) {
      ultimo.fin = f
      ultimo.voz += f - i
    } else res.push({ ini: i, fin: f, voz: f - i })
  }
  return res
}

function ultimaVoz(
  iv: readonly Iv[],
  a: number,
  b: number,
  { tramoMin = 0, guarda = 0 }: { tramoMin?: number; guarda?: number }
): number | null {
  let t = tramos(iv, a, b - guarda)
  if (t.length === 0) return null
  // C: el último tramo, si es corto y hay otro antes, no cuenta (respiración, resto, entrada adelantada).
  while (tramoMin > 0 && t.length > 1 && t[t.length - 1]!.voz < tramoMin) t = t.slice(0, -1)
  const fin = t[t.length - 1]!.fin
  // Silencio final hasta el inicio siguiente (con guarda: la voz de la guarda es de la siguiente).
  if (fin >= b - guarda) return null
  if (b - fin < SIL) return null
  return fin
}

/**
 * E: como A, pero salta un silencio interior MÁS CORTO que `maxPausa` si después vuelve a haber un tramo
 * de voz de al menos `tramoMin` que no empieza en la guarda previa al inicio siguiente. Un silencio igual o
 * más largo que `maxPausa` cierra la línea (lo que venga después no es de ella).
 */
function reglaE(
  iv: readonly Iv[],
  a: number,
  b: number,
  { maxPausa, tramoMin = 0, guarda = 0 }: { maxPausa: number; tramoMin?: number; guarda?: number }
): number | null {
  const t = tramos(iv, a, b)
  if (t.length === 0) return null
  let k = 0
  while (k + 1 < t.length) {
    const sig = t[k + 1]!
    const pausa = sig.ini - t[k]!.fin
    if (pausa >= maxPausa || sig.voz < tramoMin || sig.ini >= b - guarda) break
    k++
  }
  const fin = t[k]!.fin
  if (fin >= b) return null
  const finSil = t[k + 1] ? Math.min(t[k + 1]!.ini, b) : b
  return finSil - fin >= SIL ? fin : null
}

const REGLAS: Record<string, (iv: readonly Iv[], a: number, b: number) => number | null> = {
  A: reglaA,
  B: (iv, a, b) => ultimaVoz(iv, a, b, {}),
  C: (iv, a, b) => ultimaVoz(iv, a, b, { tramoMin: TRAMO_MIN }),
  D: (iv, a, b) => ultimaVoz(iv, a, b, { guarda: GUARDA }),
  CD: (iv, a, b) => ultimaVoz(iv, a, b, { tramoMin: TRAMO_MIN, guarda: GUARDA }),
  'A+': (iv, a, b) => ultimaVoz(iv, a, b, {}) ?? reglaA(iv, a, b),
  'E1.5': (iv, a, b) => reglaE(iv, a, b, { maxPausa: 1500, tramoMin: TRAMO_MIN, guarda: GUARDA }),
  E2: (iv, a, b) => reglaE(iv, a, b, { maxPausa: 2000, tramoMin: TRAMO_MIN, guarda: GUARDA }),
  E3: (iv, a, b) => reglaE(iv, a, b, { maxPausa: 3000, tramoMin: TRAMO_MIN, guarda: GUARDA }),
  E1: (iv, a, b) => reglaE(iv, a, b, { maxPausa: 1000, tramoMin: TRAMO_MIN, guarda: GUARDA }),
  E2t: (iv, a, b) => reglaE(iv, a, b, { maxPausa: 2000, tramoMin: TRAMO_MIN }),
  E2g: (iv, a, b) => reglaE(iv, a, b, { maxPausa: 2000, guarda: GUARDA }),
  E2s: (iv, a, b) => reglaE(iv, a, b, { maxPausa: 2000 })
}

function vozEn(iv: readonly Iv[], a: number, b: number): number {
  let s = 0
  for (const [i, f] of iv) if (f > a && i < b) s += Math.min(f, b) - Math.max(i, a)
  return s
}

interface Linea {
  cancion: string
  idx: number
  a: number
  b: number
  ref: number | null
  umbral: number
}

async function cargar(raiz: string) {
  const lineas: Linea[] = []
  /** Líneas con palabras hechas a mano: la app no las toca, pero su última palabra es una referencia buena. */
  const manuales: Linea[] = []
  const voces = new Map<string, Iv[]>()
  const letras = new Map<string, { letra: Letra; duracion: number; umbral: number }>()
  for (const id of (await readdir(raiz)).sort()) {
    let json: {
      letra?: unknown
      estilo?: { espera?: unknown }
      metadatos?: { duracion_ms?: number }
    }
    try {
      json = JSON.parse(await readFile(join(raiz, id, 'cancion.json'), 'utf8'))
    } catch {
      continue
    }
    const l = letraSchema.safeParse(json.letra)
    const duracion = json.metadatos?.duracion_ms
    if (!l.success || !duracion) continue
    const cache = (await readdir(join(raiz, id, 'pistas')).catch(() => [] as string[])).find((n) =>
      /^\.picos-voz-v1-[a-f0-9]{64}\.bin$/.test(n)
    )
    if (!cache) continue
    const picos = await leerNivelBase(join(raiz, id, 'pistas', cache))
    if (!picos) continue
    const iv = detectarVoz({
      pasoMs: picos.pasoMs,
      pares: picos.pares
    }).intervalos
    const esp = esperaSchema.safeParse(json.estilo?.espera)
    const umbral = (esp.success ? esp.data : ESPERA_LEGADA).umbral_ms
    const corto = id.slice(0, 8)
    voces.set(corto, iv)
    letras.set(corto, { letra: l.data, duracion, umbral })
    const off = l.data.offset_ms
    l.data.lineas.forEach((e, i) => {
      if (e.tipo !== 'linea' || e.inicio_ms === null) return
      const manual = e.palabras !== null && e.origen_palabras === 'manual'
      const sig = l.data.lineas.slice(i + 1).find((x) => x.inicio_ms !== null)
      if (!sig) return
      const ultima = e.palabras?.[e.palabras.length - 1]
      ;(manual ? manuales : lineas).push({
        cancion: corto,
        idx: i,
        a: e.inicio_ms + off,
        b: sig.inicio_ms! + off,
        // Referencia: fin de la última palabra o, si no hay palabras, un fin fijado a mano (sin `origen_fin`).
        ref: ultima
          ? ultima.fin_ms + off
          : e.fin_ms !== null && e.origen_fin === undefined
            ? e.fin_ms + off
            : null,
        umbral
      })
    })
  }
  return { lineas, manuales, voces, letras }
}

const mediana = (v: number[]) => {
  if (!v.length) return 0
  const s = [...v].sort((x, y) => x - y)
  return s[Math.floor(s.length / 2)]!
}

async function main() {
  const args = process.argv.slice(2)
  const raiz = args.find((a) => !a.startsWith('--'))
  if (!raiz) throw new Error('Falta la carpeta de la biblioteca')
  const detalle = args.includes('--detalle')
  const { lineas, manuales, voces, letras } = await cargar(raiz)

  // Comprobación: la copia de A coincide con `proponerAjusteSilencios` (fines automáticos, sin palabras).
  let difA = 0
  for (const [c, { letra, duracion, umbral }] of letras) {
    const limpia: Letra = {
      ...letra,
      lineas: letra.lineas.map((e) =>
        e.tipo === 'linea' && !(e.palabras !== null && e.origen_palabras === 'manual')
          ? { ...e, fin_ms: null, palabras: null }
          : e
      )
    }
    const r = proponerAjusteSilencios(
      limpia,
      { intervalos: voces.get(c)! },
      {
        duracionMs: duracion,
        espera: { ...ESPERA_LEGADA, umbral_ms: umbral }
      }
    )
    for (const ln of lineas.filter((x) => x.cancion === c)) {
      const iv = voces.get(c)!
      const f = reglaA(iv, ln.a, ln.b)
      const esperado = f === null ? null : Math.min(f + COLA, ln.b)
      const real = r.letra.lineas[ln.idx]!.fin_ms
      const normal = esperado === null || esperado === ln.b ? null : esperado
      if (real !== normal) difA++
    }
  }

  const canciones = [...new Set(lineas.map((l) => l.cancion))]
  console.log(
    `Canciones: ${canciones.length}; líneas con siguiente: ${lineas.length}; diferencias A frente a la app: ${difA}`
  )
  console.log(
    'regla | con fin | queda voz ≥150 | >1500 | distinto de A | más tarde que A (mediana ms) | sin fin y A sí | hueco ≥400 | hueco ≥ espera | pierde espera de A | gana espera | esperas con voz dentro ≥500 ms | esperas limpias de A perdidas'
  )
  const resultadosA = new Map<Linea, number | null>()
  for (const ln of lineas) {
    const f = reglaA(voces.get(ln.cancion)!, ln.a, ln.b)
    resultadosA.set(ln, f === null ? null : Math.min(f + COLA, ln.b))
  }
  const porRegla: Record<string, Map<Linea, number | null>> = {}
  for (const [nombre, regla] of Object.entries(REGLAS)) {
    let conFin = 0,
      queda = 0,
      queda15 = 0,
      distinto = 0,
      sinFinASi = 0,
      h400 = 0,
      hEsp = 0,
      pierde = 0,
      gana = 0,
      falsas = 0,
      limpiasPerdidas = 0
    const retrasos: number[] = []
    const res = new Map<Linea, number | null>()
    for (const ln of lineas) {
      const iv = voces.get(ln.cancion)!
      const f = regla(iv, ln.a, ln.b)
      const fin = f === null ? null : Math.min(f + COLA, ln.b)
      res.set(ln, fin)
      const finA = resultadosA.get(ln)!
      const efectivo = fin ?? ln.b
      const efectivoA = finA ?? ln.b
      if (fin !== null) {
        conFin++
        const v = vozEn(iv, fin, ln.b)
        if (v >= QUEDA_VOZ) queda++
        if (v > 1500) queda15++
      }
      if (fin !== finA) distinto++
      if (efectivo > efectivoA) retrasos.push(efectivo - efectivoA)
      if (fin === null && finA !== null) sinFinASi++
      const hueco = ln.b - efectivo
      const huecoA = ln.b - efectivoA
      if (hueco >= 400) h400++
      if (hueco >= ln.umbral) {
        hEsp++
        if (vozEn(iv, efectivo, ln.b) >= 500) falsas++
      }
      if (huecoA >= ln.umbral && hueco < ln.umbral) {
        pierde++
        if (vozEn(iv, efectivoA, ln.b) < 500) limpiasPerdidas++
      }
      if (huecoA < ln.umbral && hueco >= ln.umbral) gana++
    }
    porRegla[nombre] = res
    console.log(
      `${nombre.padEnd(5)} | ${conFin} | ${queda} | ${queda15} | ${distinto} | ${retrasos.length} (${mediana(retrasos)}) | ${sinFinASi} | ${h400} | ${hEsp} | ${pierde} | ${gana} | ${falsas} | ${limpiasPerdidas}`
    )
  }

  // Referencia: fin de la última palabra (importada o manual) o fin fijado a mano. Las líneas con palabras
  // a mano se evalúan como si no las tuvieran (la app no las toca, pero dicen dónde acaba la voz).
  const conRef = [...lineas, ...manuales].filter((l) => l.ref !== null)
  if (conRef.length) {
    console.log(
      `\nReferencia: fin de la última palabra o fin fijado a mano (${conRef.length} líneas en ${new Set(conRef.map((l) => l.cancion)).size} canciones)`
    )
    console.log(
      'regla | con fin | error medio (ms, solo con fin) | cortes (>150 ms antes) | cortes >1 s | tardíos (>500 ms después) | sin fin: error medio del fin automático'
    )
    for (const nombre of Object.keys(REGLAS)) {
      const regla = REGLAS[nombre]!
      let n = 0,
        suma = 0,
        cortes = 0,
        cortes1 = 0,
        tardios = 0,
        nSin = 0,
        sumaSin = 0,
        total = 0
      for (const ln of conRef) {
        const f = regla(voces.get(ln.cancion)!, ln.a, ln.b)
        const fin = f === null ? null : Math.min(f + COLA, ln.b)
        total += Math.abs((fin ?? ln.b) - ln.ref!)
        if (fin === null) {
          nSin++
          sumaSin += Math.abs(ln.b - ln.ref!)
          continue
        }
        n++
        suma += Math.abs(fin - ln.ref!)
        if (ln.ref! - fin > 150) cortes++
        if (ln.ref! - fin > 1000) cortes1++
        if (fin - ln.ref! > 500) tardios++
      }
      console.log(
        `${nombre.padEnd(5)} | ${n} | ${n ? Math.round(suma / n) : 0} | ${cortes} | ${cortes1} | ${tardios} | ${nSin} líneas, ${nSin ? Math.round(sumaSin / nSin) : 0} | error medio de todas (fin efectivo): ${Math.round(total / conRef.length)}`
      )
    }
  }

  // Qué hay después del fin de A cuando queda voz: pausa (fin de voz → siguiente tramo), voz, si llega al inicio siguiente.
  const pausas: number[] = []
  let llegan = 0,
    cortos = 0,
    total = 0
  for (const ln of lineas) {
    const finA = resultadosA.get(ln)!
    if (finA === null) continue
    const iv = voces.get(ln.cancion)!
    if (vozEn(iv, finA, ln.b) < QUEDA_VOZ) continue
    total++
    const t = tramos(iv, finA - COLA, ln.b)
    const sig = t[0]
    if (sig) pausas.push(sig.ini - (finA - COLA))
    const ultimo = t[t.length - 1]!
    if (ultimo.fin >= ln.b - 10) llegan++
    if (t.every((x) => x.voz < TRAMO_MIN)) cortos++
  }
  const cubos = [400, 700, 1000, 1500, 2000, 3000, 4000, Infinity]
  const hist = cubos.map(
    (c, i) =>
      `${i ? cubos[i - 1] : 0}–${c === Infinity ? '∞' : c}: ${pausas.filter((p) => p < c && p >= (i ? cubos[i - 1]! : 0)).length}`
  )
  console.log(
    `\nLíneas donde A deja voz después: ${total}; la voz llega al inicio siguiente: ${llegan}; solo tramos < ${TRAMO_MIN} ms: ${cortos}`
  )
  console.log(`Duración de la pausa en la que corta A (ms): ${hist.join(' · ')}`)

  // Huecos de espera de A: qué voz hay dentro y qué hace E2.
  console.log(
    '\nHuecos ≥ espera con A: canción·línea | hueco A (ms) | voz dentro (ms) | pausa tras la voz (ms) | llega al inicio siguiente | E2 conserva la espera'
  )
  for (const ln of lineas) {
    const finA = resultadosA.get(ln)!
    if (finA === null || ln.b - finA < ln.umbral) continue
    const iv = voces.get(ln.cancion)!
    const t = tramos(iv, finA - COLA, ln.b)
    const fe = REGLAS['E2']!(iv, ln.a, ln.b)
    const efE = fe === null ? ln.b : Math.min(fe + COLA, ln.b)
    console.log(
      `${ln.cancion}·${ln.idx} | ${ln.b - finA} | ${vozEn(iv, finA, ln.b)} | ${t[0] ? t[0].ini - (finA - COLA) : '-'} | ${t.length && t[t.length - 1]!.fin >= ln.b - 10 ? 'sí' : 'no'} | ${ln.b - efE >= ln.umbral ? 'sí' : 'no'}`
    )
  }

  if (process.env.DEPURAR) {
    let n = 0
    for (const ln of lineas) {
      const iv = voces.get(ln.cancion)!
      const fa = reglaA(iv, ln.a, ln.b)
      const fe = REGLAS['E2']!(iv, ln.a, ln.b)
      if (fa !== null && fe === null && n++ < 6) {
        console.log(ln.cancion, ln.idx, ln.a, ln.b, fa, JSON.stringify(tramos(iv, ln.a, ln.b)))
      }
    }
  }

  if (detalle) {
    console.log('\nPor canción (A: con fin / queda voz · B · CD)')
    for (const c of canciones) {
      const ls = lineas.filter((l) => l.cancion === c)
      const fila = ['A', 'B', 'CD'].map((n) => {
        let cf = 0,
          q = 0
        for (const ln of ls) {
          const fin = porRegla[n]!.get(ln)!
          if (fin === null) continue
          cf++
          if (vozEn(voces.get(c)!, fin, ln.b) >= QUEDA_VOZ) q++
        }
        return `${cf}/${q}`
      })
      console.log(`${c} | ${ls.length} | ${fila.join(' | ')}`)
    }
  }
}

await main()
