# 0236 — La solicitud de cierre se perdía si el renderer aún no había montado su diálogo (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no (resuelta con la opción mínima en la tarea [0309](../tareas/0309-tanda-pausa-paradas-y-reanudar-al-abrir.md))

## Contexto

Con la reanudación al abrir, la E2E «cierre con trabajos» cerraba la app en cuanto el paso volvía a `en_curso` y `app.close()` se quedaba colgado. Causa raíz, medida con trazas en main y renderer:

- **Quién decide.** Main decide si hay algo en curso (`controlCierre`, con el gestor) y **pide** confirmación con el evento `app:solicitudCierre`; el renderer solo muestra el diálogo y responde con `app.confirmarCierre()`. Sin respuesta, el cierre queda pendiente.
- **(a) Síntoma.** Esa solicitud se envía una sola vez. Si el renderer aún no ha montado `DialogoCierre` (unos 150 ms tras abrir, con la reanudación ya en marcha) el evento se pierde: no sale diálogo y main sigue esperando. No hay «auto-confirmación»: la confirmación que se veía en las trazas era el clic posterior de la prueba.
- **(b) Síntoma.** El `app.close()` de Playwright se queda esperando esa respuesta que nunca llega. No era el gestor: con un trabajo recién lanzado, `cancelar` con motivo `cierre` sí lo cierra (test nuevo), salvo un hueco real: entre escribir el paso `en_curso` y lanzar el worker no se miraba si ya estaba cancelado (el cliente real del worker sí lo mira; el gestor ahora también).

## Pregunta

¿Se confirma el contrato añadido? Canal nuevo `app.solicitudCierrePendiente(): SolicitudCierreIpc | null`: main recuerda la solicitud sin responder (`ControlCierre.pendiente()`) y el renderer la pregunta al montar `DialogoCierre`; si hay una, la atiende como si acabara de llegar. Alternativa descartada: reenviar el evento por temporizador desde main (taparía el problema con un retraso).

## Opción provisional tomada (si no bloquea)

La anterior (canal nuevo, aditivo y tolerante: un renderer sin el método simplemente no pregunta). `ColaPreparacion.alCierre` y `normalizarAlArrancar` no cambian: tras cualquier cierre, el paso `en_curso` huérfano pasa a `interrumpido` al arrancar (lo hace `ServicioBiblioteca.arrancar`) y el registro de preparación `en_curso`, a `detenida` por cierre.

## Respuesta

(pendiente)
