# 0336 — Feature 11 · Revisión guiada desde la Biblioteca
- Estado: Hecha (sin E2E nueva, como pide la tarea; capturas de la Biblioteca pendientes, las toma qa)
- Paso del pipeline: 4
- Depende de: 0334, 0335, 0310
- ADRs: 0024
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 11)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
«Revisar» desde la tarjeta, la vista de progreso y los toasts; marcar como lista desde la Biblioteca.

## Criterios de aceptación
- [x] Parámetro de navegación `revisar: true` (`navegacion/estado.ts`) que lleva a empezar la revisión en el editor.
- [x] «Revisar» de la tarjeta, de cada fila del diálogo de resultado, del bloque de resultado de la vista de progreso y del toast tras «Probar» navegan con `revisar: true`.
- [x] Línea ⚑ `bib.revision.linea` / `bib.revision.sinDudas` en la tarjeta «Lista para revisar» (total `dudosas`).
- [x] Ítems «Marcar como lista» y «Marcar como letra lista» del menú ⋯ y del toast tras «Probar», con `bib.revision.dialogo`.
- [x] Regla de F11-B3: el diálogo sale si `dudosas_importantes > 0` (mismo criterio que el editor, `contarImportantes`) y su `{n}` es ese número; main guarda `dudosas_importantes` y lo expone en el resumen (`dudosasImportantes`, con `dudosas` si falta).
- [x] La línea de revisión entra en el nombre accesible de la tarjeta (`bib.aria.tarjeta`).

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `navegacion/estado.ts`: `revisar?: true` en la vista `cancion`. `Editor.tsx`: prop `revisarAlEntrar`; empieza el recorrido una vez cuando ya se leyó la voz (o no hay separación, o los picos fallaron), así el total no crece después; con 0 pendientes sale la tarjeta «No vemos nada raro…»; marca la preparación como revisada.
- `Biblioteca.tsx`, `DialogoResultadoPreparacion` (vía `alRevisar`), `Progreso.tsx` y `useProbar.ts` navegan con `revisar: true`.
- `TarjetaCancion.tsx`/`tarjeta.ts`: línea ⚑ bajo la línea de origen (solo «Lista para revisar»), ítems del menú ⋯ (`acciones.marcarLista`), y línea de revisión en `textoAriaTarjeta`.
- Nuevo `vistas/biblioteca/useMarcarRevision.tsx`: diálogo `bib.revision.dialogo` ([Cancelar] [Marcar igualmente] [Revisar ahora], foco en «Revisar ahora»), aviso de primera activación de «Letra lista» si no está silenciado, y marcado sin abrir el editor (toast con [Reproducir] y tarjeta resaltada). `useProbar(pedirMarcar?)` lo usa en el toast de la Biblioteca; la vista de progreso sigue marcando directo.
- Main: `contarDudosasGuardadas` devuelve `{ dudosas, importantes }`; `preparacion.dudosas_importantes` (opcional, tolerante) se guarda al terminar la preparación y en cada recuento tras escribir la letra (`main/preparacion/servicio.ts`); el resumen expone `dudosasImportantes`.
- Textos en `BIB_PREP.revision` (`textosPreparacion.ts`).

**Probar**: `npx vitest run src/renderer/src/vistas/biblioteca src/renderer/src/vistas/editor/Editor.revision.test.tsx src/main/letras src/main/preparacion`.

**Sin E2E**: la tarea no la pide; solo Vitest (`Biblioteca.preparacion.test.tsx`: línea ⚑, diálogo, F11-B3 con el mismo recuento que el editor; `Editor.revision.test.tsx`: apertura con `revisar`).

**Pendiente**
- Capturas (las toma qa): `docs/ux/revisiones/0.2.2-feature-11/biblioteca-1280x800-100-lista-para-revisar.png` (F11-B4: tarjeta con líneas, otra sin dudas y el menú ⋯ abierto) y el diálogo `bib.revision.dialogo`.
- El toast de preparación terminada emitido por main (`destino: 'editor'`) no pide la revisión: solo cubre «Revisar» desde la tarjeta, el resultado, el progreso y el toast tras «Probar».
- La vista de progreso marca como lista sin diálogo de pendientes.
