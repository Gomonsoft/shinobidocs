# 0369 — Feature 4 · «Quitar la corrección» impide que la letra se vuelva a corregir sola
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0367
- ADRs: 0024 (revisión 2026-11-22, pregunta 0207)
- Spec UX: — (sin cambios visibles)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), entrega alpha.1 (feature 4). Lote C.

## Objetivo
Corregir el defecto de la pregunta 0207: tras «Quitar la corrección», volver a generar los picos (re-separar pistas o caché borrada) vuelve a corregir la letra sola.

## Criterios de aceptación
- [ ] `shared/letra.ts`: `desfase_descartado: z.literal(true).optional().catch(undefined)` en `letraSchema`.
- [ ] `main/letras/servicio.ts`, `guardarTiempos`: si la letra guardada tiene `desfase_corregido_ms` y la petición trae `desfase_corregido_ms: null`, la letra resultante lleva `desfase_descartado: true`; en los demás casos se conserva el valor guardado.
- [ ] `corregirDesfaseDiferido` (y por tanto la preparación, que la reutiliza): no corrige si `letra.desfase_descartado === true`.
- [ ] `letras.guardar` (letra nueva) no copia la marca.
- [ ] `intacta` no cambia en ningún caso.

## Pruebas de feedback
- Unitarias: `servicio.test.ts`, los casos (a)–(d) de la respuesta a 0207; `letra.test.ts`, lectura tolerante (e).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
