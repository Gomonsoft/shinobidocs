# 030 — Cambiar el tono y el tempo de una canción

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.11); referentes (KaraFun)
- Fecha: 2026-11-21
- Relacionadas: spec [07](../ux/07-reproductor.md) y [10](../ux/10-exportacion.md); [ADR 0010](../adr/0010-editor-motor-de-audio-reloj-y-guardado.md), [ADR 0021](../adr/0021-sincronia-simplificada-y-editor-preciso-de-linea.md) §9 (estiramiento con tono conservado); visión («Fuera de alcance: efectos de voz»)

## Problema
Una canción se canta en el tono y a la velocidad del original, o no se canta.

- Quien tiene un registro distinto al del artista no llega a las notas. En un karaoke con varias personas pasa en casi todas las canciones.
- El usuario canta con la voz guía al 100 %: sigue al original nota a nota. Si el tono no le va, no tiene alternativa.
- Los karaokes comerciales lo ofrecen como función básica: KaraFun permite ±6 semitonos y cambio de tempo, y guardarlos por canción.

## Propuesta
En el reproductor, dos controles: **Tono** (de −6 a +6 semitonos) y **Tempo** (por ejemplo de 75 % a 125 %), que se pueden guardar en la canción y se respetan al exportar el video.

Detalles para decidir:

- **Dónde.** Un botón «Tono y tempo» en la franja de controles abre un panel pequeño con los dos controles y «Restablecer». Teclas propuestas: `+` y `−` para el tono. No quedan a la vista de forma permanente: el reproductor ya tiene muchos controles.
- **Qué afecta.** El tono, al instrumental y a la voz guía por igual. El tempo, al audio y a la letra a la vez; los tiempos guardados no cambian, solo la velocidad del reloj.
- **Guardar.** «Usar siempre en esta canción» guarda los valores en la canción. Sin marcarlo, valen solo para esa reproducción. En la cola, cada entrada lleva los suyos.
- **Preparación.** Si el cambio no puede hacerse en tiempo real con buena calidad, la canción se prepara una vez («Preparando el tono… 5 s») y se guarda en caché.
- **Exportación.** El diálogo de exportar muestra el tono y el tempo guardados y los aplica.
- **Tecnología candidata** (decide el arquitecto): Rubber Band (GPL-2.0-or-later, compatible con la licencia del proyecto) o signalsmith-stretch (MIT). El estiramiento propio del editor preciso conserva el tono pero no lo cambia.

## Valor y coste
- Valor: alto para quien canta, y es la función de karaoke más pedida que falta. No automatiza la creación, por eso no va la primera.
- Coste estimado: L. Motor de audio (tiempo real o preprocesado en el worker), reloj de la letra con tempo distinto de 1, controles del reproductor y de la ventana secundaria, datos por canción y exportación.
- Riesgos o dudas abiertas:
  - **Alcance.** La visión excluye «efectos de voz». Esto cambia la pista, no la voz de quien canta, pero es alcance nuevo y lo decide el usuario.
  - Calidad: más de ±3 semitonos suena artificial, sobre todo en la voz guía.
  - El reloj común de editor, reproductor y exportación asume velocidad 1 fuera del editor.
  - Detectar la tonalidad de la canción no hace falta para transponer; lo descarté.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
