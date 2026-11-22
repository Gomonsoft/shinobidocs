# 0286 — Feature 3 · Verificación, capturas e informe
- Estado: Hecha con reservas (D1 y D2 abiertos, verificación manual y CI pendientes)
- Paso del pipeline: 0
- Depende de: 0284, 0285
- ADRs: 0023
- Spec UX: docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 3)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 3.

## Criterios de aceptación
- [x] Criterios de aceptación de las specs 08 y 09 (Feature 3) comprobados o anotados (F3-P1 no se cumple a 1024 × 576: defecto D2).
- [ ] Capturas que pida la spec, si las pide (F3-A19: no tomadas; van a la guía manual, caso 10).
- [x] Informe en `docs/versiones/0.2.2/informe-feature-3.md` con el resultado del CI y lo que pasa a la guía manual.
- [x] Pregunta 0037 enlazada como cerrada.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecha por `qa` el 2026-11-22. Informe: [informe-feature-3.md](../versiones/0.2.2/informe-feature-3.md). Guía manual: [feature-3-aviso-de-version-nueva.md](../Test-manuales/0.2.2/feature-3-aviso-de-version-nueva.md).

**Ejecutado (Mac M1):** typecheck, lint y format:check limpios; Vitest de la feature 193 pasan; `test:cambios` 2741 pasan y 1 falla inestable ajena (`sesion.test.tsx:269`, pasa suelto); `actualizaciones.spec.ts` 2/2; críticos 1/1.

**No verificado aquí:** CI de GitHub (sin PR borrador), consulta real contra Releases, «Descargar» por sistema, lector de pantalla y capturas F3-A19 (todo en la guía manual).

**Abiertos:** D1 (`servicio.ts:140`/`:175`, consulta posible antes de `iniciar()`) y D2 (F3-P1 falla a 1024 × 576: B1 hace 90 px de scroll, 30 ya previos). Se añadió a `INSTALAR.md` la sección «Actualizar a una versión nueva» (spec 09 §F3.2). Quedan fuera §F3.1, §F3.3 y §F3.4 de la spec 09 (README y notas).
