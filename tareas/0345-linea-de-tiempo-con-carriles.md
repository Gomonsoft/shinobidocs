# 0345 — Feature 1 · Línea de tiempo con carriles, «Juntar carriles» y arrastre entre carriles
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0342 (y 0343 terminada para `atajos.ts`; lo serializa la sesión principal)
- ADRs: 0029 §3 y §5
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Línea de tiempo con carriles)
- Tamaño: L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Un carril por parte y asignar arrastrando.

## Criterios de aceptación
- [ ] Carriles según `carriles(letra)` con etiqueta de 72 px, carril vacío con `edi.partes.carrilVacio` y la onda de fondo detrás de todos; sin reparto, la pista única de hoy (C1-E8, C1-E13).
- [ ] Carril de 32 px (mínimo 24), alto efectivo `máx(preferido, carriles × alto)` sin reescribir la preferencia; pasos 2a y 2b de «Qué cede primero» (juntar solos, botón `aria-disabled` con `edi.partes.juntosSinEspacio`) (C1-E15).
- [ ] «Juntar carriles» (`aria-pressed`, franja de 3 px e inicial), recordado en `config.editor.carriles_juntos` (C1-E16).
- [ ] Arrastre vertical del cuerpo de una región (umbral 8 px, componente horizontal ignorado), destino resaltado, Esc cancela sin paso; varias seleccionadas se mueven juntas; franjas de destino «+ Nuevo cantante» y «Todos» en un dúo (C1-E14).
- [ ] `Alt + ↑/↓` con el foco en una región; doble clic, tiradores, Bloquear enunciado y editor preciso igual que hoy; el número de nodos de región no crece con los carriles.

## Pruebas de feedback
- Unitarias: `distribucion.test.ts` (alto efectivo y cesión), componentes de la pista con dobles (umbral, Esc, varias, franjas).
- E2E: Ampliar `editor-reparto.spec.ts`: añadir un cantante, ver su carril vacío y llevarle una región con Alt + ↓.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
