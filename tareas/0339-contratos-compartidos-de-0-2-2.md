# 0339 — Contratos compartidos de 0.2.2 (IPC, canales, preload, configuración, errores y dobles)
- Estado: Hecha
- Paso del pipeline: 0–6 (transversal)
- Depende de: —
- ADRs: 0022, 0023, 0024, 0025, 0026, 0027, 0028, 0008, 0006
- Spec UX: — (las preguntas 0153, 0156 y 0157 resumen lo que necesita cada spec)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)). **Es la primera tarea de la versión**: varias features trabajan a la vez en el mismo árbol y estos archivos solo pueden tener un dueño.

## Objetivo
Dejar declarados de una vez los tipos, nombres de canal, códigos de error y campos de configuración nuevos de las once features, para que cada lote trabaje después en sus propios archivos sin tocar los contratos comunes a la vez.

## Criterios de aceptación
- [ ] `shared/canales.ts` y `shared/ipc.ts`: todos los canales y eventos nuevos de los ADR 0022–0028 (`actualizaciones.*`, `preparacion.*`, `letras.candidatoPorId`, `letras.exportarLrc*` y `letras.mostrarEnCarpeta`, `fuente.lote` y lecturas del lote, `biblioteca.valoresDatos`, `biblioteca.editarDatosVarias.*`, `biblioteca.eliminarVarias.*`, `cola.agregarVarias`/`quitarVarias`, `exportacion.destinoCarpeta`/`iniciarLote`/`cancelarLote`/`reintentarLote`, `copias.*`, `alineacion.*` y el evento `alineacion:resultado`; nombres y formas según la respuesta a la pregunta 0166), con sus esquemas Zod de argumentos y su rol en `ROLES_POR_CANAL` (todos de la principal).
- [ ] `preload/index.ts`: los métodos correspondientes en `window.shinobi`.
- [ ] `main/index.ts` / `main/ipc/handlers.ts`: cada canal nuevo registrado con un manejador que responde `ERROR_INTERNO` «no implementado» hasta que su tarea lo sustituya (así ninguna tarea posterior tiene que tocar el registro, solo su servicio).
- [ ] `shared/errores.ts`: códigos nuevos (`LISTA_NO_DISPONIBLE`, `ARCHIVO_NO_ENCONTRADO`, `NADA_QUE_HACER`, `YA_EN_COLA`, `YA_EXISTE`, `CONFIRMACION_OBSOLETA` si no existe, `PAQUETE_NO_VALIDO`, `PAQUETE_VERSION_NUEVA`, `PAQUETE_INCOMPLETO`, `CANCION_MAS_NUEVA`, `EN_CURSO`, `ALINEACION_NO_DISPONIBLE`, `IDIOMA_NO_ADMITIDO`). El texto nuevo de `URL_NO_SOPORTADA` lo cambia la tarea 0315 (pregunta 0166 §6).
- [ ] `shared/config.ts`: `reproductor.subrayar_cantado`, `actualizaciones`, `preparacion { automatica, pausada }`, `aviso_youtube_listas_aceptado`, `copias.ultima` y `alineacion.modelos_descargados`, con lectura tolerante por campo; los escribibles por el renderer en `configParcialRendererSchema`.
- [ ] Dobles: `vistas/*/fixturesApi.ts` con los métodos nuevos (respuestas vacías o «no implementado»).
- [ ] Ningún comportamiento visible cambia.

## Pruebas de feedback
- Unitarias: `config.test.ts` (tolerancia de cada campo), `ipc` (esquemas de argumentos rechazan lo inválido), roles por canal.
- E2E: ninguna nueva; `ipc.spec.ts` sigue pasando.
- Críticos: sí.
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- **Hecho**: canales, roles, esquemas Zod, tipos de `ApiShinobi`, preload, manejadores «No implementado.» (`ERROR_INTERNO`, tras validar argumentos y rol principal), códigos de error, campos de configuración y dobles. Ningún comportamiento visible cambia.
- **Archivos**: `app/src/shared/{canales,ipc,errores,config}.ts`, `app/src/preload/index.ts`, `app/src/main/ipc/handlers.ts` (lista `CANALES_NO_IMPLEMENTADOS`: cada tarea saca su canal de ahí y añade su manejador), `app/src/renderer/src/vistas/apiNuevaFalsa.ts` (usado por los tres `fixturesApi.ts`), tests `shared/ipc022.test.ts`, `shared/config.test.ts`, `main/ipc/handlers.test.ts`, `e2e/ipc.spec.ts` (claves de `window.shinobi`).
- **Preguntas**: [0166](../preguntas/0166-contratos-ipc-de-0-2-2-que-los-adr-no-fijan.md): nombres `alineacion.*`, lecturas del lote, formas de respuesta, destino de `.lrc`.
- **Deuda**: el texto nuevo de `URL_NO_SOPORTADA` NO se cambió (sería falso hasta el modo lote, 0315). `LISTA_NO_DISPONIBLE` y `ARCHIVO_NO_ENCONTRADO` van como solo-main. Evento `letras:encaje` y `preparacion:cambio` con carga `unknown` a fijar por 0296/0306.
- **Probar**: `npm run typecheck`, `lint`, `format:check`, `test:cambios`, `test:e2e:criticos`.
