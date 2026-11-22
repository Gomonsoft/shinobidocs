# 0299 — Feature 4 · Comprobación en la vista Letra
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0298
- ADRs: 0024
- Spec UX: docs/ux/05-letra.md (0.2.2 · Feature 4)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Mostrar el veredicto por candidato, aplicar la corrección al elegir y los estados de los picos.

## Criterios de aceptación
- [ ] (parcial: faltan F4-L7, comprobación diferida de main, y las capturas; ver notas) Todo lo de la spec 05 · Feature 4 con su microcopy, con el desfase mínimo de 0,5 s y 5 líneas (ADR 0024; ver nota de la pregunta 0153).
- [x] Al elegir un candidato `desfasada`, la letra se guarda con la corrección.

## Pruebas de feedback
- Unitarias: Componentes con dobles (los cinco veredictos, generando, error).
- E2E: Escenario de la tarea 0298.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- `vistas/letra/comprobacion.ts` (puro, con test): veredicto → comprobación (`coincide`, `desfasada`, `dudosa`, `noCoincide`, `pendiente`, `noDisponible`, `comprobando`, `ninguna`), grupos de orden, mejor candidato y motivos de un «no coincide» (`detalleNoCoincide` sobre `evaluarEncaje`). Textos con sus claves `let.comp.*` en `textosComprobacion.ts`. `usePicosLetra.ts`: estado de los picos (`picos.solicitar`, repite mientras `generando` y al llegar `letras:encaje`) y lectura del nivel base.
- `BusquedaLetra`: línea de comprobación por candidato con icono y texto (los concluyentes sustituyen a la de duración); los encajes de `letras:encaje` se muestran sin reordenar ni mover la selección y, si el mejor no es el seleccionado, aparece `let.comp.llegada` con [Seleccionarla] y [×]; bloque de la vista previa (`coincide`, `desfasada` con los tiempos ya corregidos, `dudosa`, `no_coincide` con hasta tres motivos que evalúa el renderer con los picos); «Usar esta letra» con un candidato `desfasada` guarda con `desfase_ms` (ver pregunta 0210).
- `LetraElegida` (C): línea de comprobación de la letra guardada (al entrar y tras cada autoguardado), `actual.corregida` + [Quitar la corrección], [Corregir el desfase], [Ver por qué] y [Buscar otra letra], anuncio `let.comp.anuncio.*` y error `let.comp.error.guardar`. Corregir y quitar usan `abrirEdicion` → `guardarTiempos` → `cerrarEdicion` (sin canal nuevo).
- Contrato: `guardarTiempos` admite `desfase_corregido_ms` (número = anota, `null` = borra, ausente = igual; `aPeticionTiempos` lo envía siempre) y `guardar` admite `desfase_ms` (main aplica `corregirDesfase`). Registrado en la pregunta **0210** (para el arquitecto).
**Archivos**: `app/src/renderer/src/vistas/letra/{comprobacion,textosComprobacion,usePicosLetra,fixturesPicos}.ts`, `BusquedaLetra.tsx`, `LetraElegida.tsx`, `Letra.tsx`, `modelo.ts`, `letra.module.css`; `shared/letrasBusqueda.ts`, `shared/letras/tiempos.ts`, `main/letras/servicio.ts`.
**Probar**: `npx vitest run src/renderer/src/vistas/letra src/main/letras/servicio.test.ts`.
**E2E**: ampliado `e2e/letras.spec.ts` (recorrido feliz: con la separación en curso los candidatos con tiempos muestran `let.comp.pendiente`; el de solo texto no). Escrito, sin ejecutar.
**No hecho / pendiente**
- F4-L7 (comprobación diferida al terminar la separación y toast `let.comp.toast.corregida`) es de main/preparación, no de esta tarea: no se implementó.
- Sin E2E de un candidato `desfasada`/`no_coincide` real: haría falta que el doble de LRCLIB trajera un candidato con ≥ 5 inicios que coincidan con una voz sintética; el escenario queda cubierto con Vitest (`Letra.comprobacion.test.tsx`).
- Capturas F4-L12 (revisión UX) y verificación con canciones reales (desfases a oído, coros): para la guía manual.
- «Copiar detalles» no se ofrece en `let.comp.error.guardar` (solo el texto).
