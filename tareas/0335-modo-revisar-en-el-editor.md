# 0335 — Feature 11 · Modo «Revisar» en el editor
- Estado: Hecha (E2E escrita, sin ejecutar; entradas desde la Biblioteca y banner de la feature 5 fuera de esta tarea)
- Paso del pipeline: 4
- Depende de: 0334
- ADRs: 0024
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 11)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Recorrido, marcas fuera del recorrido, «Está bien», «Fin al final de la voz» y fin del recorrido.

## Criterios de aceptación
- [x] Criterios de la spec 06 · Feature 11; «Está bien» entra en el historial; «Fin al final de la voz» con `soloIds`.

## Pruebas de feedback
- Unitarias: Reducer y componentes.
- E2E: Ampliar `editor.spec.ts` con una canción con dos líneas dudosas.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho** (spec 06 · Feature 11, F11-E2 a E10, E12 a E14)
- `estado.ts`: acciones `marcar_revisada` («Está bien»: un paso del historial, guarda la instantánea con el fin efectivo; no vale sin inicio) y `reiniciar_revisadas` («Volver a señalarlas»: un solo paso). Viajan por `guardarTiempos` como ya hacía `revisada`.
- `editor/revision/`: `useRevision.ts` (voz desde los picos base, `detectarDudosas` en vivo, recorrido, «Está bien», siguiente/anterior con vuelta, «Fin al final de la voz» con `soloIds` + `ajustar_silencios`, preferencia, resalte del dock), `TarjetaRevision.tsx` (tarjeta del recorrido: línea, corregida, fuera, fin, nada; y `MarcaPanel` fuera del recorrido), `textos.ts` (`edi.revision.*`), `revision.module.css`.
- Marcas fuera del recorrido: ⚑ + motivo en la fila de la lista (tooltip y nombre accesible), banderita en la región de la línea de tiempo (+ «Zoom a la línea» al llegar si mide < 120 px o no cabe), marca con [Está bien] y arreglo en el panel Sincronía, botón «Línea dudosa siguiente» en la cabecera de la lista.
- Entradas: sección «Revisar la sincronía» (primera de «Funciones»; con recuento, resumen, «Volver a señalarlas», `sinVoz`, «calculando»), tecla R, y Ctrl/Cmd + ↓/↑ (sin recorrido también). N (Está bien / Siguiente), Esc termina el recorrido (antes de volver a la Biblioteca), «Sincronizar al ritmo» lo termina. Tres atajos en el diálogo.
- «Marcar como lista» / «Marcar como letra lista» en un borrador con pendientes: la primera pulsación de la visita muestra `edi.revision.pendientes` ([Revisar ahora] / [Marcar igualmente]); «Hecho» no pregunta. Al llegar a 0 pendientes se resalta 2 s el botón del dock («Marcar como lista» o «Hecho»); la canción no cambia de estado sola.
- Preferencia «Escuchar cada línea al llegar»: `config.editor.revision_autoescucha` (por defecto `true`; pregunta 0225).
- Archivos: `app/src/renderer/src/vistas/editor/{Editor,estado,atajos,PanelFunciones,PanelSincronia,ListaLineas,PistaSincronia,BotonLista,BotonLetraLista,DialogoAtajos,fixturesApi}.ts(x)`, `editor/revision/*`, `shared/config.ts`, `shared/ipc.ts` (campo de config).

**Probar**: `npx vitest run src/renderer/src/vistas/editor/Editor.revision.test.tsx src/renderer/src/vistas/editor/estado.test.ts src/renderer/src/vistas/editor/atajos.test.ts src/renderer/src/vistas/editor/PanelFunciones.test.tsx src/renderer/src/vistas/editor/revision`.

**E2E escrita, sin ejecutar**: `app/e2e/editor.spec.ts`, «revisión guiada: dos líneas dudosas…» (sobre la canción T20 con voz sintética `pulsosFlac`: marcas ⚑ con motivo, recorrido, «Fin al final de la voz» como un paso con `origen_fin: "silencios"`, «Está bien» persistido y deshacer, fin del recorrido, Esc). Puntos frágiles a mirar: que `esperarOnda` baste para que la voz se lea antes de contar (el número «Revisar (2)…» sale al leer los picos) y los 3,0 s / 0,8 s de los motivos (dependen de los pulsos de 2 s cada 5 s).

**Capturas para el diseñador** (F11-E16, `docs/ux/revisiones/0.2.2-feature-11/`, `editor-1280x720-100-{estado}.png` y `-125`): `funciones-revisar`, `lista-con-marcas`, `recorrido`, `recorrido-corregida`, `recorrido-fuera`, `recorrido-fin`, `popover-pendientes`, `sin-dudas`. **No** hay captura de `banner-revision` (depende de la feature 5).

**No hecho / pendiente**
- `edi.banner.revision` y `.nada` (borrador preparado por la app): necesitan `resumen.preparacion` (feature 5).
- «Sincronizar esta línea con la voz» (motivo `reconocimiento`): necesita la feature 10; el motivo se señala pero sin arreglo rápido.
- Entradas desde la Biblioteca, el progreso y los toasts (0336): el recorrido se empieza con `revision.empezar()` de `useRevision`; la 0336 solo tiene que llamarlo al montar el editor cuando la vista traiga `revisar: true` (y, con 0 pendientes, la tarjeta ya muestra `edi.revision.nada.fin`). `Editor.tsx` es quien instancia el hook (`EditorActivo`); habrá que pasarle un prop `revisarAlEntrar` desde `Editor` y llamar a `empezar` en un efecto cuando los picos estén leídos (la voz se lee al montar; si `empezar` se llama antes, los motivos de voz aparecen después y el recorrido los incorpora, porque el total crece).
- Sin comprobar: F11-E15 (seis viewports sin scroll de página, tarjeta a 300 px de panel) y la guía manual de F11 (cronometrar, canciones reales).
- Deuda: `origen_fin` no se retira en el reducer al editar un fin a mano (solo lo hace main si `fin_ms` es null); la marca `revisada` en memoria no se retira al editar la línea (el detector la ignora si ya no es vigente y main la retira al escribir).
- Fuera de alcance de la tarea pero tocado: `shared/config.test.ts` (campo nuevo).
