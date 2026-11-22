# Revisión de capturas · 0.2.2 · Feature 4 (comprobar la letra con la voz)

- Revisor: diseñador UX. Fecha: 2026-11-22.
- Criterios: F4-L12 ([05](../../05-letra.md#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase)) y F4-E11 ([06](../../06-editor.md#022--feature-4--comprobar-la-letra-con-la-voz-y-corregir-el-desfase)). Informe de QA: [informe-feature-4.md](../../../versiones/0.2.2/informe-feature-4.md).
- Las 13 capturas revisadas una a una. Falta `comprobacion-pendiente` (solo manual, según QA).

**Veredicto: no aprobada** hasta corregir C1 (banner del editor), que bloquea alpha.1. Lo demás se corrige después.

## Vista Letra (F4-L12)

| Captura | Resultado | Notas |
|---|---|---|
| `candidatos-comprobados` | No concluyente: **C5** | Es **idéntica** a `candidato-desfasado`. No enseña la lista recién cargada y ordenada por veredicto: el candidato `no_coincide` sale primero porque los encajes llegaron después y la lista, correctamente, no se reordena. |
| `candidato-desfasado` | Conforme, con **C2** | Línea `let.comp.adelantada`, sin línea de duración (veredicto concluyente) y vista previa con `let.comp.desfase.ayuda` y tiempos corregidos. El icono ⟷ queda en un renglón aparte, encima del texto. |
| `candidato-no-coincide` | Conforme, con **C2** y **C5** | Motivos con sus tramos en m:ss y `let.comp.noCoincide.ayuda`; aquí no hay frase repetida. Es idéntica a `aviso-llegada`. |
| `aviso-llegada` | Conforme | `let.comp.llegada` con [Seleccionarla] y [×]. |
| `actual-corregida` | Conforme, con **C3** | Texto `let.comp.actual.corregida` y [Quitar la corrección]. Falta el icono ⓘ. |
| `actual-propuesta` | Conforme, con **C3** | `let.comp.actual.adelantada` con [Corregir el desfase]. Falta el icono ⟷. |
| `actual-no-coincide` | Conforme, con **C3** | Texto, [Ver por qué] y [Buscar otra letra]. Faltan el icono ⚠ y el color `aviso`. |

## Editor (F4-E11)

| Captura | Resultado | Notas |
|---|---|---|
| `funciones-comprobar` | Conforme | Sección, ayuda y botón con su icono, en su sitio. |
| `funciones-comprobar-no-disponible` | Conforme | Botón inactivo con su motivo en texto debajo. |
| `dialogo-desfase` | Conforme | Título, explicación con el número de líneas, «⌘Z», Cancelar y «Corregir el desfase». |
| `dialogo-no-encaja` | **No conforme: C4** (pregunta [0209](../../../preguntas/0209-texto-repetido-en-el-dialogo-la-letra-no-encaja-con-la-voz.md)) | Frase repetida sobre el desfase variable, «1 de 6 líneas **caen**» y motivos sin viñetas. Tramos con [Ir], correctos. |
| `banner-desfase` | **No conforme: C1** | El banner en la lista de 300 px parte el texto en 5 renglones; el botón «Corregir el desfase» queda cortado por el borde derecho y [Ahora no] no se ve. |
| `desfase-corregido` | Conforme, con **C2** | Toast «Letra movida 0,8 s más tarde.» con [Deshacer], tiempos mostrados movidos y línea «Desfase corregido…» con [Quitar la corrección]. El icono ⓘ queda en un renglón aparte. |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **C1** | F4-E7 y F4-E10 (banner en la lista) | Texto en 5 renglones estrechos, botón cortado por el borde de la lista y [Ahora no] invisible. | El banner a todo el ancho de la lista: icono + texto en una columna y, **debajo**, los dos botones ([Corregir el desfase] secundario y [Ahora no] fantasma) en una fila, o en dos si no caben; nada cortado ni fuera de la lista a 256 px de ancho. Es la misma disposición que los demás banners de la lista (`edi.banner.yasync`). | **Bloquea alpha.1**: está en el recorrido principal (borrador con letra desfasada), se ve roto y no deja cerrar el aviso. |
| **C2** | Sistema visual §5 y wireframes de 05/06 (icono + texto en una línea) | Los iconos ⟷, ⚠ y ⓘ de la línea de comprobación del candidato, del título del bloque de vista previa y de la línea «Desfase corregido» quedan **solos en un renglón**, encima del texto. | El icono de 16 px a la izquierda del texto, en la misma línea (`inline-flex` con el texto alineado arriba si este se parte). | Se corrige después. |
| **C3** | F4-L1 y F4-L10; «ningún veredicto sin icono» (05, «Teclado y accesibilidad») | Las líneas de C («Letra ya elegida») van sin icono, y la de `no_coincide` sin el color `aviso`. | Como en el wireframe C de 05: «✓ Coincide…», «ⓘ Movimos toda la letra…», «⟷ Toda la letra va…», «⚠ La letra no coincide…» (en `aviso`) y «🕒 La comprobaremos…», cada una con su icono. | Se corrige después. |
| **C4** | Diálogo «La letra no encaja con la voz» (0209) | «El desfase cambia…: no se arregla moviendo toda la letra.» seguido de «No se puede arreglar moviendo toda la letra.»; además «1 de 6 líneas caen». | Motivos con viñetas. Sin el pie cuando está el motivo de desfase variable. Singular «1 de 6 líneas cae donde no hay voz». Spec actualizada (06 · Feature 4, bajo el diálogo). | Se corrige después. |
| **C5** | F4-L12 (capturas) | `candidatos-comprobados` repite `candidato-desfasado`, y `candidato-no-coincide` repite `aviso-llegada`. | `candidatos-comprobados`: la lista **recargada** con los encajes ya hechos, ordenada (coincide y desfasada primero; no coincide al final) y con un candidato de cada veredicto a la vista. `candidato-no-coincide`: sin el aviso de llegada, con el candidato `no_coincide` seleccionado. | Se corrige después (QA). |
