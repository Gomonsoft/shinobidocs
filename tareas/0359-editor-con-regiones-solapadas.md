# 0359 — Feature 3 · Editor: regiones solapadas en carriles distintos
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0357, 0345
- ADRs: 0029 §7
- Spec UX: docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: M, con riesgo
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Prueba 0356: sirve** (2026-11-23), pero esta interfaz **no se prototipó**: es el riesgo que queda de la feature. Pendiente de la confirmación del usuario (0165, fila 10). Dueño: lote B (`PistaSincronia.tsx`, `PanelSincronia`, `ListaLineas`), cuando 0345 esté cerrada.

## Objetivo
Editar tiempos de líneas que se solapan con otra parte.

## Criterios de aceptación
- [ ] Tiradores del fin limitados por la siguiente región de su carril (C1S-E1).
- [ ] Regiones solapadas completas en sus carriles; icono `layers` con `edi.partes.solapa` en la fila que empieza durante otra (C1S-E2).
- [ ] Asignar a una parte una línea que se solapa con otra de esa parte se impide por todas las vías con `edi.partes.solapaMisma` y carril prohibido en el arrastre (C1S-E3).
- [ ] Un inicio que no puede pasar del de la línea anterior muestra el aviso `inicio_anterior` de siempre (pregunta 0368: el texto va en orden de inicio).

## Pruebas de feedback
- Unitarias: Componentes de la pista y del menú con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: alargar el fin de una línea sobre la de otra parte.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
