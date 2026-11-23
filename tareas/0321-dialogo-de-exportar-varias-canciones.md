# 0321 — Feature 8 · Diálogo y actividad de «Exportar varias canciones»
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0319, 0320
- ADRs: 0026 §5
- Spec UX: docs/ux/10-exportacion.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Diálogo con carpeta, fila única en actividad y resultado.

## Criterios de aceptación
- [ ] Criterios de la spec 10 · Feature 8.
- [ ] Al abrir el diálogo, la carpeta viene ya rellena con `exportacion.destinoCarpeta()` (sin diálogo del sistema). [Cambiar…] llama a `destinoCarpeta({ desdeCarpetaId })`; si devuelve `null`, se conserva la anterior. Con `libreBytes: null` no se muestra el aviso de espacio previo (ADR 0026, revisión de la pregunta 0290).
- [ ] Una canción del lote con `resultado: 'cancelada'` **y** `error` se pinta como «no intentada» (`exp.lote.fila.noIntentada`) con su motivo, y entra en [Reintentar]. Una `cancelada` sin `error` (la canceló el usuario) no entra.

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: Ampliar `exportacion.spec.ts`: 2 canciones a 640 × 480 a una carpeta temporal.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Qué se hizo.** Diálogo de lote (G, H, I de la spec 10): `exportacion.destinoCarpeta()` sin argumento al abrir (carpeta ya rellena; [Cambiar…] llama con `carpetaId` y `null` conserva la anterior; sin aviso de espacio si `libreBytes` es `null`), «si ya existe» (se recuerda en la sesión), suma de estimaciones, notas por canción, muestra de la primera; `iniciarLote` y seguimiento agrupando `exportacion:cambio` por `loteId` (progreso global monótono, tiempo restante tras 15 s, [✕] por fila, «Cancelar las que faltan» con confirmación en línea, lote detenido), resultado con «Reintentar las fallidas» (`reintentarLote`; entran las ✕ y las `cancelada` **con** `error` = «no intentada»; una `cancelada` sin `error` no), un solo toast `exp.lote.toast` por lote (ningún video avisa uno a uno), fila única `act.exp.lote` en el panel de actividad ([Ir] reabre H/I; [✕] abre H con la confirmación) y «Ver exportación» de una canción del lote abre H. Con una sola canción aplicable se abre el diálogo de una canción.
- **Archivos clave.** `app/src/renderer/src/exportacion/lote/` (`DialogoFormularioLote.tsx`, `SeguimientoLote.tsx`, `useFormularioLote.ts`, `modelo.ts`, `textos.ts`), `exportacion/dialogo/OpcionesVideo.tsx` (extraído de `Formulario.tsx`: lo comparten A y G), `ProveedorExportacion.tsx`, `contexto.ts`, `estado.ts` (las terminadas de un lote se conservan hasta 500), `navegacion/IndicadorActividad.tsx`, `shared/__fixtures__/exportacion.ts` (API falsa del lote); tests `exportacion/lote/lote.test.tsx`; E2E `e2e/exportacion.spec.ts` («exportar varias desde la barra de la Biblioteca»: 2 videos de 3 s a 640 × 480 a una carpeta temporal).
- **Cómo probarlo.** `npx vitest run src/renderer/src/exportacion` y `npx playwright test e2e/exportacion.spec.ts -g varias`.
- **Criterios.** F8-V1, V2, V4, V5 (SIN_ESPACIO/DESTINO_NO_DISPONIBLE y fallo normal), V6, V7, V8 y V9 (G muestra `exp.nota.sesion`; el diálogo de cierre ya cuenta las exportaciones del lote), y los dos criterios nuevos de la tarea: cumplidos. F8-V3: «Conservar los dos», «Sustituir» y «Omitir» los aplica main (0319); la interfaz manda la opción y la recuerda, pero el botón no puede decir «Exportar 5 videos» antes de confirmar. **No cumplido**: aviso `exp.lote.aviso.existe`, «Mostrar la carpeta» sin seleccionar archivo y [Cambiar opciones] (preguntas 0300 y 0301). F8-V10: capturas pendientes.
- **Pendiente manual.** Capturas `docs/ux/revisiones/0.2.2-feature-8/exportacion-{ancho}x{alto}-{escala}-{estado}.png`: `lote-formulario`, `lote-ver-cuales`, `lote-exportando`, `lote-cancelar`, `lote-resultado-parcial`, `lote-detenido`; exportar 3 canciones reales a una carpeta en un USB y desconectarlo a mitad.
