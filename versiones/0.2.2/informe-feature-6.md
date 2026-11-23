# Informe de la feature 6 de 0.2.2 · Datos de la canción automáticos

Tareas: [0302](../../tareas/0302-metadatos-de-archivo-youtube-y-nombre.md), [0303](../../tareas/0303-propuesta-de-datos-por-campo-en-main.md), [0304](../../tareas/0304-datos-automaticos-en-anadir-cancion.md) y [0305](../../tareas/0305-verificacion-e-informe-de-la-feature-6.md). Decisión: [ADR 0025](../../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) (§6 y revisión de la pregunta 0220). Spec: [03 · Feature 6](../../ux/03-anadir-cancion.md#022--feature-6--datos-de-la-canción-automáticos). F6-N7 y F6-N8 (álbum de LRCLIB y su aviso) pasaron a la feature 5 y **no** se verifican aquí.

**Veredicto: hecha con reservas.** Ejecutado el 2026-11-22 en un Mac M1 sobre `version-0.2.2` con el árbol de trabajo de la 0308 sin confirmar; el CI no se ha consultado (sin PR borrador). Reservas:

1. **Pendiente del usuario**: las «10 + 10» (tasa de correcciones con vídeos y archivos reales), el lector de pantalla y el comportamiento con Tab ([guía](../../Test-manuales/0.2.2/feature-6-datos-automaticos.md)). **No se marca como cumplido.**
2. **Tres decisiones de UX abiertas** (preguntas 0230, 0231 y 0232) y tres defectos bajos.
3. Capturas sin revisar por el diseñador; falta `editar-datos-lrclib` (feature 5).
4. Un E2E ajeno a la feature falla con el árbol actual (`importar-youtube.spec.ts:349`, pregunta 0233): es de la reanudación al abrir de la feature 5.

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` / `lint` / `format:check` | Limpios al empezar. Al terminar, lint y format limpios y **typecheck con 1 error ajeno**: `src/renderer/src/vistas/biblioteca/TarjetaCancion.tsx(430,19)` TS7053 (`AccionTarjeta` no tiene `revisar`), trabajo a medias de la feature 5 que apareció durante la sesión; no es de esta feature y no lo toqué |
| Vitest de la feature (`shared/metadatosNombre`, `shared/identidad`, `main/fuente/propuestaDatos`, `main/biblioteca/origen`, `vistas/anadir`) | 8 archivos, **132 pasan** |
| Vitest `src/main/fuente` + `src/main/biblioteca` (incluye `archivo.test.ts`, `youtube.test.ts` con el worker real y `servicio.test.ts`) | 13 archivos, **141 pasan** |
| `uv run pytest` (worker) / `uv run ruff check` | **351 pasan**, 7 deseleccionadas / limpio |
| `npm run build` | Correcto |
| `e2e/importar-archivo`, `importar-youtube`, `biblioteca`, `biblioteca-acciones` | Primera pasada, 22 de 22. Tras la protección de red y con el árbol nuevo: **23 pasan, 1 falla** (`importar-youtube.spec.ts:349`, pregunta 0233; falla también en solitario, 2 de 2) |
| `npm run test:e2e:criticos` (y de nuevo tras la protección) | **1 de 1 pasa** (14-16 s) |
| `e2e/sin-red-real.spec.ts` (nueva, ver abajo) | 2 de 2 pasan |
| Capturas (`SHINOBI_CAPTURAS_022_6=1`) | 4 de 4 pruebas, 8 capturas |

No lancé dos `vitest` a la vez. Los conocidos de entorno (`ventana.spec.ts`, `editor.spec.ts:410`, `editor-layout.spec.ts:872`) no se ejecutaron: no tocan esta feature.

## Criterios → evidencia

| Criterio | Estado | Evidencia |
|---|---|---|
| F6-N1 | **Cubierto** | Vitest `metadatosNombre.test.ts` (17 nombres, incluidos `audio_final2.wav`, `03 - …` y `Artista - Álbum - NN - Título`), `propuestaDatos.test.ts`; pytest con un FLAC y un MP3 etiquetados; E2E `importar-archivo.spec.ts` (WAV con INAM/IART/IPRD: tres líneas «De las etiquetas del archivo», origen guardado en `cancion.json`) |
| F6-N2 | **Cubierto** | `propuestaDatos.test.ts` («Grupo – Tema» del canal «Grupo Official»; canal como artista dudoso) y `youtube.test.ts` con el worker real y el doble de yt-dlp (campos de pista → origen `pista`). Sin E2E de la procedencia de YouTube; en la captura `dato-dudoso` se ve «Del nombre del canal: compruébalo» |
| F6-N3 | **Cubierto** | `propuestaDatos.test.ts` («como en tu biblioteca»), `CamposDatos.test.tsx` (Usar y Dejarlo así) y E2E «Querido...» → «Querido…» con «Como en tu biblioteca». Que Dejarlo así «permita continuar» no tiene prueba propia (no bloquea nada en el código) |
| F6-N4 | **Cubierto con matices** | `CamposDatos.test.tsx` (contiene sin mayúsculas ni tildes, recuento, Intro, ↓, `aria-expanded`, `aria-activedescendant`, Esc sin propagarse, álbumes del artista primero, biblioteca vacía sin lista) y E2E (↓ y Esc sin salir de la vista). **Sin prueba**: el tope de 8 y el orden por canciones. **Solo manual**: lector de pantalla |
| F6-N5 | **Cubierto** | `CamposDatos.test.tsx` (solo con los dos rellenos, intercambia, quita la procedencia, anuncia) y captura del diálogo |
| F6-N6 | **Cubierto en lo de esta feature** | `CamposDatos.test.tsx` (la procedencia desaparece al editar), `origen.test.ts` y `propuestaDatos.test.ts` (`usuario`), E2E (`origen: { titulo: 'usuario', … }`). La parte «tras aplicar una letra de LRCLIB el título no cambia» la prueba la feature 5 (`origen.test.ts` ya la cubre para el álbum) |
| F6-N9 | **Parcial** | `CamposDatos` se comparte y su prueba «sin propuesta» cubre el diálogo; el E2E de Editar datos solo guarda título y álbum. **Ninguna prueba automática monta «Editar datos» con autocompletado, unificar o intercambio.** Lo comprobé una vez en la spec de capturas (aserciones ejecutadas y capturas `biblioteca-…-editar-datos-*`), que es opt-in y no cuenta como CI |
| F6-N10 | **Cubierto por construcción** | `proponerDatos` y la unificación son funciones puras sin red; los E2E de importar corren sin red real. Verificación con monitor de red → guía, caso 5 |
| F6-N11 | **Cubierto (4 de 5)** | 8 capturas ([abajo](#capturas)); falta `editar-datos-lrclib` (feature 5) |

Orden de fuentes por campo, «Como en tu biblioteca», inversión título/artista y origen `usuario`: revisados por lectura frente al ADR y la spec, sin discrepancias salvo D1-D3 (abajo). Que nada sale a la red al proponer: `propuestaDatos.ts`, `metadatosNombre.ts` y `claveFlexible` no importan nada de red; `valoresDatos()` sale del índice en memoria (`main/biblioteca/servicio.ts:216`).

## Defectos

- **D1 · La sugerencia de unificar aparece cuando el foco ya salió del campo** (media; `app/src/renderer/src/vistas/anadir/CamposDatos.tsx:152-158`). Se calcula en el `blur`; con Tab, el foco ya está en «Cancelar» (Álbum) o «Intercambiar…» (Artista), contra la spec («sus botones son las dos paradas de tabulación siguientes al campo»). Visto en `anadir-1280x800-100-unificar.png`. Pregunta [0230](../../preguntas/0230-sugerencia-de-unificar-aparece-despues-de-salir-del-campo.md).
- **D2 · Un número inicial separado por espacio se descarta como pista** (media-baja; `app/src/shared/metadatosNombre.ts:27`). `3 Doors Down - Kryptonite.mp3` → artista «Doors Down»; `50 Cent - …` → «Cent»; `21 Guns.mp3` → «Guns», todos sin aviso de dato dudoso. Medido con la función. Pregunta [0231](../../preguntas/0231-numero-inicial-del-nombre-que-es-parte-del-artista.md).
- **D3 · «Como en tu biblioteca» no se aplica si solo difieren las mayúsculas** (baja; `app/src/main/fuente/propuestaDatos.ts:149`). Contradicción entre la regla 1 de la spec y «Unificar»/ADR 0016; el grupo no se parte. Pregunta [0232](../../preguntas/0232-grafia-de-la-biblioteca-cuando-solo-difieren-las-mayusculas.md).
- **D4 · ↑ con la lista abierta por escribir salta al penúltimo, no al último** (baja; `app/src/renderer/src/vistas/anadir/CampoCombo.tsx:99`). Con `activa = -1`, `(−1 − 1 + n) % n` da `n − 2`; solo `!mostrada` trata ↑ como «ir al último». Por lectura, no reproducido en la app.
- **D5 · «Intercambiar» borra la sugerencia de unificar del otro campo** (baja; `CamposDatos.tsx:257`, `setUnificar({})` borra también la del Álbum). Visto al ordenar las capturas del diálogo.
- **D6 · El álbum propuesto se compara solo por nombre, no por el par artista-álbum** (baja; `propuestaDatos.ts:179`). Un «Greatest Hits» de otro artista adopta la grafía de la biblioteca. Inofensivo (solo cambia la grafía de un grupo que ya agrupa por nombre, revisión de la 0220); se anota por si el ADR 0016 cambia.
- Observaciones sin gravedad: con la lista abierta tras escribir un valor completo, ésta tapa el botón «Intercambiar…» hasta pulsar Esc (de ahí el `Escape` de la spec de capturas); un `getByLabel('Artista')` con la lista abierta resuelve dos elementos (el campo y el `listbox` con el mismo `aria-label`): pruebas con `getByRole('combobox', …)` (regla en `pruebas.md`).

## Capturas

`docs/ux/revisiones/0.2.2-feature-6/` (1280 × 800, 100 %, semilla de temas con tres artistas y álbumes inventados; títulos «Marea baja» y «audio final2»; las abrí con Read):

- `anadir-1280x800-100-datos-con-procedencia.png` — título «De las etiquetas», artista «Del nombre del archivo», álbum «Como en tu biblioteca» (con «Querido...» propuesto como «Querido…»).
- `anadir-1280x800-100-dato-dudoso.png` — vídeo de «QuimeraVEVO»: artista con «⚠ Del nombre del canal: compruébalo».
- `anadir-1280x800-100-dato-dudoso-archivo.png` (extra) — título «audio final2» dudoso y «Sin artista es más difícil encontrar la letra.».
- `anadir-1280x800-100-autocompletado.png` — «que» con tres artistas y su número de canciones.
- `anadir-1280x800-100-unificar.png` — «¿Te refieres a «Querido…»…?» con los dos botones (y el foco en «Cancelar»: D1).
- `biblioteca-1280x800-100-editar-datos-autocompletado.png`, `-unificar.png` y `-intercambio.png` (extras, F6-N9).

El formulario no cabe en 800 px de alto (hay scroll): las capturas se toman con el formulario desplazado para que se vea el campo que enseñan. Generadas con `SHINOBI_CAPTURAS_022_6=1 npx playwright test e2e/capturas-022.spec.ts --workers=1 -g "feature 6"`.

## Protección de red de los E2E (prioridad de la sesión principal)

Regla y cómo se cumple: [pruebas.md](../../pruebas.md#regla-sin-red-real-en-las-pruebas-2026-11-22) (`globalSetup` con sumidero local y `SHINOBI_E2E=1`, opt-in de red que lo desactivan, vigilante `e2e/sin-red-real.spec.ts`). Comprobados los `electron.launch` de `e2e/`: todos heredan `process.env`.

**Constancia, con franqueza: antes de poner la protección, algunas de mis ejecuciones de hoy pudieron salir a lrclib.net.** Ejecuté tres tandas con la app compilada del árbol de trabajo (que ya llevaba parte de la 0308; **no puedo determinar si en ese build la búsqueda automática estaba conectada**, porque los directorios temporales se borran):

- `importar-archivo.spec.ts` (sin `SHINOBI_LRCLIB_URL`, salvo la prueba de privacidad, que lo fijaba a un doble y apagaba la búsqueda): archivos con títulos y artistas «Mi tema de prueba» (sin artista), «Tema Alfa» / «Grupo Uno», «Tema Beta» / «grupo uno» (álbumes «Querido…»/«Querido...») y «Tema completa» / «Grupo inventado» (con el doble; sin salida).
- `importar-youtube.spec.ts` (sin la variable): vídeos del doble de yt-dlp «Canción de prueba» / «Artista Ejemplo» y los títulos editados «Tema de YouTube», «Tema interrumpido», etc.
- `biblioteca*.spec.ts` no añaden canciones; los críticos y mis capturas fijaban `http://127.0.0.1:1`: sin salida.

Todos los títulos y artistas son inventados de los fixtures, nada de la biblioteca real. Pasada la protección repetí esas specs con ella activa.

## Guía manual

[`feature-6-datos-automaticos.md`](../../Test-manuales/0.2.2/feature-6-datos-automaticos.md): las «10 + 10» (con recuento de correcciones), «Como en tu biblioteca» y el tema heredado, título y artista al revés, autocompletado, unificar y Editar datos con teclado, sin conexión y lector de pantalla.

## Archivos tocados

`app/e2e/capturas-022.spec.ts` (suite de la feature 6), `app/e2e/preparar-electron.ts` (sumidero y `SHINOBI_E2E`), `app/e2e/sin-red-real.spec.ts` (nueva), `app/e2e/letras-red.spec.ts` y `app/e2e/youtube-red.spec.ts` (borran `SHINOBI_E2E`), `docs/pruebas.md`, guía e índice, este informe, preguntas 0230-0233 y la tarea 0305. Ningún código de producción.
