# 0329 — Feature 10 · Worker `alinear-letra` (si la prueba sirve)
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0328
- ADRs: 0028 §3.2
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 10)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Comando de alineación en el runtime sin dependencias nuevas.

## Criterios de aceptación
- [ ] Codificador wav2vec2 de inferencia y Viterbi CTC propios (los validados en 0328), carga con `weights_only=True`, GPU o CPU con caída a CPU.
- [ ] Argumentos, progreso, resultado y errores de ADR 0028 §3.2; modo residente para el editor.
- [ ] Doble del comando para las pruebas sin modelo.

## Pruebas de feedback
- Unitarias: pytest con un modelo diminuto aleatorio (misma arquitectura, pocas capas) y audio sintético; marcador `pesado` para el modelo real.
- E2E: Ninguna.
- Críticos: no
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
