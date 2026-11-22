# 037 — Prueba técnica de voces a la vez (etapa 3 de varios cantantes)

- Estado: Aceptada (versión 0.2.3, feature 3 condicionada a la prueba técnica; provisional, pregunta 0165)
- Origen: arquitecto, al revisar las referencias visuales del usuario para 0.2.3 (2026-11-22)
- Fecha: 2026-11-22
- Relacionadas: propuesta [036](036-varios-cantantes-y-coros.md) (etapas 3 y 4), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) §6, [factibilidad](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md) §3.2 y §4.3, pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md) (ampliación de 0.2.3)

## Problema

Dos de las tres referencias que aportó el usuario muestran **voces a la vez**: dos cantantes con frases distintas en pantalla al mismo tiempo, cada uno con su barrido, y coros que acompañan a la voz principal en otra zona de la pantalla. 0.2.3 solo reparte líneas **enteras y una detrás de otra**: cuando dos voces se pisan, hay que asignar la línea a «Todos» o elegir quién guía. Hacerlo bien cambia la regla central de la letra (un fin no puede pasar del inicio siguiente, ADR 0006) y el modelo de puestos de la letra en pantalla (ADR 0022), y obliga a revisar el encaje, la alineación, la revisión guiada y el `.lrc`.

## Propuesta

Una **prueba técnica** en `docs/spikes/` (sin código de producción) que se puede hacer **durante 0.2.3**, en paralelo, y que decide si la etapa 3 entra en 0.3.0:

1. La regla «inicios crecientes en toda la letra + fin limitado solo por la siguiente línea **de la misma parte**» aplicada a 3 dúos reales del usuario, sincronizados a mano: ¿cubre los solapes reales sin rehacer la lista ni el modo al ritmo?
2. El modelo de grupos simultáneos de la letra en pantalla (varias filas en un puesto, coro como fila satélite arriba o abajo) con la letra sintética de los tests de 0.2.2 y alturas de 3 y 4 renglones.
3. Coste de render de la exportación por fotogramas con 4 filas activas en un equipo modesto.
4. Qué hacer en el encaje, la alineación forzada y la revisión guiada con líneas solapadas (excluirlas o fusionar intervalos).

Con el resultado, un ADR (aceptar la etapa 3 y su forma, o descartarla) y la spec de pantalla con las variantes que muestran las referencias (texto sin cantar teñido por cantante, zona propia del coro).

## Valor y coste

- Valor: dúos con frases cruzadas y coros que acompañan sin cortar la línea principal, que es lo que más se ve en las referencias del usuario.
- Coste estimado: prueba técnica **M**; la etapa 3 después, **L** (unas 5 tareas: con las zonas de pantalla por parte de la feature 1, el render ya no necesita «grupos simultáneos»; ADR 0029 §7).
- Riesgos o dudas abiertas: hacen falta dúos reales sincronizados a mano (los aporta el usuario); la voz separada lleva a todos los cantantes juntos, así que las funciones automáticas no sabrán de quién es cada voz en los solapes.

## Decisión
Provisional (arquitecto, 2026-11-22, tras la indicación del usuario sobre «líneas de tiempo separadas» y «espacios separados»): entra en 0.2.3 como **feature 3 condicionada** a la prueba técnica de la tarea 0356 con el criterio de [ADR 0029 §7](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md). Las zonas de pantalla por parte entran en la feature 1 en cualquier caso, lo que abarata el render de esta. Pendiente de confirmar por el usuario en la ampliación de [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md).
