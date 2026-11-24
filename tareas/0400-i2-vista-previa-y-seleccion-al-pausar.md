# 0400 — I-2 · Qué muestran la vista previa y la selección al pausar
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: spec 06 (plan 6, «Vista previa en pausa: manda el cabezal»; decisión provisional 0387)
- Versión: 0.2.3 ([incidencia I-2](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md))

## Investigación (qué hace hoy el código)
- `Editor.tsx` pasa `idEstatico={edicion.seleccion}` a `PantallaLetra` (vista previa). Con `reproduciendo = false`, `PantallaLetra.tsx` usa `fotogramasEstaticosDeZonas(zonas, letra, idEstatico, pantalla)`: el fotograma estático de la **línea seleccionada** (mitad resaltada) y la siguiente, sin mirar el cabezal. Es lo que dice la spec 06 (criterio 33: «en pausa, muestra la línea seleccionada con la mitad resaltada y la siguiente debajo»). Por eso las tres capturas son idénticas.
- La selección no sigue al cabezal: durante la reproducción solo la lista marca la línea que suena (`actual={sonando ? indiceLineaActual(letra, posicion) : -1}`, ▶), la selección (`edicion.seleccion`) cambia solo por acciones del usuario. Al pausar, el cabezal queda donde esté y la selección sigue en la línea 1.
- Sin reparto ocurre igual: nada en esa ruta depende de `partes`.
- Preexistente: sí. En `v0.2.1` la misma línea `idEstatico={edicion.seleccion}` y `actual={sonando ? indiceLineaActual(...) : -1}` (Editor.tsx 1456 y 1416), y `idEstatico` viene de la tarea 0105 (MVP). No es una regresión de 0.2.3.
- Opciones para el diseñador: (a) en pausa la vista previa muestra el instante del cabezal (`calcular(posicion)`) y la selección queda; (b) al pausar la selección salta a la línea del cabezal; (c) ambas.

## Notas de implementación
**Qué se hizo** (spec 06 plan 6, I2-1 a I2-10):
- `Editor.tsx`: estado `modoPrevia` (`cabezal` | `linea`, inicia en `linea`) que se ajusta durante el render al cambiar `sonando` (pausar o fin de un tramo → Cabezal), la selección o la letra en pausa (→ Línea), terminar «Sincronizar al ritmo» o la prueba a pantalla completa (→ Cabezal); `buscar()` en pausa → Cabezal y `seleccionar()` (también clic en la ya seleccionada) en pausa → Línea. Sin líneas con tiempo, siempre Línea. La selección no se toca nunca.
- Escuchas que vuelven solas (comprobación y ▶ Palabra): `EscuchaComprobacion` avisa con `eventos` (`alIniciar`, `alTerminar`, `alCancelar`) y el editor guarda el modo previo y lo restaura (`enEscucha`, `modoGuardado`); si el usuario interrumpe (Espacio, buscar) se descarta.
- Vista previa: en Cabezal pasa `tiempoFijoMs={motor.posicionMs()}` a `PantallaLetra` (el mismo `calcular` que el reproductor, ADR 0019); en Línea, `etiqueta` = `E.previaLinea(n)` («Línea n (en pausa)»), con `aria-hidden` (también la de «Ejemplo»).
- Lista: `ListaLineas` recibe `actuales` (ids) en pausa: ▶ en las líneas que suenan en el cabezal (todas en un solape, ninguna en un hueco); sonando sigue como antes (`actual`).
**Pruebas.** `Editor.previa.test.tsx` (motor falso reactivo y sonda en lugar de `PantallaLetra`): I2-1, I2-2, I2-3, I2-4, I2-6, I2-10 y selección sonando; `escuchaComprobacion.test.ts` (eventos). E2E sin ejecutar: `app/e2e/editor-previa-pausa.spec.ts` («pausar lejos de la línea seleccionada enseña el cabezal»).
**No cubierto con prueba:** I2-5 (volver al modo tras la comprobación) solo a nivel de eventos de `EscuchaComprobacion`, no extremo a extremo en el editor; I2-7 (solape, ▶ en dos filas) por lectura del código, sin test; I2-8 (editor preciso: modos con el borrador, acciones de palabras que no cambian el modo) por diseño (no tocan selección ni letra hasta aplicar), sin test; I2-9 (revisión guiada) sin test. A comprobar a mano.
**Investigación previa** (preexistente de 0.2.1: `idEstatico={edicion.seleccion}` y `actual={sonando ? … : -1}` ya estaban allí, tarea 0105): se conserva en el historial de este archivo en git.
