# Revisión de capturas · 0.2.2 · Feature 2 (subrayado y aviso de daltonismo)

- Revisor: diseñador UX. Fecha: 2026-11-22.
- Criterios: F2-R9 ([07](../../07-reproductor.md#022--feature-2--resaltado-que-no-depende-solo-del-color)), F2-E11 ([06](../../06-editor.md#022--feature-2--resaltado-que-no-depende-solo-del-color)) y F2-A4 ([08](../../08-ajustes-y-acerca.md#022--feature-2--subrayar-siempre-lo-ya-cantado)). Informe de QA: [informe-feature-2.md](../../../versiones/0.2.2/informe-feature-2.md).
- Las 10 capturas revisadas una a una.

**Veredicto: aprobada con correcciones menores.** D1 debe corregirse antes de publicar, pero no bloquea alpha.1: el subrayado viene apagado por defecto y el defecto solo aparece con él activo.

| Captura | Resultado | Notas |
|---|---|---|
| `reproductor-…-subrayado-mitad` | Conforme | El subrayado mide lo mismo que la parte pintada, es continuo (barrido progresivo, espacios incluidos) y no se corta en los descendentes. |
| `reproductor-…-subrayado-dos-renglones` | **No conforme: D1** | En la activa, conforme (F2-R2: primer renglón entero y el segundo empezando). La ya cantada muestra una línea oscura bajo cada renglón. |
| `reproductor-…-subrayado-barra-espera` | Conforme | Pista en el color de la letra al 35 % y relleno en el de lo ya cantado (F2-R7). |
| `reproductor-…-subrayado-rojo-verde` | Conforme | Con el par rojo/verde, el avance se lee por la forma. |
| `editor-…-subrayado-casilla` | Conforme | La casilla, desmarcada, bajo «Color de lo ya cantado», con su ayuda. |
| `editor-…-subrayado-previa` | Conforme | En pausa, el subrayado va bajo la mitad resaltada. |
| `editor-…-aviso-daltonismo` | Conforme | `edi.contraste.daltonismo` como ⚠ con sus dos acciones. Los otros dos avisos (letra y resaltado frente al fondo) son correctos con esos colores, como anota QA. |
| `editor-…-subrayado-nota-ajustes` | Conforme | Nota `edi.subrayado.global`, y la vista previa subraya aunque la casilla esté desmarcada (F2-E4). |
| `editor-…-subrayado-letra-lista` | Conforme en lo visible; **no concluyente** para F2-E9 (**D2**) | La nota «Solo afecta al editor…» bajo la casilla es correcta. El aviso de daltonismo como ⓘ no aparece en la captura (queda más abajo). El punto de la pestaña Estilo se explica por el aviso de letra frente al fondo, no por el de daltonismo. |
| `ajustes-…-reproductor-subrayado` | Conforme (F2-A4) | Casilla marcada con su ayuda en la sección Reproductor. |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **D1** | F2-R5 (pregunta [0205](../../../preguntas/0205-subrayado-de-lo-ya-cantado-deja-una-linea-oscura-bajo-la-ya-cantada.md)) | Línea fina y oscura bajo cada renglón de la línea ya cantada con el subrayado activo: la sombra de una decoración transparente. | **Confirmo que es un defecto.** Fuera de la activa (ya cantadas y futuras) no hay ningún trazo bajo el texto, ni subrayado ni sombra. En la activa, el subrayado lleva la sombra de §10. Durante la salida se funde con opacidad `1 − avance` y desaparece del todo al llegar al puesto −1. Lo más seguro es no dibujar la decoración fuera de la activa. | Se corrige después, con prioridad alta y antes de publicar 0.2.2. No bloquea alpha.1: el subrayado viene apagado por defecto. |
| **D2** | F2-E9 (captura) | El aviso ⓘ de daltonismo en Letra lista no se ve. | Repetir `subrayado-letra-lista` con el bloque de avisos a la vista: el aviso de daltonismo como ⓘ con `edi.contraste.soloEditor` (para que no lo tape el de letra frente al fondo, conviene una letra clara sobre el fondo de la semilla con resaltado rojo/verde, o el par `#FFFFFF` / `#F2F3F7`). | Se corrige después (QA). |

## Segunda revisión (2026-11-22)

Revisadas **las 10 capturas**, una a una.

| N.º | Resultado | Evidencia |
|---|---|---|
| **D1** | **Corregida** | `reproductor-1920x1080-subrayado-dos-renglones`: la línea ya cantada no tiene ningún trazo bajo el texto. La activa conserva su subrayado con sombra (primer renglón entero y el segundo empezando). En `subrayado-mitad` y `subrayado-rojo-verde`, la ya cantada también está limpia. |
| **D2** | **Corregida** | `editor-…-subrayado-letra-lista`: el aviso de daltonismo sale como ⓘ, con «Solo afecta al editor: esta canción se reproduce sin barrido.» y sus dos acciones. La vista previa enseña el barrido, como pide la spec del editor. |

Resto: conformes (`subrayado-mitad`, `subrayado-barra-espera`, `subrayado-rojo-verde`, `subrayado-casilla`, `subrayado-previa`, `subrayado-nota-ajustes`, `aviso-daltonismo` y `ajustes-…-reproductor-subrayado`). Sin no conformidades nuevas.

**Veredicto: aprobada.**

Relacionado: el espacio entre palabras sin subrayar con tiempos por palabra queda aceptado ([0215](../../../preguntas/0215-espacio-entre-palabras-en-el-subrayado.md)); el aviso con el tema «Neón» es correcto (sistema visual · Feature 2).
