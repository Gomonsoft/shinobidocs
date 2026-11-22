# Exploración · Varios cantantes y coros

- Versión: sin asignar (se explora durante la definición de 0.2.2). Propuesta formal: [036](../../../propuestas/036-varios-cantantes-y-coros.md).
- Autor: Diseñador UX. Fecha: 2026-11-22.
- Estado: **exploración, sin autorizar**. No es una spec: no cambia `docs/ux/`, el [plan](../plan-4.md) ni el [backlog](../backlog.md). Las decisiones abiertas llevan la opción recomendada aplicada como **decisión provisional** y están reunidas en la pregunta [0160](../../../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md). Las dudas técnicas, en [0161](../../../preguntas/0161-viabilidad-tecnica-de-varios-cantantes-y-coros.md).
- Los ejemplos usan letra inventada.

Vocabulario: **línea** = elemento `tipo: "linea"` de la letra (lo que la exploración de la feature 1 llama «enunciado»). **Parte** = quién canta una línea (un cantante, «Todos» o «Coro»). **Carril** = fila de la línea de tiempo dedicada a una parte. **Grupo simultáneo** = dos o más líneas de partes distintas que suenan a la vez. `S` = tamaño de la línea activa (7,5 % del alto).

## Resumen de la recomendación

1. **Modelo**: cada línea tiene una **parte**: «Cantante 1» a «Cantante 4», «Todos» o «Coro». Sin asignar = Cantante 1, así que **una canción de un solo cantante no cambia en nada**. Los nombres y el reparto son de la canción; los colores, del tema.
2. **Etapa 1 (mínima útil)**: asignar **líneas enteras** a una parte desde la lista (menú, tecla **C**, selección múltiple) y arrastrando entre **carriles** de la línea de tiempo; en pantalla, el barrido toma el **color de la parte** y cada línea lleva una **insignia** con la inicial del cantante; el coro va **entre paréntesis**. Sin superposición: las líneas siguen una detrás de otra, como hoy.
3. **Etapa 2**: **voz guía en los coros** (la voz separada sube a un nivel fijado por canción solo mientras suenan las líneas de coro), en el reproductor, el editor y la exportación.
4. **Etapa 3**: **voces superpuestas** (dos líneas a la vez), con el **modo «Reparto»** de la lista en columnas y **grupos simultáneos** en pantalla. Es la única etapa que toca las reglas de datos de la letra (ADR 0006) y el modelo de puestos de la feature 1.
5. **Etapa 4**: **cambio de parte dentro de una línea** (palabras de un cantante y palabras de otro, o un eco entre paréntesis al final de la línea), apoyado en los tiempos por palabra.
6. **Dónde meterla**: **no dentro de 0.2.2** (ya tiene once features y 56 tareas). Recomiendo una **versión propia, 0.2.3, con las etapas 1 y 2**, y las etapas 3 y 4 en 0.3.0. **Antes de implementar las features 1 y 2 de 0.2.2** conviene tomar cuatro decisiones baratas que evitan rehacerlas (§11.2): color de barrido **por línea**, insignia con ancho reservado, el «enunciado» del modelo de puestos como **unidad que puede tener varias filas**, y el subrayado y el aviso de daltonismo pensados para **varios colores**.

## 0. Qué he comprobado y qué supongo

| Comprobado | Dónde |
|---|---|
| Una línea tiene `id`, `tipo`, `texto`, `inicio_ms`, `fin_ms`, `palabras` y `origen_palabras`; no hay campo de cantante. El esquema es `z.object`, que **descarta claves desconocidas** al leer. | `app/src/shared/letra.ts` |
| Los inicios son **estrictamente crecientes** y un fin fijado cumple `inicio < fin ≤ inicio del siguiente` (invariantes): hoy **no pueden existir dos líneas a la vez**. | ADR 0006; spec 06 «Datos que usa» |
| El modelo de la feature 1 da **una sola línea activa** y «nunca hay dos cambios a la vez» por construcción (relevo o dos tiempos entre la línea *i* y la *i+1*). | ADR 0022 §2; spec 07 · Feature 1 |
| La línea activa barre en `color_resaltado` del estilo; la feature 1 mezcla el gris con `color-mix(… var(--k-color-base))` **por nodo**. | spec 07, sistema visual §10 y · Feature 1, ADR 0022 §3 |
| El motor de audio ya tiene una **ganancia propia para la voz** (`gananciaVoz`): subirla y bajarla en tramos es posible sin pistas nuevas. | `app/src/renderer/src/karaoke/motorReproductor.ts` |
| La exportación mezcla «Solo instrumental» o «Instrumental y voz» al 100 %; no usa el nivel de voz guía del equipo. | spec 10 «Qué contiene el video» |
| En la lista del editor **no hay selección múltiple**; las teclas libres de una letra no incluyen **C** (sí están I, O, L, P, F, R, 1, 2, 3). | spec 06, atajos de 0.2.1 y features 9–11 |
| En la biblioteca del usuario (solo lectura, sin copiar letra): **2 de 17** canciones traen líneas de coro entre paréntesis desde LRCLIB: **13 líneas enteras entre paréntesis** (10 de 101 en la canción rápida, 3 de 71 en otra) y **unas 7** con un paréntesis a media línea (un eco al final de la frase). Ninguna canción tiene información de quién canta. | `…\ShinobiKaraoke\biblioteca\*\cancion.json` |

Supongo (sin comprobar): que LRCLIB casi nunca marca quién canta (solo los paréntesis del coro); que la voz separada contiene **voz principal y coros juntos** (el modelo actual no los separa: ver la [exploración de mejoras](mejoras-de-experiencia.md) §3.11), lo que limita la voz guía de los coros (§5.5); que el arquitecto puede automatizar la ganancia de la voz con rampas sin chasquidos (pregunta 0161).

## 1. Lo que pidió el usuario y lo que muestran sus referencias

Pedido (resumido): pensar en dúos, tríos y cuartetos y en los coros; **arrastrar la línea** que canta la segunda persona y **darle su espacio**; opción **«ambos/todos»**; en los coros, que **se escuche la voz hasta cierto volumen**; **líneas de tiempo y líneas de letra separadas por cantante** y un **rediseño de la zona de líneas del editor** con ajuste de tamaños; y comprobar **encaje y lugar** frente a lo planeado.

| Referencia | Qué se ve | Qué tomo |
|---|---|---|
| Dúo 1 | Dos bloques a la vez, uno encima de otro; cada cantante barre en su color; las dos voces avanzan juntas con textos distintos. El texto aún sin cantar ya lleva un tinte del color de su cantante. | El **grupo simultáneo** (etapa 3): cada voz en su fila, con su propio barrido. El barrido en el **color de la parte**. Descarto el tinte del texto sin cantar: resta contraste a la letra y con 5 líneas sería ruido. |
| Dúo 2 | Cuatro renglones; el color dice quién canta (uno, otro, o los dos en un tercer color); una frase repetida cambia de color a mitad (empiezan juntos y la termina uno). | **«Todos» con color propio**. El **cambio de parte a mitad de línea** (etapa 4). |
| Coros | El coro va **entre paréntesis** y en otro color, arriba y abajo de la línea principal; la principal barre en el centro y el coro tiene su barrido. | **Coro = parte con paréntesis y color propio**. El coro que acompaña a una línea a la vez se dibuja como **fila satélite** del grupo (etapa 3). |

No se copian imágenes, marcas ni el aspecto de esos productos: solo el comportamiento.

## 2. Modelo mental

### 2.1 Partes

| Parte | Qué es | Por defecto |
|---|---|---|
| **Cantante 1** | La voz principal. Toda línea sin asignar es del Cantante 1. | Nombre «Cantante 1»; color = el color de lo ya cantado del tema. |
| **Cantante 2, 3, 4** | Las demás voces de un dúo, trío o cuarteto. Existen solo si se añaden. | «Cantante 2»… con el color de su ranura en el tema. |
| **Todos** | Cantan juntos todos los cantantes de la canción («ambos» en un dúo). | Nombre fijo «Todos»; color propio del tema. |
| **Coro** | Voces de acompañamiento: ecos, respuestas, «uh-uh». Se dibuja entre paréntesis y, desde la etapa 2, puede llevar **voz guía**. | Nombre fijo «Coro»; color propio del tema. |

- Máximo **4 cantantes** (lo pedido: hasta cuartetos). «Todos» y «Coro» siempre están disponibles en cuanto la canción tiene al menos una asignación.
- El **nombre** de un cantante es de la canción (por ejemplo, el de cada intérprete del dúo original, o «Ella» y «Él»); se edita en el editor. En pantalla se ve su **inicial** (§6.2). Los nombres de quien canta en la fiesta son otra cosa (la cola, propuesta 034); no se mezclan **(decisión provisional 3)**.
- El **coro es una parte**, no una marca que se combine con un cantante: «coro de Luis» no existe. Lo que importa en pantalla y en el audio es que sea coro **(decisión provisional 2)**.

### 2.2 Asignar una línea

- **Unidad: la línea entera** en las etapas 1 a 3 **(decisión provisional 1)**. Cubre el dúo por turnos (el caso más común) y el coro de línea propia (las 13 líneas del usuario).
- **Tramos dentro de una línea** (el cambio de color a mitad de frase del Dúo 2, o «verso principal (eco)») quedan para la etapa 4: necesitan saber dónde cae cada palabra, y eso solo existe de forma fiable con los tiempos por palabra (editor preciso de 0.2.1 o la sincronía automática de la feature 10). Mientras tanto, quien lo necesite puede partir la línea en dos en «Corregir la letra».
- Asignar **no cambia** el texto ni los tiempos, no descarta tiempos por palabra, no cuenta como cambio para la revisión guiada (feature 11) y **es un paso de deshacer** (por gesto, aunque afecte a varias líneas).
- **Paréntesis**: los dibuja el render en las líneas de coro, no se escriben en el texto. Si el texto ya empieza por «(» y acaba en «)», no se duplican **(decisión provisional 17)**.

### 2.3 Voces superpuestas

Hoy dos líneas no pueden sonar a la vez (inicios estrictamente crecientes). En un dúo real pasa a menudo: los dos cantan frases distintas al mismo tiempo, o el coro responde mientras la voz principal sigue.

- **Etapas 1 y 2: sin superposición.** Las líneas siguen en una sola secuencia temporal. Si dos voces se pisan, se asigna la línea a «Todos» o se elige la voz que guía. Es una limitación consciente para que el primer corte no toque ni las reglas de datos ni el modelo de la feature 1.
- **Etapa 3: superposición por partes.** Dos líneas de **partes distintas** pueden solaparse; dentro de una misma parte se mantienen las reglas de hoy. En pantalla, las líneas que se solapan forman un **grupo simultáneo** que ocupa **un solo puesto** del modelo de la feature 1 (§6.4). Requiere relajar las invariantes del ADR 0006 (pregunta 0161 §3).

### 2.4 Datos (boceto para el arquitecto, no contrato)

```jsonc
"letra": {
  "partes": {                                   // opcional; ausente = un solo cantante
    "cantantes": [ { "id": "c1", "nombre": "Ana" }, { "id": "c2", "nombre": "Luis" } ],
    "voz_en_coros": 0.5                          // etapa 2; 0–1; ausente = 0,5
  },
  "lineas": [
    { "id": "…", "tipo": "linea", "texto": "…", "inicio_ms": 12400, "fin_ms": null,
      "palabras": null, "parte": "c2" },         // "c1"…"c4" | "todos" | "coro"; ausente = "c1"
  ]
}
"estilo": { "letra": { …, "colores_partes": { "c2": "#4ADEDE", "c3": "#FF5C8A", "c4": "#7CFF6B",
                                              "todos": "#B388FF", "coro": "#FF9F1C" } } }  // opcional
```

- El color de **c1** no se guarda: es `color_resaltado`. Así un tema existente ya tiene su Cantante 1 y nada cambia al actualizar.
- **Compatibilidad**: 0.2.1 y 0.2.2 descartan `parte` y `partes` al leer (`z.object`). Si una de ellas **reescribe** la canción, se pierde el reparto. Es la misma pérdida aceptada en ADR 0018 §1 y ADR 0022 §1; se avisa en las notas.

## 3. Editor

### 3.1 Principio: quien no usa la función no la ve

Una canción sin partes se ve **exactamente igual que hoy**: sin chips en la lista, una sola pista de líneas en la línea de tiempo, sin sección nueva en Estilo (salvo el resumen plegado, §7.2). Las únicas puertas visibles son una sección en «Funciones», un ítem en el menú contextual de la fila y la tecla **C**.

### 3.2 Qué se conserva y qué cambia

| Zona | Se conserva | Cambia (solo en canciones con partes, salvo que se diga) |
|---|---|---|
| Distribución (subfase 2.1) | Tres columnas, dock, divisores, rieles, persistencia, «Qué cede primero», mínimo 1024 × 576 | Nada en la etapa 1. En la etapa 3, el modo «Reparto» ensancha la lista (§3.6). |
| Lista de líneas | Fila, tiempos, ▶, selección, seguimiento, banderas ⚑ de la feature 11, ◈ del editor preciso, menú contextual, «Corregir la letra» | Chip de parte al principio de la fila. **Selección múltiple** (en todas las canciones: es la puerta para repartir). Ítem «¿Quién canta?…» en el menú contextual (en todas). |
| Panel Sincronía | Todo | Fila «Canta» con el chip y su menú bajo el texto de la línea. Con varias líneas seleccionadas, panel de selección múltiple (§3.4). |
| Línea de tiempo | Regla, onda, tiradores, zoom, vista general, doble clic, Bloquear enunciado | Una **pista por parte en uso** (carriles) en lugar de la pista única de líneas; arrastre vertical de una región a otro carril (§3.5). |
| Panel Estilo | Todo | Sección «Cantantes y coros» con los colores del tema (§7.2). |
| Funciones | Todo | Sección «Cantantes y coros» (§3.7). |
| Vista previa | Mismo render | Colores e insignias de las partes (§6). |
| Modo al ritmo | Igual en etapas 1 y 2 | En la etapa 3, poder sincronizar **una sola parte** (§3.8). |

### 3.3 Lista de líneas

```
│ Líneas 48/52 sincronizadas        [◈][⚑›][«] │
│ ┌─────────────────────────────────────────┐ │
│ │ 00:12.40 (A) Guardo en la manga un      │ │  chip A en el color de Cantante 1
│ │              verso doblado              │ │
│ │▶00:15.80 (L) Que nadie sabe de dónde    │ │  chip L: Cantante 2 «Luis»
│ │              llegó                      │ │
│ │ 00:18.10 (A·L) Paso a paso, sin hacer   │ │  Todos: las iniciales juntas
│ │              ruido                      │ │
│ │ 00:20.30 ( ) (de puntillas)             │ │  Coro: chip con paréntesis; texto en texto-2
│ │ ♪ pausa                                 │ │
│ └─────────────────────────────────────────┘ │
│ Corregir la letra                           │
```

| Elemento | Comportamiento |
|---|---|
| **Chip de parte** | Solo si la canción tiene partes. Píldora de 20 px de alto, ancho mínimo 24 px, a la izquierda del texto: borde de 2 px en el color de la parte, texto `t-pequeno` `texto-1` con la inicial del cantante (o sus dos primeras letras si dos nombres empiezan igual), «A·L» para Todos y «( )» para Coro. El color nunca va solo: el chip dice quién es. Tooltip y nombre accesible: `edi.partes.chip` («Canta: Luis»). Clic: abre «¿Quién canta?» sobre esa fila (y la selecciona). |
| **Texto del coro** | Entre paréntesis dibujados (sin tocar el texto) y en `texto-2`, para distinguirlo también sin color. |
| **Selección múltiple** | Clic = una; **Ctrl/Cmd + clic** añade o quita; **Mayús + clic** y **Mayús + ↑/↓** extienden el rango (saltando pausas). La fila con el foco es la **seleccionada principal**: la que siguen la línea de tiempo, el editor preciso y los atajos de tiempos. Esc (sin nada más abierto) deja solo la principal. Una sola selección sigue siendo lo normal. |
| **Qué hace la selección múltiple** | Solo **asignar parte** (menú, C, arrastre). Los atajos de tiempos (I, O, Supr, Alt/Ctrl + flechas, P) actúan **solo sobre la principal** y lo dicen en su tooltip con varias seleccionadas **(decisión provisional 10)**. No hay borrado ni ajuste masivo de tiempos: no lo pidió nadie y es fácil romper una sincronía. |
| **Ancho** | El chip cabe en el mínimo de 256 px; el texto pierde 28 px. Sin cambios en la lista minimizada salvo el chip bajo el número de línea. |

**Menú «¿Quién canta?»** (componente «Menú contextual» del sistema visual)

```
┌ ¿Quién canta? ─────────────────────┐
│ (A) Cantante 1 · Ana          1  ✓ │
│ (L) Cantante 2 · Luis         2    │
│ (A·L) Todos                   T    │
│ ( ) Coro                      C    │
│ ────────────────────────────────── │
│ + Añadir cantante                  │  hasta 4
│ Nombres de los cantantes…          │  abre la sección de Funciones
└────────────────────────────────────┘
```

| Entrada | Comportamiento |
|---|---|
| **Tecla C** (fuera de campos de texto, con el foco en la lista, la línea de tiempo o el panel) | Abre el menú sobre la selección. Dentro, **1–4** eligen cantante, **T** Todos, **C** Coro (pulsar C dos veces asigna el coro), ↑/↓ e Intro, Esc cierra. |
| **Menú contextual de la fila** | Ítem nuevo «¿Quién canta?… (C)» tras «Editor preciso de línea… (P)». |
| **Chip** (lista, panel, riel) | Abre el menú. |
| **Canción sin partes** | El menú muestra «Cantante 1» (marcado), «+ Añadir cantante», «Todos» y «Coro». Elegir «+ Añadir cantante» crea Cantante 2 y **asigna la selección** a él: dos acciones en un gesto, un paso de deshacer. Así se empieza un dúo sin pasar por ningún ajuste. |
| Asignar | Un paso de deshacer (`edi.partes.paso`), autoguardado como cualquier cambio. Anuncio `edi.partes.anuncio` («3 líneas para Luis»). El foco vuelve a la fila principal. |
| **Alt + 1…4** (atajo directo, opcional) | Pendiente de que el arquitecto confirme que no choca con los aceleradores del menú de la app en Windows (0161 §6). Si choca, solo C. |

### 3.4 Panel Sincronía

```
│ Línea 12 de 52                                  │
│ «Que nadie sabe de dónde llegó»                 │
│ Canta  [(L) Luis ▾]                             │  fila nueva, solo con partes
│ Inicio [ 00:15.80 ] …                           │
```

Con varias líneas seleccionadas:

```
│ 3 líneas seleccionadas                          │
│ Canta  [Varias ▾]   (o el chip si coinciden)    │
│ Los tiempos se editan de una en una: los        │
│ controles de abajo son de la línea 12.          │
│ (controles de la línea principal)               │
```

El riel del panel minimizado añade el chip bajo «Fin» (abre el menú).

### 3.5 Línea de tiempo con carriles

**Etapas 1 y 2** (sin superposición): una pista por parte **en uso**, en el orden Cantante 1–4, Todos, Coro. Cada pista lleva a la izquierda una etiqueta de 72 px con el chip y el nombre.

```
Línea de tiempo  [−][+][Zoom a la línea][Ver canción completa][Centrar en el cabezal] [Juntar carriles] [⌄]
Regla              00:12          00:14          00:16          00:18          00:20
Voz                  ▂▅▇▅▃▂▁        ▂▃▇▅▃▂▁         ▂▅▇▅▃▂▁        ▂▃▅▃▁
(A) Ana            [Guardo en la man…]
(L) Luis                          [Que nadie sabe d…]
(A·L) Todos                                        [Paso a paso, si…]
( ) Coro                                                           [(de pun…)]
Vista general   ├────────────[ intervalo visible ]──────────────────────────────┤
```

| Aspecto | Comportamiento |
|---|---|
| **Alto** | Onda 28 px; cada carril 24 px (mínimo 16). Al tener más de un carril, el alto por defecto de la sección crece 24 px por carril extra: con dos cantantes y coro, 264 px en lugar de 216. Es un **alto efectivo**: la preferencia del usuario (subfase 2.1) no se reescribe. |
| **Qué cede primero** | Se añade un paso entre el 2 y el 3 de la subfase 2.1: los carriles bajan de 24 a 16 px; si aún no cabe, se **juntan solos** en una pista (estado temporal, como «minimizada por falta de espacio»). A 1280 × 720 (zona superior ≈ 300 px) caben tres carriles a 24 px dejando ≥ 230 px arriba; seis carriles (4 cantantes, Todos y Coro) dejan ≈ 160 px, por encima del mínimo de 136. |
| **Juntar carriles** | Botón alternable (`aria-pressed`) en la fila de controles: todas las regiones en una pista, con una franja superior de 3 px en el color de la parte y la inicial al principio de la región. Se recuerda para todas las canciones. Es también el aspecto de una canción sin partes (sin franja). |
| **Arrastre entre carriles** | Arrastrar el **cuerpo** de una región en vertical (umbral de 8 px) la lleva a otro carril: la región sigue al puntero en vertical, el carril de destino se resalta (`acento-texto`) y al soltar se asigna. El componente horizontal del gesto se **ignora** (el cuerpo de una región no mueve tiempos: eso sigue siendo de los tiradores). Esc o soltar fuera de un carril cancelan sin crear paso. Con varias seleccionadas, arrastrar una de ellas lleva todas. |
| **Soltar en «+ Nuevo cantante»** | Con menos de 4 cantantes, durante el arrastre aparece bajo el último carril de cantante una franja discontinua `edi.partes.nuevoCarril`; soltar ahí crea el cantante y asigna. |
| **Teclado** | El arrastre **nunca es la única vía**: con el foco en una región, C abre el menú; además **Alt + ↑/↓** la mueven al carril de arriba o de abajo (Alt + ←/→ ya son del inicio y no cambian). |
| **Doble clic, tiradores, Bloquear enunciado, editor preciso** | Igual que hoy, en el carril de la región. |
| **Etapa 3** | Como la de arriba, pero dos regiones de carriles distintos pueden solaparse en el tiempo; los tiradores respetan solo a las vecinas **de su mismo carril**. |

### 3.6 Modo «Reparto» de la lista (etapa 3)

Es la respuesta a «líneas de letra separadas» y «darle su espacio» cuando hay voces a la vez: la lista se convierte en una **partitura** con una columna por parte y una fila por momento. Dos líneas que suenan a la vez quedan **en la misma fila**, lado a lado.

```
┌ Reparto · 52 líneas ─────────────────────────────────────────────────── [Lista] [«] ┐
│ Tiempo    │ (A) Ana               │ (L) Luis              │ ( ) Coro              │
│ 00:12.40  │ Guardo en la manga un │                       │                       │
│           │ verso doblado         │                       │                       │
│ 00:15.80  │                       │ Que nadie sabe de     │                       │
│           │                       │ dónde llegó           │                       │
│ 00:18.10  │ Paso a paso, sin hacer ruido  (A·L Todos)     │                       │  fila que abarca
│ 00:20.30  │ Cruzo la noche        │ Cruzo la noche        │ (de puntillas)        │  superpuestas
│ ♪ pausa                                                                           │
└───────────────────────────────────────────────────────────────────────────────────┘
```

| Aspecto | Comportamiento |
|---|---|
| Entrar y salir | Botón alternable «Reparto» / «Lista» en la fila de título de la lista. Se recuerda para todas las canciones. Solo con partes. |
| Ancho | Al entrar, la lista pasa a un ancho preferido propio: 72 px de tiempo + 140 px por columna (dos cantantes y coro: 492 px). Máximo: lo que deje 320 px a la vista previa. A 1280 × 720 caben 4 columnas de ≈ 130 px; con 5 o 6, el panel derecho se minimiza solo mientras dure el modo (sin tocar su preferencia) y, si aún no caben, las columnas bajan a 110 px y el texto se corta con «…». |
| Todos | Una celda que **abarca** las columnas de los cantantes. |
| Mover | Arrastrar una celda a otra columna; con el foco en una celda, **← / →** la llevan a la columna vecina (en este modo las flechas sin modificador son de la lista); C abre el menú. ↑/↓ cambian de fila. |
| Selección | La misma que en la lista: la celda con el foco es la principal. |
| Seguimiento y ▶ | Igual que la lista. |

### 3.7 Funciones › «Cantantes y coros»

Sección nueva de la pestaña «Funciones», después de «Ajustar los silencios» (no es una función automática de sincronía).

```
│ Cantantes y coros                                         │  h3
│ Reparte la letra entre varias voces. Cada una se          │  t-pequeno, texto-2
│ ve en su color al cantar.                                 │
│                                                           │
│ (sin partes)                                              │
│ [Repartir entre varios cantantes]                         │  crea Cantante 2 y abre su nombre
│ ⓘ 13 líneas van entre paréntesis: suelen ser coros.       │  solo si las hay
│   [Marcarlas como coro]                                   │
│                                                           │
│ (con partes)                                              │
│ (A) [ Ana              ]  22 líneas                       │  campo de nombre, recuento
│ (L) [ Luis             ]  18 líneas   [✕]                 │  quitar cantante (sus líneas → Cantante 1)
│ (A·L) Todos               6 líneas                        │
│ ( ) Coro                  4 líneas                        │
│ [+ Añadir cantante]                                       │  hasta 4
│                                                           │
│ Voz en los coros   [━━━━━●━━━━] 50 %   [▶ Escuchar]       │  etapa 2 (§5)
│ La voz original suena a este volumen mientras se          │
│ cantan las líneas de coro.                                │
```

- **Marcarlas como coro**: una sugerencia, no un automatismo; un paso de deshacer; aparece solo si hay líneas enteras entre paréntesis sin asignar. Con los datos del usuario, en 2 de 17 canciones **(decisión provisional 13)**.
- **Quitar cantante**: sus líneas pasan al Cantante 1; un paso de deshacer; sin confirmación. Quitar el último cantante extra con «Todos» y «Coro» vacíos deja la canción **sin partes**.
- El recuento por parte es un botón: selecciona esas líneas en la lista.

### 3.8 Convivencia con lo que ya existe en el editor

| Con | Comportamiento |
|---|---|
| **Editor preciso de línea** (0.2.1) | Sin cambios: trabaja con una línea. La barra de título añade el chip de la línea. En la etapa 4, la tira de palabras gana un modo «Partes» para pintar palabras con otra parte (§10). |
| **Bloquear enunciado** | Sin cambios: el bucle es de la línea seleccionada principal, en su carril. |
| **Modo «Sincronizar al ritmo»** | Etapas 1 y 2: sin cambios (la secuencia sigue siendo una). La lista resalta «Siguiente» con su chip. Etapa 3: con líneas solapadas, una sola pasada no puede marcar dos inicios a la vez; el botón gana «Sincronizar al ritmo: [Todas las partes ▾]» para marcar una parte cada vez. |
| **Paneles redimensionables** | Los divisores y mínimos no cambian; los carriles se suman al alto efectivo de la línea de tiempo (§3.5) y el modo «Reparto» tiene su ancho preferido propio (§3.6). «Restablecer distribución de paneles» también los restablece. |
| **1280 × 720 y 1024 × 576** | Etapa 1: el chip y una pista por parte; a 1024 × 576 los carriles se juntan solos (§3.5). Etapa 3: «Reparto» minimiza el panel si hace falta. Ninguna pieza añade scroll de página. |
| **Corregir la letra** (vista Letra) | Una línea que no cambia **conserva su parte** (como conserva sus tiempos). Una línea nueva o cambiada **hereda la parte de la línea anterior** **(decisión provisional 18)**: cambiar una palabra de un verso de Luis no lo devuelve a Ana. |
| **Deshacer** | Cada asignación, alta, baja o renombre de cantante es un paso. Cambiar el color es del panel Estilo (paso de estilo, como hoy). |
| **Letra lista** | Sin cambios en el editor (la vista previa sigue enseñando el barrido). En el reproductor, ver §6.3. |

## 4. Accesibilidad del editor

- El chip y la etiqueta del carril siempre llevan **texto** (inicial o «( )»); el nombre accesible dice la parte completa.
- Arrastrar es una alternativa: menú (C, contextual, chip), Alt + ↑/↓ en la línea de tiempo y ←/→ en «Reparto».
- La selección múltiple sigue el patrón de lista con `aria-multiselectable="true"`; la principal es la que tiene `aria-current`.
- Los anuncios: uno por asignación (`edi.partes.anuncio`), uno al juntar o separar carriles.
- Objetivos: chip ≥ 24 × 20 px con área de clic de 24 × 24; carriles ≥ 16 px de alto pero con la región seleccionada de al menos 24 px de objetivo (como los tiradores).

## 5. Coros con voz guía (etapa 2)

### 5.1 Qué es

La voz separada (`voz.flac`) sube automáticamente a un nivel elegido **solo mientras suenan las líneas de coro**. Así quien canta la voz principal no tiene que hacer también los coros, y quien no usa voz guía oye los coros donde toca.

### 5.2 Cómo se marca y se ajusta

- Una línea es de coro si su parte es **Coro**. No hay otra marca.
- **Nivel**: deslizador «Voz en los coros» en Funciones › «Cantantes y coros», de **0 a 100 %** en pasos del 5 %, **por defecto 50 %**, por canción (depende de la mezcla de cada canción) **(decisión provisional 12)**. 0 % = coros sin voz guía. El valor se guarda en la canción y es un paso de deshacer (una ráfaga cuenta como uno).
- **[▶ Escuchar]**: reproduce con el instrumental desde 2 s antes de la próxima línea de coro tras el cabezal, hasta 1 s después de su fin, y vuelve a la posición previa en pausa (como la escucha de comprobación). Sin líneas de coro, inactivo con `edi.coros.sinCoros`.
- **Vista previa del editor**: con «Escuchar: Instrumental» se aplica el nivel de coros (lo que oirá el público). Con «Voz» u «Original» no cambia nada (ya suena la voz entera).

### 5.3 Reproductor

| Aspecto | Comportamiento |
|---|---|
| Nivel de la voz en cada instante | `máx(nivel de voz guía del equipo, nivel de coros)` dentro de una línea de coro; fuera, el nivel de voz guía del equipo, como hoy. Con la voz guía al 100 % (el uso real del usuario) no se nota nada; con la voz guía silenciada (la opción de fábrica) suenan solo los coros. |
| Tramo | Desde 150 ms antes del inicio de la primera línea de coro de un tramo hasta 300 ms después de su fin efectivo; líneas de coro separadas por menos de 1 s forman un solo tramo (sin bajar y subir entre ellas). Rampas de 150 ms para evitar chasquidos. Valores provisionales: se ajustan a oído. |
| Voz guía silenciada (V) | **No** silencia los coros: los coros son parte de la canción, no la guía **(decisión provisional 12)**. El indicador breve al silenciar dice `rep.ind.vozsilenciada.coros` («Voz silenciada · coros al 50 %») en canciones con coros. |
| Volumen general y M | Afectan a todo, como hoy. |
| Sin voz separada | No hay coros con voz: suena la mezcla original entera. |
| Pausa, búsqueda | Derivado del tiempo: al buscar a mitad de un coro, la voz ya está en su nivel. |
| Ventana secundaria y cola | Igual, con el nivel de cada canción. |

### 5.4 Exportación a video

- **«Instrumental y voz»**: sin cambios (voz al 100 %).
- **«Solo instrumental»**: si la canción tiene coros con nivel > 0, el diálogo muestra una casilla **«Incluir la voz en los coros ({n} %)»**, **marcada** por defecto. Marcada, el video lleva la voz solo en los tramos de coro con las mismas rampas que el reproductor **(decisión provisional 14)**.
- La instantánea de la exportación incluye el nivel y el reparto.

### 5.5 Límite que hay que contar

La voz separada lleva **voz principal y coros juntos**. Si en una línea de coro la voz principal también canta, también se oirá. Funciona bien cuando el coro canta solo (respuestas, ecos tras la frase); no separa voces que suenan a la vez. Eso lo resolvería la separación de voz principal y coros, hoy bloqueada por la licencia del modelo (fila «Voz principal y coros por separado» del [plan](../plan-4.md)). El texto de ayuda lo dice: `edi.coros.limite`.

## 6. Reproductor y exportación: cómo se pinta

### 6.1 Reglas de color

| Elemento | Canción sin partes | Canción con partes |
|---|---|---|
| Texto sin cantar | `letra.color` | `letra.color` (sin tintes: no se toca el contraste de la letra) |
| Barrido (lo ya cantado) | `color_resaltado` | **Color de la parte** de la línea (Cantante 1 = `color_resaltado`) |
| Subrayado (feature 2) | `color_resaltado` | Color de la parte |
| Línea ya cantada (feature 1) | Gris de la letra | Gris de la letra (la parte deja de importar); la insignia también pasa a gris |
| Letra lista (sin barrido) | `letra.color` | **El texto entero en el color de la parte** (no hay barrido con el que chocar) **(decisión provisional 15)** |
| Indicadores de espera | Puntos y relleno de la barra en `color_resaltado` | En el color de la parte de la **línea que viene**: anuncian quién entra **(decisión provisional 16)**. La cuenta 3·2·1, sin cambios. |

### 6.2 Señales que no dependen del color

1. **Insignia de cantante**: píldora a la izquierda del primer renglón de cada línea, alto 0,55 × el tamaño de la línea, borde en el color de la parte y texto en `letra.color` con la inicial («A», «L»), las iniciales juntas para Todos («A·L») y sin insignia para el Coro (lo identifican los paréntesis). Viaja con la línea (escala, opacidad y gris del puesto). **No mueve el texto**: el texto sigue centrado y la insignia cuelga a su izquierda; para que quepa, el ancho máximo de línea baja del 88 % al **80 %** solo en canciones con partes **(decisión provisional 5)**.
2. **Paréntesis** en las líneas de coro.
3. **Posición** (etapa 3): en un grupo simultáneo, el orden de las filas es fijo (Cantante 1 arriba, luego 2…, coro abajo).

### 6.3 Etapas 1 y 2: una línea cada vez

Encaja en el modelo de la feature 1 sin cambiar puestos, ancla, animaciones ni recorte: cada línea es un enunciado con su color de barrido.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                 (L) y la ciudad se queda sin voz                         │ ← −1 ya cantada: gris
│                                                                          │
│         (A) ████████████████░░░░░░░░░░░░░░░░░░                           │
│             Guardo en la manga un verso doblado                          │ ← activa: barrido en el color de Ana
│                                                                          │
│                 (L) que nadie sabe de dónde llegó                        │ ← +1: insignia de Luis
│                (A·L) Paso a paso, sin hacer ruido                        │ ← +2: Todos
│                     (de puntillas)                                       │ ← +3: coro entre paréntesis
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.4 Etapa 3: grupos simultáneos

Las líneas de partes distintas que se solapan forman un **grupo** que ocupa **un puesto**. Para el modelo de la feature 1 un grupo es «un enunciado más alto», como ya lo es una línea de dos renglones.

```
│                (L) y la ciudad se queda sin voz                          │ ← −1
│                                                                          │
│        (A) ██████████░░░░░░░░░░░░░░░░░                                   │ ← fila de Ana, 85 % de S
│            Cruzo la noche de puntillas                                   │
│        (L) ████████░░░░░░░░░░░░░░░░░░                                    │ ← fila de Luis, 85 % de S, su propio barrido
│            Cruzo la noche sin mirar atrás                                │
│                                                                          │
│                (A) que nadie sabe de dónde llegó                         │ ← +1
```

Coro que acompaña a una línea (satélite):

```
│        (A) ████████████████░░░░░░░░░░                                    │ ← línea principal a S
│            Paso a paso, sin hacer ruido                                  │
│                       (sin hacer ruido)                                  │ ← fila de coro al 70 % de S, su propio barrido
```

| Regla | Valor propuesto |
|---|---|
| Qué forma un grupo | Líneas de partes distintas cuyo intervalo `[inicio, fin efectivo]` se solapa con el de otra del grupo (cadena de solapes). |
| Tiempos del grupo para la feature 1 | Inicio = el menor; fin = el mayor. Relevo, dos tiempos, retirada e indicadores se calculan con esos tiempos: el grupo entra y sale **entero**. |
| Barrido | Cada fila barre con **sus** tiempos; una fila que aún no ha empezado espera sin barrer. |
| Tamaños dentro del grupo (puesto activo) | Cantantes a 85 % de `S`; coro satélite a 70 %. En los demás puestos, la escala del puesto multiplica la del grupo (forma estable, como las líneas de dos renglones). |
| Cuenta en «Líneas a la vez» | Un grupo cuenta como **una** línea. |
| Alto | Puede llegar a 4 renglones; la regla de recorte de la feature 1 (86 % y 10 %) actúa más. La activa sigue sin moverse de altura. |

### 6.5 Encaje con la feature 1 (letra en pantalla) y la feature 2 (subrayado)

| Pieza de 0.2.2 | Conflicto | Salida propuesta | ¿Decidir antes de implementar la feature? |
|---|---|---|---|
| F1 · color de la línea | El color de lo ya cantado es uno por estilo; `--k-color-base` se deriva del estilo. | El color de barrido y la base del `color-mix` se resuelven **por línea** (hoy todas valen `color_resaltado`). Coste casi nulo ahora; rehacerlo después toca `PantallaLetra`, `contraste.ts` y el suelo de contraste. | **Sí** |
| F1 · forma estable de las líneas | Los renglones se calculan una vez con el 88 % del ancho; la insignia necesita espacio. | Que la medición acepte un «ancho reservado a la izquierda» (0 hoy). | **Sí** (parámetro, sin comportamiento nuevo) |
| F1 · suelo de contraste | Se calcula por puesto con un color de letra y uno de barrido. | Etapa 1: el gris de la ya cantada sigue derivando de `letra.color` (no cambia). Los colores de las partes se avisan en el editor (§7.3), no en el suelo. | No |
| F1 · modelo de puestos (`LineaEnPantalla`, `disponerBloque`) | Supone **una línea por puesto** y alturas de 1 o 2 renglones. Un grupo simultáneo (etapa 3) son varias filas en un puesto. | Nombrar ahora la unidad como **enunciado** (una o varias filas) aunque en 0.2.2 siempre tenga una, y que `disponerBloque` reciba **alturas arbitrarias** por enunciado en vez de «1 o 2 renglones». Así la etapa 3 añade filas sin rehacer el modelo. | **Sí** (forma del tipo; lo valida el arquitecto en 0161 §4) |
| F1 · relevo y dos tiempos | Se calculan entre la línea *i* y la *i+1*. | Etapa 3: entre grupos. Sin cambio en 0.2.2. | No |
| F1 · Letra lista | Sin barrido, la ya cantada se distingue por gris. | Con partes, el texto va en el color de la parte; al salir, pasa a gris igual. | No |
| F1 · panel «Letra en pantalla» | — | No cambia. | No |
| F2 · subrayado | Su color es `color_resaltado`. | Color **de la línea** (el mismo valor que el barrido). | **Sí**, junto con el color por línea |
| F2 · aviso de daltonismo | Compara un par (letra, resaltado). | Que la comprobación reciba **una lista de pares**; en 0.2.2 solo uno. Con partes compara también los colores de las partes en uso entre sí (§7.3). | **Sí** (firma de la función) |
| F2 · barra de espera con subrayado | Pista al 35 % y relleno en `color_resaltado`. | Relleno en el color de la parte de la línea que viene (decisión 16). | No |
| F2 · ajuste del equipo «Subrayar siempre» | — | No cambia. | No |

### 6.6 Exportación

El video es el mismo render: colores, insignias, paréntesis y grupos salen igual. La única novedad es el audio de los coros (§5.4). Sin controles nuevos de imagen en el diálogo.

## 7. Estilo, temas y accesibilidad

### 7.1 De dónde salen los colores

**Del tema** (con la herencia de siempre: canción › álbum › artista › predeterminado), porque el contraste depende del fondo **(decisión provisional 7)**. La canción decide **cuántas** partes hay y **quién** canta cada línea; el tema decide **en qué color** se ve cada ranura. Un tema sin colores de partes usa los predeterminados:

| Ranura | Color predeterminado | Nota |
|---|---|---|
| Cantante 1 | `color_resaltado` del tema | Por eso una canción sin partes no cambia. |
| Cantante 2 | `#4ADEDE` (cian, de los sugeridos) | |
| Cantante 3 | `#FF5C8A` (rosa) | |
| Cantante 4 | `#7CFF6B` (lima) | Puede confundirse con el oro en deuteranopía: lo avisa §7.3. |
| Todos | `#B388FF` (lavanda) | Nuevo; no está en los sugeridos. |
| Coro | `#FF9F1C` (naranja) | |

**Sin comprobar**: el contraste y la separación con daltonismo de esta paleta sobre los fondos sugeridos. La función del arquitecto (F2) debe validarla antes de fijarla; si algún par choca sobre el tema «Shinobi», se cambia la ranura.

### 7.2 Panel Estilo

Sección **«Cantantes y coros»** dentro de «Letra», tras «Color de lo ya cantado» y la casilla del subrayado:

- **Canción sin partes**: una sola línea plegada, `edi.estiloPartes.plegado` («Colores para dúos y coros (esta canción no los usa)»), con [Mostrar]. No molesta a quien no los usa.
- **Con partes, en D2 y D3**: un selector de color (componente de siempre) por cada parte **en uso** en esta canción, con su chip; las demás ranuras, plegadas bajo «Más colores». Cantante 1 **es** «Color de lo ya cantado» (se muestra como enlace a ese selector, no duplicado).
- **D1 y D4**: resumen con los chips en su color y la procedencia del tema, sin «Cambiar solo en esta canción» (como el subrayado: para una sola canción, «Personalizar»).

### 7.3 Contraste y daltonismo

Reglas nuevas en el aviso de contraste, **solo con las partes en uso** en la canción (para no avisar de ranuras que nadie ve):

| Comprobación | Umbral | Nivel |
|---|---|---|
| Color de cada parte vs fondo (11 muestras) | < 3:1 | ⚠ `edi.contraste.parte` («El color de Luis apenas se ve sobre el fondo.») con «Sugerir un color» |
| Color de cada parte vs letra | ΔE < 25 | ⚠, como «Resaltado vs letra» |
| Colores de dos partes en uso entre sí | ΔE < 25, o se confunden con daltonismo (comprobación de la F2) | ⓘ `edi.contraste.partesParecidas` («Ana y Luis se parecen: se distinguirán por la inicial.»). Solo informativo, porque la insignia ya los distingue. |

En el reproductor no hay avisos.

## 8. Dónde se configura cada cosa

| Qué | Dónde | Por qué |
|---|---|---|
| Cuántos cantantes y sus nombres | Canción · Funciones › «Cantantes y coros» | Depende de la canción. |
| Quién canta cada línea | Canción · lista, panel Sincronía, línea de tiempo, «Reparto» | Es parte de la letra. |
| Nivel de la voz en los coros | Canción · Funciones › «Cantantes y coros» | Depende de la mezcla de cada canción. |
| Colores de las partes | Tema · Estilo › Letra › «Cantantes y coros» | El contraste depende del fondo. |
| Tamaño de filas de un grupo y del coro satélite | Fijo (sistema visual) | Como los demás tamaños de la letra. |
| Ajustes del equipo | Ninguno en las etapas 1–4 | La voz guía y el volumen ya son del equipo. |

## 9. Interacción con las features planeadas

Leyenda: **No afecta** · **Afecta** (se ajusta al implementar varios cantantes, sin rehacer nada) · **Cambiar antes** (conviene tocar su spec o su ADR antes de implementarla).

### 9.1 Features de 0.2.1 (ya publicadas)

| Fase | Relación | Motivo |
|---|---|---|
| 7 · Correcciones (exportación, perfiles, icono) | No afecta | Nada de imagen ni de datos de letra. |
| 8 · Sincronía más simple (sin palabras importadas, sin S, doble clic, Funciones, sin desplazamiento) | Afecta | La pestaña «Funciones» recibe la sección nueva; la tecla S retirada no se reasigna (se usa C). El doble clic en una región funciona igual en su carril. |
| 9 · Editor preciso de línea | Afecta (etapa 4) | Base de los tramos dentro de una línea: las palabras ya tienen tiempos. En las etapas 1–3 solo muestra el chip. |

### 9.2 Features de 0.2.2

| Feature | Relación | Motivo |
|---|---|---|
| **1 · Letra en pantalla** | **Cambiar antes** | Color de barrido por línea, ancho reservado para la insignia y unidad «enunciado» con alturas arbitrarias (§6.5). Si se implementa tal cual, la etapa 1 tiene que reabrir `PantallaLetra`, `pantalla.ts` y `contraste.ts`, que son las piezas de mayor riesgo de la versión. |
| **2 · Subrayado y aviso de daltonismo** | **Cambiar antes** | Subrayado en el color de la línea y comprobación de daltonismo con lista de pares (§6.5). |
| 3 · Aviso de versión nueva | No afecta | — |
| 4 · Comprobar la letra con la voz | Afecta (etapa 3) | El encaje usa inicios y picos de voz por línea; con líneas solapadas habría que tratar un grupo como un tramo. Etapas 1–2: sin efecto (la voz separada contiene a todos los cantantes). |
| 5 · Preparación desatendida | Afecta (opcional) | Podría marcar como coro las líneas entre paréntesis sin preguntar. Recomiendo que no: queda como sugerencia en el editor (decisión 13). Sin cambios en su spec. |
| 6 · Datos automáticos | No afecta | Un «feat.» en el título podría sugerir un dúo, pero no dice qué línea canta quién. |
| 7 · Importación por lotes | No afecta | — |
| 8 · Acciones por lotes | No afecta | «Exportar varias» hereda la casilla de los coros con su valor por defecto. |
| **9 · Copia, paquete y `.lrc`** | Afecta (decidir al implementar la 9) | Copia y paquete llevan `cancion.json` entero: el reparto viaja solo. El `.lrc` no tiene un estándar de cantantes: recomiendo **no escribir partes** en el `.lrc` (decisión 19) y anotarlo en su spec, para que un `.lrc` reimportado no traiga prefijos raros. |
| 10 · Sincronizar con la voz | Afecta (etapa 3) | Su tramo de escucha es «del inicio de la línea al inicio de la siguiente» y la alineación forzada falla con voces solapadas (límite declarado de WhisperX). Etapas 1–2: sin efecto. Etapa 3: «siguiente» pasa a ser «siguiente de la misma parte» y los grupos se tratan aparte. Base de la etapa 4 (palabras automáticas). |
| 11 · Revisión guiada | Afecta (etapa 3) | `finCorta` y `vozTarde` miran la voz entre una línea y la siguiente; con solapes darían falsos positivos. Asignar parte no borra el «Está bien». |
| Propuesta 034 (cantantes en la cola) | Relacionada, más adelante | Podría asociar «Cantante 1/2» a personas de la cola. No se mezcla en esta propuesta. |
| «Voz principal y coros por separado» | Mejora la etapa 2 | Con una pista de coros aparte, la voz guía de los coros no arrastraría la voz principal (§5.5). |

**Resumen**: las etapas 1 y 2 solo chocan con las features 1 y 2, y el choque se evita con cuatro decisiones baratas tomadas antes de implementarlas. La etapa 3 toca las reglas de la letra y obliga a revisar las features 4, 10 y 11: por eso va después.

## 10. Recorte por etapas

| Etapa | Qué entra | Tamaño | Toca |
|---|---|---|---|
| **1 · Dúo por líneas** (mínima útil) | Partes (Cantante 1–4, Todos, Coro) y nombres; asignar líneas enteras con menú, C, chip, selección múltiple y arrastre entre carriles; carriles en la línea de tiempo (con «Juntar carriles»); sección de Funciones con «Marcarlas como coro»; colores en el tema y avisos de contraste; en pantalla, barrido y subrayado en el color de la parte, insignias, coro entre paréntesis, Letra lista en color de la parte, indicadores en el color de quien entra. | M–L | Esquema de letra y estilo, lista, panel, línea de tiempo, Funciones, Estilo, render (si la F1 ya dejó color por línea e insignia: poco). |
| **2 · Coros con voz guía** | Nivel por canción, automatización de la ganancia de la voz en reproductor, editor, ventana secundaria y exportación; casilla en el diálogo de exportación. | S–M | Motor de audio, mezcla de la exportación, Funciones, diálogo de exportación. |
| **3 · Voces superpuestas** | Invariantes por parte, grupos simultáneos en pantalla, coro satélite, carriles solapados, modo «Reparto», modo al ritmo por parte; ajustes en las features 4, 10 y 11. | L | ADR 0006, modelo de puestos, editor, funciones automáticas. |
| **4 · Partes dentro de una línea** | Cambio de cantante a mitad de frase y eco final entre paréntesis, por palabras; modo «Partes» en el editor preciso; con palabras automáticas (F10) si existen. | M | Datos por palabra, barrido, editor preciso. |
| Más adelante | Detección automática de quién canta (no existe tecnología razonable hoy); cantantes de la cola (034); pista de coros separada. | — | — |

**Corte recomendado**: la etapa 1 sola ya resuelve dúos por turnos y coros visibles, que es lo que muestran dos de las tres referencias. La etapa 2 es pequeña y es lo único de audio que pidió el usuario: recomiendo **entregarlas juntas**. La etapa 3 es la cara (cambia reglas de datos que usan cinco funciones) y conviene hacerla cuando las features 4, 10 y 11 estén asentadas.

## 11. Dónde meterla

### 11.1 Recomendación

| Opción | Pros | Contras |
|---|---|---|
| A · Dentro de 0.2.2, como feature 12, tras la 2 | Llega antes. | 0.2.2 ya tiene 56 tareas y el backlog recomienda no publicarlas juntas; los lotes B (render) y C (editor) ya están ocupados hasta alpha.2–alpha.4. Retrasaría todo. |
| **B · 0.2.3 con las etapas 1 y 2; etapas 3 y 4 en 0.3.0** | Versión corta y temática («cantar acompañado»); se apoya en la F1 y la F2 ya hechas; la etapa 3 espera a que 4, 10 y 11 estén probadas. | Hay que tomar ahora las cuatro decisiones de §11.2 para no rehacer la F1 y la F2. |
| C · Todo en 0.3.0 | Sin prisas. | Pierde la ventaja de la etapa 1, que es barata si la F1 se prepara. |

Recomiendo **B** **(decisión provisional 20)**. Si el usuario prefiere A, el sitio menos dañino es **una feature 12 en alpha.4**, después de la 2 (render) y de la 11 (editor), con solo la etapa 1.

### 11.2 Qué decidir ahora en 0.2.2 (antes de implementar las features 1 y 2)

1. **Color de barrido por línea** (F1): el modelo y la vista resuelven el color base de cada línea; en 0.2.2 siempre es `color_resaltado`.
2. **Ancho reservado a la izquierda** en la medición de renglones (F1): parámetro que en 0.2.2 vale 0.
3. **Unidad del modelo de puestos = enunciado con alturas arbitrarias** (F1): `disponerBloque` no asume 1 o 2 renglones.
4. **Subrayado en el color de la línea y comprobación de daltonismo con lista de pares** (F2).

Ninguna cambia lo que ve el usuario en 0.2.2 ni añade criterios de aceptación nuevos; son formas de los contratos. Las confirma el arquitecto (0161 §4) y, si las acepta, se anotan en el ADR 0022 y en las tareas 0288–0290 y 0293.

## 12. Microcopy candidato

| Clave | Texto |
|---|---|
| `edi.partes.titulo` | Cantantes y coros |
| `edi.partes.ayuda` | Reparte la letra entre varias voces. Cada una se ve en su color al cantar. |
| `edi.partes.menu` | ¿Quién canta? |
| `edi.partes.cantante` | Cantante {n} · (con nombre) Cantante {n} · {nombre} |
| `edi.partes.todos` | Todos |
| `edi.partes.coro` | Coro |
| `edi.partes.anadir` | Añadir cantante |
| `edi.partes.repartir` | Repartir entre varios cantantes |
| `edi.partes.nombres` | Nombres de los cantantes… |
| `edi.partes.chip` | Canta: {parte} |
| `edi.partes.varias` | Varias |
| `edi.partes.seleccion` | {n} líneas seleccionadas |
| `edi.partes.seleccion.ayuda` | Los tiempos se editan de una en una: los controles de abajo son de la línea {k}. |
| `edi.partes.paso` | Quién canta |
| `edi.partes.anuncio` | {n} líneas para {parte}. · (una) Línea para {parte}. |
| `edi.partes.quitar` | Quitar a {nombre}: sus líneas pasan a {cantante 1}. |
| `edi.partes.sugerenciaCoro` | {n} líneas van entre paréntesis: suelen ser coros. |
| `edi.partes.marcarCoro` | Marcarlas como coro |
| `edi.partes.nuevoCarril` | Suelta aquí para un cantante nuevo |
| `edi.partes.juntar` | Juntar carriles |
| `edi.partes.reparto` | Reparto · Lista |
| `edi.coros.nivel` | Voz en los coros |
| `edi.coros.ayuda` | La voz original suena a este volumen mientras se cantan las líneas de coro. |
| `edi.coros.limite` | Si en esas líneas también canta la voz principal, también se oirá. |
| `edi.coros.escuchar` | Escuchar |
| `edi.coros.sinCoros` | Marca alguna línea como coro para escucharlo. |
| `edi.estiloPartes.plegado` | Colores para dúos y coros (esta canción no los usa) |
| `edi.contraste.parte` | El color de {parte} apenas se ve sobre el fondo. |
| `edi.contraste.partesParecidas` | {parte} y {parte} se parecen: se distinguirán por la inicial. |
| `exp.coros` | Incluir la voz en los coros ({n} %) |
| `rep.ind.vozsilenciada.coros` | Voz silenciada · coros al {n} % |

## 13. Criterios de aceptación candidatos (etapa 1)

1. Una canción sin partes se ve igual que antes en lista, línea de tiempo, Estilo y reproductor (capturas comparadas), y abrirla no escribe nada.
2. Con la tecla C, el menú contextual, el chip y el arrastre entre carriles se asigna una línea a cualquier parte; cada vía es un paso de deshacer y se anuncia.
3. Con tres líneas seleccionadas (Ctrl + clic y Mayús + ↑/↓), C › 2 las asigna en un paso; I y O solo actúan sobre la principal.
4. «+ Añadir cantante» desde el menú de una canción sin partes crea Cantante 2 y asigna la selección en un solo paso de deshacer.
5. A 1280 × 720 al 100 % y al 125 % con tres carriles no hay scroll de página y la zona superior mide ≥ 136 px; a 1024 × 576 los carriles se juntan solos sin cambiar la preferencia.
6. En el reproductor, la línea activa de Luis barre en su color, lleva la insignia «L» y su subrayado (si está activo) es de su color; una línea de coro se dibuja entre paréntesis sin duplicar los que ya tenga el texto.
7. Con la insignia, ninguna línea pasa del 80 % del ancho y la línea activa conserva el ancla de la feature 1.
8. En Letra lista, el texto de cada línea va entero en el color de su parte y la ya cantada en gris.
9. Con un color de parte < 3:1 sobre el fondo aparece `edi.contraste.parte`; dos partes parecidas dan el ⓘ, no un ⚠.
10. «Corregir la letra» conserva la parte de las líneas sin cambios y da a una línea cambiada la parte de la anterior.

Etapa 2: con la voz guía silenciada, en una línea de coro la voz suena al nivel de la canción ± 1 dB y fuera de ella no suena; las rampas no producen chasquidos (verificación manual); el video «Solo instrumental» con la casilla marcada contiene la voz solo en los tramos de coro.

## 14. Decisiones provisionales

Aplicadas en este documento; el usuario puede cambiar cualquiera en [0160](../../../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md).

| N.º | Decisión | Opción aplicada |
|---|---|---|
| 1 | Unidad de asignación | Línea entera; tramos en la etapa 4 |
| 2 | El coro | Una parte más (no combinable con un cantante) |
| 3 | Nombres | De la canción, «Cantante N» por defecto, sin relación con la cola |
| 4 | Color en pantalla | El color de la parte es el del barrido; el texto sin cantar no se tiñe |
| 5 | Señal sin color | Insignia con la inicial a la izquierda; ancho de línea al 80 % solo con partes |
| 6 | «Todos» | Color propio e insignia con las iniciales juntas |
| 7 | Dónde viven los colores | En el tema; Cantante 1 = color de lo ya cantado |
| 8 | Entrada a la función | Sin modo especial: menú de la fila, tecla C y sección en Funciones |
| 9 | Línea de tiempo | Un carril por parte en uso, con «Juntar carriles» y arrastre vertical |
| 10 | Selección múltiple | Solo para asignar; los tiempos, de uno en uno |
| 11 | Modo «Reparto» | Solo en la etapa 3, con la superposición |
| 12 | Voz en los coros | Por canción, 50 % por defecto, suena aunque la voz guía esté silenciada, manda el mayor de los dos niveles |
| 13 | Líneas entre paréntesis | Sugerencia con un botón, no automática |
| 14 | Exportación «Solo instrumental» | Casilla «Incluir la voz en los coros», marcada |
| 15 | Letra lista con partes | Texto entero en el color de la parte |
| 16 | Indicadores de espera | En el color de la parte que entra |
| 17 | Paréntesis del coro | Los pone el render; no se duplican |
| 18 | Línea cambiada en «Corregir la letra» | Hereda la parte de la anterior |
| 19 | `.lrc` exportado (feature 9) | Sin partes |
| 20 | Dónde meterla | 0.2.3 (etapas 1 y 2) y 0.3.0 (3 y 4); cuatro ajustes de contratos en las features 1 y 2 antes de implementarlas |

## 15. Fuera de esta exploración

| Fuera | Motivo |
|---|---|
| Detectar quién canta desde el audio | No hay tecnología fiable y libre para distinguir cantantes en una pista separada; sería otra prueba técnica. |
| Más de 4 cantantes | Lo pedido llega a cuartetos; más carriles no caben a 1280 × 720. |
| Tinte del texto sin cantar en el color de la parte | Resta contraste a la letra y se suma al ruido con 5–7 líneas. |
| Posición distinta por cantante (uno a la izquierda, otro a la derecha) | Rompe el ancla centrada de la feature 1 y el centrado de la letra; la insignia y el orden de filas bastan. |
| Volumen de voz guía distinto por cantante | Con una sola pista de voz no se puede separar a los cantantes. |
| Partes en el `.lrc` y otros formatos | Sin estándar; revisar si se pide. |
