# 0391 — Manejador global de errores no capturados en el proceso principal
- Estado: Hecha
- Paso del pipeline: transversal
- Depende de: — (puede empezar ya)
- ADRs: 0027 (revisión «Seguridad de los paquetes, verificación de qa»), 0008
- Spec UX: — (sin interfaz nueva)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), remate de alpha.3. Dueño: el lote que sirva la sesión principal; `main/index.ts` va con un cambio pequeño acordado.

## Objetivo
Que un error no capturado en main (como el del flujo de `yauzl` que vio qa en la pregunta 0320) quede registrado en lugar de mostrar el diálogo de error de Electron, y que en las pruebas haga fallar la prueba en lugar de pasar desapercibido.

## Criterios de aceptación
1. [ ] Módulo `main/registro/erroresGlobales.ts` con `instalarErroresGlobales({ registrar, estricto })`, llamado al principio de `main/index.ts`, antes de crear ventanas y servicios:
   - `process.on('unhandledRejection')`: registra en el registro de la app (nivel `error`, mensaje y pila) y sigue;
   - `process.on('uncaughtException')`: registra igual y **sigue**, sin el diálogo de Electron. Es una decisión consciente: los trabajos largos (separación, exportación) viven en el worker o tienen su propio manejo, y tumbar main perdería el diario y las escrituras en curso;
   - el registro no añade datos nuevos del usuario; la pila puede llevar rutas locales, como ya pasa en el registro de hoy.
2. [ ] **Modo estricto**: sin empaquetar y con `SHINOBI_E2E=1`, o en Vitest, el manejador registra y **vuelve a lanzar**, o cuenta el error para que la prueba falle. Así un error de este tipo no se esconde en el CI.
3. [ ] Se instala una sola vez (idempotente) y no se instala en las ventanas ni en el worker.

## Pruebas de feedback
- Unitarias (`erroresGlobales.test.ts`):
  - una promesa rechazada sin `catch` y un `throw` en un `setImmediate` llegan a `registrar` con su pila;
  - en modo no estricto el proceso sigue; en modo estricto se vuelve a lanzar;
  - instalar dos veces no duplica oyentes.
- E2E: Ninguna nueva. Los críticos pasan con el modo estricto activo.
- Críticos: sí.
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
Hecho (2026-11-23): `main/registro/erroresGlobales.ts` (`instalarErroresGlobales`, idempotente, exportado desde `main/registro`), instalado en `main/index.ts` antes de `whenReady` (hasta que existe el registro de archivo, a la consola; después, `registro.escribir('error', …)`). Modo estricto: sin empaquetar y con `SHINOBI_E2E=1` (lo pone `e2e/preparar-electron.ts`) vuelve a lanzar. Test: `erroresGlobales.test.ts` (rechazo, throw asíncrono, modos normal y de prueba, valor que no es Error, una sola instalación).
