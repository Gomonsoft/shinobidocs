# 0304 — Feature 6 · Datos automáticos en «Añadir canción»
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0303
- ADRs: 0025 §6
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 6)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Autocompletado, unificación «¿Te refieres a…?» y procedencia bajo cada campo.

## Criterios de aceptación
- [ ] Criterios de la spec 03 · Feature 6.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `importar-archivo.spec.ts` con un archivo etiquetado.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **UI** (`vistas/anadir/`): `CamposDatos.tsx` (procedencia bajo cada campo con `aria-describedby`, dudosos con icono y texto, `add.dato.sinArtista`, unificar «¿Te refieres a…?» con [Usar]/[Dejarlo así] en `role="status"`, «Intercambiar título y artista» con anuncio), `CampoCombo.tsx` (combobox editable: hasta 8 valores con recuento, ↑/↓/Intro/Esc/Tab, `aria-activedescendant`, ▾; sin lista con la biblioteca vacía) y textos `add.dato.*` en `textos.ts`. `PanelArchivo` y `PanelYoutube` pasan `datos` como `propuesta` (con `iniciales`, no) y su Esc deja a la lista cerrarse sola. `Campos.tsx` gana la prop `junto`.
- **Editar datos** (F6-N9): `DialogoEditarDatos` (`vistas/biblioteca/DialogosCancion.tsx`) usa `CamposDatos` sin propuesta (autocompletado, unificar, intercambio; sin líneas de procedencia).
- **Pruebas**: `CamposDatos.test.tsx` (10, con dobles de `biblioteca.valoresDatos`), `importar-archivo.spec.ts` ampliada con un WAV etiquetado (INAM/IART/IPRD): campos y procedencia, el origen guardado y, en una segunda canción, «Querido...» → «Querido…» «Como en tu biblioteca», lista con ↓ y Esc sin salir de la vista.
- **No hecho (aplazado a la feature 5, pregunta 0220)**: F6-N7 (álbum de LRCLIB, [Quitar], sugerencia «Usar estos datos») y F6-N8 (`add.dato.lrclib` + «Cambiar en Ajustes»).
- **Para la guía manual**: las 10 + 10 de la spec (vídeos reales de YouTube Music/oficiales/«Topic»/«ft.» y archivos propios, anotando correcciones); álbum del artista más repetido escrito como el existente y tema heredado; lectura con lector de pantalla del combobox y del aviso de unificar; capturas F6-N11 (`datos-con-procedencia`, `dato-dudoso`, `autocompletado`, `unificar`; `editar-datos-lrclib` espera a la feature 5).
- **Deuda**: `datosAyuda` cambió al texto nuevo de la spec; con `datos` ausente (workers antiguos) el formulario se ve como antes.
