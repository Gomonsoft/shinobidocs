# 0363 — Feature 1 · «Varias voces» en «Letra en pantalla» (zonas o un bloque)
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0340, 0347 (misma pestaña Estilo; lo serializa la sesión principal)
- ADRs: 0029 §4 bis, 0022 §1
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Convivencia, fila «Letra en pantalla»)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Elegir en el tema si una canción con reparto se ve en zonas o en un bloque.

## Criterios de aceptación
- [ ] Grupo de radios «Varias voces» al principio de «Letra en pantalla» en canciones con reparto (y siempre en D3), con sus ayudas, guardado en `estilo.pantalla.zonas` como parte del bloque (herencia y «Cambiar solo en esta canción»); un paso de deshacer (C1-E25).
- [ ] Nota `edi.pantalla.zonas` con zonas; resumen « · en zonas» / « · en un bloque» en D1/D4; la vista previa cambia en < 100 ms; abrir no escribe nada (C1-E25).

## Pruebas de feedback
- Unitarias: Componentes con dobles; `temas.test.ts` con `zonas` en `reemplazo_pantalla`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
