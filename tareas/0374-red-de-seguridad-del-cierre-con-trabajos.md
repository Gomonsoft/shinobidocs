# 0374 — Feature 5 · Red de seguridad del cierre con trabajos
- Estado: Pendiente
- Paso del pipeline: 0 (transversal)
- Depende de: 0309
- ADRs: 0025 §5 (revisión de la pregunta 0236), 0010 (cierre con guardado pendiente)
- Spec UX: — (sin cambios visibles)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5 (alpha.2). Lote D (`main/cierre.ts`, `main/trabajos/**`).

## Objetivo
Que la app pueda salir aunque el renderer no pueda responder a la solicitud de cierre, sin perder la reanudación.

## Criterios de aceptación
- [ ] Con una solicitud de cierre pendiente (`ControlCierre.pendiente()` no es `null`), main trata la solicitud como «Salir» confirmado si la ventana principal: emite `render-process-gone`, tiene el `webContents` destruido, o emite `unresponsive` y no vuelve a `responsive` en 10 s.
- [ ] «Salir» confirmado así hace lo mismo que la confirmación del usuario: cancela los trabajos con motivo `cierre`, conserva el diario `trabajos/pendientes.json` y deja la preparación `detenida` por cierre.
- [ ] El registro de la app anota la causa.
- [ ] Mientras el renderer responda, **no** hay límite de tiempo: el diálogo espera al usuario.

## Pruebas de feedback
- Unitarias: `cierre.test.ts` con una ventana falsa: caída del renderer con solicitud pendiente → sale y el diario se conserva; `unresponsive` + 10 s (reloj falso) → sale; `unresponsive` y `responsive` antes de 10 s → sigue esperando; sin solicitud pendiente no hace nada.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
