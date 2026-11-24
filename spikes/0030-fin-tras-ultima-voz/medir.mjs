// Entrada de la medida de la propuesta 043 (solo lectura). Reutiliza el hook de resolución de app/scripts.
import { register } from 'node:module'

register('../../../app/scripts/resolver-ts.mjs', import.meta.url)
await import('./medir.ts')
