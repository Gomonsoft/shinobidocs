# 0364 — Feature 1 · Disposición por zonas en pantalla
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0348
- ADRs: 0029 §4 bis, 0022 §2–§3
- Spec UX: docs/ux/07-reproductor.md#disposición-por-zonas y docs/ux/sistema-visual.md#023--varios-cantantes-y-coros (Disposición por zonas)
- Tamaño: L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cada parte en su franja de la pantalla, en el reproductor, la secundaria, la vista previa y el video.

## Criterios de aceptación
- [ ] `renderer/src/karaoke/zonas.ts` con `zonasDePantalla` (orden Coro arriba y cantantes, área 12 %–86 %, separación 0,3 × S, coro a la mitad y 1 línea, cantantes con 2) y `S_zona` calculado una vez por canción y tamaño de ventana, con los mínimos de 0,75 y 0,5 × S (C1-R2, C1-R6).
- [ ] Por zona, `fotogramaEn` sobre su subsecuencia (Todos repetido en cada zona de cantante) con `N = lineas`, `P = 0` y la opción nueva `subidaAlSalir` en `render.ts`; `disponerBloque` en su región (C1-R4, repetición; C1-R5, zona del coro).
- [ ] Opacidad por zona (100 % mientras suena, 55 % si no, lineal en D, instantánea con movimiento reducido) sobre los puestos y antes del suelo de contraste (C1-R3).
- [ ] Indicadores de espera y cuenta en la zona de la línea que viene (C1-R9); «Líneas a la vez» y «Líneas ya cantadas» no se aplican en zonas, y con `zonas: "una"` se ve el bloque de 0.2.2 (C1-R10).
- [ ] Mismo modelo en la vista previa, el reproductor, la secundaria y el anfitrión de exportación en el mismo instante; el diálogo de exportación no tiene controles nuevos (C1-R11, C1-V1, C1-V2).
- [ ] Tiempo de un fotograma de exportación con 3 zonas frente a 0.2.2, anotado en las notas.

## Pruebas de feedback
- Unitarias: `zonas.test.ts` (geometría en 50 instantes a 1920 × 1080 y 1280 × 720, 4:3, ningún cambio de posición, opacidad), `render.test.ts` (`subidaAlSalir`), test compartido de modelo entre superficies.
- E2E: Ampliar `exportacion.spec.ts` con 20 fotogramas de un dúo con coro (C1-V1).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
