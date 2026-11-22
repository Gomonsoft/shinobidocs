# 0345 — Feature 1 · Línea de tiempo con carriles, «Juntar carriles» y arrastre entre carriles
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0342 (y 0343 terminada si comparte `atajos.ts`: lo serializa la sesión principal)
- ADRs: 0029 §3 y §5
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1)
- Tamaño: L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Un carril por cantante desde que se añade, más «Todos» y «Coro» si tienen líneas, y asignar arrastrando.

## Criterios de aceptación
- [ ] Carriles según `carriles(letra)`: un carril por cantante aunque no tenga líneas, con su texto de carril vacío; «Todos» y «Coro» solo con líneas; sin reparto, la pista única de hoy.
- [ ] Alto efectivo que crece por carril sin reescribir la preferencia; el paso nuevo de «Qué cede primero» (carriles de 24 a 16 px y, si no cabe, juntos solos) a 1280 × 720 y 1024 × 576, sin scroll de página.
- [ ] «Juntar carriles» alternable (`aria-pressed`), recordado en `config.editor.carriles_juntos`.
- [ ] Arrastre vertical del cuerpo de una región (umbral 8 px, el componente horizontal se ignora), resaltado del carril de destino, Esc cancela sin paso; con varias seleccionadas mueve todas; soltar en «+ Nuevo cantante» crea el cantante y asigna.
- [ ] `Alt + ↑/↓` con el foco en una región la lleva al carril vecino; doble clic, tiradores, Bloquear enunciado y editor preciso funcionan igual en su carril.
- [ ] La onda sigue pintándose en Canvas (detrás de los carriles o en su fila, según la spec) y el número de nodos de región no crece con los carriles.

## Pruebas de feedback
- Unitarias: `distribucion.test.ts` (alto efectivo y cesión), componentes de la pista con dobles (umbral, Esc, varias).
- E2E: Ampliar `editor-reparto.spec.ts`: añadir un cantante, ver su carril vacío y llevar una región con Alt + ↓.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
