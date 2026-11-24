/**
 * Criterio 2, parte del modelo (la parte de tiempos de captura la mide `rendimiento/medir.cjs`): con zonas por
 * parte, cada una es una subsecuencia y el `fotogramaEn` real da una línea activa por zona a la vez.
 */
import { describe, expect, it } from 'vitest'
import { fotogramaEn } from '@app/renderer/src/karaoke/render'
import { PANTALLA_PREDETERMINADA } from '@shared/pantalla'
import { ajustes, zonasDeLetra } from '../rendimiento/zonasPrototipo'
import { DURACION_MS, letraInventada, letraRecortada } from '../datos/letraInventada'

const ctx = {
  duracionMs: DURACION_MS,
  titulo: 'Inventada',
  artista: 'Nadie',
  pantalla: { ...PANTALLA_PREDETERMINADA, lineas: 2, pasadas: 0 },
  movimiento: 'completo' as const
}
const letra = letraInventada()

function activas(t: number): Record<string, string | null> {
  ajustes.porParte = true
  const r: Record<string, string | null> = {}
  for (const z of zonasDeLetra(letra)) {
    r[z.id] = fotogramaEn({ lineas: z.lineas }, t, ctx).actual?.id ?? null
  }
  return r
}

describe('2.1 · las tres referencias, una línea activa por zona a la vez', () => {
  it('A · dúo en dos bloques: c1 y c2 avanzan juntas', () => {
    expect(activas(7000)).toMatchObject({ c1: 'l01', c2: 'l02', coro: null })
    expect(activas(12000)).toMatchObject({ c1: 'l03', c2: 'l04' })
  })
  it('B · la misma frase por dos: ambas zonas con el mismo texto; «Todos» repetido en las dos', () => {
    const a = activas(18000)
    expect(a).toMatchObject({ c1: 'l05', c2: 'l06' })
    expect(activas(23000)).toMatchObject({ c1: 'l07', c2: 'l07' })
  })
  it('C · coro mientras canta la principal', () => {
    expect(activas(32000)).toMatchObject({ c1: 'l08', coro: 'l09' })
    expect(activas(39000)).toMatchObject({ c1: 'l10', coro: 'l11' })
    expect(activas(41200)).toMatchObject({ c1: 'l12', coro: 'l11' })
  })
  it('máximo de zonas activas a la vez en toda la canción', () => {
    let max = 0
    for (let t = 0; t < DURACION_MS; t += 10) {
      max = Math.max(max, Object.values(activas(t)).filter(Boolean).length)
    }
    console.log(`[2.1] máximo de zonas activas a la vez en la letra inventada: ${max}`)
    expect(max).toBe(2)
  })
})

describe('2.2 · cada zona conserva «nunca dos cambios a la vez»', () => {
  it('si una línea se mueve, hay un único cambio en curso en esa zona (muestreo cada 10 ms)', () => {
    ajustes.porParte = true
    for (const z of zonasDeLetra(letra)) {
      for (let t = 0; t < DURACION_MS; t += 10) {
        const f = fotogramaEn({ lineas: z.lineas }, t, ctx)
        const mueve = f.lineas.some((l) => l.desde !== l.hacia)
        if (mueve) expect(f.cambio).not.toBeNull()
      }
    }
  })
})

describe('2.3 · sin reparto, el modelo es el de 0.2.2', () => {
  it('con zonas por parte pero una sola parte, la zona única da el mismo fotograma que la letra entera', () => {
    ajustes.porParte = true
    const sola = letraRecortada({
      ...letra,
      lineas: letra.lineas.map(({ parte: _p, ...e }) => e),
      partes: undefined
    })
    const [zona] = zonasDeLetra(sola)
    for (let t = 0; t < DURACION_MS; t += 250) {
      expect(fotogramaEn({ lineas: zona!.lineas }, t, ctx)).toEqual(
        fotogramaEn({ lineas: sola.lineas }, t, ctx)
      )
    }
  })
})

describe('2.4 · hallazgo para 0364 y 0360: el fin AUTOMÁTICO de una zona no puede salir de su subsecuencia', () => {
  it('con el fin sin resolver, la línea de c1 se alarga hasta la siguiente de c1 (otra voz ya ha entrado en medio)', () => {
    const lineas = [
      { id: 'a1', tipo: 'linea', texto: 'uno', inicio_ms: 1000, fin_ms: null, palabras: null },
      {
        id: 'b1',
        tipo: 'linea',
        texto: 'dos',
        inicio_ms: 3000,
        fin_ms: null,
        palabras: null,
        parte: 'c2'
      },
      { id: 'a2', tipo: 'linea', texto: 'tres', inicio_ms: 7000, fin_ms: null, palabras: null }
    ] as const
    const global = (t: number) =>
      fotogramaEn({ lineas: lineas as never }, t, ctx).actual?.id ?? null
    const zonaC1Cruda = (t: number) =>
      fotogramaEn({ lineas: [lineas[0], lineas[2]] as never }, t, ctx).actual?.id ?? null
    // Globalmente a1 acaba en 3000 (inicio de b1); en la subsecuencia de c1 sin resolver sigue activa hasta 7000.
    expect(global(5000)).toBe('b1')
    expect(zonaC1Cruda(5000)).toBe('a1')
    // Con el fin resuelto en la letra entera (lo que hace `zonasPrototipo`), coincide con el global.
    ajustes.porParte = true
    const z = zonasDeLetra({
      lineas: lineas as never,
      partes: {
        cantantes: [
          { id: 'c1', nombre: null },
          { id: 'c2', nombre: null }
        ],
        voz_en_coros: 0.5
      }
    } as never).find((x) => x.id === 'c1')!
    expect(fotogramaEn({ lineas: z.lineas }, 5000, ctx).actual).toBeNull()
  })
})
