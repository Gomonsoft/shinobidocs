# 0366 — Regla exacta del fin por parte: el fin automático sigue yendo hasta la siguiente línea de cualquier parte

- De: programador (prueba técnica 0356)
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (la tarea 0357 puede empezar con la opción aplicada)

## Contexto

ADR 0029 §7 dice «fin limitado por la siguiente línea **de la misma parte**; “Todos” cuenta como de todas las partes de cantante». No dice qué pasa con el fin **automático** (`fin_ms: null`) ni con las pausas ni con las palabras. Si el automático también fuese «hasta la siguiente de la misma parte», en un dúo que alterna líneas cada línea se alargaría hasta la siguiente suya (hasta 8 s) y todo se solaparía sin que nadie lo pidiera; además `0.2.2` y las funciones automáticas esperan que un fin automático nunca se pase de la línea siguiente.

## Aplicado en el spike (parche de 5 archivos, +52 −13 líneas; 908 pruebas existentes sin cambios)

1. **Los inicios siguen crecientes en toda la letra** (dos que empiezan a la vez se separan 1 ms). Cambia nada.
2. **El fin FIJADO** (`fin_ms` explícito) y **las palabras** pueden pasar del inicio de una línea de otra parte, pero no del de la siguiente línea que «choca»: misma parte; «Todos» con cualquier cantante (c1…c4) pero no con el coro; coro con coro; **una pausa choca con todo** (es una barrera).
3. **El fin AUTOMÁTICO sigue siendo el inicio de la siguiente línea de cualquier parte.** Un solape solo existe porque alguien fijó el fin.
4. Quien llama a `moverInicioLinea` conserva el orden global de inicios, pero solo la anterior que choca pierde su fin fijado.
5. `normalizarLetra` (al corregir el texto en la vista Letra) recorta contra la siguiente que choca, no contra la siguiente a secas; sin esto, corregir una coma borraría los solapes.
6. El editor preciso (`limitesEditorDe`) deja alargar la línea hasta la siguiente que choca.

## Pregunta

¿Confirmas la regla (sobre todo el punto 3) para fijarla en ADR 0029 §7 y en 0357?

## Opción provisional tomada (si no bloquea)

La de arriba.

## Respuesta

Arquitecto, 2026-11-23. **Confirmada tal cual**, incluido el punto 3: el fin automático sigue llegando a la siguiente línea de cualquier parte, así que solo se solapa lo que alguien fija.
- «Choca»: la misma parte; «Todos» con cantantes, no con el coro; coro con coro; una pausa con todo.
- Se usa `parteDe(linea, letra)`, la lectura tolerante, y no `parte ?? 'c1'`.
- `normalizarLetra` y `limitesEditorDe` usan la misma regla.
Queda en [ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), «Resultado de la prueba técnica de voces a la vez».
