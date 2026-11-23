// Informativo de la fase 1 (tarea 0328): fin propuesto por la alineacion frente a la voz detectada
// (detectarVoz) y frente a los fines prudentes de «Ajustar los silencios» en las mismas lineas.
// Reutiliza shared/silencios.ts y el lector de picos de app/ (solo lectura). Imprime solo cifras.
// Uso (desde app/): node --experimental-transform-types --disable-warning=ExperimentalWarning \
//   --disable-warning=MODULE_TYPELESS_PACKAGE_JSON ../docs/spikes/0028-alineacion/fines.mjs <biblioteca> <salida>
import { register } from 'node:module'
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const APP = resolve(process.cwd())
register(pathToFileURL(join(APP, 'scripts/resolver-ts.mjs')).href, import.meta.url)
const { detectarVoz, proponerAjusteSilencios } = await import(pathToFileURL(join(APP, 'src/shared/silencios.ts')).href)
const { leerNivelBase } = await import(pathToFileURL(join(APP, 'src/main/picos/formato.ts')).href)
const { ESPERA_LEGADA } = await import(pathToFileURL(join(APP, 'src/shared/espera.ts')).href)

const [biblioteca, salida] = process.argv.slice(2)
const MARGEN = [0, 100]
const vozEn = (iv, a, b) => iv.reduce((s, [x, y]) => s + Math.max(0, Math.min(y, b) - Math.max(x, a)), 0)
const tot = { lineas: 0, ali: 0, base: 0 }
const acum = { ali0: 0, ali100: 0, pru: 0, aliSobrePru0: 0, aliSobrePru100: 0, finMenorQuePru: 0, finMayorQuePru: 0 }
const difs = []
for (const f of (await readdir(salida)).filter((n) => /^[0-9a-f]{8}\.json$/.test(n)).sort()) {
  const s = JSON.parse(await readFile(join(salida, f), 'utf8'))
  const dir = (await readdir(biblioteca)).find((n) => n.startsWith(s.id8))
  const c = JSON.parse(await readFile(join(biblioteca, dir, 'cancion.json'), 'utf8'))
  const pistas = await readdir(join(biblioteca, dir, 'pistas'))
  const nivel = await leerNivelBase(join(biblioteca, dir, 'pistas', pistas.find((n) => n.startsWith('.picos-voz-v1-'))))
  const voz = detectarVoz({ pasoMs: nivel.pasoMs, pares: nivel.pares })
  const letra = { ...c.letra, offset_ms: 0, lineas: c.letra.lineas.map((e) => (e.tipo === 'linea' ? { ...e, fin_ms: null, palabras: null } : e)) }
  const prop = proponerAjusteSilencios(letra, voz, { duracionMs: nivel.duracionMs, espera: ESPERA_LEGADA, soloFinesAutomaticos: true, activarComodin: false })
  const pru = new Map(prop.cambios.map((x) => [x.id, x.finDespues]))
  const el = c.letra.lineas
  let n = 0, a0 = 0, a100 = 0, p = 0, cp = 0, ca0 = 0, ca100 = 0
  for (const l of s.lineas) {
    if (l.fin_alin === undefined) continue
    n++
    const sig = el.slice(l.i + 1).find((e) => e.inicio_ms !== null)
    const lim = sig ? sig.inicio_ms : nivel.duracionMs
    const corta = (fin) => vozEn(voz.intervalos, fin, lim) >= 300
    const x0 = corta(l.fin_alin), x100 = corta(l.fin_alin + 100)
    if (x0) a0++
    if (x100) a100++
    const fp = pru.get(el[l.i].id)
    if (fp !== undefined) {
      cp++
      if (corta(fp)) p++
      if (x0) ca0++
      if (x100) ca100++
      difs.push(l.fin_alin - fp)
    }
  }
  console.log(`${s.id8}: lineas alineadas ${n}; alineacion con voz>=300 ms despues: margen0 ${a0} (${((a0 / n) * 100).toFixed(0)}%), margen100 ${a100} (${((a100 / n) * 100).toFixed(0)}%); prudentes proponen ${cp}, de ellos con voz despues: ${p}; en esas mismas lineas la alineacion (m0/m100): ${ca0}/${ca100}`)
  tot.ali += n; acum.ali0 += a0; acum.ali100 += a100; acum.pru += p; tot.base += cp; acum.aliSobrePru0 += ca0; acum.aliSobrePru100 += ca100
}
difs.sort((a, b) => a - b)
const med = difs.length ? difs[Math.floor(difs.length / 2)] : NaN
console.log(`GLOBAL: lineas alineadas ${tot.ali}; alineacion con voz>=300 ms tras el fin: m0 ${acum.ali0} (${((acum.ali0 / tot.ali) * 100).toFixed(1)}%), m100 ${acum.ali100} (${((acum.ali100 / tot.ali) * 100).toFixed(1)}%)`)
console.log(`  lineas donde 'Ajustar los silencios' propone fin: ${tot.base}; con voz>=300 ms tras su fin: ${acum.pru} (${((acum.pru / tot.base) * 100).toFixed(1)}%); alineacion en esas mismas lineas m0 ${acum.aliSobrePru0} (${((acum.aliSobrePru0 / tot.base) * 100).toFixed(1)}%), m100 ${acum.aliSobrePru100} (${((acum.aliSobrePru100 / tot.base) * 100).toFixed(1)}%)`)
console.log(`  mediana (fin alineacion - fin prudente) en esas lineas: ${med} ms`)
