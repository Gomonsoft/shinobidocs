/**
 * Letra INVENTADA (ninguna canción real) con las tres referencias del usuario (preguntas 0165 y 0170 §A):
 *  A · dúo en dos bloques que avanzan a la vez (l01–l04),
 *  B · la misma frase cantada por dos (l05–l06) y «Todos» (l07, sin solape: control),
 *  C · coro que acompaña a la principal (l08–l12).
 * Tiempos en ms de letra (offset 0). Duración de la canción: 60 s.
 */
import type { ElementoLetra, Letra } from '@shared/letra'

export const DURACION_MS = 60_000

type Fila = {
  id: string
  texto: string
  /** Inicio que pide la canción (lo que cantan de verdad). */
  ideal: number
  fin: number | null
  parte?: 'c2' | 'todos' | 'coro'
  palabras?: boolean
}

export const FILAS: Fila[] = [
  { id: 'l01', texto: 'Si la noche trae su estrella', ideal: 6000, fin: 10000, palabras: true },
  {
    id: 'l02',
    texto: 'yo la cuento desde el tejado',
    ideal: 6500,
    fin: 10500,
    parte: 'c2',
    palabras: true
  },
  { id: 'l03', texto: 'y el viento sabe mi nombre', ideal: 10800, fin: 14500 },
  { id: 'l04', texto: 'cuando nadie lo ha llamado', ideal: 11000, fin: 15000, parte: 'c2' },
  { id: 'l05', texto: 'Luciérnagas, luciérnagas', ideal: 17000, fin: 21000 },
  { id: 'l06', texto: 'Luciérnagas, luciérnagas', ideal: 17000, fin: 21000, parte: 'c2' },
  { id: 'l07', texto: 'quédense hasta el alba', ideal: 22000, fin: 25500, parte: 'todos' },
  { id: 'l08', texto: 'Voy a seguir caminando', ideal: 30000, fin: 35000 },
  { id: 'l09', texto: 'caminando, caminando', ideal: 31500, fin: 33000, parte: 'coro' },
  { id: 'l10', texto: 'aunque el camino se acabe', ideal: 35500, fin: 40000 },
  { id: 'l11', texto: 'se acabe, se acabe', ideal: 38000, fin: 41500, parte: 'coro' },
  { id: 'l12', texto: 'la luz me va a esperar', ideal: 41000, fin: 46000 },
  { id: 'l13', texto: 'y nos vamos juntos', ideal: 47000, fin: null, parte: 'todos' }
]

function palabrasDe(texto: string, inicio: number, fin: number) {
  const ws = texto.split(' ')
  const paso = (fin - inicio) / ws.length
  return ws.map((t, i) => ({
    texto: t,
    inicio_ms: Math.round(inicio + i * paso),
    fin_ms: Math.round(inicio + (i + 1) * paso)
  }))
}

/** Inicios estrictamente crecientes: dos que empiezan juntos se separan 1 ms (ADR 0029 §7). */
export function iniciosCrecientes(filas: readonly Fila[]): number[] {
  const salida: number[] = []
  for (const f of filas) {
    const previo = salida.at(-1)
    salida.push(previo !== undefined && f.ideal <= previo ? previo + 1 : f.ideal)
  }
  return salida
}

export function elementosInventados(filas: readonly Fila[] = FILAS): ElementoLetra[] {
  const inicios = iniciosCrecientes(filas)
  const pausa = (id: string, inicio: number): ElementoLetra => ({
    id,
    tipo: 'pausa',
    texto: '',
    inicio_ms: inicio,
    fin_ms: null,
    palabras: null
  })
  const salida: ElementoLetra[] = []
  filas.forEach((f, i) => {
    const inicio = inicios[i]!
    salida.push({
      id: f.id,
      tipo: 'linea',
      texto: f.texto,
      inicio_ms: inicio,
      fin_ms: f.fin,
      palabras: f.palabras && f.fin ? palabrasDe(f.texto, inicio, f.fin) : null,
      ...(f.palabras ? { origen_palabras: 'manual' as const } : {}),
      ...(f.parte ? { parte: f.parte } : {})
    })
    if (f.id === 'l04') salida.push(pausa('p1', 16000))
    if (f.id === 'l07') salida.push(pausa('p2', 27000))
  })
  return salida
}

export const PARTES_INVENTADAS = {
  cantantes: [
    { id: 'c1' as const, nombre: 'Marta' },
    { id: 'c2' as const, nombre: 'Iván' }
  ],
  voz_en_coros: 0.5
}

export function letraInventada(): Letra {
  return {
    origen: 'manual',
    lrclib_id: null,
    offset_ms: 0,
    lineas: elementosInventados(),
    partes: PARTES_INVENTADAS
  } as Letra
}

/** La misma letra sin solapes: cada fin recortado al inicio de la siguiente línea (lo que ve 0.2.2). */
export function letraRecortada(letra: Letra): Letra {
  const lineas = letra.lineas.map((e, i) => {
    const sig = letra.lineas.slice(i + 1).find((x) => x.inicio_ms !== null)
    if (e.tipo !== 'linea' || e.fin_ms === null || !sig || sig.inicio_ms === null) return { ...e }
    return e.fin_ms > sig.inicio_ms ? { ...e, fin_ms: sig.inicio_ms, palabras: null } : { ...e }
  })
  return { ...letra, lineas }
}

/** Voz sintética «perfecta»: la unión de los intervalos reales de todas las líneas (la voz separada mezcla a todos). */
export function vozPerfecta(
  letra: Pick<Letra, 'lineas'>,
  fin: (id: string) => number | null,
  desfaseMs = 0
): { intervalos: [number, number][] } {
  const tramos: [number, number][] = []
  for (const e of letra.lineas) {
    if (e.tipo !== 'linea' || e.inicio_ms === null) continue
    const f = fin(e.id)
    if (f !== null) tramos.push([e.inicio_ms + desfaseMs, f + desfaseMs])
  }
  tramos.sort((a, b) => a[0] - b[0])
  const unidos: [number, number][] = []
  for (const t of tramos) {
    const u = unidos.at(-1)
    if (u && t[0] <= u[1]) u[1] = Math.max(u[1], t[1])
    else unidos.push([t[0], t[1]])
  }
  return { intervalos: unidos }
}
