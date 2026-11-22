# 0291 — Feature 1 · Sección «Letra en pantalla» del panel Estilo
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0287, 0290
- ADRs: 0022, 0018
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 1)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Controles, ejemplo y reemplazo por canción en el panel Estilo.

## Criterios de aceptación
- [ ] Tres grupos de radio, resumen dinámico, aviso de movimiento reducido, «Ver un ejemplo» y «Cambiar solo en esta canción / Usar la del tema» como en la spec.
- [ ] Cada cambio es un paso de deshacer; las opciones no disponibles son `aria-disabled` con motivo; se recuerda la elección de «Líneas ya cantadas».
- [ ] Vista previa en menos de 100 ms.

## Pruebas de feedback
- Unitarias: Componente con el reducer del editor: pasos de deshacer, `pasadas` recordadas, reemplazo por canción.
- E2E: Si la spec pide capturas, en la tarea de verificación.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
