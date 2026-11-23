# 038 — «Sincronizar con la voz» solo a petición, sin automatismos

- Estado: Idea (condicionada a la fase 2 de la prueba técnica de ADR 0028)
- Origen: arquitecto, al cerrar las medidas de la feature 4/5 con canciones reales (preguntas 0295, 0305, 0310 y 0311; 2026-11-23)
- Fecha: 2026-11-23
- Relacionadas: propuesta [019](019-sincronia-automatica-por-alineacion-forzada.md) (etapa 1), ADR [0028](../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md), ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), propuesta [027](027-marcar-inicio-y-fin-al-ritmo.md)

## Problema

La etapa 1 de la 019 hace dos cosas: proponer fines y palabras en el editor, y ponerlos sola durante la preparación. Con las canciones reales del usuario, la alineación encuentra el texto en la voz (fase 1), pero no está demostrado que ponga bien los fines, y el único dato disponible es desfavorable. Tampoco sirve para comprobar si una letra es la de la canción (señal D, pregunta 0311). La parte automática es la de más riesgo y la de menos evidencia.

## Propuesta

Si la fase 2 sale «todo» o «solo fines», entra **solo la acción explícita del editor**: «Sincronizar con la voz», con vista previa de lo que cambia, un paso de deshacer y la descarga del modelo pedida por el usuario. La preparación desatendida **no** alinea ni elige letras con la alineación. Eso quedaría para cuando haya evidencia con canciones revisadas.

## Valor y coste

- Valor: quita el trabajo más repetido del editor (fines y palabras) a quien lo pida, sin cambiar nada que el usuario no vea antes.
- Coste: M–L (tareas 0329–0332 sin el paso de la preparación). Modelo opcional de 1,26 GB por idioma y unos 2,7 GB de RAM mientras trabaja.
- Riesgos: si los fines alineados son peores que «Ajustar los silencios», la acción no aporta. Lo decide la fase 2, no esta propuesta.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
