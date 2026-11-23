# 0342 — Feature 1 · Editor: selección múltiple y acciones del reparto en el reducer
- Estado: Hecha
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
**Qué se hizo.** El reducer del editor gana la selección múltiple y las acciones del reparto, todas sobre `shared/reparto.ts`.
- `estado.ts`: `EstadoEditor` suma `seleccionadas: string[]` (siempre incluye la principal) y `ancla`. Acciones nuevas: `alternar_seleccion` (Ctrl/Cmd + clic), `extender_seleccion` (Mayús + clic), `mover_seleccion` con `extender` (Mayús + ↑/↓, desde el ancla, saltando pausas, encoge si vuelve), `hacer_principal`, `solo_principal` (Esc), `seleccionar_ids` (para el recuento de 0346), `asignar_parte` (`ids?` = las seleccionadas; `agrupar` junta las pulsaciones de menos de 1 s), `anadir_cantante` (`asignarA?`), `quitar_cantante`, `renombrar_cantante`, `marcar_como_coro` y `fijar_voz_en_coros` (redondea a 0,05; `agruparGesto` para el deslizador). Cada una es **un** paso de deshacer (la letra queda normalizada por `shared/reparto.ts`); sin cambio real (parte no disponible, nada que marcar, mismo nombre) no hay paso. Ninguna actúa en el modo al ritmo. Todo lo que ya leía `seleccion` sigue igual: cualquier otro cambio de la principal colapsa la selección a una línea; I, O, Supr, Alt/Ctrl + ←/→, P y L actúan solo sobre la principal.
- `guardado.ts`: `GuardadoEditor` normaliza el reparto y envía `partes` completo (`null` si ya no queda nada) además de `parte` por línea (pregunta 0341, abierta para el arquitecto).
- Esc: en `Editor.tsx`, antes de lo de siempre y tras el menú (que captura su Esc), con varias seleccionadas deja solo la principal (el hueco del arrastre queda para 0345).
- «Probar a pantalla completa» ya pasa `letra` en memoria (con `parte` y `partes`) al reproductor: no hizo falta cambio.

**Archivos clave.** `app/src/renderer/src/vistas/editor/estado.ts`, `guardado.ts`, `estado.reparto.test.ts`.

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/estado src/renderer/src/vistas/editor/guardado`.

**Para 0345/0346.** El reducer es de este lote: pídanle acciones nuevas. 0345 (arrastre) usa `asignar_parte` con `ids` y `anadir_cantante` con `asignarA` (soltar en «+ Nuevo cantante»); 0346 usa `anadir_cantante` sin `asignarA`, `quitar_cantante`, `renombrar_cantante`, `marcar_como_coro`, `fijar_voz_en_coros` y `seleccionar_ids` (recuento). Siempre `ahora: performance.now()`.

**Deuda.** Ninguna.
