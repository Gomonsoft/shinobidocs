# 0306 — Feature 5 · `cancion.preparacion`, estado derivado y resumen
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0296
- ADRs: 0025 §1
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 5)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Esquema del registro de preparación y el estado derivado «Lista para revisar».

## Criterios de aceptación
- [ ] `preparacion` opcional con la forma de ADR 0025 §1; `estadoPreparacion` en `shared/derivados.ts`.
- [ ] Resumen de la Biblioteca con `preparacion` y recuentos de la bandeja.
- [ ] `revisada` se pone en los casos de la spec; `eleccion.por` pasa a `usuario` si el usuario elige otra letra.

## Pruebas de feedback
- Unitarias: `derivados.test.ts`, esquema con copia congelada del de 0.2.1, resumen.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Esquema** (`shared/cancion.ts`): `preparacion` opcional con la forma de ADR 0025 §1 (`preparacionSchema`, `ESTADOS_PREPARACION`, `PASOS_PREPARACION`, `RESULTADOS_BUSQUEDA`, `MAX_IDS_BUSQUEDA = 10`). Lectura tolerante: un registro ilegible se ignora y lo secundario cae a su valor por defecto; no sube `esquema`. 0.2.1 lo descarta al leer.
- **Derivados** (`shared/derivados.ts`): `estadoPreparacion(cancion)` («lista_para_revisar» se deriva de los pasos, haya preparado la app o el usuario; el resto sale del registro y solo vale sin letra) y `recuentosBandeja(resúmenes)` (listas para revisar / esperan letra / con error, cada canción en una sola casilla).
- **Resumen** (`main/biblioteca/resumen.ts`, `shared/ipc.ts`): `preparacion` (estado, paso, búsqueda sin ids, dudosas, revisada, `eleccionAutomatica`, `desfaseCorregido`) y `estadoPreparacion`; ambos opcionales en el esquema.
- **`revisada` y `eleccion.por`**: `ServicioBiblioteca.marcarLista` y el nuevo `marcarPreparacionRevisada(id)` (para «cerrar el aviso», que cablea 0311) ponen `revisada: true`. En `ServicioLetras` (cambio mínimo y aditivo en `main/letras/servicio.ts`): `editarTexto`, `editarTextoLinea`, `guardarTiempos` y `guardar` la ponen a `true`, y `guardar` con otro `lrclib_id`/origen pasa `eleccion.por` a `usuario`. `guardar(peticion, { porPreparacion: true })` (para 0308) y `corregirDesfaseDiferido` no cuentan como edición del usuario. `CambioCancion` admite `preparacion` (`null` la retira).
- **Pruebas**: `derivados.test.ts`, `cancion.test.ts` (sin registro como 0.2.1, ilegible, un 0.2.1 simulado), `servicio.test.ts` de biblioteca y de letras.
- **Para 0308**: la escritura del registro es `biblioteca.actualizar(id, { preparacion })`; ojo, un test anterior de `main/biblioteca/servicio.test.ts` muta las pistas compartidas de las fixtures. «Cerrar el aviso» necesita un canal (0311) que llame a `marcarPreparacionRevisada`.
