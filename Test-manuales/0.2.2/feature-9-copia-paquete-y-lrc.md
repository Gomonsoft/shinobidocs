# Guía manual · 0.2.2 · Feature 9 · Copia de seguridad, paquete de canción y exportar la letra

- Versión: 0.2.2-alpha.3 · Feature 9
- Specs: [02 · Feature 9](../../ux/02-biblioteca.md#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra) · [08 · Feature 9](../../ux/08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad) · [06 · Feature 9](../../ux/06-editor.md#022--feature-9--exportar-la-letra-desde-el-editor) · ADR: [0027](../../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md)
- Informe de QA: [informe-feature-9](../../versiones/0.2.2/informe-feature-9.md)
- Duración estimada: 120 min (más el tiempo de copiar 1,7 GB, y 4 GB para el caso 3)
- Requisitos: tu biblioteca real (unos 1,7 GB); **otro usuario del sistema** o **otro equipo** con Shinobi Karaoke instalado y sin canciones; espacio libre de al menos 2 veces el tamaño de la copia; para el caso 3, una biblioteca (o una copia de pruebas) de **más de 4 GB**; un reproductor externo que lea `.lrc` (VLC con una extensión, foobar2000, MusicBee, Poweramp…); una canción de YouTube; opcional: lector de pantalla.

> **Decisión legal provisional, pendiente de ti (pregunta [0159](../../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md)).** El paquete «Completo, con el audio» contiene audio y letras con derechos de autor y, aunque la interfaz lo presenta como una copia para ti y no hay función de envío, el archivo se puede pasar a otra persona. La variante «Ligero» es la propuesta por defecto en el paquete de canción. No se publica una versión con el paquete con audio hasta que lo confirmes o lo cambies. Anota tu decisión abajo.

## Preparación

1. Anota cuántas canciones tiene tu biblioteca real, sus estados y cuántos temas, para compararlo tras restaurar.
2. Ten a mano un terminal para comprobar el contenido del archivo con `unzip -l copia.shinobi` (macOS y Linux) o con 7-Zip (Windows). Un `.shinobi` es un ZIP.

## Casos

### 1. Copia de la biblioteca real, restaurada en otro usuario u otro equipo

Criterios: F9-A1 a A5 · «Hecha cuando».

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Ajustes › Copia de seguridad (antes de «Acerca de») | Ves «Aún no has hecho ninguna copia de seguridad» o la última, con «Crear copia de seguridad…» y «Restaurar o importar…» | ☐ |
| 1.2 | «Crear copia de seguridad…», variante completa, con «Incluir mis ajustes». Mira el tamaño que anuncia | Anota el tamaño estimado y compáralo con el real al terminar: **±10 %** | ☐ |
| 1.3 | Crea la copia y cronométrala | «Creando la copia de seguridad» con la barra y «Guardando «…» i de n». Se puede «Seguir en segundo plano». Al terminar, «Paquete creado» con «Mostrar en la carpeta», que abre la carpeta | ☐ |
| 1.4 | Durante la creación, mira la carpeta de destino | Solo hay un archivo temporal oculto `.<nombre>.<8 caracteres>.shinobi-parcial`; el nombre final no existe hasta el final | ☐ |
| 1.5 | Lista el contenido (`unzip -l`) | Solo `manifiesto.json`, `temas.json`, `ajustes.json` y `canciones/<id>/…` (cancion.json, mezcla.flac, miniatura.jpg, voz.flac, instrumental.flac). **Ni** `.bak`, ni picos, ni modelos, ni registros, ni `config.json` | ☐ |
| 1.6 | Vuelve a Ajustes | «Última copia: hoy · N canciones · X GB · completa». Si cambias 5 canciones, aparece «Desde entonces has añadido o cambiado 5 canciones» (solo en Ajustes, nunca como aviso) | ☐ |
| 1.7 | En **otro usuario del sistema o equipo** sin canciones: Restaurar o importar… → elige la copia | «Restaurar copia de seguridad»: todas «Nueva», temas, asignaciones y la casilla de ajustes **marcada** (biblioteca vacía) | ☐ |
| 1.8 | Restaura | Resultado por canción; al cerrar, la Biblioteca tiene las mismas canciones, estados y temas. Compara con las notas de la preparación | ☐ |
| 1.9 | Reproduce una Lista y abre una Letra lista en el editor | Suena al momento, con letra, tiempos y estilo idénticos; una Lista se canta sin volver a separar | ☐ |
| 1.10 | Mira Ajustes de ese usuario | Los ajustes viajan (agrupar, volumen, transición…); **no** viajan consentimientos: el aviso de YouTube se vuelve a pedir; ni carpetas ni pantallas | ☐ |
| 1.11 | Restaura la misma copia **otra vez** sobre esa biblioteca | Todas «Ya la tienes igual: se omite». Nada cambia | ☐ |
| 1.12 | Restaura la copia sobre **tu biblioteca real** con alguna canción modificada después | Esa sale «Ya la tienes. La del paquete es más antigua», con «Omitir» por defecto. Con «Sustituir» tu canción va a la papelera del sistema; con «Conservar las dos» entra «… (importada)» | ☐ |

### 2. Paquete de una canción: completo, ligero y recuperar el audio

Criterios: F9-1 a F9-9, F9-12.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | ⋯ de una tarjeta → «Exportar paquete…» | Dos opciones con su tamaño, «Guardar como» con la extensión `.shinobi` y **siempre** el aviso de derechos. La palabra «compartir» no aparece en ningún texto | ☐ |
| 2.2 | Exporta una canción de YouTube en **Ligero** y mira el tamaño | Unos pocos KB. El aviso es la variante sin audio | ☐ |
| 2.3 | En otro usuario/equipo: importa ese paquete ligero | La canción entra como **borrador sin audio** con su letra y sus tiempos; la tarjeta dice «Falta descargar el audio» | ☐ |
| 2.4 | Pulsa «Continuar» en esa tarjeta | Se descarga **solo su audio** (sin pedir la URL) y se separa. Los tiempos y la letra siguen ahí | ☐ |
| 2.5 | Haz lo mismo con una canción de **archivo local** | «Falta preparar el audio» y «Continuar» ofrece «Elegir archivo» | ☐ |
| 2.6 | Importa un paquete ligero con «Sustituir» sobre una canción que ya tiene audio | Cambian la letra, los tiempos y el estilo; **el audio no cambia** y nada va a la papelera | ☐ |
| 2.7 | Exporta con el reproductor abierto en otra pantalla, sonando esa canción | Se permite (solo lee) | ☐ |
| 2.8 | Importa un paquete **completo** de 3 canciones en una biblioteca vacía | Las 3 con su estado, letra, tiempos por palabra hechos a mano, estilo, tema y fecha de añadido. La Lista se canta al momento | ☐ |
| 2.9 | Arrastra un `.shinobi` sobre la Biblioteca y sobre Ajustes | Abre el diálogo de importar con ese archivo. Un audio sigue abriendo «Añadir canción» | ☐ |
| 2.10 | En una biblioteca **vacía**, mira el enlace «Restaurar una copia o importar un paquete…» y el de «Añadir canción» | Ambos abren el diálogo de importar | ☐ |

### 3. Copia de más de 4 GB (ZIP64)

Criterios: ADR 0027 §8. El CI no la puede probar.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Con una biblioteca de más de 4 GB (añade canciones o usa una copia de pruebas con pistas duplicadas), crea la copia completa | Termina sin error. La memoria de Shinobi Karaoke **no crece** con el tamaño (mírala en el monitor del sistema) | ☐ |
| 3.2 | Lista el archivo con `unzip -l` o 7-Zip | Se lista (ZIP64). **El Archivo de Utilidades de macOS no abre ZIP64** (lo esperado; no es un defecto de la app) | ☐ |
| 3.3 | Restáurala en otro usuario/equipo | Todas las canciones entran; compara el recuento y reproduce una | ☐ |

### 4. Interrupciones y errores

Criterios: F9-3, F9-10, F9-11, F9-A6.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Crea una copia y pulsa «Cancelar» a mitad (Esc **no** debe cancelar) | No queda archivo en la carpeta (ni temporal), un archivo anterior con el mismo nombre se **conserva** y «Última copia» no cambia | ☐ |
| 4.2 | Crea una copia y **cierra la app** a mitad | El diálogo de cierre cuenta la copia; al confirmar, se cancela y no queda un `.shinobi` a medias | ☐ |
| 4.3 | Guarda en una carpeta sin permiso de escritura, en un USB lleno o desconéctalo a mitad | Mensaje «No queda espacio…» o «No se puede guardar en esa carpeta…» con [Reintentar]; la biblioteca no cambia | ☐ |
| 4.4 | Importa un archivo que no es un paquete (un `.zip` cualquiera, un `.txt` renombrado) | «Este archivo no es un paquete de Shinobi Karaoke.» No cambia nada | ☐ |
| 4.5 | Corta un paquete a la mitad (`head -c 1000000 paquete.shinobi > roto.shinobi`) | «El paquete está dañado o incompleto.» **Se rechaza entero en el paso 1**, sin lista parcial | ☐ |
| 4.6 | Pasa un paquete de una versión futura (ver abajo) | «Este paquete es de una versión más nueva…». No cambia nada | ☐ |
| 4.7 | Cancela una importación a mitad | Lo ya importado se conserva completo; la que se copiaba no entra; `biblioteca/.importando/` queda vacía | ☐ |
| 4.8 | Importa con poco espacio libre | Aviso «Hacen falta X y solo tienes Y libres» y el botón inactivo | ☐ |

> Para 4.6 no hace falta una versión futura: abre el `.shinobi` con un gestor de ZIP, edita `manifiesto.json` poniendo `"version_formato": 2` y vuelve a comprimirlo.

### 5. Exportar la letra (.lrc) en un reproductor externo

Criterios: F9-13, F9-14, F9-E1, F9-E2.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | ⋯ de una Lista → «Exportar la letra (.lrc)…» | Diálogo «Guardar» del sistema con el nombre «{título} — {artista}.lrc» | ☐ |
| 5.2 | Abre el `.lrc` en un editor de texto | Cabecera `[ti:]`, `[ar:]`, `[al:]`, `[length:]`, `[re:Shinobi Karaoke]` y una marca por línea. UTF-8 sin BOM (los acentos se ven bien) | ☐ |
| 5.3 | **Cárgalo en un reproductor externo** con el mismo audio (VLC, foobar2000, MusicBee…) | La letra sale al ritmo de la canción, sin desfase apreciable. Anota el reproductor y si las marcas vacías (pausas) se comportan bien | ☐ |
| 5.4 | Importa ese `.lrc` en una canción nueva con el mismo audio | Los inicios coinciden (±10 ms) y las líneas con marca vacía recuperan su fin | ☐ |
| 5.5 | En el **editor** (Funciones › «Exportar la letra (.lrc)…»): mueve un inicio y exporta de inmediato | El archivo lleva el inicio nuevo | ☐ |
| 5.6 | Una canción sin ninguna línea con inicio | El botón está inactivo con «No tiene letra sincronizada» visible debajo | ☐ |
| 5.7 | Selecciona 4 canciones (una sin tiempos) → Más acciones → Exportar la letra | Elige una carpeta; se escriben 3 archivos, no sustituye ninguno existente (añade « (2)») y el resultado cita la omitida | ☐ |

### 6. Teclado y lector de pantalla

Criterios: F9-15.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Recorre «Exportar paquete», «Importar paquete» y «Crear copia de seguridad» solo con teclado | Todo operable; el foco entra en el diálogo y vuelve al botón de origen. «Creando» no se cancela con Esc | ☐ |
| 6.2 | Con lector de pantalla, importa un paquete con una canción nueva, una más antigua y una igual | Los estados se **distinguen sin color** (icono y texto: «Nueva», «Ya la tienes…», «Ya la tienes igual») y el selector de cada fila tiene nombre («Qué hacer con «…»») | ☐ |
| 6.3 | Mira el control general «Omitir · Sustituir · Conservar las dos» | Tiene nombre «Para las que ya tienes» aunque no se vea escrito (ver informe, hallazgo del diseñador) | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
| | | | |

## Decisión pendiente del usuario

- [ ] Paquete con audio («Completo»): **permitir** como está / **solo la variante ligera** / **permitir con otro aviso**: _______ (fecha: ______).
