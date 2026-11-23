# 0242 — Defectos hallados en la verificación de las features 5 y 11 (0.2.2, alpha.2)

- De: qa
- Para: programador
- Estado: Respondida (2026-11-22, programador)
- Bloquea: no

## Contexto

Hallados al verificar 0312 y 0337 sobre `10496b8`. Los cuatro primeros contradicen un criterio de la spec; los demás son menores.

1. **El toast «está lista para revisar» no pide la revisión guiada** (media-baja). `app/src/renderer/src/navegacion/useAvisosPreparacion.ts:68`: `irRef.current({ tipo: 'cancion', id: ev.id, paso: editor ? 'editor' : 'letra' })` sin `revisar: true`. F11-E11: «Revisar» **de los toasts** abre el editor con el recorrido activo. (La nota de la tarea 0336 lo atribuía a un toast de main con `destino: 'editor'`; el de la preparación es este, del renderer. El aviso de main `main/avisos/servicio.ts:69` es el de «ya se puede marcar como lista» tras separar y no es de revisión.)
2. **La vista de progreso marca como lista sin preguntar** (media-baja). `vistas/progreso/Progreso.tsx:259` llama `useProbar()` sin `pedirMarcar`, así que el [Marcar como lista] del toast tras «Probar» no pasa por `bib.revision.dialogo`. F11-B3 nombra expresamente ese toast.
3. **El aviso de Ajustes cuenta distinto que la bandeja** (baja-media). `vistas/ajustes/PreparacionAjustes.tsx:70-76` cuenta borradores sin letra y sin registro, sin exigir `pasos.fuente = completado` ni excluir los que se están preparando; `recuentosBandeja` (`shared/derivados.ts:195-228`) sí. En la semilla: Ajustes dice «Tienes 7 borradores sin letra» y la casilla «Esperan letra» a la que lleva [Verlos en la Biblioteca] muestra 3. F5-J5 los quiere iguales: usar `recuentosBandeja(...).esperanLetra`.
4. **El `HEAD` de comprobación de conexión sale con el interruptor apagado**: ver la pregunta 0243 (decisión del arquitecto).
5. **Aviso del sistema sin foco** (baja, por confirmar): spec 04 («Con la ventana sin foco, la notificación de siempre con el mismo texto») pide notificación al terminar una preparación individual; no hay ningún `avisoDeTrabajo` de preparación en `main/avisos/servicio.ts`. Solo cubre el toast del renderer. Si no es intencionado, falta.
6. **Posible toast duplicado** (por comprobar a mano, la guía lo recoge): al terminar la separación de una canción que ya tiene letra completa, main emite `prog.toast.lista` («ya se puede marcar como lista», `avisoDeTrabajo`) y el renderer `prog.toast.revisar`; la spec 04 dice que la preparación sustituye al primero.
7. `ajustes`: la sección no se ve sin scroll a 1280 × 800 (ver 0244, es de diseño).

## Pregunta

¿Los corriges (1–3 y, si procede, 5–6)? No bloquea nada.

## Opción provisional

Ninguna: se anotan en los informes de las features 5 y 11.


## Respuesta

Programador, 2026-11-22. Se corrigen 1 a 3, 5 y 6 (el 4 va en la tarea [0377](../tareas/0377-recuento-de-revision-sin-registro-y-privacidad-de-la-sonda.md); el 7 es de diseño, 0244).

1. **Toast «está lista para revisar»**: `useAvisosPreparacion.ts` abre el editor con `revisar: true` (F11-E11). Test: `useAvisosPreparacion.test.tsx`.
2. **Progreso marca sin preguntar**: `Progreso.tsx` usa `useMarcarRevision` con el resumen vivo y se lo pasa a `useProbar(pedirMarcar)`; el diálogo `bib.revision.dialogo` sale desde la vista de progreso. Test: `Progreso.preparacion.test.tsx` («F11-B3»).
3. **Aviso de Ajustes**: `PreparacionAjustes.tsx` usa `contarBandeja(...).letra`, la misma función que la bandeja; ya no cuenta los borradores sin fuente ni los que se están preparando. Test: `PreparacionAjustes.test.tsx` (3 con fuente y 4 sin ella: «Tienes 3»).
4. **Sonda de conexión**: tarea 0377 (reintento de la propia descarga, sin LRCLIB). E2E `importar-youtube.spec.ts` («sin conexión con el interruptor apagado…»).
5. **Notificación del sistema**: `ServicioAvisos.alCambiarCancion` (`main/avisos/servicio.ts`) avisa al pasar «Preparando» a un resultado (revisar, elige, sin letra) con el mismo texto del toast (`AVISOS.preparacion`, compartido con el renderer), solo con la ventana sin foco y nunca dentro de una tanda de 2 o más. No difunde toast: el toast sigue siendo del renderer.
6. **Toast duplicado**: era real en el caso de una canción con letra completa a la que se separa dentro de una preparación en curso (`avisoDeTrabajo` daba `lista` además del toast del renderer). Ahora `avisoDeTrabajo` no avisa «ya se puede marcar como lista» cuando `preparacion.estado === 'en_curso'` (la preparación lo sustituye, spec 04); sin preparación sigue como siempre. Test unitario (`main/avisos/servicio.test.ts`). `preparacion.spec.ts` registra todos los toasts del flujo completo (WAV con LRCLIB): ninguno «ya se puede marcar como lista» y uno solo «está lista para revisar»; en ese flujo la letra llega después de separar, así que el caso del duplicado (letra completa antes) solo lo cubre el test unitario.
