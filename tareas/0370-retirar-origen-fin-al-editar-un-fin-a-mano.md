# 0370 — Features 4, 10 y 11 · El editor retira `origen_fin` al fijar un fin a mano
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0335
- ADRs: 0024 §4 (revisión de la pregunta 0225), 0028 §3.2
- Spec UX: — (sin cambios visibles)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)). Feature 11 (alpha.2). Lote C (reducer del editor). Tiene que estar hecha antes de que la feature 10 o la preparación (0308) apliquen fines automáticos.

## Objetivo
Que un fin fijado a mano no conserve un `origen_fin` automático. Si lo conserva, «Sincronizar con la voz» y la preparación lo tratan como automático y pueden sustituirlo (ADR 0028 §3.2: solo se respetan los fines sin `origen_fin`).

## Criterios de aceptación
- [x] En `vistas/editor/estado.ts`, toda acción del usuario que fija o mueve el fin de una línea quita `origen_fin` de esa línea en el mismo paso de deshacer: tirador de la línea de tiempo, tecla O, campo de fin, editor preciso, «Fin al final de la voz» de la revisión si el usuario ajusta después, y cualquier otra vía del reducer.
- [x] Las acciones automáticas («Ajustar los silencios», «Fin al final de la voz», «Sincronizar con la voz») ponen su `origen_fin` como hasta ahora.
- [x] Borrar el fin (volver a automático) quita `origen_fin`, como ya hace main.
- [x] Deshacer recupera el `origen_fin` anterior.

## Pruebas de feedback
- Unitarias: `estado.test.ts`: una línea con `origen_fin: "silencios"` cuyo fin se mueve a mano queda sin `origen_fin`; las acciones automáticas lo ponen; deshacer lo devuelve.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
`estado.ts`: `sinOrigenFinCambiado` quita `origen_fin` de las líneas cuyo `fin_ms` cambia en `cambiarTiempos` (tirador, O, campo, flechas, fin automático), `aplicar_preciso`, `marcar` y `fin_al_soltar`; `ajustar_silencios` no pasa por ahí y conserva su `origen_fin`. Tests en `estado.test.ts`. Probar: `npx vitest run src/renderer/src/vistas/editor/estado.test.ts`.
