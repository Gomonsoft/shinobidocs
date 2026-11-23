# 0292 — Decisiones menores de las tareas 0318 y 0326 que las specs dejan abiertas
- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (opción conservadora aplicada)

## Contexto

Al implementar las acciones por lotes en main (0318) y la interfaz de paquetes y copias (0326) quedaron cuatro puntos sin decisión explícita.

## Pregunta y opción provisional tomada

1. **«Editar datos…» de varias durante una sesión** (F8-12 dice que funciona; ADR 0017 §9 dice `EDICION_BLOQUEADA` por canción). Aplicado: la canción que **suena** en la otra pantalla sale `omitida` con `EDICION_BLOQUEADA` (su título, artista y aspecto ya están cargados en la secundaria); las demás se editan. La interfaz de 0320 decidirá el texto de ese motivo (`bib.acc.motivo.activa` solo habla de eliminar).
2. **«Se recuerda la última elección» de «Qué incluye»** (spec 02) no tiene campo de configuración. Aplicado: se recuerda mientras la aplicación está abierta (módulo en memoria); al reiniciar vuelve a «Completo». Si debe persistir, hace falta un campo `copias.completo` en la configuración (arquitecto).
3. **Resaltar las importadas 2 s** (spec 02): la Biblioteca ya enfoca una tarjeta con `Vista.biblioteca.enfocar`, pero el resalte solo vale para Listas. Aplicado: al cerrar el resultado, se vuelve a la Biblioteca y se enfoca la **primera** importada sin resalte; no se cambia el filtro (`Todas`) si el activo oculta alguna. Pendiente de un cambio pequeño en `Biblioteca.tsx` cuando la 0320 termine de tocarla.
4. **Fila `act.paq` del panel de actividad**: el panel es de otro lote (feature 7). La interfaz de paquetes deja el estado listo (`usePaquetes().seguimiento`: `tipo`, `i/n` en `cancion`, `fraccion`) y los textos `PAQ.actividad.crear|importar`; falta pintar la fila con [Ir] (`abrirExportarPaquete`/`abrirImportarPaquete`) y [✕] (`copias.cancelar(trabajoId)`) y contarla en el indicador.

## Respuesta

Diseñador UX, 2026-11-22. Spec 02 actualizada.

1. **Conforme** (manda el ADR): la que suena sale omitida; texto `bib.acc.motivo.EDICION_BLOQUEADA` («No se ha cambiado: está sonando en la otra pantalla. Edítala cuando termine.»). F8-12 lo dice ahora.
2. **Conforme**: se recuerda mientras la app está abierta y al reiniciar vuelve a «Completo» (lo más seguro). Spec ajustada; sin campo nuevo.
3. **Cambio** (no bloquea): al cerrar el resultado, pasar a *Todas* si el filtro actual oculta alguna importada, enfocar la primera y resaltar **todas** las importadas 2 s con borde `info` (sin transición con movimiento reducido), como dice la spec.
4. **Cambio, bloquea alpha.3** (tarea 0383): la fila `act.paq` en el panel de actividad con [Ir] y [✕], contada en el indicador de la barra y en el diálogo de cierre de la app (F9-4). Sin ella, «Seguir en segundo plano» deja un trabajo largo sin forma de volver a él ni de cancelarlo, y cerrar la app lo cortaría sin avisar.
