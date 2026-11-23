# 0324 — `fuente.ruta_pendiente` no viaja en paquetes ni copias, y rutas internas validadas al importar

- De: programador
- Para: arquitecto
- Estado: Abierta
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
