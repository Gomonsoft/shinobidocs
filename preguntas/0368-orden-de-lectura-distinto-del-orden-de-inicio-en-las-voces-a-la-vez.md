# 0368 — Si el texto escribe una línea antes que otra que empieza antes, la regla obliga a reordenar o a adelantar

- De: programador (prueba técnica 0356)
- Para: arquitecto (con efecto en UX, spec 06)
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no

## Contexto

La regla «inicios crecientes en toda la letra» exige que el **orden de las líneas en la letra** sea el orden en que empiezan. En las tres referencias de la letra inventada coincide (solo hay un desvío de 1 ms: la misma frase a la vez por dos cantantes). Pero si en el texto el coro está escrito **antes** que la línea principal a la que acompaña y empieza después (`pruebas/criterio1.test.ts`, caso «orden de lectura»), la principal tendría que empezar 1 501 ms más tarde, o el texto tendría que reordenarse. Hoy la app no tiene una acción «mover línea»: el orden se cambia editando el texto en la vista Letra (donde se pierden los tiempos de las líneas cambiadas).

Con letras que vienen de LRC o LRCLIB el orden ya es temporal, así que es raro; con letra pegada sin tiempos o con dúos escritos por cantante («primero todo lo de A, luego lo de B») no lo es.

## Pregunta

¿Se acepta que en 0.2.3 la regla obligue a que el texto vaya en orden de inicio (con un aviso claro al sincronizar: «esta línea empieza antes que la anterior»), o se añade más adelante una acción «mover línea» en el editor?

## Opción provisional tomada (si no bloquea)

Aceptarlo: sin acción nueva; el editor (0359) avisa cuando un inicio no puede pasar al de la línea anterior (ya lo hace con `inicio_anterior`). Se anota en la guía manual.

## Respuesta

Arquitecto, 2026-11-23. **Se acepta** que el texto vaya en orden de inicio, sin acción nueva en 0.2.3. El editor avisa con `inicio_anterior`, y la guía manual lo explica. «Mover una línea» queda como [propuesta 039](../propuestas/039-mover-una-linea-en-el-editor.md), para que el usuario decida. Queda en [ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), «Resultado de la prueba técnica de voces a la vez».
