# 0037 — ¿La app debe actualizarse sola?
- De: arquitecto
- Para: usuario
- Estado: Respondida
- Bloquea: no. Solo condiciona 0142. Con otra respuesta se crean tareas nuevas.

## Contexto
La autoactualización no aparece en el alcance del MVP ni en ninguna tarea. Hoy, para actualizar, el usuario descargaría de nuevo el instalador. yt-dlp ya se actualiza solo y no depende de esto.

Sin firma de código, la autoactualización no sería fiable: macOS exige firma para su actualizador, y en Windows la comprobación de firma tendría que ir desactivada. Además, los enlaces necesitan un repositorio público ([0035](0035-repositorio-publico-y-primera-publicacion.md)).

## Pregunta
- **A. Sin autoactualización en el MVP** (recomendada). La nota de cada versión avisa de lo nuevo; se reconsidera si se firman los instaladores.
- **B. Solo un aviso dentro de la app** de que hay versión nueva, con enlace a la página de descarga. Supone una consulta a GitHub al arrancar: es un acceso a internet nuevo que habría que poder desactivar, y requiere diseño.
- **C. Autoactualización completa** en Windows y Linux, sin macOS. Coste alto y sin la protección de la firma. No la recomiendo.

## Opción provisional tomada (si no bloquea)
**A**: `publish: null` y `differentialPackage: false`; no se generan ni se guardan los archivos del actualizador.

## Seguimiento (2026-11-21, disenador-ux)
El [plan de 0.2.2](../versiones/0.2.2/plan-4.md) acepta por defecto la [propuesta 026](../propuestas/026-aviso-de-version-nueva.md), que es la opción **B** de esta pregunta (feature 3). La opción provisional pasa de A a **B**: la app avisa de una versión nueva y enlaza a su descarga, sin descargar ni instalar nada; `publish: null` y `differentialPackage: false` se mantienen. Spec: [08 · Feature 3](../ux/08-ajustes-y-acerca.md#022--feature-3--aviso-de-versión-nueva) y [09 · Feature 3](../ux/09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva). Lo que queda por confirmar al usuario (activado por defecto, dónde se ve, frecuencia) está en [0155](0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md) §9–§13; los contratos técnicos, en [0156](0156-contratos-de-las-features-1-a-3-de-0-2-2-para-las-specs.md) §14–§20. Esta pregunta sigue abierta hasta que el usuario lo confirme o la sesión principal la cierre.

## Respuesta

Respondida el 2026-11-21 por la regla de decisión del plan de 0.2.2 (propuesta [026](../propuestas/026-aviso-de-version-nueva.md), «Aceptada por defecto»): **opción B**. La app avisa de una versión nueva consultando la API de *Releases* de GitHub, con interruptor y sin descargar ni instalar nada. Detalle en el [ADR 0023](../adr/0023-aviso-de-version-nueva-con-github-releases.md). `publish: null` sigue (ADR 0020). Se reconsiderará la autoactualización si se firman los instaladores. El usuario puede cambiarlo (pregunta [0159](0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md)).
