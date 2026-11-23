# 0362 — Feature 1 · Vista Letra: aviso al sustituir y resumen con reparto
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0341
- ADRs: 0029 §2
- Spec UX: docs/ux/05-letra.md#023--feature-1--cantantes-al-corregir-o-cambiar-la-letra
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que la vista Letra no pierda el reparto sin decirlo.

## Criterios de aceptación
- [x] Con reparto, el diálogo de sustituir la letra añade `let.dialogo.sustituir.reparto` y el resumen de C la línea `let.actual.reparto` (C1-L2, interfaz).
- [x] En una canción sin reparto, el diálogo y el resumen no cambian (C1-L3).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** `vistas/letra/`: el diálogo de sustituir (`sustituir.tsx`) añade `let.dialogo.sustituir.reparto` cuando la letra tiene reparto (`existenteDe(elementos, letra)` usa `tieneReparto`); el resumen de C (`LetraElegida.tsx`) añade `let.actual.reparto` («{n} cantantes · {k} líneas de coro», cada parte solo si existe). Tras sustituir, la letra local de C conserva `partes` (main hace lo mismo). Sin reparto no cambia nada (C1-L3): tests con `cancionConReparto` y `cancionConCoros`.

**Archivos.** `sustituir.tsx`, `textosPegar.ts`, `textosElegida.ts`, `LetraElegida.tsx`, `Letra.tsx`; test nuevo `Letra.reparto.test.tsx` (5).

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/letra`.

**Deuda.** Ninguna. Plural «1 línea de coro» (la spec solo da el plural).
