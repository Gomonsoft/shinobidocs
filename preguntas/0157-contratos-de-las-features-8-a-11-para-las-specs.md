# 0157 — Contratos de las features 8 a 11 de 0.2.2 para las specs

- De: disenador-ux
- Para: arquitecto
- Estado: Respondida
- Bloquea: no (provisionales aplicados en las specs)

## Contexto

Las specs de las features 8 a 11 del [plan 0.2.2](../versiones/0.2.2/plan-4.md) están escritas:

- Feature 8: [02 · Feature 8](../ux/02-biblioteca.md#022--feature-8--acciones-por-lotes-en-la-biblioteca) y [10 · Feature 8](../ux/10-exportacion.md#022--feature-8--exportar-varias-canciones).
- Feature 9: [02 · Feature 9](../ux/02-biblioteca.md#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra), [08 · Feature 9](../ux/08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad) y [06 · Feature 9](../ux/06-editor.md#022--feature-9--exportar-la-letra-desde-el-editor).
- Feature 10: [06 · Feature 10](../ux/06-editor.md#022--feature-10--sincronizar-con-la-voz-etapa-1), [04 · Feature 10](../ux/04-progreso-pipeline.md#022--feature-10--sincronizar-con-la-voz-en-la-preparación) y [08 · Feature 10](../ux/08-ajustes-y-acerca.md#022--feature-10--sincronía-automática-modelos-por-idioma).
- Feature 11: [06 · Feature 11](../ux/06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas) y [02 · Feature 11](../ux/02-biblioteca.md#022--feature-11--revisión-guiada-en-la-biblioteca).

Para no parar he tomado opciones provisionales en lo que toca a datos, canales y motor. Si alguna no es viable o hay una mejor, ajusto la spec.

## Pregunta

### Feature 8 · Acciones por lotes

1. **Operaciones por lotes en main.** «Editar datos…» y «Eliminar…» de varias canciones necesitan: una consulta previa que diga, por canción, si aplica y qué arrastra (trabajos que se cancelan, entradas de la cola, cambio de tema efectivo), una ejecución con progreso `{hechas, total}` y un resultado por canción (hecha, omitida con motivo, error), con `CONFIRMACION_OBSOLETA` si la selección cambió. ¿Reutilizas el patrón de «Aplicar tema» (ADR 0016 §7)?
2. **«A la cola» de varias.** Una sola operación que añade N entradas en orden, respeta `COLA_LLENA` de forma parcial y admite deshacer todas las añadidas. ¿Es viable sobre el contrato de la cola del ADR 0017?
3. **Lote de exportación.** Varias exportaciones con las mismas opciones y una carpeta: ¿hay un identificador de lote en la cola de exportación para agruparlas (fila única en actividad, un solo toast, resultado por canción, «Cancelar las que faltan», «Reintentar las fallidas»)? La spec toma la **instantánea de todas al confirmar**: ¿es asumible en disco y memoria con 20 o 50 canciones, o conviene tomarla al empezar cada una? Política de nombre repetido en la carpeta (conservar los dos con « (2)», sustituir, omitir) resuelta en main. Detención del lote con `SIN_ESPACIO` y `DESTINO_NO_DISPONIBLE`.
4. **«Preparar» de varias.** La spec da por hecho lo que la feature 5 anota en 0153 §7 y que esas canciones entran en la misma tanda de la cola de preparación (feature 7). ¿Confirmas?

### Feature 9 · Paquete, copia y letra

5. **Formato del paquete.** Un solo archivo para una canción, varias o toda la biblioteca, con un manifiesto (versión del esquema, fecha, versión de la app, tipo «canciones» o «copia», completo o ligero, lista de canciones y temas). ¿Contenedor (zip sin compresión para los FLAC, con soporte de archivos de varios GB) y extensión? La spec usa `.shinobi` como marcador. Escritura en temporal y renombrado al final, cancelable, como trabajo del panel de actividad; lectura que permita listar el contenido sin extraerlo y detectar un paquete truncado canción a canción.
6. **Identidad y conflictos.** Misma canción = mismo `id`. «Ya la tienes igual» = mismo `id` y misma `modificada`. «Sustituir» = la actual va a la papelera y entra la del paquete; con paquete ligero, se fusiona el `cancion.json` conservando los archivos de audio actuales. «Conservar las dos» = `id` nuevo y título con « (importada)». ¿Algún problema con las fechas `creada` y `modificada` importadas?
7. **Canción importada sin audio.** Un paquete ligero importado donde la canción no existe crea un borrador con letra y tiempos y **sin** mezcla ni pistas. ¿Qué estado de pasos es válido (`fuente` pendiente con la URL de YouTube o el nombre del archivo) para que «Continuar» vuelva a obtener el audio y la letra se conserve? Una Lista entra como borrador.
8. **Temas.** Tema idéntico (mismo `id` y mismo contenido): se reutiliza. Mismo `id` y distinto contenido, o nombre repetido: entra como copia «{nombre} (importado)» y las canciones importadas apuntan a la copia. En un **paquete de canciones**, una canción que heredaba su tema queda con ese tema **asignado a la canción**. En una **copia de seguridad**, las asignaciones de artista y álbum y el predeterminado se restauran solo donde el equipo no tiene ya una. Con `TEMAS_SOLO_LECTURA` no se importan temas.
9. **Ajustes en la copia.** ¿Qué claves de `config.json` viajan? Propongo: agrupación de la biblioteca, cuenta entre canciones, volumen y voz guía, opciones de exportación sin carpetas, distribución del editor e interruptores de 0.2.2. Fuera: instalación, hardware, modelo de separación, carpetas recordadas, pantalla, consentimientos.
10. **Datos de la sección de Ajustes.** «Última copia» (fecha, número de canciones, tamaño, tipo) y el recuento de canciones añadidas o modificadas desde entonces. ¿Dónde se guardan y cómo se calcula el recuento sin recorrer el disco en cada visita?
11. **Estimación de tamaño y espacio libre** antes de exportar e importar (suma de archivos; precisión ± 10 %).
12. **LRC.** Función pura `letra → texto LRC` y un canal que abre el diálogo «Guardar» en main (una canción) o «Elegir carpeta» (varias). Reglas de la spec: cabecera `[ti:] [ar:] [al:] [length:] [re:]`, desplazamiento aplicado, marca vacía en el fin efectivo cuando el hueco hasta la siguiente es de 2 s o más, líneas sin inicio omitidas, sin palabras. ¿El importador actual convierte esa marca vacía en una pausa con tiempo de modo que la línea recupere su fin (ida y vuelta)?
13. **Abrir un paquete con doble clic** (asociación de archivo). La spec no lo incluye; solo arrastrar sobre la ventana y los botones. ¿Lo añadirías?
14. **Códigos de error.** `PAQUETE_NO_VALIDO`, `PAQUETE_VERSION_NUEVA`, `PAQUETE_INCOMPLETO`, más los existentes `SIN_ESPACIO`, `DESTINO_NO_DISPONIBLE` y `ERROR_INTERNO`.

### Feature 10 · Sincronizar con la voz

15. **Prueba técnica y ADR.** La spec depende de su resultado: motor, modelos por idioma, licencias (la del modelo en inglés está sin comprobar), tamaño de cada descarga, plataformas y memoria mínima, y tiempos por canción con y sin tarjeta gráfica. ¿El análisis comparte cola con la separación? La spec tiene tres salidas según el resultado (todo, solo fines, nada).
16. **Datos por línea.** (a) `origen_palabras: "auto"` para las palabras automáticas, que se pintan como las manuales; 0.2.1 lo leería como valor desconocido y dejaría de pintarlas, sin perderlas. (b) **Origen del fin**: un campo opcional que diga quién fijó el fin (`manual`, `letra`, `silencios`, `preparacion`, `alineacion`; ausente = `manual`), para que la función solo cambie los fines que no puso el usuario y para «Quitar la sincronía automática» y «Quitar esos fines» de la feature 5. (c) **Confianza** de la última alineación por línea, guardada, para la feature 11. (d) `letra.idioma` y cómo se detecta. ¿Todo cabe sin subir `cancion.esquema`?
17. **Niveles de confianza.** Umbrales de Alta, Media y Baja y margen que se añade al fin, fijados con la prueba técnica.
18. **Analizar sin aplicar.** El motor devuelve una propuesta por línea (fin, palabras, confianza); una función pura la combina con la letra y con las casillas de la vista previa; «Aplicar» es un `guardarTiempos` en un paso del historial. Detección de propuesta obsoleta como en «Ajustar los silencios».
19. **Una sola línea.** ¿Cuánto tarda analizar una línea con el modelo ya cargado y sin cargar? La spec supone menos de 2 s y no muestra vista previa.
20. **Regla de descarte.** Las palabras automáticas se descartan al cambiar el inicio o el fin fuera del editor preciso (como las manuales), con un toast que ofrece volver a sincronizar la línea. «Corregir el desfase» (feature 4) las mueve con su línea. En el editor preciso se cargan como «automática» y, al aplicar con cambios, la línea pasa a `manual`.
21. **Modelos.** Manifiesto con tamaño por idioma, descarga reanudable desde Ajustes o desde el diálogo, quitar un modelo, y qué pasa con una instalación anterior a 0.2.2 a la que le falta la parte del motor (¿se instala con «Reparar el motor de audio»?). El primer arranque no descarga modelos.
22. **Preparación desatendida.** Condiciones para usar la alineación y respaldo con «Ajustar los silencios» (tabla de 04 · Feature 10). Nunca descarga un modelo sola. Factor de tiempo de referencia para la estimación de la tanda.
23. **Códigos de error.** `ALINEACION_NO_DISPONIBLE`, `IDIOMA_NO_ADMITIDO`, `MODELO_NO_DISPONIBLE` (reutilizado), `MEMORIA_INSUFICIENTE`, `ERROR_INTERNO`.

### Feature 11 · Revisión guiada

24. **Detección.** Función pura en `shared/` sobre la letra, los picos de voz y lo anotado por las features 4 y 10, con umbrales en constantes con nombre. La usa el editor en vivo. La Biblioteca necesita el **número de pendientes** en el resumen de cada canción «Lista para revisar»: ¿lo calcula main al guardar tiempos y al terminar la preparación y lo guarda como dato derivado, para no leer picos al listar?
25. **Marca «dada por buena».** Un campo opcional por línea, que main borra cuando cambian el inicio, el fin o el texto de esa línea por cualquier vía, y que entra en el historial de deshacer del editor.
26. **Calibración.** Umbrales provisionales en la tabla de motivos de la spec. Objetivo: que A Pesar de Mí y Arrópame (sincronizadas a mano) no tengan más del 10 % de líneas señaladas. ¿Lo mides con el banco de `calibrar:silencios`?
27. **«Fin al final de la voz».** La regla de `proponerAjusteSilencios` aplicada a una sola línea (propuesta 016).
28. **Entrada.** Abrir el editor pidiendo el recorrido («Revisar» de la tarjeta, de la vista de progreso y de los toasts) y marcar como lista o letra lista **desde la Biblioteca** sin abrir el editor (ítems del ⋯ y toast tras «Probar»).

## Opción provisional tomada (si no bloquea)

1. Sí, el patrón de «Aplicar tema». 2. Una operación con deshacer conjunto. 3. Identificador de lote, instantáneas al confirmar, política de nombres en main, detención con esos dos códigos. 4. Sí. 5. Un archivo `.shinobi` con manifiesto. 6. Como se describe. 7. Borrador con `fuente` pendiente. 8. Como se describe. 9. La lista propuesta. 10. En `config.json`, con el recuento calculado al abrir Ajustes. 11. Suma de tamaños de archivo. 12. Como se describe, con ida y vuelta. 13. No en 0.2.2. 14. Esos códigos. 15. Spec condicionada al resultado; cola compartida con la separación. 16. Los cuatro campos, opcionales, con el esquema en 1. 17. Los fija la prueba. 18. Propuesta más función pura. 19. Menos de 2 s, sin vista previa. 20. Como se describe. 21. Como los modelos de separación; la parte del motor se instala con «Reparar». 22. Tabla de la spec 04. 23. Esos códigos. 24. Dato derivado guardado por main. 25. Campo opcional por línea. 26. Sí. 27. Sí. 28. Parámetro de navegación y el canal de marcar existente.

## Respuesta

Arquitecto, 2026-11-21. Decisiones en los ADR [0026](../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md) (feature 8), [0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md) (feature 9), [0028](../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md) (feature 10, **Propuesto** hasta la prueba técnica) y [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) (feature 11). Se aceptan casi todos los provisionales; **cambian** §5 (paquete truncado), §16b (catálogo de `origen_fin`), §19 (una línea) y un matiz de §16a.

**Feature 8**
1. Sí, patrón de «Aplicar tema»: `previsualizar` (qué arrastra cada canción y una `version`), `ejecutar` con progreso `{ hechas, total }`, resultado por canción y `CONFIRMACION_OBSOLETA`. Canales `biblioteca.editarDatosVarias.*` y `biblioteca.eliminarVarias.*`.
2. Viable: `sesion.colaAnadirVarias({ ids })` → `{ entradaIds, omitidas }` (parcial con `COLA_LLENA`) y `sesion.colaQuitarVarias({ entradaIds })` para deshacer las que aún no sonaron.
3. Sí: `exportacion.iniciarLote` devuelve un `loteId` que viaja en cada exportación (fila única, un aviso al final, resultado por canción, `cancelarLote`, `reintentarLote`). **Instantáneas al confirmar**: asumible (KB por canción en memoria de main; el audio se decodifica al empezar cada una). Nombres repetidos en main (`numerar`, `sustituir`, `omitir`). El lote se detiene con `SIN_ESPACIO` y `DESTINO_NO_DISPONIBLE`. Concurrencia 1.
4. Confirmado: mismo `preparacion.preparar({ ids })` y misma tanda.

**Feature 9**
5. ZIP (ZIP64) con `yazl`/`yauzl` (MIT), audio sin comprimir, extensión `.shinobi`, temporal y renombrado, cancelable, en el panel de actividad; `copias.leer` lista el manifiesto sin extraer. **Matiz**: un ZIP truncado no se puede listar (el índice central está al final), así que se rechaza **entero** con `PAQUETE_INCOMPLETO`; lo que sí se detecta canción a canción es un archivo dañado (SHA-256 del manifiesto).
6. Aceptado tal cual (igual = mismo `id` y `modificada`; sustituir con paquete ligero conserva el audio actual; «Conservar las dos» con `id` nuevo y « (importada)»). `creada` y `modificada` se conservan; sin problema (la agrupación por fecha usa `creada`).
7. Borrador con `pasos.fuente = "pendiente"` (con `url` y `youtube_id`, o `nombre_original`), `pistas: null`, `pasos.separacion = "pendiente"`: es el estado de sustitución de la fuente de ADR 0006, que conserva letra y estilo. Una Lista entra como borrador sin `modalidad`.
8. Aceptado tal cual.
9. Aceptada tu lista (detalle de claves en ADR 0027 §3).
10. `config.copias.ultima = { fecha, canciones, bytes, tipo }`; el recuento sale del **índice en memoria** (`creada`/`modificada` posteriores), sin recorrer el disco.
11. Suma de tamaños del índice frente al espacio libre.
12. Aceptadas tus reglas (`[re:]`, desplazamiento aplicado, marca vacía con hueco ≥ 2 s y al final, sin líneas sin inicio, sin palabras). **Ida y vuelta, comprobada en el texto de ADR 0005**: una marca vacía intermedia se importa como **pausa con tiempo** y la línea anterior recupera su fin como fin automático (el inicio de esa pausa); la marca vacía final da el fin fijado de la última. Los fines de huecos < 2 s no viajan. Lo prueba un test.
13. No en 0.2.2.
14. Aceptados `PAQUETE_NO_VALIDO`, `PAQUETE_VERSION_NUEVA`, `PAQUETE_INCOMPLETO`; añado `CANCION_MAS_NUEVA` (una canción con `esquema` mayor dentro de un paquete válido) y `EN_CURSO` (canción omitida al exportar porque se está descargando o separando).

**Feature 10**
15. Prueba técnica diseñada en ADR 0028 §2 (tarea propia, criterio cerrado). Candidato: wav2vec2 XLSR-53 ajustado por idioma (`jonatasgrosman`), pesos **Apache-2.0** y datos Common Voice **CC0**; inglés comprobado también Apache-2.0 (con `safetensors`). **1 262 101 911 B** por idioma. Mismas plataformas que la separación; memoria y tiempos los mide la prueba (criterio: ≤ 20 s con GPU, ≤ 1,5 × la duración con CPU, ≤ 4 GB de RAM). **Comparte la cola `pesada`** con la separación. Las tres salidas: todo, solo fines (si las palabras no llegan a su umbral) o nada.
16. Sin subir `cancion.esquema`: (a) aceptado; **matiz**: 0.2.1 lee `"auto"` como valor desconocido → ausente → «importadas», que 0.2.1 no pinta; no se pierden mientras 0.2.1 no reescriba la línea. (b) **Catálogo**: `origen_fin` con `letra`, `silencios`, `preparacion` o `alineacion`; **ausente = a mano** (no hay valor `manual` explícito). Las letras anteriores a 0.2.2 no lo tienen: sus fines cuentan como a mano y las funciones automáticas no los tocan. (c) `alineacion: { confianza }` por línea, retirada por main cuando cambian sus tiempos. (d) `letra.idioma` (`es`, `en`), detectado por main al guardar una letra nueva con `detectarIdioma` (palabras vacías y caracteres propios) y editable.
17. Los fija la prueba (ADR 0028 §2.4).
18. Aceptado: `alinear-letra` devuelve la propuesta, `aplicarAlineacion` (pura) la combina con las casillas, «Aplicar» es un `guardarTiempos` en un paso; propuesta obsoleta si cambia la `version` del editor.
19. **Cambia**: lanzar el worker y cargar 1,26 GB tarda segundos, así que el editor mantiene un **worker de alineación residente** (se cierra tras 5 min sin uso o al salir del editor). Con el modelo cargado, la meta es < 2 s por línea (lo mide la prueba); la primera vez la interfaz debe mostrar progreso de carga.
20. Aceptado.
21. Aceptado (manifiesto por idioma, descarga reanudable desde Ajustes o el diálogo, quitar). Con la opción sin dependencias nuevas, a una instalación anterior **no le falta nada del motor**; solo si la prueba obligara a añadir `torchaudio` se instalaría con «Reparar el motor de audio».
22. Aceptado; nunca descarga un modelo sola. El factor por minuto de audio lo mide la prueba.
23. Aceptados.

**Feature 11**
24. Sí: `detectarDudosas` en `shared/dudosas.ts`, umbrales con nombre (calibrados, ADR 0024 §3). Main guarda el recuento en `preparacion.dudosas` al terminar la preparación y en cada escritura de la letra de esa canción; la Biblioteca nunca lee picos al listar.
25. Aceptado: `revisada { inicio_ms, fin_ms, texto }` por línea; main la retira si cambia cualquiera de los tres; entra en el historial del editor.
26. **Medido ya**: Arrópame 0 % y A Pesar de Mí 6 % de líneas señaladas con los umbrales de ADR 0024. Ojo: A Pesar de Mí **no** está sincronizada a mano en su mayoría (22 de 30 fines coinciden con «Ajustar los silencios»). La verificación repite la medida con `app/scripts/calibrar-dudosas.ts` (herramienta de desarrollo como `calibrar-silencios.ts`).
27. Sí (`proponerAjusteSilencios` con `soloIds`, sin activar la cuenta). Por eso la propuesta 016 ya queda cubierta aquí aunque la feature 10 no entre.
28. Aceptado: parámetro de navegación del editor (`revisar: true`) y el canal existente `biblioteca.marcarLista(id, { modalidad })` desde la Biblioteca (main revalida las precondiciones como siempre).

**Detalles de las specs que conviene ajustar**: [06 · Feature 10](../ux/06-editor.md#022--feature-10--sincronizar-con-la-voz-etapa-1) (una línea: progreso la primera vez; catálogo de origen del fin sin valor `manual`); [04 · Feature 10](../ux/04-progreso-pipeline.md#022--feature-10--sincronizar-con-la-voz-en-la-preparación) (la preparación usa la variante prudente de «Ajustar los silencios»); plan B de la feature 10: la spec reactiva 016 y 027, pero la 016 ya existe como «Fin al final de la voz» de la feature 11, así que solo hace falta la 027.
