# 0296 — «Ajustar los fines…» en canciones Lista y Letra lista: main las omite con YA_LISTA (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

La spec 02 (revisión 2026-11-22) pide «Ajustar los fines…» también en tarjetas **Lista** y **Letra lista** con letra sin marca y líneas sin fin, sin cambiar el estado de la canción. La tarea 0380 (y el ADR 0025) dicen que `aplicaPreparar` devuelve `YA_LISTA` para una canción Lista, y `pasoFines` exige `estado === 'borrador'`. Con eso, `resumen.prepararFinesSinMarca` es `false` en las Listas y `preparar([id], { finesSinMarca: true })` las omitiría. Además la corrida acaba escribiendo `cancion.preparacion` (estado «lista para revisar»), que en una Lista no tiene sentido.

## Pregunta

¿Se amplía main (aplicaPreparar sin el corte de `lista` para `finesSinMarca`, `pasoFines` sin exigir borrador y una corrida que no escriba `preparacion.estado` en una Lista), o se deja la opción solo en borradores y «Lista para revisar»?

## Opción provisional

Conservadora: el ítem solo se ofrece donde main acepta (borradores y «Lista para revisar»). En Lista y Letra lista no aparece. Cuando se decida, la interfaz solo necesita que `prepararFinesSinMarca` sea `true` en el resumen de esas canciones.
