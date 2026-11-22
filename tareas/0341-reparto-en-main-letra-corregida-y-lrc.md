# 0341 — Feature 1 · Reparto en main: guardar, corregir y sustituir la letra, `.lrc` y paquete
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0340
- ADRs: 0029 §2, 0027 §4, 0021 §4
- Spec UX: docs/ux/05-letra.md#023--feature-1--cantantes-al-corregir-o-cambiar-la-letra y docs/ux/02-biblioteca.md#023--feature-1--coros-en-la-letra-exportada
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que main escriba y conserve el reparto por todos los caminos de la letra.

## Criterios de aceptación
- [ ] `ServicioLetras` aplica `parte` y `partes` de `letras.guardarTiempos` con las invariantes de ADR 0029 §1 (`ARGUMENTOS_NO_VALIDOS` si no se cumplen) y `normalizarReparto`; asignar no retira `intacta`, `revisada`, `alineacion` ni `origen_*` (C1-E4, lado main).
- [ ] `aplicarTextoEditado`: las líneas emparejadas conservan su parte; una nueva o cambiada hereda la de la anterior, y la primera la de la siguiente (C1-L1).
- [ ] Sustituir la letra entera conserva `partes` (cantantes, nombres y nivel) y deja todas las líneas en `c1` (C1-L2, lado main).
- [ ] `exportarLrc`: sin cantantes; las líneas `coro` sin paréntesis salen entre paréntesis, sin duplicarlos (C1-B1).
- [ ] Exportar e importar un paquete de una canción con reparto lo conserva entero (C1-B2).
- [ ] La preparación desatendida no asigna ninguna parte (test del servicio, C1-E12).
- [ ] Abrir una canción de 0.2.1 o 0.2.2 no escribe nada.

## Pruebas de feedback
- Unitarias: tests del servicio de letras, `editar.test.ts`, `lrc.test.ts` (ida y vuelta), copias y preparación.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
