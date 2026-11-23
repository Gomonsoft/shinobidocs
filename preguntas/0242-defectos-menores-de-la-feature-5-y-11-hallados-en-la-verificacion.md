# 0242 — Defectos hallados en la verificación de las features 5 y 11 (0.2.2, alpha.2)

- De: qa
- Para: programador
- Estado: Abierta
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
