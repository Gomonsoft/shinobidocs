# 0308 — Feature 5 · `ServicioPreparacion`: cadena, elección automática y fines prudentes
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0307, 0298, 0306, 0302, 0367 (usa `metadatos.origen` para el álbum de LRCLIB)
- ADRs: 0025 §2–§3, 0024, 0018 §6
- Spec UX: docs/ux/04-progreso-pipeline.md (0.2.2 · Feature 5)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
La máquina de estados por canción que lleva un borrador a «Lista para revisar».

## Criterios de aceptación
- [x] Pasos y fallos de la tabla de ADR 0025 §2; elección automática con los cuatro criterios de §3.
- [x] `shared/silencios.ts`: `proponerAjusteSilencios` gana los parámetros `soloIds`, `soloFinesAutomaticos` y `activarComodin` (ADR 0018, revisión 0.2.2); la preparación la usa con `soloFinesAutomaticos: true`, `activarComodin: false` y `origen_fin: "preparacion"`.
- [x] Se detiene con cancelar, eliminar, edición del usuario o `EDICION_BLOQUEADA`.
- [x] Recuento de dudosas: main llama a `contarDudosasGuardadas` (`main/letras/dudosas.ts`, tarea 0334) (a) al terminar la preparación y (b) tras cada escritura de la letra de una canción que tenga `preparacion`, y guarda el número en `preparacion.dudosas` (ADR 0024 §3; pregunta 0225 §2). Test: el recuento cambia al dar una línea por buena y al mover un fin.
- [x] Canales `preparacion.previsualizar`, `preparar`, `cancelar` y evento `preparacion:cambio`.
- [x] **Álbum desde LRCLIB, parte de main** (spec 03, F6-N7; ADR 0025 §6 y revisión de la pregunta 0220): función `rellenarAlbumDesdeLrclib(cancionId, registro)` en `main/biblioteca/origen.ts`. Se llama cuando se guarda una letra que viene de LRCLIB, tanto si la elige la preparación como si la elige el usuario en la vista Letra (este enganche en `main/letras/` se acuerda con el lote C).
  - Solo rellena si el álbum está vacío, con `metadatos.origen.album = "lrclib"`. Nunca sobrescribe un campo con origen `usuario` y nunca cambia título ni artista.
  - Guarda en la letra `datos_lrclib: { titulo, artista, album }` (opcional y tolerante; son metadatos del registro, no la letra) para la sugerencia «Usar estos datos».
  - «Quitar» = álbum vacío con origen `usuario`, así que no se vuelve a rellenar.
  - Test: álbum vacío se rellena; álbum previo o con origen `usuario` no; tras «Quitar» no vuelve.
- [x] El paso `comprobando` de una letra ya guardada reutiliza `comprobarLetraGuardada` de la tarea 0367 (no duplica la comprobación diferida) y, dentro de una tanda de varias canciones, no emite el toast por canción (ADR 0024, revisión 2026-11-22).

## Pruebas de feedback
- Unitarias: Main con dobles (LRCLIB, gestor, picos): cada transición, ambigüedad, nunca sustituir una letra, `intacta`.
- E2E: Una secundaria: añadir un WAV con el doble de LRCLIB y el separador falso hasta «Lista para revisar».
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `main/preparacion/servicio.ts` (`ServicioPreparacion`): una corrida por canción (`iniciar(id, origen)`), pasos idempotentes que miran el estado real: `buscando_letra` (`BusquedaLetras.buscarParaPreparacion`, explícita si es «Preparar»; reintento a los 60 s y luego `error` + `busqueda.pendiente`, ver pregunta 0221) → `esperando_separacion` (espera `pasos.separacion` y los picos con `picos.solicitar`; separación en `error` → `elige_letra`) → `comprobando` (elección automática o `comprobarLetraGuardada` si ya hay letra) → `ajustando_fines` (variante prudente, solo con la letra `intacta`) → cierre con `contarDudosasGuardadas` y estado `lista_para_revisar`. Nunca llama a `marcarLista`.
- `main/preparacion/eleccion.ts`: `elegirLetra` (puro): los cuatro criterios de ADR 0025 §3 (tiempos, ±2000 ms, encaje `coincide`/`desfasada`, ambigüedad por texto distinto con `claveFlexible`).
- `shared/silencios.ts`: `proponerAjusteSilencios` gana `soloFinesAutomaticos`, `activarComodin` y `origenFin` (`soloIds` ya estaba, 0334); la preparación usa `{ soloFinesAutomaticos: true, activarComodin: false, origenFin: 'preparacion' }`.
- `main/biblioteca/origen.ts`: `rellenarAlbumDesdeLrclib(biblioteca, cancionId, registro)` (solo álbum vacío y origen ≠ `usuario`; anota `lrclib`). `shared/letra.ts`: `letra.datos_lrclib` opcional y tolerante.
- `main/letras/servicio.ts` (cambios mínimos y aditivos, lote C): `guardar` guarda `datos_lrclib` y llama a `rellenarAlbumDesdeLrclib` con los datos de `opciones.datosLrclib` (preparación) o, si es el usuario, de la opción de constructor `datosLrclib` (sale de `BusquedaLetras.datosDeCandidato`, búsqueda reciente en memoria); `aplicarFinesPreparacion(id, fines)` escribe solo los fines que **ahora** siguen automáticos, con `origen_fin: "preparacion"` y sin contar como edición del usuario. `main/letras/busqueda.ts`: `datosDeCandidato`.
- Recuento de dudosas: el servicio escucha la biblioteca; tras cada escritura de la letra de una canción con `preparacion` (y sin corrida en marcha) recalcula con `contarDudosasGuardadas` y guarda `preparacion.dudosas`; al terminar la corrida lo calcula también. Test: cambia al mover un inicio, al dar una línea por buena y al mover su fin.
- Detenciones: `cancelar(id)` (aborta la corrida y llama a `cancelarAutomaticas(id)`), `alEliminar(id)` (cableado en `antesDeEliminar`), `detenerPorCierre()`/`cerrar()` (`detenida` con `error.codigo = "CIERRE"` y su paso; se llaman **antes** de cancelar los trabajos, para que una separación interrumpida no se tome por cancelación), edición del usuario sobre una letra que ya existía y sesión en vivo (espera; ver pregunta 0223). `normalizarAlArrancar()` pasa a `detenida` por cierre lo que quedó `en_curso` por una caída. Sin trabajo hecho, se retira el registro (`preparacion: null`).
- Privacidad: `alFuenteLista(id)` no hace nada con `config.preparacion.automatica` apagado (ni registro ni petición). Se llama desde `alFuenteLista` de la importación de archivo y desde la suscripción del gestor a `descargar-youtube` completada (`main/index.ts`).
- Canales: `preparacion.previsualizar`, `preparar` y `cancelar` (`main/ipc/handlers.ts`, dependencia `preparacion`) y evento `preparacion:cambio` (`{ id, preparacion }`, desde `emitir` en `main/index.ts`). Siguen «no implementados» `pausar`, `reanudar`, `reintentarFallidas` y `tanda` (0309).
- `comprobarLetraGuardada` (0367) se reutiliza tal cual; `main/index.ts` ya le pasa `enTandaDeVarias` (`ServicioPreparacion.enTandaDeVarias`: hay otra corrida en marcha; 0309 lo sustituye por la tanda real).

**Probar**: `npx vitest run src/main/preparacion src/main/letras/servicio.lrclib.test.ts src/main/biblioteca/origen.test.ts src/shared/silencios.test.ts src/main/ipc/handlers.test.ts` (37 + 8 + 3 + 2 + … pruebas; la de privacidad sigue en `busqueda.automatica.test.ts`). E2E **escrita, sin ejecutar**: `e2e/preparacion.spec.ts` (WAV con los cantos de `VOZ_SINTETICA` en antifase, doble de LRCLIB `conVoz` y separador falso hasta `lista_para_revisar`, mirando `cancion.json`); puntos frágiles: que la mezcla conserve el estéreo para que la voz del separador falso (L − R) / 2 no salga en silencio, la etiqueta «Artista» del formulario y que el doble ordene los tres candidatos como se espera (gana el desfasado, que se guarda corregido).

**Deuda y límites**
- No hay alineación (feature 10): `fines.metodo` solo es `silencios`.
- Sin toast ni aviso de resultado por canción (`prog.toast.revisar`, etc.), ni tanda, pausa, paradas ni reanudar al abrir: son de 0309/0311.
- Los candidatos se evalúan tal como vienen (ADR 0025 §3); un LRC sin fines en una canción con huecos instrumentales puede salir `dudosa` y caer en «Elige la letra» (pregunta 0222: medir en la verificación con canciones reales).
- La espera de la separación no encola la separación si nunca se pidió (pregunta 0223). La señal de sesión en vivo es global, no por canción.
- La elección usa `Math.round(desfaseMs)`; el reintento sin red va a los 60 s (pregunta 0221).
- Manual (con red y datos reales): preparar un borrador real del usuario con red; añadir con el interruptor apagado y comprobar en el registro de red que no sale nada; cerrar a mitad y comprobar `detenida` (CIERRE).
