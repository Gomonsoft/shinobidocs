# 0365 — Una letra con solapes hace que 0.2.2 y 0.2.1 rechacen la canción entera

- De: programador (prueba técnica 0356)
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (la prueba da «sirve con condiciones»; esta es una de las condiciones)

## Contexto

ADR 0029 §6 dice que 0.2.2 «lee con tolerancia, no lo usa y **lo conserva**» el reparto. Con la feature 3 eso deja de ser cierto para una canción con solapes: `letraSchema` aplica `validarInvariantesLetra` en un `superRefine`, es decir, **al leer** (`app/src/shared/letra.ts`, `.superRefine`), y `cancion.letra` es `letraSchema.nullable()` (`shared/cancion.ts`). Un fin fijado que pasa del inicio de la línea siguiente de otra parte es, para 0.2.2, un invariante roto: el `cancion.json` entero falla al validarse y la canción se vería como dañada (`resumen.danada`). Lo mismo con un paquete de 0.2.3 importado en 0.2.2.

Medido en el spike (`docs/spikes/0029-voces-a-la-vez/pruebas/criterio1.test.ts`, caso «es válida con la regla nueva y no con la de 0.2.2»): la letra inventada con solapes da 7 problemas con la regla de 0.2.2 y `letraSchema.safeParse` falla.

## Pregunta

¿Cómo se trata a las versiones que no conocen los solapes?

## Opción provisional tomada (si no bloquea)

**A. Aceptar la pérdida, como la de 0.2.1 con el reparto** (ADR 0029 §6): una canción con solapes no se abre en 0.2.2 ni 0.2.1. Es la más barata y la única que no añade campos. Condiciones que propongo para 0357: (1) decirlo en las notas de la versión; (2) que `guardarTiempos` solo escriba un fin que pase del inicio de otra parte cuando la canción ya tiene reparto, de modo que una canción **sin solapes** siga abriéndose en 0.2.2 (la prueba 1.3 lo comprueba: 2 000 letras sin solapes, mismos resultados).

## Alternativas

- **B. Guardar el fin recortado y el real aparte**: `fin_ms` sigue cumpliendo la regla vieja (recortado al inicio de la siguiente línea) y un campo nuevo opcional, p. ej. `fin_solapado_ms`, lleva el fin real. 0.2.2 abre la canción y ve las líneas cortadas; al guardar pierde el campo. Cuesta un campo nuevo y que `finEfectivo` lo lea (la misma superficie de cambio que ya medí), y contradice «sin campo nuevo» de §7.
- **C. Subir `esquema_cancion` a 2 solo cuando haya solapes**: 0.2.2 rechazaría con un mensaje claro en lugar de «dañada». Cuesta migración.

## Respuesta

Arquitecto, 2026-11-23. **Opción A, con sus condiciones.** Queda en [ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), «Resultado de la prueba técnica de voces a la vez».
- Una canción con solapes no se abre en versiones anteriores, que la ven dañada. **No se pierde nada**: una canción dañada no se reescribe y vuelve a abrirse con 0.2.3.
- No compensa hacer tolerante a la 0.2.2. Aunque esté en `develop` sin publicar, no se publicará por separado (sale junto con 0.2.3), así que el único caso real es 0.2.1, ya publicada.
- B (`fin_solapado_ms`) protegería 0.2.1 a costa de duplicar la regla del fin y de las palabras.
- C (subir `esquema`) daría el mismo «dañada» en 0.2.1.
- Condiciones:
  - (1) las notas de la versión lo dicen;
  - (2) los solapes solo aparecen con reparto y con un fin fijado a mano o con los tiradores. Sin reparto todo es `c1` y la regla es la de 0.2.2, así que se cumple por construcción y lo fija un test de 0357;
  - (3) el criterio de 0357 que pedía «sin marcarla como dañada» se sustituye por este.
- La decisión final de alcance es del usuario (0165, fila 10).
