# 0284 — Feature 3 · Comparación de versiones y servicio de actualizaciones en main
- Estado: Pendiente
- Paso del pipeline: 0
- Depende de: 0339
- ADRs: 0023, 0020, 0008, 0006
- Spec UX: docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 3), docs/ux/09-descarga-e-instalacion.md (0.2.2 · Feature 3)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Implementar en main la consulta diaria a la API de Releases de GitHub, la comparación SemVer y el estado persistido, con su IPC y sus dobles, sin interfaz.

## Criterios de aceptación
- [ ] `shared/version.ts`: `compararVersiones` (precedencia SemVer 2.0) y `analizarEtiqueta` (formato de ADR 0020 §2).
- [ ] `main/actualizaciones/`: petición de ADR 0023 §1 (cabeceras exactas, `credentials: 'omit'`, 10 s, 1 MB, Zod por entrada), filtro de canal, mayor versión superior y construcción de enlaces por plataforma (`APPIMAGE` en Linux; página si falta el recurso).
- [ ] Calendario: 10 s tras mostrar la ventana si pasaron 24 h; temporizador horario; `powerMonitor` `resume`; `desarrollo` y `local` no consultan nunca.
- [ ] `config.actualizaciones` con lectura tolerante por campo; `avisar` en `configParcialRendererSchema`; canales `actualizaciones.estado`, `.comprobar`, `.marcarVista` y evento `actualizaciones:cambio` con validación de remitente.
- [ ] `SHINOBI_GITHUB_URL`, `SHINOBI_ACTUALIZACIONES_VERSION` y `SHINOBI_ACTUALIZACIONES_CANAL` solo sin empaquetar.

## Pruebas de feedback
- Unitarias: `version.test.ts` (tabla SemVer, etiquetas válidas e inválidas); servicio con `fetch` inyectado: sin red, 403, cuerpo inválido, canal estable frente a previa, 24 h y `resume`, enlaces por plataforma.
- E2E: Ninguna en esta tarea (la de la interfaz, 0285, comprueba las cabeceras con el doble).
- Críticos: sí (toca `main/` y `shared/`)
- Manual: Consulta real contra las Releases publicadas (guía de la feature 3).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
