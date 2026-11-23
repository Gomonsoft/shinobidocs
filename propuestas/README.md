# Propuestas de features

Ideas de mejora **todavía sin definir ni autorizar**. No forman parte del alcance de ninguna versión hasta que el usuario las aprueba y pasan al plan (`docs/versiones/`). Aquí se recogen para no perderlas y para discutirlas antes de invertir trabajo de agentes.

## Cómo funciona

1. **Cualquiera propone**: el usuario, la sesión principal (compañera de producto) o un agente que detecte una mejora mientras trabaja. Los agentes no implementan nada fuera del alcance: crean la propuesta y siguen con su tarea.
2. **Una propuesta por archivo**: `NNN-titulo-en-kebab.md`, con la [plantilla](000-plantilla.md). Numeración correlativa propia (no es la de tareas ni la de preguntas).
3. **La sesión principal las cuida**: agrupa duplicadas, completa el problema y el valor, y las presenta al usuario con una recomendación.
4. **El usuario decide**: `Aceptada` (se añade al plan de una versión y la definen arquitecto y diseñador), `Aplazada` o `Descartada`, con el motivo.

## Estados

`Idea` → `En discusión` → `Aceptada (versión X, fase N)` · `Aplazada` · `Descartada`

## Propuestas

| N.º | Propuesta | Origen | Estado |
|---|---|---|---|
| [001](001-volumen-y-voz-guia-desde-el-panel-de-cola.md) | Volumen y voz guía desde el panel de la cola | Pregunta 0060 (aplazado por el usuario) | Aplazada |
| [002](002-selector-de-dispositivo-de-audio.md) | Elegir el dispositivo de salida de audio | Plan 0.2.0, feature 10 | Idea |
| [003](003-calibrar-el-ajuste-de-silencios-por-cancion.md) | Sensibilidad ajustable en «Ajustar los silencios» | Sesión del 2026-11-20 | Idea |
| [004](004-voz-guia-durante-la-cuenta-y-la-espera.md) | Control de voz guía durante la cuenta y la espera | Tarea 0182 | Idea |
| [005](005-cola-persistente-entre-sesiones.md) | Conservar la cola al cerrar la app | Fase 4 (la cola vive en memoria) | Idea |
| [006](006-exportar-varias-canciones-a-video.md) | Exportar varias canciones a video de una vez | Diseño de la fase 6 de 0.2.0 | Idea |
| [015](015-comodin-de-espera-hueco-a-hueco.md) | Comodín de espera hueco a hueco | ADR 0018, pregunta 0100 | Idea |
| [016](016-ajustar-el-fin-de-una-linea-con-la-voz.md) | Ajustar el fin de una sola línea con la voz | ADR 0018 | Idea |
| [007](007-codificacion-de-video-por-hardware.md) | Codificar el video con la GPU cuando el equipo la tenga | ADR 0019 (prueba técnica de la fase 6) | Idea |
| [008](008-formato-de-video-de-maxima-compatibilidad.md) | Formato de video de máxima compatibilidad (MP4 con H.264 y AAC) | ADR 0019 (fase 6) | Idea |
| [017](017-estructura-de-releases.md) | Estructura de releases inspirada en RPCS3 y DroidDeck | Usuario (2026-11-21) | Aceptada (0.2.0, fase 10) |
| [018](018-letra-en-pantalla-con-varios-enunciados.md) | Letra en pantalla con varios enunciados, enunciado pasado y transiciones con movimiento | Usuario (2026-11-21), plan 0.2.2 | En discusión |
| [019](019-sincronia-automatica-por-alineacion-forzada.md) | Sincronía automática por alineación forzada sobre la voz separada | Exploración 0.2.2 (diseñador UX) | Idea |
| [020](020-preparacion-desatendida.md) | Preparación desatendida: la canción llega sola a «Lista para revisar» | Exploración 0.2.2 (uso real: 5 borradores sin letra) | Idea |
| [021](021-importacion-por-lotes.md) | Importación por lotes: archivos, carpeta, enlaces o lista de YouTube | Exploración 0.2.2 (uso real: 9 canciones añadidas una a una) | Idea |
| [022](022-comprobar-la-letra-contra-el-audio.md) | Comprobar la letra contra el audio y corregir el desfase | Exploración 0.2.2 (diseñador UX) | Idea |
| [023](023-revision-guiada-de-lineas-dudosas.md) | Revisión guiada de líneas dudosas | Exploración 0.2.2 (diseñador UX) | Idea |
| [024](024-datos-de-la-cancion-automaticos.md) | Datos de la canción automáticos (título, artista y álbum) | Exploración 0.2.2 (diseñador UX) | Idea |
| [025](025-copia-de-seguridad-y-paquete-de-cancion.md) | Copia de seguridad, paquete de canción y exportar la letra | Exploración 0.2.2 (diseñador UX) | Idea |
| [026](026-aviso-de-version-nueva.md) | Aviso de versión nueva dentro de la app | Exploración 0.2.2; pregunta 0037 | Idea |
| [027](027-marcar-inicio-y-fin-al-ritmo.md) | Marcar inicio y fin al ritmo manteniendo la tecla | Exploración 0.2.2 (diseñador UX) | Idea |
| [028](028-acciones-por-lotes-en-la-biblioteca.md) | Acciones por lotes en la Biblioteca (reactiva la 006) | Exploración 0.2.2 (diseñador UX) | Idea |
| [029](029-letra-pegada-lista-para-alinear.md) | Letra pegada lista para alinear: limpieza asistida, idioma y estribillos | Exploración 0.2.2 (diseñador UX) | Idea |
| [030](030-tono-y-tempo.md) | Cambiar el tono y el tempo de una canción | Exploración 0.2.2 (referentes) | Idea |
| [031](031-listas-guardadas-y-cola-que-no-se-pierde.md) | Listas guardadas y cola que no se pierde (amplía la 005) | Exploración 0.2.2 (diseñador UX) | Idea |
| [032](032-saltar-intro-y-ensayar-estrofa.md) | Saltar la introducción y los silencios largos, y ensayar una estrofa | Exploración 0.2.2 (diseñador UX) | Idea |
| [033](033-legibilidad-y-resaltado-accesible.md) | Legibilidad y resaltado que no dependa solo del color | Exploración 0.2.2 (accesibilidad) | Idea |
| [034](034-cantantes-en-la-cola-y-mando-desde-el-movil.md) | Cantantes en la cola y mando desde el móvil | Exploración 0.2.2 (referentes) | Idea |
| [035](035-ajustes-almacenamiento-y-estado-del-motor.md) | Ajustes: almacenamiento y estado del motor | Exploración 0.2.2; feedback de alpha.1 §1.6 | Idea |
| [036](036-varios-cantantes-y-coros.md) | Varios cantantes y coros (dúos a cuartetos, «Todos», coros con voz guía) | Usuario (2026-11-22) | Aceptada para 0.2.3 |
| [038](038-sincronizar-con-la-voz-solo-a-peticion.md) | «Sincronizar con la voz» solo a petición, sin automatismos | Arquitecto, medidas de las features 4, 5 y 10 (2026-11-23) | Idea (condicionada a la fase 2 de ADR 0028) |
