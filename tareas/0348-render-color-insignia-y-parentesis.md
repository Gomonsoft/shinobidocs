# 0348 — Feature 1 · Letra en pantalla: zonas por parte, color por cantante, insignia y paréntesis del coro
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0340
- ADRs: 0029 §4, 0022 §2–§5
- Spec UX: docs/ux/07-reproductor.md y docs/ux/sistema-visual.md (0.2.3 · Feature 1)
- Tamaño: L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Pintar el reparto (cada parte en su zona y su color) en el reproductor, la ventana secundaria, la vista previa del editor y el video.

## Criterios de aceptación
- [ ] `renderer/src/karaoke/zonas.ts` con `zonasDePantalla` (ADR 0029 §4 bis): sin reparto o con `zonas: "una"`, una zona = 0.2.2; con reparto, una zona por cantante de la canción y la del coro, y «Todos» como diga la spec. Cada zona con su `fotogramaEn` sobre su subsecuencia (índice cacheado por zona) y su `disponerBloque` dentro de su región; indicadores de espera y cuenta en la zona de la línea que viene.
- [ ] `colorDeLinea` usa `colorDeParte`: barrido, subrayado e indicadores de espera (color de la línea que viene) en el color de la parte; texto sin cantar en `letra.color`; la ya cantada en gris (también la insignia).
- [ ] Letra lista con reparto: el texto entero en el color de su parte.
- [ ] Insignia (`insignia(letra, parte)`) fuera del flujo, a la izquierda de la primera caja de renglón; viaja con escala, opacidad y gris del puesto; `--k-ancho-linea` al 80 % solo con reparto; la línea activa conserva el ancla.
- [ ] Paréntesis dibujados en las líneas de coro sin duplicar los del texto; con palabras visibles, se pintan con la primera y la última palabra.
- [ ] Una canción sin reparto produce el mismo DOM que en 0.2.2 (test de instantánea).

## Pruebas de feedback
- Unitarias: `zonas.test.ts` (regiones a 16:9 y 4:3, una zona sin reparto, coro arriba o abajo), `PantallaLetra.test.tsx`, `render.test.ts`, `barrido.test.ts` con la letra de ejemplo; tiempo de un fotograma con 3 zonas frente a 0.2.2.
- E2E: `exportacion.spec.ts` sigue pasando; capturas opcionales con `SHINOBI_CAPTURAS_023_1=1`.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
