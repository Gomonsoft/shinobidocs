# 0307 — Feature 5 · Cola automática de LRCLIB, interruptor y búsqueda persistida
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0306
- ADRs: 0025 §4, 0005
- Spec UX: docs/ux/08-ajustes-y-acerca.md y 05-letra.md (0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Peticiones automáticas en serie a ≥ 1,5 s, adelantadas por las interactivas, con `config.preparacion.automatica`.

## Criterios de aceptación
- [ ] Cola con prioridad interactiva y `Retry-After`.
- [ ] Interruptor (tolerante, por defecto activo) y búsquedas en cola que no salen al apagarlo.
- [ ] `preparacion.busqueda` guardada sin letras; `letras.candidatoPorId` con `/api/get/{id}`.

## Pruebas de feedback
- Unitarias: Cliente de LRCLIB con reloj falso y doble HTTP.
- E2E: Ninguna.
- Críticos: sí
- Manual: Con el interruptor apagado no sale ninguna petición al añadir (guía).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Cola con prioridad** (`main/letras/lrclib.ts`): el cliente sirve una petición a la vez; `op.prioridad = 'automatica'` va detrás de las interactivas (una interactiva que llega despierta la espera de separación y pasa delante), con ≥ 1,5 s entre peticiones (`SEPARACION_AUTOMATICA_MS`, 40/min) y, tras un 429, espera `Retry-After` + margen aleatorio hasta 3 veces sin presupuesto de 10 s. La interactiva conserva presupuesto de 10 s, 250 ms y su fallo inmediato por 429. `op.permitida` se consulta justo antes de enviar: si el interruptor se apagó, la petición no sale (`CANCELADO`).
- **Interruptor** (`main/letras/busqueda.ts`, `main/index.ts`): `BusquedaLetras.buscar(p, { automatica, explicita })`; automática con el interruptor apagado ni se encola; `explicita` («Preparar») lo ignora; la interactiva no depende de él. `automaticaActiva` lee `config.preparacion.automatica` (ya tolerante y activo por defecto desde 0339). `cancelarAutomaticas(cancionId?)` para detener o eliminar. Una parada (`CANCELADO`) ya no se confunde con «presupuesto agotado».
- **`busqueda` guardable**: `aBusquedaGuardada` y `buscarParaPreparacion(cancionId, { explicita })` devuelven `{ resultado (memoria), busqueda }` con `resultado` `elige | sin_letra | instrumental | pendiente`, recuento, motivo y como mucho 10 ids; nunca texto. Los fallos de red o servicio dejan `pendiente`; `CANCELADO` se relanza. **No escribe en disco**: lo escribe `ServicioPreparacion` (0308).
- **`letras.candidatoPorId`**: sustituido el manejador; `BusquedaLetras.candidatoPorId` usa la búsqueda en memoria (10 min) o `GET /api/get/{id}` (interactiva) y solo admite ids de `preparacion.busqueda.ids` o de la búsqueda reciente.
- **Pruebas**: `lrclib.cola.test.ts` (reloj falso: separación, adelanto, `Retry-After`, tres 429, interruptor y señal), `busqueda.automatica.test.ts` (conteo de peticiones al doble con cliente real: apagado = 0; a mitad de cola; «Preparar» sí; ids ≤ 10 sin texto; `candidatoPorId`), `handlers.test.ts` y, en E2E, `importar-archivo.spec.ts` («privacidad»: interruptor apagado + doble de LRCLIB, 0 peticiones al añadir).
- **Manual**: con el interruptor apagado no sale ninguna petición al añadir (guía; el E2E lo cubre con el doble). Con red real y un lote, comprobar que no hay 429.
- **Para 0308**: `buscarParaPreparacion` es la entrada; la elección automática (`elegida`) la decide 0308 sobre `resultado` y sustituye `busqueda.resultado`. El interruptor apagado produce `CANCELADO` (no `error`): 0308 debe dejar la canción sin registro o `detenida`. Falta cablear `ServicioPreparacion` a `cancelarAutomaticas` al detener/eliminar.
