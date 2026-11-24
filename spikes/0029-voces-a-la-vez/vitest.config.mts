/**
 * Pruebas propias del spike (criterios 1 a 3). Desde `app/`:
 *   npx vitest run --config ../docs/spikes/0029-voces-a-la-vez/vitest.config.mts
 * Usa la regla parcheada en memoria y el código real de `app/src/shared`.
 */
import { resolve } from 'node:path'
import { reglaFinPorParte } from './parche/reglaFinPorParte.mts'

/** `SPIKE_APP` apunta a otra copia de `app/` (p. ej. una instantánea de `git archive`); por defecto, la del árbol. */
const app = process.env.SPIKE_APP ?? resolve(import.meta.dirname, '../../../app')

export default {
  root: app,
  plugins: process.env.SPIKE_SIN_PARCHE === '1' ? [] : [reglaFinPorParte()],
  resolve: { alias: { '@shared': resolve(app, 'src/shared'), '@app': resolve(app, 'src') } },
  server: { fs: { strict: false } },
  test: {
    root: app,
    globals: true,
    environment: 'node',
    dir: resolve(import.meta.dirname),
    include: ['pruebas/**/*.test.ts']
  }
}
