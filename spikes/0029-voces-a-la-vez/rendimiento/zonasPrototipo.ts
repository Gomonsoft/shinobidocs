/**
 * Prototipo de `zonasDeLetra` con zonas por parte (ADR 0029 §4 bis). Sustituye a `karaoke/zonas.ts` SOLO en
 * el paquete de prueba (plugin en `construir.mts`); no toca `app/`. Cada zona recibe una subsecuencia de la
 * letra con el fin ya resuelto (así el fin automático no depende de qué líneas haya en la zona).
 */
import type { ElementoLetra, Letra } from '@shared/letra'

export interface ZonaLetra {
  id: string
  lineas: Letra['lineas']
  region: { y0: number; alto: number }
}
export const ZONA_PANTALLA_ENTERA = 'todas'

/** Ajuste de la prueba: `null` = una sola zona como en 0.2.2; si no, zonas por parte. */
export const ajustes: { porParte: boolean } = { porParte: false }

const AREA = { y0: 0.12, alto: 0.74 }
const SEPARACION = 0.012

export function zonasDeLetra(
  letra: Pick<Letra, 'lineas'> & Partial<Pick<Letra, 'partes'>>
): ZonaLetra[] {
  if (!ajustes.porParte) {
    return [{ id: ZONA_PANTALLA_ENTERA, lineas: letra.lineas, region: { y0: 0, alto: 1 } }]
  }
  const cantantes = (letra.partes?.cantantes ?? [{ id: 'c1' }]).map((c) => c.id as string)
  const hayCoro = letra.lineas.some((l) => l.parte === 'coro')
  const zonas: { id: string; unidades: number; admite: (l: ElementoLetra) => boolean }[] = []
  if (hayCoro) zonas.push({ id: 'coro', unidades: 0.5, admite: (l) => l.parte === 'coro' })
  for (const c of cantantes) {
    zonas.push({
      id: c,
      unidades: 1,
      // «Todos» se dibuja repetido en la zona de cada cantante.
      admite: (l) => (l.parte ?? 'c1') === c || l.parte === 'todos'
    })
  }
  const total = zonas.reduce((s, z) => s + z.unidades, 0)
  const libre = AREA.alto - SEPARACION * (zonas.length - 1)
  let y = AREA.y0
  return zonas.map((z) => {
    const alto = (z.unidades / total) * libre
    const region = { y0: y, alto }
    y += alto + SEPARACION
    // Fin resuelto en la zona: lo fijado o, si no, el inicio de la siguiente línea de CUALQUIER parte.
    const lineas = letra.lineas
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => l.tipo === 'linea' && z.admite(l))
      .map(({ l, i }) => {
        if (l.fin_ms !== null) return l
        const sig = letra.lineas.slice(i + 1).find((x) => x.inicio_ms !== null)
        return sig ? { ...l, fin_ms: sig.inicio_ms } : l
      })
    return { id: z.id, lineas, region }
  })
}
