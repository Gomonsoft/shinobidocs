# 0290 — Feature 1 · `PantallaLetra` con varias líneas y cambios por tiempo
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0288, 0289
- ADRs: 0022, 0019, 0011, 0017
- Spec UX: docs/ux/07-reproductor.md, docs/ux/10-exportacion.md y docs/ux/sistema-visual.md (0.2.2 · Feature 1)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Pintar el nuevo modelo en reproductor, secundaria, vista previa y exportación sin volver a renderizar React por fotograma.

## Criterios de aceptación
- [ ] Montaje a tamaño `S`, medición estable de renglones (una vez por línea y tamaño), variables por nodo `--k-y`, `--k-escala`, `--k-opacidad`, `--k-gris`; `color-mix` para el gris.
- [ ] Copias del «Fundido» solo durante el cambio; indicadores en posiciones relativas al ancla y con `esperaAparicion`.
- [ ] Se retira la animación `.transicion` de la línea y su `data-nace-ms`; la cuenta conserva su mecanismo.
- [ ] La instantánea de sesión y la de exportación llevan el estilo resuelto con `pantalla`; la exportación pasa `movimiento: 'completo'`.
- [ ] F1-R17, R21, R22 y R23 cubiertos.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [ ] El color del barrido se resuelve por línea: una función `colorDeLinea(linea, estilo)` (en 0.2.2 devuelve siempre `color_resaltado`) y variables CSS en el nodo de cada línea. Los indicadores de espera toman el color de la línea que viene.
- [ ] El ancho de línea deja de ser un 88 % fijo en el CSS: pasa a la variable `--k-ancho-linea` (88 % por defecto), usada también en la reducción por longitud.

## Pruebas de feedback
- Unitarias: `PantallaLetra.test.tsx`: mismos cortes de renglón en todos los puestos (medición simulada), Letra lista sin color de resaltado, palabra a palabra igual que 0.2.1, modo fotograma.
- E2E: Una prueba en `exportacion.spec.ts`: 3 s a 640 × 480 con 5 líneas; el modelo del anfitrión a mitad de un cambio es igual a `fotogramaEn` (F1-R23).
- Críticos: sí (vista del flujo principal)
- Manual: Fluidez en un equipo modesto y en la secundaria con fondo en movimiento; si hay saltos, `will-change` solo durante el cambio.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
