/**
 * Compila la página de medición (NO es `npm run build`): usa el Vite de `app/` y escribe fuera del repositorio.
 *   node --experimental-strip-types construir.mts <directorio-de-salida>
 * La única diferencia con el renderer real: `karaoke/zonas.ts` se sustituye por `zonasPrototipo.ts`.
 */
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const aqui = import.meta.dirname
const app = process.env.SPIKE_APP ?? resolve(aqui, '../../../../app')
const salida = resolve(process.argv[2] ?? 'dist-medicion')
const requerir = createRequire(resolve(app, 'package.json'))
const { build } = await import(pathToFileURL(requerir.resolve('vite')).href)
const react = (await import(pathToFileURL(requerir.resolve('@vitejs/plugin-react')).href)).default

const prototipoZonas = resolve(aqui, 'zonasPrototipo.ts')
const sustituirZonas = {
  name: 'spike-0029-zonas',
  enforce: 'pre',
  resolveId(origen: string, importador?: string) {
    if (importador?.endsWith('karaoke/PantallaLetra.tsx') && origen === './zonas')
      return prototipoZonas
    return null
  }
}

await build({
  root: aqui,
  configFile: false,
  logLevel: 'warn',
  base: './',
  // SPIKE_ZONAS_REALES=1: no se sustituye `zonas.ts` (mide la implementación real de 0364 si ya existe en `app/`).
  plugins: [...(process.env.SPIKE_ZONAS_REALES === '1' ? [] : [sustituirZonas]), react()],
  resolve: {
    alias: [
      { find: '@shared', replacement: resolve(app, 'src/shared') },
      { find: '@app', replacement: resolve(app, 'src') },
      { find: /^react-dom(\/.*)?$/, replacement: resolve(app, 'node_modules/react-dom') + '$1' },
      { find: /^react(\/.*)?$/, replacement: resolve(app, 'node_modules/react') + '$1' }
    ]
  },
  build: { outDir: salida, emptyOutDir: true, assetsInlineLimit: 0 }
})
console.log(`Paquete de medición en ${salida}`)
