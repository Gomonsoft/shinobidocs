/**
 * Página de la medición: monta el MISMO `AppExportacion` de producción con una API falsa y deja a Electron
 * pedir fotogramas por índice (`__arrancar`, `__fotograma`). Se compila con `construir.mts`.
 */
import { createRoot } from 'react-dom/client'
import { AppExportacion } from '@app/renderer/src/exportacion/AppExportacion'
import { instalarFuentesIncluidas } from '@app/renderer/src/estilos/fuentesIncluidas'
import '@app/renderer/src/estilos/base.css'
import { ajustes } from './zonasPrototipo'
import { ESCENARIOS } from './escenarios'

declare global {
  interface Window {
    __arrancar: (id: string) => Promise<{ fps: number; desdeN: number; total: number }>
    __fotograma: (n: number) => Promise<{ lineas: number; zonas: number }>
    __pedir?: (p: { trabajoId: string; n: number }) => void
  }
}

instalarFuentesIncluidas()
const TRABAJO = 'b0000000-0000-4000-8000-000000000001'

window.__arrancar = async (id) => {
  const e = ESCENARIOS[id]
  if (!e) throw new Error(`Escenario desconocido: ${id}`)
  ajustes.porParte = e.porParte
  let pendiente: (() => void) | null = null
  const api = {
    inicial: () =>
      Promise.resolve({
        trabajoId: TRABAJO,
        ancho: 1920,
        alto: 1080,
        fps: e.fps,
        total: Math.round((e.duracionMs / 1000) * e.fps),
        instantanea: {
          titulo: 'Luciérnagas en el tejado',
          artista: 'Dúo imaginario',
          duracionMs: e.duracionMs,
          letra: e.letra,
          estilo: e.estilo,
          modalidad: 'karaoke',
          gananciaDb: 0,
          vozDisponible: true
        }
      }),
    listo: () => {
      pendiente?.()
      return Promise.resolve()
    },
    alFotograma: (cb: (p: { trabajoId: string; n: number }) => void) => {
      window.__pedir = cb
      return () => undefined
    }
  }
  ;(window as unknown as { shinobiExportacion: unknown }).shinobiExportacion = api
  createRoot(document.getElementById('root')!).render(<AppExportacion api={api as never} />)
  window.__fotograma = (n) =>
    new Promise((resolver) => {
      pendiente = () =>
        resolver({
          lineas: document.querySelectorAll('[data-linea]').length,
          zonas: new Set(
            [...document.querySelectorAll('[data-zona]')].map(
              (x) => (x as HTMLElement).dataset.zona
            )
          ).size
        })
      window.__pedir!({ trabajoId: TRABAJO, n })
    })
  // Espera a que AppExportacion cargue fuentes y se monte.
  await new Promise<void>((resolver) => {
    const t = setInterval(() => {
      if (document.querySelector('[data-marca-agua]')) {
        clearInterval(t)
        resolver()
      }
    }, 20)
  })
  return {
    fps: e.fps,
    desdeN: Math.round((e.desdeMs / 1000) * e.fps),
    total: Math.round(e.segundos * e.fps)
  }
}
