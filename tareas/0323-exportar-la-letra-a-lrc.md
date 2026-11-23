# 0323 — Feature 9 · Exportar la letra a `.lrc`
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0296
- ADRs: 0027 §4, 0005
- Spec UX: docs/ux/06-editor.md y 02-biblioteca.md (0.2.2 · Feature 9)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura, canales y entradas en el editor y en el menú ⋯.

## Criterios de aceptación
- [ ] `exportarLrc` con las reglas de ADR 0027 §4; `letras.exportarLrc({ cancionId })` y `letras.exportarLrcVarias({ ids })` abren el diálogo del sistema dentro de la llamada (`null` si se cancela) y `letras.mostrarEnCarpeta({ ubicacionId })` para el toast (ADR 0027, revisión 2026-11-22; pregunta 0166 §4).
- [ ] Ida y vuelta con el importador.

## Pruebas de feedback
- Unitarias: `lrc.test.ts`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Qué se hizo.** `exportarLrc(letra, { titulo, artista, album, duracionMs })` en `app/src/shared/letras/lrc.ts` (cabecera `[ti:] [ar:] [al:] [length:] [re:Shinobi Karaoke]`, desplazamiento aplicado sin `[offset:]`, marca vacía en el `finEfectivo` si el hueco hasta la siguiente línea con tiempo es de 2 s o más y tras la última, líneas sin inicio omitidas, sin palabras, UTF-8 sin BOM, `\n`). `ExportadorLrc` (`app/src/main/letras/exportarLrc.ts`) abre el diálogo del sistema dentro de la llamada: `letras.exportarLrc({ cancionId })` → `{ lineasOmitidas, ubicacionId } | null`, `letras.exportarLrcVarias({ ids })` → `{ escritas, omitidas, ubicacionId } | null` (nunca sustituye: « (2)», « (3)»…, con `wx`) y `letras.mostrarEnCarpeta({ ubicacionId })`. El renderer nunca ve rutas; la última carpeta de letras vive en memoria de main (si no, Documentos); la carpeta de datos se rechaza (`DESTINO_NO_DISPONIBLE`); disco lleno → `SIN_ESPACIO`. Nombre `{título} — {artista}.lrc` (spec `lrc.nombre`; pregunta [0255](../preguntas/0255-adr-0027-frente-a-las-specs-de-la-feature-9-en-cuatro-puntos.md)). Nada de 0.2.3 (los coros no se tocan).
- **Archivos.** `app/src/shared/letras/lrc.ts` (+ `lrc.test.ts`), `app/src/main/letras/exportarLrc.ts` (+ test), `app/src/main/ipc/handlers.ts` (canales fuera de `CANALES_NO_IMPLEMENTADOS`; dependencia opcional `lrc`), `app/src/main/index.ts` (cableado y diálogos).
- **Cómo probarlo.** `npx vitest run src/shared/letras/lrc.test.ts src/main/letras/exportarLrc.test.ts src/main/ipc/handlers.copias.test.ts`. Ida y vuelta: mismos inicios (±10 ms) y fines recuperados en huecos ≥ 2 s; los de huecos menores vuelven a ser automáticos.
- **Motivos de `omitidas`** (`exportarLrcVarias`): `SIN_TIEMPOS`, `CANCION_NO_DISPONIBLE` y los códigos de escritura (`SIN_ESPACIO`, `DESTINO_NO_DISPONIBLE`, `ERROR_INTERNO`).
- **Pendiente / manual.** Críticos y E2E: ninguna escrita (la 0326 pone la suya); no se ejecutó Playwright. Manual: abrir el `.lrc` en un reproductor externo.
