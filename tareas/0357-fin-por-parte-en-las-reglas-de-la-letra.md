# 0357 — Feature 3 · Fin por parte en las reglas de la letra
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0356 (si sirve), 0341
- ADRs: 0029 §7, 0006, 0021
- Spec UX: — (ADR 0029 §7)
- Tamaño: M–L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Condicionada**: solo se hace si la prueba técnica 0356 sirve (ADR 0029 §7).

## Objetivo
Permitir que líneas de partes distintas se solapen sin tocar el orden de inicios.

## Criterios de aceptación
- [ ] `validarInvariantesLetra`, `finEfectivo`, `validarPalabras`/`palabrasVisibles` y `limitesInicio`/límites del fin con la regla de ADR 0029 §7 (la siguiente de la misma parte; «Todos» cuenta como de todas las partes de cantante).
- [ ] Main valida la regla al escribir; una canción sin reparto se comporta exactamente como antes (mismos resultados en todas las pruebas existentes).
- [ ] `revisada` deja de valer en las líneas cuyo fin automático cambia por la regla nueva (sin reescribir nada al abrir).
- [ ] 0.2.2 abre una canción con solapes: documentar en las notas qué ve (líneas cortadas en el inicio de la otra parte) y comprobar que no la marca como dañada.

## Pruebas de feedback
- Unitarias: `letra.test.ts`, `tiempos.test.ts` con la letra inventada de la prueba; copia congelada del esquema de 0.2.2.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
