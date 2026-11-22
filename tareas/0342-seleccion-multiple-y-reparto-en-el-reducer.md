# 0342 — Feature 1 · Editor: selección múltiple y acciones del reparto en el reducer
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0340
- ADRs: 0029 §5
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Dar al estado del editor la selección múltiple y las acciones de reparto, con deshacer y guardado.

## Criterios de aceptación
- [ ] `seleccionadas: string[]` además de `seleccion` (principal); todo lo existente sigue leyendo `seleccion`; orden de Esc de ADR 0029 §5 (C1-E3).
- [ ] Acciones `asignarParte`, `anadirCantante(asignarA?)`, `quitarCantante`, `renombrarCantante`, `marcarComoCoro` y `fijarVozEnCoros` (ráfaga = un paso) sobre `shared/reparto.ts`; cada una es **un** paso de deshacer y se guarda con `letras.guardarTiempos` (C1-E2, deshacer exacto; C1-E4; C1-E5).
- [ ] Los atajos de tiempos (I, O, Supr, Alt/Ctrl + ←/→, P, L, Mayús + L) actúan solo sobre la principal (C1-E3).
- [ ] «Probar a pantalla completa» usa el reparto en memoria, también sin guardar.

## Pruebas de feedback
- Unitarias: `estado.test.ts`: cada acción, deshacer y rehacer, normalización al quitar cantantes, principal frente a seleccionadas, Esc.
- E2E: Ninguna (la de 0343 cubre el recorrido).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
