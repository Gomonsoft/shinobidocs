# Informe de la feature 5 de 0.2.2 · Preparación desatendida

Tareas: [0306](../../tareas/0306-registro-de-preparacion-y-derivados.md), [0307](../../tareas/0307-cola-automatica-de-lrclib-e-interruptor.md), [0308](../../tareas/0308-servicio-de-preparacion-desatendida.md), [0309](../../tareas/0309-tanda-pausa-paradas-y-reanudar-al-abrir.md), [0310](../../tareas/0310-lista-para-revisar-en-la-biblioteca.md), [0311](../../tareas/0311-preparacion-en-progreso-letra-editor-y-ajustes.md), [0372](../../tareas/0372-avisos-de-tanda-y-pruebas-sin-red-real.md), [0373](../../tareas/0373-motivo-de-la-no-eleccion-en-la-preparacion.md) y [0312](../../tareas/0312-verificacion-e-informe-de-la-feature-5.md) (incluye F6-N7 y F6-N8, pregunta 0220). Decisión: [ADR 0025](../../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) con sus revisiones (incluida la 0236) y ADR 0005 revisado. Guía manual: [feature-5-preparacion-desatendida](../../Test-manuales/0.2.2/feature-5-preparacion-desatendida.md).

**Veredicto: hecha con reservas.** Ejecutado el 2026-11-22 en un Mac M1 sobre **una copia limpia de `10496b8`** (`git worktree`; ver «Cómo se midió»). El CI no se ha consultado (sin PR borrador). Reservas:

1. **Pendiente del usuario, no se marca como cumplido**: un WAV y un vídeo con **red real** hasta «Lista para revisar»; los **5 borradores** del usuario con «Preparar»; el lote grande sin 429; la comprobación con **monitor de red** del interruptor apagado; «Probar» en una TV; y la calibración (`calibrar:encaje`, número de canciones en «Elige la letra» y decisión sobre los fines prudentes, pregunta 0222). La tarea [0371](../../tareas/0371-calibrar-encaje-con-letras-sin-fines.md) (`--variantes`) **sigue pendiente**: en `10496b8` el script no acepta `--variantes` (un programador la está implementando ahora en el árbol de trabajo, sin confirmar); la guía deja ese paso condicionado.
   **Actualización 2026-11-22 ([medidas-con-canciones-reales](medidas-con-canciones-reales.md))**: la tarea 0371 ya está hecha y se ejecutó con 18 canciones del MVP (LRC sin fines y sin revisar): propias aceptadas tal cual 8/17, sin fines 10/17, sin fines + prudentes 13/17; ajenas 6/272, 9/272 y 18/272. **Criterio de adopción de la pregunta 0222: NO se cumple** ((a) sí, (b) 76 % < 90 %, (c) ajenas ≠ 0 ya tal cual); se queda como está ([0277](../../preguntas/0277-criterio-de-adopcion-de-los-fines-prudentes-no-se-cumple.md)). Parte local sin red comprobada con 3 canciones: la preparación pone fines prudentes (1 a 8 líneas de 52 a 86) con `origen_fin: "preparacion"` y recuenta dudosas igual que el script; **«Preparar» no actúa sobre las letras del MVP porque no tienen `intacta`** ([0278](../../preguntas/0278-las-letras-del-mvp-y-de-0-2-1-no-tienen-intacta-y-preparar-no-hace-nada.md)). Sigue pendiente del usuario todo lo que depende de la red real y los 5 borradores.
2. **Defectos** (más abajo): uno medio (D1, la feature 11 en canciones sin registro), tres bajos y un hallazgo de privacidad bajo (D5, pregunta 0243).
3. **Un criterio sin prueba** (F5-B3) y dos parciales (F5-B10, F5-P9).
4. Capturas **sin revisar por el diseñador** y cinco hallazgos de diseño abiertos (pregunta 0244).

## Cómo se midió

Durante la sesión **otros agentes modificaron el árbol de trabajo** (lote, copias, `main/index.ts`, `calibrar-encaje`…) pese a que el encargo decía lo contrario. Para no medir un árbol a medias, la verificación definitiva se hizo en `git worktree add --detach <ruta> 10496b8` (con `app/node_modules` y `worker/.venv` enlazados), añadiendo solo mis cambios de `app/e2e/`. Los primeros resultados en el árbol vivo (typecheck/lint/format limpios, Vitest 4084, 45 + 51 E2E) coinciden con los de la copia. Las capturas salen con `SHINOBI_CAPTURAS_RAIZ` (nuevo) hacia `docs/ux/revisiones/`.

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` / `lint` / `format:check` | Limpios (en la copia limpia, con mis specs) |
| `npx vitest run` (suite completa, una sola instancia; incluye la preparación, las letras, la cola, los avisos, la Biblioteca, Progreso, Letra, Editor y Ajustes) | **302 archivos pasan + 1 omitido; 4084 pruebas pasan, 13 omitidas** (dos veces: árbol vivo y copia) |
| `uv run pytest` / `ruff check` (worker) | **351 pasan**, 7 deseleccionadas / limpio |
| `npm run build` | Correcto |
| E2E de la feature: `preparacion`, `sin-red-real`, `separacion`, `importar-archivo`, `importar-youtube`, `biblioteca`, `biblioteca-acciones`, `letras` | **45 de 45** (+ 2 nuevas de privacidad de YouTube: 47 de 47) |
| E2E del editor: `editor`, `editor-layout`, `editor-preciso` | 51 pasan, 13 omitidas (viewports que macOS no concede y el opt-in de una hora de voz); el conocido `editor-layout:872` no falló esta vez |
| `npm run test:e2e:criticos` | **2 de 2** (23 s), tres ejecuciones seguidas |
| `npx playwright test` completo (3 trabajadores, copia limpia) | **214 pasan, 63 omitidas, 2 fallan**: `ventana.spec.ts` (conocido, Retina) y `letras.spec.ts:401` (se colgó 60 s bajo carga; 1,5 s solo, 3 de 3: **inestable**) |
| Capturas (`SHINOBI_CAPTURAS_022_5=1`, `_11`, `_6`) | 5 + 3 + 2 pruebas, 17 + 10 + 2 capturas |

Reproducido bajo carga (6 procesos): una de las pruebas frágiles de `servicio.test.ts` (pregunta 0240). Conocidos no ejecutados: `editor.spec.ts:410` (pasó).

### Lo que añadí

- **Crítico nuevo** (`e2e/criticos/flujo-principal.spec.ts`): el camino por defecto de 0.2.2: añadir un WAV con el doble de LRCLIB → «Lista para revisar» sola (y `estado` borrador) → «Revisar» → «Marcar como lista» → reproductor. El flujo principal **cambia** (ver más abajo), así que es un segundo crítico y no un matiz. Usa `e2e/fixtures/lrclib/wavConVoz.ts` (extraído de `preparacion.spec.ts`). Sin artista la elección es «Elige la letra», así que el crítico rellena el artista.
- **Privacidad de YouTube** (`importar-youtube.spec.ts`): con el interruptor apagado una descarga hace 0 peticiones al doble que cuenta todo; y su control (activado: sí hay peticiones).
- **F4-E10 y F11-E15** (`editor-layout.spec.ts`): «Funciones» con las tres secciones, un banner y el recorrido activo, sin scroll de página en los **seis** viewports (fijados con CDP: no se omite ninguno en Mac). Pasa.
- **Capturas** de las features 5, 11 (Biblioteca) y 6 (`capturas-022.spec.ts`, bloque `_5`, y `SHINOBI_CAPTURAS_RAIZ`).

## Criterios → evidencia (46: F5-B 11, F5-P 12, F5-L 8, F5-E 5, F5-J 8, F6-N7, F6-N8)

**43 cubiertos con prueba ejecutada · 2 parciales o solo manual · 1 sin cubrir.**

| Criterio | Estado | Evidencia |
|---|---|---|
| F5-B1 | Cubierto | `Biblioteca.preparacion.test.tsx`; `biblioteca.spec.ts` («la preparación se ve…»); captura |
| F5-B2 | Cubierto con matices | Vitest y E2E: «Revisar» y «Probar» (toast, foco, `estado` borrador). **Sin prueba**: portada, Intro y Espacio |
| F5-B3 | **Sin cubrir** | Ninguna prueba cubre el candado en «Revisar» ni el `aria-disabled` de «Probar» con sesión; «sin A la cola» sí (Vitest) |
| F5-B4 | Cubierto | Vitest (elige, no encontrada, pendiente, servicio caído); capturas |
| F5-B5 | Cubierto | Vitest (con y sin línea de origen); E2E (nombre accesible con la línea) |
| F5-B6 | Cubierto | Vitest + servicio (con letra del usuario no la sustituye) |
| F5-B7 | Cubierto | Vitest (cuenta, filtra, quita, 0 = no existe) y E2E (2 listas, filtra, quita); capturas |
| F5-B8 | Cubierto con matices | Vitest de «en vivo» (genérico: sin perder foco ni reordenar); sin el caso concreto «pasa a Lista para revisar» |
| F5-B9 | Cubierto | Vitest + captura real (`bib.prep.retomando` con diario escrito y app reabierta) |
| F5-B10 | Parcial | Nombre accesible (E2E); casillas y teclado **solo manual** (guía, caso 10) |
| F5-B11 | Cubierto | 5 capturas ([abajo](#capturas)) |
| F5-P1 | Cubierto | `Progreso.preparacion.test.tsx`; captura |
| F5-P2 | Cubierto | `preparacion.spec.ts`; `busqueda.automatica.test.ts` (título, artista, álbum, duración) |
| F5-P3 | Cubierto | `preparacion.spec.ts` (elegida por la app, desfasada guardada corregida, nunca Lista) |
| F5-P4 | Cubierto | `servicio.test.ts` y `eleccion.test.ts` (varias, sin exacta, solo texto, duda, no coincide); capturas R2 y R3 |
| F5-P5 | Cubierto | `servicio.test.ts` (reintento y luego `error` + pendiente); R4 (Vitest y captura) |
| F5-P6 | Cubierto | `silencios.test.ts` y `servicio.test.ts` («con tiempos tocados… ningún fin»; letra con fines fijados) |
| F5-P7 | Cubierto | `servicio.test.ts` («una letra que el usuario elige mientras se espera la separación no se sustituye») |
| F5-P8 | Cubierto en el toast del renderer | `useAvisosPreparacion.test.tsx`. **Sin cubrir** la notificación del sistema sin foco (D6) |
| F5-P9 | Parcial | Solo capturas (⟳ en Letra mientras busca, indicador de atención en R2-R4) |
| F5-P10 | Cubierto | E2E `separacion.spec.ts` (dos cierres seguidos → «Interrumpido»; cerrar con una en curso y otra en cola y reabrir las retoma en orden) y `cola.test.ts` (gestor real + diario) |
| F5-P11 | Cubierto | `preparacion.spec.ts` y crítico (`estado` sigue en borrador) |
| F5-P12 | Cubierto | 5 capturas |
| F5-L1 a L5, L7 | Cubierto | `Letra.preparacion.test.tsx` |
| F5-L6 | Cubierto | `servicio.test.ts` («con una letra ya guardada no busca…») |
| F5-L8 | Cubierto | 2 capturas |
| F5-E1 a E4 | Cubierto | `Editor.preparacion.test.tsx`, `modelo.test.ts` (incluye una línea tocada a mano conserva su fin) |
| F5-E5 | Cubierto | Captura |
| F5-J1, J7 | Cubierto | `PreparacionAjustes.test.tsx` |
| F5-J2 | Cubierto | E2E `importar-archivo` («privacidad») y `importar-youtube` («privacidad», nuevo), con un doble que cuenta todas las peticiones; Vitest `busqueda.automatica` (apagado = 0). **Hallazgo D5** con el `HEAD` |
| F5-J3 | Cubierto | `busqueda.automatica.test.ts` y `preparacion.spec.ts` (sin cookies, una a la vez); `sin-red-real.spec.ts` |
| F5-J4 | Cubierto | `busqueda.automatica.test.ts` («a mitad de cola») |
| F5-J5 | Cubierto, con defecto D4 | Vitest. El recuento de Ajustes (7 en la semilla) no coincide con la casilla (3) |
| F5-J6 | Cubierto | `AcercaDe.test.tsx` («Búsqueda automática de letra: activada») |
| F5-J8 | Cubierto | 3 capturas |
| F6-N7 | Cubierto | `CamposDatos.lrclib.test.tsx`, `origen.test.ts` («Quitar» no se vuelve a rellenar), `preparacion.spec.ts` (álbum de LRCLIB con su origen); captura |
| F6-N8 | Cubierto | `AvisoBusqueda.test.tsx`; visible en `anadir-…-unificar.png` |

**Criterios de «hecha» del backlog**: «un WAV y un vídeo llegan solos con el doble» → cubierto (E2E y crítico; el vídeo de YouTube con el doble en `importar-youtube`, sin voz sintética: llega hasta la separación y la búsqueda); «**con red real**» → solo manual; «5 borradores» → solo manual; «interruptor apagado = 0 peticiones al añadir» → **cubierto** (archivo y YouTube), con la observación de D5; «cerrar con trabajos en cola y volver a abrir los reanuda» → **cubierto** (E2E de separación y de descarga de YouTube; la corrida de **preparación** retomada solo en Vitest).

## Revisión de código frente al ADR y la spec

- **Privacidad.** `ServicioPreparacion.alFuenteLista` (`main/preparacion/servicio.ts:227`) no hace nada con el interruptor apagado (ni registro ni petición); la búsqueda automática ni se encola (`BusquedaLetras`, 0307); «Preparar» es `explicita`. Comprobado con E2E y el doble en archivo y YouTube. **D5**: la vigilancia de conexión (`main/preparacion/cola.ts:360-376`, `main/index.ts:865-876`) hace un `HEAD` a la base de LRCLIB cada 60 s tras un `SIN_CONEXION` de descarga **sin mirar el interruptor**. Reproducido en un E2E de 135 s (llega `HEAD /` al doble con el interruptor apagado); no lleva datos, pero es una conexión a lrclib.net con la IP.
- **Sin texto de letra en el registro.** `preparacionSchema` solo guarda `busqueda.{resultado, candidatas, motivo, no_elige, ids ≤ 10}`, `eleccion`, `fines`, contadores y `error {codigo, mensaje}`; `letra.datos_lrclib` es `{titulo, artista, album}` (`shared/letra.ts:292-300`). Los `registrar(...)` del servicio escriben ids y códigos (`servicio.ts:383, 509, 695, 709`). El E2E `preparacion.spec.ts` comprueba que el JSON de `preparacion` no contiene el texto de una letra no elegida. **Conforme.**
- **Reanudación.** `reanudarAlAbrir` y el diario (`main/trabajos/diario.ts`), con 0, 1 y 2 interrupciones (Vitest) y los E2E de arriba. **El arreglo de la pregunta 0236** (`app.solicitudCierrePendiente`, `main/cierre.ts`) lo ejercita el E2E «cierre con trabajos» (cierra sin esperar al progreso, 3 de 3 en la regresión). Dos interrupciones seguidas dejan «Interrumpido»: E2E. En el árbol de trabajo hay una tarea nueva (0374, red de seguridad del cierre) a medias: no se ha medido.
- **El flujo principal cambia para el usuario, y está especificado.** Con la casilla por defecto, añadir una canción llega solo a «Lista para revisar»; ese estado se **deriva de los pasos** y «da igual si lo hizo la app o el usuario» ([02 · estados](../../ux/02-biblioteca.md): «◔ Lista para revisar … Da igual si lo hizo la app o el usuario»), así que una canción hecha a mano y sin marcar también lo es, con «Revisar» como acción («Abre el Editor … con la feature 11, en su revisión guiada»; F11-B2). La autoescucha y el zoom están en [06 · Feature 11](../../ux/06-editor.md) (F11-E4: «suena su tramo… con “Escuchar cada línea al llegar” desmarcada no suena», casilla «marcada por defecto»; «Al llegar a una línea… Zoom a la línea si la región mide menos de 120 px»). **Conforme a la spec.** Lo que **no** dice es si debe sonar sola también para una canción propia (pregunta 0244, punto 2). Críticos actualizados.
- **Menú ⋯ y scroll a 1024 × 576/640.** La Biblioteca y Ajustes son vistas con scroll propio y la spec no exige «sin scroll» para ninguna: **conforme**. La bandeja baja la rejilla (la primera fila empieza hacia y = 280 px). Que `MenuContextual` se cierre al desplazar cualquier contenedor (`componentes/MenuContextual.tsx:151`) no está en la spec del menú: hallazgo para el diseñador (0244, punto 1).
- **Frágiles de `servicio.test.ts`** (cancelar y eliminar durante una corrida): **inestables de la prueba bajo carga**, reproducido 1 de 3 con 6 procesos de CPU. Usan esperas fijas de 20-30 ms como sincronía y la parada de `pasoEsperar` solo ocurre si la corrida vio antes `en_curso` (`servicio.ts:455-463`); puede ocultar un borde real (la cancelación de una separación que la corrida no llegó a ver `en_curso`). Cómo hacerlas robustas y la duda de producto: pregunta [0240](../../preguntas/0240-pruebas-fragiles-de-servicio-test-de-la-preparacion.md).

## Defectos

- **D1 · Una «Lista para revisar» sin registro de preparación no tiene línea ⚑ ni diálogo de pendientes** (media; `app/src/renderer/src/vistas/biblioteca/TarjetaCancion.tsx:507`, `useMarcarRevision.tsx:86`, `main/biblioteca/resumen.ts:61-90`). Es la canción hecha a mano o un borrador de 0.2.1 completo. Contradice F11-B1 y F11-B3 («la misma decisión en el editor y en la Biblioteca»). Visto en `biblioteca-1280x800-100-bandeja-filtrada.png`. Pregunta [0241](../../preguntas/0241-linea-y-dialogo-de-revision-no-existen-en-listas-para-revisar-sin-registro.md).
- **D2 · El toast «está lista para revisar» no pide la revisión guiada** (media-baja; `navegacion/useAvisosPreparacion.ts:68`). F11-E11. Pregunta [0242](../../preguntas/0242-defectos-menores-de-la-feature-5-y-11-hallados-en-la-verificacion.md).
- **D3 · La vista de progreso marca como lista sin preguntar** (media-baja; `vistas/progreso/Progreso.tsx:259`, `useProbar()` sin `pedirMarcar`). F11-B3. Pregunta 0242.
- **D4 · «Tienes n borradores sin letra» de Ajustes no cuenta como la bandeja** (baja-media; `vistas/ajustes/PreparacionAjustes.tsx:70-76`). En la semilla dice 7 y la casilla «Esperan letra» a la que lleva muestra 3. F5-J5. Pregunta 0242.
- **D5 · El `HEAD` de comprobación de conexión sale con el interruptor apagado** (baja, privacidad; `main/preparacion/cola.ts:360-376`). Pregunta [0243](../../preguntas/0243-comprobacion-de-conexion-contra-lrclib-con-el-interruptor-apagado.md).
- **D6 · Sin notificación del sistema al terminar una preparación individual** (baja, por confirmar; `main/avisos/servicio.ts`, spec 04: «Con la ventana sin foco, la notificación de siempre»). Pregunta 0242.
- **D7 · Posible toast duplicado** («ya se puede marcar como lista» de main y «está lista para revisar» del renderer): por comprobar a mano (guía, caso 1.5).
- **D8 · Borde de la cancelación de una separación no vista en `en_curso`** (baja): pregunta 0240.

## Capturas

`docs/ux/revisiones/0.2.2-feature-5/` (1280 × 800 a 100 %, DPR 1 forzado; 1280 × 720 el editor y 1024 × 640 una; semilla con títulos, artistas y letras inventados; **las 17 abiertas con Read una a una**): `biblioteca-1280x800-100-{lista-para-revisar, bandeja, bandeja-filtrada, retomando}`, `biblioteca-1024x640-100-bandeja`, `progreso-1280x800-100-{preparando, lista-para-revisar, elige-la-letra, no-encontrada, letra-pendiente}`, `letra-1280x800-100-{elegida-sola, elige-la-letra}`, `editor-1280x720-100-preparacion-automatica`, `ajustes-1280x800-100-{letras, letras-desactivada, letras-pendientes}` y `anadir-1280x800-100-editar-datos-lrclib`. Y en `0.2.2-feature-6/`: `anadir-1280x800-100-unificar.png` y `biblioteca-1280x800-100-editar-datos-unificar.png` repetidas con el foco en el campo y la sugerencia a la vista (D1 de la feature 6 corregido; el formulario se desplaza para que se vean los botones).

Notas: «preparando», «Elige la letra» y «no-encontrada» salen de flujos reales (doble de LRCLIB y separador falso); «lista-para-revisar» de Progreso se toma desplazada hasta «Revisar» (a 800 px de alto no cabe, 0244 punto 4); «letra-pendiente» y las de la Biblioteca parten de registros escritos en el JSON de la semilla (la espera real es de 60 s); «retomando» es real (diario + reapertura). Aún no las ha visto el diseñador.

## Guía manual

[`feature-5-preparacion-desatendida.md`](../../Test-manuales/0.2.2/feature-5-preparacion-desatendida.md): 10 casos (los 3, 4 y 9 son criterios de «hecha»).

## Archivos tocados

`app/e2e/criticos/flujo-principal.spec.ts`, `app/e2e/importar-youtube.spec.ts`, `app/e2e/editor-layout.spec.ts`, `app/e2e/capturas-022.spec.ts`, `app/e2e/preparacion.spec.ts` (el generador de WAV pasó a `app/e2e/fixtures/lrclib/wavConVoz.ts`, nuevo), `docs/pruebas.md`, guías y su índice, este informe, las preguntas 0240-0244 y las tareas 0312 y 0337. Ningún código de producción.
