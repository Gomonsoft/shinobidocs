# 0348 — Feature 1 · Letra en pantalla: color por parte, insignia y paréntesis del coro
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0340
- ADRs: 0029 §4, 0022 §2–§5
- Spec UX: docs/ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla (Reglas de color y Señales que no dependen del color) y docs/ux/sistema-visual.md#023--varios-cantantes-y-coros
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Pintar el color, la insignia y los paréntesis en el bloque de líneas, que también usará cada zona (0364).

## Criterios de aceptación
- [ ] `colorDeLinea` usa `colorDeParte`: barrido, subrayado e indicadores de espera (color de la línea que viene) en el color de la parte; texto sin cantar en `letra.color`; la que acaba pasa a gris, también su insignia (C1-R3, parte de color).
- [ ] Letra lista con reparto: texto entero en el color de su parte, sin barrido ni subrayado (C1-R8).
- [ ] Insignia (`insignia(letra, parte)`, texto o icono `users`) con las medidas del sistema visual, fuera del flujo a la izquierda del primer renglón; `--k-ancho-linea` al 80 % solo con varios cantantes (C1-R4, iniciales; C1-R6, ancho; C1-R7).
- [ ] Paréntesis dibujados en las líneas de coro sin duplicar, barridos con la primera y la última palabra; coro sin insignia (C1-R5).
- [ ] Una canción sin reparto da el mismo modelo y el mismo DOM que en 0.2.2, con el ancho al 88 % (C1-R1).

## Pruebas de feedback
- Unitarias: `PantallaLetra.test.tsx`, `render.test.ts` (regresión en 50 instantes), `barrido.test.ts` con la letra de ejemplo.
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
