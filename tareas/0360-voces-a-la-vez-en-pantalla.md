# 0360 — Feature 3 · Voces a la vez en pantalla y en el video
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0357, 0364
- ADRs: 0029 §4 bis y §7, 0022
- Spec UX: docs/ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: S (revisado tras la prueba 0356)
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Prueba 0356: sirve** (2026-11-23). Pendiente de la confirmación del usuario (0165, fila 10). Dueño: lote C (`zonas.ts`, `PantallaLetra.tsx`), con 0364 hecha.

## Objetivo
Que cada zona barra su línea aunque otra zona también esté cantando.

## Criterios de aceptación
- [ ] Varias zonas al 100 % a la vez, cada una con sus tiempos; indicadores de espera solo cuando no suena ninguna (C1S-R1).
- [ ] Fuera de los solapes, el modelo es idéntico al de la feature 1 (C1S-R2); el anfitrión de exportación da el mismo modelo en los solapes (C1-V1).
- [ ] El fin automático de cada línea se resuelve en la letra entera antes de repartir en zonas (ya lo hace `conFin` de 0364). Un test con dos voces que se alternan lo fija.
- [ ] **Repetir el criterio 2 de la prueba con la 0364 real** (`SPIKE_ZONAS_REALES=1`, README del spike): 3 zonas ≤ 1,25 × 0.2.2 con 5 líneas a 1920 × 1080, y 4 zonas a 60 FPS sin fotogramas sin asentar. Si no se cumple, la feature se para y se pregunta al arquitecto.

## Pruebas de feedback
- Unitarias: `zonas.test.ts` y `PantallaLetra.test.tsx` con la letra de la prueba (10 instantes del solape).
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** Casi todo lo resolvían ya las zonas de 0364 (cada zona es una secuencia independiente y `conFin` resuelve el fin en la letra entera). Lo que faltaba:
- `render.ts`: `Indice.finesMax` (fin más tardío hasta cada línea). La espera solo existe cuando ninguna línea suena (`t >= finesMax`) y cuenta desde ese fin, no desde el de la última línea en empezar (que puede acabar antes que otra más larga). Sin solapes `finesMax` = `fines`: el modelo no cambia (los tests de 50 instantes y `exportacion.spec.ts` pasan sin tocar).
- «Todos» cuenta para todas las zonas de cantante (ya repetida en cada una) y no se solapa con ellos; con el coro sí puede.
- Fixture `shared/__fixtures__/voces.ts` (`cancionVocesAlaVez`: Marta e Iván, un coro, «Todos»; válida con la regla de 0357) y semilla E2E opt-in `sembrar(datos, { voces: true })` (`npm run semilla -- --voces`, id `…0052`, «Voces a la vez: dúo con coro»).
- Tests: `zonas.test.ts` (8 nuevos: letra válida y con solapes, 10 instantes del solape con 2–3 zonas al 100 % y barridos propios, coro con la principal, Todos, espera solo sin sonido, línea larga con una corta dentro, voces que se alternan, y los 50 instantes de la feature 1 sin cambios), `PantallaLetraReparto.test.tsx` (2), `AppExportacion.test.tsx` (C1-V1 con 20 instantes del solape), `semilla.test.ts`.

**Criterios.** (1) C1S-R1 cumplido. (2) C1S-R2 y C1-V1 cumplidos. (3) El fin automático en la letra entera (test de dos voces que se alternan) cumplido. (4) **Medida repetida con la 0364 real** (`SPIKE_ZONAS_REALES=1`, 1920 × 1080, 3 rondas, M1): base 18,1 ms/fotograma; 3 zonas 16,9 (0,94 ×); 4 zonas a 30 FPS 16,8 (0,93 ×); 5 zonas 16,8 (0,93 ×); a 60 FPS, base 17,2 y 4 zonas 16,7 (0,97 ×); la letra inventada de la prueba (3 zonas) 16,7 (0,93 ×); 0 fotogramas sin asentar y 0 reintentos en los 7 escenarios (1 800 fotogramas a 60 FPS con 4 zonas). Pasa de largo el límite de 1,25 ×.

**Capturas** (1920 × 1080 y 1280 × 720, en `docs/ux/revisiones/0.2.3-feature-3/`; `SHINOBI_CAPTURAS_023_3=1 npx playwright test e2e/capturas-023.spec.ts -g "feature 3" --workers=1`): `dos-voces`, `tres-voces-con-coro`, `dos-voces-final`, `todos-sin-solape`, `espera-tras-solape`.

**No comprobado.** Un dúo real; voz real y a oído; «Todas en un bloque» con solapes (pregunta 0380); la ventana secundaria con solapes (usa el mismo `PantallaLetra`, sin prueba propia).
