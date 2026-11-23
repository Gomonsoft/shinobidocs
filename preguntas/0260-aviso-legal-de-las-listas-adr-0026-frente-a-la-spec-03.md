# 0260 — Aviso legal de las listas de YouTube: el ADR 0026 y la spec 03 dicen cosas distintas (0.2.2, feature 7)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción del ADR 0026 aplicada en main; la interfaz del modo lote es de la 0315)

## Contexto

- ADR 0026 §3 y la fila 4 de la pregunta [0159](0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md): «la primera importación de una lista muestra otra vez el aviso legal… se registra aparte (`config.aviso_youtube_listas_aceptado`, fecha o `null`)».
- Spec [03 · Feature 7](../ux/03-anadir-cancion.md), tabla «Entrada del lote», fila «Aviso legal» (pregunta [0154](0154-decisiones-provisionales-de-ux-de-las-features-4-a-7.md), opción A): «El aviso ya aceptado vale para los lotes **(decisión provisional: no se pide aceptar de nuevo)**», con un recordatorio fijo en la tabla.
- El campo `aviso_youtube_listas_aceptado` ya existe en `config` (tarea 0339) y el comentario de `fuente.infoLista` en la API dice «exige el aviso legal de listas».

## Pregunta

¿Manda el ADR (aviso propio de las listas, una vez) o la spec (vale el aviso de YouTube ya aceptado)?

## Opción provisional tomada (si no bloquea)

La del ADR, como pidió la sesión principal. `ServicioYoutube.leerLista` (canal `fuente.infoLista`) responde `ARGUMENTOS_NO_VALIDOS` si `aviso_youtube_aceptado` o `aviso_youtube_listas_aceptado` son `null`, igual que `fuente.infoYoutube` con el primero. **Consecuencia para la 0315**: la interfaz debe mostrar el aviso de listas la primera vez y escribir `aviso_youtube_listas_aceptado` con `config.actualizar`; la spec 03 no lo describe (ni textos ni estado). Varios enlaces sueltos no lo exigen (usan `infoYoutube`).

Si se confirma la spec, el cambio en main es de una línea (quitar la segunda comprobación en `leerLista`, `main/fuente/youtube.ts`) y el test «sin el aviso de listas no se consulta» de `lote.integracion.test.ts`.

## Respuesta

Arquitecto, 2026-11-22. **Manda el ADR, que es la opción más prudente:** las listas tienen un **aviso propio, que se acepta una vez**. Una lista multiplica lo que se descarga y la exposición descrita en ADR 0003; que el usuario lo acepte de forma explícita la primera vez cuesta un clic y deja constancia aparte (`aviso_youtube_listas_aceptado`). Lo aplicado en main vale tal cual. Sigue siendo **provisional para el usuario** en [0159](0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md), fila 4, donde lo anoto.

**Cambio de spec para el diseñador** (03 · Feature 7):
- Fila «Aviso legal» de la tabla «Entrada del lote»: sustituir «El aviso ya aceptado vale para los lotes (decisión provisional: no se pide aceptar de nuevo)» por esto: «La **primera** lista o álbum de YouTube muestra el aviso legal con su punto sobre listas y pide aceptarlo (se guarda aparte). Después no se vuelve a pedir. Si el aviso de YouTube tampoco se había aceptado, un solo diálogo acepta los dos».
- F7-N5: «Pegar una lista por primera vez muestra el aviso (con su punto sobre listas) aunque el de YouTube ya estuviera aceptado; aceptado una vez, no se vuelve a pedir, y la tabla muestra `add.lote.legal` con "Leer el aviso"».
- Varios enlaces sueltos no lo piden; usan el aviso de siempre.

La interfaz lo implementa en la [0315](../tareas/0315-modo-lote-en-anadir-cancion.md) (criterio añadido).
