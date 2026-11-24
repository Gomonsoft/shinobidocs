# 0395 — Interfaz de la letra elegida sin comprobar con tu audio
- Estado: Hecha (capturas F5-L13/F5-B18 pendientes)
- Paso del pipeline: 3 (letra) y biblioteca
- Depende de: 0393 (contrato `eleccionSinComprobar`) y de que el diseñador añada los textos a las specs 05 y 02 (pregunta 0394). **Se entrega en el mismo commit que 0393.**
- ADRs: 0025, revisión «Elegir sin comprobar con tu audio…» (2026-11-23, punto 1)
- Spec UX: [05 · 0.2.2 · Feature 5](../ux/05-letra.md#022--feature-5--preparación-desatendida-la-vista-letra) (`let.prep.elegida*`) y [02 · 0.2.2 · Feature 5](../ux/02-biblioteca.md#022--feature-5--lista-para-revisar-y-bandeja-de-pendientes) (línea «Letra elegida automáticamente»), con los textos que fije la respuesta a 0394
- Tamaño: S
- Versión: 0.2.3, [plan 6](../versiones/0.2.3/plan-6.md), punto 2.

## Objetivo
Que ninguna superficie diga «coincide con tu audio» de una letra que la app eligió sin poder comprobarla. Que el usuario sepa que esa letra la tiene que revisar.

## Criterios de aceptación
1. [ ] **Vista Letra** (`vistas/letra/Letra.tsx` y `vistas/letra/preparacion.ts`): con `prep.eleccionAutomatica && prep.eleccionSinComprobar`, el aviso usa el texto nuevo de la spec 05 (clave propuesta `let.prep.elegida.sinComprobar`) en lugar de `LP.elegida`. Mantiene [Ver otras candidatas] y [×], que funcionan igual. Sin `eleccionSinComprobar`, nada cambia.
2. [ ] **Tarjeta de la Biblioteca y bloque «Preparación automática»** (spec 02 y spec 04): donde hoy dice «Letra elegida automáticamente», con `eleccionSinComprobar` se muestra el texto de la spec, por ejemplo «… · sin comprobar». Si la spec no cambia alguna de esas superficies, esa superficie no se toca.
3. [ ] Los textos salen de la spec tal cual. Si la respuesta a 0394 no ha llegado, la tarea no empieza; 0393 tampoco se publica sin ella.
4. [ ] Accesibilidad: el aviso sigue siendo un `role="status"` con el mismo foco que hoy (spec 05, F5-L1).

## Pruebas de feedback
- Unitarias de componente (Vitest + Testing Library):
  - `Letra` con un resumen `eleccionAutomatica: true, eleccionSinComprobar: true` muestra el texto nuevo y no muestra «coincide con tu audio». Con `eleccionSinComprobar: false`, el de siempre;
  - la tarjeta con `eleccionSinComprobar` muestra el texto de la spec 02.
- E2E: si hay una spec de la preparación con la semilla que llega a «Lista para revisar» por elección sin comprobar (tras 0393), se añade la comprobación del texto del aviso. No se crea una spec nueva solo para esto.
- Críticos: no.
- Manual: guía de la feature 5 de 0.2.2, caso 1, paso 1.4: la tarjeta y la vista Letra de una canción elegida sin comprobar.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- Vista Letra: `letra/preparacion.ts` (`LP.elegidaSinComprobar`), `AvisoEleccion.tsx` (icono `circle-help`, negrita), `AvisoEnLinea.tsx` (prop `icono`), `Letra.tsx`. Manda sobre `.corregida`.
- Tarjeta: `biblioteca/tarjeta.ts` (`lineaDeOrigen`, `ayuda`; `textoAriaTarjeta` usa la frase completa), `LineaPaso.tsx` (icono 14 px y `title`), `textosPreparacion.ts`.
- Progreso (F5-P14): `progreso/BloqueResultado.tsx` y `textosPreparacion.ts` (`r1.letraSinComprobar`); `preparacion.ts`: el subpaso «Comprobar» muestra `res.duda` en vez de «Coincide».
- Editor (F5-E7, edición mínima): `editor/preparacion/modelo.ts`, `textos.ts`, `PanelFunciones.tsx` (renglón `letraSinComprobar`), y `fixturesApi.ts` (campo nuevo del resumen).
- Pruebas: `Letra.preparacion.test.tsx` (F5-L9) y `Biblioteca.preparacion.test.tsx` (F5-B14/B16). Sin pruebas de componente para Progreso ni el renglón del editor.
- Pendiente: capturas F5-L13 y F5-B18 (necesitan Playwright; `docs/ux/revisiones/0.2.3-tarea-0395/`).
