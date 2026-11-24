# 0397 — I-1 · Límite de errores de React y pantalla de error de la interfaz
- Estado: Hecha
- Paso del pipeline: transversal
- Depende de: 0396
- ADRs: 0007
- Spec UX: [00 · Pantalla de error de la interfaz](../ux/00-mapa-de-vistas.md#pantalla-de-error-de-la-interfaz) (ERR-1 a ERR-8) y pregunta 0389
- Tamaño: M
- Versión: 0.2.3 ([plan 6](../versiones/0.2.3/plan-6.md), punto 1a)

## Objetivo
Que un fallo al dibujar no deje la ventana en negro: pantalla de error con salida, sin perder el trabajo del editor.

## Criterios de aceptación
1. [x] `navegacion/LimiteErrores.tsx` (clase con `getDerivedStateFromError`/`componentDidCatch`) y `PantallaError.tsx` con las variantes V (área de contenido, dentro de `Marco`, con la barra viva; se reinicia al cambiar la vista), G (toda la ventana, `main.tsx`), R (capa del reproductor) y P (ventana secundaria: solo `err.publico`).
2. [x] «Volver a cargar esta pantalla» vuelve a montar la vista sin recargar la ventana; si falla otra vez en menos de 10 s, `err.vista.repetido` y el primario pasa a «Ir a la Biblioteca». G recarga la ventana. R: «Salir del reproductor (Esc)». «Copiar detalles» con la línea `Versión:`; plegable de detalles (recordado en la sesión).
3. [x] Trabajo del editor (`soporte/salvamento.ts`): al fallar, el límite inicia el salvamento durante el dibujo (antes de las limpiezas de React); `useGuardadoEditor` registra un salvador que envía el lote pendiente con la sesión de edición vigente y retrasa `destruir()`; `Editor` retrasa `cerrarEdicion` hasta terminar. La pantalla muestra «guardando» / «guardado» / «no guardado» y siempre la pérdida del historial.
4. [x] Gancho de prueba: `info.pruebas` (solo `SHINOBI_E2E=1` y sin empaquetar) habilita el evento `shinobi:e2e-romper`, que hace lanzar a `ProvocadorDeError`.
5. [ ] Fuera de esta tarea (pregunta 0399): botón «Abrir la carpeta de registros» (necesita una llamada nueva a main; omitido como permite la spec) y límite en la ventana de exportación.

## Pruebas de feedback
- `LimiteErrores.test.tsx`, `useGuardadoEditor.fallo.test.tsx` (ERR-5: el lote pendiente se envía), E2E `error-interfaz.spec.ts` (ERR-1, 3, 4, 5 y 6 en la app real).

## Notas de implementación
Hallazgo de orden: React ejecuta las limpiezas de la vista caída en el mismo turno del `componentDidCatch`, y `Promise.resolve().then(...)` correría después de ellas con la sesión ya cerrada (el primer E2E no guardaba). El salvamento se lanza en `getDerivedStateFromError` y llama a los salvadores de forma síncrona.
Archivos: `renderer/src/navegacion/{LimiteErrores,PantallaError,textosError}.ts*`, `pantallaError.module.css`, `renderer/src/soporte/{salvamento,ProvocadorDeError}.ts*`, `App.tsx`, `main.tsx`, `navegacion/reproductor.tsx`, `secundaria/main.tsx`, `vistas/editor/{Editor,useGuardadoEditor}.tsx`.
