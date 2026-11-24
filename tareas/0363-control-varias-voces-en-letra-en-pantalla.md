# 0363 — Feature 1 · «Varias voces» en «Letra en pantalla» (zonas o un bloque)
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0340, 0347 (misma pestaña Estilo; lo serializa la sesión principal)
- ADRs: 0029 §4 bis, 0022 §1
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Convivencia, fila «Letra en pantalla»)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Elegir en el tema si una canción con reparto se ve en zonas o en un bloque.

## Criterios de aceptación
- [x] Grupo de radios «Varias voces» al principio de «Letra en pantalla» en canciones con reparto (y siempre en D3), con sus ayudas, guardado en `estilo.pantalla.zonas` como parte del bloque (herencia y «Cambiar solo en esta canción»); un paso de deshacer (C1-E25).
- [x] Nota `edi.pantalla.zonas` con zonas; resumen « · en zonas» / « · en un bloque» en D1/D4; la vista previa cambia en < 100 ms; abrir no escribe nada (C1-E25).

## Pruebas de feedback
- Unitarias: Componentes con dobles; `temas.test.ts` con `zonas` en `reemplazo_pantalla`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** Grupo de radios «Varias voces» (`estilo/SeccionPantalla.tsx`, textos en `textosPantalla.ts`) al principio de «Letra en pantalla», con sus dos ayudas, que guarda `estilo.pantalla.zonas` con la misma ruta de cambios que el resto del bloque (`control.cambiar`: propio, reemplazo de la canción o borrador del tema; un paso de deshacer por cambio). Se muestra en canciones con reparto y siempre en D3 (`ControlPantalla.varias`, que decide `useControlPantalla` con la opción nueva `reparto`; `Editor.tsx` la pasa con `tieneReparto(letra)`, una línea). Con «Cada una en su zona» aparece la nota `edi.pantalla.zonas`. En D1/D4 el resumen corto añade « · en zonas» o « · en un bloque» solo con reparto. La vista previa lo muestra porque usa el mismo `PantallaLetra`.

**Criterios (C1-E25).** Cumplidos: «Cada una en su zona» por defecto sin escribir nada al abrir; elegir «Todas en un bloque» guarda `zonas: "una"`; la nota y el resumen; sin reparto no aparece fuera de D3. La herencia y «Cambiar solo en esta canción» ya llevaban `zonas` (`temas.test.ts`, test nuevo con `zonas` en `reemplazo_pantalla`).

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/estilo src/shared/temas.test.ts`.

**Verificación a mano.** Con el dúo de la semilla, cambiar entre «Cada una en su zona» y «Todas en un bloque» y ver la vista previa; en D3 sin reparto el control sigue visible.

**Deuda.** Sin captura propia (la captura del panel de Estilo con «Varias voces» es de 0349).
