# 0301 — Feature 4 · Verificación, calibración e informe
- Estado: En curso (calibración con canciones reales pendiente del usuario)
- Paso del pipeline: 3
- Depende de: 0297–0300, 0367–0369
- ADRs: 0024
- Spec UX: docs/ux/05-letra.md y 06-editor.md (0.2.2 · Feature 4)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 4 y repetir la calibración.

## Criterios de aceptación
- [ ] Ejecutar (el usuario, en su equipo) el script de la tarea 0368 que repite la tabla de ADR 0024 con las canciones del usuario y negativos fabricados; constantes ajustadas si hace falta, con nota en el ADR.
- [x] Informe `docs/versiones/0.2.2/informe-feature-4.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-22. Informe: [informe-feature-4](../versiones/0.2.2/informe-feature-4.md). **No cumplido**: el script de calibración no existe (pregunta [0206](../preguntas/0206-no-existe-el-script-de-calibracion-de-la-feature-4.md)) y la biblioteca real no está en el equipo del agente; «10/10 propias, 0 ajenas» y la corrección de ±0,8 s con canciones reales quedan pendientes del usuario (guía, caso 1). 13 capturas en `docs/ux/revisiones/0.2.2-feature-4/` (falta `comprobacion-pendiente`, no automatizable). Defecto bajo D1 (pregunta 0207). Pendiente conocido: `enTandaDeVarias` sin conectar (feature 5).
QA, 2026-11-22 (canciones reales del MVP): el script `calibrar:encaje` (0368) ya existe y se ejecutó con 18 canciones copiadas del MVP 0.1.0 (LRC de LRCLIB sin fines, sin revisar; ver [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)). Resultado: propias 8/17, ajenas 6/272, ±0,8 s corregido 0/34 → **el criterio «10/10 y 0 ajenas» no se cumple con ese material y no es comparable al del ADR (letras revisadas con fines)**; sigue pendiente del usuario con letras revisadas. Preguntas 0275 y 0276 al arquitecto. No se marca el primer criterio.
