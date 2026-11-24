/**
 * Criterio 1 (ADR 0029 §7): la regla «inicios crecientes en toda la letra + fin por parte» representa los
 * tres patrones de las referencias sin adelantar inicios más de 1 ms, y con letras sin solapes no cambia
 * ningún resultado (comparado con el código original cargado con `?sin-parche`).
 */
import { describe, expect, it } from 'vitest'
import * as nueva from '@shared/letra'
// @ts-expect-error la consulta `?sin-parche` carga el módulo original sin la regla nueva
import * as original from '@shared/letra?sin-parche'
import { letraSchema } from '@shared/letra'
import { writeFileSync } from 'node:fs'
import { normalizarLetra } from '@shared/letras/normalizar'
import { ajustarFin, fijarFin } from '@shared/letras/tiempos'
import { limitesEditorDe } from '@shared/letras/palabras'
import {
  DURACION_MS,
  FILAS,
  elementosInventados,
  iniciosCrecientes,
  letraInventada
} from '../datos/letraInventada'

const D = DURACION_MS

describe('1.1 · los tres patrones con la regla nueva', () => {
  const letra = letraInventada()

  it('es válida con la regla nueva y no con la de 0.2.2 (hay solapes explícitos)', () => {
    expect(nueva.validarInvariantesLetra(letra.lineas)).toEqual([])
    const viejos = original.validarInvariantesLetra(letra.lineas)
    // l01/l02, l03/l04, l05/l06, l08/l09, l10/l11 y l11/l12 se pisan: 6 fines + 1 de palabras (l01 y l02)
    expect(viejos.length).toBeGreaterThanOrEqual(6)
    console.log(
      `[1.1] validarInvariantes 0.2.2 sobre la letra con solapes: ${viejos.length} problemas`
    )
    // ¡Importante! `letraSchema` valida los invariantes AL LEER (superRefine): 0.2.2 rechaza la letra entera.
    expect(letraSchema.safeParse(letra).success).toBe(true)
    expect(original.letraSchema.safeParse(letra).success).toBe(false)
  })

  it('ningún inicio se adelanta más de 1 ms respecto al que pide la canción', () => {
    const inicios = iniciosCrecientes(FILAS)
    const desvios = FILAS.map((f, i) => inicios[i]! - f.ideal)
    expect(Math.max(...desvios)).toBeLessThanOrEqual(1)
    expect(desvios.filter((d) => d > 0)).toHaveLength(1) // solo l06 (la misma frase a la vez que l05)
    // Orden de la letra = orden de inicio.
    const orden = letra.lineas.filter((e) => e.inicio_ms !== null).map((e) => e.inicio_ms!)
    expect(orden).toEqual([...orden].sort((a, b) => a - b))
  })

  it('«Todos» choca con los cantantes (no se solapa con ellos) pero no con el coro', () => {
    const base = elementosInventados()
    const l = (id: string) => base.find((e) => e.id === id)!
    expect(nueva.chocan(l('l07'), l('l05'))).toBe(true) // todos vs c1
    expect(nueva.chocan(l('l07'), l('l06'))).toBe(true) // todos vs c2
    expect(nueva.chocan(l('l07'), l('l09'))).toBe(false) // todos vs coro
    expect(nueva.chocan(l('l01'), l('l02'))).toBe(false) // c1 vs c2
    expect(nueva.chocan(l('l08'), l('l09'))).toBe(false) // c1 vs coro
    expect(nueva.chocan(l('l09'), l('l11'))).toBe(true) // coro vs coro
  })

  it('un «Todos» no puede pasar del inicio de un cantante (la regla lo rechaza)', () => {
    const lineas = elementosInventados().map((e) => (e.id === 'l07' ? { ...e, fin_ms: 30_500 } : e))
    // l07 (todos) hasta 30 500 pisa l08 (c1, inicio 30 000), pero hay una pausa antes (27 000)… y l08 choca.
    const problemas = nueva.validarInvariantesLetra(lineas)
    expect(problemas.some((p) => p.includes('después del inicio de la siguiente'))).toBe(true)
  })

  it('la pausa actúa de barrera: nadie pasa de ella', () => {
    const lineas = elementosInventados().map((e) => (e.id === 'l04' ? { ...e, fin_ms: 16_500 } : e))
    expect(nueva.validarInvariantesLetra(lineas).length).toBeGreaterThan(0)
  })

  it('el fin AUTOMÁTICO sigue siendo «hasta la siguiente línea de cualquier parte»', () => {
    // Si el automático fuese «hasta la siguiente de su parte», un dúo alterno solaparía solo; no es lo que se quiere.
    const lineas = elementosInventados().map((e) =>
      e.id === 'l01' || e.id === 'l02' ? { ...e, fin_ms: null, palabras: null } : e
    )
    const l = { lineas }
    expect(nueva.finEfectivo(l, 'l01', D)).toBe(6500) // hasta el inicio de l02 (otra parte)
    expect(nueva.finEfectivo(l, 'l02', D)).toBe(10800)
  })

  it('el editor preciso deja alargar la línea hasta el inicio de la siguiente de SU parte', () => {
    expect(nueva.finEfectivo(letra, 'l01', D)).toBe(10000)
    const { finMax } = limitesEditorDe(letra, 'l01', D)
    expect(finMax).toBe(10800) // l03 (misma parte); l02 (c2) empieza en 6500 y no limita
  })

  it('las palabras de una línea pueden pasar del inicio de otra parte (y no de la suya)', () => {
    const l01 = letra.lineas.find((e) => e.id === 'l01')!
    expect(l01.palabras!.at(-1)!.fin_ms).toBe(10000) // l02 empieza en 6500
    expect(nueva.finEfectivo(letra, 'l01', D)).toBe(10000)
  })
})

describe('1.2 · el coste del orden de lectura (texto distinto del orden de inicio)', () => {
  it('si el texto pone el coro ANTES de la línea a la que acompaña, hay que adelantarlo (o reordenar el texto)', () => {
    const filas = [...FILAS]
    const i8 = filas.findIndex((f) => f.id === 'l08')
    const i9 = filas.findIndex((f) => f.id === 'l09')
    ;[filas[i8], filas[i9]] = [filas[i9]!, filas[i8]!]
    const inicios = iniciosCrecientes(filas)
    // l09 (coro, 31 500) escrito antes que l08 (c1, 30 000): l08 tendría que empezar ≥ 31 501.
    const desvio = inicios[i9]! - filas[i9]!.ideal
    console.log(`[1.2] coro escrito antes de la principal: l08 se retrasa ${desvio} ms`)
    expect(desvio).toBe(1501)
  })
})

/* ---------- 1.3 · sin solapes, nada cambia (propiedad con letras aleatorias, semilla fija) ---------- */

function azar(semilla: number) {
  let s = semilla >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
const PARTES = [undefined, 'c2', 'c3', 'todos', 'coro'] as const

function letraSinSolapes(r: () => number, conPartes: boolean) {
  const n = 4 + Math.floor(r() * 10)
  const lineas: nueva.ElementoLetra[] = []
  let t = 1000 + Math.floor(r() * 2000)
  for (let i = 0; i < n; i++) {
    const hueco = 300 + Math.floor(r() * 9000)
    const inicio = t
    const siguiente = inicio + hueco
    const modo = r()
    // Un fin fijado siempre ≤ siguiente inicio de CUALQUIER parte: es una letra sin solapes.
    const fin = modo < 0.5 ? null : inicio + 1 + Math.floor(r() * (hueco - 1))
    const texto = `palabra${i} otra${i} tercera${i}`
    const conPalabras = fin !== null && fin - inicio >= 90 && r() < 0.4
    const parte = conPartes ? PARTES[Math.floor(r() * PARTES.length)] : undefined
    lineas.push({
      id: `r${i}`,
      tipo: 'linea',
      texto,
      inicio_ms: inicio,
      fin_ms: fin,
      palabras: conPalabras
        ? [0, 1, 2].map((k) => ({
            texto: texto.split(' ')[k]!,
            inicio_ms: inicio + Math.floor(((fin! - inicio) * k) / 3),
            fin_ms: inicio + Math.floor(((fin! - inicio) * (k + 1)) / 3)
          }))
        : null,
      ...(conPalabras ? { origen_palabras: 'manual' as const } : {}),
      ...(parte ? { parte } : {})
    })
    t = siguiente
  }
  return { lineas }
}

describe('1.3 · con letras sin solapes la regla nueva da lo mismo que la de 0.2.2', () => {
  it('validarInvariantes, finEfectivo, moverInicio, ajustarFin/fijarFin y normalizarLetra (2 000 letras)', () => {
    const r = azar(20261123)
    let letras = 0
    let comparaciones = 0
    const instantanea: unknown[] = []
    for (let k = 0; k < 2000; k++) {
      const conPartes = k % 2 === 1
      const letra = letraSinSolapes(r, conPartes)
      letras++
      expect(nueva.validarInvariantesLetra(letra.lineas)).toEqual(
        original.validarInvariantesLetra(letra.lineas)
      )
      comparaciones++
      for (const e of letra.lineas) {
        expect(nueva.finEfectivo(letra, e.id, D)).toBe(original.finEfectivo(letra, e.id, D))
        comparaciones++
      }
      const id = letra.lineas[Math.floor(r() * letra.lineas.length)]!.id
      const lleno = { origen: 'manual', lrclib_id: null, offset_ms: 0, ...letra } as nueva.Letra
      const antes = lleno.lineas.find((e) => e.id === id)!.inicio_ms!
      const nuevoInicio = antes + 1 + Math.floor(r() * 50)
      let a: unknown
      let b: unknown
      try {
        a = nueva.moverInicioLinea(lleno, id, nuevoInicio)
      } catch (e) {
        a = String(e)
      }
      try {
        b = original.moverInicioLinea(lleno, id, nuevoInicio)
      } catch (e) {
        b = String(e)
      }
      expect(a).toEqual(b)
      const delta = Math.floor(r() * 600) - 300
      const ident = () => 'x'
      instantanea.push(
        { conPartes, op: 'ajustarFin', r: ajustarFin(lleno, id, delta, D) },
        { conPartes, op: 'fijarFin', r: fijarFin(lleno, id, antes + 777, D) },
        { conPartes, op: 'normalizar', r: normalizarLetra(letra.lineas, ident) },
        { conPartes, op: 'limitesEditorDe', r: limitesEditorDe(lleno, id, D) }
      )
      comparaciones += 5
    }
    // `tiempos` y `normalizar` importan `../letra`: su versión original solo existe sin el plugin. Se guardan
    // los resultados y `comparar.mts` los cruza entre una pasada con parche y otra sin él.
    if (process.env.SPIKE_SALIDA)
      writeFileSync(process.env.SPIKE_SALIDA, JSON.stringify(instantanea))
    console.log(
      `[1.3] ${letras} letras sin solapes, ${comparaciones} comparaciones: ningún resultado cambia`
    )
  })
})
