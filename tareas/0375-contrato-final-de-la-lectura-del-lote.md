# 0375 — Feature 7 · Contrato final de la lectura del lote (espacio, tiempo, filas con ✕ y recortes)
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0313, 0314
- ADRs: 0026 §1 (revisión de la pregunta 0261)
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7: revisión, límite, espacio y duplicados)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 7 (alpha.3). Lote D, con un cambio pequeño acordado en `shared/ipc.ts`, `shared/canales.ts` y `preload/index.ts`. Va antes de la 0315.

## Objetivo
Que la lectura del lote dé a la interfaz todo lo que la spec 03 necesita antes de pulsar «Añadir».

## Criterios de aceptación
- [ ] `shared/ipc.ts`:
  - `lecturaLoteSchema` gana `libreBytes: number | null`, `factorMinutos: number | null` y `truncada: boolean`;
  - `filaLoteSchema` gana `problema: z.enum(['ilegible','corta']).nullable()`;
  - `listaYoutubeSchema` gana `libreBytes`, `factorMinutos` y, por entrada, `problema: z.enum(['no_disponible','directo']).nullable()` (con `disponible` = `problema === null`);
  - comentarios corregidos: `rechazadas` = lo no mostrado; `recortada`/`truncada` = cortado en 500.
- [ ] Canal nuevo `fuente.espacioLibre()` → `{ libreBytes: number | null }` (rol principal), en `canales.ts`, `ipc.ts`, `preload` y `handlers`.
- [ ] `shared/lote.ts` (nuevo, puro): `estimarEspacioLote(duracionesMs)` (lo que hoy está en `main/fuente/lote.ts`: 100 MB por 4 min, +10 %) y `estimarTiempoLote(duracionesMs, factorMinutos)`; `main/fuente/lote.ts` las usa (mismo `SIN_ESPACIO` y `caben`).
- [ ] Main:
  - un archivo de audio ilegible es una fila con `problema: "ilegible"` (`duracionMs: null`, datos del nombre); uno de menos de 10 s, `"corta"`;
  - `rechazadas` solo cuenta lo no mostrado;
  - carpeta: hasta 500 archivos de audio y como mucho 5 000 entradas listadas, con `truncada`.
- [ ] Worker `info-lista-youtube`: `problema: "directo"` si `live_status` es `is_live` o `is_upcoming`; `"no_disponible"` si `availability` es privado o necesita cuenta, o si el título es un marcador de vídeo privado o eliminado.
- [ ] Álbum de lista: main guarda `listaId → { titulo, tipo }` durante 30 min; `fuente.infoYoutube(url)` con `list=` usa ese título como álbum propuesto (origen `lista`). Sustituye a «la última lista leída».

## Pruebas de feedback
- Unitarias:
  - Vitest: `lote.test.ts` (shared, estimaciones), lectura con ilegible, corta y `truncada`, `espacioLibre`, álbum por `listaId` con dos listas leídas;
  - pytest: `info-lista-youtube` con el doble (una entrada en directo, una privada).
- E2E: Ninguna nueva (la de 0314 sigue pasando).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` por el worker).

## Notas de implementación
(las rellena el programador al terminar)
