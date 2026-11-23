# 0340 — Contratos compartidos de 0.2.3 (reparto, IPC, configuración y dobles)
- Estado: Hecha
- Paso del pipeline: 4–6 (transversal)
- Depende de: 0.2.2 integrada en `develop` (en particular 0296, 0287, 0288, 0289, 0290, 0293, 0294, 0319 y 0321 terminadas)
- ADRs: 0029 §1–§3, 0030 §5, 0006, 0008
- Spec UX: — (ADR 0029 §1–§3 y ADR 0030 §5); conceptos en docs/ux/06-editor.md#023--feature-1--cantantes-por-línea
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Dejar declarados de una vez los esquemas del reparto, las funciones puras de `shared/reparto.ts`, los campos nuevos de la IPC y de la configuración, para que los lotes de 0.2.3 trabajen después en sus archivos sin tocar los contratos comunes a la vez. **Es la primera tarea de la versión.**

## Criterios de aceptación
- [ ] `shared/letra.ts`: forma exacta de `letra.partes` (`cantantes[]` con `id` `c1`…`c4` y `nombre: string | null`, `voz_en_coros`) y de `lineas[].parte` (ADR 0029 §1): lectura tolerante por campo (C1-E22), validación estricta al escribir (incluido `todos` solo con 2 o más cantantes) y `normalizarReparto`. Unificar con la reserva de 0.2.2 (0296) si difiere.
- [ ] `shared/estilo.ts`: `colores_partes` con cinco ranuras opcionales (una clave `c1` se ignora); `normalizarEstilo` no rellena predeterminados; `estilosIguales` compara colores efectivos.
- [ ] `shared/pantalla.ts`: `estilo.pantalla.zonas` (`"por_parte" | "una"`, opcional, ausente = `"por_parte"`, tolerante; también dentro de `reemplazo_pantalla`) y las constantes de las zonas del sistema visual (área 12 %–86 %, separación 0,3 × S, coro a la mitad, 2 y 1 líneas, 70 %, mínimos 0,75 y 0,5 × S, opacidad 0,55).
- [ ] `shared/reparto.ts` (nuevo): catálogo, `COLORES_PARTES_PREDETERMINADOS` y las funciones de ADR 0029 §3 (`parteDe`, `tieneReparto`, `variosCantantes`, `carriles`, `siguienteRanuraLibre`, `asignar`, `anadirCantante`, `quitarCantante`, `renombrar`, `inicial`, `insignia`, `textoEnPantalla`, `colorDeParte`, `lineasEntreParentesis`, `recuentoPorParte`), con la regla de iniciales de C1-E10 y C1-R4 y la de carriles de C1-E8.
- [ ] `shared/letrasBusqueda.ts`: `parte` opcional en `tiempoElementoSchema` y `partes` opcional (o `null`) en `guardarTiemposSchema`.
- [ ] `shared/ipc.ts` / `shared/exportacion.ts`: `coros: boolean` opcional en `iniciarExportacion` e `iniciarLote` (ADR 0030 §5); main lo ignora hasta 0353.
- [ ] `shared/config.ts`: `editor.carriles_juntos` y `exportacion.coros` (por defecto `true`), tolerantes y en `configParcialRendererSchema`.
- [ ] Dobles (`fixturesApi.ts`, `apiNuevaFalsa.ts`) y semilla de E2E: una canción con dos cantantes, una línea «Todos» y dos de coro, y otra con un cantante y coros, **con letra inventada**.
- [ ] Ningún comportamiento visible cambia.

## Pruebas de feedback
- Unitarias: `reparto.test.ts` (cada función, iniciales, carriles, tolerancia, normalización), `letra.test.ts` con una copia congelada del esquema de 0.2.2 que conserva el reparto, `estilo.test.ts`, `pantalla.test.ts`, `config.test.ts`, esquemas de la IPC.
- E2E: Ninguna nueva; `ipc.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** Contratos de ADR 0029 §1–§4 bis, §5 (config) y ADR 0030 §5, sin comportamiento visible ni canales nuevos (no hace falta `CANALES_NO_IMPLEMENTADOS`).
- `shared/reparto.ts` (nuevo): catálogo (`PARTES`, `RANURAS`, `MAX_CANTANTES`, `NOMBRE_MAX`, `COLORES_PARTES_PREDETERMINADOS`) y todas las funciones de ADR 0029 §3, más `cantantesDe`, `vozEnCoros`, `nombreNormalizado`, `normalizarReparto` y `validarReparto` (invariantes de escritura para main). Firmas que el ADR no fija: pregunta [0330](../preguntas/0330-firmas-de-reparto-que-los-adr-no-fijan.md).
- `shared/letra.ts`: `partesSchema` con lectura tolerante por campo (repara `cantantes`) y `partesEscrituraSchema` estricto. La forma reservada por 0296 ya coincidía con ADR 0029 §1 (se comprueba con una copia congelada del esquema de 0.2.2 en `letra.test.ts`).
- `shared/estilo.ts`: `colores_partes` sin la ranura `c1`; `shared/temas.ts`: `estilosIguales` compara colores efectivos y `zonas` efectivo. `shared/pantalla.ts`: `zonas` (ya reservado) más `zonasEfectivas`, `ZONAS_PREDETERMINADAS` y las constantes de zonas del sistema visual.
- `shared/letrasBusqueda.ts`: `parte` en `tiempoElementoSchema`, `partes` (`null` = quitar) en `guardarTiemposSchema` con la validación cruzada. `shared/ipc.ts`: `coros?: boolean` en `iniciarExportacion` e `iniciarLote` (main lo ignora hasta 0353) y `editor.carriles_juntos` y `exportacion.coros` en `configParcialRendererSchema`. `shared/config.ts`: `editor.carriles_juntos` (por defecto `false`) y `exportacion.coros` (por defecto `true`), tolerantes.
- Dobles: `shared/__fixtures__/reparto.ts` (`cancionDosCantantes`: dúo con «Todos» y dos coros; `cancionUnCantanteConCoros`), reexportadas como `cancionConReparto` y `cancionConCoros` desde `vistas/editor/fixturesApi.ts`, cuyo `guardarTiempos` ya conserva `parte`/`partes`. Semilla de E2E opt-in: `sembrar(datos, { reparto: true })` (ids `…0050`, `…0051`; `npm run semilla -- --reparto`). `apiNuevaFalsa.ts` no necesita métodos nuevos (sin canales).

**Cómo probarlo.** `npx vitest run src/shared/reparto.test.ts src/shared/letra.test.ts src/shared/letrasBusqueda.test.ts src/shared/config.test.ts src/shared/estilo.test.ts src/shared/pantalla.test.ts src/main/biblioteca/semilla.test.ts`.

**Para los lotes siguientes.** Quien pinte o cuente partes usa `parteDe(linea, letra)` (no `linea.parte`). Un `Letra` sin `partes` sigue sin ganar campos al leerse ni al normalizarse. main (0341) debe llamar a `validarReparto` y `normalizarReparto` al escribir y descartar `parte` en pausas; hoy `guardarTiempos` ignora `parte`/`partes` y `coros`.

**Deuda.** Ninguna manual. Pregunta 0330 abierta (no bloquea).
