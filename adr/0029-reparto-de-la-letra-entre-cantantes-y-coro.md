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
  "partes": {                                   // opcional; ausente = un solo cantante sin nombre, sin coros y nivel por defecto
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
    "c2": "#35C6E8", "c3": "#FF5C8A", "c4": "#7CFF6B", "todos": "#B388FF", "coro": "#FF9F1C" } },
  "pantalla": { …, "zonas": "por_parte" }       // opcional: "por_parte" | "una"; ausente = "por_parte" (§4 bis)
}
```

- **Catálogo** (`shared/reparto.ts`, nuevo, puro): `PARTES = ['c1','c2','c3','c4','todos','coro']`, `MAX_CANTANTES = 4`, `NOMBRE_MAX = 40`, `COLORES_PARTES_PREDETERMINADOS` (los de arriba; `c1` no tiene: es `color_resaltado`).
- **Canción con reparto** (derivado, `tieneReparto`): **2 o más cantantes, o alguna línea de coro** (spec 06, «Conceptos»; revisión de 0171 §2). **Con varios cantantes** (`variosCantantes`): 2 o más. `letra.partes` puede existir sin reparto (un solo cantante con nombre o con un nivel de coros propio): se conserva para no perder ese dato, pero no activa carriles, chips, zonas ni insignias. Sin reparto la canción no cambia en nada; las insignias y el ancho del 80 % solo aparecen con varios cantantes.
- **Invariantes al escribir** (main, estricto): `parte` solo en elementos `linea`; `parte` de un cantante que no está en `partes.cantantes` no se admite; `"todos"` solo con 2 o más cantantes; `"c1"` no se escribe (ausente = `c1`, así abrir y guardar no cambia el archivo); nombre recortado, vacío → `null`, máximo 40 caracteres.
- **Normalización** (`normalizarReparto(letra)`, pura, la aplican el reducer del editor antes de guardar y main al escribir): si `cantantes` solo tiene `c1` con nombre `null`, ninguna línea es `todos` o `coro` y `voz_en_coros` está ausente o vale 0,5, se **quita `partes`** (una canción sin reparto vuelve a no tener el campo). Con un solo cantante no puede haber líneas `todos`: pasan a `c1`.
- **Lectura tolerante por campo** (como `editor.paneles`, ADR 0006): una `parte` fuera del catálogo, de un cantante que no existe o `todos` con un solo cantante se lee como `c1`; un nombre no válido, como `null`; `cantantes` inválido o sin `c1` se repara (se añade `c1`, se quitan duplicados y sobrantes); `voz_en_coros` fuera de rango, como 0,5; un color no válido de `colores_partes`, como su predeterminado. Una clave `c1` en `colores_partes` (la reserva de 0.2.2 la admite) se ignora: el Cantante 1 es siempre `color_resaltado`. Nada de esto marca la canción o el tema como dañados ni los reescribe al abrir.
- **Reglas de tiempo**: no cambian. Asignar una parte no toca inicios, fines, palabras, `origen_*`, `revisada`, `alineacion` ni `intacta` (no es un cambio de tiempos ni de texto). Los invariantes de ADR 0006 (inicios crecientes; un fin no pasa del inicio siguiente) siguen siendo globales en las features 1 y 2; la feature 3 los relaja solo si su prueba técnica sirve (§7).
- **Esquema**: `cancion.esquema` y el de temas **no suben** (campo opcional con equivalencia por defecto, ADR 0006 revisión de la fase 3).

### 2. Escritura e IPC

- **Sin canal nuevo**: `letras.guardarTiempos` admite `parte` opcional en cada elemento de `tiempos` (ausente = `c1`) y `partes` opcional en la raíz (`null` = quitar; ausente = conservar). Es el camino de `revisada` en 0.2.2 (ADR 0024 §4). El editor envía siempre el reparto completo de la letra cuando cambia.
- **Corregir la letra** (vista Letra, `aplicarTextoEditado`): una línea emparejada conserva su `parte` (0296 ya conserva todos los campos); una línea **nueva o cambiada hereda la parte de la línea anterior** (si es la primera, la de la siguiente; spec 05 · 0.2.3). Provisional, decisión 17 de 0160.
- **Sustituir la letra entera** (otra de LRCLIB o pegada): se **conserva `partes`** (cantantes, nombres y nivel de coros, así no se vuelven a escribir los nombres ni desaparecen los carriles) y todas las líneas nuevas son de `c1` (se pierden las asignaciones; el diálogo de sustituir de la vista Letra lo avisa, spec 05). Provisional.
- **Preparación desatendida** (ADR 0025): no asigna partes ni marca coros (decisión 13 de 0160). La sugerencia «Marcarlas como coro» usa `lineasEntreParentesis(letra)` (pura): líneas `c1` cuyo texto recortado empieza por «(» y acaba en «)».
- **Exportar `.lrc`** (ADR 0027 §4): sin partes; las líneas `coro` cuyo texto no esté ya entre paréntesis se escriben entre paréntesis, para que al volver a importar la sugerencia las encuentre (provisional, 0165 §8).

### 3. Funciones puras del reparto (`shared/reparto.ts`)

| Función | Qué devuelve |
|---|---|
| `parteDe(linea)` | La parte efectiva (`c1` si falta) |
| `tieneReparto(letra)` / `variosCantantes(letra)` | §1 |
| `carriles(letra)` | Sin reparto, `[]` (una sola pista, como hoy). Con reparto, en orden c1–c4, todos, coro: un carril por **cada cantante** (tenga o no líneas: indicación del usuario en 0160); **Coro siempre**; **Todos siempre con 3 o más cantantes** y, en un dúo, solo mientras tiene alguna línea (revisión de 0171 §1). El editor añade durante un arrastre las franjas de destino («+ Nuevo cantante», Todos en un dúo) |
| `siguienteRanuraLibre(letra)` | La primera de `c2`…`c4` libre, o `null` con 4 |
| `asignar(letra, ids, parte)` / `anadirCantante(letra, asignarA?)` / `quitarCantante(letra, id)` / `renombrar(letra, id, nombre)` | La letra nueva, normalizada. Quitar un cantante pasa sus líneas a `c1` y, si queda uno solo, también las de `todos`; los demás cantantes no se renumeran. `anadirCantante` en una canción sin reparto crea `partes` con `c1` y `c2` |
| `inicial(letra, parte)` | Lo que identifica a la parte en chips, carriles y menú: `{ tipo: "texto", texto }` o `{ tipo: "icono", icono: "users" }`. Cantante: primera letra del nombre en mayúscula; si otro cantante comparte inicial, sus dos primeras letras; si aún coinciden, o el nombre es el predeterminado, el **número de la ranura**. `todos`: las dos iniciales unidas con «·» con 2 cantantes; el icono `users` con 3 o 4. `coro`: «( )» (revisión de 0171 §3) |
| `insignia(letra, parte)` | La insignia en pantalla: `inicial` si la canción tiene varios cantantes; `null` para `coro` y en canciones con un solo cantante |
| `textoEnPantalla(linea)` | Indica si hay que dibujar paréntesis (solo `coro` y si el texto no los trae ya). El render los dibuja; el texto guardado no cambia |
| `colorDeParte(estilo, parte)` | `color_resaltado` para `c1`; si no, `colores_partes[parte]` o el predeterminado |
| `lineasEntreParentesis(letra)` | §2 |
| `recuentoPorParte(letra)` | Para Funciones › «Cantantes y coros» |

### 4. Colores, estilo y contraste

- **Resolución**: `colores_partes` sigue la herencia de temas (canción › álbum › artista › predeterminado, ADR 0016) como el resto de `estilo.letra`. `normalizarEstilo` **no** rellena los predeterminados (un tema que no los usa no cambia en disco); `estilosIguales` compara los colores **efectivos** (`colorDeParte`) para no ver diferencias entre «ausente» y «predeterminado».
- **Render** (con reparto, también con un solo cantante y coros): `colorDeLinea` (0290) devuelve `colorDeParte(estilo, parteDe(linea))` para el barrido, el subrayado (que hereda el color del nodo, 0293) y los indicadores de espera (color de la línea que viene); en Letra lista, el **texto entero** de la línea toma el color de su parte (decisión 15 de 0160) y la ya cantada pasa a gris como hoy; el texto sin cantar sigue en `letra.color`. Sin reparto, todo vale `color_resaltado` como en 0.2.2.
- **Insignia**: nodo propio fuera del flujo, a la izquierda de la primera caja de renglón que ya mide `medirBarridos`; viaja con la línea (escala, opacidad y gris del puesto). Solo con **varios cantantes** (en toda la canción, también en la zona del coro), `--k-ancho-linea` pasa del 88 % al **80 %**; el texto sigue centrado y la línea activa conserva el ancla de ADR 0022.
- **Paréntesis**: se dibujan como parte del texto del nodo, fuera de los tokens de palabra; con palabras visibles, «(» se pinta con la primera palabra y «)» con la última.
- **Contraste** (`evaluarContraste`, solo partes **en uso** en la canción): color de parte frente al fondo (11 muestras) < 3:1 → ⚠; frente a `letra.color` con ΔE < 25 → ⚠; dos partes en uso entre sí con ΔE < 25 o `confusionDaltonismo(a, b)` → ⓘ informativo (la insignia ya las distingue). Sin avisos en el reproductor.
- **Paleta predeterminada**: la tarea de Estilo comprueba con esas mismas funciones los cinco colores frente a los fondos de los temas incluidos; si alguno falla, cambia el valor de la ranura con el visto bueno del diseñador y lo anota aquí.
- **«Todos»** existe con 2 o más cantantes; en un dúo se puede elegir (al final del menú) y con 3 o más va junto a los cantantes (spec 06).

### 4 bis. Zonas de pantalla por parte

Cada parte tiene, además de su carril y su color, **su espacio en pantalla**. Una **zona** es una franja horizontal fija para toda la canción, con su propio bloque de líneas. Valores de la spec ([07 · Disposición por zonas](../ux/07-reproductor.md#disposición-por-zonas) y [sistema visual · 0.2.3](../ux/sistema-visual.md#023--varios-cantantes-y-coros)), confirmados en la revisión de 0171 §4:

- **`zonasDePantalla(letra, estilo, { anchoPx, altoPx })`** (`renderer/src/karaoke/zonas.ts`, nueva, pura) → `[{ id, partes, region: { y0Px, altoPx }, lineas: 1 | 2, escala }]`. **Sin reparto o con `estilo.pantalla.zonas = "una"`**: una sola zona = el bloque de 0.2.2 con `N`, `P` y ancla, sin cambios (con reparto y «una», con los colores, insignias y paréntesis de §4).
- **Con reparto y `"por_parte"`**: de arriba abajo, la zona del **Coro** (si la canción tiene líneas de coro; mitad del alto de una de cantante, 1 línea) y una por **cantante de la canción** (mismo alto, 2 líneas: la en curso o próxima y la siguiente de esa parte al 70 % si cabe entera). Área del **12 % al 86 %** del alto; separación 0,3 × `S`. **«Todos»** no tiene zona: su línea entra en la subsecuencia de **cada** zona de cantante (se dibuja repetida). Ninguna zona cambia de sitio en toda la canción; una zona sin más líneas queda vacía.
- **Tamaño**: `S_zona = mín(S, alto de zona / (2 × 1,2 + 0,7 × 1,2))` con mínimo 0,75 × `S` (por debajo, la zona deja de mostrar la siguiente); en la zona del coro, mínimo 0,5 × `S` y, si aún no cabe, un renglón con «…». Se calcula **una vez por canción y tamaño de ventana**, igual para todas las zonas de cantante (forma estable, como las alturas medidas de ADR 0022 §3).
- **Modelo por zona**: `fotogramaEn` sobre la **subsecuencia** de la zona (su índice de sucesos, cacheado por zona) con `N = lineas`, `P = 0` (ninguna ya cantada) y el «Cambio de línea» del tema. Variante necesaria (decisión técnica): con `P = 0`, el «dos tiempos» de 0.2.2 dejaría vacío el sitio principal de la zona entre el fin de una línea y el inicio de la siguiente, y la spec quiere ver ahí la **próxima**. En las zonas, por tanto, la salida de una línea y la subida de la siguiente van **en un solo cambio en el fin** (`subidaAlSalir`, opción nueva de `fotogramaEn`, solo para zonas); el relevo no cambia. `disponerBloque` coloca cada bloque dentro de su región con el ancla relativa a ella y la escala `S_zona`.
- **Opacidad por zona** (función del tiempo en `zonas.ts`): 1 mientras suena una línea de la zona (`[inicio, finEfectivo]`), 0,55 si no; el cambio dura `D` del tema, lineal, y es instantáneo con movimiento reducido. Multiplica la opacidad de los puestos; el suelo de contraste de 0.2.2 se aplica después.
- **Indicadores de espera y cuenta**: los de ADR 0018 se calculan como hoy y se dibujan en la zona de la **línea que viene** (si es de Todos, en la primera zona de cantante), con su color.
- **«Líneas a la vez» y «Líneas ya cantadas»** del tema no se aplican en zonas; «Cambio de línea» sí, dentro de cada zona.
- **Dónde vive `zonas`**: en `estilo.pantalla`, así que forma parte del bloque «Letra en pantalla» del tema: se hereda como el bloque y viaja en `apariencia.reemplazo_pantalla` («Cambiar solo en esta canción», ADR 0022 §1; revisión de 0171 §5).
- **Por qué así**: cada zona es una secuencia independiente y conserva la garantía de ADR 0022 de «nunca dos cambios a la vez»; por eso las voces a la vez en pantalla salen casi gratis (§7).
- **Exportación**: el mismo `PantallaLetra` por fotograma; como mucho 5 zonas × 2 líneas (+1 durante un cambio), del orden de los nodos de 0.2.2 con 7 líneas. Se mide en la verificación.
- **Preparación en 0.2.2** (sin efecto visible): `fotogramaEn` admite una subsecuencia de líneas, `disponerBloque` recibe una región y `PantallaLetra` pinta una lista de zonas (en 0.2.2, siempre una). La opción `subidaAlSalir` y `S_zona` los añade 0.2.3.

- **Las cuatro superficies** (reproductor, ventana secundaria, vista previa del editor y exportación) usan el mismo `PantallaLetra`, y la instantánea de la sesión y de la exportación ya lleva `letra` y `estilo` validados: el reparto llega solo (factibilidad §1.3).

### 5. Editor (estado)

- **Selección múltiple** en el reducer: `seleccionadas: string[]` además de `seleccion` (la principal, que sigue siendo la que usan la línea de tiempo, el editor preciso y los atajos de tiempos). Todo lo de hoy sigue leyendo `seleccion`.
- **Orden de Esc** (revisión de 0171 §7): (1) cerrar el menú o el popover abierto; (2) cancelar un arrastre en curso; (3) con varias seleccionadas, dejar solo la principal; (4) lo de siempre. El editor preciso es otra ventana y no compite.
- Cada asignación, alta, baja o renombre de cantante es **un paso de deshacer** (aunque afecte a varias líneas); el cambio de color es un paso de estilo, como hoy.
- **Atajos**: `C` abre «¿Quién canta?»; `Alt + 1…4` asigna cantante leyendo `KeyboardEvent.code` (`Digit1`…) y sin Ctrl ni Cmd pulsados (Opción en macOS cambia `key`; AltGr llega como Ctrl + Alt en Windows); `Alt + ↑/↓`, con el foco en la lista o en una región, lleva la selección a la parte anterior o siguiente en el orden de los carriles visibles (libre: el editor solo usa Alt con ← y →, y Ctrl/Cmd + ↑/↓ es de la feature 11; revisión de 0171 §8). Ninguno actúa con el foco en un campo de texto ni en la ventana del editor preciso (factibilidad §5).
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
| Render | Una línea activa por zona a la vez (cada zona con su opacidad al 100 %); indicadores de espera solo cuando no suena ninguna zona | S (con zonas) |
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

## Revisión 2026-11-22 · Alineación con las specs de 0.2.3 (pregunta 0171)

Cambios respecto a la primera redacción, ya integrados arriba: «canción con reparto» pasa a ser un derivado (2 o más cantantes o alguna línea de coro) y `partes` puede existir sin reparto (§1); «Todos» exige 2 o más cantantes (§1, §4); carriles de Coro siempre y de Todos según el número de cantantes (§3); `inicial` e `insignia` separadas, con número de ranura e icono (§3); 80 % e insignias solo con varios cantantes (§4); zonas con los valores de la spec, la variante `subidaAlSalir` y la opacidad por zona (§4 bis); primera línea corregida, que hereda de la siguiente (§2); orden de Esc y `Alt + ↑/↓` en la lista (§5).


## Revisión 2026-11-23 · Firmas de `shared/reparto.ts` (pregunta 0330)

Completa §3 con lo implementado en la tarea 0340:
- `parteDe(linea, letra?)`: con la letra aplica la lectura tolerante de §1 (un cantante que no existe, o `todos` con un solo cantante, se lee como `c1`). Sin la letra, solo mira el campo. Quien pinta, cuenta o exporta pasa siempre la letra.
- `textoEnPantalla(linea)` → `{ texto, parentesis }`: `texto` es el guardado, sin tocar; `parentesis`, si el render debe dibujarlos.
- `recuentoPorParte(letra)` → `Record<Parte, number>` con las seis partes (líneas, no pausas).
- `inicial` e `insignia` → `{ tipo: "texto", texto } | { tipo: "icono", icono: "users" }` (`insignia` puede dar `null`). Con iniciales en choque, dos letras («An», «Al»). Un nombre que no empieza por letra ni número usa el número de ranura.
- `asignar`, `anadirCantante` (con 4 cantantes) y `quitarCantante('c1')` imposibles devuelven **la misma letra**, sin lanzar. Main valida al escribir.
- Funciones auxiliares: `cantantesDe`, `vozEnCoros` (nivel o 0,5), `nombreNormalizado` y `validarReparto` (invariantes de §1; lista vacía si es válido).
- `normalizarReparto` conserva un `voz_en_coros` explícito mientras exista `partes`. La regla de quitar `partes` de §1 trata 0,5 explícito como ausente.
- `estilosIguales` compara también `pantalla.zonas` (ausente = `por_parte`) y los colores efectivos.
- `colores_partes` no tiene ranura `c1` en el esquema: una clave `c1` se descarta al leer y no se vuelve a escribir.
- `guardarTiemposSchema`: con `partes`, cada `parte` apunta a un cantante de la lista y `todos` exige 2 o más. Con `partes: null`, solo se admite `coro`. «`parte` solo en líneas» lo comprueba main.
- Semilla de reparto opt-in (`sembrar(datos, { reparto: true })`, `npm run semilla -- --reparto`).

## Revisión 2026-11-23 · Guardado del reparto, partes en pausas y color del Cantante 2 (preguntas 0341 y 0345)

- **Quién envía `partes`** (§2): `GuardadoEditor` normaliza con `normalizarReparto` y manda `partes: letra.partes ?? null` en cada guardado. Main trata `null` como «quitar» y nunca escribe la clave con `null`, así que una canción sin reparto no cambia en disco.
- **`parte` en una pausa**: main la **descarta en silencio** al escribir (`guardarTiempos`) y no rechaza la petición. Es una excepción acotada al «estricto» de §1, que sigue rigiendo para todo lo demás. Motivo:
  - el elemento de tiempos no lleva `tipo` y es un dato inofensivo;
  - rechazar la petición haría fallar el guardado del editor y arriesgaría las ediciones del usuario por un detalle que no se pinta.
  - El reducer no debe enviarla nunca: lo fija un test del reducer (0342).
- **Paleta predeterminada** (§4): el Cantante 2 pasa de `#4ADEDE` a **`#35C6E8`** (pregunta 0345, diseñador). Con el tema «Shinobi» tiene 5,63:1 frente al fondo, ΔE 46,0 frente a la letra blanca y ΔE simulado 31,9 en daltonismo: pasa las tres comprobaciones, mientras que `#4ADEDE` hacía saltar el aviso de daltonismo frente a la letra. Las demás ranuras no cambian. El ejemplo de §1 ya está corregido.
