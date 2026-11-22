# 0285 — Feature 3 · Aviso de versión nueva en la interfaz
- Estado: Pendiente
- Paso del pipeline: 0
- Depende de: 0284
- ADRs: 0023
- Spec UX: docs/ux/08-ajustes-y-acerca.md, docs/ux/09-descarga-e-instalacion.md, docs/ux/01-primer-arranque.md y docs/ux/sistema-visual.md (secciones 0.2.2 · Feature 3)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Mostrar el punto del botón ⚙, la línea de Acerca de, «Buscar actualizaciones», el interruptor y la mención del primer arranque.

## Criterios de aceptación
- [ ] Lo que pide la spec 08 · Feature 3 con los textos de su microcopy.
- [ ] El aviso no aparece en la ventana secundaria ni en la de exportación.
- [ ] «Ver novedades» y «Descargar» abren solo enlaces construidos por main (`ENLACES_PERMITIDOS`).
- [ ] Mención en el primer arranque (spec 01 · Feature 3).

## Pruebas de feedback
- Unitarias: Componentes con el doble de `window.shinobi`: estados `nueva`, `al_dia`, `error`, sin conexión, canal de desarrollo (botón desactivado con motivo).
- E2E: Una secundaria (`actualizaciones.spec.ts`) con el doble HTTP: punto en ⚙, línea de Acerca de y lista exacta de cabeceras recibidas por el doble.
- Críticos: sí
- Manual: Primer arranque con la mención; aviso con una Release real.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
