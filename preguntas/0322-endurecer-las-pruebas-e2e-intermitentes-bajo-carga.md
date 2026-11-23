# 0322 — Endurecer las pruebas E2E intermitentes bajo carga

- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no

## Contexto

Clasificación con datos en [pruebas.md](../pruebas.md#intermitentes-bajo-carga-clasificación-2026-11-23): dos pasadas completas de Playwright y 5 repeticiones sueltas de cada una.

## Pregunta

¿Se endurecen, en este orden?

1. `app/e2e/fase5.spec.ts:133`: falla 1 de 5 **incluso sola**. `secundaria.locator('[data-linea]').count()` (línea ~204) se lee sin esperar a que la secundaria pinte: `await expect(secundaria.locator('[data-linea]').first()).toBeVisible()` antes.
2. `app/e2e/reproductor.spec.ts:252`: falla en las dos pasadas completas. El `toHaveCount(0)` del diálogo «Reproductor de …» tiene 12 s de tiempo; con carga hace falta más (30 s) o esperar al evento de fin de la cuenta atrás.
3. `app/e2e/separacion.spec.ts:211`: el subpaso 2 se espera «En cola» y con carga ya va «en curso» (línea del `toContainText('En cola')`): aceptar los dos estados o usar un escenario más lento del separador falso.
4. `app/e2e/editor.spec.ts:447` (antes 410): envolver el segundo arrastre en `expect(async () => …).toPass()` (ya propuesto el 22-11).
5. Vitest `main/biblioteca/flac.test.ts:125` (`status` 143): sacarlo del paralelismo con las pruebas que matan procesos.

No tocar `biblioteca.spec.ts:96`, `editor-layout.spec.ts:875`, `editor.spec.ts:479` ni `letras.spec.ts:415`: hoy pasan 2 de 2 bajo carga y 5 de 5 solas.

## Opción provisional tomada (si no bloquea)

Solo documentado; no se toca ninguna prueba ajena.

## Respuesta
