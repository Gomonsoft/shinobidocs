# Informe de la feature 4 de 0.2.2 · Comprobar la letra con la voz

Tareas: [0296](../../tareas/0296-contratos-de-datos-de-la-letra-de-0-2-2.md) a [0300](../../tareas/0300-comprobar-la-letra-en-el-editor.md), [0367](../../tareas/0367-comprobacion-diferida-y-remates-de-la-feature-4.md) y [0301](../../tareas/0301-verificacion-e-informe-de-la-feature-4.md). Decisión: [ADR 0024](../../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md). Specs: [05 · Feature 4](../../ux/05-letra.md), [06 · Feature 4](../../ux/06-editor.md).

**Veredicto: hecha con reservas; el criterio de «hecha» con canciones reales NO está verificado.** Ejecutado el 2026-11-22 en un Mac M1 sobre `version-0.2.2`; el CI no se ha consultado (sin PR borrador). Reservas:

1. **Pendiente del usuario** (no se puede hacer aquí, no hay biblioteca real): repetir la calibración «10/10 propias, 0 ajenas aceptadas», comprobar que una letra desplazada ±0,8 s se corrige con canciones reales y que ninguna letra correcta sale `desfasada`. Pasos exactos en la [guía](../../Test-manuales/0.2.2/feature-4-comprobar-la-letra-con-la-voz.md), caso 1. **No se marca como cumplido.** El criterio de 0301 «script de solo lectura» tampoco: el script no existe (pregunta [0206](../../preguntas/0206-no-existe-el-script-de-calibracion-de-la-feature-4.md)).
   **Actualización 2026-11-22 (canciones reales del MVP, [medidas-con-canciones-reales](medidas-con-canciones-reales.md))**: con 18 canciones de la biblioteca del MVP 0.1.0 (LRC de LRCLIB sin fines y sin revisar; el script `calibrar:encaje` ya existe) el criterio **no se cumple con ese material**: propias aceptadas 8/17 (ADR: 10/10), ajenas 6/272 (ADR: 0/90), letra desplazada ±0,8 s corregida 0/34 y 14/34 siguen «coincide». Con «sin fines + prudentes» se corrige el 35 % (36/102) pero las ajenas suben a 18/272. Las dos medidas no son comparables (el ADR midió letras revisadas con fines), así que **el criterio sigue sin cumplirse y sin poder darse por incumplido para letras revisadas**; queda pendiente del usuario con letras suyas revisadas. Comprobado con canciones reales en la app: la corrección propuesta se aplica y **Cmd+Z la revierte en un paso** (4 casos). Preguntas [0275](../../preguntas/0275-la-correccion-de-desfase-no-funciona-con-letras-sin-fines-y-las-constantes-no-aguantan.md) (desfase con letras sin fines, constantes) y [0276](../../preguntas/0276-veredicto-no-coincide-con-f0-e-i0-que-ya-coinciden.md) (veredicto con F(0)/I(0) que ya coinciden).
2. Capturas sin revisar por el diseñador; 7 de 8 de F4-L12 (la de `comprobacion-pendiente` no se puede automatizar).
3. Defecto bajo por lectura de código (D1) y un pendiente conocido (tanda).

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` / `lint` / `format:check` | Limpios |
| Vitest de la feature (`shared/encaje`, `idioma`, `letra`, `letras/`, `main/letras`, `main/picos`, `main/separacion/servicio`, `vistas/letra`, `editor/comprobar`, `Editor.comprobar`, `PanelFunciones`, `editor/estado`, `navegacion`) | 34 archivos (1 omitido), **508 pasan**, 5 omitidas |
| Vitest completo, solo | 274 archivos, **3749 pasan**, 13 omitidas, 0 fallan |
| `npm run test:e2e:criticos` | **1 de 1 pasa** (14 s) |
| `e2e/letras.spec.ts` + `e2e/editor.spec.ts` (2 trabajadores, 3 veces) | **35 de 35 pasan las 3 veces** (2,4 min); incluyen las E2E de la feature (candidatos comprobados + corregir + quitar, comprobación diferida con toast y [Deshacer], y comprobar en el editor con deshacer) |
| `npx playwright test` completo | **203 pasan, 43 omitidas, 1 falla** (`ventana.spec.ts`, de entorno: Retina) |

### Intermitente del arrastre (`editor.spec.ts:410`)

«los marcadores previsualizan, cancelan y guardan un único paso». Ejecutada: 10 de 10 (4 trabajadores), 10 de 10 (`--workers=1`), 3 ejecuciones de `editor.spec.ts` + `letras.spec.ts` con 2 trabajadores (35 de 35 cada una), más la regresión completa: **0 fallos en unas 45 ejecuciones** además del fallo original (línea 430, el inicio se quedó en 2000 ms). **Clasificación: intermitente de la prueba, no defecto de 0.2.2.** La ruta del arrastre no cambió desde v0.2.1 (solo se añadió un atributo `data-resaltada-desfase` a `PistaSincronia.tsx`). Causa probable: el segundo arrastre empieza justo después de `Escape` + `mouse.up()`, con la caja del marcador medida antes de que el diseño se asiente; la vista previa de 0.2.2 (hasta 7 líneas) lo hace algo más pesado. Estabilización sugerida (no aplicada para no enmascarar un posible fallo real): envolver el segundo arrastre en `expect(async () => …).toPass()`.

### Intermitentes de Vitest

Clasificados en [pruebas.md](../../pruebas.md). Resumen: con 3 suites completas a la vez (carga extrema), `Editor.comprobar.test.tsx` F4-E3/E5 (tiempo de 5 s) y F4-E7 (`findBy` de 1 s) fallaron **en 6 de 6** ejecuciones, y otros archivos de `Editor*.test.tsx` en la mayoría; solos pasan (8 de 8 en 5,5 s; 5 de 5 repeticiones con `Biblioteca.agrupacion` y `sesion.test.tsx`). `Biblioteca.agrupacion` B7 y `sesion.test.tsx:269` **no se reprodujeron** en 11 ejecuciones. `main/fuente/archivo.test.ts` falló solo al lanzar varias suites a la vez (cuenta procesos del sistema): artefacto de mi carga. Pregunta [0208](../../preguntas/0208-pruebas-de-componente-del-editor-fragiles-bajo-carga.md).

## Criterios → evidencia

| Criterio | Evidencia |
|---|---|
| F4-L1, L3, L4, L8 | Vitest `Letra.comprobacion.test.tsx`, `comprobacion.test.ts`, `main/letras/busqueda.test.ts` |
| F4-L2 | Vitest `shared/encaje.test.ts` (17 pruebas con picos sintéticos). **No con audio real** |
| F4-L5 | Vitest + E2E `letras.spec.ts` (desfase 0,8 s: tiempos idénticos, `offset_ms` ≈ 800, quitar y volver a corregir) |
| F4-L6 | E2E `letras.spec.ts` (recorrido feliz, `pendiente`) y Vitest (llegada y [Seleccionarla]) |
| F4-L7 | Vitest `main/letras/comprobacion.test.ts` y E2E «comprobación diferida» (toast y [Deshacer]); **sin cola de varias canciones** (ver pendientes) |
| F4-L9 | **Parcial**: C muestra el veredicto de la letra guardada; sin prueba específica de pegar/importar un LRC |
| F4-L10 | **Sin cubrir**: lector de pantalla y teclado → guía |
| F4-L11 | Vitest (`let.comp.error.guardar`) |
| F4-L12 | **7 de 8 capturas** (falta `comprobacion-pendiente`: los picos de 30 s se generan antes de poder fotografiar la espera; solo manual) |
| F4-E1, E2, E3, E5, E6, E7 | Vitest `Editor.comprobar.test.tsx`, `PanelFunciones.test.tsx`, `estado.test.ts`; E3 además E2E `editor.spec.ts` (voz sintética, 0,8 s, deshacer en un paso, tiempos idénticos) |
| F4-E8 | Vitest `encaje.test.ts` (nunca saca una línea del audio, límite de ±30 s) |
| F4-E4 | **Parcial**: el diálogo avisa de las palabras manuales; la conservación exacta de `palabras` en el archivo no tiene prueba específica |
| F4-E9 (sin atajos) | **Sin cubrir** con prueba; guía |
| F4-E10 (seis viewports sin scroll) | **Sin cubrir**; guía |
| F4-E11 | **6 de 6 capturas** |

Recuento F4-L (12): **9 con prueba** (L1–L8, L11), 1 parcial (L9), 1 sin cubrir (L10) y L12 con 7 de 8 capturas. F4-E (11): **7 con prueba** (E1, E2, E3, E5, E6, E7, E8), 1 parcial (E4), 2 sin cubrir (E9, E10) y E11 con 6 de 6 capturas. Sin cubrir: **F4-L10, F4-E9, F4-E10** (pasan a la guía).

Criterios del backlog: «una letra desfasada ±0,8 s se corrige y se puede quitar en un paso» **cumplido con doble** (E2E y Vitest); «con las canciones del usuario…10/10 propias, 0 ajenas» y «ninguna letra correcta se marca `desfasada`» **pendientes del usuario**.

## Defectos y pendientes

- **D1 · «Quitar la corrección» no impide una nueva corrección diferida** (`app/src/main/letras/servicio.ts:286` exige `intacta` y no hay `desfase_corregido_ms`; `app/src/main/index.ts:526` llama en cada generación de picos). Tras quitar la corrección, `intacta` sigue en `true`, así que Re-separar pistas volvería a corregir la letra. Por lectura, no reproducido. Gravedad baja. Pregunta [0207](../../preguntas/0207-quitar-la-correccion-no-impide-que-la-diferida-vuelva-a-corregir.md).
- **Observación de diseño** (pregunta [0209](../../preguntas/0209-texto-repetido-en-el-dialogo-la-letra-no-encaja-con-la-voz.md)): el diálogo «no encaja» repite que el desfase variable no se arregla moviendo la letra.
- **Pendiente conocido, no defecto**: `comprobarLetraGuardada` no está conectada con la tanda de varias canciones (`enTandaDeVarias` no se pasa en `main/index.ts`): llega con la feature 5 (alpha.2). Hasta entonces, no hay tanda y el toast sale siempre.
- Sin script de calibración (pregunta 0206). La constante del ADR 0024 queda como está: no se ha tocado el ADR.
- Revisado por lectura sin hallazgos: `shared/encaje.ts` sigue el ADR (veredicto sobre d\*, regla de `desfasada`, rango que no saca líneas del audio, corrección a 10 ms y ±30 s). Una diferencia con la nota de 0297: si |d\*| ≥ 500 ms y no se cumple la regla de corrección, con `vMejor` ≠ `coincide` devuelve `vMejor` salvo que `v0` sea `coincide` (la nota dice «el de d = 0»); el ADR dice «veredicto sobre d\*», así que el código sigue el ADR.

## Capturas

`docs/ux/revisiones/0.2.2-feature-4/`: 7 de la vista Letra (`letra-1280x800-100-…`) y 6 del editor (`editor-1280x720-100-…`), con `app/e2e/capturas-022.spec.ts` (`SHINOBI_CAPTURAS_022_4=1`), doble de LRCLIB con el escenario `conVoz` y voz sintética. Todo inventado.

## Guía manual

[`feature-4-comprobar-la-letra-con-la-voz.md`](../../Test-manuales/0.2.2/feature-4-comprobar-la-letra-con-la-voz.md): calibración con la biblioteca real (caso 1, pendiente del usuario), desfases a oído, coros, otra versión, comprobación pendiente, lector de pantalla y teclado, y viewports.

## Archivos tocados

`app/e2e/capturas-022.spec.ts`, `docs/pruebas.md`, guía e índice, este informe, preguntas 0205–0209 y la tarea 0301. Ningún código de producción.
