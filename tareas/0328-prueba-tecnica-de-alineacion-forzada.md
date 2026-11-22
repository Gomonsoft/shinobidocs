# 0328 — Feature 10 · Prueba técnica de alineación forzada sobre la voz separada
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: — (puede empezar ya)
- ADRs: 0028 §2
- Spec UX: —
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Medir el candidato A del ADR 0028 contra los fines hechos a mano del usuario y decidir con el criterio cerrado de §2.4.

## Criterios de aceptación
- [ ] Scripts en `docs/poc/0028-alineacion/` con entorno `uv` propio; ejecución en el equipo del usuario en solo lectura; **ninguna letra ni audio en el repositorio**.
- [ ] Conjuntos V1 y V2 (y V3 si el usuario la prepara) y línea base de «Ajustar los silencios» calculada por el mismo script.
- [ ] Medidas de §2.3 (error del fin, cortes, confianza, palabras, coste con GPU y CPU, una línea con y sin modelo cargado, determinismo).
- [ ] Comprobación de que un codificador propio y un Viterbi propio dan las mismas emisiones y tramos que `transformers` y `forced_align`.
- [ ] Resultado (**todo**, **solo fines** o **nada**), umbrales de confianza, margen y factores escritos en ADR 0028 («Resultado de la prueba técnica») y estado del ADR actualizado.

## Pruebas de feedback
- Unitarias: Los scripts de la prueba no forman parte de la app (sin Vitest).
- E2E: Ninguna.
- Críticos: no
- Manual: La ejecución con la biblioteca real la hace el programador en el equipo del usuario o el usuario con las instrucciones del README de la prueba.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
