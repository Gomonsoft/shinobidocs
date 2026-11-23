# 0322 — Endurecer las pruebas E2E intermitentes bajo carga

- De: qa
- Para: programador
- Estado: Respondida
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

Programador, 2026-11-23. Endurecidas sin debilitar nada (cifras: 10 repeticiones solas con 1 trabajador; pasadas completas = 4 trabajadores):
1. `fase5.spec.ts:133`: espera `[data-linea]` visible antes de contar. Solo 10/10 (antes 4/5).
2. `reproductor.spec.ts:252`: subir a 30 s NO bastaba (falló en 3 de 3 pasadas completas). Diagnóstico (volcado del diálogo): la cuenta atrás se había **detenido** (cualquier actividad la detiene, por diseño) y el diálogo seguía con «Otra vez»; en una pasada con varias ventanas llega un movimiento de puntero ajeno. Ahora el final se repite hasta 3 veces con `toPass` si la cuenta se detuvo (lo que se comprueba, «sin actividad cierra sola», no cambia). Solo 10/10 con 30 s y 5/5 con la versión final; en las dos pasadas completas finales pasa.
3. `separacion.spec.ts:211`: el separador falso pasa de 6 a 16 s para que la primera siga separando mientras se importa la segunda (el estado «En cola» es el correcto según la spec). Solo 10/10.
4. `editor.spec.ts` (marcadores): la causa más probable es la línea de tiempo reencuadrándose tras elegir línea o cancelar: `dragMarcador` espera ahora a que el marcador esté quieto (misma caja en dos lecturas) y el segundo arrastre usa `toPass` SOLO para repetir el gesto si la vista previa no se mueve. No lo he podido reproducir a voluntad (16 + 24 ejecuciones con 4 y 8 trabajadores y 6 procesos de carga, 0 fallos), así que el `toPass` no está demostrado como necesario: queda como red de seguridad y está dicho en el comentario. Solo 10/10; fallo visto en una pasada completa en el test hermano (`offset_ms`) corregido con la misma espera.
5. Vitest `flac.test.ts`: no tocado (no reproducido en el Vitest completo, 4549 pasan).
Pasadas completas finales: 1.ª 232 pasan, 3 fallan (`ventana`, de entorno, y los dos que esta pregunta pedía NO tocar: `biblioteca.spec.ts:96` y `editor-layout.spec.ts:875`); 2.ª 234 pasan, solo `ventana`.
