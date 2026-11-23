# 0257 — Datos que la spec de la feature 9 necesita y los contratos `copias.*` no traen (0.2.2)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (ampliaciones **aditivas y opcionales** aplicadas en `app/src/shared/ipc.ts`; las usa la tarea [0326](../tareas/0326-interfaz-de-copias-paquetes-y-letra.md))

## Contexto

Los canales `copias.*` de la tarea 0339 devuelven lo mínimo (ADR 0027 §6). La spec ([02](../ux/02-biblioteca.md), [08](../ux/08-ajustes-y-acerca.md)) enseña más datos de los que traen, y `copias.importar` no devuelve un `trabajoId` que permita cancelarlo.

## Pregunta

¿Se confirman estas ampliaciones (todas opcionales, un renderer anterior las ignora)?

1. `destinoCopiaIpcSchema`: `existe` (`paq.aviso.existe`) y `estimacion { completoBytes, ligeroBytes }` (`paq.tamano`, ADR 0027 §5: suma de archivos + ~1 %). La calcula `destinoPropuesto`.
2. `resumenPaqueteSchema`: `nombre`, `creado`, `app`, `bytes`, `libreBytes`, `ajustes`, `asignaciones { aplicables, noAplicables, predeterminado }`, `temasSoloLectura` y, por canción, `modificada`, `modificadaLocal`, `igual`, `parecida`, `conAudio`, `bytes`. Para ello el manifiesto lleva por canción `modificada`, `creada`, `album`, `duracion_ms` y `estado` (campos opcionales y tolerantes, aditivos al ADR §1) y un `extras[]` con la comprobación de `temas.json` y `ajustes.json`.
3. `resultadoImportacionSchema`: `idLocal` por canción (distinto del `id` con «Conservar las dos»), `temas { importados, reutilizados }`, `asignaciones { restauradas, noAplicadas }`, `ajustes`.
4. Eventos: `copias:cambio` añade `en_cola`, `tipo` (`exportar`/`importar`) y, en `terminada` de una exportación, `resultado { nombre, bytes, canciones, omitidas, ubicacionId }`; `copias:progreso` añade `cancion { hechas, total, titulo }`. **`importar` no devuelve su `trabajoId`**: el renderer lo toma del primer `copias:cambio` con `tipo: 'importar'` y lo pasa a `copias.cancelar`.
5. «Mostrar en la carpeta» del toast de un paquete o copia: no hay canal en `copias.*`. Se reutiliza `letras.mostrarEnCarpeta({ ubicacionId })` con el `ubicacionId` del `resultado` (misma tabla de ubicaciones en main).
6. Arrastrar un `.shinobi` sobre la ventana: el renderer no conoce rutas. `ServicioCopias.registrarOrigen(ruta)` existe, pero falta el canal o el mecanismo del preload que se la dé a main (queda para la 0326).

## Opción provisional tomada (si no bloquea)

Las seis como están descritas.

## Respuesta

Arquitecto, 2026-11-22. Queda en la revisión de ADR 0027; los cambios, en la tarea nueva [0376](../tareas/0376-remates-de-copias-y-paquetes.md).

1. **`destinoCopiaIpcSchema`** con `existe` y `estimacion { completoBytes, ligeroBytes }`: confirmado.
2. **`resumenPaqueteSchema`** ampliado y los campos opcionales del manifiesto (`modificada`, `creada`, `album`, `duracion_ms` y `estado` por canción; `extras[]` con la comprobación de `temas.json` y `ajustes.json`): confirmado. Son aditivos y tolerantes, así que `version_formato` sigue en 1.
3. **`resultadoImportacionSchema`** con `idLocal`, `temas`, `asignaciones` y `ajustes`: confirmado.
4. **Eventos**: confirmados `en_cola`, `tipo`, `resultado` en `terminada` y `cancion` en el progreso. **Corrijo `copias.importar`**: tomar el id del primer evento es frágil (pueden coincidir dos importaciones o perderse el evento). `copias.importar(…)` devuelve **`{ trabajoId }`** al aceptarse, como `exportarCanciones`, y el resultado por canción llega en `copias:cambio` `terminada` → `resultado` (con la forma de `resultadoImportacionSchema`).
5. **«Mostrar en la carpeta»** con `letras.mostrarEnCarpeta({ ubicacionId })`: confirmado. La tabla de ubicaciones de main es común; el nombre del canal es histórico.
6. **Arrastrar un `.shinobi`**: el renderer no recibe ni envía la ruta. Canal nuevo **`copias.origenDesdeRuta({ ruta })`** → `{ origenId, nombre } | null` (rol principal). Main valida que sea un archivo existente con extensión `.shinobi` y fuera del directorio de datos, y lo registra con `registrarOrigen`. Al renderer **no** se le expone como `invocar` libre: el preload expone `copias.origenDeArchivo(file: File)`, que obtiene la ruta con `webUtils.getPathForFile(file)` y llama al canal. El renderer solo maneja el objeto `File` que el usuario soltó.
