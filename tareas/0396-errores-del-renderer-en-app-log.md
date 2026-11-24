# 0396 — I-1 · Los errores de la interfaz llegan a `app.log`
- Estado: Hecha
- Paso del pipeline: transversal
- Depende de: 0391
- ADRs: 0008 (canales IPC tipados y validados), 0027
- Spec UX: [00 · Pantalla de error de la interfaz](../ux/00-mapa-de-vistas.md#pantalla-de-error-de-la-interfaz) (criterio ERR-6)
- Tamaño: S
- Versión: 0.2.3 ([plan 6](../versiones/0.2.3/plan-6.md), punto 1a; incidencia [I-1](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md))

## Objetivo
Que un error de la interfaz deje rastro en `app.log` con su pila y con contexto (vista e id de la canción), sin llenar el disco ni registrar letras.

## Criterios de aceptación
1. [x] Canal `app:registrarError` (rol principal): contrato en `shared/ipc.ts` (`errorRendererSchema`: origen `onerror|promesa|react|consola`, mensaje ≤ 500, pila y pila de componentes ≤ 3000, vista ≤ 40, id de canción ≤ 80), preload y manejador; `CANALES.app.registrarError`.
2. [x] Renderer (`soporte/erroresInterfaz.ts`): `window.onerror` y `unhandledrejection` (instalados al principio de `main.tsx`), y el límite de React (0397). Cada envío lleva la vista y el id de la canción (los fija `App.tsx`). Un mismo error seguido se manda una vez y como mucho 30 por carga.
3. [x] Main (`main/registro/erroresRenderer.ts`): límite de 10 líneas por minuto y 200 por sesión (lo omitido se anota una vez: «se omitieron N errores por límite de frecuencia»); una línea por error. Desde el `webContents` de la ventana principal y de la secundaria: `render-process-gone`, `unresponsive`/`responsive`, `preload-error` y `console-message` de nivel `error`.
4. [x] Sin letras: solo mensaje y pila del error, la vista y el id de la canción.

## Pruebas de feedback
- `erroresRenderer.test.ts` (formato de la línea, límite por ventana y por sesión, contrato, eventos del `webContents`) y `erroresInterfaz.test.ts` (recorte, bucle, `onerror`/rechazos).
- E2E: `error-interfaz.spec.ts` comprueba la línea real en `app.log`.

## Notas de implementación
Línea de ejemplo (ver `error-interfaz.spec.ts`):
`2026-11-23T22:31:48.779Z [ERROR] [renderer] react: Error: Error de dibujo forzado por la prueba | vista=cancion/editor cancion=5eed… | pila: Error: … ⏎ at … | componentes: ⏎ at ProvocadorDeError ⏎ at LimiteErrores …`
Archivos: `shared/canales.ts`, `shared/ipc.ts`, `preload/index.ts`, `main/ipc/handlers.ts`, `main/index.ts`, `main/registro/erroresRenderer.ts`, `renderer/src/soporte/erroresInterfaz.ts`, `renderer/src/main.tsx`, `renderer/src/App.tsx`.
Deuda: la ventana secundaria no tiene canal propio (su API está acotada, ADR 0017): sus errores llegan por `console-message`. La ventana de exportación no tiene límite propio (ver pregunta 0399).
