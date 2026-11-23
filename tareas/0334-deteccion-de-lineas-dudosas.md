# 0334 — Feature 11 · `shared/dudosas.ts`, recuento en main y calibración
- Estado: Hecha (el cableado de `preparacion.dudosas` es de la tarea 0308; pregunta [0225](../preguntas/0225-umbrales-de-las-lineas-dudosas-recuento-y-preferencia-de-la-revision.md))
- Paso del pipeline: 4
- Depende de: 0296
- ADRs: 0024 §3
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 11)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura de motivos y recuento guardado para la Biblioteca.

## Criterios de aceptación
- [x] `detectarDudosas` con `PARAMETROS_DUDOSAS`; excluye `revisada` vigente.
- [x] Función de main `contarDudosasGuardadas` hecha y probada. Guardar el recuento en `preparacion.dudosas` pasa a la tarea 0308 (pregunta 0225 §2).
- [x] `app/scripts/calibrar-dudosas.ts` (desarrollo, fuera del paquete, solo cifras).
- [x] Tras cambiar `offset_ms`, las líneas que estaban dadas por buenas vuelven a poder señalarse (main retira `revisada`; ADR 0024, revisión 2026-11-22). Test.

## Pruebas de feedback
- Unitarias: `dudosas.test.ts` (cada motivo positivo y negativo, sin picos, `revisada`).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `shared/dudosas.ts`: `PARAMETROS_DUDOSAS` (valores del ADR 0024 §3), `detectarDudosas(letra, voz | null, { duracionMs, p })` → `{ id, motivos, detalleMs?, detalles, finAutomatico, prioridad }[]` en orden de letra, `revisadaVigente` y `contarRevisadas`. Motivos con los nombres de la spec 06 (`sinInicio`, `sinVoz`, `reconocimiento`, `vozTarde`, `finCorta`, `finTarde`, `muyCorta`, `muyLarga`, en ese orden de prioridad; el principal es el primero). Excluye las líneas con `revisada` vigente (inicio, fin efectivo y texto iguales a la instantánea). Sin picos solo aplica `sinInicio`, `reconocimiento`, `muyCorta` y `muyLarga`. Umbrales spec/ADR distintos: se usan los del ADR (pregunta 0225).
- `shared/silencios.ts`: `proponerAjusteSilencios` admite `soloIds` (una línea, también con palabras a mano, sin tocar la espera) y escribe `origen_fin: 'silencios'` en los fines que cambia (lo pedía el ADR 0024 §4 y no se hacía).
- `main/letras/dudosas.ts`: `contarDudosasGuardadas(deps, cancion)` (lee el nivel base y cuenta). **No está cableada**: `cancion.preparacion` no existe (tarea 0306) y `shared/cancion.ts` es del lote D. Quien implemente la feature 5 debe llamarla al terminar la preparación y tras cada escritura de la letra (`ServicioLetras.escribir`) de una canción con `preparacion`, y guardar el número en `preparacion.dudosas`.
- `app/scripts/calibrar-dudosas.ts` + `calibrar-dudosas-cli.mjs` + script `npm run calibrar:dudosas -- <carpeta> [--ids a,b] [--json]`: solo lectura y solo cifras (por canción: líneas, señaladas, %, recuento por motivo, «supera el 10 %»); ignora las marcas `revisada` para medir la letra tal cual. Exporté `leerNivel` de `calibrar-encaje.ts` para reutilizarlo.
- Criterio de `offset_ms`: ya estaba hecho en la 0296 (pregunta 0172): `ServicioLetras.guardarTiempos` retira `revisada` de todas las líneas si cambia `offset_ms`, y el reducer lo hace en `cambiar_desfase`; test existente en `main/letras/servicio.test.ts` («cambiar offset_ms retira revisada…») y en `estado.test.ts`.

**Probar**: `npx vitest run src/shared/dudosas.test.ts src/shared/silencios.test.ts src/main/letras/dudosas.test.ts scripts/calibrar-dudosas.test.ts`.

**Pendiente**
- Cablear `preparacion.dudosas` (feature 5).
- **Del usuario**: ejecutar `npm run calibrar:dudosas -- <carpeta de la biblioteca>` con sus canciones ya revisadas y comprobar el criterio «≤ 10 % de líneas señaladas»; aquí no está la biblioteca y no se pudo medir. Las pruebas usan fixtures sintéticos.
