# 0307 — Feature 5 · Cola automática de LRCLIB, interruptor y búsqueda persistida
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0306
- ADRs: 0025 §4, 0005
- Spec UX: docs/ux/08-ajustes-y-acerca.md y 05-letra.md (0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Peticiones automáticas en serie a ≥ 1,5 s, adelantadas por las interactivas, con `config.preparacion.automatica`.

## Criterios de aceptación
- [ ] Cola con prioridad interactiva y `Retry-After`.
- [ ] Interruptor (tolerante, por defecto activo) y búsquedas en cola que no salen al apagarlo.
- [ ] `preparacion.busqueda` guardada sin letras; `letras.candidatoPorId` con `/api/get/{id}`.

## Pruebas de feedback
- Unitarias: Cliente de LRCLIB con reloj falso y doble HTTP.
- E2E: Ninguna.
- Críticos: sí
- Manual: Con el interruptor apagado no sale ninguna petición al añadir (guía).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
