/**
 * Criterio 3 (ADR 0029 §7): las funciones automáticas de 0.2.2 con solapes. La voz separada mezcla a todos los
 * cantantes, así que una función que juzga «línea a línea» con esa voz se equivoca donde hay solape. Se mide
 * cada función real (de `app/src/shared`) con y sin el adaptador del prototipo.
 */
import { describe, expect, it } from 'vitest'
import { finEfectivo } from '@shared/letra'
import { evaluarEncaje } from '@shared/encaje'
import { detectarDudosas, revisadaVigente } from '@shared/dudosas'
import { proponerAjusteSilencios } from '@shared/silencios'
import { exportarLrc, lrcALetra } from '@shared/letras/lrc'
import { ESPERA_LEGADA } from '@shared/espera'
import { DURACION_MS, letraInventada, letraRecortada, vozPerfecta } from '../datos/letraInventada'
import {
  aplanarSolapes,
  ajustarSilenciosSinSolapes,
  dudosasSinSolapes,
  gruposSolapados,
  solapadas,
  tramosDeLetra,
  vistaParaLrc
} from '../prototipo/solapes'

const D = DURACION_MS
const letra = letraInventada()
const fin = (id: string) => finEfectivo(letra, id, D)
const voz = vozPerfecta(letra, fin)

describe('3.0 · qué líneas se pisan', () => {
  it('encuentra los 4 grupos de la letra inventada y ninguna otra', () => {
    const grupos = gruposSolapados(tramosDeLetra(letra, D)).filter((g) => g.length > 1)
    expect(grupos.map((g) => g.map((t) => t.id))).toEqual([
      ['l01', 'l02'],
      ['l03', 'l04'],
      ['l05', 'l06'],
      ['l08', 'l09'],
      ['l10', 'l11', 'l12']
    ])
    expect([...solapadas(letra, D)]).toHaveLength(11)
    // «Todos» (l07, l13) no se solapa con nadie (control).
    expect(solapadas(letra, D).has('l07')).toBe(false)
    expect(solapadas(letra, D).has('l13')).toBe(false)
  })
  it('la misma letra recortada (lo que ve 0.2.2) no tiene solapes', () => {
    expect(solapadas(letraRecortada(letra), D).size).toBe(0)
  })
})

describe('3.1 · Ajustar los silencios', () => {
  const opciones = { duracionMs: D, espera: ESPERA_LEGADA, activarComodin: false }
  it('sin adaptador cambia fines de líneas solapadas con la voz mezclada (falsos positivos)', () => {
    const bruta = proponerAjusteSilencios(letra, voz, opciones)
    const solap = solapadas(letra, D)
    const malas = bruta.cambios.filter((c) => solap.has(c.id))
    console.log(
      `[3.1] crudo: ${bruta.cambios.length} cambios, ${malas.length} sobre líneas solapadas: ${malas.map((c) => `${c.id} ${c.finAntes}→${c.finDespues}`).join(', ')}`
    )
    // l09 (coro) acaba en 33 000 pero la voz mezclada sigue (l08 hasta 35 000): la función alargaría el coro.
    expect(malas.some((c) => c.id === 'l09' && c.finDespues > 33_000)).toBe(true)
  })
  it('con el adaptador no toca ninguna línea solapada y cuenta las excluidas', () => {
    const p = ajustarSilenciosSinSolapes(letra, voz, opciones)
    const solap = solapadas(letra, D)
    expect(p.cambios.filter((c) => solap.has(c.id))).toEqual([])
    for (const id of solap) {
      const antes = letra.lineas.find((e) => e.id === id)!
      expect(p.letra.lineas.find((e) => e.id === id)).toEqual(antes)
    }
    expect(p.solapaExcluidas).toBe(11)
    console.log(
      `[3.1] adaptador: ${p.cambios.length} cambios (${p.cambios.map((c) => c.id).join(', ') || 'ninguno'}), ${p.solapaExcluidas} excluidas`
    )
  })
  it('sobre la letra recortada (sin solapes) el adaptador y la función real dan lo mismo', () => {
    const l = letraRecortada(letra)
    const v = vozPerfecta(l, (id) => finEfectivo(l, id, D))
    expect(JSON.stringify(ajustarSilenciosSinSolapes(l, v, opciones).cambios)).toBe(
      JSON.stringify(proponerAjusteSilencios(l, v, opciones).cambios)
    )
  })
})

describe('3.2 · Encaje (Comprobar la letra)', () => {
  it('voz perfecta: la fusión da «coincide»; el recorte original pierde precisión', () => {
    const plana = aplanarSolapes(letra, D)
    const crudo = evaluarEncaje(letra, voz, { duracionMs: D })
    const fusion = evaluarEncaje(plana, voz, { duracionMs: D })
    console.log(
      `[3.2] crudo: ${crudo.veredicto} F0=${crudo.f0} I0=${crudo.i0} sinVoz=${crudo.lineasSinVoz.length} vozSinLetra=${crudo.tramosVozSinLetra.length}`
    )
    console.log(
      `[3.2] fusión: ${fusion.veredicto} F0=${fusion.f0} I0=${fusion.i0} sinVoz=${fusion.lineasSinVoz.length} vozSinLetra=${fusion.tramosVozSinLetra.length}`
    )
    expect(fusion.f0).toBeGreaterThanOrEqual(crudo.f0)
    expect(fusion.lineasSinVoz).toEqual([])
    expect(fusion.tramosVozSinLetra).toEqual([])
    expect(fusion.desfaseMs).toBe(0)
  })
  it('voz desplazada 700 ms: la fusión propone corregir 700 ms (sin falsos «no coincide»)', () => {
    const plana = aplanarSolapes(letra, D)
    const v = vozPerfecta(letra, fin, 700)
    const fusion = evaluarEncaje(plana, v, { duracionMs: D })
    console.log(`[3.2] voz +700 ms, fusión: ${fusion.veredicto} d=${fusion.desfaseMs}`)
    expect(['desfasada', 'dudosa']).toContain(fusion.veredicto)
    expect(Math.abs(fusion.desfaseMs - 700)).toBeLessThanOrEqual(20)
  })
})

describe('3.3 · Líneas dudosas', () => {
  it('voz perfecta: ninguna dudosa con el adaptador (cero falsos positivos)', () => {
    const crudo = detectarDudosas(letra, voz, { duracionMs: D })
    const adapt = dudosasSinSolapes(letra, voz, { duracionMs: D })
    console.log(
      `[3.3] crudo: ${crudo.length} dudosas (${crudo.map((d) => `${d.id}:${d.motivos}`).join(' ')}) · adaptador: ${adapt.dudosas.length}, excluidas ${adapt.solapaExcluidas}`
    )
    expect(adapt.dudosas).toEqual([])
  })
  it('un fallo real fuera de los solapes (l07 «Todos» sin voz) sigue detectándose', () => {
    const sin = { intervalos: voz.intervalos.filter(([a]) => a !== 22_000) }
    const adapt = dudosasSinSolapes(letra, sin, { duracionMs: D })
    expect(adapt.dudosas.map((d) => d.id)).toContain('l07')
  })
  it('«Está bien» (revisada) sigue vigente mientras no cambia el fin efectivo', () => {
    const l = {
      ...letra,
      lineas: letra.lineas.map((e) =>
        e.id === 'l09'
          ? { ...e, revisada: { inicio_ms: e.inicio_ms!, fin_ms: 33_000, texto: e.texto } }
          : e
      )
    }
    expect(revisadaVigente(l, 'l09', D)).toBe(true)
    // El fin efectivo cambia (otro fin fijado): deja de valer, igual que en 0.2.2.
    const m = { ...l, lineas: l.lineas.map((e) => (e.id === 'l09' ? { ...e, fin_ms: 33_500 } : e)) }
    expect(revisadaVigente(m, 'l09', D)).toBe(false)
  })
})

describe('3.4 · Exportar .lrc', () => {
  const opciones = { titulo: 'Inventada', artista: 'Nadie', duracionMs: D }
  it('crudo: escribe una marca vacía DENTRO de una línea que aún suena (l09 acaba antes que l08)', () => {
    const lrc = exportarLrc(letra, opciones)
    console.log(
      `[3.4] crudo:\n${lrc
        .split('\n')
        .filter((x) => /\[00:(3\d)/.test(x))
        .join('\n')}`
    )
    expect(lrc).toContain('[00:33.00]\n') // marca vacía a los 33 s; l08 canta hasta los 35 s
  })
  it('con la vista del prototipo no hay marca vacía hasta que ninguna línea del grupo suena', () => {
    const lrc = exportarLrc(vistaParaLrc(letra, D), opciones)
    expect(lrc).not.toContain('[00:33.00]\n')
    // y el orden temporal se conserva
    const marcas = lrc
      .split('\n')
      .map((x) => /^\[(\d\d):(\d\d\.\d\d)\]/.exec(x))
      .filter(Boolean)
      .map((m) => Number(m![1]) * 60 + Number(m![2]))
    expect(marcas).toEqual([...marcas].sort((a, b) => a - b))
    // reimportar el .lrc no inventa solapes ni pierde líneas
    expect(lrcALetra(lrc).lineas.filter((e) => e.tipo === 'linea')).toHaveLength(13)
  })
})

describe('3.5 · Alineación (ADR 0028)', () => {
  it('no existe `shared/alineacion.ts` todavía: solo se puede fijar la regla y probar su predicado', () => {
    // Regla propuesta para 0329–0333 / 0358: la alineación forzada no se ejecuta sobre líneas solapadas
    // (la voz es una mezcla) y las deja como están; el resumen dice cuántas excluyó.
    const excluidas = solapadas(letra, D)
    const aAlinear = letra.lineas
      .filter((e) => e.tipo === 'linea' && !excluidas.has(e.id))
      .map((e) => e.id)
    expect(aAlinear).toEqual(['l07', 'l13'])
  })
})
