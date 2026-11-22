# 0319 — Feature 8 · Exportación por lotes en main
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0339
- ADRs: 0026 §5, 0019
- Spec UX: docs/ux/10-exportacion.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`destinoCarpeta`, `iniciarLote`, `loteId`, `cancelarLote` y `reintentarLote`.

## Criterios de aceptación
- [ ] Nombres repetidos, `siExiste`, espacio total, instantáneas al confirmar, detención con `SIN_ESPACIO`/`DESTINO_NO_DISPONIBLE`.

## Pruebas de feedback
- Unitarias: `servicio.test.ts` de exportación con dobles.
- E2E: Ninguna (la de 0321).
- Críticos: sí
- Manual: Exportar 3 canciones reales a una carpeta.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
