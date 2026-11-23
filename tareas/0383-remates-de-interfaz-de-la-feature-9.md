# 0383 — Feature 9 · Remates de interfaz: letra desde el editor, paquetes en actividad y cierre, enlace en «Añadir canción» y carpeta del toast de letras
- Estado: Hecha
- Paso del pipeline: 4 y 5
- Depende de: 0323, 0326 (hechas). El punto 4 espera a que termine la 0315 (mismo archivo).
- ADRs: 0027; pregunta 0291
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 9, F9-E1/E2), docs/ux/02-biblioteca.md (0.2.2 · Feature 9: `act.paq`, cierre, `lrc.toast.varias`), docs/ux/03-anadir-cancion.md (`add.paquete.enlace`, F7-N15)
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 9 (alpha.3).
- Dueños: los puntos 1, 3 y 5 son del lote E. El 2 es del lote C (`vistas/editor/**`). El 4 es del lote D (`vistas/anadir/**`). `main/index.ts` y `navegacion/**` van con un cambio pequeño acordado, que la sesión principal serializa.

## Objetivo

Cerrar los huecos de la feature 9 que ninguna tarea cubría (lo declaró el programador de 0318, 0319 y 0326).

## Criterios de aceptación

1. [ ] **Carpeta en el resultado de exportar letras** (pregunta 0291): `resultadoExportarLrcVariasSchema` gana `carpeta: z.string().max(255).optional()`, solo el nombre (`path.basename` del destino, nunca la ruta). Main lo rellena y `lrc.toast.varias` usa el texto de la spec «a «{carpeta}»». Sin el campo, el texto sin carpeta de hoy.
2. [ ] **«Exportar la letra» en el editor** (F9-E1 y F9-E2):
   - Botón en «Funciones», tras «Exportar video». Antes de exportar **vacía el guardado pendiente** (el mismo `flush` que usa salir del editor) y solo entonces llama a la misma función que la Biblioteca (`exportarLetras` de `vistas/biblioteca/paquete`, o el canal que use).
   - Sin ninguna línea con inicio, `aria-disabled` y `lrc.motivo.sinTiempos` visible.
   - Un fallo de guardado no exporta y muestra el error de guardado de siempre.
3. [ ] **Paquetes en actividad y cierre** (spec 02 · Feature 9):
   - La fila `act.paq` («Creando paquete · {i} de {n}» / «Importando paquete · {i} de {n}») aparece en el panel de actividad, con [Ir] (reabre el diálogo de su trabajo) y [✕] (cancela). Usa `usePaquetes().seguimiento` y los textos `PAQ.actividad.*`.
   - El indicador de actividad cuenta esos trabajos.
   - En main, la fuente del diálogo de cierre (`main/index.ts`, `hayTrabajos` de `ControlCierre`) suma `servicioCopias.hayTrabajos()`, y el diálogo de cierre los cuenta y los cancela al confirmar, como al resto.
4. [ ] **Enlace «Importar paquete…» en «Añadir canción»** (`add.paquete.enlace`, F7-N15): abre el diálogo de importación de la feature 9.
5. [ ] Nada de esto cambia los contratos de copias ni de paquetes, salvo el campo del punto 1.

## Pruebas de feedback

- Unitarias:
  - Esquema del punto 1, con y sin `carpeta`, y el texto del toast.
  - Componente de «Funciones»: con un cambio sin guardar, el orden de las llamadas es «guardar → exportar»; sin inicios, deshabilitado.
  - Panel de actividad con un seguimiento de paquete falso: fila, [Ir] y [✕].
  - `cierre.test.ts`: con un trabajo de copias activo, `hayTrabajos` es cierto.
  - «Añadir canción»: el enlace abre el diálogo.
- E2E: ampliar la spec E2E de la feature 9 (paquetes/letras): exportar la letra desde el editor justo tras mover un inicio, y el archivo lleva el inicio nuevo (F9-E1).
- Críticos: sí (toca el editor y el cierre).
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- **Qué se hizo.** (1) `resultadoExportarLrcVariasSchema.carpeta` (opcional, ≤ 255; main = `basename` de la carpeta, nunca la ruta) y `lrc.toast.varias` («{n} letras exportadas a «{carpeta}»»; sin el campo, el texto de antes). (2) «Exportar la letra (.lrc)…» en «Funciones» tras «Exportar video»: vacía el guardado (`vaciar`, el mismo que usa exportar video), aplica antes el borrador del editor preciso y llama a `exportarLetras`; sin inicios, `aria-disabled` con `lrc.motivo.sinTiempos`; un fallo de guardado no exporta y muestra «No se pudieron guardar los últimos cambios». (3) Fila `act.paq` en el panel de actividad con [Ir] (reabre el diálogo de su trabajo) y [✕] (`copias.cancelar`), contada en el indicador; `main/index.ts` suma `servicioCopias.hayTrabajos()` a `hayTrabajos` (salvo cerrar solo la ventana en macOS) y `DialogoCierre` cuenta el paquete y lo cancela al confirmar. (4) Enlace `add.paquete.enlace` en «Añadir canción» (origen archivo, sin otra operación en curso).
- **Archivos clave.** `main/letras/exportarLrc.ts`, `shared/ipc.ts`, `vistas/biblioteca/paquete/{letras,textos}.ts`, `vistas/editor/{PanelFunciones,Editor,textos}.ts*`, `navegacion/{IndicadorActividad,DialogoCierre}.tsx`, `main/index.ts` (hook E2E `SHINOBI_LRC_PRUEBAS` para el «Guardar» del `.lrc`, nunca empaquetada), `vistas/anadir/PanelArchivo.tsx`; tests `IndicadorActividad.paquete.test.tsx`, `DialogoCierre.test.tsx`, `PanelFunciones.test.tsx`, `Editor.exportar.test.tsx`, `AnadirCancion.test.tsx`, `letras.test.tsx`, `ipc022.test.ts`, `exportarLrc.test.ts`; E2E `e2e/editor.spec.ts` («Exportar la letra justo tras mover un inicio», F9-E1).
- **Cómo probarlo.** `npx vitest run src/renderer/src/navegacion src/renderer/src/vistas/editor` y `npx playwright test e2e/editor.spec.ts -g letra`.
- **Criterios.** 1 a 5: cumplidos (F9-E1 y F9-E2 con prueba). F9-4 (cierre con un paquete en curso): cubierto en el renderer; la suma en `main/index.ts` no tiene prueba unitaria (la lógica de `ControlCierre` no cambia) y queda para la guía manual: cerrar la app con un paquete creándose.
- **Pendiente manual.** Cerrar la app con «Creando paquete» en curso (Windows, macOS, Linux); `.lrc` desde el editor abierto en VLC.
