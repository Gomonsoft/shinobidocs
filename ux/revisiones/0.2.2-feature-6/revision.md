# Revisión de capturas · 0.2.2 · Feature 6 (datos de la canción automáticos)

- Revisor: diseñador UX. Fecha: 2026-11-22.
- Criterios: F6-N11 y [03 · Feature 6](../../03-anadir-cancion.md#022--feature-6--datos-de-la-canción-automáticos), con las respuestas a 0230, 0231 y 0232 del mismo día. Informe de QA: [informe-feature-6.md](../../../versiones/0.2.2/informe-feature-6.md).
- Revisadas **las 8 capturas**, una a una. `editar-datos-lrclib` falta por diseño (llega con la feature 5) y no cuenta.

**Veredicto: aprobada con correcciones menores.** Nada bloquea alpha.2: los defectos (D1, D2, D4, D5, V1) se corrigen después, con D1 y D2 en primer lugar.

| Captura | Resultado | Notas |
|---|---|---|
| `anadir-…-datos-con-procedencia` | Conforme | Tres líneas de procedencia (etiquetas, nombre del archivo, «Como en tu biblioteca»). El botón «Intercambiar» va en su propia fila bajo la procedencia del Artista y no a su derecha, como en el wireframe: es aceptable (el wireframe era estrecho). |
| `anadir-…-dato-dudoso` | Conforme | «Quimera» limpio de «VEVO», con ⚠ «Del nombre del canal: compruébalo» (icono y texto). |
| `anadir-…-dato-dudoso-archivo` | Conforme | Título «audio final2» dudoso y `add.dato.sinArtista` con ⓘ. Sin «Intercambiar», porque el Artista está vacío. |
| `anadir-…-autocompletado` | Conforme | Opciones con su recuento, ordenadas por número de canciones; la línea de procedencia del Artista desaparece al escribir. |
| `anadir-…-unificar` | **No conforme: D1** | Texto y botones correctos, pero el foco ya está en «Cancelar» cuando aparece la sugerencia (0230). |
| `biblioteca-…-editar-datos-autocompletado` | Conforme | El mismo autocompletado en «Editar datos» (F6-N9). |
| `biblioteca-…-editar-datos-unificar` | **No conforme: D1, V1** | El foco ya está en «Cancelar» (D1). Además, la sugerencia sale **entre** el campo Álbum y su ayuda («Opcional, ayuda…»), que queda separada de su campo. |
| `biblioteca-…-editar-datos-intercambio` | Conforme | Valores intercambiados y el texto «Título y artista intercambiados.» (`add.dato.intercambiado`) a la vista. Que el anuncio se vea también en pantalla es aceptable. |

## No conformidades y defectos

| N.º | Criterio | Resultado esperado | Gravedad |
|---|---|---|---|
| **D1** (0230) | «Unificar», teclado | La sugerencia se calcula **400 ms después de la última tecla, al elegir de la lista o al cerrarla, con el foco aún en el campo**; nunca en el `blur`. El Tab siguiente lleva a [Usar «…»]. La región `role="status"` existe vacía desde el principio. Se repiten las dos capturas de unificar con el foco en el campo y la sugerencia a la vista. | Después (prioridad alta) |
| **D2** (0231) | Patrones de nombre | Un número inicial solo se descarta si va seguido de puntuación («03 -», «3.», «3)», «03_») o tiene cero a la izquierda. «3 Doors Down», «50 Cent» y «21 Guns» se conservan. Si se descarta un número separado solo por espacio («03 Artista - …»), el campo siguiente es dudoso (criterio F6-N12). | Después (prioridad alta) |
| **D3** (0232) | Regla 1 | Una propuesta que solo difiere en mayúsculas de un valor de la biblioteca toma la grafía de la biblioteca con `add.dato.origen.biblioteca`. Lo escrito a mano no cambia. | Después |
| **V1** | Orden bajo el campo (spec actualizada: «encima de su línea de ayuda») | Hoy, en «Editar datos», la sugerencia queda entre el campo y su ayuda, pero sin separación y con la ayuda pegada a los botones, como si fuera parte de la sugerencia. Debe verse: campo → sugerencia (texto y, debajo, [Usar «…»] [Dejarlo así]) → 8 px → línea de ayuda. Igual en «Añadir canción», donde hoy la ayuda del Álbum desaparece mientras sale la sugerencia: debe seguir visible debajo. | Después |
| **D4** | Teclado del *combobox* | Con la lista abierta por escribir y ninguna opción activa, ↑ activa **la última** (hoy la penúltima). | Después |
| **D5** | «Intercambiar» | Solo recalcula la sugerencia de unificar del Artista; la del Álbum se conserva. | Después |

**Lista abierta que tapa «Intercambiar…» (observación de QA)**: conforme. Es lo esperado de una lista flotante; se cierra con Esc, Tab, Intro, al elegir y al hacer clic fuera. La spec añade que se cierre sola cuando lo escrito coincide exactamente con la única opción, para que no se quede abierta sin aportar nada (después, sin prioridad).

## Segunda revisión (2026-11-22)

Revisadas las dos capturas repetidas: `anadir-1280x800-100-unificar.png` y `biblioteca-1280x800-100-editar-datos-unificar.png`.

| N.º | Resultado | Evidencia |
|---|---|---|
| **D1** | **Corregida** | En las dos, el foco sigue en el campo Álbum y la sugerencia ya está a la vista con [Usar «Querido…»] y [Dejarlo así]. |
| **V1** | **Corregida en «Editar datos»; pendiente menor en «Añadir canción»** | En «Editar datos»: campo → sugerencia → botones → separación → «Opcional, ayuda a encontrar la letra exacta». En «Añadir canción» la ayuda del Álbum sigue sin aparecer mientras está la sugerencia (tras los botones viene directamente el aviso de LRCLIB); debe verse «Opcional, ayuda a encontrar la letra exacta» debajo de los botones, 8 px más abajo, como en «Editar datos». |

D2–D5 no se ven en capturas: se cierran con sus pruebas (F6-N12 y F6-N3).

**Veredicto: aprobada con correcciones menores** (V1 en «Añadir canción»; no bloquea alpha.2).
