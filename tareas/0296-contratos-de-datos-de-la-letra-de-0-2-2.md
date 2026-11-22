# 0296 — Features 4, 5, 10 y 11 · Campos nuevos de la letra y reglas de main
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0339
- ADRs: 0024 §1 y §4, 0028 §3.3, 0021, 0006
- Spec UX: —
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Añadir los campos de la letra que usan varias features, con sus reglas de escritura en main, antes de que las features los necesiten.

## Criterios de aceptación
- [x] `letra.intacta`, `letra.desfase_corregido_ms`, `letra.idioma`; por línea `origen_fin` (catálogo `letra|silencios|preparacion|alineacion`), `revisada { inicio_ms, fin_ms, texto }`, `alineacion { confianza }`; `origen_palabras` admite `auto`. Todos opcionales y tolerantes.
- [x] Main: `intacta` al guardar una letra nueva y se retira con la primera escritura que cambie tiempos; `origen_fin` retirado si `fin_ms` es `null`; `revisada` y `alineacion` retiradas si cambian sus tiempos o el texto; `origen_fin: "letra"` al importar un fin de la letra.
- [x] `letras.guardarTiempos` admite `origen_fin` y `revisada` por línea; `offset_ms` sigue escribiéndose ahí.
- [x] `palabrasVisibles` incluye `auto` (no se produce aún ninguna).
- [x] `shared/idioma.ts` con `detectarIdioma`; main lo pone al guardar una letra nueva.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [x] Campos reservados en el esquema de la letra: `lineas[].parte` y `letra.partes`, opcionales, tolerantes al leer y conservados al escribir (también en el paquete de canción), sin ningún uso en 0.2.2. Test: una canción con reparto se abre, se edita y se guarda sin perderlo.
- [x] `aplicarTextoEditado` conserva todos los campos de una línea emparejada salvo el texto. Corrige un defecto de 0.2.1 (`app/src/shared/letras/editar.ts`: rehace la línea campo a campo y pierde `origen_palabras`, contra ADR 0021 §4). Test: corregir el texto de otra línea en la vista Letra no quita las palabras hechas a mano de las que no cambian, ni `origen_fin`, `revisada` o `alineacion`.

## Pruebas de feedback
- Unitarias: `letra.test.ts` y tests del servicio de letras: cada regla de retirada, copia congelada del `elementoLetraSchema` de 0.2.1, `detectarIdioma` con textos inventados.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `shared/letra.ts`: campos nuevos opcionales y tolerantes (`.catch(undefined)`): `letra.intacta`, `desfase_corregido_ms`, `idioma`, `partes` (reservado); por línea `origen_fin`, `revisada`, `alineacion`, `parte` (reservado); `origen_palabras` admite `auto`; `palabrasVisibles` incluye `auto`.
- `shared/letras/editar.ts`: `aplicarTextoEditado` conserva todo el campo de la línea emparejada salvo el texto (defecto de 0.2.1). `normalizar.ts` también conserva los campos que no toca (y limpia `origen_fin` sin fin y `origen_palabras` sin palabras).
- `shared/letras/retirar.ts` (`retirarCamposObsoletos`): reglas de retirada de `intacta`, `origen_fin`, `revisada`, `alineacion`; main la aplica en toda escritura de la letra (`ServicioLetras.escribir`).
- `shared/idioma.ts` (`detectarIdioma`: `es`, `en` o `null`; mínimo 4 palabras reconocidas). `guardar` pone `intacta`, `idioma` y `origen_fin: "letra"` en los fines que traía la letra (el resto de campos de la entrada se ignoran).
- `guardarTiempos` (`shared/letrasBusqueda.ts`): `origen_fin` y `revisada` opcionales por línea; ausentes = a mano / sin revisar (son el estado completo de la línea); `aPeticionTiempos` los envía. `offset_ms` sigue igual. `parte`/`partes` se conservan por el `...guardada`; no entran en el IPC (0.2.3).

**Probar**: `npx vitest run src/shared/letras src/shared/letra.test.ts src/shared/idioma.test.ts src/main/letras/servicio.test.ts`.

**Deuda / avisos para 0297–0300 y siguientes**
- `intacta` se retira con la primera escritura que cambia tiempos y deshacer no la devuelve (no está en el historial del editor).
- `alineacion` no viaja en `guardarTiempos`: se conserva, pero solo se retira; quien la escriba (0329+) necesitará un campo en el IPC o escribir desde main.
- `origen_palabras: "auto"` no se acepta aún en `guardarTiempos` (solo `manual`).
- `revisada.fin_ms` se compara con el `finEfectivo` (duración de `metadatos`).
- `letras:encaje` sigue `unknown` (no lo pide esta tarea).
- Críticos pendientes: los ejecuta la sesión principal al integrar (no se ejecutaron E2E).

**Ajuste por ADR 0029 §1 (remate)**: la reserva se alineó con el ADR. `letra.partes = { cantantes: [{ id: c1..c4, nombre: string | null }] (1–4), voz_en_coros }` (nombre no válido se lee `null`) y `lineas[].parte` ∈ `c2`, `c3`, `c4`, `todos`, `coro` (`c1` no se escribe: se lee como ausente). Sigue sin uso. Tests de conservación de `editar.test.ts` y `servicio.test.ts` con ids tipados; añadido un caso de tolerancia en `letra.test.ts`. La normalización (`normalizarReparto`) y los invariantes estrictos de escritura no se implementan (son de la feature 3).
