# 0393 — Que la app elija sola la letra aunque no pueda comprobarla con tu audio
- De: arquitecto
- Para: usuario
- Estado: Abierta
- Bloquea: no (aplicada como provisional; tareas 0392–0395)

## Contexto

En tus pruebas del 23 de noviembre en Windows, la app no eligió sola la letra en **ninguna** de las 7 canciones de YouTube: en todas te mandó elegir entre las opciones ([incidencias](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), sección «Medida»). En las dos que se midieron, la letra de LRCLIB era la buena: mismo texto y misma duración, pero adelantada entre 0,1 y 0,5 s.

Qué pasa por dentro:
- Con las letras de LRCLIB (que no dicen dónde acaba cada línea) la app **no puede saber** si la letra va a tiempo. Lo medimos en noviembre con 18 canciones de tu biblioteca, y hoy otra vez con varios ajustes distintos: en ningún caso dice «coincide». Era lo previsto en la [pregunta 0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md), y por eso nunca elegía sola.
- Además, la comprobación era demasiado estricta con las letras un poco adelantadas: las llamaba «puede ser otra versión».
- **Corregir sola un adelanto pequeño** (como los 0,3–0,5 s que viste): lo hemos medido y **no es fiable**. La app acertaría como mucho una parte del adelanto, y en algunas canciones lo movería al revés. No se hace.

## Pregunta

1. **Elegir sin comprobar** (es el punto 2 de la pregunta 0280, que esperaba tu «sí»). Con tu prueba de 0 de 7, lo hemos aplicado ya como provisional. Funciona así:
   - Si la app no puede comprobar ninguna candidata con tu audio, pero tienen tiempos y duran lo mismo que tu canción (±2 s), elige la primera **si todas esas tienen el mismo texto**.
   - La deja en «Lista para revisar» marcada **«sin comprobar con tu audio»**, nunca «Lista», y no la mueve en el tiempo.
   - Si alguna parece de otra versión, o hay dos textos distintos, sigue pidiéndote que elijas.

   **El riesgo, medido** con 17 canciones de tu biblioteca: elegiría la letra en 12 de las 17. Si a cada canción le pusiéramos la letra de otra de duración parecida, colaría 1 de 10. Si la letra buena estuviera movida 1–3 s, la elegiría igual, y la verías en la revisión. No hemos medido el caso real de LRCLIB (que busca por título y artista), porque haría falta red. ¿Lo dejamos así?
2. **Comprobación menos estricta con letras adelantadas**: ahora tolera hasta unos 0,6 s de adelanto antes de decir «puede ser otra versión». En las medidas no deja pasar ninguna letra de otra canción. Solo afecta a lo que dice la app, no mueve nada. ¿De acuerdo?
3. **Los 0 fines de línea** en esas dos canciones: no es lo que dijimos en la nota, que hubieras elegido la letra desde la vista Letra. Pasa si el **editor** está abierto sobre la canción justo cuando la preparación pone los fines. Entonces no los pone y, además, los da por hechos para siempre. Lo corregimos: se ponen al salir del editor, si no has tocado los tiempos, y si los tocaste te los ofrece «Ajustar los fines…». ¿Recuerdas si pasaste al editor nada más elegir la letra? Nos confirmaría la causa.

## Opción provisional tomada (si no bloquea)

Las tres como están descritas (tareas [0392](../tareas/0392-ventana-de-inicio-del-encaje-a-800-ms.md), [0393](../tareas/0393-elegir-la-letra-sin-comprobar-con-tu-audio.md), [0394](../tareas/0394-fines-de-la-preparacion-aplazados-con-el-editor-abierto.md) y [0395](../tareas/0395-aviso-de-letra-elegida-sin-comprobar.md); ADR 0024 y 0025, revisiones del 2026-11-23). Si dices que no al punto 1, se quita la regla nueva de la elección y todo vuelve a «Elige la letra»; los puntos 2 y 3 se quedan.

Para confirmar en tu equipo de Windows en la próxima prueba (guía de la feature 5 de 0.2.2, caso 1, con canciones nuevas de YouTube):
- cuántas llegan solas, cuántas «sin comprobar» y si alguna eligió una letra de otra versión;
- `npm run calibrar:encaje` sobre una copia de tus canciones corregidas a mano (pregunta 0280, punto 3). Comprueba que la comprobación menos estricta no acepta letras ajenas con ese material.

## Textos de la letra sin comprobar (diseñador UX, provisional)

Textos de la [pregunta 0394](0394-texto-de-la-letra-elegida-sin-comprobar.md) y de la [spec 05](../ux/05-letra.md#letra-elegida-sin-comprobar-con-tu-audio). Decisiones provisionales que puedes cambiar:
- **Tono calmado**: el aviso y la línea de la tarjeta usan el estilo informativo (azul, icono «?»), no el de advertencia (ámbar), porque la letra suele estar bien. Si prefieres que destaque más, se cambia a advertencia.
- **Tarjeta corta**: se lee «Letra elegida automáticamente · sin comprobar». La frase completa («…sin comprobar con tu audio. Al revisarla, fíjate en que vaya a tiempo con la voz.») sale al pasar el ratón y en el lector de pantalla.
- **Sin botón nuevo** en el aviso de la vista Letra: siguen [Ver otras candidatas] y [×]. Para revisar se usa «Revisar» de la tarjeta o el editor.
- **También en el progreso y en el editor**: el resumen «Lista para revisar» de la vista de progreso y el bloque «Preparación automática» del editor dicen «sin comprobar con tu audio».

## Respuesta
