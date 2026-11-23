# 0275 — La corrección de desfase no funciona con letras sin fines (LRC de LRCLIB) y las constantes del encaje no aguantan con 18 canciones reales (0.2.2, feature 4)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
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

## Respuesta

Arquitecto, 2026-11-22. Regla completa en ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), revisión «Medida con canciones reales y guardas de prudencia». Es **provisional** hasta medir con canciones revisadas.

**Diagnóstico.**
- **Límite del método, no defecto de código**: sin fines, F casi no cambia al desplazar la letra, porque cada línea ocupa hasta la siguiente. Con la voz casi continua (8 de 17 voces ≥ 90 %), F no distingue una letra de otra. Ninguna constante arregla las dos cosas, y `qa` ya probó la ganancia y el umbral de voz.
- **Defecto de la regla**: el `d*` espurio (pregunta 0276) y el máximo en el borde de la búsqueda (la ajena con +5000 ms).

**1. Qué hace la comprobación con letras sin fines: opción C, generalizada.**
- «Coincide» solo se afirma si la comprobación **habría notado** la misma letra movida 0,8 s: `contrasteF = F(dv) − máx(F(dv ± 800)) ≥ 0,02`, que es la misma ganancia que ya se exige para proponer una corrección.
- Si no la habría notado, el veredicto es `dudosa` con `limitacion: "sinContraste"`. No se mira si la letra «tiene fines»; se mide lo que importa (si la curva tiene pico), así que vale igual para letras con fines y sin ellos.
- **A** (fines prudentes en memoria para estimar d\*): no se adopta ahora. Sesgo fijo de −100 ms, sube las ajenas y el criterio de 0222 no se cumple. Se vuelve a medir con canciones revisadas (0381 da las cifras).
- **B** (bajar `gananciaMinimaF`): no. Con 0,005, 6 de 9 correcciones quedan a más de 200 ms.

**2. Guardas.**
- **Voz continua**: sí. Con densidad de voz ≥ 90 % (la misma medida que la columna «Voz %» del informe), `coincide`/`desfasada` pasan a `dudosa` con `limitacion: "vozContinua"`. No se separa «veredicto de ajena» de «propuesta de desfase»: con la voz continua tampoco se propone ni se corrige nada.
- **Borde**: un d\* en el primer o el último valor de la rejilla nunca da `desfasada`, en ningún llamador.

**3. ADR.** Se actualiza ya con la tabla medida, la conclusión y la regla provisional. **No** se recalibra ninguna constante con esta muestra (LRC sin revisar, sesgada hacia voces densas). Las tres constantes nuevas no se ajustan a esta muestra: `densidadVozMaxima: 0,9` es el corte que separa los dos grupos observados, y `contrasteMinimoF` es la ganancia que ya existía.

**Efecto en el producto**:
- La elección automática y las correcciones solas solo actúan con un veredicto fiable.
- Con LRC sin fines, la app dirá «No está claro» casi siempre y la preparación dejará «Elige la letra». Es lo prudente.
- La corrección manual sigue funcionando cuando se propone (comprobado con las canciones 6 y 14).

**Cambios de código**: tarea [0378](../tareas/0378-encaje-veredicto-en-d0-y-guardas-de-fiabilidad.md) (`shared/encaje.ts`), [0379](../tareas/0379-limitacion-del-encaje-en-la-interfaz.md) (la limitación llega a la interfaz) y [0381](../tareas/0381-calibrar-encaje-con-guardas-de-fiabilidad.md) (script).

**Medida adicional**:
- (a) `qa`, ya, sobre la misma copia: `calibrar:encaje` tras 0378/0381. Es un criterio de **seguridad**, no de calibración: 0 ajenas aceptadas, 0 desplazadas ≥ 0,8 s que digan `coincide`, 0 propias `desfasada` y 0 correcciones con error > 200 ms.
- (b) El usuario, con ≥ 8 canciones revisadas a mano con fines (pregunta [0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md)): cuántas letras buenas se pierden por prudencia y si hay que recalibrar.

**Cambios de spec para el diseñador** (`docs/ux/05-letra.md` y `06-editor.md`, feature 4):
1. Tabla de veredictos de la spec 05: `dudosa` añade «o la comprobación no puede saberlo con esta voz o esta letra (limitación)». `coincide` pasa a significar «las líneas empiezan donde empieza la voz **y** la comprobación habría notado un desfase».
2. Textos nuevos para `dudosa` con limitación, en la vista previa del candidato, en C y en el diálogo del editor. Hoy `let.comp.dudosa.ayuda`, `let.comp.actual.dudosa` y `edi.comprobar.dudosa` hablan de «coros o partes sin letra», que aquí es falso. Sentido de cada uno:
   - `vozContinua`: «la voz suena casi sin pausas, así que no podemos comprobar con ella si la letra es la correcta ni si va adelantada; escúchala».
   - `sinContraste`: «moverla un poco casi no cambia nada (la letra no marca dónde acaba cada línea o la voz apenas para), así que no podemos saber si va adelantada o atrasada; escúchala».
   - Las dos acaban en «no hemos cambiado nada».
3. F4-L2 añade dos casos: con voz casi continua, la letra correcta sale «No está claro» con su motivo; y una letra sin fines desplazada 0,8 s nunca sale «Coincide».
4. La verificación manual de la spec 05 cambia «comprobar que la letra correcta sale como "Coincide"» por «que sale "Coincide" o "No está claro" con motivo, y nunca "No coincide"». Con un LRC de LRCLIB sin fines, lo esperado es «No está claro».
5. `let.prep.motivo.duda` no cambia, salvo que el diseñador prefiera un motivo propio para la limitación.

**Para `qa`**: la guía de la feature 4, caso 1.3, se reescribe así:
- Con letra sin fines o voz continua, lo correcto es «No está claro», nunca «coincide».
- La corrección de ±0,8 s se prueba con una canción con huecos y fines.
