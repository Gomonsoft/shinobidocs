# 0377 — Features 5 y 11 · Recuento de revisión sin registro, sonda de conexión sin LRCLIB y notificación de una preparación
- Estado: Hecha
- Paso del pipeline: 3 (transversal)
- Depende de: 0309, 0310, 0334, 0336
- ADRs: 0024 (revisión de la pregunta 0241), 0025 §5 (revisión de la pregunta 0243), 0005, 0007/0011 (avisos y notificaciones)
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 11, F11-B1 y F11-B3) y docs/ux/04-progreso-pipeline.md (§3 «notificaciones» y 0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), features 5 y 11 (alpha.2). Lote D, con un cambio pequeño acordado en `shared/ipc.ts`, `shared/canales.ts`, `preload/index.ts` y `main/ipc/handlers.ts`.

## Objetivo
Corregir los defectos D1 (media), D5 (baja, privacidad) y D6 (baja) de las verificaciones de las features 5 y 11.

## Criterios de aceptación
**D1 · Recuento de revisión para toda «Lista para revisar»** (pregunta 0241)
- [ ] Main mantiene en memoria, por canción, `revision: { dudosas, dudosasImportantes }` calculado con `contarDudosasGuardadas` para toda canción que derive «Lista para revisar», tenga o no `preparacion`.
  - Se calcula en segundo plano tras el arranque (en serie, después de la comprobación del runtime), al quedar listos los picos y tras cada escritura de la letra.
  - Se invalida con `modificada` o con los picos.
  - Nunca escribe en `cancion.json` ni crea un registro `preparacion`.
- [ ] `ResumenCancionIpc` gana `revision: { dudosas, dudosasImportantes } | null` (`null` = sin calcular o sin picos); `main/biblioteca/resumen.ts` lo rellena con el valor en memoria o, si aún no lo hay, con `preparacion.dudosas`.
- [ ] Canal `biblioteca.recuentoRevision(id)` → `{ dudosas, dudosasImportantes } | null` (rol principal), que calcula al momento.
- [ ] Renderer:
  - `TarjetaCancion` muestra «⚑ n líneas por revisar» o «Sin líneas dudosas» con `resumen.revision` (sin exigir `resumen.preparacion`);
  - `useMarcarRevision` usa `resumen.revision` y, si es `null`, pide `recuentoRevision` antes de decidir.

**D5 · Sonda de conexión sin LRCLIB** (pregunta 0243)
- [ ] `main/preparacion/cola.ts`, `vigilarConexion`: cada 60 s reintenta **solo la primera** descarga parada por `SIN_CONEXION` (con `reintentarDescarga`). Si termina bien o falla por otro motivo, se liberan las demás; si vuelve a fallar con `SIN_CONEXION`, se reprograma.
- [ ] Se retiran `hayConexion` de las dependencias de la cola y su implementación con `HEAD` a LRCLIB en `main/index.ts`. Ninguna parte de la app usa LRCLIB como sonda.

**D6 · Notificación del sistema al terminar una preparación individual**
- [ ] `main/avisos/servicio.ts`: el aviso de una preparación de una sola canción (no tanda) usa el camino de notificación de siempre con la ventana sin foco (Windows/Linux: notificación y parpadeo; macOS: rebote del Dock e insignia), como pide la spec 04 §3. Dentro de una tanda de 2 o más, ninguna por canción (solo la de `tanda`).

## Pruebas de feedback
- Unitarias:
  - D1: servicio del recuento (canción sin registro con picos → recuento; invalidación al escribir la letra; sin escritura en disco), resumen con `revision`, `TarjetaCancion` y `useMarcarRevision` con `revision` nulo y lleno.
  - D5: `cola.test.ts` con reloj falso: con `SIN_CONEXION` se reintenta una descarga a los 60 s; las demás siguen paradas hasta que esa termina; ninguna llamada a `hayConexion`.
  - D6: `servicio.test.ts` de avisos: preparación individual sin foco → notificación; dentro de una tanda → ninguna.
- E2E: la de qa (interruptor apagado + descarga con error de red) cuenta **0** peticiones al doble de LRCLIB y ve el reintento de la descarga; ampliar `biblioteca*.spec.ts` con una «Lista para revisar» sin registro que muestra la línea ⚑ y pregunta al marcar.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

**D1 · Recuento en memoria.** `main/biblioteca/recuentoRevision.ts` (`RecuentoRevision`): calcula en serie y en segundo plano, con `contarDudosasGuardadas`, el recuento de toda canción que deriva «Lista para revisar» (con o sin `preparacion`); se invalida con `modificada` (cada escritura de la letra, por el evento de la biblioteca) y con los picos (`recalcular` desde `alListos` de `ServicioPicos`); nunca escribe en disco. Arranca en `main/index.ts` justo tras crear el servicio de preparación (después de la comprobación del runtime). Cuando un cálculo cambia lo conocido, `registrarIpc` emite un evento `cancion` con el resumen nuevo. `ResumenCancionIpc.revision` (`shared/ipc.ts`, opcional y anulable): `revisionDeResumen` (`main/biblioteca/resumen.ts`) usa el valor en memoria o, si no lo hay, `preparacion.dudosas`. Canal `biblioteca.recuentoRevision(id)` (`shared/canales.ts`, `preload`, `handlers.ts`) que calcula al momento. Renderer: `TarjetaCancion`, `tarjeta.ts` (nombre accesible) y `useMarcarRevision` usan `resumen.revision`; con `null` piden `recuentoRevision` antes de decidir; el diálogo pregunta por las «importantes» como el editor. `useMarcarRevision` también lo usa ahora la vista de progreso (pregunta 0242 D3).

**D5 · Sonda sin LRCLIB.** `main/preparacion/cola.ts`: cada 60 s `vigilarConexion` reintenta solo la primera descarga parada por `SIN_CONEXION` (`reintentarDescarga`); el freno deja pasar solo a esa; si termina bien o la cancelan o falla por otro motivo, se liberan las demás; si vuelve a fallar con `SIN_CONEXION`, se reprograma; si ya no se puede reintentar (canción eliminada), pasa a la siguiente. Se retiran `hayConexion` y su `HEAD` en `main/index.ts`. Prueba de aceptación: `e2e/importar-youtube.spec.ts` («sin conexión con el interruptor apagado…», 2,3 min porque incluye los 3 reintentos propios de la descarga, 5 + 15 + 45 s, antes de la parada): 0 peticiones al doble de LRCLIB y la descarga termina tras el reintento. Fixture nueva `e2e/fixtures/youtube/Red_Siem_01.json`.

**D6 · Notificación.** `ServicioAvisos.alCambiarCancion` (`main/avisos/servicio.ts`), alimentado por la suscripción a la biblioteca en `main/index.ts`: al pasar «Preparando» a revisar / elige / sin letra, notificación del sistema con la ventana sin foco (mismo texto que el toast, `AVISOS.preparacion` en `shared/avisos.ts`, compartido con el renderer); nada dentro de una tanda de 2 o más.

**Pruebas.** `recuentoRevision.test.ts`, `cola.test.ts` (reloj falso, 2 pruebas), `servicio.test.ts` de avisos, `Biblioteca.preparacion.test.tsx` (sin registro, `revision` nulo y lleno), `e2e/biblioteca.spec.ts` (sin registro: línea ⚑ y `cancion.json` intacto).

**Deuda / a mano.** La notificación del sistema real (macOS Dock, Windows/Linux) solo se verifica a mano: terminar una preparación individual con la ventana en segundo plano.
