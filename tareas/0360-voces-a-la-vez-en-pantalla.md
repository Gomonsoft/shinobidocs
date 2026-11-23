# 0360 — Feature 3 · Voces a la vez en pantalla y en el video
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0357, 0364
- ADRs: 0029 §4 bis y §7, 0022
- Spec UX: docs/ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: S (revisado tras la prueba 0356)
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Prueba 0356: sirve** (2026-11-23). Pendiente de la confirmación del usuario (0165, fila 10). Dueño: lote C (`zonas.ts`, `PantallaLetra.tsx`), con 0364 hecha.

## Objetivo
Que cada zona barra su línea aunque otra zona también esté cantando.

## Criterios de aceptación
- [ ] Varias zonas al 100 % a la vez, cada una con sus tiempos; indicadores de espera solo cuando no suena ninguna (C1S-R1).
- [ ] Fuera de los solapes, el modelo es idéntico al de la feature 1 (C1S-R2); el anfitrión de exportación da el mismo modelo en los solapes (C1-V1).
- [ ] El fin automático de cada línea se resuelve en la letra entera antes de repartir en zonas (ya lo hace `conFin` de 0364). Un test con dos voces que se alternan lo fija.
- [ ] **Repetir el criterio 2 de la prueba con la 0364 real** (`SPIKE_ZONAS_REALES=1`, README del spike): 3 zonas ≤ 1,25 × 0.2.2 con 5 líneas a 1920 × 1080, y 4 zonas a 60 FPS sin fotogramas sin asentar. Si no se cumple, la feature se para y se pregunta al arquitecto.

## Pruebas de feedback
- Unitarias: `zonas.test.ts` y `PantallaLetra.test.tsx` con la letra de la prueba (10 instantes del solape).
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
