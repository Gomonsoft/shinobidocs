# 0390 — Feature 7 · Remates: sin rutas en la lectura del lote y parada solo de las separaciones con `RUNTIME_NO_DISPONIBLE`
- Estado: Pendiente
- Paso del pipeline: 1 y 2
- Depende de: 0315, 0384 (hechas)
- ADRs: 0026 (revisión «Origen sin consulta, `musica` nula y sin rutas en la lectura (pregunta 0317)»), 0025 (revisión «Parada por `RUNTIME_NO_DISPONIBLE` según el trabajo (pregunta 0317)»), 0008
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7) y 04-progreso-pipeline.md (cola: paradas). Sin textos nuevos.
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), remate de alpha.3. Lote D (`main/fuente/**`, `main/preparacion/cola.ts`, `vistas/anadir/**`). `shared/ipc.ts` y `preload/index.ts` van con un cambio pequeño acordado.

## Objetivo
Quitar la única ruta que main entregaba al renderer en la lectura del lote, y evitar que un motor de separación ausente pare también descargas e importaciones que pueden seguir.

## Criterios de aceptación
1. [ ] **Sin `ruta` en `filaLoteSchema`**.
   - `fuente.importarArchivo` admite, además de la ruta (que llega del arrastre de hoy), `{ ref }`: main resuelve el `ref` de la lectura del lote (válido 30 min, el mismo de `fuente.lote`) y sigue el flujo de una canción.
   - Un `ref` caducado o desconocido da `ARGUMENTOS_NO_VALIDOS`.
   - «Añadir canción», con una sola fila añadible, llama a `importarArchivo({ ref })`.
   - Se retira `ruta` del esquema y de main.
2. [ ] **Parada por `RUNTIME_NO_DISPONIBLE` según el trabajo** (`main/preparacion/cola.ts`, `registrarFallo`):
   - si el fallo viene de una **separación** (u otro trabajo de la cola `pesada`), solo se paran los trabajos de la cola `pesada`, con un motivo nuevo de la tanda `separacionesParadas: "RUNTIME_NO_DISPONIBLE" | null`. Las descargas, las importaciones de archivo, la búsqueda de letra y lo que no use el motor de separación siguen, y las canciones quedan esperando su separación;
   - si el fallo viene de una **descarga o una importación**, se para toda la cola, como hoy (el motor básico no está);
   - `SIN_ESPACIO` y los tres fallos seguidos siguen parando todo;
   - «Reanudar» o la reparación del motor (spec 04, «Reparar el motor») libera las separaciones paradas.
3. [ ] La interfaz de la cola muestra `separacionesParadas` como hoy muestra `descargasParadas`: misma línea y botón «Reparar el motor». Si la spec 04 no tiene el texto, el diseñador lo añade; hasta entonces, el de la parada total.

## Pruebas de feedback
- Unitarias:
  - `importarArchivo({ ref })` con un `ref` válido, caducado o desconocido;
  - el esquema sin `ruta`;
  - `cola.test.ts`: (a) separación con `RUNTIME_NO_DISPONIBLE` → `separacionesParadas`, y una descarga y una importación pendientes siguen y terminan; (b) descarga con `RUNTIME_NO_DISPONIBLE` → parada total; (c) `SIN_ESPACIO` → parada total; (d) «Reanudar» libera las separaciones.
- E2E: `e2e/importar-lote.spec.ts`, con un solo archivo añadible se importa sin rutas en la respuesta de la lectura. Y el escenario del CI de 80dfa1f (separador no disponible): las descargas del lote terminan y las canciones quedan esperando la separación.
- Críticos: sí (cola y «Añadir canción»).
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
