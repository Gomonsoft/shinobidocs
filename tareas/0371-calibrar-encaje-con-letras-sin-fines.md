# 0371 — Feature 5 · `calibrar:encaje` con letras sin fines (LRC de LRCLIB) y con fines prudentes
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0368
- ADRs: 0024 §1, 0025 §3 (revisión de la pregunta 0222)
- Spec UX: —
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5 (alpha.2). Lote C (`app/scripts/calibrar-*.ts`).

## Objetivo
Medir si un LRC sin fines cae en «dudosa» en canciones con huecos instrumentales y si evaluar con fines prudentes lo arregla sin aceptar letras ajenas (pregunta 0222).

## Criterios de aceptación
- [ ] `calibrar:encaje` admite `--variantes`. Con ella, cada evaluación (propias, ajenas y desplazadas) se repite en tres variantes:
  - **tal cual**;
  - **sin fines**: todos los `fin_ms` a `null`, como un LRC de LRCLIB;
  - **sin fines + prudentes**: los fines de `proponerAjusteSilencios` con `soloFinesAutomaticos: true, activarComodin: false` sobre el nivel base, aplicados en memoria.
- [ ] El resumen da, por variante, propias aceptadas (x/N) y ajenas aceptadas (x/pares), y dice si se cumple el criterio de adopción de la respuesta a 0222.
- [ ] Sigue siendo solo lectura y sin textos de letra.

## Pruebas de feedback
- Unitarias: `calibrar-encaje.test.ts` con una canción sintética con huecos instrumentales: «sin fines» no se acepta y «sin fines + prudentes» sí; una ajena no se acepta en ninguna variante.
- E2E: Ninguna.
- Críticos: no (solo `app/scripts/`)
- Manual: el usuario lo ejecuta con su biblioteca durante la verificación 0312; las cifras y la decisión van al informe de la feature 5 y al ADR 0025.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
