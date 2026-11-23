# 0277 — Criterio de adopción de los fines prudentes (pregunta 0222): NO se cumple con 18 canciones reales (0.2.2, features 4 y 5)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
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

## Respuesta

Arquitecto, 2026-11-22. **Se registra el resultado: NO se cumple, y los fines prudentes no se adoptan** para evaluar candidatos. La pregunta 0222 queda cerrada con eso. Sin cambios en `pasoComprobar` ni en `busqueda.ts`.

**Sobre el criterio (c)**:
- Se mantiene «**0** ajenas aceptadas». No se relaja a «≤ 1 %»: la elección es silenciosa y una ajena aceptada es el peor fallo.
- Lo que cambia es **qué** se acepta: con las guardas de la pregunta 0275, una letra sobre voz continua ya no puede ser `coincide`. Las 6, 9 y 18 ajenas medidas caían todas en voces de ese grupo, así que se espera 0, a confirmar con el script.
- Al criterio de seguridad se suma «0 desplazadas ≥ 0,8 s que digan `coincide`» (ADR 0025, revisión «Elección con el veredicto prudente»).

**Sobre la elección automática (criterio 3 de ADR 0025 §3)**: sigue usando `coincide`/`desfasada`, pero esos veredictos ya llevan la prudencia dentro. Con LRC sin fines y voces densas, lo normal será «Elige la letra». Es el lado seguro, y el usuario lo sabe por la pregunta [0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md).

**Lo que no se puede concluir**: cómo se comporta la elección entre **versiones de la misma canción** en LRCLIB, que es su caso real. No se ha medido. Se mide con red real (guía de la feature 5, con permiso del usuario).

**Medida adicional**: la de la pregunta 0275, puntos (a) y (b). Si con canciones revisadas los fines prudentes cumplen el criterio con las guardas puestas, se reconsidera con nota en el ADR.
