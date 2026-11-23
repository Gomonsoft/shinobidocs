# 0376 — Feature 9 · Remates de copias y paquetes (canciones en curso, `importar` con `trabajoId`, arrastrar un `.shinobi`)
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0324, 0325
- ADRs: 0027 (revisión de las preguntas 0255–0258)
- Spec UX: docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 9, «Canciones con trabajos en curso») y docs/ux/02-biblioteca.md (0.2.2 · Feature 9, importar arrastrando)
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 9 (alpha.3). Lote E, con un cambio pequeño acordado en `shared/ipc.ts`, `shared/canales.ts`, `preload/index.ts` y `main/ipc/handlers.ts`. Va antes de la 0326.

## Objetivo
Los cambios de contrato y comportamiento que salieron de las preguntas 0255 y 0257.

## Criterios de aceptación
- [ ] **Canción con trabajo en curso** al exportar un paquete o una copia: entra `cancion.json` (instantánea) y solo los archivos de pasos completados, nunca uno en escritura. Una canción que se está separando entra sin pistas, con `pasos.separacion = "pendiente"` en el `cancion.json` del paquete. El resultado y el diálogo la cuentan para `aj.copia.nota.enCurso`. Ya no se omite con `EN_CURSO`.
- [ ] **`copias.importar(…)`** devuelve `{ trabajoId }` al aceptarse. El resultado por canción llega en `copias:cambio` `terminada` → `resultado` (forma de `resultadoImportacionSchema`). `copias.cancelar({ trabajoId })` cancela una importación.
- [ ] **Arrastrar un `.shinobi`**:
  - canal `copias.origenDesdeRuta({ ruta })` → `{ origenId, nombre } | null` (rol principal); main valida archivo existente, extensión `.shinobi` y fuera del directorio de datos, y llama a `registrarOrigen`;
  - el preload expone solo `copias.origenDeArchivo(file: File)`, que usa `webUtils.getPathForFile(file)` y llama al canal.

## Pruebas de feedback
- Unitarias: servicio de copias con un trabajo de separación en curso (entra sin pistas y se importa como pendiente); `importar` devuelve el id y `cancelar` lo detiene; `origenDesdeRuta` rechaza otra extensión, una carpeta y una ruta dentro del directorio de datos.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
