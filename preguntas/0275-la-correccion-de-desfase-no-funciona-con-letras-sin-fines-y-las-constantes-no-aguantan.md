# 0275 — La corrección de desfase no funciona con letras sin fines (LRC de LRCLIB) y las constantes del encaje no aguantan con 18 canciones reales (0.2.2, feature 4)

- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no (la feature 4 queda «hecha con reservas»; el criterio de «hecha» con canciones reales sale **no cumplido**)

## Contexto

Medida con las 18 canciones de la biblioteca del MVP 0.1.0 del usuario (copia de trabajo; solo cifras, sin letras; informe [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)). Importante: 16 de las 17 letras con tiempos son de LRCLIB **sin fines** (solo una línea con `fin_ms`) y no están revisadas a mano, así que no son las «letras propias revisadas con fines» del ADR 0024; pero son **el caso del flujo principal de la feature 5**.

`calibrar:encaje` (17 canciones con tiempos, 272 pares):

| | ADR 0024 | Medido (tal cual) | sin fines | sin fines + prudentes |
|---|---|---|---|---|
| Propias aceptadas | 10/10 | **8/17** | 10/17 | 13/17 |
| Ajenas aceptadas | 0/90 | **6/272** | 9/272 | 18/272 |
| ±0,8 s corregido | sí | **0/34** | 0/34 | 9/34 (error ≤ 100 ms) |

Con la letra tal cual: 14 de 34 letras desplazadas ±0,8 s **siguen saliendo «coincide»** (y 5 de 34 a ±3 s); solo 7 de 102 desplazamientos de ≥ 0,5 s salen `desfasada`. En la app (editor, «Comprobar la letra con la voz…»), una canción lenta con ±0,8 s y con ±3 s dice «La letra coincide con la voz.»; la corrección y el deshacer en un paso funcionan cuando sí se propone (4 casos).

Causa probable: sin fines, `finEfectivo` de cada línea llega hasta el inicio de la siguiente, de modo que F(d) casi no depende de `d` (ganancia a ±0,8 s: mediana 0,006; el mínimo para proponer es 0,02). Además, 8 de las 17 voces tienen ≥ 90 % de voz detectada entre la primera y la última línea; las 6 ajenas aceptadas tal cual usan siempre una de ellas (con una voz que cubre casi todo, cualquier letra con líneas continuas encaja). Mejor F de una ajena: 0,989 (el ADR midió 0,914): ningún umbral de F separa propias de ajenas. Una ajena sale incluso `desfasada` con `d*` = +5000 ms (el límite de búsqueda), que la preparación corregiría sola.

Pruebas hechas con los mismos datos (solo medidas):
- `gananciaMinimaF` 0,02 → 0,01 / 0,005 / 0,002: desplazadas corregidas con error ≤ 200 ms (de 102): tal cual 2 → 3 / 9 / 12; con fines prudentes 36 → 44 / 48 / 48; propias marcadas `desfasada` por error: 0/17 siempre.
- `umbralRelativoDb` de la detección de voz de −30 a −12 dB: no separa (con −16 dB: 2/17 propias y 1 ajena; con −12 dB: 1/17 y 0 ajenas).

## Pregunta

1. ¿Qué debe hacer la comprobación con letras sin fines? Opciones: (A) estimar `d*` con los fines prudentes **en memoria** solo para proponer la corrección (no para aceptar `coincide`): corrige 36/102 con 0 `desfasada` por error en propias, pero el veredicto `coincide` sigue sin discriminar; (B) bajar `gananciaMinimaF` para letras sin fines (0,005 da 9/102 con 6 mal calculadas de más de 200 ms); (C) dejarlo como está y que la interfaz **no diga «coincide»** cuando la letra no tiene fines suficientes (p. ej. «No se pudo comprobar el desplazamiento»), para no dar una falsa tranquilidad.
2. ¿Hay que añadir una guarda contra voces densas (voz ≥ 90 % entre la primera y la última línea → `no_comprobable` para el veredicto de «ajena», aunque se siga proponiendo el desfase)? ¿Y excluir de la preparación automática las `desfasada` con `|d*|` en el borde de la búsqueda (5000 ms)?
3. ¿Se actualiza el ADR 0024 (tabla de calibración y criterio «hecha») o se espera a medir con las canciones revisadas del usuario?

## Opción provisional

Ninguna: no se ha cambiado código ni constantes. La feature 4 y 5 quedan con la reserva; la guía manual de la feature 4 (caso 1.3) se ha anotado como «no se cumple con letras sin fines».
