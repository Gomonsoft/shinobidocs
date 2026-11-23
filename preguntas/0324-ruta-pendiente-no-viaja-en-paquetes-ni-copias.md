# 0324 — `fuente.ruta_pendiente` no viaja en paquetes ni copias, y rutas internas validadas al importar

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (opción conservadora aplicada)

## Contexto

Preguntas 0320 (qa) puntos 2 y 3. `fuente.ruta_pendiente` (ruta absoluta del archivo original de una canción de lote aún sin importar) viajaba dentro de `cancion.json`: filtraba una ruta del equipo al exportar y, al importar, dejaba que el autor del paquete eligiera una ruta local que `main/fuente/lote.ts` intentaría leer.

## Aplicado (para fijar en el ADR 0027 §1 y §3)

1. **Exportar** (paquete y copia, `planificarCanciones`): `ruta_pendiente` no se escribe. La canción entra como estaba (borrador con la fuente pendiente), sin ruta; al importarla en otro equipo ofrece «Elegir archivo». La canción local no cambia.
2. **Importar** (`leerCancionJson`): se descarta siempre cualquier `ruta_pendiente` del paquete, antes de escribir.
3. **Rutas internas** de `cancion.json` (`fuente.mezcla`, `fuente.miniatura`, `pistas.voz`, `pistas.instrumental`): deben ser relativas y sin `..`, `\`, unidad ni NUL; si no, esa canción falla con `PAQUETE_INCOMPLETO` (el resto del paquete sigue).
4. **Ids de canción**: `ID_CANCION_PAQUETE` rechaza (sin distinguir mayúsculas, en cualquier sistema) `CON`, `PRN`, `AUX`, `NUL`, `COM0-9` y `LPT0-9`; el paquete entero es `PAQUETE_NO_VALIDO`.
4b. **Extracción**: la carpeta de destino se crea antes de abrir el flujo de lectura, para que un tamaño real mayor que el declarado (error del flujo) falle solo esa canción sin excepción sin capturar.

## Pregunta

¿Se confirma y se anota en el ADR 0027? ¿Mejor `PAQUETE_NO_VALIDO` que `PAQUETE_INCOMPLETO` para el punto 3?

## Respuesta

Arquitecto, 2026-11-23. **Confirmado todo** y anotado en ADR [0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md), revisión «Seguridad de los paquetes, verificación de qa».
- Punto 3: **se mantiene `PAQUETE_INCOMPLETO`** por canción. Las entradas del ZIP son válidas y el problema está dentro de una canción: se trata como un SHA-256 distinto (§3), se pierde esa canción y no el paquete. `PAQUETE_NO_VALIDO` queda para lo que compromete el paquete entero.
- Punto 4b: es regla general para `main/copias/**` y `main/exportacion/**`. No hay ningún `await` entre abrir un flujo y engancharle su manejo de errores.
- Bombas de descompresión: no hace falta un límite de razón de compresión. El tamaño declarado está limitado, la suma declarada se compara con el espacio libre antes de extraer, y al extraer se corta si los bytes reales pasan de los declarados.
- Errores no capturados en main: manejador global que registra y no tumba la app, y que en E2E y Vitest vuelve a lanzar. Tarea [0391](../tareas/0391-manejador-global-de-errores-del-proceso-principal.md).

