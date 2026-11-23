// Resume la salida de medir.cjs: node resumir.mts medicion.json
import { readFileSync } from 'node:fs'
type M = { media: number; p50: number; p95: number }
type R = {
  id: string
  fps: number
  fotogramas: number
  zonas: number
  lineasMax: number
  reintentos: number
  noAsentadas: number
  pintar: M
  captura1: M
  capturaReal: M
  fotograma: M
  ronda: number
}
const d = JSON.parse(readFileSync(process.argv[2]!, 'utf8')) as {
  equipo: string
  electron: string
  chrome: string
  resultados: R[]
}
console.log(`${d.equipo}, Electron ${d.electron}, Chromium ${d.chrome}`)
const ids = [...new Set(d.resultados.map((r) => r.id))]
const media = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length
const base = (id: string) => (id.endsWith('_60') || id === 'z4_60' ? 'base_60' : 'base')
const fila = (id: string) => {
  const rs = d.resultados.filter((r) => r.id === id)
  return {
    id,
    zonas: rs[0]!.zonas,
    lineas: rs[0]!.lineasMax,
    fps: rs[0]!.fps,
    fotogramas: rs.reduce((s, r) => s + r.fotogramas, 0),
    pintar: media(rs.map((r) => r.pintar.media)),
    captura1: media(rs.map((r) => r.captura1.media)),
    captura: media(rs.map((r) => r.capturaReal.media)),
    fotograma: media(rs.map((r) => r.fotograma.media)),
    p95: media(rs.map((r) => r.fotograma.p95)),
    porRonda: rs.map((r) => r.fotograma.media.toFixed(1)).join(' / '),
    reintentos: rs.reduce((s, r) => s + r.reintentos, 0),
    noAsentadas: rs.reduce((s, r) => s + r.noAsentadas, 0)
  }
}
const filas = ids.map(fila)
console.log(
  '| escenario | zonas | líneas máx. | FPS | fotogramas | pintar (ms) | 1 captura (ms) | captura real ×2 (ms) | fotograma total (ms) | p95 (ms) | por ronda (ms) | razón vs 0.2.2 (total / captura sola) | reintentos | no asentadas |'
)
console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|')
for (const f of filas) {
  const b = filas.find((x) => x.id === base(f.id))!
  console.log(
    `| ${f.id} | ${f.zonas} | ${f.lineas} | ${f.fps} | ${f.fotogramas} | ${f.pintar.toFixed(1)} | ${f.captura1.toFixed(1)} | ${f.captura.toFixed(1)} | ${f.fotograma.toFixed(1)} | ${f.p95.toFixed(1)} | ${f.porRonda} | ${(f.fotograma / b.fotograma).toFixed(2)} / ${(f.captura1 / b.captura1).toFixed(2)} | ${f.reintentos} | ${f.noAsentadas} |`
  )
}
