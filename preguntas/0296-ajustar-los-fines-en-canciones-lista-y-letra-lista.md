# 0296 — «Ajustar los fines…» en canciones Lista y Letra lista: main las omite con YA_LISTA (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto

La spec 02 (revisión 2026-11-22) pide «Ajustar los fines…» también en tarjetas **Lista** y **Letra lista** con letra sin marca y líneas sin fin, sin cambiar el estado de la canción. La tarea 0380 (y el ADR 0025) dicen que `aplicaPreparar` devuelve `YA_LISTA` para una canción Lista, y `pasoFines` exige `estado === 'borrador'`. Con eso, `resumen.prepararFinesSinMarca` es `false` en las Listas y `preparar([id], { finesSinMarca: true })` las omitiría. Además la corrida acaba escribiendo `cancion.preparacion` (estado «lista para revisar»), que en una Lista no tiene sentido.

## Pregunta

¿Se amplía main (aplicaPreparar sin el corte de `lista` para `finesSinMarca`, `pasoFines` sin exigir borrador y una corrida que no escriba `preparacion.estado` en una Lista), o se deja la opción solo en borradores y «Lista para revisar»?

## Opción provisional

Conservadora: el ítem solo se ofrece donde main acepta (borradores y «Lista para revisar»). En Lista y Letra lista no aparece. Cuando se decida, la interfaz solo necesita que `prepararFinesSinMarca` sea `true` en el resumen de esas canciones.

## Respuesta

Arquitecto, 2026-11-22. **Sí, se amplía a Lista y Letra lista, solo para los fines y sin cambiar su estado.** Son las canciones que más lo necesitan: 14 de 18, marcadas en el MVP sin revisar y casi sin fines. La operación ya es prudente: confirmación explícita, solo líneas con fin automático y nunca inicios, fines fijados, palabras ni `offset_ms`.

**Salvaguardas** (ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), revisión de esta pregunta):
- siempre con la confirmación `bib.prep.fines.dialogo`;
- con una sesión en vivo se omite **al momento** con `EDICION_BLOQUEADA`, sin esperar (en una Lista no hay prisa y no debe cambiar mientras se canta), y con el editor abierto sobre la canción no escribe;
- solo una vez: si alguna línea ya tiene `origen_fin: "preparacion"`, no se ofrece;
- no escribe `cancion.preparacion`, no cambia `estado`, no busca ni separa nada (sin picos se omite) y no consulta la red;
- reversible sin registro: «Quitar esos fines» del editor aparece por las líneas con `origen_fin: "preparacion"`, no por `preparacion.fines`.

**Cambios de código**: tarea [0386](../tareas/0386-ajustar-los-fines-en-canciones-lista-sin-cambiar-su-estado.md). Son `aplicaPreparar` para Listas (y por tanto `prepararFinesSinMarca`), el camino «solo fines» de la corrida para una Lista y la condición del botón «Quitar esos fines» en el editor.

**Para el diseñador**: un texto para «no encontramos dónde poner fines» (0 fines puestos), si la spec no lo tiene.
