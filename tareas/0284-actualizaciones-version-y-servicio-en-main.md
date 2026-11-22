# 0284 — Feature 3 · Comparación de versiones y servicio de actualizaciones en main
- Estado: Hecha
- Paso del pipeline: 0
- Depende de: 0339
- ADRs: 0023, 0020, 0008, 0006
- Spec UX: docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 3), docs/ux/09-descarga-e-instalacion.md (0.2.2 · Feature 3)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Implementar en main la consulta diaria a la API de Releases de GitHub, la comparación SemVer y el estado persistido, con su IPC y sus dobles, sin interfaz.

## Criterios de aceptación
- [x] `shared/version.ts`: `compararVersiones` (precedencia SemVer 2.0) y `analizarEtiqueta` (formato de ADR 0020 §2).
- [x] `main/actualizaciones/`: petición de ADR 0023 §1 (cabeceras exactas, `credentials: 'omit'`, 10 s, 1 MB, Zod por entrada), filtro de canal, mayor versión superior y construcción de enlaces por plataforma (`APPIMAGE` en Linux; página si falta el recurso).
- [x] Calendario: 10 s tras mostrar la ventana si pasaron 24 h; temporizador horario; `powerMonitor` `resume`; `desarrollo` y `local` no consultan nunca.
- [x] `config.actualizaciones` con lectura tolerante por campo; `avisar` en `configParcialRendererSchema`; canales `actualizaciones.estado`, `.comprobar`, `.marcarVista` y evento `actualizaciones:cambio` con validación de remitente.
- [x] `SHINOBI_GITHUB_URL`, `SHINOBI_ACTUALIZACIONES_VERSION` y `SHINOBI_ACTUALIZACIONES_CANAL` solo sin empaquetar.

## Pruebas de feedback
- Unitarias: `version.test.ts` (tabla SemVer, etiquetas válidas e inválidas); servicio con `fetch` inyectado: sin red, 403, cuerpo inválido, canal estable frente a previa, 24 h y `resume`, enlaces por plataforma.
- E2E: Ninguna en esta tarea (la de la interfaz, 0285, comprueba las cabeceras con el doble).
- Críticos: sí (toca `main/` y `shared/`)
- Manual: Consulta real contra las Releases publicadas (guía de la feature 3).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** `shared/version.ts` (`compararVersiones` SemVer 2.0, `analizarEtiqueta`, `esPrevia`). `main/actualizaciones/`: `consulta.ts` (petición de ADR 0023 §1 con `credentials: 'omit'`, `cache: 'no-store'`, `redirect: 'error'`, 10 s, 1 MB, Zod por entrada, filtro de canal, mayor versión superior, enlaces por plataforma) y `servicio.ts` (`ServicioActualizaciones`: 10 s tras mostrar la ventana, temporizador horario, `powerMonitor` `resume`, manual de una en una, `marcarVista`, retirada de la `disponible` ya instalada, evento de cambio; `desarrollo` y `local` nunca consultan, ni a mano). `config.actualizaciones` y `avisar` en `configParcialRendererSchema` ya venían de 0339. Variables `SHINOBI_GITHUB_URL` (solo `http://127.0.0.1:<puerto>` o `http://github.invalid`), `SHINOBI_ACTUALIZACIONES_VERSION` y `SHINOBI_ACTUALIZACIONES_CANAL`, solo sin empaquetar.

**Cambios en archivos comunes (mínimos).** `main/ipc/handlers.ts`: tres manejadores reales (salen de `CANALES_NO_IMPLEMENTADOS`), dependencia `actualizaciones` y reenvío de `actualizaciones:cambio` a la principal. `main/index.ts`: crea el servicio, lo inicia en `ready-to-show` de la principal y lo detiene al salir. `shared/ipc.ts`: `estadoActualizacionesSchema` gana `enlaces` (pregunta [0180](../preguntas/0180-detalles-del-aviso-de-version-nueva-0284-0285.md)).

**Pruebas.** `shared/version.test.ts` (tabla SemVer, etiquetas válidas e inválidas) y `main/actualizaciones/actualizaciones.test.ts` (fetch inyectado: sin red, 403, cuerpo no JSON/>1 MB, tiempo agotado, canal estable/previa, borradores, 24 h, `resume`, enlaces por plataforma, una manual a la vez, variables `SHINOBI_*`). La E2E con el doble está en 0285.

**Decisiones.** Un fallo automático no vuelve a intentarse hasta 24 h después (en memoria); no escribe en la config. Un cuerpo que no es una lista JSON es error; una lista vacía o sin versiones válidas es «al día».

**Deuda / manual.** Consulta real contra las Releases publicadas (guía de la feature 3, tarea 0286).


**Remate tras qa.** D1: `evaluar()` no consulta antes de `iniciar()` (los cambios de configuración ya no adelantan los 10 s); test «un cambio de configuración antes de iniciar no consulta». Pregunta 0180: test de que «Buscar» manual no espera las 24 h tras un intento automático fallido (el código ya lo cumplía: `comprobar()` no mira `ultimoIntentoAuto`).
