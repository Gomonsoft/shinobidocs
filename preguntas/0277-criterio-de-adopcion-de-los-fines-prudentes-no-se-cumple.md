# 0277 — Criterio de adopción de los fines prudentes (pregunta 0222): NO se cumple con 18 canciones reales (0.2.2, features 4 y 5)

- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

Respuesta a la medida que pedía la pregunta [0222](0222-lrc-sin-fines-y-elegir-sola-la-letra-con-huecos-instrumentales.md) (tarea 0371), con `npm run calibrar:encaje -- <biblioteca> --variantes` sobre 17 canciones con tiempos (16 LRC de LRCLIB sin fines y sin revisar; ver [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)):

| Variante | Propias aceptadas | Ajenas aceptadas |
|---|---|---|
| tal cual | 8/17 (47 %) | 6/272 |
| sin fines (como LRCLIB) | 10/17 (59 %) | 9/272 |
| sin fines + prudentes | 13/17 (76 %) | 18/272 |

Criterio: (a) sin fines < 90 %: **sí**; (b) con prudentes ≥ 90 %: **no** (76 %); (c) ajenas = 0 en las tres: **no** (ya falla tal cual). Resultado: «NO se cumple» → se queda como está.

Datos para el arquitecto: los fines prudentes suben las propias (+3) pero también las ajenas (+9 a +12), como se temía; todas las ajenas aceptadas con prudentes usan una voz con ≥ 91 % de voz detectada (canciones 3, 4, 7, 9, 14 y 18). Con las constantes actuales, la métrica no es lo bastante discriminante con voces densas, y los fines prudentes (que se ajustan a la voz del audio sobre el que se evalúa) lo agravan.

## Pregunta

Se registra el resultado para cerrar la 0222 (sin cambios en `pasoComprobar` ni en `busqueda.ts`). Se pregunta si, dado el resultado, el criterio (c) debe seguir siendo «0 ajenas» sobre una biblioteca real o debe expresarse de otro modo (p. ej. ajenas ≤ 1 % y solo con voz no densa), y si la preparación automática debe seguir eligiendo letras con el criterio 3 del ADR 0025 sabiendo que 6/272 ajenas pasan (en la práctica los candidatos son versiones de la misma canción, no letras de otras: no se ha medido esa situación, que es la que importa para elegir). Ver también 0275 (desfase).

## Opción provisional

Se queda como está (respuesta de la 0222).
