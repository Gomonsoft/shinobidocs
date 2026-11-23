/**
 * Parche en memoria de la regla de ADR 0029 §7 («inicios crecientes en toda la letra, fin limitado
 * por la siguiente línea que choca con ella»). NO escribe nada en `app/`: es un plugin de Vite que
 * reescribe el texto de unos pocos archivos de `app/src/shared/` al cargarlos en las pruebas del
 * spike. Cada reemplazo tiene que casar exactamente una vez (si 0.2.3 cambia esos archivos, el
 * plugin falla en voz alta en lugar de probar otra cosa).
 *
 * El tamaño real del parche sale de `parche/diff.mts` (diff contra los originales).
 */
import type { Plugin } from 'vite'

type Reemplazo = { buscar: string; poner: string; etiqueta: string }
type ParchesDe = { archivo: string; cambios: Reemplazo[] }

const AYUDAS_CHOCAN = `/**
 * (spike 0029) Dos líneas «chocan» si no pueden solaparse: misma parte, o «todos» con cualquier
 * cantante (c1…c4). El coro solo choca con el coro. Una pausa choca con todo (es una barrera).
 */
export function chocan(a: ElementoLetra, b: ElementoLetra): boolean {
  if (a.tipo === 'pausa' || b.tipo === 'pausa') return true
  const pa = a.parte ?? 'c1'
  const pb = b.parte ?? 'c1'
  if (pa === pb) return true
  if (pa === 'todos') return pb !== 'coro'
  if (pb === 'todos') return pa !== 'coro'
  return false
}

/** Índice del siguiente elemento con inicio que choca con el de \`desde\`, o -1. */
export function siguienteQueChoca(lineas: readonly ElementoLetra[], desde: number): number {
  for (let i = desde + 1; i < lineas.length; i++) {
    if (lineas[i]!.inicio_ms !== null && chocan(lineas[desde]!, lineas[i]!)) return i
  }
  return -1
}

/** Índice del anterior elemento con inicio que choca con el de \`desde\`, o -1. */
export function anteriorQueChoca(lineas: readonly ElementoLetra[], desde: number): number {
  for (let i = desde - 1; i >= 0; i--) {
    if (lineas[i]!.inicio_ms !== null && chocan(lineas[desde]!, lineas[i]!)) return i
  }
  return -1
}

`

export const PARCHES: ParchesDe[] = [
  {
    archivo: '/src/shared/letra.ts',
    cambios: [
      {
        etiqueta: 'ayudas chocan/siguienteQueChoca/anteriorQueChoca (nuevas)',
        buscar: '/** Índice del elemento anterior (previo a `desde`) que tiene inicio, o -1. */\n',
        poner:
          AYUDAS_CHOCAN +
          '/** Índice del elemento anterior (previo a `desde`) que tiene inicio, o -1. */\n'
      },
      {
        etiqueta: 'validarInvariantesLetra: límite del fin y de las palabras = siguiente que choca',
        buscar: '    const sig = siguienteConInicio(lineas, i)\n    const limite =',
        poner: '    const sig = siguienteQueChoca(lineas, i)\n    const limite ='
      },
      {
        etiqueta: 'finEfectivo: palabras visibles limitadas por el siguiente que choca',
        buscar: '  const idxSigInicio = siguienteConInicio(lineas, i)',
        poner: '  const idxSigInicio = siguienteQueChoca(lineas, i)'
      },
      {
        etiqueta: 'moverInicioLinea: vecinos que chocan (fin propio y fin de la anterior)',
        buscar: '  const sig = siguienteConInicio(letra.lineas, i)\n',
        poner:
          '  const sig = siguienteConInicio(letra.lineas, i)\n' +
          '  const antChoca = anteriorQueChoca(letra.lineas, i)\n' +
          '  const sigChoca = siguienteQueChoca(letra.lineas, i)\n' +
          '  const inicioSigChoca = sigChoca === -1 ? null : letra.lineas[sigChoca]!.inicio_ms!\n'
      },
      {
        etiqueta: 'moverInicioLinea: la anterior que choca pierde el fin',
        buscar: '  if (ant !== -1) {\n    const previa = lineas[ant]!',
        poner: '  if (antChoca !== -1) {\n    const previa = lineas[antChoca]!'
      },
      {
        etiqueta: 'moverInicioLinea: descartar palabras de la anterior que choca',
        buscar: 'nuevoInicioMs)) descartar(ant)',
        poner: 'nuevoInicioMs)) descartar(antChoca)'
      },
      {
        etiqueta: 'moverInicioLinea: fin propio contra la siguiente que choca',
        buscar: '(inicioSig !== null && actual.fin_ms > inicioSig)',
        poner: '(inicioSigChoca !== null && actual.fin_ms > inicioSigChoca)'
      }
    ]
  },
  {
    archivo: '/src/shared/letras/tiempos.ts',
    cambios: [
      {
        etiqueta: 'import de chocan',
        buscar: 'import {\n  borrarTiemposLinea,',
        poner: 'import {\n  chocan,\n  borrarTiemposLinea,'
      },
      {
        etiqueta: 'limitarFin: tope = siguiente que choca',
        buscar: 'const max = vecinoConInicio(letra, indice, 1)?.inicio_ms ?? duracionMs',
        poner:
          'const max =\n    letra.lineas.slice(indice + 1).find((e) => e.inicio_ms !== null && chocan(linea, e))\n      ?.inicio_ms ?? duracionMs'
      }
    ]
  },
  {
    archivo: '/src/shared/letras/palabras.ts',
    cambios: [
      {
        etiqueta: 'import de chocan',
        buscar: 'import {\n  DURACION_MINIMA_PALABRA_MS as MIN,',
        poner: 'import {\n  chocan,\n  DURACION_MINIMA_PALABRA_MS as MIN,'
      },
      {
        etiqueta: 'limitesEditorDe: el fin máximo es el inicio de la siguiente que choca',
        buscar:
          '  return { inicioMin: min, inicioMax: max, finMax: max === null ? duracionMs : max + 1 }',
        poner:
          '  const i = letra.lineas.findIndex((e) => e.id === id)\n' +
          '  const sigChoca = letra.lineas.slice(i + 1).find((e) => e.inicio_ms !== null && chocan(letra.lineas[i]!, e))\n' +
          '  return { inicioMin: min, inicioMax: max, finMax: sigChoca ? sigChoca.inicio_ms! : duracionMs }'
      },
      {
        etiqueta: 'limitesEditorDe: siguiente que choca',
        buscar: 'const siguiente = letra.lineas.slice(i + 1).find((e) => e.inicio_ms !== null)',
        poner:
          'const siguiente = letra.lineas.slice(i + 1).find((e) => e.inicio_ms !== null && chocan(el, e))'
      }
    ]
  },
  {
    archivo: '/src/shared/letras/normalizar.ts',
    cambios: [
      {
        etiqueta: 'import de chocan',
        buscar:
          "import { validarInvariantesLetra, type ElementoLetra, type Palabra } from '../letra'",
        poner:
          "import { chocan, validarInvariantesLetra, type ElementoLetra, type Palabra } from '../letra'"
      },
      {
        etiqueta: 'paso 4: límite = siguiente inicio que choca',
        buscar: '      if (t !== null) {\n        limite = t',
        poner: '      if (t !== null && chocan(e, els[k]!)) {\n        limite = t'
      }
    ]
  },
  {
    archivo: '/src/shared/derivados.ts',
    cambios: [
      {
        etiqueta: 'import de chocan',
        buscar:
          "import { contarLineas, finEfectivo, numerosLineasSinInicio, type Letra } from './letra'",
        poner:
          "import { chocan, contarLineas, finEfectivo, numerosLineasSinInicio, type Letra } from './letra'"
      },
      {
        etiqueta: 'lineasConFinNoValido: tope = siguiente que choca',
        buscar:
          'const siguiente = elementos.slice(i + 1).find((e) => e.inicio_ms !== null)\n    const tope',
        poner:
          'const siguiente = elementos.slice(i + 1).find((e) => e.inicio_ms !== null && chocan(el, e))\n    const tope'
      }
    ]
  }
]

export function reglaFinPorParte(): Plugin {
  return {
    name: 'spike-0029-regla-fin-por-parte',
    enforce: 'pre',
    transform(codigo, id) {
      if (id.includes('sin-parche')) return null
      const limpio = id.split('?')[0]!
      const parche = PARCHES.find((p) => limpio.endsWith(p.archivo))
      if (!parche) return null
      let salida = codigo
      for (const c of parche.cambios) {
        const trozos = salida.split(c.buscar)
        if (trozos.length !== 2) {
          throw new Error(
            `Parche del spike 0029: «${c.etiqueta}» casa ${trozos.length - 1} veces en ${parche.archivo} (debe ser 1)`
          )
        }
        salida = trozos.join(c.poner)
      }
      return { code: salida, map: null }
    }
  }
}
