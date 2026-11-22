# 0294 — Feature 2 · Aviso de colores que se confunden y controles
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0293, 0291
- ADRs: 0022 §5
- Spec UX: docs/ux/06-editor.md y docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 2)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Casilla del tema, casilla global en Ajustes y aviso de daltonismo en el panel Estilo.

## Criterios de aceptación
- [x] `confusionDaltonismo` (Machado 2009) y aviso `daltonismo` en `evaluarContraste`.
- [x] Controles y textos de las specs 06 y 08 · Feature 2.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [x] La comprobación de daltonismo es una función de dos colores con nombres neutros, `confusionDaltonismo(a, b)`, reutilizable con otros pares.

## Pruebas de feedback
- Unitarias: `contraste.test.ts` con los pares de la spec; componentes del panel y de Ajustes.
- E2E: Ninguna.
- Críticos: sí
- Manual: Simulador de daltonismo o escala de grises con rojo/verde.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecho:
- `karaoke/contraste.ts`: `confusionDaltonismo(a, b)` (dos colores neutros; ΔE76 normal ≥ 25 y menor ΔE simulado < 25, Machado 2009 severidad 1,0 en RGB lineal con protanopía y deuteranopía), `deltaESimulado`, aviso `daltonismo` en `evaluarContraste` (se calla con subrayado en el estilo), `informativos: ['diferencia']` cuando el estilo subraya y `sugerirResaltado` prefiere los que no se confunden.
- Panel Estilo (`PanelEstilo.tsx`): casilla «Subrayar lo ya cantado» bajo los colores (D2/D3), ayuda, nota del ajuste del equipo, nota de Letra lista, línea de resumen en D1/D4, aviso nuevo con las acciones «Subrayar lo ya cantado» (marca la casilla y le da el foco) y «Sugerir un color de resaltado», e informativo `diferencia` con subrayado. La casilla no escribe la clave al desmarcar. Textos en `estilo/textosSubrayado.ts`.
- Ajustes: casilla «Subrayar siempre lo ya cantado» en `ReproductorAjustes` (guarda al cambiar; si falla vuelve al valor anterior y muestra el toast).
- Pruebas: `contraste.test.ts` (rojo/verde avisa, blanco/amarillo no, simétrica, subrayado la calla, F2-E7, F2-E8), `PanelEstilo.test.tsx` (F2-E1, E5, E6, E7, E8), `ReproductorAjustes.test.tsx` (F2-A1 a A3). El test de Letra lista de `PanelEstilo.test.tsx` cuenta ahora dos notas `soloEditor` (aviso y casilla).
- Pendiente: F2-E4 (nota con Ajustes activo) cubierta por código pero sin test de montaje del Editor; F2-E9/E10 por código sin test propio; capturas F2-E11/A4 y verificación manual con simulador (comprobar también que ningún tema incluido avise).
