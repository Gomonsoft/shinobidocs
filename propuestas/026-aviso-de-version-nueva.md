# 026 — Aviso de versión nueva dentro de la app

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.1); [pregunta 0037](../preguntas/0037-autoactualizacion-de-la-app.md), abierta
- Fecha: 2026-11-21
- Relacionadas: specs [08](../ux/08-ajustes-y-acerca.md) (fase 10, número de compilación) y [09](../ux/09-descarga-e-instalacion.md); [ADR 0020](../adr/0020-publicacion-en-github-releases-y-politica-de-versiones.md); propuesta 017

## Problema
La app no sabe que hay una versión nueva.

- Las notas de 0.2.1-alpha.1 lo dicen: «No hay autoactualización: cada versión se descarga e instala a mano».
- El 21 de noviembre se prepararon tres versiones (0.2.0-alpha.1, alpha.2 y 0.2.1-alpha.1). Quien prueba tiene que mirar la página de Releases por su cuenta.
- Una versión antigua sigue en uso con errores ya corregidos, como la exportación a 1440p de alpha.1.
- La pregunta 0037 lleva abierta desde el MVP con tres opciones. La autoactualización completa no es fiable sin firma de código.

## Propuesta
La opción B de la 0037: al arrancar, la app consulta si hay una versión más nueva en su canal y, si la hay, lo dice con un enlace a la descarga y a las novedades. No descarga ni instala nada.

Detalles para decidir:

- **Dónde se ve.** Un punto en el botón ⚙ de la barra superior y una línea en Ajustes › Acerca de: «Hay una versión nueva: 0.2.2. [Ver novedades] [Descargar]». Sin diálogo al arrancar y sin toast: no interrumpe a quien viene a cantar.
- **Canal.** Quien usa una versión preliminar ve preliminares y estables; quien usa una estable, solo estables. Las compilaciones de desarrollo (fase 10 de 0.2.0) no avisan.
- **Frecuencia.** Como mucho una consulta al día, al arrancar. Sin conexión o con error, no se muestra nada.
- **Privacidad.** Es un acceso a internet nuevo. Interruptor en Ajustes: «Avisarme cuando haya una versión nueva», activado por defecto, y mención en el texto de primer arranque. La petición no lleva datos del equipo ni del usuario.
- **Botón manual.** «Buscar actualizaciones» en Acerca de, que funciona aunque el interruptor esté apagado.
- **Durante un evento.** Con una sesión en otra pantalla, el aviso no aparece en la ventana del público.

## Valor y coste
- Valor: medio-alto y barato. Menos gente en versiones con errores ya corregidos y menos soporte.
- Coste estimado: S. Una consulta desde el proceso principal, comparación de versiones, dos textos y un interruptor.
- Riesgos o dudas abiertas:
  - Depende de que las Releases sean públicas (ADR 0020).
  - Límites de la API de GitHub sin autenticar: una consulta al día por instalación queda muy lejos de ellos, pero hay que tratar el error en silencio.
  - Cierra la pregunta 0037 con la opción B. Si más adelante se firman los instaladores, se puede reconsiderar la autoactualización.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
