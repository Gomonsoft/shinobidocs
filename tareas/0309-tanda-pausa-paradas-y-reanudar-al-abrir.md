# 0309 — Features 5 y 7 · Tanda, pausa, paradas automáticas y reanudar al abrir
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0308
- ADRs: 0025 §5, 0009
- Spec UX: docs/ux/04-progreso-pipeline.md (0.2.2 · Features 5 y 7), docs/ux/02-biblioteca.md (avisos de reanudación)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
La cola de preparación como conjunto: tanda, pausa persistida, paradas y reanudación.

## Criterios de aceptación
- [x] Tanda en memoria con estimación; `config.preparacion.pausada`; paradas de ADR 0025 §5 con comprobación de conexión cada 60 s.
- [x] Pausa aleatoria de 3 a 8 s entre descargas de YouTube.
- [x] Diario `trabajos/pendientes.json` con `interrupciones`; reanudación tras la comprobación del runtime; evento `preparacion:reanudada`.
- [x] Aviso `tanda` de `ServicioAvisos`.
- [x] Al llegar a `esperando_separacion` (preparar o reanudar), si la fuente está completada, la separación está `pendiente` y no hay trabajo de separación de esa canción en cola ni en curso, la corrida la encola por el camino de siempre (pregunta 0223 §4). Test: una sola separación encolada; ninguna si ya había una.

## Pruebas de feedback
- Unitarias: Gestor y servicio con reloj falso: paradas por código, tres fallos seguidos, reanudar con 0, 1 y 2 interrupciones, runtime dañado.
- E2E: Ampliar `separacion.spec.ts`: cerrar con dos trabajos en cola y ver que se reanudan.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `main/preparacion/cola.ts` (`ColaPreparacion`): la **tanda** en memoria (de cola vacía a cola vacía; una tanda terminada se conserva hasta que empiece otra), con `total`, `terminadas`, resultado por canción en el orden de la cola y `estimacionMin` (suma de `separacion.estimar`; `null` los primeros 15 s). Se alimenta de los eventos del gestor y de las corridas de la preparación (`ServicioPreparacion.suscribirCorridas`). `preparacion.tanda`, `pausar`, `reanudar` y `reintentarFallidas` (cableados en `handlers.ts`, dependencia `colaPreparacion`) y evento `preparacion:tanda`.
- **Pausa**: `config.preparacion.pausada` (la escribe main). El gestor gana `fijarFreno` y `reanudarCola`: un trabajo retenido sigue `en_cola`, los demás de su cola siguen y el que está en curso termina su paso. Las corridas no empiezan ninguna búsqueda mientras `retenida()` (opción `retenida` de `ServicioPreparacion`).
- **Paradas** (ADR 0025 §5): `YOUTUBE_BLOQUEADO` o `SIN_CONEXION` en una descarga paran solo las descargas (`descargasParadas`); con `SIN_CONEXION` se comprueba la conexión cada 60 s (`hayConexion`: `HEAD` a la base de LRCLIB, que en pruebas es el doble) y se reanudan solas; `SIN_ESPACIO`, `RUNTIME_NO_DISPONIBLE` o tres fallos seguidos con el mismo código paran toda la cola (`motivoPausa`, solo en memoria; [Reanudar] la levanta). «Reintentar las fallidas» relanza las reintentables (no `VIDEO_NO_DISPONIBLE`, `FORMATO_NO_SOPORTADO`, etc.) por el camino de siempre y, si la tanda ya había terminado, empieza una nueva con ellas.
- **Pausa entre descargas de YouTube**: `GestorTrabajos` opción `pausaEntreDescargasMs` (main: 3 000 a 8 000 ms aleatorios) entre dos `descargar-youtube`; no antes de la primera.
- **Diario** `<base>/trabajos/pendientes.json` (`main/trabajos/diario.ts`, `DiarioPendientes`, escritura atómica): `{ cancionId, tipo (fuente | separacion | preparacion), orden, interrupciones, enCurso }` (`enCurso` es un campo añadido al contrato del ADR para saber qué suma una interrupción). El gestor da de alta/baja los trabajos y la preparación sus corridas; **se conserva** lo que paró el cierre. Al abrir, `reanudarAlAbrir` (tras crear la ventana y solo con `instalacion.estado === "completa"`, es decir, tras la comprobación del runtime) vuelve a encolar en su orden: lo que estaba en curso suma 1; con 2 no se retoma y queda `interrumpido`. Con la pausa guardada se reanuda en pausa. Emite `preparacion:reanudada { total }` (si la ventana aún carga, al terminar de cargar). `main/index.ts` vacía el diario antes de salir.
- **Avisos**: `ServicioAvisos` no avisa por canción mientras `enTandaDeVarias()` y emite uno solo de tipo `tanda` (`AVISOS.tanda`, destino nuevo `biblioteca`) al vaciarse una tanda de 2 o más. `enTandaDeVarias` de `comprobarLetraGuardada` (0367) ya lee la tanda real. Los **avisos de resultado por canción** de la preparación (`prog.toast.revisar|elige|sinLetra`) no se hacen aquí: son de la 0311 (necesitan el mapeo del toast en el renderer). Contrato del aviso `tanda`: pregunta 0224.
- **Corrección de la pregunta 0223 §4**: al llegar a `esperando_separacion`, con la fuente completada, la separación `pendiente` y sin trabajo `separar` de esa canción en el gestor, `ServicioPreparacion` la encola con `alCompletarFuente` (opción `separacion: { hayTrabajo, encolar }`). Tests: una sola encolada; ninguna con trabajo previo o con la separación no pendiente.
- `controlCierre.pausar` y `before-quit` llaman antes a `ColaPreparacion.alCierre` (la tanda se olvida y las cancelaciones no cuentan) y a `ServicioPreparacion.detenerPorCierre`, y solo después cancelan los trabajos.

**Probar**: `npx vitest run src/main/preparacion src/main/trabajos/gestor.cola.test.ts src/main/avisos src/main/ipc/handlers.test.ts` (tanda, pausa, paradas, reintentar, reanudar con 0/1/2 interrupciones, gestor real + diario cerrando y reabriendo). E2E **escritas, sin ejecutar** en `e2e/separacion.spec.ts`: «cerrar con una separación en curso y otra en cola y reabrir las retoma solas, en orden» y la de cierre existente, ahora con dos cierres seguidos antes de ver «Interrumpido» (el primer cierre ya se retoma solo). Puntos frágiles: que el diálogo de cierre se confirme a tiempo y que `esperarPaso(...,'en_curso')` llegue antes de cerrar.

**Deuda y límites**
- El resumen de una tanda retomada solo cuenta lo retomado (los resultados no se guardan entre reinicios, spec 04).
- Sin conexión en el arranque o con la instalación sin completar no se reanuda hasta el siguiente arranque.
- La estimación suma solo la separación (`separacion.estimar`); no incluye la descarga.
- `cancelar` desde el panel de actividad («Cancelar lo que falta…») usa los canales de siempre; no hay canal nuevo.
- `act.cola.sesion`, `prog.cola.*` y el resto de textos son de la interfaz (0311/0316).

**Defecto del cierre justo tras reanudar (pregunta 0236)**: la solicitud `app:solicitudCierre` se enviaba una sola vez y se perdía si `DialogoCierre` aún no estaba montado; `app.close()` esperaba para siempre. Corregido con el canal `app.solicitudCierrePendiente` (main recuerda la solicitud, el renderer la pregunta al montar el diálogo; `main/cierre.ts` `pendiente()`, `navegacion/DialogoCierre.tsx`) y, en el gestor, comprobación de cancelación antes de lanzar el worker. Tests: `gestor.cola.test.ts` (cerrar un trabajo recién lanzado), `cierre.test.ts`, `DialogoCierre.test.tsx`; la E2E de «cierre con trabajos» cierra ahora sin esperar al progreso (3 de 3).
