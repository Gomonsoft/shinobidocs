/** Escenarios de la medición del criterio 2 (letras inventadas; ninguna canción real). */
import { estiloPredeterminado } from '@shared/estilo'
import type { Estilo } from '@shared/estilo'
import type { ElementoLetra, Letra } from '@shared/letra'
import { letraInventada, DURACION_MS as DURACION_INVENTADA } from '../datos/letraInventada'

export interface Escenario {
  id: string
  descripcion: string
  porParte: boolean
  fps: 30 | 60
  letra: Letra
  estilo: Estilo
  duracionMs: number
  /** Instante (ms) del primer fotograma medido y cuántos segundos se miden. */
  desdeMs: number
  segundos: number
}

const FRASES = [
  'La luna se asoma despacio',
  'por encima del tejado viejo',
  'y las luciérnagas bailan',
  'sin prisa y sin destino',
  'cuando el viento se acuesta',
  'cantamos bajito, bajito',
  'hasta que amanezca el río'
]

const PARTES_ORDEN = ['c1', 'c2', 'c3', 'c4'] as const

function lineas(partes: readonly string[], segundos: number, desfase: number): ElementoLetra[] {
  const filas: { inicio: number; parte: string; k: number }[] = []
  partes.forEach((parte, p) => {
    for (let k = 0; k * 4000 + 2000 < segundos * 1000; k++) {
      filas.push({ inicio: 2000 + k * 4000 + p * desfase, parte, k })
    }
  })
  filas.sort((a, b) => a.inicio - b.inicio || a.parte.localeCompare(b.parte))
  let previo = -1
  return filas.map((f, i) => {
    const inicio = f.inicio <= previo ? previo + 1 : f.inicio
    previo = inicio
    return {
      id: `s${i}`,
      tipo: 'linea',
      texto: FRASES[(f.k + i) % FRASES.length]!,
      inicio_ms: inicio,
      fin_ms: inicio + 3950,
      palabras: null,
      ...(f.parte === 'c1' ? {} : { parte: f.parte as ElementoLetra['parte'] })
    }
  })
}

function letraDe(nCantantes: number, coro: boolean, segundos: number): Letra {
  const cantantes = PARTES_ORDEN.slice(0, nCantantes)
  const partes = [...cantantes, ...(coro ? ['coro'] : [])]
  return {
    origen: 'manual',
    lrclib_id: null,
    offset_ms: 0,
    lineas: lineas(partes, segundos, 300),
    partes: { cantantes: cantantes.map((id) => ({ id, nombre: null })), voz_en_coros: 0.5 }
  } as Letra
}

function secuencial(segundos: number): Letra {
  // 0.2.2: una sola voz, sin solapes (cada línea dura 3,95 s y la siguiente empieza 4 s después).
  return {
    origen: 'manual',
    lrclib_id: null,
    offset_ms: 0,
    lineas: lineas(['c1'], segundos, 0)
  } as Letra
}

function estilo(lineasPantalla: number, pasadas: number): Estilo {
  const e = estiloPredeterminado()
  e.pantalla = { ...e.pantalla, lineas: lineasPantalla, pasadas }
  return e
}

const SEG = 40
export const ESCENARIOS: Record<string, Escenario> = {
  base: {
    id: 'base',
    descripcion: '0.2.2: 1 bloque, 5 líneas (2 ya cantadas… 1 + activa + 3), 30 FPS',
    porParte: false,
    fps: 30,
    letra: secuencial(SEG),
    estilo: estilo(5, 1),
    duracionMs: SEG * 1000,
    desdeMs: 10_000,
    segundos: 10
  },
  z3: {
    id: 'z3',
    descripcion: '3 zonas (coro, c1, c2), una línea activa en cada una, 30 FPS',
    porParte: true,
    fps: 30,
    letra: letraDe(2, true, SEG),
    estilo: estilo(2, 0),
    duracionMs: SEG * 1000,
    desdeMs: 10_000,
    segundos: 10
  },
  z4_30: {
    id: 'z4_30',
    descripcion: '4 zonas (c1, c2, c3, coro), 30 FPS',
    porParte: true,
    fps: 30,
    letra: letraDe(3, true, SEG),
    estilo: estilo(2, 0),
    duracionMs: SEG * 1000,
    desdeMs: 10_000,
    segundos: 10
  },
  z4_60: {
    id: 'z4_60',
    descripcion: '4 zonas (c1, c2, c3, coro), 60 FPS',
    porParte: true,
    fps: 60,
    letra: letraDe(3, true, SEG),
    estilo: estilo(2, 0),
    duracionMs: SEG * 1000,
    desdeMs: 10_000,
    segundos: 10
  },
  base_60: {
    id: 'base_60',
    descripcion: '0.2.2: 1 bloque, 5 líneas, 60 FPS',
    porParte: false,
    fps: 60,
    letra: secuencial(SEG),
    estilo: estilo(5, 1),
    duracionMs: SEG * 1000,
    desdeMs: 10_000,
    segundos: 10
  },
  z5: {
    id: 'z5',
    descripcion: '5 zonas (c1…c4 + coro, el máximo del ADR), 30 FPS',
    porParte: true,
    fps: 30,
    letra: letraDe(4, true, SEG),
    estilo: estilo(2, 0),
    duracionMs: SEG * 1000,
    desdeMs: 10_000,
    segundos: 10
  },
  inventada: {
    id: 'inventada',
    descripcion: 'La letra inventada de la prueba (c1, c2, coro, todos), 3 zonas, 30 FPS',
    porParte: true,
    fps: 30,
    letra: letraInventada(),
    estilo: estilo(2, 0),
    duracionMs: DURACION_INVENTADA,
    desdeMs: 5_000,
    segundos: 45
  }
}
