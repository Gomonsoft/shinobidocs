# 0222 — Letras de LRCLIB sin fines y elección automática en canciones con huecos instrumentales (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (se aplica el ADR tal cual; hay que medirlo con canciones reales en la verificación, tarea [0312](../tareas/0312-verificacion-e-informe-de-la-feature-5.md))

## Contexto

ADR 0025 §3 criterio 3 usa `evaluarEncaje` sobre el candidato **tal como viene**. Un LRC de LRCLIB casi nunca trae fines de línea: `finEfectivo` cae al inicio de la línea siguiente si el hueco es ≤ 8 s. En una canción con pasajes instrumentales de varios segundos, cada línea «cubre» un tramo sin voz, baja la precisión de F y el veredicto pasa de `coincide` a `dudosa` aunque la letra sea la buena. Con picos sintéticos (voz de 4,4 s de cada 5 s, versos sin fin) sale `coincide`; con 2 s de voz cada 5 s y versos sin fin, `no_coincide` (F0 ≈ 0,57). Las calibraciones del ADR 0024 se hicieron con letras propias ya revisadas (con fines).

## Pregunta

¿Se evalúa el candidato con los fines que le propondría «Ajustar los silencios» (variante prudente) antes de pasar `evaluarEncaje`, o se deja como está (más canciones caerían en «Elige la letra», que es el lado seguro)?

## Opción provisional tomada (si no bloquea)

La más conservadora: sin cambios, como dice el ADR. Si la verificación con canciones reales muestra demasiados `dudosa` en letras correctas, aplicar los fines prudentes al candidato en memoria antes de evaluarlo (afecta a `main/preparacion/servicio.ts`, `pasoComprobar`, y a la vista Letra si debe coincidir).

## Respuesta

Arquitecto, 2026-11-22. **Se mide antes de cambiar nada**, con un criterio cerrado. Lo aplicado se queda y no hay cambios de código ahora.

Evaluar el candidato con fines estimados parece arreglarlo, pero tiene un riesgo: los fines que propone «Ajustar los silencios» se ajustan a la voz de **este** audio, y eso también podría subir F a una letra **ajena**. La elección automática elige en silencio, así que un falso «coincide» es peor que caer en «Elige la letra».

- **Medida**: tarea nueva [0371](../tareas/0371-calibrar-encaje-con-letras-sin-fines.md) (S, lote C). Amplía `calibrar:encaje` para evaluar cada letra en tres variantes: tal cual, **sin fines** (simula un LRC de LRCLIB) y **sin fines + fines prudentes**. Para cada una da propias aceptadas y ajenas aceptadas. La ejecuta el usuario con su biblioteca, junto con la verificación 0312.
- **Criterio para adoptar los fines prudentes**: (a) con «sin fines», las propias aceptadas son < 9 de 10; (b) con «sin fines + prudentes», las propias aceptadas suben a ≥ 9 de 10; y (c) las ajenas aceptadas siguen en **0** en las tres variantes. Si se cumple, la elección automática (`pasoComprobar`) **y** el encaje de candidatos de la vista Letra (`main/letras/busqueda.ts`) evalúan con fines prudentes en memoria, sin guardarlos, y se anota en ADR 0024 y 0025. Si no se cumple, se queda como está.
