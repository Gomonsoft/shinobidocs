# Guía manual · Feature 3 · Aviso de versión nueva

> **No ejecutada todavía.** Recoge lo que las pruebas automáticas de la feature no pueden comprobar: la consulta real contra las *Releases* publicadas, el instalador correcto en cada sistema, la geometría del primer arranque, el lector de pantalla y las capturas. Los textos entre «» son los de la spec y están implementados tal cual.

- Versión: 0.2.2 · Feature 3
- Specs: [08 · Feature 3](../../ux/08-ajustes-y-acerca.md#022--feature-3--aviso-de-versión-nueva) (F3-A1 a F3-A19) · [01 · Feature 3](../../ux/01-primer-arranque.md#022--feature-3--mención-del-aviso-de-versión-nueva) (F3-P1, F3-P2) · [09 · Feature 3](../../ux/09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva) (P20–P22) · ADR: [0023](../../adr/0023-aviso-de-version-nueva-con-github-releases.md) · Tareas: [0284](../../tareas/0284-actualizaciones-version-y-servicio-en-main.md), [0285](../../tareas/0285-aviso-de-version-nueva-en-la-interfaz.md), [0286](../../tareas/0286-verificacion-e-informe-de-la-feature-3.md)
- Duración estimada: 2 h en un sistema; la repetición en los otros dos, 30 min cada uno (casos 2, 3 y 6).
- Requisitos:
  - **Dos versiones publicadas de verdad** en `Gomonsoft/shinobi-karaoke`: la que instalas (A) y otra más nueva (B). Mientras solo exista una, no se pueden hacer los casos 2, 3 y 6.
  - **Instaladores** de la versión A para **Windows**, **macOS** (chip Apple) y **Linux** (`.deb` y AppImage).
  - Con red y, para el caso 4, la posibilidad de cortarla (modo avión o desconectar el cable).
  - Un monitor de red (Wireshark, `tcpdump`, Little Snitch, el Monitor de recursos de Windows o similar) para el caso 5.
  - Un lector de pantalla para el caso 8: NVDA en Windows, VoiceOver en macOS, Orca en Linux.
  - Para el caso 7, una pantalla o ventana de **1280 × 800** y otra de **1024 × 576** (ventana en su tamaño mínimo).
  - Una compilación **de desarrollo** (la del canal `shinobi-karaoke-builds`) para el caso 9.

No hace falta conocer el código. Cada fila tiene un paso, lo que debería pasar y una casilla. Si algo no coincide, márcalo como fallo y apúntalo en «Incidencias».

## Preparación

1. Anota la versión que vas a instalar (A) y la más nueva publicada (B), y si B es preliminar o estable.
2. Haz una copia de la carpeta de datos (**Ajustes → Abrir carpeta de datos**) antes de empezar.
3. Instala A. En la primera ejecución, completa la preparación del motor o usa un equipo que ya lo tenga.

## Casos

### 1. Primer arranque: la mención del aviso

Criterio de la spec: F3-P1, F3-P2.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Con una carpeta de datos nueva, abre la app publicada (A) con una ventana de **1280 × 800**. | La bienvenida muestra «Shinobi Karaoke comprueba como mucho una vez al día si hay una versión nueva. Puedes desactivarlo en «Licencias» o, después, en Ajustes → Acerca de.» encima de la línea de licencia. **No hay scroll** de la ventana. | ☐ |
| 1.2 | Repite con la ventana a **1024 × 576** (tamaño mínimo). | El texto es visible entero y **no hay scroll**. *(Las pruebas automáticas midieron en un Mac M1 un scroll de unos 90 px en B1 a este tamaño, 30 px de ellos ya sin la mención; si lo confirmas, es la incidencia D2 del informe.)* | ☐ |
| 1.3 | Pulsa «Licencias». | Se abre el diálogo Acerca de con el bloque **Actualizaciones**, sin punto ni aviso. | ☐ |
| 1.4 | Desmarca «Avisarme cuando haya una versión nueva», cierra el diálogo y completa la instalación del motor. Entra en **Ajustes → Acerca de**. | La casilla sigue desmarcada y bajo ella se lee «El aviso está desactivado: …». Vuelve a marcarla para seguir. | ☐ |
| 1.5 | Repite 1.1 con una compilación de desarrollo. | La bienvenida **no** muestra la mención. | ☐ |

### 2. Aviso real con una versión más nueva publicada

Criterio de la spec: F3-A1, F3-A2, F3-A9, F3-A10, F3-A12.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Con A instalada (primera vez que arranca, aviso activado), abre la Biblioteca y espera unos 15 s. No toques Ajustes. | No sale ningún diálogo ni aviso emergente. El botón ⚙ muestra un **punto**. Pasar el ratón por encima dice «Ajustes · hay una versión nueva (Ctrl+,)» (⌘, en macOS). | ☐ |
| 2.2 | Abre un karaoke en el editor. | El punto sigue en ⚙ también ahí. | ☐ |
| 2.3 | Abre **Ajustes**. | Arriba aparece «Hay una versión nueva: {B}.» con **Ver**. El bloque Acerca de › Actualizaciones dice «Hay una versión nueva: {B}» (con «(versión preliminar)» solo si B lo es), «Tienes la {A}. La app no se actualiza sola…», **Ver novedades** y **Descargar**. | ☐ |
| 2.4 | Pulsa **Ver**. | La vista se desplaza hasta «Actualizaciones» y el foco queda en su título. | ☐ |
| 2.5 | Vuelve a la Biblioteca. Cierra y abre la app. | El punto ya **no** está, ni tras reiniciar. Al abrir Ajustes, el aviso y la línea de «Hay una versión nueva» siguen. | ☐ |
| 2.6 | Inicia una sesión con el reproductor (a pantalla completa y, si puedes, en otra pantalla). | No se ve ningún aviso de versión en el reproductor ni en la ventana del público. | ☐ |
| 2.7 | Pulsa **Ver novedades**. | El navegador abre la página de la versión B en GitHub (`…/releases/tag/v{B}`). | ☐ |

### 3. «Descargar» con el instalador correcto (repetir en cada sistema)

Criterio de la spec: F3-A15, F3-A16, P21 de la spec 09.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | **Windows**: pulsa **Descargar**. | El navegador (Chrome o Edge) baja `Shinobi-Karaoke-Windows-x64.exe` de la versión B. | ☐ |
| 3.2 | **macOS**: pulsa **Descargar**. | Baja `Shinobi-Karaoke-Mac-chip-Apple.dmg` de la versión B (Safari y Chrome). | ☐ |
| 3.3 | **Linux, instalada con el `.deb`**: pulsa **Descargar**. | Baja `shinobi-karaoke-linux-x64.deb`. | ☐ |
| 3.4 | **Linux, ejecutada como AppImage**: pulsa **Descargar**. | Baja `Shinobi-Karaoke-Linux-x64.AppImage`. | ☐ |
| 3.5 | En todos: mira lo que aparece en la app. | Un aviso «Se ha abierto tu navegador para descargar la versión {B}. Cuando termine, cierra Shinobi Karaoke y abre el archivo descargado.» con **Guía de instalación**. Si B es preliminar, añade «Es una versión preliminar: haz antes una copia de seguridad.»; si es estable, no. La app sigue abierta. | ☐ |
| 3.6 | Comprueba el archivo descargado. | Es de la versión B (la versión que se ve al instalarlo) y el navegador muestra los mismos avisos que al bajarlo desde el README. | ☐ |
| 3.7 | Pulsa **Guía de instalación**. | Se abre `INSTALAR.md` en GitHub, en «Actualizar a una versión nueva». *(Solo posiciona en la sección cuando esta rama esté en `main`.)* | ☐ |
| 3.8 | Si la versión B no trae el archivo de tu sistema (por ejemplo, una Release sin AppImage), repite. | Se abre la **página de la versión** y el aviso dice «Se ha abierto tu navegador en la página de la versión {B}. Descarga el archivo de tu sistema…». | ☐ |

### 4. Sin red: ningún mensaje

Criterio de la spec: F3-A14.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Cierra la app, desconecta la red y ábrela (con el aviso activado y una versión nueva ya anunciada el día anterior). | No sale **ningún** mensaje ni error. Ajustes sigue mostrando «Hay una versión nueva» (último resultado conocido). | ☐ |
| 4.2 | En Ajustes › Actualizaciones, pulsa **Buscar actualizaciones**. | El botón pasa a «Buscando…» y no se puede pulsar otra vez; en menos de unos 10 s aparece «No se pudo comprobar ahora. Revisa tu conexión a internet e inténtalo más tarde.» bajo el último resultado, con «Última comprobación: …». El botón vuelve a estar disponible. | ☐ |
| 4.3 | Conecta la red y pulsa otra vez **Buscar actualizaciones**. | Desaparece el error y se actualiza la fecha («Comprobado hoy a las …»). | ☐ |

### 5. Privacidad: una sola petición

Criterio de la spec: F3-A1, F3-A5, F3-A6.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Con el monitor de red activo y la carpeta de datos con `ultima_comprobacion` borrada (o una carpeta nueva), arranca la app y espera 30 s. | Sale **una** petición a `api.github.com` (`/repos/Gomonsoft/shinobi-karaoke/releases?per_page=30`), unos 10 s después de ver la ventana. Ninguna otra conexión es del aviso. | ☐ |
| 5.2 | Cierra y abre la app antes de 24 h. | No hay ninguna petición nueva. | ☐ |
| 5.3 | Desmarca la casilla, cierra, borra `ultima_comprobacion` de `config.json` y abre. | No hay petición. **Buscar actualizaciones** sí hace una. | ☐ |
| 5.4 | Si tu monitor muestra cabeceras (proxy local), revisa la petición. | Solo `User-Agent: ShinobiKaraoke/{versión} (https://github.com/Gomonsoft/shinobi-karaoke)`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28` y las cabeceras técnicas del navegador interno. Sin cookies, sin `Referer`, sin `Authorization`. | ☐ |
| 5.5 | Lee el texto bajo la casilla. | Es legible sin abrir nada más y se lee como parte de la casilla («Como mucho una vez al día, Shinobi Karaoke pregunta a GitHub…»). | ☐ |

### 6. Instalar encima

Criterio de la spec: F3-A17, P22 de la spec 09, P20.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Cierra la app. En **Windows**, ejecuta el instalador B encima de A. | Se instala sin pedir nada más; tus canciones siguen en la Biblioteca y el motor de audio no se vuelve a descargar. | ☐ |
| 6.2 | En **macOS**, abre el `.dmg` y arrastra la app a **Aplicaciones**. | macOS ofrece **Reemplazar** (anota el nombre exacto del botón y si pide algo más, en español de España y de México). Las canciones siguen. | ☐ |
| 6.3 | En **Linux**, instala el `.deb` con `sudo apt install ./…` o sustituye el AppImage por el nuevo. | Las canciones y el motor siguen. | ☐ |
| 6.4 | Abre la versión B (sin esperar). | **Sin punto** en ⚙, sin aviso en Ajustes y la línea dice «Tienes la última versión.» al instante. | ☐ |

### 7. Geometría de la ventana

Criterio de la spec: F3-A9 (punto), F3-P1.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 7.1 | Con el punto activo, en 1280 × 800 y en 1024 × 576, mira el botón ⚙. | El punto (8 px) se ve nítido, no tapa el icono ni se corta, en tema claro y oscuro. | ☐ |
| 7.2 | En Ajustes a 1024 × 576, mira el aviso del principio y el bloque Actualizaciones con una versión nueva y tras **Descargar**. | Nada se desborda en horizontal; los botones y el aviso caben. | ☐ |
| 7.3 | Pon el zoom al 150 % (menú Ver). | Lo mismo que en 7.2. | ☐ |

### 8. Lector de pantalla y teclado

Criterio de la spec: F3-A9, F3-A13, F3-A18.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 8.1 | Con la versión nueva ya detectada y el lector activo, mira la Biblioteca sin abrir Ajustes. | El lector **no anuncia nada** del aviso. El botón ⚙ se lee «Ajustes · hay una versión nueva». | ☐ |
| 8.2 | En Ajustes › Actualizaciones, recorre con Tab. | Orden: **Ver novedades**, **Descargar**, **Buscar actualizaciones**, la casilla. Los dos primeros se leen como «… (se abre en el navegador)». La casilla lee su texto de privacidad como descripción. | ☐ |
| 8.3 | Pulsa **Buscar actualizaciones**. | El lector dice que está buscando y, al terminar, **una sola vez**, «Tienes la última versión.» o «Hay una versión nueva: {versión}.». | ☐ |
| 8.4 | Pulsa **Ver** en el aviso del principio. | El lector lee el título «Actualizaciones» al recibir el foco. | ☐ |

### 9. Compilación de desarrollo

Criterio de la spec: F3-A3.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 9.1 | Instala una compilación del canal de desarrollo y déjala abierta 5 min con el monitor de red. | **Ninguna** petición a `api.github.com` para el aviso. | ☐ |
| 9.2 | Abre Ajustes › Acerca de. | El bloque dice solo «Las compilaciones de desarrollo no buscan versiones nuevas. Las versiones publicadas están en la web del proyecto.». Sin botón, casilla, punto ni aviso. | ☐ |

### 10. Capturas de revisión (F3-A19)

Las capturas no se han tomado. Guárdalas en `docs/ux/revisiones/0.2.2-feature-3/` con el nombre `ajustes-1280x800-100-{estado}.png` y, en tema claro y oscuro si puedes:

| # | Captura | Cómo conseguirla | OK |
|---|---|---|---|
| 10.1 | `actualizaciones-al-dia` | Versión al día, tras una comprobación. | ☐ |
| 10.2 | `actualizaciones-nueva-preliminar` | Con B preliminar. | ☐ |
| 10.3 | `actualizaciones-nueva-estable` | Con B estable. | ☐ |
| 10.4 | `actualizaciones-descargando` | Tras pulsar **Descargar**, con B preliminar (frase de la copia). | ☐ |
| 10.5 | `actualizaciones-error` | Sin red, tras **Buscar actualizaciones**. | ☐ |
| 10.6 | `actualizaciones-desactivado` | Con la casilla desmarcada. | ☐ |
| 10.7 | `actualizaciones-desarrollo` | En una compilación de desarrollo. | ☐ |
| 10.8 | `aviso-principio` | El aviso «Hay una versión nueva: …» al principio de Ajustes. | ☐ |
| 10.9 | `biblioteca-1280x800-100-punto-ajustes` | La Biblioteca con el punto en ⚙. | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
