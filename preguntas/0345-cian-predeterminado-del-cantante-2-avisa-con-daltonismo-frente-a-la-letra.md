# 0345 — El cian predeterminado del Cantante 2 da un ⚠ de daltonismo frente a la letra blanca

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (se deja la paleta de la spec tal cual y la tarea 0347 avisa de la excepción)

## Contexto

Tarea 0347, criterio «Con los predeterminados y el tema «Shinobi» no hay ningún ⚠; si lo hubiera, propuesta al diseñador y nota en ADR 0029». Se ha comprobado cada color de [sistema visual · 0.2.3](../ux/sistema-visual.md#023--varios-cantantes-y-coros) con las funciones reales de `contraste.ts` (WCAG para el fondo, ΔE76 y simulación Machado de protanopía y deuteranopía, como en 0.2.2 · Feature 2), sobre el tema «Shinobi» (letra `#FFFFFF`, lo ya cantado `#FFD400`, fondo `#1B1033 → #5A1E6E`):

| Ranura | Color | Ratio con el fondo (peor muestra) | ΔE con la letra | ΔE simulado (menor) con la letra | Resultado |
|---|---|---|---|---|---|
| Cantante 2 | `#4ADEDE` | 6,93 | 43,9 | **16,5** (protanopía) | ⚠ `edi.contraste.parteLetra` (variante daltonismo) |
| Cantante 3 | `#FF5C8A` | 3,87 | 75,8 | 36,9 | ok |
| Cantante 4 | `#7CFF6B` | 8,87 | 86,9 | 54,6 | ok |
| Todos | `#B388FF` | 4,27 | 75,6 | 63,8 | ok |
| Coro | `#FF9F1C` | 5,54 | 83,0 | 77,3 | ok |

Solo falla el cian, y solo frente a una letra blanca con protanopía; la spec lo había calculado a mano solo contra el fondo. Además salen ⓘ informativos (sin punto en la pestaña): Cantante 1 (oro) con Cantante 4 y con Coro, y Cantante 4 con Coro, como la spec ya preveía.

Consecuencia: **cualquier dúo con los colores por defecto muestra un ⚠ en «Estilo»** («Con daltonismo, el color de Luis puede no distinguirse de la letra.»), salvo que el estilo tenga subrayado (entonces no hay aviso). El aviso es correcto; lo que no es deseable es que salte sin que el usuario haya tocado nada.

## Aplicado (conservador)

No se cambia ningún valor de la paleta (viven en `shared/reparto.ts`, contrato de la tarea 0340, y los fija el sistema visual). `evaluarPartes` aplica la spec al pie de la letra y el test `contraste.test.ts` documenta que el único ⚠ por defecto es el del cian.

## Pregunta

¿Qué se hace con el Cantante 2?

1. **Recomendada**: cambiar la ranura a un cian más profundo que pasa los tres umbrales con la letra blanca: `#35C6E8` (ratio 5,63; ΔE con la letra 46,0; simulado 31,9) o `#2BB5B5` (ratio 4,54; ΔE 48,8; simulado 30,1). Cambia una constante de `shared/reparto.ts`, la tabla del sistema visual y la nota de ADR 0029 §4 («Paleta predeterminada»).
2. Dejar `#4ADEDE` y aceptar el ⚠ por defecto en los dúos (se arregla con «Sugerir un color» o «Subrayar lo ya cantado»).
3. Relajar la comprobación del color de parte frente a la letra a «solo ΔE normal» (sin simulación de daltonismo). Pierde la señal de daltonismo que sí pedía la spec.

## Respuesta

Diseñador UX, 2026-11-23. **Opción 1, con `#35C6E8`.** Frente al tema «Shinobi» pasa las tres comprobaciones con tus cifras (5,63:1 con el fondo, ΔE 46,0 con la letra, ΔE simulado 31,9) y conserva el contraste más alto de las dos propuestas (`#2BB5B5` se queda en 4,54:1 y oscurece la ranura hacia un verde azulado más cercano a la lima en daltonismo). Sigue leyéndose como «cian/azul claro», distinto de rosa, lima, lavanda y naranja.

Spec actualizada: [sistema visual · 0.2.3](../ux/sistema-visual.md#023--varios-cantantes-y-coros) (tabla de colores por ranura) y el wireframe de «Colores de los cantantes» de la spec 06. El ADR 0029 §4 lo anota el arquitecto.

**Cambio de código**:
- `shared/reparto.ts`: en `COLORES_PARTES_PREDETERMINADOS`, `c2: '#35C6E8'` (en lugar de `'#4ADEDE'`). Las demás ranuras no cambian.
- Tests que fijan el valor: los de `shared/reparto.test.ts` (predeterminados y `colorDeParte`) y `contraste.test.ts` (`evaluarPartes` con el tema «Shinobi»): este último debe pasar a afirmar **ningún ⚠** con los predeterminados (los ⓘ informativos entre ranuras se mantienen como ya preveía la spec). Si algún test de render o captura fija el color del barrido de Cantante 2, actualizarlo igual.
- La muestra `#4ADEDE` de las sugeridas de §8 (selector de color) no cambia.
