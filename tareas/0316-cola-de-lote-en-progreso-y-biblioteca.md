# 0316 — Feature 7 · Cola de preparación de un lote en el progreso y la Biblioteca
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0309, 0315
- ADRs: 0026, 0025 §5
- Spec UX: docs/ux/04-progreso-pipeline.md y 02-biblioteca.md (0.2.2 · Feature 7)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Tanda, pausa, paradas y «Reintentar las fallidas» en la interfaz.

## Criterios de aceptación
- [ ] Criterios de esas secciones.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho** (renderer; `IndicadorActividad.cola.test.tsx`, `DialogoCierre.test.tsx`, `modelo.test.ts`, `Biblioteca.preparacion.test.tsx`)
- `navegacion/cola.ts` (textos `act.cola.*`, botón, resultados, ETA), `PanelCola.tsx` (cabecera con barra global monótona, Pausar/Reanudar, «Cancelar lo que falta…» con diálogo, avisos de paradas y sus salidas, nota `act.cola.sesion`, grupos plegables «En cola»/«Con error»/«Terminadas», [Reintentar las fallidas]), `useAnuncioCola.ts` (`role="status"` cada 10 s como máximo; pausa, paradas y final al momento) e `IndicadorActividad` (botón `act.cola.boton` / `.pausa` ⏸ / `.parada` ⚠; «Ver actividad» abre el panel por el evento `shinobi:abrir-actividad`). Solo con tanda de 2 o más canciones.
- `Progreso`: `prog.cola.posicion` y `prog.cola.pausa` + [Reanudar la cola]. `DialogoCierre`: `cierre.cuerpo.cola`. Biblioteca: `bib.import.anadidas` con [Ver actividad] y [×], `bib.vacia.cuerpo`.
- Cancelar lo que falta: `trabajos.cancelar` por cada trabajo y `preparacion.cancelar(id)`; «Reparar el motor» navega al flujo del primer arranque.
- **Pendiente manual**: capturas `actividad-1280x800-100-{cola,cola-en-pausa,cola-youtube-parada,cola-con-errores,resultado,dialogo-cancelar}`, `biblioteca-…-lote-anadido`; F7-P11 (cerrar y reabrir con cola) y P9 con lector de pantalla.
- **Límites**: el botón cuenta la canción en curso (terminadas+1) y la cabecera las terminadas; «faltan {m}» son canciones.
