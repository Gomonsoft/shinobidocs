# 0340 — Contratos compartidos de 0.2.3 (reparto, IPC, configuración y dobles)
- Estado: Pendiente
- Paso del pipeline: 4–6 (transversal)
- Depende de: 0.2.2 integrada en `develop` (en particular 0296, 0287, 0290, 0293, 0294, 0319 y 0321 terminadas)
- ADRs: 0029, 0030, 0006, 0008
- Spec UX: — (ADR 0029 §1–§3 y ADR 0030 §5)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Dejar declarados de una vez los esquemas del reparto, las funciones puras de `shared/reparto.ts`, los campos nuevos de la IPC y de la configuración, para que los lotes de 0.2.3 trabajen después en sus archivos sin tocar los contratos comunes a la vez. **Es la primera tarea de la versión.**

## Criterios de aceptación
- [ ] `shared/letra.ts`: forma exacta de `letra.partes` (`cantantes[]` con `id` `c1`…`c4` y `nombre: string | null`, `voz_en_coros`) y de `lineas[].parte` (ADR 0029 §1): lectura tolerante por campo, validación estricta al escribir y `normalizarReparto`. Si la reserva de 0.2.2 (0296) usa otra forma, se unifica aquí y se anota en el ADR.
- [ ] `shared/estilo.ts`: `colores_partes` con las cinco ranuras opcionales; `normalizarEstilo` no rellena predeterminados; `estilosIguales` compara colores efectivos.
- [ ] `shared/pantalla.ts`: `estilo.pantalla.zonas` (`"por_parte" | "una"`, opcional, ausente = `"por_parte"`, lectura tolerante) y las constantes de las zonas que fije el sistema visual (proporción de cada franja, líneas por zona, separación) (ADR 0029 §4 bis).
- [ ] `shared/reparto.ts` (nuevo): catálogo, `COLORES_PARTES_PREDETERMINADOS` y las funciones de ADR 0029 §3 (`parteDe`, `tieneReparto`, `carriles`, `siguienteRanuraLibre`, `asignar`, `anadirCantante`, `quitarCantante`, `renombrar`, `insignia`, `textoEnPantalla`, `colorDeParte`, `lineasEntreParentesis`, `recuentoPorParte`).
- [ ] `shared/letrasBusqueda.ts`: `parte` opcional en `tiempoElementoSchema` y `partes` opcional (o `null`) en `guardarTiemposSchema`.
- [ ] `shared/ipc.ts` / `shared/exportacion.ts`: `coros: boolean` opcional en `iniciarExportacion` e `iniciarLote` (ADR 0030 §5); main lo ignora hasta 0353.
- [ ] `shared/config.ts`: `editor.carriles_juntos` y `exportacion.coros`, con lectura tolerante y en `configParcialRendererSchema`.
- [ ] Dobles (`vistas/*/fixturesApi.ts`, `vistas/apiNuevaFalsa.ts`) y semilla de E2E: una canción de ejemplo con reparto (dos cantantes, una línea «Todos» y dos de coro, **letra inventada**).
- [ ] Ningún comportamiento visible cambia.

## Pruebas de feedback
- Unitarias: `reparto.test.ts` (cada función, tolerancia de lectura, normalización), `letra.test.ts` con una copia congelada del esquema de 0.2.2 que conserva el reparto, `estilo.test.ts`, `config.test.ts`, esquemas de la IPC.
- E2E: Ninguna nueva; `ipc.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
