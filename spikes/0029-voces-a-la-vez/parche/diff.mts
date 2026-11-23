/**
 * Escribe en un directorio temporal los archivos parcheados y muestra el diff contra los originales:
 * es la medida del tamaño del cambio de la regla. Uso (desde la raíz del repo):
 *   node --experimental-strip-types docs/spikes/0029-voces-a-la-vez/parche/diff.mts <dir-salida>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { PARCHES } from './reglaFinPorParte.mts'

const salida = resolve(process.argv[2] ?? '.')
const app = resolve(import.meta.dirname, '../../../../app')
let anadidas = 0
let quitadas = 0
for (const p of PARCHES) {
  const original = readFileSync(join(app, p.archivo), 'utf8')
  let nuevo = original
  for (const c of p.cambios) {
    if (nuevo.split(c.buscar).length !== 2) throw new Error(`No casa: ${c.etiqueta}`)
    nuevo = nuevo.split(c.buscar).join(c.poner)
  }
  const destino = join(salida, p.archivo)
  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, nuevo)
  let texto = ''
  try {
    execFileSync('diff', ['-u', join(app, p.archivo), destino], { encoding: 'utf8' })
  } catch (e) {
    texto = (e as { stdout: string }).stdout
  }
  const lineas = texto.split('\n')
  const a = lineas.filter((l) => l.startsWith('+') && !l.startsWith('+++')).length
  const q = lineas.filter((l) => l.startsWith('-') && !l.startsWith('---')).length
  anadidas += a
  quitadas += q
  console.log(`${p.archivo}: +${a} −${q}`)
}
console.log(`TOTAL: ${PARCHES.length} archivos, +${anadidas} −${quitadas} líneas`)
