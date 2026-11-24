# 0366 — Feature 2 · Casilla «Incluir la voz en los coros» en los diálogos de una y de varias canciones
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0353
- ADRs: 0030 §5
- Spec UX: docs/ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que el usuario decida si el video «Solo instrumental» lleva los coros.

## Criterios de aceptación
- [x] Formulario A: casilla solo con «Solo instrumental», coros, nivel > 0 y voz separada, marcada la primera vez y recordada en `config.exportacion.coros`; con nivel 0, `exp.coros.cero` sin casilla (C2-V1, C2-V4).
- [x] Lote (G): casilla con `exp.lote.coros` si alguna canción tiene coros (k), nota `exp.lote.nota.coros` en «Ver cuáles» (C2-V5).
- [x] Líneas de opciones de B, C, D y H con `exp.audio.coros` cuando aplica (C2-V6).

## Pruebas de feedback
- Unitarias: Componentes de los diálogos con dobles.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.**
- Contrato (aditivo): `ExportacionIpc.corosNivel?: number` (`shared/exportacion.ts`, `shared/ipc.ts`) para que B, C y D sepan si el video lleva la voz de los coros; main lo rellena desde `rutas.envolvente` (`main/exportacion/servicio.ts`).
- `exportacion/dialogo`: `CancionExportable.nivelCoros` (nivel si hay coros con inicio), `corosAplican(audio, canción)` (instrumental, voz y nivel > 0), casilla en `OpcionesVideo` bajo el control de audio (`exp.coros`, ayuda `exp.coros.ayuda`), nota `exp.coros.cero` con nivel 0 y voz. Marcada la primera vez y recordada en `config.exportacion.coros` (se escribe al marcar o desmarcar). Se envía `coros: true` solo si aplica y está marcada.
- Lote (`exportacion/lote`): casilla `exp.lote.coros` con k canciones con coros y nivel > 0 (con «Solo instrumental»), nota `exp.lote.nota.coros` en «Ver cuáles»; `iniciarLote` lleva `coros: true` si hay alguna; cada una usa su nivel (main).
- Línea de opciones: `resumenDe` (B, C) y «Copiar detalles» (D) dicen `exp.audio.coros` si `corosNivel` viene; «Cambiar opciones» reabre la casilla como estaba.

**Criterios.** C2-V1, C2-V4, C2-V5 y C2-V6 en `dialogo/Coros.test.tsx` (10 tests). **No cumplido: H** no tiene línea de opciones en el código de 0.2.2 (el seguimiento del lote no muestra el perfil), así que no hay nada que cambiar allí. Capturas C2-V7: no tomadas (no se ejecuta la aplicación).

**Cómo probarlo.** `npx vitest run src/renderer/src/exportacion src/main/exportacion`.

**Deuda.** Lo de H; capturas del diseñador.
