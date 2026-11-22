# 019 — Sincronía automática por alineación forzada sobre la voz separada

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.6 y §3.7); uso real y feedback de alpha.1
- Fecha: 2026-11-21
- Relacionadas: [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md) (decisión 6: alineación «candidata post-MVP»), [ADR 0021](../adr/0021-sincronia-simplificada-y-editor-preciso-de-linea.md), [ADR 0015](../adr/0015-linea-de-tiempo-y-picos-de-voz.md), [ADR 0002](../adr/0002-licencia-del-proyecto.md); propuestas 003, 016, 020, 022, 023 y 029

## Problema
El trabajo manual del editor está en el fin de cada línea y en los tiempos por palabra.

- En las 8 canciones sin palabras importadas hay 314 líneas: 138 con el fin fijado y 176 con el fin automático, que no sigue a la voz.
- «Ajustar los silencios» es la única ayuda. QA midió un error medio de 438 a 590 ms y un máximo de 4,7 s.
- El barrido palabra a palabra solo existe si el usuario marca cada palabra en el editor preciso, línea a línea. Las canciones tienen de 28 a 101 líneas.
- Los tiempos por palabra de LRCLIB se retiraron en 0.2.1 porque dejaban de coincidir al corregir el fin de una línea.
- Una letra sin tiempos (pegada o «Solo texto») exige sincronizar todas las líneas al ritmo. Nadie lo ha hecho en la biblioteca real.

## Propuesta
Que la app calcule sola, sobre la pista de voz separada, cuándo empieza y acaba cada palabra de la letra, y de ahí saque el fin de cada línea y el barrido palabra a palabra.

En dos etapas:

1. **Dentro de cada línea (etapa 1).** Para una letra que ya tiene inicios (la de LRCLIB), alinear el texto de cada línea con el tramo de voz entre su inicio y el inicio de la siguiente. Resultado: fin de línea al acabar la última palabra, y palabras con tiempos. El problema está acotado por línea, así que un fallo no arrastra al resto.
2. **Letra sin tiempos (etapa 2).** Alinear la letra completa con la canción completa para obtener también los inicios. Es más difícil: un error al principio desplaza todo lo que sigue.

Detalles para decidir:

- **Dónde aparece.** Acción «Sincronizar con la voz» en la pestaña «Funciones» y paso automático de la preparación desatendida (020). Siempre con vista previa de recuentos y un solo paso de deshacer, como «Ajustar los silencios».
- **Confianza por línea.** El alineador da una puntuación. Las líneas con puntuación baja no se tocan o se marcan para la revisión guiada (023).
- **Palabras automáticas.** Se guardan distinguidas de las hechas a mano (por ejemplo `origen_palabras: "auto"`). Al mover el inicio o el fin de la línea se recalculan o se descartan; nunca se quedan desfasadas. Las hechas a mano no se pisan.
- **Tecnología candidata** (decide el arquitecto en un ADR): alineación CTC con wav2vec2, como hace WhisperX (código BSD-2-Clause). Para español, `jonatasgrosman/wav2vec2-large-xlsr-53-spanish` es Apache-2.0. Los modelos por defecto de torchaudio para español, francés, alemán e italiano, y el multilingüe `MMS_FA`, son CC BY-NC 4.0 y **no se pueden usar**. PyTorch ya está en el runtime.
- **Idiomas.** Un modelo por idioma, descargado bajo demanda. Empezar por español e inglés. Requiere saber el idioma de la letra (029).
- **Prueba técnica antes de comprometer nada.** Medir el alineador contra los fines que el usuario fijó en A Pesar de Mí, Arrópame y ¿Y Ahora Qué? (89 líneas), con el mismo banco que `calibrar:silencios`. Criterio propuesto: error medio menor que el de «Ajustar los silencios» y sin cortes de más de 150 ms.

## Valor y coste
- Valor: muy alto. Quita el trabajo más repetido del editor, devuelve el barrido por palabra sin esfuerzo y hace viable la letra pegada. Es la pieza que más acerca la app a «añadir y cantar».
- Coste estimado: XL en total. Prueba técnica S; etapa 1 L (worker, descarga de modelos, interfaz, palabras automáticas en el modelo de datos); etapa 2 L más.
- Riesgos o dudas abiertas:
  - Los modelos están entrenados con voz hablada. Sobre voz cantada separada no encontré medidas; la investigación en alineación de letras ronda 0,2 a 0,4 s de error medio.
  - Notas largas, coros y voces dobladas son los casos difíciles. Cifras y símbolos en la letra no se alinean (límite declarado de WhisperX).
  - Descarga nueva de alrededor de 1 GB por idioma (cifra sin verificar) y tiempo de proceso en equipos sin GPU.
  - Licencias de modelos y de sus datos de entrenamiento: revisión del arquitecto.
  - Si la etapa 1 funciona, «Ajustar los silencios» y la propuesta 003 pierden sentido: decidir si se retiran o quedan como respaldo sin modelo.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
