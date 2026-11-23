# Informe de la feature 11 de 0.2.2 · Revisión guiada de líneas dudosas

Tareas: [0334](../../tareas/0334-deteccion-de-lineas-dudosas.md), [0335](../../tareas/0335-modo-revisar-en-el-editor.md), [0336](../../tareas/0336-revision-guiada-desde-la-biblioteca.md), [0370](../../tareas/0370-retirar-origen-fin-al-editar-un-fin-a-mano.md) y [0337](../../tareas/0337-verificacion-e-informe-de-la-feature-11.md). Decisión: [ADR 0024](../../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md). Spec: [06 · Feature 11](../../ux/06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas) y [02 · Biblioteca](../../ux/02-biblioteca.md) (F11-B). Guía manual: [feature-11-revision-guiada](../../Test-manuales/0.2.2/feature-11-revision-guiada.md). Cifras de las pruebas de comandos compartidas con el [informe de la feature 5](informe-feature-5.md#pruebas-de-feedback) (misma copia limpia de `10496b8`).

**Veredicto: hecha con reservas.** Reservas:

1. **Pendiente del usuario, no se marca como cumplido**: `npm run calibrar:dudosas -- <carpeta>` sobre sus canciones ya revisadas (criterio de «hecha»: **≤ 10 %** de líneas señaladas), cuántos errores reales señala y cuántos no, y el recorrido sin ratón con lector de pantalla. En este equipo no está la biblioteca real; el script se probó solo con fixtures sintéticos (`scripts/calibrar-dudosas.test.ts`, que pasa).
2. **D1 (media)**: una «Lista para revisar» sin registro de preparación no tiene línea ⚑ ni diálogo de pendientes (F11-B1/B3) — justo las canciones hechas a mano o de 0.2.1.
3. **El toast «está lista para revisar» no pide la revisión** (F11-E11, D2) y la vista de progreso marca sin el diálogo (F11-B3, D3).
4. Capturas **sin revisar por el diseñador** tras R1–R6 y un hallazgo de diseño (autoescucha para canciones propias).

## Pruebas de feedback

Las de la feature 5 valen aquí (suite Vitest completa 4084 pasan; build; críticos 2 de 2; regresión completa 214 / 63 omitidas / 2 fallos conocidos o inestables). Específicas:

| Comando | Resultado |
|---|---|
| Vitest de la feature (`shared/dudosas`, `shared/silencios`, `main/letras/dudosas`, `scripts/calibrar-dudosas`, `Editor.revision`, `estado`, `atajos`, `PanelFunciones`, `editor/revision`, `Biblioteca.preparacion`) | pasan dentro de la suite completa |
| E2E `editor.spec.ts` «revisión guiada: dos líneas dudosas…» (marcas ⚑, recorrido, «Fin al final de la voz» como un paso con `origen_fin: "silencios"`, «Está bien» persistido y deshecho, Esc) | pasa |
| E2E nuevo `editor-layout.spec.ts` «F4-E10: Funciones…» (**también F11-E15 con el recorrido activo**) | **pasa en los seis viewports** (CDP; ninguno se omite en Mac) |
| Crítico nuevo («añadir un archivo con la preparación automática, revisar, marcar como lista y cantar») | pasa (3 de 3). Con la voz sintética hay 0 pendientes, así que ve «Revisión terminada»; el bucle de «Está bien» no se ejercita (fijo a propósito para no depender de los umbrales) |
| Capturas (`SHINOBI_CAPTURAS_022_11=1`) | 3 pruebas, 10 + 8 capturas del editor y 2 de la Biblioteca |

## Criterios → evidencia (20: F11-E1 a E16 y F11-B1 a B4)

**18 cubiertos con prueba ejecutada · 1 solo manual (E14) · 1 con defecto (E11).**

| Criterio | Estado | Evidencia |
|---|---|---|
| F11-E1 | Cubierto | `shared/dudosas.test.ts` (un caso por motivo, umbrales con nombre). La parte «≤ 10 % con las canciones de referencia» es la calibración: **pendiente del usuario** |
| F11-E2 | Cubierto | `Editor.revision.test.tsx` (sin voz solo `sinInicio`, `muyCorta`, `muyLarga`; el número se actualiza al leer la voz) |
| F11-E3 | Cubierto | `Editor.revision.test.tsx` (⚑ con motivo, Ctrl+↓, «Está bien» fuera del recorrido); capturas |
| F11-E4 | Cubierto | `Editor.revision.test.tsx`; preferencia en `shared/config.test.ts` |
| F11-E5 | Cubierto | Vitest + E2E (persiste al reabrir; deshacer) |
| F11-E6 | Cubierto | `dudosas.test.ts` (`revisadaVigente`), `estado.test.ts`, `servicio.test.ts` de letras (`offset_ms` retira `revisada`) |
| F11-E7 | Cubierto | Vitest + E2E (un paso del historial, `origen_fin: "silencios"`) |
| F11-E8 | Cubierto | `Editor.revision.test.tsx`; captura `recorrido-corregida` |
| F11-E9 | Cubierto | Vitest (R, Esc, «fuera»); captura `recorrido-fuera` y `recorrido-otra-pestana` |
| F11-E10 | Cubierto | Vitest + captura `recorrido-fin`; `estado` no cambia solo (críticos y `preparacion.spec.ts`) |
| F11-E11 | **Con defecto** | «Revisar» de la tarjeta, del diálogo de resultado y de la vista de progreso: Vitest. **El toast** `prog.toast.revisar` abre el editor sin `revisar: true` (D2, `useAvisosPreparacion.ts:68`) |
| F11-E12 | Cubierto | `dudosas.test.ts` (un caso por motivo), `Editor.revision.test.tsx` (3 pruebas), E2E; la misma función `esImportante` sirve a los dos sitios (`shared/dudosas.ts:187`) |
| F11-E13 | Cubierto | `Editor.revision.test.tsx` («N no hace nada» fuera del recorrido), `atajos.test.ts` |
| F11-E14 | **Solo manual** | Todo con teclado: guía, caso 5 |
| F11-E15 | Cubierto | E2E de los seis viewports con el recorrido activo (nuevo) y capturas a 1280 × 720 (100 % y 125 %) y con el panel a 300 px: «Está bien» se ve entero sin desplazar y muestra la tecla **N**, sin número; en la línea corregida solo hay un «Siguiente» |
| F11-E16 | Cubierto | 17 capturas + `recorrido-otra-pestana` + `recorrido-panel-300`; **`banner-revision` pasa a la feature 5** (se ve en la captura de la preparación y el banner del editor tiene su Vitest) |
| F11-B1 | Cubierto, con D1 | `Biblioteca.preparacion.test.tsx`; captura. Solo si la canción tiene registro |
| F11-B2 | Cubierto | `Editor.revision.test.tsx` (con `revisar`: recorrido empieza solo y, con 0, «Revisión terminada») y el crítico nuevo |
| F11-B3 | Cubierto, con D1 y D3 | 5 pruebas (mismo recuento que el editor, solo ritmo/fin automático no pregunta, línea sin voz es importante); captura del diálogo con el foco en «Revisar ahora» |
| F11-B4 | Cubierto | `biblioteca-1280x800-100-lista-para-revisar.png` (tarjeta con 4 líneas, otra «Sin líneas dudosas», menú ⋯ abierto con «Marcar como lista» y «…letra lista») y `biblioteca-1280x800-100-revision-dialogo.png` |

**0370** (`origen_fin` se retira al editar un fin a mano): `sinOrigenFinCambiado` en `estado.ts` y sus pruebas (`estado.test.ts`) pasan; «Ajustar los silencios» conserva su `origen_fin`. **Conforme.**

**Criterios de «hecha» del backlog**: «≤ 10 % en las revisadas» → **pendiente del usuario**; «una línea dada por buena no vuelve salvo que cambie» → cubierto (Vitest y E2E); «“Fin al final de la voz” es un paso de deshacer» → cubierto (Vitest y E2E).

## Revisión de código frente al ADR y la spec

- **La regla de «importantes» es la misma en el editor y en la Biblioteca**: `esImportante`/`contarImportantes` (`shared/dudosas.ts:183-198`) la usan `Editor.tsx:634` (en vivo) y `main/letras/dudosas.ts:26` → `preparacion.dudosas_importantes` → `useMarcarRevision.tsx:86`. Conforme **mientras la canción tenga registro**; sin él, D1.
- **Huecos que declaró el programador en 0336**, clasificados contra la spec: (a) «el toast de preparación terminada… no pide la revisión» → **defecto** (F11-E11 incluye los toasts); la causa es el toast del renderer (`useAvisosPreparacion.ts:68`), no uno de main; (b) «la vista de progreso marca como lista sin el diálogo de pendientes» → **defecto** (F11-B3 nombra el toast tras «Probar», que en Progreso sale de `useProbar()` sin `pedirMarcar`, `Progreso.tsx:259`). Pregunta [0242](../../preguntas/0242-defectos-menores-de-la-feature-5-y-11-hallados-en-la-verificacion.md); D1 en la [0241](../../preguntas/0241-linea-y-dialogo-de-revision-no-existen-en-listas-para-revisar-sin-registro.md).
- **Autoescucha y zoom al entrar con «Revisar»**: especificados (F11-E4; «Al llegar a una línea»), conformes. Lo que no dice la spec (si debe sonar sola para una canción propia) va al diseñador (pregunta [0244](../../preguntas/0244-hallazgos-de-diseno-de-las-features-5-y-11-sin-especificar.md), punto 2).
- **R4 de la revisión del diseñador**: confirmado con el fixture: la línea 2 tiene `fin_ms` explícito, así que «El fin llega 3,0 s después de la voz» y el recuento de 2 son correctos. No hay defecto.
- **Deuda de 0335 declarada**: «`origen_fin` no se retira en el reducer» → resuelta por 0370; «la marca `revisada` en memoria no se retira al editar la línea (el detector la ignora si ya no es vigente)» → conforme con F11-E6.

## Defectos

D1 (media), D2 y D3 (media-baja): ver arriba y el [informe de la feature 5](informe-feature-5.md#defectos), que los comparte.

## Capturas

`docs/ux/revisiones/0.2.2-feature-11/` (**sustituyen a las anteriores**, a 1280 × 720 al 100 % y al 125 % el editor; 1280 × 800 la Biblioteca; abiertas con Read una a una las de la tarjeta, la Biblioteca y la de otra pestaña):

- **R1 resuelta** (`recorrido`, `recorrido-corregida`, `recorrido-fin`, `recorrido-panel-300`, 100 % y 125 %, mirados): «✓ Está bien» a todo el ancho justo bajo el motivo, **entero, sin desplazar el panel**, también con el panel a 300 px; lo de debajo (Escuchar otra vez, «Fin al final de la voz») queda parcialmente tapado por el scroll propio del panel, que la spec admite.
- **R2 y R3 resueltas**: el botón muestra la **tecla N** (gris, a la derecha), no un número; en «Línea ya corregida» solo hay un «Siguiente» (el «Anterior» queda solo en la navegación).
- **R5 resuelta**: ✓ delante de «Has revisado las 2 líneas señaladas…» en `recorrido-fin`.
- **R6 resuelta** (`recorrido-otra-pestana`, nueva): con «Funciones» abierta, la pestaña «Sincronía» lleva el icono `flag` (no un punto).
- **Biblioteca** (F11-B4): `biblioteca-1280x800-100-lista-para-revisar.png` y `biblioteca-1280x800-100-revision-dialogo.png` (el diálogo dice «2 líneas» mientras la tarjeta dice «4 líneas por revisar»: es la regla de 02, importantes frente a total).
- `banner-revision` no se toma aquí: va con la feature 5 (`editor-1280x720-100-preparacion-automatica.png`).

Aún no las ha visto el diseñador. Observación de captura: el fixture del recorrido deja la canción en «Lista» y el panel de fin muestra «Hecho» resaltado, no «Marcar como lista» (a propósito: es el caso de la spec «en una Lista resalta Hecho»); el popover de pendientes usa un borrador.

## Guía manual

[`feature-11-revision-guiada.md`](../../Test-manuales/0.2.2/feature-11-revision-guiada.md): 7 casos (el 1 es la calibración, criterio de «hecha»).

## Archivos tocados

Los mismos que en la [feature 5](informe-feature-5.md#archivos-tocados) (`editor-layout.spec.ts` y `capturas-022.spec.ts` incluyen lo de esta feature). Ningún código de producción.
