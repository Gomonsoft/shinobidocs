# 0342 — Feature 1 · Editor: selección múltiple y acciones del reparto en el reducer
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0340
- ADRs: 0029 §5
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Dar al estado del editor la selección múltiple y las acciones de reparto, con deshacer y guardado.

## Criterios de aceptación
- [ ] `seleccionadas: string[]` además de `seleccion` (principal); todo lo existente sigue leyendo `seleccion`; Esc deja solo la principal.
- [ ] Acciones `asignarParte(ids, parte)`, `anadirCantante(asignarA?)`, `quitarCantante(id)`, `renombrarCantante(id, nombre)` y `marcarComoCoro(ids)` sobre las funciones de `shared/reparto.ts`; cada una es **un** paso de deshacer y se guarda con `letras.guardarTiempos` (`parte` y `partes`).
- [ ] «+ Añadir cantante» en una canción sin reparto crea Cantante 2 y asigna la selección en un solo paso.
- [ ] Los atajos de tiempos (I, O, Supr, Alt/Ctrl + flechas, P) siguen actuando solo sobre la principal.

## Pruebas de feedback
- Unitarias: `estado.test.ts`: cada acción, deshacer y rehacer, normalización al quitar el último cantante, principal frente a seleccionadas.
- E2E: Ninguna (la de 0343 cubre el recorrido).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
