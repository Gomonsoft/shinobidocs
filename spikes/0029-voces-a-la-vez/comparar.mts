// Cruza dos instantáneas (con y sin parche) de la prueba 1.3: node comparar.mts con.json sin.json
import { readFileSync } from 'node:fs'
type El = { inicio_ms: number | null; fin_ms: number | null }
type Fila = { conPartes: boolean; op: string; r: { letra?: { lineas: El[] } } & unknown }
/** ¿La diferencia es exactamente «el fin ahora llega más allá del inicio de la siguiente línea de otra parte»? */
function esLaNuevaLibertad(nuevo: Fila, viejo: Fila): boolean {
  const n = nuevo.r.letra?.lineas
  const v = viejo.r.letra?.lineas
  if (!n || !v) return false
  const cambiadas = n.map((e, i) => i).filter((i) => n[i]!.fin_ms !== v[i]!.fin_ms)
  return (
    cambiadas.length > 0 &&
    cambiadas.every((i) => {
      const sig = n.slice(i + 1).find((e) => e.inicio_ms !== null)
      return n[i]!.fin_ms !== null && sig?.inicio_ms != null && n[i]!.fin_ms! > sig.inicio_ms
    })
  )
}
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f!, 'utf8')) as Fila[])
const grupos = new Map<string, { total: number; distintos: number; libertad: number }>()
const otras: string[] = []
a!.forEach((x, i) => {
  const clave = `${x.conPartes ? 'con partes' : 'sin partes'} · ${x.op}`
  const g = grupos.get(clave) ?? { total: 0, distintos: 0, libertad: 0 }
  g.total++
  if (JSON.stringify(x.r) !== JSON.stringify(b![i]!.r)) {
    g.distintos++
    if (esLaNuevaLibertad(x, b![i]!)) g.libertad++
    else otras.push(clave)
  }
  grupos.set(clave, g)
})
for (const [k, g] of [...grupos].sort())
  console.log(
    `${k}: ${g.total} comparados, ${g.distintos} distintos (${g.libertad} son «el fin pasa del inicio de otra parte»)`
  )
const sinPartesDistintos = [...grupos]
  .filter(([k]) => k.startsWith('sin partes'))
  .reduce((n, [, g]) => n + g.distintos, 0)
process.exit(sinPartesDistintos === 0 ? 0 : 1)
console.log(`diferencias que NO son la nueva libertad: ${otras.length}`)
