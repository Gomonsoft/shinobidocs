# Exploración · Letra en pantalla con varios enunciados

- Versión: 0.2.2 (en exploración). Feature 1 de [plan-4.md](../plan-4.md).
- Autor: Diseñador UX. Fecha: 2026-11-21.
- Estado: **exploración, sin autorizar**. No es una spec: no cambia `docs/ux/`. Tras la aprobación del usuario se convierte en spec (07, 06, sistema visual) y en un ADR del arquitecto.
- Maqueta para ver las animaciones: [`docs/propuestas/diseno/letra-en-pantalla.html`](../../../propuestas/diseno/letra-en-pantalla.html) (se abre con doble clic).
- Propuesta formal: [018](../../../propuestas/018-letra-en-pantalla-con-varios-enunciados.md).

Vocabulario de este documento: **enunciado** = **línea** de la letra (un elemento `tipo: "linea"`), ocupe uno o dos renglones en pantalla. **Activa** = la que suena. **Pasada** = ya cantada. **Futuras** = las que vienen. `S` = tamaño de la línea activa (`máx(32 px, 7,5 % del alto)`, sistema visual §10). `N` = enunciados visibles; `P` = cuántos de ellos son pasados.

## Resumen de la recomendación

1. **Modelo**: la línea activa no cambia de tamaño (7,5 % del alto) y queda **anclada** en una altura fija para cada configuración. Debajo, las futuras (la primera al 70 %, el resto al 60 % y cada vez más tenues). Encima, si se activa, la pasada (60 %, gris). Por defecto **5 enunciados: 1 pasado + el activo + 3 futuros**.
2. **Animaciones**: «Desplazamiento» (todo el bloque sube un puesto; la cantada sube, encoge y pasa del color de lo ya cantado a gris) y «Fundido» (nadie viaja: cada línea se funde hacia su nuevo puesto con un arrastre corto). Tercera opción «Sin animación». Todo se **deriva del tiempo de la canción**, así que pausa, búsqueda y video salen solos.
3. **Dónde vive**: en el **tema**, en una sección nueva «Letra en pantalla» del panel Estilo del editor, heredable como el resto del estilo y con «Cambiar solo en esta canción», igual que «Indicadores de espera». Sin ajuste global en Ajustes.
4. **Al actualizar**: todo lo existente pasa a 5 enunciados (el valor ausente significa «predeterminado nuevo»). Quien quiera lo de antes elige «2».

## a) Datos medidos en las canciones de referencia

**Método y límites.** No dispongo de un intérprete para ejecutar un script: las cifras salen de búsquedas con expresiones regulares sobre los `cancion.json` con `estado: "lista"` y de restas hechas a mano. Longitudes de texto: las 12 canciones Lista (550 líneas). Tiempos: 9 de las 12 (439 líneas, el 80 %). Las duraciones usan el fin fijado o, si es automático, la regla de `finEfectivo`. Son cifras para decidir el diseño, con un margen de error de unas pocas unidades; conviene que el arquitecto o QA las repita con un script antes de fijar umbrales en la spec.

### Tamaño de las canciones

| Dato | Valor |
|---|---|
| Canciones Lista | 12 (2 de ellas «Letra lista») |
| Duración | de 3:27 a 4:40; mediana ≈ 3:45 |
| Líneas por canción | 28 · 28 · 30 · 31 · 36 · 39 · 42 · 43 · 48 · 53 · 71 · 101; mediana ≈ 40 |
| Pausas (♪) | 7 en total, en 3 canciones |
| Apariencia | 8 comparten un mismo tema, 3 tienen tema personalizado, 1 hereda |

### Duración de una línea (439 líneas)

| Dato | Valor |
|---|---|
| Típica | entre 2,5 y 5 s |
| Menos de 2 s | ≈ 85 (≈ 19 %); 68 de ellas en una sola canción |
| Menos de 1 s | 19 (≈ 4 %); 18 en la canción rápida, donde son el 18 % de sus líneas |
| Menos de 0,5 s | 6, todas en la canción rápida; la más corta, **0,27 s** |
| Extremo corto anómalo | 1 línea de 15 ms (dato de sincronía defectuoso; el diseño no debe romperse con ella) |
| Extremo largo | 23,9 s (nota final sostenida); el resto, hasta ≈ 9 s |
| Canción rápida | 101 líneas en 3:29, mediana ≈ 1,65 s por línea, sin ningún hueco de 4 s o más |

### Huecos entre líneas y pausas largas (9 canciones)

| Dato | Valor |
|---|---|
| Hueco típico | de 0 a 1,7 s. En las líneas con fin automático el hueco es 0; con fin fijado hay huecos de 10 a 100 ms (líneas seguidas) o de 0,5 a 3 s (respiración) |
| Huecos de 4 s o más | de 0 a 3 por canción (0, 0–1, 1, 1, 1–3, 2, 2, 3, 3) |
| Hueco más largo | ≈ 19 s; otros de 15, 11, 11 y 10 s |
| Primera entrada | 0,4 · 4,8 · 6,8 · 11,5 · 13,3 · 18,4 · 22,1 · 26,5 · 35,7 s; mediana 13 s; 2 de 9 antes de 6 s (silencio previo) |
| Cola tras la última línea | 1,7 · 5,4 · 8,6 · 8,9 · 11,5 · 13,6 · 18,8 · 19,5 · 25,9 s; mediana 11,5 s |

### Longitud del texto (550 líneas)

| Caracteres | Líneas | % |
|---|---|---|
| hasta 20 | 160 | 29 % |
| 21–30 | 216 | 39 % |
| 31–40 | 115 | 21 % |
| 41–50 | 40 | 7 % |
| 51–60 | 18 | 3 % |
| 61–80 | 1 | 0,2 % |
| más de 80 | 0 | — |

Estimación de renglones (ancho útil 88 %, ancho medio de carácter ≈ 0,5 em; **estimado, no medido con la fuente real**): a tamaño `S` caben ≈ 41 caracteres en 16:9 y ≈ 31 en 4:3.

| Caso | 16:9 | 4:3 |
|---|---|---|
| Líneas que ocupan dos renglones a tamaño `S` | ≈ 59 (11 %) | ≈ 174 (32 %) |
| Líneas que no cabrían en dos renglones a tamaño `S` | 0 | 1 (se reduce hasta el 75 %, como hoy) |

### Qué implican

1. **El cambio de línea con hueco corto es el caso normal** (más del 95 % de los cambios). La animación principal es la de relevo entre líneas seguidas, no la de las pausas.
2. **Hay líneas más cortas que cualquier animación razonable** (0,27 s). La animación tiene que acortarse sola y encadenarse sin saltos.
3. **Las pausas largas existen en casi todas las canciones** (hasta 19 s) y **la cola final es larga** (mediana 11,5 s). Con 5 enunciados hay que decidir qué se ve en esos tramos.
4. **Una de cada nueve líneas ocupa dos renglones en 16:9 y una de cada tres en 4:3.** El bloque no puede tener una altura fija: tiene que crecer y tener una regla de recorte.
5. **La canción que más se beneficia de ver más líneas es la rápida**, y es «Letra lista» (sin barrido). El modelo tiene que funcionar sin color de resaltado.
6. **Casi toda la biblioteca cuelga de un solo tema.** Si el ajuste vive en el tema, un cambio llega a 8 de 12 canciones de golpe, pero las 3 personalizadas y las de «estilo incluido» obligan a definir bien el valor por defecto.

## b) Referentes

Qué hacen otros con varias líneas y con el paso de línea. Donde no hay fuente, lo indico.

| Patrón | Quién | Cómo funciona | Qué tomo y qué descarto |
|---|---|---|---|
| **Lista que avanza con línea activa resaltada** | Apple Music (letra sincronizada y «Sing») | La letra «se desplaza línea a línea con la música»; con Sing, cada sílaba se anima y las notas sostenidas reciben un realce. Los dúos cambian la justificación. Fuentes: [Apple, soporte](https://support.apple.com/HT204459), [Apple, nota de prensa de Sing](https://www.apple.com/newsroom/pdfs/Apple-Music-Sing.pdf), [TechCrunch](https://techcrunch.com/2022/12/06/apple-music-is-getting-a-new-karaoke-like-feature-apple-sing). Por observación propia (sin fuente citada): la activa queda en una altura fija, las pasadas suben atenuadas y las futuras se ven más tenues. | Tomo la **activa anclada**, el bloque que sube y la atenuación por distancia. Descarto el desenfoque de las líneas lejanas (resta legibilidad a 5 m y cuesta render) y el rebote elástico (la spec 07 pide que la letra no rebote). |
| **Ventana de pocas líneas que salta** | Spotify de escritorio (versión antigua) | Un usuario describe 3 líneas grandes en las que la segunda «de repente salta arriba y pasa a ser la primera», y lo encuentra desorientador ([hilo de la comunidad](https://community.spotify.com/t5/Desktop-Windows/Lyrics-display-on-PC-very-unpleasant-only-3-lines-that-jump/td-p/5367764)). Otros hilos piden distinguir las líneas ya cantadas de la actual ([hilo](https://community.spotify.com/t5/Android/New-lyrics-feature-should-highlight-only-the-current-lyric-row/m-p/5304165)). | Confirma las dos peticiones del usuario: el cambio **no debe ser un salto** y la línea pasada debe **distinguirse** de la activa. |
| **Karaoke con número de líneas configurable** | Youka (generador de karaokes) | Disposición «Karaoke» (varias líneas, la activa resaltada, suben al avanzar), «Scrolling» (desplazamiento vertical continuo, para letras densas) y «Single». Ajuste «Lines Visible»: 2, 4 o «más líneas». Posición arriba, centro o abajo. «Anticipation Buffer»: con cuánta antelación aparecen las líneas. Fuente: [documentación de Youka](https://docs.youka.io/en/web/layout-options). | Es el referente más cercano: el número de líneas es un ajuste de **disposición del karaoke** junto al estilo, no una preferencia del equipo. Tomo el rango (de 2 a «más»). |
| **Página fija que se rellena** | Karaoke de disco (CD+G) y sus editores | Pantalla de 288 × 192 con mosaicos de 6 × 12 ([Wikipedia, CD+G](https://en.wikipedia.org/wiki/CD%2BG)). Modo estándar de los editores: se muestra una página entera de letra y, cuando está toda resaltada, se presenta otra; hay ajuste de «líneas por pantalla» ([Power Karaoke, manual](https://docs.powerkaraoke.com/books/ai-karaoke-cdg-creator-user-manual/page/creating-cdg-files)). | El texto no se mueve nunca (máxima legibilidad), pero la línea activa cambia de sitio y el ojo la tiene que buscar. Es otro modelo de disposición; queda **fuera** (ver i). |
| **Teleprompter continuo** | Disposición «Scrolling» de Youka; vista de letra de Mixcraft ([manual](https://acoustica.com/mixcraft-11-manual/lyric-track-and-editor)) | La letra sube a velocidad constante y se resalta la posición actual. | Descartado como animación: la línea que se canta nunca está quieta y el barrido se lee peor. Además, con pausas de 19 s la velocidad constante deja la pantalla vacía o la llena de golpe. |
| **Línea actual y siguiente por separado** | Shinobi Karaoke 0.2.1; LyricDisplay para OBS ([hilo](https://obsproject.com/forum/threads/lyricdisplay-professional-lyrics-presentation-for-live-production.191349/post-708459)) | Dos líneas; la siguiente sube al sitio de la actual. | Es `N = 2`: se conserva como opción. |
| **Movimiento reducido** | WCAG 2.3.3 | La animación no esencial debe poder desactivarse; `prefers-reduced-motion` es la técnica suficiente ([W3C](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)). Sustituir el movimiento por un cambio instantáneo o un fundido breve es práctica recomendada, no requisito. | Con movimiento reducido, cambio **instantáneo** (como hoy). La línea pasada sigue existiendo: el gris es un estado, no un movimiento. |

Conclusión de los referentes: el patrón dominante en letra sincronizada moderna es **ventana con la activa anclada, pasadas atenuadas arriba, futuras tenues abajo y desplazamiento por línea**. Coincide con lo que pidió el usuario.

## c) Modelo propuesto

### Principios

1. **La activa manda.** No encoge al añadir líneas: sigue en `S` (7,5 % del alto; ≈ 5,1 cm de cuerpo en una TV de 55"). Lo que se añade es contexto, más pequeño.
2. **La activa no se mueve de altura** mientras dura una configuración. El ojo del cantante vuelve siempre al mismo sitio.
3. **Una línea conserva su forma toda su vida.** Los renglones se calculan a tamaño `S` y la línea se reduce como un todo en los demás puestos. Así, al subir, no se recoloca ninguna palabra (ver «Líneas de dos renglones»).
4. **Todo se deriva del tiempo de la canción.** Posición, tamaño, opacidad y color de cada línea son una función del instante. No hay animaciones disparadas por eventos.

### Puestos

Puesto 0 = activa. Puestos +1, +2… = futuras, hacia abajo. Puestos −1, −2 = pasadas, hacia arriba.

| Puesto | Tamaño | Opacidad objetivo | Color |
|---|---|---|---|
| −2 (segunda pasada) | 60 % de `S` | 40 % | gris de la letra |
| −1 (pasada) | 60 % de `S` | 55 % | gris de la letra |
| 0 (activa) | `S` | 100 % | letra, con el barrido en el color de lo ya cantado |
| +1 (siguiente) | 70 % de `S` (como hoy) | 100 % (como hoy) | letra |
| +2 | 60 % de `S` | 80 % | letra |
| +3 | 60 % de `S` | 65 % | letra |
| +4 | 60 % de `S` | 55 % | letra |
| +5 | 60 % de `S` | 50 % | letra |
| +6 | 60 % de `S` | 45 % | letra |

- **Separación**: 0,6 × `S` por encima y por debajo de la activa (la que ya existe hoy entre actual y siguiente; ahí viven los puntos y la barra de espera). 0,25 × `S` entre las demás.
- **Suelo de contraste**: la opacidad objetivo se sube lo necesario para que cada puesto tenga ≥ 3:1 contra la peor muestra del fondo (las mismas muestras de sistema visual §9). Se calcula una vez por estilo, no por fotograma. Si la letra ya incumple 3:1 al 100 %, lo dice el aviso de contraste de siempre. **No hay avisos nuevos.**
- **Sombra**: la de §10 en todas las líneas.

### Cuántas pasadas y futuras, y dónde queda la activa

Futuras = `N − 1 − P`. El centro de la activa se calcula para que el bloque (con todas las líneas de un renglón) quede centrado en el 47 % del alto.

| N | P = 0 (sin pasada) | P = 1 | P = 2 |
|---|---|---|---|
| 2 | activa + 1 futura · activa al **45 %** (exactamente lo de hoy) | no disponible | no disponible |
| 3 | activa + 2 futuras · 38 % | no disponible (ver decisión 4) | no disponible |
| 4 | activa + 3 futuras · 34 % | 1 pasada + activa + 2 futuras · 43 % | no disponible |
| **5** | activa + 4 futuras · 31 % | **1 pasada + activa + 3 futuras · 39 %** (predeterminado) | no disponible |
| 6 | activa + 5 futuras · 27 % | 1 pasada + activa + 4 futuras · 36 % | 2 pasadas + activa + 3 futuras · 43 % |
| 7 | activa + 6 futuras · 23 % | 1 pasada + activa + 5 futuras · 32 % | 2 pasadas + activa + 4 futuras · 39 % |

Altura del bloque con líneas de un renglón: de 27 % del alto (N = 3) a 59 % (N = 7 con pasada). El caso mayor va del 18 % al 76 % del alto: fuera de las franjas de controles (0–12 % y 82–100 %).

Esquema del predeterminado (5 enunciados, 1 pasado), a mitad de una línea:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                     y la ciudad se queda sin voz                         │ ← −1 pasada: 60 %, gris, 55 %
│                                                                          │
│              ████████████████░░░░░░░░░░░░░░░░░                           │
│              Guardo en la manga un verso doblado                         │ ← 0 activa: S, centro al 39 %
│                                                                          │
│                  que nadie sabe de dónde llegó                           │ ← +1: 70 %, 100 %
│                   Paso a paso, sin hacer ruido                           │ ← +2: 60 %, 80 %
│                   cruzo la noche de puntillas                            │ ← +3: 60 %, 65 %
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### El «enunciado pasado»

| Aspecto | Propuesta |
|---|---|
| **Cuándo existe** | Con `P ≥ 1`. Una línea pasa a pasada en su **fin efectivo** (no al empezar la siguiente): es la animación que describió el usuario, «la letra ya cantada va hacia arriba con un descolor». |
| **Color gris** | Derivado del color de letra del tema: mismo brillo, **sin croma** (gris neutro de la misma luminosidad; el cálculo exacto, en OKLab o por luminancia, lo fija el arquitecto) y opacidad 55 % (40 % la segunda). Con letra blanca es blanco al 55 %: sobre el tema «Shinobi» da ≈ 5,2:1 en la zona oscura del degradado y ≈ 4,0:1 en la clara. |
| **Contraste mínimo** | 3:1 contra la peor muestra del fondo (suelo de contraste de arriba). Es texto grande y secundario: no se exige distinguirlo por color de las futuras, porque ya se distingue por posición (encima de la activa). |
| **De qué color parte** | Del color de lo ya cantado (la línea termina barrida entera) y se funde a gris durante la salida. En «Letra lista», del color de la letra a gris. |
| **Retirada** | Si 2 s después de su fin no ha empezado otra línea (hueco de más de 2 s), las pasadas se funden y desaparecen en 400 ms. No vuelven al acabar la pausa: una línea de hace 15 s ya no orienta. |
| **Sin pasada (`P = 0`)** | En su fin efectivo la línea sube hacia el puesto −1 y se funde hasta desaparecer (hoy desaparece de golpe). |

### Líneas de dos renglones

- Los renglones de cada línea se calculan **a tamaño `S`** con el ancho del 88 % (regla actual: máximo 2 renglones equilibrados; si no cabe, se reduce hasta el 75 %). En los demás puestos la línea es esa misma forma reducida al 70 % o al 60 %.
- Consecuencia: una línea de dos renglones ocupa dos renglones pequeños también cuando es futura o pasada, aunque reducida cabría en uno. A cambio, al subir a activa **no se recoloca ninguna palabra** y la animación es un simple cambio de escala. Con los datos medidos afecta al 11 % de las líneas en 16:9.
- El bloque crece desde la activa: una línea de dos renglones por debajo empuja hacia abajo a las siguientes; una por encima, hacia arriba; la activa crece la mitad hacia cada lado y su centro no se mueve.
- **Regla de recorte**: una futura cuyo borde inferior pase del 86 % del alto no se dibuja en ese momento (ni las que van detrás). Igual por arriba con el 10 %. Nunca se recorta una línea a medias.

## d) Las dos animaciones de transición

### Qué eventos hay

Cada línea produce dos, los dos conocidos de antemano:

| Evento | Instante | Qué mueve |
|---|---|---|
| **Entrada** de la línea *i* | su inicio | Las futuras suben un puesto: la *i* pasa de +1 a 0 (crece del 70 % al 100 %), las demás de +k a +k−1, y aparece una nueva por abajo. |
| **Salida** de la línea *i* | su fin efectivo | La *i* pasa de 0 a −1 (encoge al 60 % y se decolora). Las pasadas anteriores suben un puesto y la más antigua se funde. |

- **Líneas seguidas** (el fin de una es el inicio de la siguiente, o distan menos que la animación): salida y entrada coinciden y se ve **un solo movimiento del bloque entero**.
- **Con hueco** (respiración de 0,5 a 3 s, o pausa): se ve en dos tiempos. Al acabar la línea, sube y se apaga; el puesto de la activa queda libre; al empezar la siguiente, sube el resto. Es lo mismo que ocurre hoy con dos líneas (la actual desaparece en su fin y la siguiente espera en su sitio), así que el criterio de «fin de línea» de 0.2.0 se conserva.

### Tipo 1 · «Desplazamiento» (predeterminado)

Todo el bloque viaja un puesto hacia arriba.

| Aspecto | Valor |
|---|---|
| Qué se ve | Cada línea se mueve de forma continua de su puesto al de arriba, interpolando posición, tamaño, opacidad y color. La cantada sube, encoge y pasa de «ya cantado» a gris. |
| Duración | **350 ms** (hoy son 200 ms para una sola línea; con cinco moviéndose, 200 ms resulta brusco; por encima de 400 ms la activa tarda en asentarse). |
| Curva | Desaceleración, `cubic-bezier(0.22, 1, 0.36, 1)` o equivalente: recorre el 80 % del camino en el primer 40 % del tiempo, así la activa está casi en su sitio a los 140 ms y el barrido se lee desde el principio. Sin rebote. |
| Barrido | Avanza con su reloj de siempre mientras la línea sube: el barrido es del texto y viaja con él. |

### Tipo 2 · «Fundido»

Nadie viaja: cada línea se desvanece en su puesto y aparece en el nuevo.

| Aspecto | Valor |
|---|---|
| Qué se ve | En cada puesto, el ocupante saliente se funde mientras sube 0,3 × `S`, y el entrante aparece llegando desde 0,3 × `S` más abajo. Se percibe dirección («hacia arriba») con muy poco recorrido. |
| Duración | **250 ms**, misma curva. |
| Por qué esta | (1) El texto está legible en su destino casi desde el primer fotograma: mejor para canciones rápidas. (2) Recorrido corto: más cómodo para quien se marea con desplazamientos grandes sin llegar a quitar la animación. (3) Más seguro en video a 24–30 FPS y en proyectores, donde un desplazamiento largo puede verse a tirones. (4) Cumple lo pedido: no es «desaparecer y aparecer», hay movimiento. |

### «Sin animación»

Tercera opción del selector: los puestos cambian al instante. Es lo que se ve siempre con movimiento reducido. Útil en equipos modestos.

### Casos límite (iguales para los dos tipos)

| Caso | Comportamiento |
|---|---|
| **La siguiente línea empieza antes de que acabe la animación** (líneas de menos de 1 s) | La duración efectiva de la entrada de una línea es `mín(nominal, 60 % del tiempo hasta el inicio de la siguiente)`. Si queda por debajo de 120 ms, el cambio es instantáneo. Además, como cada línea suma su propio avance, dos animaciones solapadas se **encadenan** en un desplazamiento continuo: nunca hay un salto ni una cola de animaciones. Con la línea de 0,27 s medida, dura 162 ms. La línea anómala de 15 ms cambia al instante. |
| **Búsqueda** (barra, ←/→, J/L, ⏮) | El estado se calcula para el instante de destino. **El salto no se anima.** Si el destino cae dentro de una animación, se ve en ese punto y continúa. |
| **Pausa** | La letra se congela en el fotograma exacto, también a mitad de una animación (regla actual: «la letra se congela»). |
| **Reanudar** | Continúa desde ese mismo punto, sin reiniciar la animación. |
| **Movimiento reducido** | Cambio instantáneo de puestos. Se conservan los puestos, tamaños, opacidades y el gris de la pasada (son estados). La retirada de las pasadas y la aparición del bloque también son instantáneas. El barrido y la barra de espera siguen avanzando (son contenido, sistema visual §4). |
| **Cambio de tamaño de ventana a mitad de animación** | Se recalculan renglones y puestos y se pinta el instante actual. |
| **Modo estático del editor** (en pausa, línea seleccionada) | La seleccionada como activa a medio barrer, sus vecinas en sus puestos. Cambiar de selección no anima. |

### Alternativas descartadas para la animación

- **Anticipar la entrada** (que la línea llegue a su sitio justo en su inicio): choca con la cuenta 3·2·1, que ocupa ese sitio hasta el inicio, y desdibuja «el puesto de la activa significa canta ya».
- **Un solo movimiento en huecos cortos** (la cantada espera en su sitio hasta que empieza la siguiente): menos movimientos, pero contradice el fin de línea visible de 0.2.0. Queda como decisión 7.
- **Rebote elástico o desenfoque**: la spec 07 pide que la letra no rebote; el desenfoque resta legibilidad a distancia.

## e) Convivencia con lo existente

| Con | Propuesta |
|---|---|
| **Indicadores de espera** (puntos, barra de carga, cuenta 3·2·1) | Mismas posiciones reservadas, ahora **relativas al centro de la activa** (antes, al 45 % fijo): barra a 0,9 × `S` por encima, cuenta en el puesto de la activa, puntos sobre la línea +1. La separación de 0,6 × `S` a ambos lados de la activa garantiza que la barra no toque la pasada ni los puntos toquen la +1. Mostrar u ocultar indicadores sigue sin mover ninguna línea. Con `N = 2` todo queda donde está hoy. |
| **Primera entrada** | Pantalla de título hasta 4 s antes de la primera línea, como hoy. Después, puesto de la activa libre (ahí van los indicadores), puesto −1 vacío y las futuras +1…+F ya visibles. El bloque aparece con un fundido de 250 ms (instantáneo con movimiento reducido). El silencio previo no cambia. |
| **Pausas largas** | Hoy: puesto de la activa vacío y una sola línea esperando. Con 5 enunciados: indicadores en sus sitios y **las 3 futuras a la vista** (se puede leer la estrofa que viene durante los 10–19 s de espera). La pasada se retira a los 2 s. En un hueco de más de 2 s y menos del silencio mínimo no hay indicadores, pero la pasada se retira igual. |
| **Pausas (♪)** | Siguen sin dibujarse: solo cuentan como hueco. |
| **Últimas líneas** | Los puestos futuros se van quedando vacíos; la activa no se recentra. |
| **Final de canción** | Tras el fin de la última línea, pasa a pasada y a los 2 s se retira. Queda el fondo hasta el final del audio (cola mediana de 11,5 s) y luego la pantalla final. Sin cambios en la pantalla final. |
| **«Letra lista»** | Sin color de lo ya cantado en ningún momento: la activa se distingue por tamaño, puesto y opacidad; la pasada, por gris, tamaño y puesto. El paso a gris en el fin de línea es la única señal de avance, así que aquí la línea pasada aporta más que en karaoke. Los indicadores, en el color de la letra, como hoy. |
| **Barrido palabra a palabra** (0.2.1) | Sin cambios y solo en la activa. Una futura nunca tiene barrido; una pasada está «entera». La medición de renglones del barrido se hace sobre la forma a tamaño `S`, que no cambia en toda la vida de la línea. |
| **4:3** | Mismas reglas. Hay más líneas de dos renglones (≈ 32 % frente a 11 %), así que la regla de recorte actuará más con 6 y 7 enunciados. Recomendación para la guía manual: comprobar 4:3 con 5 y con 7. |
| **Ventana secundaria y cola** | Nada nuevo: la configuración viaja en el estilo resuelto de la instantánea, como el resto del aspecto. |
| **Franjas de controles** | El bloque mayor (N = 7) ocupa del 18 % al 76 % del alto con líneas de un renglón; con la regla de recorte nunca pasa del 10 %–86 %. La regla «ningún elemento de interfaz entre el 25 % y el 75 %» no cambia (la letra no es interfaz). Con los controles visibles, las franjas pueden tapar una línea lejana durante 3 s; aceptable. |

### Legibilidad a 5 m (TV de 55", 68,5 cm de alto de imagen)

| Puesto | Cuerpo | Altura de mayúscula (≈ 0,7 em) | Relación con 5 m | Lectura |
|---|---|---|---|---|
| Activa | 5,1 cm | 3,6 cm | 1/139 | Cumple la regla de 1/150, como hoy. No cambia con N. |
| +1 (70 %) | 3,6 cm | 2,5 cm | 1/200 | Legible para anticipar, como hoy. |
| +2…+6 y pasadas (60 %) | 3,1 cm | 2,2 cm | 1/232 | Se lee con algo de esfuerzo a 5 m; con comodidad a 3–4 m. Es contexto: reconocer la estrofa, no leerla palabra por palabra. |

Decisión de diseño: **no encoger la activa para que quepan más líneas**. Con 7 enunciados no se lee peor la línea que se canta; solo hay más contexto pequeño. Lo que sí empeora con 7 es el ruido visual: por eso el predeterminado es 5.

## f) Dónde vive la función y sus ajustes

### Alternativas

| | A · En el tema (panel Estilo), con «solo en esta canción» | B · Ajustes → Reproductor (global del equipo) | C · Solo por canción | D · Global + tema + canción |
|---|---|---|---|---|
| Dónde se toca | Editor › Estilo › «Letra en pantalla» | Ajustes | Editor, canción a canción | Tres sitios |
| Se ve al ajustarlo | **Sí**: la vista previa está al lado y «Probar a pantalla completa» a un clic | No: Ajustes no tiene vista previa | Sí | Depende |
| Una canción rápida con más líneas que una balada | Sí («Cambiar solo en esta canción» o un tema distinto) | No | Sí, pero hay que tocarlas todas | Sí |
| Video exportado | Sale del estilo de la instantánea, sin regla nueva | Hay que decidir si el video usa la preferencia del equipo que exporta | Sale de la canción | Sale del nivel que gane |
| Coherencia con lo existente | **Igual que «Indicadores de espera»** (ADR 0018): mismo panel, misma herencia, mismo reemplazo por canción | Rompe el patrón: sería el único ajuste de la letra fuera del estilo | No hereda: contradice «automatizar al máximo» | La más flexible y la más difícil de explicar («¿por qué esta canción tiene 3?») |
| Aplicarlo a toda la biblioteca | Un cambio por tema (8 de 12 canciones cuelgan de uno) más el valor por defecto | Un clic | 12 cambios | Un clic |
| Coste | M: sección nueva en Estilo y reemplazo por canción | S | S–M | L |

### Recomendación: A

En el **tema**, heredable (canción › álbum › artista › predeterminado), con **«Cambiar solo en esta canción»** igual que los indicadores de espera. Motivos:

1. Es disposición y animación de la letra: forma parte de cómo se ve el karaoke, igual que los indicadores de espera, que ya viven ahí. Youka, el referente más cercano, también lo trata como disposición del karaoke.
2. Es el único sitio con **vista previa al lado**. Elegir entre dos animaciones sin verlas no tiene sentido.
3. El video sale idéntico sin reglas nuevas (el estilo ya viaja en la instantánea).
4. La canción rápida puede tener 7 y la balada 3 sin tocar nada más.
5. El inconveniente de A («aplicarlo a todo de golpe») desaparece con la recomendación sobre el valor por defecto de más abajo.

No recomiendo un ajuste global adicional en Ajustes: dos sitios que deciden lo mismo obligan a explicar cuál gana. El único ajuste «del equipo» que sí aplica ya existe: el movimiento reducido del sistema.

### Controles

Sección nueva **«Letra en pantalla»** en el panel Estilo, después de «Letra» y antes de «Indicadores de espera». Cabe en los 300 px mínimos del panel.

**En D2 (tema personalizado) y D3 (editando un tema)**

```
│ Letra en pantalla                                 │  h3
│ Cuántas líneas se ven a la vez y cómo cambian.    │  t-pequeno, texto-2
│                                                   │
│ Líneas a la vez                                   │
│ [ 2 | 3 | 4 | 5 | 6 | 7 ]                         │  control segmentado (5 elegido)
│                                                   │
│ Líneas ya cantadas                                │
│ [ Ninguna | 1 | 2 ]                               │  control segmentado
│ La línea que acabas de cantar sube y se apaga.    │  t-pequeno, texto-2
│                                                   │
│ Cambio de línea                                   │
│ [ Desplazamiento | Fundido | Sin animación ]      │  control segmentado
│ Todas las líneas suben un puesto.                 │  ayuda de la opción elegida
│                                                   │
│ Se ven la línea que suena, 1 ya cantada y las 3   │  resumen dinámico (t-pequeno, texto-3)
│ siguientes.                                       │
│ (ⓘ Tu sistema pide reducir el movimiento: en este │  solo si aplica
│  equipo las líneas cambiarán sin animación.)      │
│ [▶ Ver un ejemplo]                                │  botón secundario
```

**En D1 y D4 (tema vinculado; resumen)**

```
│ Letra en pantalla                                 │
│ 5 líneas · 1 ya cantada · desplazamiento          │
│ Del tema «Noche ninja»                            │  procedencia
│ [Cambiar solo en esta canción]  [▶ Ver un ejemplo]│
```

**En D1 y D4 con ajustes propios de la canción**

```
│ Letra en pantalla                                 │
│ Propia de esta canción. El resto del aspecto      │
│ sigue el tema «Noche ninja».                      │
│ (los tres controles, editables)                   │
│ [Usar la del tema]  [▶ Ver un ejemplo]            │
```

| Control | Comportamiento |
|---|---|
| **Líneas a la vez** | Grupo de radio segmentado con 2, 3, 4, 5, 6 y 7. Predeterminado **5**. Cada cambio es un paso de deshacer y se ve en la vista previa en menos de 100 ms. |
| **Líneas ya cantadas** | «Ninguna», «1» o «2». «1» disponible con 4 líneas o más; «2», con 6 o 7. Predeterminado **1**. Las opciones no disponibles quedan `aria-disabled` con el motivo debajo, no ocultas. Si se bajan las líneas y la elección deja de ser válida, se aplica la mayor permitida y **se recuerda la elegida**: al volver a subir, se recupera. |
| **Cambio de línea** | «Desplazamiento» (predeterminado), «Fundido» o «Sin animación». Al elegir, la vista previa reproduce una vez el ejemplo. |
| **Resumen dinámico** | Dice en una frase qué se ve. |
| **Ver un ejemplo** | El mismo mecanismo de «Indicadores de espera»: sin audio, la vista previa muestra tres cambios de línea seguidos y uno con hueco, con la píldora «Ejemplo». |
| **Cambiar solo en esta canción / Usar la del tema** | Como en «Indicadores de espera»: copia el bloque completo a la canción o lo quita. Un paso de deshacer cada uno. |

**Microcopy candidato**

| Clave | Texto |
|---|---|
| `edi.pantalla.titulo` | Letra en pantalla |
| `edi.pantalla.ayuda` | Cuántas líneas se ven a la vez y cómo cambian. |
| `edi.pantalla.lineas` | Líneas a la vez |
| `edi.pantalla.pasadas` | Líneas ya cantadas |
| `edi.pantalla.pasadas.ninguna` | Ninguna |
| `edi.pantalla.pasadas.ayuda` | La línea que acabas de cantar sube y se apaga. |
| `edi.pantalla.pasadas.minimo1` | Disponible con 4 líneas o más. |
| `edi.pantalla.pasadas.minimo2` | Dos líneas ya cantadas: disponible con 6 o 7 líneas. |
| `edi.pantalla.cambio` | Cambio de línea |
| `edi.pantalla.cambio.desplazamiento` | Desplazamiento |
| `edi.pantalla.cambio.desplazamiento.ayuda` | Todas las líneas suben un puesto. |
| `edi.pantalla.cambio.fundido` | Fundido |
| `edi.pantalla.cambio.fundido.ayuda` | Cada línea se funde hacia su nuevo sitio, con menos movimiento. |
| `edi.pantalla.cambio.ninguna` | Sin animación |
| `edi.pantalla.cambio.ninguna.ayuda` | Las líneas cambian de golpe. |
| `edi.pantalla.resumen` | Se ven la línea que suena, {p} ya cantada(s) y las {f} siguientes. · (p = 0) Se ven la línea que suena y las {f} siguientes. · (f = 1) …y la siguiente. |
| `edi.pantalla.resumen.corto` | {n} líneas · {p} ya cantada(s) · {cambio} · (p = 0) {n} líneas · {cambio} |
| `edi.pantalla.reducido` | Tu sistema pide reducir el movimiento: en este equipo las líneas cambiarán sin animación. |
| `edi.pantalla.propia` | Propia de esta canción. El resto del aspecto sigue el tema «{tema}». |
| `edi.pantalla.soloCancion` | Cambiar solo en esta canción |
| `edi.pantalla.usarTema` | Usar la del tema |
| `edi.pantalla.ejemplo` | Ver un ejemplo |

Se usa «línea» y no «enunciado» porque es la palabra que ya emplean el editor y el reproductor.

### Qué ven las bibliotecas y los temas existentes al actualizar

| Opción | Efecto | Valoración |
|---|---|---|
| **1 · Pasan a 5** (el dato ausente significa «predeterminado nuevo»: 5 líneas, 1 ya cantada, desplazamiento) | Todas las canciones y temas cambian al actualizar, también los videos que se exporten después. Nada se reescribe en disco. | **Recomendada.** |
| 2 · Siguen en 2 (el dato ausente significa «como en 0.2.1») | Nada cambia hasta que el usuario edita cada tema. | Es la regla que se siguió en 0.2.0 con los indicadores de espera. |

Recomiendo la 1, aunque rompe la costumbre de «lo ausente se ve como antes», por tres motivos:

1. El usuario pidió literalmente «por defecto 5».
2. Con la opción 2 hay canciones que **no podrían** llegar a 5 sin personalizarlas: las de «Estilo incluido» no tienen un tema editable, y las 3 con tema personalizado habría que tocarlas una a una.
3. El proyecto está en alfa: no hay bibliotecas de terceros con un aspecto que proteger.

Para volver atrás basta elegir «2» en el tema. Conviene avisarlo en las notas de la versión.

## g) Vista previa del editor y exportación a video

**Vista previa del editor**

- Mismo render: muestra los N enunciados con su animación mientras suena. Es más pequeña, así que con 7 líneas las lejanas son diminutas; es una vista de composición, y «Probar a pantalla completa» sigue a un clic.
- En pausa (modo estático): la línea seleccionada como activa a medio barrer, las anteriores como pasadas y las siguientes como futuras. Sin animación al cambiar de selección.
- «Ver un ejemplo» reproduce los cambios de línea sin audio.
- En modo «Sincronizar al ritmo» la vista previa sigue sonando con la configuración efectiva: ver más líneas futuras ayuda a marcar.
- El editor preciso de línea no cambia.

**Exportación a video**

- La configuración viaja en el estilo de la instantánea. Sin controles nuevos en el diálogo de exportación.
- Como todo se deriva del tiempo, el fotograma *n* se pinta igual a cualquier FPS, sin depender de animaciones CSS que haya que pausar y fijar (hoy la entrada de 200 ms necesita ese mecanismo del ADR 0019 §2). Es una simplificación para el arquitecto.
- El movimiento reducido del sistema **no** se aplica al video (regla actual).
- A 24 FPS, 350 ms son 8 fotogramas y 250 ms son 6: suficiente para un movimiento continuo.
- Más movimiento en pantalla puede aumentar algo el tamaño del archivo; la estimación ya tiene un factor corrector, pero habría que volver a medirlo.
- La marca de agua (esquina inferior derecha, margen del 3 %) queda fuera del bloque en 16:9; en 4:3 con 7 líneas la regla de recorte evita el solape.

**Preguntas para el arquitecto** (para cuando se autorice; no las abro en `docs/preguntas/` porque esto aún es exploración)

1. Esquema y nombre del bloque (por ejemplo `estilo.pantalla: { lineas, pasadas, transicion }`), valor por defecto con dato ausente y admisión en la lista blanca de `apariencia.reemplazos`.
2. `FotogramaLetra` hoy entrega `actual` y `siguiente`: haría falta una lista de líneas con su puesto fraccionario, o los avances de entrada y salida, como función pura del tiempo.
3. Coste por fotograma de mover hasta 8 líneas (transformación, opacidad y color) sin volver a renderizar React, en un equipo modesto, en la ventana secundaria y en la captura offscreen.
4. Dónde se calcula el gris de la letra y el suelo de contraste (¿`contraste.ts`?), y en qué espacio de color.
5. Medición de renglones a tamaño `S` para todas las líneas visibles y su efecto en el barrido por renglón de 0.2.0.

## h) Criterios de aceptación candidatos y decisiones del usuario

### Criterios candidatos

1. Con «Líneas a la vez» de 2 a 7 se dibujan como máximo ese número de líneas en cualquier instante (test del modelo de render en mitad de una línea, en un hueco y durante una transición).
2. Con N = 2 y sin animación, el fotograma coincide con el de 0.2.1: activa al 45 % y siguiente al 70 % (test de regresión del modelo).
3. Para cada combinación de la tabla de c), el centro de la activa está en el porcentaje indicado ± 0,5 % del alto y no cambia durante toda la canción (test geométrico a 1920 × 1080 y 1280 × 720).
4. La línea activa mide el 7,5 % del alto con cualquier N.
5. Con una línea ya cantada, en el fin efectivo de una línea esta pasa al puesto −1 al 60 % de tamaño y con el gris derivado del color de la letra; «2» solo se puede elegir con 6 o 7 líneas y «1» con 4 o más.
6. Cada puesto atenuado tiene contraste ≥ 3:1 contra la peor muestra del fondo si la letra lo tiene al 100 % (test con el tema incluido, un fondo claro y un degradado de 4 colores).
7. «Desplazamiento»: a la mitad de una transición, la posición, la escala y la opacidad de cada línea son las interpoladas entre sus dos puestos con la curva definida (test del modelo, tolerancia ± 1 px).
8. «Fundido»: durante la transición ninguna línea se aleja más de 0,3 × `S` de un puesto entero.
9. Con dos líneas cuyo inicio dista 300 ms, la segunda transición empieza sin esperar a la primera, no hay discontinuidad de posición entre fotogramas consecutivos mayor que la de la curva, y la duración efectiva es el 60 % del intervalo; por debajo de 120 ms el cambio es instantáneo.
10. Buscar a cualquier instante pinta el mismo fotograma que llegar a él reproduciendo (test del modelo: función pura del tiempo). El salto no produce animación.
11. En pausa a mitad de una transición la letra queda congelada; al reanudar continúa desde el mismo avance.
12. Con movimiento reducido emulado no hay ninguna interpolación de posición, tamaño ni opacidad entre puestos; la línea ya cantada sigue viéndose en gris; el barrido y la barra de espera siguen avanzando.
13. En un hueco de 8 s con indicadores, la barra, la cuenta y los puntos tienen las mismas coordenadas relativas a la activa con 0, 1, 2 y 3 indicadores y no solapan ninguna línea; las futuras están visibles durante todo el hueco y las pasadas se retiran a los 2 s.
14. Tras la última línea no quedan líneas en pantalla 2,4 s después de su fin.
15. En «Letra lista» ningún píxel de la letra tiene el color de lo ya cantado durante una transición (captura a mitad de la salida de una línea).
16. Una línea de dos renglones tiene los mismos cortes de renglón en todos los puestos por los que pasa (test con una línea de 60 caracteres a 16:9 y a 4:3).
17. Ninguna línea se dibuja cortada: si su caja pasa del 86 % (o queda por encima del 10 %) del alto, no se dibuja (test con 7 líneas en 4:3 y líneas de dos renglones).
18. El barrido palabra a palabra de una línea con tiempos hechos a mano avanza igual que en 0.2.1 mientras la línea se desplaza.
19. La vista previa del editor, el reproductor y un fotograma exportado dan el mismo modelo en el mismo instante, también a mitad de una transición (test compartido).
20. Un video exportado contiene las transiciones aunque el sistema pida movimiento reducido.
21. Panel Estilo: los tres controles funcionan con teclado como grupos de radio; cada cambio es un paso de deshacer; las opciones no disponibles son `aria-disabled` con su motivo visible; «Cambiar solo en esta canción» y «Usar la del tema» se comportan como en «Indicadores de espera».
22. Una biblioteca de 0.2.1 abierta en 0.2.2 muestra 5 líneas con 1 ya cantada y desplazamiento sin reescribir ningún archivo (o 2 líneas, según la decisión 2).

Verificación manual: legibilidad a 5 m en una TV de 55" con 5 y con 7 líneas; que ninguna de las dos animaciones maree en una canción rápida; 4:3 en proyector; fluidez en la ventana secundaria de un equipo modesto; video a 24 y a 60 FPS.

### Decisiones que necesita el usuario

| N.º | Decisión | Opciones | Recomendación |
|---|---|---|---|
| 1 | Dónde viven los ajustes | A tema con «solo en esta canción» · B Ajustes → Reproductor · C por canción · D combinación | **A** |
| 2 | Bibliotecas y temas existentes al actualizar | Pasan a 5 · Siguen en 2 | **Pasan a 5** |
| 3 | Predeterminado de «líneas ya cantadas» | 1 · Ninguna | **1** (es la animación que pediste) |
| 4 | Línea ya cantada con 3 líneas (pasada + activa + siguiente) | No, como dijiste («más de 3») · Sí | **No**, tal como lo pediste; es fácil abrirlo después |
| 5 | Hasta 2 líneas ya cantadas con 6 y 7 | Sí · Solo 1 | **Sí**; es prescindible si se quiere recortar alcance |
| 6 | Segunda animación y opción sin animación | «Fundido» + «Sin animación» · solo las dos animadas | **«Fundido» y además «Sin animación»** |
| 7 | Fin de línea con hueco corto | Dos tiempos (sube al acabar; la siguiente entra en su inicio) · Un solo movimiento al empezar la siguiente | **Dos tiempos** (conserva el fin de línea visible de 0.2.0). Míralo en la maqueta con los primeros versos |
| 8 | Pausas largas | Futuras a la vista + indicadores, pasada retirada a los 2 s · Pantalla sin texto como hoy | **Futuras a la vista** |
| 9 | Líneas de dos renglones | Conservan su forma en todos los puestos · Se recolocan al cambiar de tamaño | **Conservan su forma** |
| 10 | Tamaño de la activa con 6 y 7 | Igual que hoy (7,5 %) · Reducirla para que quepa más | **Igual que hoy** |
| 11 | Exportación | Usa lo del tema, sin control en el diálogo · Control propio en el diálogo | **Sin control propio** |

## i) Qué deja fuera y por qué

| Fuera | Motivo |
|---|---|
| **Disposición «página»** del karaoke clásico (el texto no se mueve; el resaltado baja por la página y luego se cambia la página entera) | Es otro modelo: la activa cambia de sitio y los indicadores de espera necesitarían otras posiciones. Merece su propia propuesta si interesa. |
| **Teleprompter continuo** | La línea que se canta nunca está quieta; mal con pausas largas. |
| **Desenfoque o rebote** de las líneas | Legibilidad a distancia y regla de «la letra no rebota». |
| **Ajuste por línea** (esta línea con más o menos contexto) | Es trabajo manual por canción; va contra «automatizar al máximo». |
| **Número de líneas automático según el tempo** (más líneas en canciones rápidas) | Encaja con el criterio de automatizar, pero necesita datos de más canciones para fijar la regla. Candidata a propuesta aparte: con los datos de hoy solo una canción de 12 lo justificaría. |
| **Ajuste global por equipo** en Ajustes | Dos sitios que deciden lo mismo. El movimiento reducido del sistema ya cubre lo que depende del equipo. |
| **Cambiar el número de líneas desde el reproductor** con una tecla | Útil en una sesión en vivo, pero abre la pregunta de si se guarda y dónde. Se puede proponer después. |
| **Tamaño de letra configurable** | Los valores de sistema visual §10 siguen fijos. |
| **Posición del bloque** (arriba, centro, abajo) | La activa anclada cerca del centro es lo que mejor se lee; añadirlo multiplica las pruebas. |
| **Segunda voz, dúos y traducciones** | No hay datos para ello en la letra. |
| **Clic en una línea para saltar a ella** | El reproductor no tiene interacción sobre la letra. |

## Fuentes

- Apple: [See lyrics and sing in Apple Music](https://support.apple.com/HT204459), [Apple Music Sing (nota de prensa)](https://www.apple.com/newsroom/pdfs/Apple-Music-Sing.pdf).
- TechCrunch: [Apple Music is getting a new karaoke-like feature](https://techcrunch.com/2022/12/06/apple-music-is-getting-a-new-karaoke-like-feature-apple-sing).
- Comunidad de Spotify: [Lyrics display on PC… only 3 lines that jump](https://community.spotify.com/t5/Desktop-Windows/Lyrics-display-on-PC-very-unpleasant-only-3-lines-that-jump/td-p/5367764), [New lyrics feature should highlight only the current lyric row](https://community.spotify.com/t5/Android/New-lyrics-feature-should-highlight-only-the-current-lyric-row/m-p/5304165).
- Youka: [Layout options](https://docs.youka.io/en/web/layout-options).
- Wikipedia: [CD+G](https://en.wikipedia.org/wiki/CD%2BG).
- Power Karaoke: [Creating CDG files](https://docs.powerkaraoke.com/books/ai-karaoke-cdg-creator-user-manual/page/creating-cdg-files).
- Acoustica Mixcraft: [Lyric Track and Karaoke View](https://acoustica.com/mixcraft-11-manual/lyric-track-and-editor).
- OBS: [LyricDisplay](https://obsproject.com/forum/threads/lyricdisplay-professional-lyrics-presentation-for-live-production.191349/post-708459).
- W3C: [Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions).
