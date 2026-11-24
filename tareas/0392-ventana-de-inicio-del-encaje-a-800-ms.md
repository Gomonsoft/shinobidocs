# 0392 — Ventana de inicio del encaje a 800 ms (letras de LRCLIB adelantadas)
- Estado: Hecha
- Paso del pipeline: 3 (letra)
- Depende de: — (puede empezar ya)
- ADRs: 0024 (revisión «Letras de LRCLIB adelantadas: ventana de inicio a 800 ms», 2026-11-23)
- Spec UX: — (sin interfaz nueva)
- Tamaño: S
- Versión: 0.2.3, [plan 6](../versiones/0.2.3/plan-6.md), punto 2. Arregla un criterio de «hecha» de 0.2.2 (feature 4).

## Objetivo
Que una letra correcta que va adelantada unos cientos de ms (lo normal en LRCLIB, según la medida del usuario) no salga `no_coincide` («puede ser otra versión») solo porque la voz arranca un poco después de su inicio.

## Criterios de aceptación
1. [ ] En `app/src/shared/encaje.ts`, `PARAMETROS_ENCAJE.ventanaInicioMs` pasa de 400 a **800**. El comentario cita la revisión de ADR 0024 del 2026-11-23. Ninguna otra constante cambia: `vozMinimaInicio` sigue en 0,25, `desfaseMinimoMs` en 500 y los umbrales de F e I y las guardas tampoco cambian.
2. [ ] `shared/dudosas.ts` no cambia: `vozTarde` sigue mirando sus 500 ms.
3. [ ] `npm run calibrar:encaje` no necesita cambios: toma la constante de `PARAMETROS_ENCAJE`. Su cabecera lo dice si algún comentario cita 400 ms.

## Pruebas de feedback
- Unitarias (`shared/encaje.test.ts`):
  - voz sintética con cantos separados por silencios y una letra con los mismos cantos **adelantada 350 ms** (con 400 ms solo caben 50 ms de voz; con 800, 450): `i0 = 1`. Con `{ ...PARAMETROS_ENCAJE, ventanaInicioMs: 400 }`, `i0 < 0,9`. Así se ve que la prueba mide el cambio. Los cantos duran 2 s o más, para que el borde de `detectarVoz` no decida;
  - la letra de otra canción sobre esa voz (las pruebas de ajenas que ya existen) sigue sin `coincide` ni `desfasada`;
  - las pruebas que ya existen pasan. Si alguna fijaba un `i0` calculado con 400 ms, se ajusta la cifra y se dice cuál en la nota de implementación.
- E2E: ninguna.
- Críticos: no.
- Manual: guía de la feature 4 de 0.2.2, caso 1 (equipo con Windows): `calibrar:encaje --variantes` sobre las canciones revisadas a mano. Criterio de ADR 0024, «Medida pendiente».
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- `app/src/shared/encaje.ts`: `ventanaInicioMs` 400 → 800 (comentario con la revisión de ADR 0024). `dudosas.ts`, `calibrar-encaje.ts` sin cambios (no citan 400 ms).
- Prueba nueva en `shared/encaje.test.ts` («ventana de inicio de 800 ms»): letra adelantada 350 ms, `i0 = 1`; con `p: { ...PARAMETROS_ENCAJE, ventanaInicioMs: 400 }`, `i0 < 0,9`.
- Cifra ajustada: la prueba «|d*| < 500 con I(d*) < 0,95 ≤ I(0)» daba `iDesfase = 1` con 800 ms (su situación se midió con 400 ms). Se mantiene su escenario pasando `ventanaInicioMs: 400` explícito; la guarda que prueba no depende de la ventana.
- Sin E2E. Manual: guía de la feature 4 de 0.2.2, caso 1, `calibrar:encaje --variantes`.
