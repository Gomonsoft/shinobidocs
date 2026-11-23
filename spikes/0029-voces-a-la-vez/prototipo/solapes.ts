/**
 * Prototipo (desechable) de lo que 0357–0360 tendrían que escribir: una sola vista de «qué líneas
 * se pisan» y tres adaptadores finos para que las funciones de 0.2.2 sigan funcionando sin cambiar
 * su código (excluir, fusionar o recortar según la función).
 */
import { finEfectivo, type ElementoLetra, type Letra } from '@shared/letra'
import {
  proponerAjusteSilencios,
  type OpcionesAjuste,
  type PropuestaSilencios
} from '@shared/silencios'
import { detectarDudosas, type LineaDudosa, type OpcionesDudosas } from '@shared/dudosas'
import type { VozDetectada } from '@shared/silencios'

export interface Tramo {
  id: string
  a: number
  b: number
}

/** Tramos [inicio, fin efectivo) de las líneas con inicio, en el orden de la letra. */
export function tramosDeLetra(letra: Pick<Letra, 'lineas'>, duracionMs: number): Tramo[] {
  const salida: Tramo[] = []
  for (const e of letra.lineas) {
    if (e.tipo !== 'linea' || e.inicio_ms === null) continue
    const b = finEfectivo(letra, e.id, duracionMs)
    if (b !== null) salida.push({ id: e.id, a: e.inicio_ms, b: Math.max(b, e.inicio_ms + 1) })
  }
  return salida
}

/** Grupos de líneas encadenadas por solape (barrido por inicio; tocarse no es solaparse). */
export function gruposSolapados(tramos: readonly Tramo[]): Tramo[][] {
  const grupos: Tramo[][] = []
  let fin = -Infinity
  for (const t of [...tramos].sort((x, y) => x.a - y.a)) {
    if (grupos.length > 0 && t.a < fin) {
      grupos.at(-1)!.push(t)
      fin = Math.max(fin, t.b)
    } else {
      grupos.push([t])
      fin = t.b
    }
  }
  return grupos
}

/** Ids de las líneas que se pisan con alguna otra. */
export function solapadas(letra: Pick<Letra, 'lineas'>, duracionMs: number): Set<string> {
  const ids = new Set<string>()
  for (const g of gruposSolapados(tramosDeLetra(letra, duracionMs))) {
    if (g.length > 1) for (const t of g) ids.add(t.id)
  }
  return ids
}

/** Encaje y alineación miran la voz mezclada: cada grupo solapado es UNA línea (fusión de intervalos). */
export function aplanarSolapes(letra: Letra, duracionMs: number): Letra {
  const porId = new Map(letra.lineas.map((e) => [e.id, e]))
  const lineas: ElementoLetra[] = []
  const grupos = gruposSolapados(tramosDeLetra(letra, duracionMs))
  const enGrupo = new Map<string, Tramo[]>()
  for (const g of grupos) for (const t of g) enGrupo.set(t.id, g)
  const hechos = new Set<Tramo[]>()
  for (const e of letra.lineas) {
    const g = enGrupo.get(e.id)
    if (!g || g.length === 1) {
      lineas.push({ ...e })
      continue
    }
    if (hechos.has(g)) continue
    hechos.add(g)
    const primera = porId.get(g[0]!.id)!
    lineas.push({
      ...primera,
      texto: g.map((t) => porId.get(t.id)!.texto).join(' / '),
      inicio_ms: g[0]!.a,
      fin_ms: Math.max(...g.map((t) => t.b)),
      palabras: null,
      origen_palabras: undefined,
      revisada: undefined,
      alineacion: undefined
    })
  }
  return { ...letra, lineas }
}

/** `.lrc`: solo la línea del grupo que más tarde acaba puede llevar la marca vacía; las demás, recortadas. */
export function vistaParaLrc(letra: Letra, duracionMs: number): Letra {
  const grupos = gruposSolapados(tramosDeLetra(letra, duracionMs)).filter((g) => g.length > 1)
  const ultimaDeGrupo = new Map<string, string>()
  for (const g of grupos) {
    const ultima = g.reduce((m, t) => (t.b > m.b ? t : m))
    for (const t of g) ultimaDeGrupo.set(t.id, ultima.id)
  }
  const lineas = letra.lineas.map((e, i) => {
    const jefe = ultimaDeGrupo.get(e.id)
    if (jefe === undefined || jefe === e.id) return { ...e }
    const sig = letra.lineas.slice(i + 1).find((x) => x.inicio_ms !== null)
    return { ...e, fin_ms: sig?.inicio_ms ?? e.fin_ms }
  })
  return { ...letra, lineas }
}

/** «Ajustar los silencios»: la propuesta real, sin tocar las líneas solapadas. */
export function ajustarSilenciosSinSolapes(
  letra: Letra,
  voz: Pick<VozDetectada, 'intervalos'>,
  opciones: OpcionesAjuste
): PropuestaSilencios & { solapaExcluidas: number } {
  const excluidas = solapadas(letra, opciones.duracionMs)
  const propuesta = proponerAjusteSilencios(letra, voz, opciones)
  const lineas = propuesta.letra.lineas.map((e, i) =>
    excluidas.has(e.id) ? { ...letra.lineas[i]! } : e
  )
  const cambios = propuesta.cambios.filter((c) => !excluidas.has(c.id))
  return {
    ...propuesta,
    letra: { ...propuesta.letra, lineas },
    cambios,
    lineasCambiadas: cambios.length,
    finesFijadosCambiados: cambios.filter((c) => c.eraFijado).length,
    sinVoz: propuesta.sinVoz.filter((id) => !excluidas.has(id)),
    solapaExcluidas: excluidas.size
  }
}

/** Dudosas: las líneas solapadas no se juzgan con la voz mezclada (salvo «sin inicio», que no depende de la voz). */
export function dudosasSinSolapes(
  letra: Pick<Letra, 'lineas' | 'offset_ms'>,
  voz: Pick<VozDetectada, 'intervalos'> | null,
  opciones: OpcionesDudosas
): { dudosas: LineaDudosa[]; solapaExcluidas: number } {
  const excluidas = solapadas(letra, opciones.duracionMs)
  const todas = detectarDudosas(letra, voz, opciones)
  return {
    dudosas: todas.filter((d) => !excluidas.has(d.id) || d.motivos.includes('sinInicio')),
    solapaExcluidas: excluidas.size
  }
}
