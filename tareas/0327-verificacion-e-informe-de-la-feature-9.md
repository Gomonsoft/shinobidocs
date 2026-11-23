# 0327 — Feature 9 · Verificación e informe
- Estado: Hecha con reservas (defecto de seguridad medio en la pregunta 0320; guía manual y decisión legal del paquete con audio pendientes del usuario)
- Paso del pipeline: 5
- Depende de: 0323–0326, 0376, 0383, 0391
- ADRs: 0027
- Spec UX: docs/ux/02, 06 y 08 (0.2.2 · Feature 9)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 9.

## Criterios de aceptación
- [x] Informe `docs/versiones/0.2.2/informe-feature-9.md`, incluida la decisión legal del paquete con audio.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-23. Informe: [informe-feature-9](../versiones/0.2.2/informe-feature-9.md). 26 criterios: 22 cubiertos, 4 parciales. 18 capturas en `docs/ux/revisiones/0.2.2-feature-9/`. Guía: [feature-9](../Test-manuales/0.2.2/feature-9-copia-paquete-y-lrc.md). Paquetes hostiles propios: una excepción no capturada al extraer una entrada deflate con tamaño real mayor que el declarado ([0320](../preguntas/0320-excepcion-no-capturada-al-extraer-un-paquete-y-ruta-pendiente-en-las-canciones-importadas.md)). La decisión legal del paquete con audio queda pendiente del usuario (0159).
