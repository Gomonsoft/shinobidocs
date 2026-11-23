# 0381 — Feature 4 · `calibrar:encaje` con las guardas de fiabilidad y el criterio de seguridad
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0378
- ADRs: 0024 (revisión «Medida con canciones reales y guardas de prudencia»)
- Spec UX: —
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 4. Lote C (`app/scripts/calibrar-encaje.ts`).

## Objetivo

Que el script mida lo que importa al producto: si la app afirma algo falso (acepta una ajena, dice «coincide» de una letra desplazada o corrige mal). También, cuántas letras buenas pierde por prudencia, para recalibrar con canciones revisadas.

## Criterios de aceptación

- [ ] Por canción propia: `densidadVoz` (en %), `contrasteF`, `limitacion` y `veredictoBase` junto a lo que ya imprime.
- [ ] Resumen (y por variante con `--variantes`):
  - propias `coincide` (con guardas) y propias que serían `coincide` sin guardas (`veredictoBase`);
  - ajenas aceptadas (`coincide` o `desfasada`);
  - **desplazadas de ≥ 0,8 s que salen `coincide`** (falsos «coincide»);
  - propias `desfasada` (falsas correcciones);
  - desplazadas `desfasada` con `|error| > 200 ms` (correcciones equivocadas);
  - desplazadas recuperadas (±50 ms y ±200 ms).
- [ ] Una línea `Criterio de seguridad (ADR 0024, revisión 2026-11-22): SÍ/NO`. Es SÍ si, en la variante tal cual (y en «sin fines» con `--variantes`), son 0 a la vez: las ajenas aceptadas, los falsos «coincide», las propias `desfasada` y las correcciones equivocadas. La línea del criterio de la pregunta 0222 sigue igual.
- [ ] `--json` incluye los campos nuevos. Sin las opciones nuevas, las filas de siempre no cambian de formato salvo las columnas añadidas. Sigue siendo de solo lectura y sin textos de letra.

## Pruebas de feedback

- Unitarias: `calibrar-encaje.test.ts` con la biblioteca sintética de la 0371 más una canción de voz casi continua. La ajena sobre la voz continua no se acepta; la propia de esa voz cuenta como «sin guardas: coincide / con guardas: dudosa»; el criterio de seguridad sale SÍ. Y un caso construido en el que sale NO (p. ej. pasando parámetros con `densidadVozMaxima: 1`, `contrasteMinimoF: 0`).
- E2E: Ninguna.
- Críticos: no (solo `app/scripts/`).
- Manual: `qa` lo ejecuta sobre la copia de las 18 canciones (tarea 0301), y el usuario con canciones revisadas (pregunta 0280).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

Hecha (2026-11-22, programador).

- `app/scripts/calibrar-encaje.ts`: por propia, columnas `voz%`, `contraste`, `limitación` y `sin guardas` (`veredictoBase`); el resumen (y cada variante con `--variantes`) da propias `coincide` con y sin guardas, propias `desfasada`, ajenas aceptadas, desplazadas ≥ 0,8 s que dicen `coincide`, correcciones con error > 200 ms y recuperadas a ±50 y ±200 ms. Línea final `Criterio de seguridad (ADR 0024, revisión 2026-11-22): SÍ/NO` (tal cual, y también «sin fines» con `--variantes`). La línea de la pregunta 0222 no cambia. `--json` lleva los campos nuevos (`seguridad`, resumen ampliado, filas con `limitacion`...). Sigue de solo lectura y sin textos de letra.
- Opción nueva solo para pruebas: `calibrarEncaje(raiz, { parametros })` (parámetros del encaje parciales; el CLI no la expone).
- `calibrar-encaje.test.ts`: biblioteca sintética con una canción de voz casi continua (propia `dudosa`/`vozContinua`, sin guardas `coincide`; ajena no aceptada; seguridad SÍ) y un caso NO (con `densidadVozMaxima: 1.1` y `contrasteMinimoF: -1`; el contraste puede ser negativo, por eso `0` no desactiva la guarda).
- Cifras sobre la copia de las 18 canciones: ver el informe del programador (tarea 0378).
