# 0394 — Fines de la preparación aplazados con el editor abierto (no se pierden ni se dan por hechos)
- Estado: Hecha
- Paso del pipeline: 4 (editor) y transversal (preparación desatendida)
- Depende de: — (puede empezar ya; independiente de 0392 y 0393)
- ADRs: 0025 §2 y su revisión «Elegir sin comprobar… y fines aplazados con el editor abierto» (2026-11-23, punto 2); revisión de la pregunta 0278 (fines con confirmación)
- Spec UX: — (sin interfaz nueva: el editor no cambia; «Preparar» y «Ajustar los fines…» ya existen)
- Tamaño: M
- Versión: 0.2.3, [plan 6](../versiones/0.2.3/plan-6.md), punto 2. Causa de los «0 fines» de la medida en Windows ([incidencias 2026-11-23](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md)).

## Objetivo
Si el paso «Ajustar los fines de línea» de la preparación llega con el editor abierto sobre la canción, hoy se anota `fines: { lineas: 0 }` y ya no se vuelve a ofrecer (`shared/derivados.ts:285, 291, 299`). Con esta tarea los fines se aplazan: se ponen al cerrar el editor si la letra sigue intacta y, si no, quedan disponibles con confirmación. El registro de la app dice qué pasó.

## Criterios de aceptación
1. [ ] **`ServicioLetras.aplicarFinesPreparacion`** (`app/src/main/letras/servicio.ts`):
   - Devuelve `Promise<number | null>`: `null` si no escribe porque el editor tiene abierta la canción (`this.visita?.cancionId === cancionId`); un número (incluido 0) en el resto.
   - Se actualizan la interfaz `aplicarFinesPreparacion` de las dependencias de la preparación y sus dobles de prueba.
2. [ ] **`soloFinesLista`** (camino de las Listas): con `null`, devuelve `{ motivo: 'EDICION_BLOQUEADA' }` en lugar de `{ puestos: 0 }`.
3. [ ] **`pasoFines`** (`app/src/main/preparacion/servicio.ts`):
   - Con `null` **no** escribe `preparacion.fines`. Añade el id a un conjunto en memoria `finesAplazados` y registra en `app.log` `preparacion <id>: fines aplazados (editor abierto)`.
   - Con un número, escribe `fines` como hoy y registra `preparacion <id>: fines puestos=<n>`.
   - La corrida sigue igual hasta `lista_para_revisar`.
4. [ ] **Aviso de cierre del editor**: `ServicioLetras` gana `alLiberarEdicion(cb: (cancionId: string) => void): () => void`.
   - Se llama cuando una visita existente se libera por cualquier camino: `cerrarEdicion`, `liberarEdicion`, `invalidarEdicionDe` o `abrirEdicion` sobre otra canción.
   - Se llama después de dejar `visita = null`, con el id de la canción de la visita liberada.
   - `ServicioPreparacion` se suscribe al montarse en `main/index.ts` y se da de baja en `cerrar()`.
5. [ ] **Fines aplazados al cerrar** (`ServicioPreparacion`):
   - Si el id está en `finesAplazados`, lo saca del conjunto y, sin corrida en curso para esa canción, pone los fines solo si se cumple todo: la canción existe y está en `borrador`; `preparacion.estado === 'lista_para_revisar'`; no hay `preparacion.fines`; `letra.intacta === true`; `!edicionBloqueada()`; y hay nivel base de picos (`picos.nivelBase`, sin generarlo).
   - Calcula la propuesta prudente igual que `pasoFines` (`proponerAjusteSilenciosSinSolapes` con `soloFinesAutomaticos`, `activarComodin: false`, `origenFin: 'preparacion'`, `ESPERA_LEGADA`) y llama a `aplicarFinesPreparacion`.
   - Con un número, escribe en el registro `fines: { metodo: 'silencios', lineas: n }` y las dudosas de `contarDudosas` (`dudosas`, `dudosas_importantes`), sin cambiar `estado`, `paso` ni `revisada`. Registra `preparacion <id>: fines aplazados puestos=<n>`.
   - Con `null` (el editor se volvió a abrir), el id vuelve al conjunto.
   - Si no se cumple alguna condición, no hace nada ni escribe nada. Como no hay `fines`, «Preparar» y «Ajustar los fines…» siguen ofreciendo el paso, con confirmación si la letra ya no es `intacta`, como hoy.
   - Los errores se registran y no se propagan (no tumban `cerrarEdicion`).
6. [ ] `enReposo()` espera también estos trabajos de fines aplazados, para que las pruebas y el cierre de la app no los corten a medias.

## Pruebas de feedback
- Unitarias (`main/preparacion/servicio.test.ts`). El editor abierto se simula con `letras.abrirEdicion(id)`, no con `edicionBloqueada`:
  - **reproduce el fallo**: la preparación no elige (candidato sin fines), el usuario guarda la letra (`letras.guardar`), abre el editor y llama a `preparar([id])`. Queda `lista_para_revisar` **sin** `fines` y sin ninguna línea `origen_fin: 'preparacion'`, y `previsualizar([id])` sigue ofreciendo `ajustando_fines`;
  - al `cerrarEdicion` sin tocar tiempos, se ponen los fines (las mismas líneas que pondría la corrida sin editor), `fines.lineas` es ese número, `dudosas` se recalcula y `estado` y `revisada` no cambian;
  - si con el editor abierto se cambia un tiempo (`guardarTiempos`, la letra pierde `intacta`), al cerrar no se pone ningún fin y `previsualizar` ofrece `ajustando_fines` con `confirmar: 'finesSinMarca'`;
  - sin editor abierto, el comportamiento de hoy: `fines.lineas` con lo puesto, y la línea `fines puestos=<n>` en el registro (doble de `registrar`).
- Unitarias (`main/letras/servicio*.test.ts`): `aplicarFinesPreparacion` devuelve `null` con la visita abierta y 0 si no hay nada que poner. `alLiberarEdicion` se llama una vez por cada visita liberada en los cuatro caminos, y nunca si no había visita.
- La prueba existente «con el editor abierto sobre la canción no escribe» de «Lista o Letra lista» (que usa la sesión en vivo) sigue pasando; se añade una con la visita abierta que espera `EDICION_BLOQUEADA`.
- E2E: ninguna.
- Críticos: no.
- Manual: guía de la feature 5 de 0.2.2, caso 1. Elegir la letra, pasar al editor enseguida y mirar `app.log`: debe salir `fines aplazados` y, al salir del editor sin tocar tiempos, `fines aplazados puestos=N`.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- `main/letras/servicio.ts`: `aplicarFinesPreparacion` devuelve `number | null` (`null` con la visita abierta, comprobado antes de leer); `alLiberarEdicion(cb)` avisa tras dejar `visita = null` en `cerrarEdicion`, `liberarEdicion`, `invalidarEdicionDe` y `abrirEdicion` (en este último, con la visita nueva ya puesta, para que el oyente no escriba bajo ella).
- `main/preparacion/servicio.ts`: `finesAplazados`, `pasoFines` con `null` (no escribe `fines`, registra «fines aplazados (editor abierto)»), `alLiberarEdicion`/`ponerFinesAplazados` con todas las condiciones del criterio 5 (reintenta si el editor vuelve a abrirse), `soloFinesLista` con `EDICION_BLOQUEADA`, `enReposo` los espera (van en `listas`). La suscripción se hace en el constructor a través de `deps.letras.alLiberarEdicion` (opcional), así que `main/index.ts` no cambia; se da de baja en `cerrar()`.
- Pruebas: `preparacion/servicio.test.ts` («fines aplazados con el editor abierto», 5 casos + visita abierta en Listas) y `letras/servicio.lrclib.test.ts` (null/0 y los cuatro caminos del aviso).
- Sin E2E. Manual: guía de la feature 5 de 0.2.2, caso 1 (mirar `app.log`).
