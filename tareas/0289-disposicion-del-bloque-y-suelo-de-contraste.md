# 0289 — Feature 1 · Disposición del bloque, gris de la letra y suelo de contraste
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0287
- ADRs: 0022
- Spec UX: docs/ux/sistema-visual.md (0.2.2 · Feature 1), docs/ux/07-reproductor.md (0.2.2 · Feature 1)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Funciones puras que pasan del modelo a píxeles y calculan el gris y las opacidades mínimas.

## Criterios de aceptación
- [ ] `renderer/src/karaoke/pantalla.ts`: `disponerBloque` con tabla de puestos, ancla calculada, apilado con alturas inyectadas, interpolación, dos copias en «Fundido» y recorte 10 %–86 % (ADR 0022 §3).
- [ ] `contraste.ts`: `grisDeLetra` (luminancia WCAG) y `suelosDeOpacidad` (3:1 contra cada muestra), una vez por estilo.
- [ ] Criterios F1-R3, R4, R11, R18, R19 y R24 cubiertos sin DOM.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [ ] El color con el que se calculan los suelos de contraste es un parámetro de la función (en 0.2.2 siempre recibe `color_resaltado`).
- [ ] Tests de `disponerBloque` con líneas de 3 y 4 renglones: la geometría no asume 1 o 2.

## Pruebas de feedback
- Unitarias: `pantalla.test.ts` (renderer): anclas ± 0,5 % a 1920 × 1080 y 1280 × 720, escalas, fundido ≤ 0,3 × S, recorte con 7 líneas en 4:3, indicadores relativos al ancla; `contraste.test.ts`: gris y suelos con `#F2E8D5`/`#111111` y el tema Shinobi.
- E2E: Ninguna.
- Críticos: no
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
