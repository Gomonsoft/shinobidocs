# 0029 — Reparto de la letra entre cantantes y coro: modelo de datos, compatibilidad, colores y zonas de pantalla

- Estado: Aceptado (provisionales en la ampliación de [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md))
- Fecha: 2026-11-22
- Paso del pipeline: 4 (editor) y 6 (reproductor y exportación)
- Versión: 0.2.3, feature 1 · Cantantes por línea y feature 3 · Voces a la vez, condicionada (§7) ([plan 5](../versiones/0.2.3/plan-5.md), [propuesta 036](../propuestas/036-varios-cantantes-y-coros.md)). Base: [exploración UX](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md) y [factibilidad técnica](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md). Specs: `ux/06-editor.md`, `ux/07-reproductor.md` y `ux/sistema-visual.md` (secciones «0.2.3 · Feature 1»). Amplía ADR 0006 (modelo de la letra), 0018 §1 y 0022 §1–§5 (estilo y render). El audio de los coros está en [ADR 0030](0030-voz-original-en-las-lineas-de-coro.md).

## Contexto

- Hoy toda la letra la canta una sola voz. En un dúo no se sabe qué línea es de quién y los coros se ven igual que la voz principal. En la biblioteca del usuario, 2 de 17 canciones traen coros entre paréntesis desde LRCLIB y ninguna dice quién canta.
- Una línea tiene `id`, `tipo`, `texto`, `inicio_ms`, `fin_ms`, `palabras`, `origen_palabras` y, desde 0.2.2, `origen_fin`, `revisada` y `alineacion`. Los esquemas son `z.object`: al leer **descartan** las claves que no conocen, y main reescribe la canción entera desde el índice validado (factibilidad §1.1).
- **0.2.2 ya reserva** `lineas[].parte`, `letra.partes` y `estilo.letra.colores_partes` (tareas 0296 y 0287): opcionales, tolerantes, conservados y sin uso. Este ADR fija su forma exacta, que 0.2.2 debe reservar igual.
- 0.2.2 ya deja preparados el color del barrido por línea (`colorDeLinea`), el ancho de línea como variable (`--k-ancho-linea`), el subrayado con el color de su nodo y `confusionDaltonismo(a, b)` (tareas 0289, 0290, 0293 y 0294).
- **Alcance de 0.2.3** (plan 5): líneas **enteras**, hasta 4 cantantes más «Todos» y «Coro», carriles en la línea de tiempo, colores e insignia. **Fuera**: voces a la vez, cambio de cantante dentro de una línea y separar la voz principal de los coros.
- **Referencias visuales del usuario** (3 capturas de karaokes comerciales, fuera del repositorio): dos muestran **voces a la vez** (dos bloques o cuatro líneas avanzando juntas) y una, coros entre paréntesis en otra zona de la pantalla mientras la voz principal sigue en el centro. Una de ellas tiñe el texto **aún sin cantar** con el color de su cantante. 0.2.3 cubre solo una parte (ver la ampliación de 0165); el modelo no debe cerrar la puerta al resto (§6).
- **Indicación del usuario (2026-11-22)**, que manda sobre la exploración donde la contradiga: «Todos» se piensa para 3 o más cantantes, pero se puede usar en un dúo; y dúo, trío, «Todos» y coro tienen **la misma base: una línea de tiempo (carril) por parte, con su color y su espacio propio en pantalla**. De ahí salen las **zonas de pantalla por parte** (§4 bis), que entran en 0.2.3 en cualquier caso, y el dictamen sobre las voces a la vez (§7).

## Alternativas consideradas

### 1. Dónde se guarda quién canta

| Opción | Pros | Contras |
|---|---|---|
| **A. `parte` por línea y `partes` (cantantes, nombres) dentro de `letra`; colores en el estilo (tema)** | La letra tiene un solo escritor (`ServicioLetras`); el reparto viaja con la letra por el historial del editor, la sesión, la exportación y el paquete; el contraste depende del fondo, que es del tema | Si se sustituye la letra entera, las líneas son otras y su reparto se pierde |
| B. Un archivo o campo aparte en la raíz de la canción (`reparto: { id_linea: parte }`) | Separado de la letra | Dos escritores para un mismo cambio; ids huérfanos al corregir la letra; otro camino en la IPC |
| C. Prefijos en el texto («A: …») | Sin esquema nuevo | Ensucia el texto, las búsquedas, el encaje (ADR 0024) y la alineación (ADR 0028) |

### 2. Identificador de cada cantante

| Opción | Pros | Contras |
|---|---|---|
| **A. Ranuras fijas `c1`…`c4`, sin renumerar al quitar un cantante** | El color es de la ranura (tema) y no cambia al quitar a otro; las líneas no se reescriben | Puede quedar un hueco (`c1`, `c3`); el nombre por defecto sigue la ranura («Cantante 3») |
| B. UUID por cantante | Sin huecos | El tema no puede asignar colores a un UUID de otra canción |
| C. Índice en la lista, renumerado | Sin huecos | Quitar al Cantante 2 cambia el color y el nombre del 3 y reescribe sus líneas |

### 3. Dónde viven los colores

| Opción | Pros | Contras |
|---|---|---|
| **A. En el estilo (`estilo.letra.colores_partes`), con la herencia de temas; Cantante 1 = `color_resaltado`** | El contraste se decide con el fondo; un tema existente ya «tiene» su Cantante 1; nada cambia sin partes | Un tema sin colores de partes usa los predeterminados |
| B. En la canción | Cada canción lo suyo | Repetir colores en cada dúo; ignora el fondo del tema |

## Decisión

Opciones **1A, 2A y 3A**.

### 1. Datos

```jsonc
"letra": {
  "partes": {                                   // opcional; ausente = canción sin reparto
    "cantantes": [                              // 1–4, ids únicos de "c1"…"c4", en orden de ranura; siempre incluye "c1"
      { "id": "c1", "nombre": "Ana" },
      { "id": "c2", "nombre": null }            // null = «Cantante 2» (el texto lo pone la interfaz)
    ],
    "voz_en_coros": 0.5                         // ADR 0030; 0–1, múltiplo de 0,05; ausente = 0,5
  },
  "lineas": [
    { "id": "…", "tipo": "linea", "texto": "…", "inicio_ms": 12400, "fin_ms": null, "palabras": null,
      "parte": "c2" }                           // "c2"…"c4" | "todos" | "coro"; ausente = "c1"; nunca en pausas
  ]
}
"estilo": {
  "letra": { …, "colores_partes": {             // opcional; cada clave opcional; ausente = predeterminado de la ranura
    "c2": "#4ADEDE", "c3": "#FF5C8A", "c4": "#7CFF6B", "todos": "#B388FF", "coro": "#FF9F1C" } },
  "pantalla": { …, "zonas": "por_parte" }       // opcional: "por_parte" | "una"; ausente = "por_parte" (§4 bis)
}
```

- **Catálogo** (`shared/reparto.ts`, nuevo, puro): `PARTES = ['c1','c2','c3','c4','todos','coro']`, `MAX_CANTANTES = 4`, `NOMBRE_MAX = 40`, `COLORES_PARTES_PREDETERMINADOS` (los de arriba; `c1` no tiene: es `color_resaltado`).
- **Canción con reparto** ⇔ existe `letra.partes`. Sin él no hay chips, carriles, insignias, colores nuevos ni ancho del 80 %: una canción de un solo cantante no cambia en nada.
- **Invariantes al escribir** (main, estricto): `parte` solo en elementos `linea`; `parte` de un cantante que no está en `partes.cantantes` no se admite; `"c1"` no se escribe (ausente = `c1`, así abrir y guardar no cambia el archivo); nombre recortado, vacío → `null`, máximo 40 caracteres.
- **Normalización** (`normalizarReparto(letra)`, pura, la aplican el reducer del editor antes de guardar y main al escribir): si `cantantes` solo tiene `c1` con nombre `null`, ninguna línea es `todos` o `coro` y `voz_en_coros` está ausente o vale 0,5, se **quita `partes`** (vuelve a ser una canción sin reparto: «Quitar el último cantante» lo consigue).
- **Lectura tolerante por campo** (como `editor.paneles`, ADR 0006): una `parte` fuera del catálogo o de un cantante que no existe se lee como `c1`; un nombre no válido, como `null`; `cantantes` inválido o sin `c1` se repara (se añade `c1`, se quitan duplicados y sobrantes); `voz_en_coros` fuera de rango, como 0,5; un color no válido de `colores_partes`, como su predeterminado. Una clave `c1` en `colores_partes` (la reserva de 0.2.2 la admite) se ignora: el Cantante 1 es siempre `color_resaltado`. Nada de esto marca la canción o el tema como dañados ni los reescribe al abrir.
- **Reglas de tiempo**: no cambian. Asignar una parte no toca inicios, fines, palabras, `origen_*`, `revisada`, `alineacion` ni `intacta` (no es un cambio de tiempos ni de texto). Los invariantes de ADR 0006 (inicios crecientes; un fin no pasa del inicio siguiente) siguen siendo globales en las features 1 y 2; la feature 3 los relaja solo si su prueba técnica sirve (§7).
- **Esquema**: `cancion.esquema` y el de temas **no suben** (campo opcional con equivalencia por defecto, ADR 0006 revisión de la fase 3).

### 2. Escritura e IPC

- **Sin canal nuevo**: `letras.guardarTiempos` admite `parte` opcional en cada elemento de `tiempos` (ausente = `c1`) y `partes` opcional en la raíz (`null` = quitar; ausente = conservar). Es el camino de `revisada` en 0.2.2 (ADR 0024 §4). El editor envía siempre el reparto completo de la letra cuando cambia.
- **Corregir la letra** (vista Letra, `aplicarTextoEditado`): una línea emparejada conserva su `parte` (0296 ya conserva todos los campos); una línea **nueva o cambiada hereda la parte de la línea anterior** (o `c1` si es la primera). Provisional, decisión 18 de 0160.
- **Sustituir la letra entera** (otra de LRCLIB o pegada): se **conserva `partes`** (cantantes, nombres y nivel de coros, así no se vuelven a escribir los nombres ni desaparecen los carriles) y todas las líneas nuevas son de `c1`. Provisional.
- **Preparación desatendida** (ADR 0025): no asigna partes ni marca coros (decisión 13 de 0160). La sugerencia «Marcarlas como coro» usa `lineasEntreParentesis(letra)` (pura): líneas `c1` cuyo texto recortado empieza por «(» y acaba en «)».
- **Exportar `.lrc`** (ADR 0027 §4): sin partes; las líneas `coro` cuyo texto no esté ya entre paréntesis se escriben entre paréntesis, para que al volver a importar la sugerencia las encuentre (provisional, 0165 §8).

### 3. Funciones puras del reparto (`shared/reparto.ts`)

| Función | Qué devuelve |
|---|---|
| `parteDe(linea)` | La parte efectiva (`c1` si falta) |
| `tieneReparto(letra)` | `letra.partes` existe |
| `carriles(letra)` | En orden c1–c4, todos, coro: un carril por **cada cantante de `partes.cantantes`** (tenga o no líneas: indicación del usuario en 0160) y `todos`/`coro` solo si tienen alguna línea. Sin reparto, `[]` (una sola pista, como hoy) |
| `siguienteRanuraLibre(letra)` | La primera de `c2`…`c4` libre, o `null` con 4 |
| `asignar(letra, ids, parte)` / `anadirCantante(letra, asignarA?)` / `quitarCantante(letra, id)` / `renombrar(letra, id, nombre)` | La letra nueva, normalizada. Quitar un cantante pasa sus líneas a `c1`. `anadirCantante` en una canción sin reparto crea `partes` con `c1` y `c2` |
| `insignia(letra, parte)` | Texto de la insignia: inicial del nombre (o de «Cantante N»), dos letras si dos cantantes empiezan igual; `todos` = iniciales de los cantantes unidas con «·»; `coro` = `null` (lo identifican los paréntesis). La forma exacta la fija la spec |
| `textoEnPantalla(linea)` | Indica si hay que dibujar paréntesis (solo `coro` y si el texto no los trae ya). El render los dibuja; el texto guardado no cambia |
| `colorDeParte(estilo, parte)` | `color_resaltado` para `c1`; si no, `colores_partes[parte]` o el predeterminado |
| `lineasEntreParentesis(letra)` | §2 |
| `recuentoPorParte(letra)` | Para Funciones › «Cantantes y coros» |

### 4. Colores, estilo y contraste

- **Resolución**: `colores_partes` sigue la herencia de temas (canción › álbum › artista › predeterminado, ADR 0016) como el resto de `estilo.letra`. `normalizarEstilo` **no** rellena los predeterminados (un tema que no los usa no cambia en disco); `estilosIguales` compara los colores **efectivos** (`colorDeParte`) para no ver diferencias entre «ausente» y «predeterminado».
- **Render** (con reparto): `colorDeLinea` (0290) devuelve `colorDeParte(estilo, parteDe(linea))` para el barrido, el subrayado (que hereda el color del nodo, 0293) y los indicadores de espera (color de la línea que viene); en Letra lista, el **texto entero** de la línea toma el color de su parte (decisión 15 de 0160) y la ya cantada pasa a gris como hoy; el texto sin cantar sigue en `letra.color`. Sin reparto, todo vale `color_resaltado` como en 0.2.2.
- **Insignia**: nodo propio fuera del flujo, a la izquierda de la primera caja de renglón que ya mide `medirBarridos`; viaja con la línea (escala, opacidad y gris del puesto). Con reparto, `--k-ancho-linea` pasa del 88 % al **80 %**; el texto sigue centrado y la línea activa conserva el ancla de ADR 0022.
- **Paréntesis**: se dibujan como parte del texto del nodo, fuera de los tokens de palabra; con palabras visibles, «(» se pinta con la primera palabra y «)» con la última.
- **Contraste** (`evaluarContraste`, solo partes **en uso** en la canción): color de parte frente al fondo (11 muestras) < 3:1 → ⚠; frente a `letra.color` con ΔE < 25 → ⚠; dos partes en uso entre sí con ΔE < 25 o `confusionDaltonismo(a, b)` → ⓘ informativo (la insignia ya las distingue). Sin avisos en el reproductor.
- **Paleta predeterminada**: la tarea de Estilo comprueba con esas mismas funciones los cinco colores frente a los fondos de los temas incluidos; si alguno falla, cambia el valor de la ranura con el visto bueno del diseñador y lo anota aquí.
- **«Todos»** está siempre disponible en el menú, también en un dúo; la interfaz lo presenta pensado para 3 o más cantantes (lo concreta la spec). Los datos no lo limitan.

### 4 bis. Zonas de pantalla por parte

Cada parte tiene, además de su carril y su color, **su espacio en pantalla**. Una **zona** es una región horizontal de la pantalla (una franja con su `y0` y su alto) con su propio bloque de líneas del modelo de puestos de ADR 0022.

- **Función pura** `zonasDePantalla(letra, estilo, altoPx)` (`renderer/src/karaoke/zonas.ts`, nueva) → `[{ id, partes: Parte[], region: { y0Px, altoPx }, lineas: number }]`. Sin reparto, o con `estilo.pantalla.zonas = "una"`, devuelve **una sola zona** con todas las partes, toda la pantalla y `pantalla.lineas`: exactamente 0.2.2.
- **Con reparto y `"por_parte"`**: una zona por cantante **de la canción** (en orden de ranura, de arriba abajo) y la zona del coro (franja propia, arriba o abajo de las de los cantantes) si hay líneas de coro. «Todos» se pinta en una zona propia o repetido en la zona de cada cantante (como en una de las referencias): **lo fija la spec**; el modelo admite ambas porque una zona es una lista de partes y una línea puede estar en varias zonas. Proporciones de las franjas, líneas por zona (`lineas`, que reparte `pantalla.lineas` o fija la spec) y separación entre zonas: constantes del sistema visual en `shared/pantalla.ts`.
- **Render**: para cada zona, `fotogramaEn` se calcula sobre la **subsecuencia** de líneas de sus partes (con su propio índice de sucesos, cacheado por zona) y `disponerBloque` coloca ese bloque dentro de su región, con el ancla relativa a la región. Los indicadores de espera y la cuenta se pintan en la zona de la línea que viene. El suelo de contraste y el gris no cambian (son por estilo).
- **Por qué así**: el modelo de puestos garantiza «nunca dos cambios a la vez» dentro de una secuencia; con una zona por parte, cada zona es una secuencia independiente y la garantía se mantiene en cada una. Es también lo que hace baratas las voces a la vez en pantalla (§7).
- **Exportación**: el mismo `PantallaLetra` por fotograma; como mucho `zonas × (lineas + 1)` nodos de línea, del orden de los de 0.2.2 con 7 líneas. Se mide en la verificación.
- **Preparación en 0.2.2** (sin efecto visible): que `fotogramaEn` admita una subsecuencia de líneas, que `disponerBloque` reciba una región y que `PantallaLetra` pinte una lista de zonas (en 0.2.2, siempre una). Ver el backlog de 0.2.3 («Preparación pedida a 0.2.2»).

- **Las cuatro superficies** (reproductor, ventana secundaria, vista previa del editor y exportación) usan el mismo `PantallaLetra`, y la instantánea de la sesión y de la exportación ya lleva `letra` y `estilo` validados: el reparto llega solo (factibilidad §1.3).

### 5. Editor (estado)

- **Selección múltiple** en el reducer: `seleccionadas: string[]` además de `seleccion` (la principal, que sigue siendo la que usan la línea de tiempo, el editor preciso y los atajos de tiempos). Todo lo de hoy sigue leyendo `seleccion`.
- Cada asignación, alta, baja o renombre de cantante es **un paso de deshacer** (aunque afecte a varias líneas); el cambio de color es un paso de estilo, como hoy.
- **Atajos**: `C` abre «¿Quién canta?»; `Alt + 1…4` asigna cantante leyendo `KeyboardEvent.code` (`Digit1`…) y sin Ctrl ni Cmd pulsados (Opción en macOS cambia `key`; AltGr llega como Ctrl + Alt en Windows); `Alt + ↑/↓` mueve una región de carril. Ninguno actúa con el foco en un campo de texto ni en la ventana del editor preciso (factibilidad §5).
- **Línea de tiempo**: las regiones siguen siendo un botón DOM por línea (el número de nodos no crece con los carriles) y la onda se sigue pintando en Canvas detrás; el **alto efectivo** crece por carril sin reescribir la preferencia del usuario (`distribucion.ts` ya separa preferido y efectivo); «Juntar carriles» se recuerda para todas las canciones en `config.editor.carriles_juntos: boolean` (lectura tolerante, escribible por el renderer).

### 6. Compatibilidad

| Caso | Resultado |
|---|---|
| 0.2.3 abre una canción o un tema de 0.2.1 o 0.2.2 | Sin reparto: se ve igual que antes y no se escribe nada |
| 0.2.2 abre una canción o un tema con reparto | Lo lee con tolerancia, no lo usa y **lo conserva** al guardar (reserva de 0296 y 0287 con **esta misma forma**: si 0.2.2 ya validase otra forma, la tarea 0340 lo detecta con una copia congelada del esquema de 0.2.2) |
| 0.2.1 abre una canción con reparto | Se abre sin error con un solo cantante; si la guarda, **pierde el reparto** (y un tema guardado, sus `colores_partes`). Pérdida aceptada, como ADR 0018 §1 y 0022 §1; se dice en las notas |
| Paquete de canción de 0.2.3 importado en 0.2.2 | Entra con el reparto conservado (`esquema_cancion` sigue en 1) |
| Paquete de 0.2.2 o 0.2.1 en 0.2.3 | Sin reparto |
| Sesión en vivo y exportación | La instantánea lleva el reparto; nada nuevo |

- `estilo.pantalla.zonas`: 0.2.2 lo conserva si su tarea 0287 lo reserva (pedido en el backlog de 0.2.3); si no, al reescribir un tema lo pierde y vuelve al valor por defecto (`"por_parte"`), que es el más común.

**Puertas que no se cierran** (nada de esto se implementa ni se reserva en las features 1 y 2):

- **Voces a la vez**: el reparto ya dice de quién es cada línea y las zonas ya separan las secuencias en pantalla; solaparlas solo exige relajar el invariante del fin «por parte» (ADR 0006), sin campo nuevo. Es la feature 3 condicionada (§7).
- **Texto sin cantar teñido por cantante** (una de las referencias): cabe como clave hermana opcional `estilo.letra.colores_partes_texto` con las mismas ranuras, sin tocar `colores_partes`. No entra en 0.2.3 (resta contraste a la letra, decisión 7 de 0160); el usuario puede pedirlo.
- **Cambio de cantante dentro de una línea**: `palabras[].parte` opcional (ausente = la de la línea), factibilidad §7.
- Como 0.2.3 no reserva esas claves, una versión posterior que las use las perdería al volver a 0.2.3; si hace falta, esa versión decide reservarlas antes (como 0.2.2 hizo con estas).

### 7. Voces a la vez: dictamen y feature 3 condicionada a una prueba técnica

**Qué cuesta.** Con las zonas de §4 bis, **pintar** dos líneas solapadas de partes distintas deja de ser lo caro: cada zona es su propia secuencia y su propio bloque del modelo de puestos, así que dos zonas pueden tener a la vez una línea activa sin «grupos simultáneos» ni cambios en `fotogramaEn` (la exploración §6.4 los necesitaba porque todo iba en un solo bloque). Lo que sigue costando está en los **datos y las funciones que miran «la siguiente línea»** (factibilidad §3.2):

| Pieza | Cambio | Tamaño |
|---|---|---|
| Invariantes de la letra (ADR 0006), `finEfectivo`, palabras, `limitesInicio`/tiradores | Inicios crecientes en toda la letra (como hoy; dos que empiezan juntos se separan 1 ms) y fin limitado por la siguiente línea **de la misma parte**; «Todos» cuenta como de todas las partes de cantante (no se solapa con ninguna de ellas; sí con el coro) | M–L |
| Editor | Regiones solapadas en carriles distintos; tiradores limitados por su carril; la lista sigue en orden de inicio; el modo al ritmo no cambia (marca inicios en orden) | M |
| Funciones automáticas de 0.2.2 | «Ajustar los silencios», encaje, dudosas y alineación excluyen o fusionan los tramos solapados (la voz separada mezcla a todos); `.lrc` sin marca vacía donde hay solape; `revisada` deja de valer en las líneas cuyo fin automático cambia | M |
| Render | Una línea activa por zona a la vez; indicadores de espera por zona | S (con zonas) |
| Exportación por fotograma | Más nodos activos a la vez (hasta una activa por zona); sin cambios de diseño | S (se mide) |

En total, **L** (unas 5 tareas tras la prueba). El riesgo no está en la pantalla sino en cambiar una regla que usan unas 20 piezas de 0.2.1 y 0.2.2 recién publicadas.

**Dictamen (provisional, ampliación de 0165)**: opción **(b)**, **entra como feature 3 de 0.2.3 condicionada a una prueba técnica con criterio cerrado**, como la feature 10 de 0.2.2. La prueba (tarea 0356, en `docs/spikes/0029-voces-a-la-vez/`, sin código de producción) **sirve** si se cumplen todos:

1. Una letra inventada que reproduce los tres patrones de las referencias (frases cruzadas de dos cantantes, la misma frase cantada por dos a la vez y coro que acompaña a la voz principal) y, si el usuario lo aporta, un dúo real anotado a mano, se representan con la regla de arriba **sin** inicios que tengan que adelantar al de otra parte en más de 1 ms; ninguna prueba existente de `letra.test.ts`, `render.test.ts`, `pantalla.test.ts`, `encaje.test.ts`, `dudosas.test.ts`, `silencios.test.ts` y `lrc.test.ts` cambia de resultado con letras sin solapes.
2. Prototipo del render con 3 zonas y una activa en cada una: el tiempo de captura de un fotograma de exportación a 1920 × 1080 es ≤ 1,25 × el de 0.2.2 con 5 líneas, en el mismo equipo.
3. Las cinco funciones automáticas tienen un comportamiento definido y probado con solapes (excluir o fusionar) y ninguna da falsos positivos en la letra de la prueba.

Si sirve, las tareas 0357–0360 se ejecutan y la feature 3 entra en la misma alfa o en la siguiente; si no, se cierra con su informe (0361) y las voces a la vez pasan a una versión posterior ([propuesta 037](../propuestas/037-prueba-tecnica-de-voces-a-la-vez.md)). Las zonas y los colores por parte **entran en cualquier caso** con la feature 1.

## Consecuencias

- **Positivas**: dúos, tríos, cuartetos y coros visibles, cada parte con su carril, su color y su zona de pantalla, sin tocar las reglas de tiempo; una canción de un solo cantante no cambia; sin canal ni esquema nuevos; el reparto viaja solo a la sesión, la exportación y el paquete.
- **Negativas / riesgos**: las zonas reparten el alto de la pantalla entre partes (menos líneas por zona; la spec fija las proporciones); muchas piezas de interfaz del editor (lista, panel, línea de tiempo, Funciones, Estilo); la línea de tiempo con 6 carriles a 1024 × 576 es lo más delicado (se juntan solos); 0.2.1 pierde el reparto si guarda; los colores predeterminados no están comprobados sobre todos los fondos.
- **Legales / licencias**: sin dependencias nuevas. Los nombres de los cantantes los escribe el usuario y quedan en su equipo.
- **Impacto en UX**: chip, menú «¿Quién canta?», tecla C, selección múltiple, carriles, sección en Funciones y en Estilo; insignia, color y paréntesis en pantalla.

## Fuentes

- [Exploración UX](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md) §2–§7 y §14; [factibilidad técnica](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md) §1, §3.1, §4.2, §5 y §8.3; preguntas [0160](../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md), [0161](../preguntas/0161-viabilidad-tecnica-de-varios-cantantes-y-coros.md) y [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md).
- ADR [0006](0006-persistencia-y-modelo-de-datos.md), [0016](0016-catalogo-de-temas-e-identidad-de-artista-y-album.md), [0018](0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md) §1, [0021](0021-sincronia-simplificada-y-editor-preciso-de-linea.md) §4, [0022](0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) §1–§5, [0024](0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) §4, [0025](0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), [0027](0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md) §4.
- MDN, [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).
- Referencias visuales del usuario (3 capturas de karaokes comerciales, vistas el 2026-11-22; no se copian al repositorio).
