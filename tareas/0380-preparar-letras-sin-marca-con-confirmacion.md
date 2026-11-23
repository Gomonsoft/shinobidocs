# 0380 — Feature 5 · «Preparar» pone fines a las letras sin `intacta` tras confirmación (main y contrato)
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0308 (hecha). Puede empezar ya. La interfaz va en la 0382.
- ADRs: 0025 (revisión «Elección con el veredicto prudente y "Preparar" sobre letras sin marca»), 0024 §4 (`origen_fin`)
- Spec UX: — en esta tarea (contrato y main). La confirmación la define el diseñador en `docs/ux/02-biblioteca.md` (tarea 0382).
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5. Lote D (`shared/derivados.ts`, `main/preparacion/**`, `main/trabajos/diario.ts`, `main/biblioteca/resumen.ts`). Comunes, en un cambio pequeño serializado por la sesión principal: `shared/ipc.ts`, `preload/index.ts` y `main/ipc/handlers.ts`.

## Objetivo

Que «Preparar» sirva para las letras del MVP y de 0.2.1 (pregunta 0278) sin tratar como intacta una letra que el usuario pudo editar. Con su confirmación explícita, solo pone fin a las líneas que no lo tienen; nunca mueve un inicio ni corrige el desfase.

## Criterios de aceptación

- [ ] `aplicaPreparar(cancion)` (`shared/derivados.ts`, hoy líneas 266–285): si la letra **no** es `intacta`, la canción es borrador, hay alguna línea con inicio y `fin_ms: null` y no hay `preparacion.fines`, devuelve `{ aplica: true, pasos: ['ajustando_fines'], confirmar: 'finesSinMarca' }`. Con `intacta`, todo sigue igual y sin `confirmar`.
  - `AplicaPreparar` gana `confirmar?: 'finesSinMarca'`.
  - Letra sin ninguna línea con inicio: `NADA_QUE_HACER`, como hoy.
  - Lista: `YA_LISTA`, como hoy.
- [ ] `previsualizarPreparacionSchema` gana `confirmar: z.enum(['finesSinMarca']).optional()` por canción, y `plan()` lo copia.
- [ ] `preparacion.preparar` admite un segundo argumento opcional `{ finesSinMarca?: boolean }` (`z.strictObject`, tolerante si falta). Sin él, una canción con `confirmar` se omite con `NADA_QUE_HACER`. Con él, se acepta. La firma de `window.shinobi.preparacion.preparar(ids, opciones?)` cambia igual en preload.
- [ ] `Corrida` gana `finesSinMarca: boolean`. `pasoFines` (`main/preparacion/servicio.ts`, hoy línea 592) pasa de `letra.intacta !== true` a `letra.intacta !== true && !c.finesSinMarca`. Lo demás no cambia: misma variante prudente, `origenFin: 'preparacion'`, no escribe con el editor abierto (`aplicarFinesPreparacion`) y el recuento de dudosas al final.
- [ ] El paso `comprobando` sobre una letra existente sigue llamando a `comprobar`. Ese no corrige sin `intacta` (`corregirDesfaseDiferido`): **no se toca**. Un test lo fija.
- [ ] Diario (`main/trabajos/diario.ts`): cada entrada de preparación guarda `finesSinMarca` (`z.boolean().catch(false)`), y la reanudación al abrir lo pasa a la corrida.
- [ ] Resumen de la Biblioteca (`main/biblioteca/resumen.ts` y su esquema IPC): `prepararFinesSinMarca: boolean`, calculado con `aplicaPreparar` (`confirmar === 'finesSinMarca'`), para que la tarjeta sepa sin leer la letra si puede ofrecerlo. Lectura tolerante (`false`).

## Pruebas de feedback

- Unitarias:
  - `derivados.test.ts`: letra sin `intacta` con fines nulos → `ajustando_fines` + `confirmar`. Con `intacta` → los pasos de siempre sin `confirmar`. Sin fines nulos → `NADA_QUE_HACER`. Con `preparacion.fines` → `NADA_QUE_HACER`. Lista → `YA_LISTA`.
  - `servicio.test.ts` de la preparación, con picos falsos con silencios claros:
    - (a) `preparar([id])` sin opción omite con `NADA_QUE_HACER` y no escribe nada.
    - (b) con `{ finesSinMarca: true }` pone fines **solo** en líneas con `fin_ms: null`, con `origen_fin: 'preparacion'`. Ningún `inicio_ms`, `fin_ms` previo, `palabras` ni `offset_ms` cambia (comparación exacta con la letra previa).
    - (c) una letra sin `intacta` y desplazada 0,8 s **no** se corrige.
    - (d) con el editor abierto sobre la canción no escribe.
    - (e) la reanudación desde el diario conserva `finesSinMarca`.
  - `diario.test.ts`: lectura tolerante del campo nuevo.
- E2E: `e2e/preparacion.spec.ts`, una prueba: una canción sembrada con letra LRC sin `intacta` y con fines nulos, sobre voz sintética con silencios. `previsualizar` da `confirmar`; `preparar(ids, { finesSinMarca: true })` deja `origen_fin: "preparacion"` en el archivo sin cambiar inicios.
- Críticos: sí (toca `main/` y la preparación).
- Manual: guía de la feature 5, caso de los borradores del MVP (qa).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

(las rellena el programador al terminar)
