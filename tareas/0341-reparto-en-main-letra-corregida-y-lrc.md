# 0341 — Feature 1 · Reparto en main: guardar, corregir y sustituir la letra, `.lrc` y paquete
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0340
- ADRs: 0029 §2, 0027 §4, 0021 §4
- Spec UX: docs/ux/05-letra.md#023--feature-1--cantantes-al-corregir-o-cambiar-la-letra y docs/ux/02-biblioteca.md#023--feature-1--coros-en-la-letra-exportada
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que main escriba y conserve el reparto por todos los caminos de la letra.

## Criterios de aceptación
- [x] `ServicioLetras` aplica `parte` y `partes` de `letras.guardarTiempos` con las invariantes de ADR 0029 §1 (`ARGUMENTOS_NO_VALIDOS` si no se cumplen) y `normalizarReparto`; asignar no retira `intacta`, `revisada`, `alineacion` ni `origen_*` (C1-E4, lado main).
- [x] `aplicarTextoEditado`: las líneas emparejadas conservan su parte; una nueva o cambiada hereda la de la anterior, y la primera la de la siguiente (C1-L1).
- [x] Sustituir la letra entera conserva `partes` (cantantes, nombres y nivel) y deja todas las líneas en `c1` (C1-L2, lado main).
- [x] `exportarLrc`: sin cantantes; las líneas `coro` sin paréntesis salen entre paréntesis, sin duplicarlos (C1-B1).
- [x] Exportar e importar un paquete de una canción con reparto lo conserva entero (C1-B2).
- [x] La preparación desatendida no asigna ninguna parte (test del servicio, C1-E12).
- [x] Abrir una canción de 0.2.1 o 0.2.2 no escribe nada.
- [x] **Coherencia con lo que dejó 0.2.2** (añadido el 2026-11-23):
  - `letras.exportarLrcVarias` usa la misma función que una sola letra y saca los coros entre paréntesis.
  - Un paquete o una copia con un **tema** que tiene `colores_partes` y `pantalla.zonas` los conserva al importar. La reutilización de un tema local con «mismo estilo» (ADR 0027, revisión de 0255–0258) usa el `estilosIguales` nuevo.
  - `aplicarFinesPreparacion` («Ajustar los fines…», preparación) y «Quitar esos fines» conservan `parte`.
  - Asignar partes no retira `intacta`, así que «Preparar» y la comprobación diferida se comportan igual con reparto que sin él.
  - El recuento de dudosas tras guardar solo partes no cambia.
  - Test de cada punto.

## Pruebas de feedback
- Unitarias: tests del servicio de letras, `editar.test.ts`, `lrc.test.ts` (ida y vuelta), copias y preparación.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** Todos los criterios, con test cada uno.
- `ServicioLetras.guardarTiempos` (`main/letras/servicio.ts`): `parte` por elemento (ausente = `c1`, igual que el doble `fixturesApi`; una `parte` que llegue en una pausa se descarta) y `partes` (`null` quita, ausente conserva); `validarReparto` → `ARGUMENTOS_NO_VALIDOS` y `normalizarReparto` antes de `letraSchema`. No toca `intacta`, `revisada`, `alineacion` ni `origen_*` (las reglas de `retirarCamposObsoletos` solo miran tiempos y texto).
- `aplicarTextoEditado` (`shared/letras/editar.ts`): las emparejadas conservan la parte; una línea nueva o cambiada hereda la de la anterior (las pausas no cuentan) y las primeras la de la primera línea conservada que sigue. `editarTexto` normaliza el reparto.
- `guardar` (sustituir la letra): conserva `partes` de la canción y todas las líneas quedan en `c1`.
- `exportarLrc` (`shared/letras/lrc.ts`): coros entre paréntesis sin duplicar (usa `textoEnPantalla`); `exportarLrcVarias` y `exportarUna` comparten `lrcDeCancion`, con test.
- `aPeticionTiempos` (`shared/letras/tiempos.ts`) envía `parte` (solo en líneas) y `partes` si existen; sin reparto la petición es idéntica a la de 0.2.2. Para quitar `partes` quien llama añade `partes: null` (lo hace `guardado.ts` del editor).
- Paquete/copia: test de ida y vuelta de una canción con reparto (`main/copias/reparto.test.ts`) y de un tema con `colores_partes` y `pantalla.zonas`, incluida la reutilización por «mismo estilo» con `estilosIguales` (ya lo usaba `copias/temas.ts`).
- Preparación: la desatendida no asigna partes ni crea `partes`; `aplicarFinesPreparacion` y «Quitar esos fines» (`guardarTiempos` con `fin_ms: null`) conservan `parte`/`partes`; guardar solo partes no retira `intacta` ni cambia `contarDudosasGuardadas`.
- `normalizarReparto` ya trataba `voz_en_coros === 0.5` como ausente al decidir si quita `partes` (respuesta a 0330): test existente en `shared/reparto.test.ts`.
- Regresión 0.2.2: reenviar los mismos tiempos de una canción sin reparto no escribe (mismo `cancion.json`), y un cambio de tiempos no añade `parte` ni `partes`. Abrir una canción antigua no escribe (`abrirEdicion` no escribe).

**Archivos.** `main/letras/servicio.ts`, `shared/letras/{editar,lrc,tiempos}.ts`; tests: `main/letras/servicio.reparto.test.ts` (nuevo), `exportarLrc.test.ts`, `shared/letras/{editar,lrc}.test.ts`, `main/preparacion/servicio.test.ts`, `main/copias/reparto.test.ts` (nuevo).

**Cómo probarlo.** `npx vitest run src/main/letras src/main/preparacion src/main/copias src/shared/letras`.

**Deuda.** Ninguna manual. Decisión conservadora: una `parte` en una pausa se descarta en silencio en lugar de rechazarse (la 0340 pedía retirarla; el ADR dice «no se admite»). Si el arquitecto prefiere rechazarla, es un `throw` en `guardarTiempos`.
