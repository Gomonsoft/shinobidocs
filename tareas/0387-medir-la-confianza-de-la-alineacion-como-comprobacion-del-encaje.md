# 0387 — Feature 5 · Medir la confianza de la alineación como comprobación del encaje («señal D»), sin cambiar nada del producto
- Estado: Hecha (medida; criterio de adopción: NO; decide el arquitecto, pregunta 0311)
- Paso del pipeline: 3
- Depende de: 0328 fase 1 (hecha; emisiones guardadas fuera del repositorio)
- ADRs: 0024 §1 (opción D), 0028 («Resultado de la prueba técnica», fase 1), 0025 (revisión de las preguntas 0305 y 0296)
- Spec UX: —
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)). Lote F (`docs/spikes/0028-alineacion/**`). **Solo medida**: no toca `app/` ni `worker/`.

## Objetivo

Saber si alinear **toda la letra** contra la voz separada permite afirmar «es la letra que se canta» en letras de LRCLIB sin fines, donde F (0378) y los inicios (0385) no sirven. La pregunta es si separa la letra propia de las ajenas y de las de otra versión. Si cumple, es la vía para que la preparación (feature 5) elija sola.

## Qué se mide

- **Material**:
  - **13 propias**: las de la fase 1 (2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 16, 17 y 18), con sus emisiones guardadas.
  - **Otra versión**: 5 y 8 (letra de otra versión), 15 (otro ritmo) y 12. Hay que calcular sus emisiones con `alinear.py --guardar-emisiones`, en solo lectura.
  - **Ajenas**: cada letra contra la voz de cada otra canción **del mismo idioma** (las de distinto idioma ya las descarta el idioma), sobre las 17 voces.
- **Por par** (letra, voz), con la letra alineada entera y sin usar sus tiempos:
  - confianza de la letra: media de la probabilidad a posteriori de los fotogramas alineados;
  - fracción de líneas con confianza ≥ 0,5;
  - mediana de la confianza por línea;
  - con los tiempos del LRC solo para comparar: sesgo (mediana de Δ), p90 de \|Δ − sesgo\| y fracción de líneas con \|Δ − sesgo\| > 1 s («la letra no sigue la voz»).
- **Desplazadas**: cada propia con `offset_ms` ±0,8, ±1,5 y ±3 s. La alineación no cambia, pero el sesgo sí: se comprueba que la regla no diga «coincide» de ninguna.

## Regla candidata y criterio cerrado de adopción

- **Regla candidata**: «coincide» si se cumplen las tres:
  - confianza ≥ `cMin`;
  - p90 de \|Δ − sesgo\| ≤ 600 ms;
  - \|sesgo\| ≤ 500 ms.
  Con confianza y p90 buenos pero sesgo mayor: «desfasada», solo informativo. **No** se propone corregir con esta medida: sin V1 no se sabe si el sesgo es del LRC o del modelo (fase 1).
- `cMin` recorre {0,3; 0,4; 0,5; 0,6; 0,7} y se usa la misma medida de confianza para todas las letras.
- **Se adopta** (para la elección automática de la feature 5, y para adelantar 0329/0330 según ADR 0028) si, con algún `cMin`, se cumplen **todas**:
  1. **0** ajenas aceptadas;
  2. 5 y 8 **no** aceptadas;
  3. **0** desplazadas ≥ 0,8 s aceptadas como «coincide»;
  4. propias aceptadas ≥ **7 de 13** (más de la mitad: debajo de eso la preparación seguiría casi siempre en «Elige la letra» y no compensa el modelo de 1,2 GB);
  5. **margen**: la menor confianza de las propias aceptadas supera a la mayor de las ajenas en ≥ 0,1. Un umbral que pasa por la zona de ruido no se adopta.
- Si cumplen varios `cMin`, se anota el **más estricto**. La 15 y la 12 se informan sin criterio: no se sabe si su letra es la buena.

## Criterios de aceptación

- [x] Script `encaje_alineacion.py` en `docs/spikes/0028-alineacion/` (mismo entorno `uv`), de solo lectura, que imprime cifras por par e ids abreviados, sin texto. Emisiones y JSON fuera del repositorio.
- [x] Tabla por canción y resumen por `cMin` con las cinco condiciones y la línea `Criterio de adopción (señal D): SÍ/NO`.
- [x] Resultado en el README del spike y en una pregunta al arquitecto, que decide y lo anota en ADR 0024/0025/0028.

## Pruebas de feedback

- Unitarias: no (script de prueba fuera de la app). Un caso de humo: una letra contra su propia voz y contra una ajena dan confianzas distintas.
- E2E: Ninguna.
- Críticos: no.
- Manual: la ejecuta el programador del lote F con la copia que prepara la sesión principal.
- Siempre: no toca `app/` ni `worker/`. `ruff` sobre el script si el spike lo usa.

## Notas de implementación

Programador, 2026-11-23. **Criterio de adopción (señal D): NO.** Cifras, definición exacta y tablas en el [README del spike](../spikes/0028-alineacion/README.md#señal-d-tarea-0387-la-confianza-de-alinear-la-letra-entera-como-comprobación-del-encaje). Pregunta [0311](../preguntas/0311-senal-d-la-confianza-de-alinear-la-letra-entera-no-cumple-el-criterio-de-adopcion.md).

- **Qué se hizo**: `docs/spikes/0028-alineacion/encaje_alineacion.py` (solo lectura, sin texto); emisiones de 5, 8, 12 y 15 con `alinear.py --guardar-emisiones` (fuera del repositorio).
- **Resultado**: 0 ajenas aceptadas y 5/8 rechazadas (cumple 1 y 2); 1 de 78 desplazadas aceptada (falla el 3: `2fec1a9d` +0,8 s, por su sesgo propio de +430 ms); propias aceptadas 10/9/9/9/6 de 13 para cMin 0,3 a 0,7 (cumple el 4 hasta 0,6); margen −0,236 a +0,081 (falla el 5): la propia `ca2bf253` (0,577) puntúa menos que una ajena (0,629).
- **Lo que la tarea no resolvía (anotado, no inventado)**: la «desplazada» con una alineación de letra entera solo cambia el sesgo (sesgo − d); se aplicó tal cual, y su rechazo depende del sesgo propio sin verdad. Cruce de idiomas y letras de longitud muy distinta no se midieron (sin pares inalineables en la muestra).
- **Cómo probarlo**: ver README del spike (necesita las emisiones y la copia de la biblioteca).
