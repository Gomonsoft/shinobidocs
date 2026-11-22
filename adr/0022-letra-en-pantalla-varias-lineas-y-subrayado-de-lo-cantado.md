# 0022 — Letra en pantalla con varias líneas (modelo de puestos por tiempo) y subrayado de lo cantado

- Estado: Aceptado (los puntos marcados «provisional» se recogen en [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md))
- Fecha: 2026-11-21
- Paso del pipeline: 4 (editor: panel Estilo y vista previa), 5 (reproductor y sesión) y 6 (exportación)
- Versión: 0.2.2, features 1 y 2 ([plan](../versiones/0.2.2/plan-4.md)). Specs: [07 · Feature 1](../ux/07-reproductor.md#022--feature-1--letra-en-pantalla-con-varios-enunciados) y [Feature 2](../ux/07-reproductor.md#022--feature-2--resaltado-que-no-depende-solo-del-color), [06 · Feature 1 y 2](../ux/06-editor.md), [sistema visual · Feature 1 y 2](../ux/sistema-visual.md), [10 · Feature 1 y 2](../ux/10-exportacion.md), [08 · Feature 2](../ux/08-ajustes-y-acerca.md). Responde a [0156](../preguntas/0156-contratos-de-las-features-1-a-3-de-0-2-2-para-las-specs.md) §1–§13.

## Contexto

Hoy `fotogramaEn(letra, t, ctx)` (`renderer/src/karaoke/render.ts`) entrega `actual` y `siguiente`, y `PantallaLetra` anima la entrada de la línea con una animación CSS de 200 ms que la exportación tiene que pausar y fijar por fotograma (ADR 0019 §2, `animacionesPorFotograma.ts`). La feature 1 pide de 2 a 7 líneas a la vez (5 por defecto), hasta 2 líneas ya cantadas que suben y pasan a gris, dos animaciones de cambio de línea («Desplazamiento» y «Fundido») y «Sin animación», configurables en el tema con «Cambiar solo en esta canción». La feature 2 pide un subrayado que avance con el barrido y un aviso de colores que se confunden con daltonismo.

Restricciones heredadas:

- **Un solo reloj y render puro** (ADR 0010 §4, 0011 §3, 0018 §2, 0019 §2): el mismo instante pinta lo mismo en la vista previa, el reproductor, la secundaria y el video.
- **Datos sin subir esquemas** (ADR 0006): `cancion.esquema`, `estilo.version` y `temas.esquema` siguen en 1; 0.2.1 tiene que poder abrir una canción de 0.2.2 sin darla por dañada.
- **Comprobado en el código** (2026-11-21): `estiloSchema` y `estilo.letra` son `z.object` (0.2.1 descarta las claves que no conoce), pero `reemplazosSchema` de `shared/temas.ts` es **`z.strictObject`**: si 0.2.2 escribiera `apariencia.reemplazos.pantalla`, 0.2.1 rechazaría la apariencia y con ella la canción entera.
- **Datos de referencia** (script de solo lectura sobre la biblioteca del usuario, 2026-11-21; solo cifras, ninguna letra): 12 canciones Lista, 550 líneas y 538 cambios de línea. **355 cambios (66 %) tienen un hueco menor que 350 ms** (relevo) y 183 son en dos tiempos: 127 con hueco de 0,35 a 2 s, 15 de 2 a 2,4 s y 41 de 2,4 s o más (20 de 4 s o más). Solo 7 líneas duran menos de 583 ms (entrada acortada) y 1 menos de 200 ms (cambio instantáneo). La exploración estimaba un 95 % de relevos: la diferencia sale de los fines fijados, que dejan huecos de respiración.

## Alternativas consideradas

### 1. Forma del modelo de render

| Opción | Pros | Contras |
|---|---|---|
| **A. Lista de líneas con puesto de origen, puesto de destino y avance del cambio en curso, como función pura del tiempo; la geometría en píxeles la calcula una función pura aparte con las alturas medidas** | El modelo no depende del DOM y se prueba con números. El mismo `t` da el mismo fotograma en las cuatro superficies. «Fundido» y «Desplazamiento» comparten modelo y solo cambian la proyección. | Dos funciones en lugar de una. |
| B. El modelo devuelve directamente `y`, escala y opacidad en fracciones del alto | Un solo paso | Las alturas dependen de los renglones de cada línea (DOM): el modelo tendría que recibirlas y ya no sería un modelo de letra. |
| C. Mantener `actual`/`siguiente` y añadir las demás líneas con animaciones CSS por clase | Cambio pequeño | Animaciones con reloj propio: la exportación tendría que fijarlas todas (ADR 0019 §2) y buscar a mitad de un cambio no sería exacto. Es lo que la spec pide no hacer. |

### 2. Cómo se mueven las líneas en pantalla

| Opción | Pros | Contras |
|---|---|---|
| **A. `transform: translateY() scale()` y `opacity` escritos por fotograma en cada nodo, sin `will-change` permanente** | Solo composición para posición y tamaño; React no se vuelve a renderizar por fotograma (igual que el barrido y el fondo). La línea conserva su caja a tamaño `S`, así que sus renglones no cambian (decisión 9). | El texto escalado se vuelve a rasterizar en cada paso de escala: hay que medir el coste en un equipo modesto. |
| B. Cambiar `font-size` por fotograma | Texto siempre nítido | Relayout por fotograma y riesgo de que los renglones cambien al escalar (rompe la decisión 9). |
| C. `will-change: transform` permanente | Composición más barata | Chromium no vuelve a rasterizar una capa con `will-change: transform` al cambiar la escala: la línea que crece del 70 % al 100 % se vería borrosa. |

### 3. Dónde se guarda el reemplazo por canción

| Opción | Pros | Contras |
|---|---|---|
| A. `apariencia.reemplazos.pantalla`, como `espera` | Simétrico con ADR 0018 §3 | **0.2.1 daría la canción por dañada** (`reemplazosSchema` estricto). |
| **B. Clave hermana nueva `apariencia.reemplazo_pantalla`** | 0.2.1 la descarta sin error (`aparienciaSchema` no es estricto) y pinta el tema con 2 líneas | Dos sitios para reemplazos. Se compensa con una sola función de fusión. |
| C. Subir `cancion.esquema` a 2 | Limpio | Migración y 0.2.1 sin abrir nada de 0.2.2: desproporcionado para un dato cosmético. |

### 4. Gris de la línea ya cantada

| Opción | Pros | Contras |
|---|---|---|
| **A. Gris neutro con la misma luminancia relativa WCAG que `letra.color`** | Es la magnitud con la que ya se calcula el contraste (`contraste.ts`); con letra blanca da blanco, como pide la spec. | No es perceptualmente uniforme (da igual: solo se usa como color de destino). |
| B. OKLab con croma 0 | Perceptual | Otra conversión más; el suelo de contraste sigue necesitando la luminancia WCAG. |

### 5. Aviso de colores que se confunden (feature 2)

| Opción | Pros | Contras |
|---|---|---|
| **A. Simular protanopía y deuteranopía (Machado, Oliveira y Fernandes 2009, severidad 1,0, en RGB lineal) y avisar si el menor ΔE76 simulado es < 25 con ΔE normal ≥ 25** | Detecta exactamente el caso de la propuesta (rojo y verde con luminancia parecida). Dos multiplicaciones de matriz 3 × 3: coste nulo. | Umbral por calibrar con pares conocidos. |
| B. Solo `|ΔL*|` < 15 | Más simple | Avisa también de pares que un daltónico distingue bien por tono (azul y amarillo de luminosidad parecida). |

## Decisión

Opciones **1A, 2A, 3B, 4A y 5A**.

### 1. Esquema (sin subir versiones)

```jsonc
"estilo": {
  "version": 1,
  "fondo": { /* sin cambios */ },
  "letra": {
    "fuente": { /* … */ }, "color": "#FFFFFF", "color_resaltado": "#FFD400",
    "subrayar_cantado": true            // opcional, feature 2; ausente = false
  },
  "espera": { /* sin cambios */ },
  "pantalla": {                         // opcional, feature 1; ausente = PANTALLA_PREDETERMINADA
    "lineas": 5,                        // entero 2–7
    "pasadas": 1,                       // entero 0–2: lo ELEGIDO; el efectivo es mín(pasadas, máximo de lineas)
    "transicion": "desplazamiento"      // "desplazamiento" | "fundido" | "ninguna"
  }
}
```

- `shared/pantalla.ts` (nuevo): `pantallaSchema`, `PANTALLA_PREDETERMINADA = { lineas: 5, pasadas: 1, transicion: 'desplazamiento' }`, `pasadasEfectivas(p)` (máximo 0 con 2–3 líneas, 1 con 4–5 y 2 con 6–7), `DURACION_CAMBIO_MS = { desplazamiento: 350, fundido: 250, ninguna: 0 }` y las constantes de la spec (`RETIRADA_MS = 2000`, `FUNDIDO_RETIRADA_MS = 400`, `APARICION_BLOQUE_MS = 250`, `MINIMO_ANIMADO_MS = 120`, `FRACCION_ENTRADA = 0.6`).
- **Lectura tolerante por campo** (como `editor.paneles`, ADR 0006): cada campo de `pantalla` lleva `.catch` con su valor por defecto. Un valor fuera de rango **no** deja la canción ni el tema como dañados. Al escribir, el esquema es estricto.
- **Ausente = predeterminado nuevo** (decisión 2 del plan, provisional): `normalizarEstilo` rellena `pantalla` con `PANTALLA_PREDETERMINADA` y `letra.subrayar_cantado` con `false`. Es una **excepción deliberada** a la regla de ADR 0018 §1 («ausente equivale a la versión anterior»): las bibliotecas y temas de 0.2.1 se ven con 5 líneas sin reescribir nada. `ESTILO_PREDETERMINADO` no cambia (sin `pantalla`). Todas las comparaciones siguen usando la forma normalizada (`estilosIguales`, portada neutra).
- **Reemplazo por canción**: `apariencia.reemplazo_pantalla` (bloque completo, opcional), solo con `tema` o `heredar`, con las mismas reglas que `reemplazos.espera` (ADR 0018 §3): se conserva entre `tema` y `heredar`, «Personalizar» lo fusiona en `estilo.pantalla`, al borrar el tema se congela el resultado fusionado y se retira. `resolverApariencia` lo fusiona después de `reemplazos.espera` y añade `procedenciaPantalla` (`"cancion"` o la procedencia del estilo). `SeleccionApariencia` de `biblioteca.guardarApariencia` admite `reemplazo_pantalla` con la semántica de `reemplazos` (ausente conserva, `null` quita, objeto sustituye).
- **Lectura tolerante de `reemplazos` desde 0.2.2**: `reemplazosSchema` pasa de `strictObject` a `object` al **leer** (descarta claves desconocidas), para que una versión futura no deje esta como la 0.2.1. El esquema del IPC sigue siendo estricto.
- `subrayar_cantado` es parte del estilo (tema o propio), **sin reemplazo por canción** (spec 06 · Feature 2).
- **`config.reproductor.subrayar_cantado`** (booleano, `false`, lectura tolerante, escrito con `config.actualizar`): preferencia de este equipo.
- **Compatibilidad con 0.2.1** (respuesta a 0156 §3): 0.2.1 descarta `pantalla`, `subrayar_cantado` y `reemplazo_pantalla` y pinta 2 líneas sin error. **Si 0.2.1 reescribe** la canción o `temas.json` (cualquier edición o guardado del tema), esos campos se pierden y al volver a 0.2.2 la canción o el tema vuelven al predeterminado de 5 líneas. Es la misma pérdida aceptada de ADR 0018 §1; se avisa en las notas de la versión.

### 2. Modelo: `fotogramaEn` con puestos

`FotogramaLetra` cambia de forma. `actual` y `siguiente` se conservan como **derivados** (la línea en el puesto 0 y la del +1) para los consumidores que solo necesitan saber qué suena (anuncios, pruebas existentes); la vista pinta `lineas`.

```ts
interface LineaEnPantalla {
  id: string
  texto: string
  progreso: number                     // barrido 0–1: la que entra o está activa avanza; una ya cantada vale 1; una futura, 0
  palabras: { texto: string; progreso: number }[] | null   // solo en la activa, como en 0.2.1
  desde: number                        // puesto entero antes del cambio en curso (o el actual si no hay cambio)
  hacia: number                        // puesto entero tras el cambio en curso
  avance: number                       // 0–1, ya con la curva; 1 si no hay cambio en curso
  retirada: number                     // factor de opacidad 1→0 de la retirada a los 2 s (1 si no aplica)
}
interface CambioEnCurso { tipo: 'desplazamiento' | 'fundido'; inicioMs: number; duracionMs: number; avance: number }
interface FotogramaLetra {
  titulo: { titulo: string; artista: string } | null
  lineas: LineaEnPantalla[]            // en orden de letra; como mucho N + 1
  cambio: CambioEnCurso | null
  aparicion: number                    // factor 0→1 del fundido de aparición del bloque tras el título
  espera: EsperaFotograma | null       // sin cambios (ADR 0018 §3)
  esperaAparicion: number              // 0–1: los indicadores aparecen con el avance de la salida en dos tiempos (spec 07)
  actual: LineaRender | null           // derivado: la línea con hacia === 0
  siguiente: LineaRender | null        // derivado: la línea con hacia === 1
  claveLineas: string                  // ids visibles: la vista solo vuelve a renderizar React cuando cambia
}
```

`ctx` añade `pantalla` (normalizada) y `movimiento: 'completo' | 'reducido'`. Con `reducido`, la duración de todos los cambios, la retirada y la aparición es 0 (respuesta a 0156 §6). La exportación pasa siempre `completo` (ADR 0019 §2).

**Sucesos** (todos conocidos de antemano a partir de la letra, `finEfectivo` y la configuración; se precalculan una vez por letra, duración y configuración en el índice que ya existe, `indicePara`):

- Para cada línea `i` con inicio, `inicio_i` y `fin_i = finEfectivo`. `D` = duración nominal del tipo.
- **Relevo** si `inicio_{i+1} − fin_i < D`: un solo cambio en `inicio_{i+1}` en el que la `i` pasa de 0 a −1, la `i+1` de +1 a 0 y las demás bajan un puesto. Duración `d = mín(D, 0,6 × (fin_{i+1} − inicio_{i+1}))`; si `d < 120 ms`, `d = 0`.
- **Dos tiempos** si el hueco es ≥ `D` o no hay siguiente: un cambio de **salida** en `fin_i` (la `i` de 0 a −1, las ya cantadas suben; las futuras no se mueven) con `d = D`, y un cambio de **entrada** en `inicio_{i+1}` (las futuras suben) con `d = mín(D, 0,6 × duración de la i+1)` y el mismo mínimo de 120 ms.
- Por construcción **nunca hay dos cambios a la vez**: la entrada termina antes del fin de su línea y la salida en dos tiempos antes de la entrada siguiente. La función solo busca el último cambio con `inicio ≤ t` (búsqueda binaria) y su avance `curva((t − inicio) / d)`, con `curva(x) = 1 − (1 − x)³` acotada a [0, 1] (respuesta a 0156 §5: forma cerrada, sin resolver una Bézier).
- **Puestos en reposo** tras el cambio `k`: se derivan de cuántas entradas y salidas han ocurrido. Las ya cantadas se cuentan desde la última retirada: tras un hueco de más de `RETIRADA_MS` no hay ya cantadas anteriores al hueco (spec 07, «Retirada»). Solo se devuelven las líneas con puesto en `[−P−1, F+1]` en el origen o en el destino (la que entra por abajo y la que se funde por arriba tienen opacidad 0 en esos puestos extremos).
- **Retirada**: si `inicio_{i+1} − fin_i > RETIRADA_MS` (o no hay siguiente), todas las ya cantadas tienen `retirada = 1 − lineal((t − fin_i − 2000) / 400)`; con movimiento reducido, 0 a partir de `fin_i + 2000`.
- **Aparición del bloque**: desde `inicio₁ − 4000` (fin del título), `aparicion = lineal((t − (inicio₁ − 4000)) / 250)`.
- Coste: una búsqueda binaria y como mucho `N + 1` objetos por fotograma, igual de barato que hoy. Sin temporizadores ni `Date.now`.

**`fotogramaEstatico`** (editor en pausa con una línea seleccionada) devuelve la misma forma, sin cambio en curso: la seleccionada en el puesto 0 a medio barrer, sus anteriores en −1…−P y sus siguientes en +1…+F (spec 06).

### 3. Geometría: `disponerBloque` (pura) y medición estable

- **`renderer/src/karaoke/pantalla.ts`** (nuevo): `disponerBloque({ lineas, alturas, pantalla, altoPx, proporcion })` devuelve, por línea y por copia, `{ centroY, escala, opacidad, mezclaGris, dibujar }`.
  - Tabla de puestos (escala, opacidad objetivo, gris) y ancla según `N` y `P`: los valores del sistema visual · Feature 1 viven aquí como constantes y la fórmula del ancla (bloque de líneas de un renglón centrado en el 47 % del alto; 45 % con 2 líneas) se calcula, no se copia.
  - **Apilado**: el centro del puesto 0 es el ancla; cada línea ocupa `altura_S × escala` y las separaciones son 0,6 × `S` a cada lado de la activa y 0,25 × `S` entre las demás. Con dos renglones la línea crece desde su centro (la activa crece por igual hacia arriba y hacia abajo).
  - **Desplazamiento**: centro, escala, opacidad y gris se interpolan entre la disposición en `desde` y la de `hacia` con `avance`.
  - **Fundido** (respuesta a 0156 §4): **dos copias** de cada línea que cambia de puesto: la saliente en `desde`, con opacidad `× (1 − avance)` y subiendo `0,3 × S × avance`; la entrante en `hacia`, con opacidad `× avance` y llegando desde `0,3 × S` más abajo. La vista monta como mucho `2 × (N + 1)` nodos solo durante el cambio.
  - **Recorte** (spec 07): una futura cuyo borde inferior pase del 86 % del alto o una ya cantada cuyo borde superior quede por encima del 10 % lleva `dibujar: false` (y las que van detrás). Si cambia entre el origen y el destino de un cambio, su opacidad sigue el avance.
  - **Suelo de contraste**: la opacidad final es `máx(objetivo × retirada × aparicion, suelo[puesto])` cuando la línea está en reposo en su puesto; durante un cambio se interpola entre los valores ya con suelo de los dos puestos. La retirada y la salida por los extremos sí llegan a 0 (el suelo es de un puesto, no de una línea que se va).
- **Medición** (respuesta a 0156 §8): cada línea se monta **siempre a tamaño `S`** (su caja es la de la activa) y se reduce con `transform`. Sus renglones y su reducción por longitud (1 → 0,75, regla de 0.2.0) se calculan **una vez al montarla** y se vuelven a calcular solo si cambian el tamaño del contenedor, la fuente o el texto (`ResizeObserver` y `document.fonts`, como hoy). Las alturas medidas (`altura_S`) se pasan a `disponerBloque`.
  - El barrido por renglón de 0.2.0 **no cambia**: `medirBarridos` ya divide por la escala de la capa, así que las cajas salen en coordenadas sin transformar.
  - Captura offscreen (ADR 0019 §2): la medición ocurre en `useLayoutEffect` del montaje, antes de los dos `requestAnimationFrame` que preceden a la captura, así que un fotograma con una línea recién montada ya sale medido.
- **Pintado** (`PantallaLetra`): React se vuelve a renderizar solo cuando cambia `claveLineas` (o el estado del título, la espera o los indicadores, como hoy). En cada `requestAnimationFrame` (o en el paso síncrono de `tiempoFijoMs`) se escriben por nodo `--k-y`, `--k-escala`, `--k-opacidad` y `--k-gris` (0–1) y el `clip-path` del barrido de la activa. El color de una línea se compone en CSS con `color-mix(in srgb, var(--k-color-gris) calc(var(--k-gris) * 100%), var(--k-color-base))`, donde la base es el color de lo ya cantado (karaoke) o el de la letra (Letra lista): mezcla lineal en sRGB, como pide la spec (0156 §7).
- **Se retira** la animación CSS `.transicion` de la línea actual y su `data-nace-ms`: la entrada es ahora parte del modelo. La cuenta 3·2·1 conserva su entrada CSS y el mecanismo de ADR 0019 §2 sigue ahí para ella.
- **`will-change`**: no se deja permanente en las líneas (alternativa 2C). Si la guía manual muestra saltos en un equipo modesto, la corrección es poner `will-change: transform, opacity` **solo durante un cambio** y quitarlo al terminar (la línea vuelve a rasterizarse nítida en su puesto). No cambia datos ni modelo.

### 4. Gris y suelo de contraste (`renderer/src/karaoke/contraste.ts`)

- `grisDeLetra(hex)`: el gris neutro `#vvvvvv` cuya luminancia relativa WCAG es la de `hex` (inversa de la curva sRGB sobre `Y`), redondeado al entero más cercano.
- `suelosDeOpacidad(estiloResuelto, pantalla)`: para cada puesto atenuado y su color (letra o gris), la menor opacidad `α` (paso de 0,01) tal que, para **cada** muestra `b` de `muestrasFondo` (las 9 por tramo de ADR 0018 §4), el color compuesto `α·c + (1 − α)·b` en sRGB codificado (como compone el navegador) tenga contraste ≥ 3:1 con `b`. Si ni con `α = 1` se llega, `α = 1` y lo cubre el aviso de contraste de siempre (sin avisos nuevos). Se calcula **una vez por estilo resuelto** (`useMemo`) y viaja con él; nunca por fotograma.
- Es renderer, junto a `evaluarContraste`, porque solo lo usan el editor y `PantallaLetra` (también en la ventana de exportación, que es un renderer).

### 5. Subrayado de lo cantado (feature 2)

- **Dónde se dibuja** (0156 §13): en la **capa de resaltado** (`.resaltado`) con `text-decoration: underline`, grosor y separación del sistema visual · Feature 2 en unidades `em`. Como la capa ya se recorta con el `clip-path` del barrido, el subrayado mide siempre lo pintado de cada renglón y sigue a las palabras manuales sin código propio.
- `recorteBarrido(cajas, progreso, { margenInferior })` amplía hacia abajo cada caja de renglón lo que ocupan la separación y el grosor del subrayado, para que el recorte no lo corte. La caja de la línea no cambia (el subrayado cabe en el interlineado).
- **Resolución** (0156 §11): `subrayado = estilo.letra.subrayar_cantado || config.reproductor.subrayar_cantado`, calculado por quien toma la instantánea: el reproductor local y la vista previa en el renderer principal, la sesión en main al consumir la entrada (ADR 0017 §10), y la exportación **solo con el estilo** (spec 10). `PantallaLetra` recibe `subrayado: boolean`. Con `barrido={false}` (Letra lista) no se dibuja.
- **Salida de la línea**: el subrayado vive en la línea que sale, así que se funde con su `--k-gris` (la spec pide opacidad `1 − avance`): la capa de resaltado toma opacidad `1 − mezclaGris`.
- **Barra de espera con subrayado**: clase en la raíz que pone la pista al 35 % del color de letra (la misma regla que Letra lista, ADR 0018 revisión 0.2.1).
- **Aviso de colores que se confunden** (0156 §12): `confusionDaltonismo(letra, resaltado)` en `contraste.ts` con las matrices de Machado et al. (2009) para protanopía y deuteranopía, severidad 1,0, aplicadas en RGB lineal. Aviso si `ΔE76 normal ≥ 25` (si no, ya avisa `diferencia`) y el menor ΔE simulado es `< 25` (umbral **provisional**). Se añade como `'daltonismo'` a `EvaluacionContraste.avisos`; con `subrayar_cantado` activo la spec puede atenuarlo. Prueba con pares conocidos: rojo `#E53935` / verde `#43A047` avisa; blanco / amarillo `#FFD400` no.

### 6. Contratos y archivos que cambian

| Dónde | Cambio |
|---|---|
| `shared/pantalla.ts` (nuevo) | esquema, predeterminado, `pasadasEfectivas`, constantes de tiempo |
| `shared/estilo.ts` | `pantalla` y `letra.subrayar_cantado` opcionales; `normalizarEstilo` |
| `shared/temas.ts` | `aparienciaSchema.reemplazo_pantalla`; `reemplazosSchema` tolerante al leer; fusión y `procedenciaPantalla` |
| `shared/config.ts` | `reproductor.subrayar_cantado` (tolerante) y en `configParcialRendererSchema` |
| `shared/ipc.ts` | `SeleccionApariencia.reemplazo_pantalla`; `procedenciaPantalla` en el resumen y en `resuelta`; `subrayado` en la entrada activa de la sesión |
| `renderer/src/karaoke/render.ts` | `FotogramaLetra` nuevo, sucesos precalculados, `fotogramaEstatico` |
| `renderer/src/karaoke/pantalla.ts` (nuevo) | `disponerBloque`, tabla de puestos y ancla |
| `renderer/src/karaoke/contraste.ts` | `grisDeLetra`, `suelosDeOpacidad`, `confusionDaltonismo` |
| `renderer/src/karaoke/barrido.ts` | `margenInferior` |
| `renderer/src/karaoke/PantallaLetra.tsx` y su CSS | N líneas, copias del fundido, variables por nodo, `subrayado`, sin `.transicion` de línea |
| `renderer/src/vistas/editor/` | sección «Letra en pantalla» y subrayado en Estilo (spec 06) |
| `renderer/src/vistas/ajustes/` | «Subrayar siempre lo ya cantado» (spec 08) |
| `main/sesion/`, `main/exportacion/` | copiar `subrayado` en la instantánea; la exportación pasa `movimiento: 'completo'` como hoy |

Roles (ADR 0017 §11): sin canales nuevos.

### 7. Estrategia de pruebas mínima

- **Vitest, `render.test.ts`** (el grueso): F1-R1, R2, R6–R16 y R20 de la spec 07 sobre el modelo, con letras sintéticas (relevo de 100 ms, hueco de 1,3 s, hueco de 8 s, líneas de 0,27 s, 0,15 s y 15 ms, diez líneas de 0,3 s a 60 FPS), 50 instantes al azar (búsqueda = reproducción) y `movimiento: 'reducido'`.
- **Vitest, `pantalla.test.ts`**: ancla de cada combinación ± 0,5 % a 1920 × 1080 y 1280 × 720 (F1-R3), escalas (R4), «Fundido» a ≤ 0,3 × `S` (R11), recorte (R18), indicadores relativos al ancla (R19), sin medir el DOM (alturas inyectadas).
- **Vitest, `contraste.test.ts`**: gris de la letra, suelo de contraste con `#F2E8D5`/`#111111` y con el tema Shinobi (R24), daltonismo con los pares de arriba.
- **Vitest, `estilo.test.ts` y `temas.test.ts`**: tolerancia por campo, ausente = predeterminado nuevo sin reescribir (R5), una **copia congelada del `aparienciaSchema` de 0.2.1** acepta una canción de 0.2.2 con `reemplazo_pantalla` (descartándolo), fusión y congelación.
- **Vitest, `PantallaLetra.test.tsx`**: dos renglones con los mismos cortes en todos los puestos (R17, con medición simulada), subrayado en la capa recortada y cajas iguales con y sin subrayado (feature 2, R4), sin capa ni subrayado en Letra lista.
- **E2E**: una prueba en la spec existente del reproductor o de exportación que exporte 3 s a 640 × 480 con 5 líneas y compruebe que el modelo del anfitrión en un fotograma a mitad de un cambio es el mismo que `fotogramaEn` (R23). Críticos: sí (se toca `shared/`).
- **Manual** (guía de 0.2.2): legibilidad a 5 m con 5 y 7 líneas, mareo en la canción rápida, 4:3 en proyector, fluidez en la secundaria de un equipo modesto con fondo en movimiento (y si hace falta, `will-change` solo durante el cambio), video a 24 y 60 FPS, simulador de daltonismo.

## Consecuencias

- **Positivas**: un solo modelo, puro y barato, para las cuatro superficies; la exportación deja de necesitar el truco de animaciones fijadas para la letra; ningún esquema sube; 0.2.1 sigue abriendo todo.
- **Negativas / riesgos**:
  - Toda la biblioteca cambia de aspecto al actualizar (decisión del plan, provisional).
  - El texto escalado se vuelve a rasterizar durante los cambios: coste por medir en un equipo modesto (con 7 líneas y «Fundido», hasta 16 nodos durante 250 ms).
  - Si 0.2.1 reescribe una canción o el catálogo, pierde los ajustes nuevos.
  - Umbral de daltonismo provisional.
  - **Legales**: ninguno nuevo.
- **Impacto en UX**: el que describen las specs; sin controles nuevos en la exportación.

## Fuentes

- Comprobación en el código: `app/src/shared/temas.ts` (`reemplazosSchema` con `z.strictObject`), `shared/estilo.ts`, `renderer/src/karaoke/render.ts`, `PantallaLetra.tsx` y `contraste.ts` (rama `version-0.2.2`, 2026-11-21).
- Chromium, rasterización de capas con `will-change: transform` al escalar: [web.dev, «Stick to compositor-only properties»](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count) y [MDN, `will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change).
- MDN, [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) y [`text-decoration-thickness`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-thickness).
- W3C, [WCAG 2.2: luminancia relativa y contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [2.3.3 Animación por interacción](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- G. M. Machado, M. M. Oliveira y L. A. F. Fernandes, «A Physiologically-based Model for Simulation of Color Vision Deficiency», IEEE TVCG 15(6), 2009: [página de los autores con las matrices](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html).
- Exploración [letra en pantalla](../versiones/0.2.2/exploracion/letra-en-pantalla.md) y cifras de la biblioteca del usuario (script de solo lectura, sin letras).
