# 0320 — Paquete hostil: excepción no capturada en la extracción y `ruta_pendiente` que viaja en el paquete

- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no (la 0327 queda «hecha con reservas»)

## Contexto

Verificación de la feature 9 (0327). Probé paquetes `.shinobi` hostiles propios en una carpeta temporal (con `montajeDePrueba.ts`, fuera del repositorio; el guion está en el informe). Los 29 casos de `paqueteHostil.test.ts` pasan; estos tres hallazgos no los cubren.

## Hallazgos

1. **Media · excepción no capturada en el proceso principal con una entrada comprimida cuyo tamaño real supera al declarado** (`app/src/main/copias/importar.ts:292-315`, `extraer`). Hago un paquete con `pistas/voz.flac` comprimida con deflate (40 MB de ceros), bajo el tamaño del directorio central y el `bytes` del manifiesto a 4096. La canción acaba bien como `error: PAQUETE_INCOMPLETO` y no queda nada en `.importando/`, pero Vitest informa de una `Uncaught Exception: too many bytes in the stream. expected 4096. got at least 16384` (origen: `AssertByteCountStream` de `yauzl`). Causa: `abrirLectura` devuelve el flujo y, antes de engancharle el `pipeline` (línea 315), hay un `await mkdir(...)` (línea 307); `yauzl` falla en el primer trozo y emite `error` sin ningún oyente. En la app no hay `process.on('uncaughtException')`, así que Electron mostraría el diálogo de error del proceso principal. Basta con un paquete hecho a propósito. Arreglo: crear la carpeta antes de `abrirLectura`, o enganchar `flujo.on('error', …)` nada más abrirlo. Falta una prueba que cuente excepciones no capturadas (`process.on('uncaughtException')` en el test).
2. **Baja-media · `fuente.ruta_pendiente` viaja dentro de `cancion.json`** (`main/copias/exportar.ts`, `importar.ts`; ninguno la toca). (a) Privacidad: exportar una canción de lote que aún espera su archivo escribe la ruta absoluta del equipo del usuario (con su nombre de usuario) en el paquete. (b) Un `cancion.json` hostil con `ruta_pendiente: "/etc/hosts"` se importa tal cual (comprobado) y `reintentar`/`comprobarOriginal` (`main/fuente/lote.ts:263` y `:527`) intentaría importar esa ruta; está acotado por «es un archivo y no está en los datos», pero la ruta la elige el autor del paquete. Pido borrar `ruta_pendiente` al exportar y al importar.
3. **Baja · un `cancion.json` con `pistas.voz` fuera de la carpeta se importa como «importada»** y la canción queda `danada` (comprobado: `rutaInterna` de `biblioteca/servicio.ts:72` lo protege y no hay lectura fuera). El resultado debería decir error y no dejarla. Y los identificadores `CON`, `NUL`, `AUX`, `COM1`… pasan la expresión `ID_CANCION_PAQUETE` (`formato.ts`): en Windows son nombres de dispositivo (no verificable en este Mac). Pido rechazarlos.

## Pregunta

¿Se corrigen estos tres puntos en una tarea corta (0391, antes del cierre de alpha.3)? Lo único que recomiendo no publicar sin arreglar es el 1.

## Opción provisional tomada (si no bloquea)

Ninguna: no toco código de producción.

## Respuesta
