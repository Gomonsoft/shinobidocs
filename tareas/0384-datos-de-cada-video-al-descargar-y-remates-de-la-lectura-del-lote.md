# 0384 — Feature 7 · Datos de cada vídeo al descargarlo, nombre de la carpeta leída y tiempo estimado de los enlaces sueltos
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0316 (en curso: mismo lote). La interfaz de la tabla es de la 0315.
- ADRs: 0026 (revisión «Datos de cada vídeo al descargar y remates de la lectura (pregunta 0285)»), 0025 §6
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7, respuesta a 0285 n.º 4, 5 y 6)
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 7. **alpha.3 si cabe; si retrasa su cierre, pasa a alpha.4 sin bloquear** (hasta entonces se acepta la consulta vídeo a vídeo con pausa y `add.lote.completando`). Lote D (`worker/shinobi_worker/youtube.py`, `main/fuente/**`, `vistas/anadir/**`). `shared/ipc.ts` va con un cambio pequeño acordado.

## Objetivo

Que la tabla de una lista de YouTube se rellene solo con lo que trae la lista, sin 50 consultas a YouTube. Los datos propios de cada vídeo llegan al descargarlo, sin una petición más. Y dos remates pequeños de la lectura.

## Criterios de aceptación

1. [ ] **Worker**: el resultado de `descargar-youtube` añade `musica` con `metadatos_youtube.campos_musica(info)`, con el mismo `info` de la descarga y **sin otra petición**. Es opcional: si falla, sale `null`.
2. [ ] **Main, al completar la descarga** (antes de marcar `pasos.fuente` completado y, por tanto, antes de que la preparación busque la letra):
   - Con `musica`, se calcula la propuesta por campo con la misma lógica de `main/fuente/propuestaDatos.ts` que usa `infoYoutube`.
   - Se escribe por la cola de metadatos de la biblioteca **solo** en estos campos:
     - **título y artista**: si su `metadatos.origen` está ausente o es `nombre` (heurística o dato de la lista), y la propuesta es de origen `fuente` (campos de música). Una heurística nunca sustituye a otra.
     - **álbum**: solo si está vacío. El álbum de la lista es una agrupación que el usuario vio en la tabla y no se cambia.
     - **nunca** un campo con origen `usuario`, `fuente` o `lrclib`.
   - El origen escrito es `fuente`. El cambio de tema heredado que pueda causar se acepta, como con el álbum de LRCLIB (ADR 0025 §6).
3. [ ] **Interfaz** (cuando la spec 03 lo fije): la tabla de una lista ya no llama a `fuente.infoYoutube` por entrada; usa los datos de `infoLista`. Desaparece `add.lote.completando`.
4. [ ] **Nombre de la carpeta leída**: `fuente.leerCarpeta()` por el diálogo del sistema devuelve además `carpeta?: string`, solo el nombre (`path.basename`), nunca la ruta. Con una ruta dada (arrastrar), igual.
5. [ ] **Tiempo de los enlaces sueltos**: `fuente.espacioLibre()` devuelve `{ libreBytes, factorMinutos }`, con `factorMinutos` igual que en `leerArchivos` (`number | null`). El modo lote con enlaces sueltos lo llama una vez y estima el tiempo como las otras lecturas. Deja de salir `sinTiempo` cuando el factor existe.

## Pruebas de feedback

- Unitarias:
  - pytest: `descargar_youtube` con una fuente falsa que trae campos de música → `musica` en el resultado; sin campos → `null`; no hay una segunda llamada a la fuente.
  - Vitest en main: la regla por campo del punto 2 con cada origen (ausente, `nombre`, `fuente`, `usuario`, `lrclib`) y el álbum vacío o lleno.
  - `leerCarpeta` con `carpeta`; `espacioLibre` con `factorMinutos`.
- E2E: `e2e/importar-lote.spec.ts`: lista con el doble de YouTube. La tabla se rellena sin consultas por vídeo (contador del doble) y, tras la descarga, el título de un vídeo de música cambia salvo el que se editó en la tabla.
- Críticos: sí (toca la descarga del flujo principal).
- Manual: guía de la feature 7, con una lista real pequeña: tiempo de lectura de la tabla y datos tras descargar.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:cambios`, `uv run pytest` y `ruff`.

## Notas de implementación

(las rellena el programador al terminar)
