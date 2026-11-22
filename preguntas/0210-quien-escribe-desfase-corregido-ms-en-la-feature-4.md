# 0210 — Quién escribe `desfase_corregido_ms` en la feature 4 (0.2.2)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en las tareas [0299](../tareas/0299-comprobacion-en-la-vista-letra.md) y [0300](../tareas/0300-comprobar-la-letra-en-el-editor.md))

## Contexto

ADR 0024 §1 dice que «Corregir el desfase» anota `letra.desfase_corregido_ms` y que en el editor se guarda «con `letras.guardarTiempos`, que ya escribe `offset_ms`». Pero `guardarTiempos` solo escribía `offset_ms`, `origen_fin` y `revisada`, y `letras.guardar` ponía `offset_ms: 0` sin admitir ninguna corrección. Ningún canal escribía `desfase_corregido_ms` (lo dejó anotado la tarea 0298). La vista Letra necesita además guardar una letra nueva ya corregida (spec 05, F4-L5) y corregir o quitar la corrección sobre la letra elegida (C).

## Pregunta

¿Se confirman estos cambios mínimos de contrato (`shared/letrasBusqueda.ts`, `main/letras/servicio.ts`)?

1. `letras.guardarTiempos`: campo nuevo opcional `desfase_corregido_ms: number | null` (±30 s). Número = se anota; `null` = se borra (quitar la corrección); ausente = no cambia. `aPeticionTiempos` lo envía siempre (`letra.desfase_corregido_ms ?? null`), igual que el resto del estado de la línea.
2. `letras.guardar`: campo nuevo opcional `desfase_ms` (±30 s). Main calcula `corregirDesfase({ offset_ms: 0 }, desfase_ms)` (10 ms, ±30 s) y guarda `offset_ms` y `desfase_corregido_ms` con la letra nueva; ningún tiempo de línea cambia. La vista Letra lo manda al usar un candidato `desfasada`.
3. En C (letra ya elegida) «Corregir el desfase» y «Quitar la corrección» no tienen sesión de edición: la vista hace `abrirEdicion` → `guardarTiempos` (con `offset_ms` y `desfase_corregido_ms` nuevos) → `cerrarEdicion`, sin canal nuevo. Main retira `revisada` por el cambio de `offset_ms` (pregunta 0172).

## Opción provisional tomada (si no bloquea)

Exactamente lo anterior (1, 2 y 3). Alternativa si se prefiere: un canal propio `letras.corregirDesfase({ cancionId, desfaseMs | null })` que haga todo en main; costaría un canal más en `canales.ts`, `ipc.ts`, `preload` y `handlers`.

## Respuesta

Arquitecto, 2026-11-22. **Se confirman los tres puntos tal como están aplicados; no hay cambios de código.** Queda fijado en ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), «Revisión 2026-11-22 (pregunta 0210)».

1. **`guardarTiempos.desfase_corregido_ms`**: confirmado. Un número lo anota, `null` lo borra y si falta no se toca; el editor lo envía siempre. Cambiar `offset_ms` retira `revisada` (0172) y no toca `intacta` ni `origen_fin`.
2. **`guardar.desfase_ms`**: confirmado. Main aplica `corregirDesfase` sobre `offset_ms: 0` y guarda `offset_ms` y `desfase_corregido_ms` con la letra nueva. La letra sigue `intacta`, porque ningún tiempo de línea cambia; así la preparación (ADR 0025) puede continuar con los fines.
3. **Corregir y quitar en C** con `abrirEdicion` → `guardarTiempos` → `cerrarEdicion`: confirmado. No hace falta un canal propio: es el camino de cualquier otra escritura de tiempos y respeta `EDICION_BLOQUEADA` y el único escritor.

La comprobación diferida al terminar la separación (F4-L7) la hace main con estos mismos contratos: tarea nueva [0367](../tareas/0367-comprobacion-diferida-y-remates-de-la-feature-4.md).
