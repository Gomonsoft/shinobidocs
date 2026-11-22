# 0330 — Feature 10 · Modelos por idioma, cola y canales en main (si la prueba sirve)
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0328, 0296
- ADRs: 0028 §3.2, 0009 §4
- Spec UX: docs/ux/08-ajustes-y-acerca.md y 06-editor.md (0.2.2 · Feature 10)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Descarga de modelos por idioma, trabajo en la cola `pesada` sin paso persistido y canales para el editor y la preparación.

## Criterios de aceptación
- [ ] `modelos_alineacion[]` en el manifiesto; `DescargadorModelos` reanudable; quitar modelo; `config.alineacion.modelos_descargados`.
- [ ] `GestorTrabajos` admite `paso: null`; worker residente con cierre a los 5 min.
- [ ] Códigos `ALINEACION_NO_DISPONIBLE` e `IDIOMA_NO_ADMITIDO`.

## Pruebas de feedback
- Unitarias: Main con dobles del descargador y del worker.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
