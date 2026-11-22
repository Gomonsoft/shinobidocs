# 0300 — Feature 4 · «Comprobar la letra con la voz» en el editor
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0297, 0296
- ADRs: 0024, 0018 §6.2
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 4)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Acción de la pestaña Funciones con la letra en memoria, corrección y «Quitar la corrección» en un paso de deshacer.

## Criterios de aceptación
- [x] Lectura del nivel base con `picos.leer` (como «Ajustar los silencios»).
- [x] Acciones del reducer y guardado de `offset_ms` y `desfase_corregido_ms`.
- [x] Cambiar el desfase (corregir, quitar la corrección o el campo de desfase) quita `revisada` de todas las líneas del estado, en el mismo paso de deshacer (ADR 0024, revisión 2026-11-22; pregunta 0172).
- [ ] (parcial: sin verificar F4-E10 ni capturas F4-E11; ver notas) Criterios de la spec 06 · Feature 4.

## Pruebas de feedback
- Unitarias: `estado.test.ts` (un paso, deshacer y rehacer) y componente.
- E2E: Ampliar `editor.spec.ts` con una letra desplazada y picos generados.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `estado.ts`: acción `cambiar_desfase { offsetMs, desfaseCorregidoMs, ahora }`: un paso del historial que cambia `offset_ms` y `desfase_corregido_ms`, no toca ningún tiempo de línea y, si cambia `offset_ms`, retira `revisada` de todas las líneas (pregunta 0172); repetir el mismo valor no es un paso. Tests en `estado.test.ts` (un paso, deshacer, rehacer, quitar, mismo valor).
- `editor/comprobar/`: `calcular.ts` (precondiciones `motivosComprobar`, `calcularEncajeEditor` con `leerPicosBase` y `evaluarEncaje` sobre la letra en memoria, `mismaPropuesta` a ≤ 50 ms), `useComprobarLetra.ts` (pedir, confirmar recalculando, quitar, [Ir], veredicto de entrada para el banner, resalte 2 s), `Dialogos.tsx` («¿Corregir el desfase?», «La letra no encaja con la voz» con tramos [Ir] y [Buscar otra letra], y el informativo de `dudosa`), `textos.ts` (claves `edi.comprobar.*`, `edi.desfase.*`, `edi.banner.*`).
- `PanelFunciones`: sección «Comprobar la letra con la voz» justo antes de «Ajustar los silencios», con el botón `aria-disabled` y su motivo (reutiliza los textos de los silencios), «Desfase corregido…» con [Quitar la corrección]. **Cambio de orden**: «Ajustar los silencios» pasa antes de «Exportar video» (orden común de la spec 06 · F4/F10).
- `Editor.tsx`: cableado, banner `edi.banner.desfase` / `edi.banner.noCoincide` en borradores (sustituye a `edi.banner.yasync`; [Ahora no] y [×] lo ocultan), [Ir] (cabezal + selección), [Buscar otra letra] (`irALetra`: abre la vista Letra en C, no directamente en A).
- Guardado: `desfase_corregido_ms` viaja en `guardarTiempos` (pregunta 0210); el doble `fixturesApi.ts` imita a main.
**Archivos**: `app/src/renderer/src/vistas/editor/{estado,Editor,PanelFunciones,fixturesApi}.ts(x)`, `editor/comprobar/*`, `shared/letras/tiempos.ts`, `shared/letrasBusqueda.ts`, `main/letras/servicio.ts`.
**Probar**: `npx vitest run src/renderer/src/vistas/editor/estado.test.ts src/renderer/src/vistas/editor/comprobar src/renderer/src/vistas/editor/Editor.comprobar.test.tsx src/renderer/src/vistas/editor/PanelFunciones.test.tsx`.
**E2E**: ampliado `e2e/editor.spec.ts` («comprobar la letra con la voz…»: voz sintética con `pulsosFlac`, letra 0,8 s adelantada, corrige, comprueba `cancion.json` (offset, desfase, tiempos idénticos) y deshace con Ctrl/Cmd+Z). Escrito, sin ejecutar.
**No hecho / pendiente**
- El campo de desfase del editor no existe en 0.2.1: no hay nada que enlazar a la regla de `revisada` salvo corregir y quitar.
- El resalte de 2 s reutiliza el de «Ajustar los silencios» (no hay borde `info` propio); centrar la línea de tiempo al [Ir] depende de que siga al cabezal (verificar a mano).
- No se comprobó F4-E10 (seis viewports sin scroll) ni las capturas F4-E11; verificación manual con canciones reales (LRC movido 1 s y 3 s, intro hablada o coros largos, tramos del diálogo «no encaja»).
