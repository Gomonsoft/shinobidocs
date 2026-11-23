# Revisión de capturas · 0.2.2 · Feature 7 (importación por lotes)

- Revisor: diseñador UX. Fecha: 2026-11-23.
- Criterios: F7-N16 y [03 · Feature 7](../../03-anadir-cancion.md#022--feature-7--importación-por-lotes), [04 · Feature 7](../../04-progreso-pipeline.md#022--feature-7--cola-de-preparación-de-un-lote) y [02 · Feature 7](../../02-biblioteca.md#022--feature-7--lotes-en-la-biblioteca). Hallazgos de QA: [0323](../../../preguntas/0323-hallazgos-visuales-de-las-capturas-de-las-features-7-8-y-9.md) (respondida).
- Revisadas **las 21 capturas**, una a una.

**Veredicto: no aprobada** hasta corregir L1 (columna «Duración»), que **bloquea alpha.3**. Lo demás se corrige después.

| Captura | Resultado | Notas |
|---|---|---|
| `origen-archivos`, `origen-enlaces` | Conforme | Textos nuevos, «Elegir carpeta…», «Importar paquete…» y campo de varios renglones. |
| `leyendo` | Conforme | Barra indeterminada con «Leyendo los archivos…» (0285). |
| `oferta-lista` | Conforme | «Este video está en una lista.» con [Añadir la lista entera], sin número. |
| `tabla-lista`, `tabla-lista-sin-completando` | No conforme: **L1**, **L3** | Son la misma imagen (no hay `add.lote.completando` porque la tabla ya no consulta video a video: conforme). Columna «Duración» cortada. Artista vacío en todas sin aviso. |
| `tabla-carpeta`, `tabla-duplicados`, `tabla-enlaces-sueltos`, `tabla-limite`, `anadir-1024x640-100-tabla` | No conforme: **L1** | Lo demás conforme: origen, avisos de ignorados, duplicados desmarcados con su línea, límite de 50 con su aviso, resumen con tiempo en enlaces sueltos, sin scroll horizontal a 1024 × 640. |
| `tabla-sin-espacio` | No conforme: **L1**, **L4** | Primario inactivo y aviso de espacio, conformes. «Caben unas 0» y duraciones de 24 h que desbordan la columna. |
| `descartar` | Conforme | Foco en «Seguir revisando». |
| `lote-anadido` | No conforme: **L2** | Las tarjetas nuevas y «Preparando 1 de 3», bien; el aviso `bib.import.anadidas` queda fuera de la vista. |
| `velo-arrastre` | Conforme, con **L5** | «Suelta para añadir 2 canciones». |
| `actividad-…-cola`, `-cola-en-pausa`, `-dialogo-cancelar`, `-cola-youtube-parada`, `-cola-con-errores`, `-resultado` | Conforme | Cabecera «{t} de {n} terminadas» y botón «Preparando {i} de {n}» (0285), pausa con su explicación, confirmación de cancelar, parada por YouTube con [Reintentar las descargas], grupo «Con error» con [Reintentar las fallidas] y resultado por canción. |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **L1** | F7-N13 y «Teclado y accesibilidad» (03) | La cabecera «Duración» se corta («Duracio») por la derecha y los tiempos quedan unos píxeles más arriba que los campos de su fila, en todas las tablas (1280 y 1024). | Columna de 56 px **más su relleno**, cabecera entera alineada a la derecha, cada duración en la línea base de su fila; «h:mm:ss» si pasa de una hora, sin desbordar. Spec 03 precisada. | **Bloquea alpha.3** (se ve en todas las tablas del flujo) |
| **L2** | 02 · Feature 7 (`bib.import.anadidas`) | El aviso queda fuera de la vista tras desplazarse a la primera tarjeta nueva. | **Fallo de spec**: pasa a **toast** `info` de 10 s con [Ver actividad]; ya escrito en 02. | Se corrige después |
| **L3** | 03 (0323 n.º 3) | Filas sin artista y ningún aviso. | Aviso único `add.lote.sinArtista` sobre la tabla («{k} canciones no tienen artista: con él es más fácil encontrar su letra.» con [Artista para todas…]). Falta de la spec, ya añadido. | Se corrige después |
| **L4** | `add.lote.sinEspacio` | «Caben unas 0». | Variante k = 0: «No hay espacio para ninguna. Libera espacio en el disco o desmarca canciones.» | Se corrige después |
| **L5** | 02 · Feature 7 | No hay velo al arrastrar un `.shinobi` suelto. | Velo con `paq.arrastrar.soltar` («Suelta para importar el paquete»). | Se corrige después |

## Segunda revisión (2026-11-23)

Revisadas las tablas regeneradas: `tabla-lista`, `-lista-sin-completando`, `-carpeta`, `-duplicados`, `-enlaces-sueltos`, `-limite`, `-sin-espacio` y `anadir-1024x640-100-tabla`.

| N.º | Resultado | Evidencia |
|---|---|---|
| **L1** | **Corregida** | «Duración» entera y alineada a la derecha en todas; cada duración en la línea de su fila; «24:00:00» cabe. |
| **L2** | Sin captura nueva | Pasa a toast (cambio de spec); se comprueba en la próxima tanda. |
| **L3** | **Corregida, con un cambio (L6)** | Aviso `add.lote.sinArtista` sobre la tabla. |
| **L4** | **Corregida** | «No hay espacio para ninguna.» |
| **L5** | Regla nueva | Sin captura posible. **No vale** tratar un tipo desconocido como paquete: el velo diría algo falso al arrastrar un audio. Si no se sabe qué se arrastra, texto neutro `bib.arrastrar.soltarNeutro` («Suelta para añadir»); la app decide al soltar. Spec 02 actualizada. |
| **L6 (nueva)** | No conforme | [Artista para todas…] sale dos veces (aviso y barra), y en `tabla-limite` el aviso dice «80 canciones» con 50 marcadas. **Decisión**: el aviso va sin botón y termina en «Puedes ponerlo con «Artista para todas…».»; `{k}` cuenta solo las filas marcadas sin artista. Spec 03 actualizada. Se corrige después. |

**Spec 04 · Feature 7**: texto nuevo `act.cola.motor.separaciones` para cuando el motor para solo las separaciones.

**Veredicto: aprobada con correcciones menores** (L2 por comprobar, L5 y L6; nada bloquea alpha.3).
