# 0373 — Feature 5 · Motivo de la no elección y código del error de búsqueda en `preparacion`
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0310, 0311
- ADRs: 0025 §1 y §3 (revisión de la pregunta 0235)
- Spec UX: docs/ux/04-progreso-pipeline.md (0.2.2 · Feature 5, R2 y R4) y docs/ux/05-letra.md (0.2.2 · Feature 5, `let.prep.motivo.*`)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5 (alpha.2). Lote D.

## Objetivo
Que la interfaz diga por qué la app no eligió la letra y por qué la búsqueda quedó pendiente con lo que decidió main, no con una deducción.

## Criterios de aceptación
- [ ] `shared/cancion.ts`: `busqueda.no_elige: z.enum(['varias','sinExacta','duda','noCoincide','soloTexto','sinComprobar']).nullable().catch(null)` (opcional, tolerante).
- [ ] `main/preparacion/eleccion.ts`: `MotivoNoElige` gana `dudosa` (un único candidato sincronizado `dudosa`). Al pasar a `elige_letra`, el servicio guarda `busqueda.no_elige` con la correspondencia de la respuesta a 0235. Con un fallo de búsqueda, guarda el código de ADR 0005 en `busqueda.motivo` y deja `no_elige: null`.
- [ ] `shared/ipc.ts`: `resumenPreparacionSchema.busqueda` gana `motivo: z.string().nullable()` y `noElige` (mismo catálogo, `null`); `main/biblioteca/resumen.ts` los rellena.
- [ ] Renderer:
  - R2 de la vista de progreso usa `let.prep.motivo.{noElige}`;
  - la vista Letra lee `noElige` y se retira `motivoElige` de `letra/preparacion.ts`;
  - «Letra pendiente» distingue `SIN_CONEXION` de `SERVICIO_NO_DISPONIBLE`.
- [ ] `shared/derivados.ts`: `aplicaPreparar(cancion)` (pura), usada por `preparacion.previsualizar` en main y por «Preparar» de la tarjeta.

## Pruebas de feedback
- Unitarias:
  - servicio de preparación: cada motivo guardado y el código de error;
  - `derivados.test.ts` (`aplicaPreparar`);
  - componentes de R2, Letra y tarjeta con cada motivo.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
