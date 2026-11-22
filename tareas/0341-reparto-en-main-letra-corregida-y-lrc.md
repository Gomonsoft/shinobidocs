# 0341 — Feature 1 · Reparto en main: guardar, corregir la letra, sustituirla y `.lrc`
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0340
- ADRs: 0029 §2, 0027 §4, 0021 §4
- Spec UX: — (ADR 0029 §2)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que main escriba y conserve el reparto por todos los caminos de la letra.

## Criterios de aceptación
- [ ] `ServicioLetras` aplica `parte` y `partes` de `letras.guardarTiempos` con las invariantes de ADR 0029 §1 (rechazo con `ARGUMENTOS_NO_VALIDOS`) y `normalizarReparto`; asignar no retira `intacta`, `revisada`, `alineacion` ni `origen_*`.
- [ ] `aplicarTextoEditado`: una línea nueva o cambiada hereda la parte de la anterior (`c1` si es la primera); las emparejadas la conservan.
- [ ] Sustituir la letra entera conserva `partes` y deja todas las líneas en `c1`.
- [ ] `exportarLrc`: sin partes; las líneas `coro` sin paréntesis salen entre paréntesis.
- [ ] Abrir una canción de 0.2.1 o 0.2.2 no escribe nada.

## Pruebas de feedback
- Unitarias: tests del servicio de letras, `editar.test.ts`, `lrc.test.ts` (ida y vuelta: la sugerencia de coro encuentra las líneas reimportadas).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
