/**
 * Corre las pruebas EXISTENTES de `app/` con la regla de fin por parte aplicada en memoria
 * (parche/reglaFinPorParte.mts). Desde `app/`:
 *   npx vitest run --config ../docs/spikes/0029-voces-a-la-vez/vitest.regresion.config.mts <archivos>
 * Con SPIKE_SIN_PARCHE=1 corre las mismas pruebas sin parche (línea base).
 */
import { resolve } from 'node:path'
import react from '../../../app/node_modules/@vitejs/plugin-react/dist/index.js'
import { reglaFinPorParte } from './parche/reglaFinPorParte.mts'

/** `SPIKE_APP` apunta a otra copia de `app/` (p. ej. una instantánea de `git archive`); por defecto, la del árbol. */
const app = process.env.SPIKE_APP ?? resolve(import.meta.dirname, '../../../app')
const parche = process.env.SPIKE_SIN_PARCHE === '1' ? [] : [reglaFinPorParte()]
const comun = {
  root: app,
  plugins: [...parche, react()],
  resolve: { alias: { '@shared': resolve(app, 'src/shared') } }
}

export default {
  test: {
    root: app,
    projects: [
      {
        ...comun,
        test: {
          name: 'node',
          root: app,
          globals: true,
          environment: 'node',
          include: ['src/shared/**/*.test.ts', 'src/main/**/*.test.ts']
        }
      },
      {
        ...comun,
        test: {
          name: 'renderer',
          root: app,
          globals: true,
          environment: 'jsdom',
          include: ['src/renderer/**/*.test.{ts,tsx}'],
          setupFiles: [resolve(app, 'tests/setup.ts')],
          testTimeout: 15_000
        }
      }
    ]
  }
}
