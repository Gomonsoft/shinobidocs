# 0372 — Feature 5 · Evento propio del aviso de tanda y LRCLIB sin red real en los E2E
- Estado: Hecha
- Paso del pipeline: 3 (transversal)
- Depende de: 0309
- ADRs: 0025 (revisión de la pregunta 0224), 0005
- Spec UX: docs/ux/04-progreso-pipeline.md (0.2.2 · Feature 5, aviso al terminar la tanda)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5 (alpha.2). Lote D, con un cambio pequeño acordado en `shared/canales.ts`, `preload/index.ts` y `shared/letrasBusqueda.ts`.

## Objetivo
Dos correcciones de la pregunta 0224: que el clic en la notificación de una tanda no se disfrace de «abrir canción», y que ningún E2E pueda salir a lrclib.net real aunque olvide la fixture.

## Criterios de aceptación
- [x] `shared/canales.ts`: evento `eventos.abrirResultadoPreparacion: 'preparacion:abrirResultado'` (sin carga). `preload/index.ts`: `preparacion.alAbrirResultado(cb)`. En `main/index.ts`, el clic en la notificación de un aviso `tanda` trae la ventana principal al frente y emite ese evento, **no** `abrirCancion`. El aviso `tanda` no necesita `cancionId`: si el esquema lo exige, se queda en `''`, pero ningún consumidor lo usa.
- [x] `shared/letrasBusqueda.ts`: `urlBaseLrclib(valor, empaquetada, e2e = false)`. Si `!empaquetada && e2e` y `valor` no es una URL admitida (127.0.0.1 o `http://lrclib.invalid`), devuelve `'http://lrclib.invalid'` en lugar de `URL_BASE_LRCLIB`. Empaquetada, `e2e` se ignora.
- [x] Las dos llamadas de main (`main/letras/lrclib.ts`, cliente de búsqueda, y el `hayConexion` de `main/index.ts`) pasan `e2e: process.env.SHINOBI_E2E === '1'`; el registro dice qué URL base se usa.
- [x] qa (aparte) pone `SHINOBI_E2E=1` en el lanzador común de los E2E; esta tarea lo anota para la sesión principal.

## Pruebas de feedback
- Unitarias:
  - `letrasBusqueda.test.ts`: con `e2e` y sin valor, `http://lrclib.invalid`; con `e2e` y `http://127.0.0.1:1234`, ese valor; empaquetada con `e2e`, `URL_BASE_LRCLIB`; sin `e2e`, como hoy.
  - Test de main: el clic en la notificación de un aviso `tanda` emite `preparacion:abrirResultado` y no `app:abrirCancion`.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- `urlBaseLrclib(valor, empaquetada, e2e = false)` (`shared/letrasBusqueda.ts`): sin empaquetar y con `e2e`, sin URL admitida devuelve `http://lrclib.invalid`; empaquetada, `e2e` se ignora. La usan `crearClienteLrclib` (lee `env.SHINOBI_E2E`, y el registro ya dice la URL base) y el `hayConexion` de `main/index.ts` (`process.env.SHINOBI_E2E === '1'`).
- Evento `preparacion:abrirResultado` (`eventos.abrirResultadoPreparacion`, sin carga), `preparacion.alAbrirResultado(cb)` en preload y en el tipo de la API (y su doble `apiNuevaFalsa.ts`). `ServicioAvisos`: el clic en la notificación de un aviso `tanda` trae la ventana y llama a `difundirAbrirResultado`, no a `abrirCancion`; `main/index.ts` lo cablea. El aviso sigue llevando `cancionId: ''`, que nadie usa.
- Pruebas: `letrasBusqueda.test.ts` (casos de `e2e`) y `avisos/servicio.test.ts` (clic en tanda).
- **Para la sesión principal / qa**: poner `SHINOBI_E2E=1` en el lanzador común de los E2E. El renderer (0311) debe suscribirse a `alAbrirResultado` para abrir el diálogo de resultado.
