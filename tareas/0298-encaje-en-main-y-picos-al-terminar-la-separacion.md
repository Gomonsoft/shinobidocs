# 0298 — Feature 4 · Encaje de los candidatos en main y picos al terminar la separación
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0297
- ADRs: 0024 §2, 0015
- Spec UX: docs/ux/05-letra.md (0.2.2 · Feature 4)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Que `letras.buscar` devuelva el encaje por candidato y que los picos existan sin abrir el editor.

## Criterios de aceptación
- [ ] `leerNivelBase` en `main/picos/formato.ts`.
- [ ] Main pide `generar-picos` al completarse la separación.
- [ ] `letras.buscar` añade `encaje` y ordena; evento `letras:encaje` cuando los picos terminan.

## Pruebas de feedback
- Unitarias: Servicio de letras con picos falsos y doble de LRCLIB; servicio de picos encadenado a la separación falsa.
- E2E: Ampliar `letras.spec.ts` con un escenario: separación falsa + picos generados + candidato con encaje.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `main/picos/formato.ts`: `leerNivelBase(ruta)` -> `{ pasoMs, pares, duracionMs } | null` (nivel de 10 ms).
- `main/picos/servicio.ts`: `nivelBase(id)`, `generarTrasSeparar(id)` (pide los picos esperando turno: una generación a la vez) y dependencia opcional `alListos(id)` al publicarse la caché.
- `main/separacion/servicio.ts`: dependencia `alSepararVoz(id)` al terminar `separar` con resultado `completado` (el paso y las pistas ya están escritos); `main/index.ts` la conecta con `generarTrasSeparar`.
- `main/letras/busqueda.ts`: con picos `lista`, `letras.buscar` añade `encaje: { veredicto, desfaseMs } | null` y ordena por veredicto (`coincide` = `desfasada` > `dudosa` > `no_comprobable`/solo texto > `no_coincide`, estable). Sin picos no cambia nada (`encaje` ausente). `alPicosListos(id)` emite `letras:encaje` con los encajes de la última búsqueda (caché de 10 min) cuando los picos terminan.
- `shared/letrasBusqueda.ts`: `encajeCandidatoSchema`, `eventoEncajeLetrasSchema` (`{ cancionId, encajes: [{ lrclib_id, encaje }] }`), `encaje` opcional en el candidato. `shared/ipc.ts`: `alEncaje(cb: (e: EventoEncajeLetras) => void)`.
**Probar**: `npx vitest run src/main/letras/busqueda.test.ts src/main/picos src/main/separacion/servicio.test.ts`.
**Pendiente**: E2E (ampliar `letras.spec.ts`: separación falsa + picos + candidato con encaje) y críticos: no ejecutados por instrucción; lo hace la sesión principal. El E2E necesita que el doble de LRCLIB traiga un candidato con tiempos y que el audio falso tenga voz.
**Para 0299/0300**: el evento no reordena: la vista debe volver a ordenar con el mismo criterio al recibirlo (o repetir la búsqueda con `usarCache: true`, que ya devuelve el encaje). `desfaseMs` solo es una corrección con `desfasada`; el signo es el de `offset_ms` (positivo = mover la letra más tarde). Al usar un candidato `desfasada`, guardar con `corregirDesfase` y `desfase_corregido_ms` (hoy `guardarTiempos` solo escribe `offset_ms`; `guardar` no admite `desfase_corregido_ms`: hace falta un canal si 0299 o 0300 lo necesitan).
**Deuda**: el recuento `preparacion.dudosas` y la preparación desatendida no entran aquí.
