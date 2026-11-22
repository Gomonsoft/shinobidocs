# 0324 — Feature 9 · Escribir paquetes de canción y copias de seguridad
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0339
- ADRs: 0027 §1–§2 y §7, 0012
- Spec UX: docs/ux/02-biblioteca.md y 08-ajustes-y-acerca.md (0.2.2 · Feature 9)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`ServicioCopias` (escritura) con `yazl`.

## Criterios de aceptación
- [ ] Formato `.shinobi` y manifiesto; SHA-256 en streaming; temporal y `rename`; cancelable; espacio; `EN_CURSO`.
- [ ] `yazl` y `yauzl` añadidas con sus avisos en `THIRD_PARTY_NOTICES.md` (ADR 0012).
- [ ] `config.copias.ultima`.

## Pruebas de feedback
- Unitarias: Main con biblioteca temporal.
- E2E: Ninguna (la de 0326).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
