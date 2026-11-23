# 0359 — Feature 3 · Editor: regiones solapadas en carriles distintos
- Estado: Hecha
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
**Qué se hizo.** El editor con voces a la vez, sin cambiar nada cuando no hay solapes.
- **Tiradores (C1S-E1):** el límite del fin (`aria-valuemax` y la propia edición, que ya usaba `limitarFin` de 0357) es la siguiente línea que **choca** (`siguienteQueChoca`); el del inicio no cambia (aviso `inicio_anterior`, pregunta 0368).
- **Regiones y lista (C1S-E2):** las regiones solapadas se ven completas en sus carriles; la lista marca con el icono `layers` y `edi.partes.solapa` («Suena a la vez que la línea k») la fila que empieza durante otra (`lineasQueSuenanALaVez` en `partes.ts`; también en el nombre accesible).
- **Asignar (C1S-E3):** `solapeAlAsignar` (`partes.ts`) dice si pasar unas líneas a una parte las pisaría con otra que choca («Todos» cuenta como de todos los cantantes, no del coro). Lo aplican el reducer (`asignar_parte` y `marcar_como_coro` se rechazan), `asignarParte` del editor (menú, C, Alt + 1…4, Alt + ↑/↓ y arrastre: aviso `edi.partes.solapaMisma` en el anuncio y en un toast), el menú (la parte sale inactiva con su motivo) y el arrastre (carril con borde `error`; cursor `not-allowed` sobre la región).
- **Funciones automáticas (C1S-E4):** `useAjustarSilencios` → `proponerAjusteSilenciosSinSolapes`; `useRevision` → `detectarDudosasSinSolapes` y «Fin al final de la voz» → `proponerAjusteSilenciosSinSolapes` (si la línea es una solapada no hace nada y lo dice); `comprobar/calcular.ts` → `evaluarEncajeSinSolapes`. `edi.partes.solapaExcluidas` se muestra en el diálogo de «Ajustar los silencios» y en la sección de Funciones.
- **Regla de oro (C1S-E5):** sin reparto, o con reparto sin solapes, no hay icono, ni rechazo, ni mensaje; los 62 archivos de Vitest de `vistas/editor` pasan sin cambiar ninguna prueba existente, y `partes.test.ts` fija que una canción de un solo cantante nunca rechaza ni marca nada. Las filas de la lista pasan a `grid-auto-flow: column` para que un icono más no cree una fila.

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/{partes,Editor.solapes,estado.reparto,PistaSincronia}`. E2E escrita sin ejecutar: último caso de `e2e/editor-reparto.spec.ts` (alargar el fin de Ana sobre la línea de Luis).

**No comprobado.** La interfaz no se prototipó: falta verla (regiones solapadas con carriles juntos, el menú con motivos, el arrastre a un carril prohibido) y probarla con un dúo real. Sin carril por parte (carriles juntos) dos regiones solapadas se pintan una sobre otra. «Sincronizar con la voz» (0331) no existe aún.
