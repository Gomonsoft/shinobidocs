# 0156 — Contratos de las features 1 a 3 de 0.2.2 para las specs

- De: disenador-ux
- Para: arquitecto
- Estado: Respondida
- Bloquea: no (las specs usan los provisionales de abajo; si tu decisión difiere, se ajusta la spec)

## Contexto

Specs definitivas de las features 1 (letra en pantalla, propuesta 018), 2 (resaltado que no depende solo del color, propuesta 033) y 3 (aviso de versión nueva, propuesta 026):

- [07 · Feature 1](../ux/07-reproductor.md#022--feature-1--letra-en-pantalla-con-varios-enunciados) y [Feature 2](../ux/07-reproductor.md#022--feature-2--resaltado-que-no-depende-solo-del-color)
- [06 · Feature 1](../ux/06-editor.md#022--feature-1--letra-en-pantalla) y [Feature 2](../ux/06-editor.md#022--feature-2--resaltado-que-no-depende-solo-del-color)
- [sistema visual · Feature 1](../ux/sistema-visual.md#022--feature-1--letra-en-pantalla), [Feature 2](../ux/sistema-visual.md#022--feature-2--resaltado-accesible) y [Feature 3](../ux/sistema-visual.md#022--feature-3--aviso-de-versión-nueva)
- [10 · Feature 1 y 2](../ux/10-exportacion.md#022--feature-1--letra-en-pantalla-en-el-video)
- [08 · Feature 2 y 3](../ux/08-ajustes-y-acerca.md#022--feature-3--aviso-de-versión-nueva), [09 · Feature 3](../ux/09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva)

Las specs describen lo que se ve y los nombres de datos que cito son **provisionales**: decide tú los definitivos.

## Pregunta

### Feature 1 · Letra en pantalla

1. **Esquema.** Provisional: bloque opcional `estilo.pantalla: { lineas: 2..7, pasadas: 0..2, transicion: "desplazamiento" | "fundido" | "ninguna" }` dentro de `estilo` v1, sin subir esquemas. Ausente = `{ 5, 1, "desplazamiento" }` (decisión 2 del plan: lo existente pasa a 5 líneas sin reescribir nada). `pasadas` guarda lo **elegido** aunque `lineas` no lo permita; el valor efectivo es `mín(pasadas, máximo para lineas)`. ¿Nombres y normalización?
2. **Reemplazo por canción.** Provisional: `apariencia.reemplazos.pantalla` (bloque completo) en la lista blanca, con las mismas reglas que `reemplazos.espera` (se conserva al cambiar de tema o volver a heredar; se congela al borrar el tema), y una `procedenciaPantalla` como `procedenciaEspera`. ¿Conforme?
3. **Compatibilidad hacia atrás.** Una canción de 0.2.2 abierta en 0.2.1 se verá con 2 líneas (Zod descarta la clave). ¿Algún riesgo de que 0.2.1 la reescriba y pierda el bloque?
4. **Modelo de render.** `FotogramaLetra` entrega hoy `actual` y `siguiente`. La spec necesita, como función pura del tiempo: lista de líneas visibles con centro, escala, opacidad, color y, en «Fundido», dos copias por línea durante el cambio. Reglas exactas (relevo si el hueco es menor que `D`; duración `mín(D, 60 % de la duración de la línea)`; instantáneo por debajo de 120 ms; curva `1 − (1 − x)³`; retirada a los 2 s con fundido de 400 ms) en 07 · Feature 1. ¿Algo de esto es inviable o conviene otra formulación equivalente?
5. **Curva.** He fijado la forma cerrada `1 − (1 − x)³` en lugar del `cubic-bezier(0.22, 1, 0.36, 1)` de la exploración, para que el fotograma se calcule sin resolver una Bézier. ¿Conforme?
6. **Movimiento reducido.** Equivale a `transicion: "ninguna"` (`D = 0`), con el parámetro explícito `movimiento` del ADR 0019 §2 (el video pasa siempre `'completo'`). ¿Conforme?
7. **Gris de la letra y suelo de contraste.** Provisional: gris neutro con la misma luminancia relativa WCAG que `letra.color`; mezcla de «ya cantado» a gris lineal en sRGB; suelo de contraste = opacidad mínima que da 3:1 contra cada muestra del fondo de `muestrasFondo` (compuesta sobre esa muestra), calculado una vez por estilo resuelto. ¿Dónde vive (`contraste.ts`) y en qué espacio de color?
8. **Medición de renglones.** A tamaño `S` para hasta `N + 1` líneas, una vez por línea y por tamaño de ventana. ¿Efecto en el barrido por renglón de 0.2.0 y en la captura offscreen?
9. **Rendimiento.** Hasta 8 líneas (16 copias en «Fundido») con transformación, opacidad y color por fotograma, sin volver a renderizar React, con el fondo en movimiento, en un equipo modesto, en la secundaria y en la captura. ¿Hace falta una prueba técnica antes de las tareas?
10. **Medidas de referencia.** Las cifras de la exploración se sacaron a mano. ¿Puedes repetirlas con un script sobre las canciones «Lista» antes de fijar los umbrales de 120 ms y 2 s?

### Feature 2 · Resaltado accesible

11. **Esquema.** Provisional: `estilo.letra.subrayar_cantado: boolean` opcional (ausente = `false`), parte del estilo (sin reemplazo por canción), y `config.reproductor.subrayar_cantado: boolean` (por defecto `false`). El valor efectivo es el «o» de los dos y se resuelve al tomar la instantánea de reproducción; la exportación usa solo el del estilo. ¿Nombres y dónde se resuelve?
12. **Aviso de daltonismo.** Provisional: simular protanopía y deuteranopía (matrices de Machado et al. 2009, severidad 1,0, en RGB lineal) sobre `letra.color` y `color_resaltado`, y avisar si el menor ΔE (CIE76) de las dos simulaciones es < 25, con ΔE normal ≥ 25. Si lo ves caro o poco fiable, alternativa: diferencia de luminosidad `|ΔL*|` < 15. ¿Cuál?
13. **Dibujo del subrayado.** La spec solo exige que mida lo mismo que la parte pintada de cada renglón y que no cambie la caja de la línea. ¿Lo dibujas en la capa de resaltado (se recorta con el mismo barrido)?

### Feature 3 · Aviso de versión nueva

14. **Consulta.** Provisional: desde main, `GET https://api.github.com/repos/Gomonsoft/shinobi-karaoke/releases?per_page=30` sin autenticar (incluye preliminares; `/releases/latest` solo da estables), con `net.fetch`, tiempo máximo de 10 s y `User-Agent: Shinobi-Karaoke/<versión>`, sin ninguna otra cabecera ni parámetro propio. Es un **host nuevo** para main (ADR 0008). ¿Fuente, caché (`ETag`) y límites?
15. **Qué sale del equipo.** La spec promete: nada más que esa petición (GitHub ve la IP y el nombre y la versión de la app), sin identificador de instalación, sin sistema operativo, sin datos de la biblioteca. ¿Puedes garantizarlo con `net.fetch` (cookies, cabeceras por defecto de Chromium)?
16. **Configuración e IPC.** Provisional: `config.actualizaciones: { avisar: boolean (true), ultima_comprobacion: fecha | null, disponible: versión | null, vista: versión | null }`; `actualizaciones.estado()`, `actualizaciones.comprobar()` y un evento de cambio. ¿Nombres?
17. **Comparación.** Precedencia SemVer 2.0 sobre la versión (no sobre el número de compilación). Solo cuentan las etiquetas con el formato del ADR 0020 §2, publicadas y no borrador. Canal `publicada` sin sufijo: solo estables; con sufijo: preliminares y estables. `desarrollo` y `local`: no se consulta nunca. ¿Conforme?
18. **Enlaces.** La app **construye** los enlaces a partir de la versión (`…/releases/tag/v<versión>` y `…/releases/download/v<versión>/<archivo de este sistema>`), nunca abre una URL que venga en la respuesta. Caben en `ENLACES_PERMITIDOS`. En Linux, provisional: «Descargar» abre la página de la versión. ¿Se puede saber con fiabilidad si la app corre como AppImage (`APPIMAGE`) o como `.deb` para dar la descarga directa?
19. **Cuándo.** 10 s después de mostrar la ventana principal si han pasado 24 h desde `ultima_comprobacion`, y cada 24 h con la app abierta. También durante el primer arranque. ¿Algún problema con el reposo del equipo o con la sesión en otra pantalla?
20. **Pruebas.** ¿Doble HTTP local solo sin empaquetar, como `SHINOBI_LRCLIB_URL`, y forma de simular el canal `publicada` en E2E?

## Opción provisional tomada (si no bloquea)

Los provisionales de cada punto. Las specs no dependen de los nombres.

## Respuesta

Arquitecto, 2026-11-21. Decisiones en el [ADR 0022](../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) (features 1 y 2) y el [ADR 0023](../adr/0023-aviso-de-version-nueva-con-github-releases.md) (feature 3). Casi todo se acepta tal cual; **cambian** §2 (nombre del reemplazo) y la frase de privacidad de §15.

**Feature 1**
1. Aceptado: `estilo.pantalla: { lineas, pasadas, transicion }` con `transicion` `"desplazamiento" | "fundido" | "ninguna"`, ausente = `{ 5, 1, "desplazamiento" }`, `pasadas` guarda lo elegido y el efectivo es `pasadasEfectivas()`. Además, **lectura tolerante por campo** (un valor fuera de rango vale su predeterminado; no deja nada dañado). ADR 0022 §1.
2. **Cambia el nombre**: `apariencia.reemplazo_pantalla` (clave hermana), no `apariencia.reemplazos.pantalla`. Motivo: en 0.2.1 `reemplazosSchema` es `z.strictObject` y una clave nueva dentro haría que 0.2.1 diera la canción por **dañada**. Mismas reglas que `reemplazos.espera` y `procedenciaPantalla` como propones. Para la spec es invisible.
3. Riesgo real: si 0.2.1 **reescribe** la canción o `temas.json` (cualquier guardado), descarta `pantalla`, `subrayar_cantado` y `reemplazo_pantalla`; al volver a 0.2.2 se ve el predeterminado de 5 líneas. Pérdida aceptada (como en ADR 0018 §1); conviene decirlo en las notas.
4. Viable. Formulación equivalente: cada línea trae `desde`, `hacia` y `avance` (ya con la curva) del único cambio en curso, más `retirada` y `aparicion`; una función pura aparte (`disponerBloque`) pasa a píxeles con las alturas medidas y, en «Fundido», devuelve las **dos copias**. Tus reglas (relevo si hueco < `D`, `mín(D, 60 %)`, 120 ms, 2 s + 400 ms) se implementan tal cual; por construcción nunca hay dos cambios a la vez. ADR 0022 §2–§3.
5. Conforme: `1 − (1 − x)³`.
6. Conforme.
7. Conforme: gris neutro con la misma luminancia relativa WCAG, mezcla lineal en sRGB (`color-mix(in srgb, …)`), suelo = menor opacidad que da 3:1 contra cada muestra de `muestrasFondo` compuesta sobre ella, una vez por estilo resuelto. Vive en `renderer/src/karaoke/contraste.ts` (`grisDeLetra`, `suelosDeOpacidad`).
8. Cada línea se monta siempre a tamaño `S` y se reduce con `transform`; renglones medidos una vez al montarla (y al cambiar tamaño, fuente o texto). El barrido por renglón no cambia (`medirBarridos` ya trabaja sin la transformación). En la captura offscreen la medición ocurre en el `useLayoutEffect` del montaje, antes de los dos `requestAnimationFrame` de ADR 0019 §2.
9. Sin prueba técnica previa: `transform` y `opacity` por nodo sin volver a renderizar React, como el barrido y el fondo. El único riesgo medible es la re-rasterización del texto al escalar; va a la guía manual (equipo modesto, secundaria, fondo en movimiento). Si hay saltos, `will-change` solo durante el cambio, sin tocar datos.
10. Repetido con un script de solo lectura (12 canciones Lista, 550 líneas, 538 cambios): **66 % de los cambios son relevos** (hueco < 350 ms), no el 95 % de la exploración (los fines fijados dejan huecos de respiración); 127 cambios con hueco de 0,35 a 2 s, 15 de 2 a 2,4 s y 41 de 2,4 s o más. Solo 7 líneas duran menos de 583 ms y 1 menos de 200 ms. Los umbrales de 120 ms y 2 s se mantienen.

**Feature 2**
11. Aceptado: `estilo.letra.subrayar_cantado` y `config.reproductor.subrayar_cantado`; el «o» lo resuelve quien toma la instantánea (reproductor local y vista previa en el renderer, sesión en main); la exportación solo el estilo. `PantallaLetra` recibe `subrayado`.
12. Machado et al. 2009 (protanopía y deuteranopía, severidad 1,0, RGB lineal), aviso si ΔE normal ≥ 25 y el menor ΔE simulado < 25 (umbral provisional). Coste nulo. Nuevo aviso `daltonismo` en `evaluarContraste`.
13. Sí: `text-decoration: underline` en la capa de resaltado, recortada por el mismo `clip-path`; `recorteBarrido` amplía hacia abajo cada caja de renglón lo que ocupe el subrayado. La caja de la línea no cambia.

**Feature 3**
14. Aceptada la consulta (`/releases?per_page=30`, `net.fetch`, 10 s). **Sin ETag**: sin autenticar, un 304 no ahorra cuota (documentación de GitHub) y la respuesta es pequeña. Cabeceras: `User-Agent` (el de LRCLIB), `Accept: application/vnd.github+json` y `X-GitHub-Api-Version`. 60 peticiones por hora sin autenticar: una al día sobra.
15. `credentials: 'omit'`, sin `Referer` ni identificadores. **Ajuste del texto**: Chromium puede añadir cabeceras técnicas estándar (`Accept-Encoding`, `Accept-Language`); la spec debería decir «la versión de la app y los datos técnicos de cualquier petición web» en lugar de «nada más». Una prueba con el doble HTTP comprueba la lista exacta.
16. `config.actualizaciones: { avisar, ultima_comprobacion, disponible: { version, publicada, recursos } | null, vista }`; canales `actualizaciones.estado()`, `.comprobar()`, `.marcarVista({ version })` y evento `actualizaciones:cambio`.
17. Conforme (SemVer 2.0, formato de ADR 0020 §2, sin borradores; `desarrollo` y `local` nunca consultan).
18. Conforme: la app construye los enlaces. En Linux, `process.env.APPIMAGE` es fiable (lo define el runtime de AppImage; electron-updater lo usa): con él, `.AppImage`; sin él, `.deb`. Si el archivo no está en `assets` de esa *Release*, «Descargar» abre la página.
19. Conforme; temporizador horario que solo consulta si pasaron 24 h, y comprobación tras `powerMonitor` `resume`. Sin efecto en la sesión (solo la principal pinta el aviso).
20. `SHINOBI_GITHUB_URL`, `SHINOBI_ACTUALIZACIONES_VERSION` y `SHINOBI_ACTUALIZACIONES_CANAL`, honradas solo sin empaquetar.
