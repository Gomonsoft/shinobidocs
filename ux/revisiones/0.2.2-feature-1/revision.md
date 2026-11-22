# Revisión de capturas · 0.2.2 · Feature 1 (letra en pantalla)

- Revisor: diseñador UX. Fecha: 2026-11-22.
- Criterios: F1-R25 ([07](../../07-reproductor.md#022--feature-1--letra-en-pantalla-con-varios-enunciados)) y F1-E16 ([06](../../06-editor.md#022--feature-1--letra-en-pantalla)). Informe de QA: [informe-feature-1.md](../../../versiones/0.2.2/informe-feature-1.md).
- Capturas: 17 del reproductor y 16 del editor. Revisadas una a una las de 1920 × 1080, la de 4:3 y todas las del editor al 100 %. De las de 1280 × 720 y del editor al 125 % revisé `pausa-larga-indicadores`, `dos-renglones` (1280) y `pantalla-d2`, `pantalla-reducido`, `pantalla-300px` y `pantalla-ejemplo` (125 %). Las demás son variantes de tamaño de las ya revisadas.

**Veredicto: no aprobada** hasta corregir N1, que bloquea la entrega alpha.1. Todo lo demás es conforme o se corrige después.

## Reproductor (F1-R25)

| Captura | Resultado | Notas |
|---|---|---|
| `cinco-lineas` (1920, 1280) | Conforme | Una ya cantada en gris, activa con el centro al ≈ 39,3 %, +1 al 70 % y +2 y +3 más tenues. |
| `siete-lineas-dos-cantadas` (1920, 1280) | Conforme | Dos ya cantadas, cuatro futuras y ancla al ≈ 39,3 %. |
| `dos-lineas` (1920, 1280) | Conforme | Activa al 45 % y siguiente al 70 % de tamaño: el aspecto de 0.2.1. |
| `cambio-desplazamiento-mitad` (1920, 1280) | Conforme | Posiciones, tamaños y paso a gris interpolados. |
| `cambio-fundido-mitad` (1920, 1280) | Conforme | Las dos copias superpuestas a mitad del fundido son lo que pide la spec. Que se lea bien en movimiento va a la guía manual. |
| `pausa-larga-indicadores` (1920, 1280) | Conforme, con mejora **N3** | Barra, cuenta y puntos en sus sitios relativos al ancla, sin solaparse con ninguna línea. |
| `dos-renglones` (1920, 1280) | Conforme | La activa de dos renglones crece hacia los dos lados y no se mueve de su ancla. La +3 que no cabe no se dibuja: recorte correcto. |
| `letra-lista` (1920, 1280) | Conforme | Ningún píxel en el color de lo ya cantado (F1-R21). |
| `cuatro-tercios-siete-lineas` (1440 × 1080) | Conforme tras corregir la spec (**N4**) | La +1 sale en **3 renglones**, que la spec no preveía. |

## Editor (F1-E16)

| Captura | Resultado | Notas |
|---|---|---|
| `pantalla-d2` (100 %) | No conforme: **N1** | La sección es correcta (controles, opción no disponible). La vista previa no tiene la escala del reproductor: activa al ≈ 36 % en lugar del 39,3 %. |
| `pantalla-d2`, `pantalla-reducido`, `pantalla-300px`, `pantalla-ejemplo` (125 %) | No conforme: **N1** y **N2** | La vista previa solo muestra la activa en dos renglones (más una futura en `300px`); las demás futuras no aparecen. En `ejemplo`, la píldora «Ejemplo» tapa la letra. |
| `pantalla-d1` | Conforme | Resumen, procedencia «Del tema «Neón»», «Cambiar solo en esta canción» y «Ver un ejemplo». El punto de aviso de la pestaña Estilo es el aviso de daltonismo de Neón, que es correcto (ver feature 2). |
| `pantalla-d1-propia` | Conforme en el panel; vista previa con **N1** | Con 7 líneas y 2 ya cantadas, la vista previa muestra 3 futuras en lugar de 4. |
| `pantalla-no-disponible` | No concluyente: **N5** | La captura muestra el tooltip. No se ve el motivo en texto bajo el control, que es lo que pide la spec. |
| `pantalla-ejemplo` (100 %) | No conforme menor: **N2** | Ejemplo, botón «Detener el ejemplo» y resumen, correctos. La píldora va centrada arriba; la spec la quiere arriba a la izquierda. |
| `pantalla-reducido` (100 %) | No concluyente: **N5** | La nota `edi.pantalla.reducido` queda fuera de la vista: no se puede comprobar. |
| `previa-pausa-siete` | No conforme: **N1** y **N5** | La línea seleccionada es la primera, así que no se ven las 2 ya cantadas. Además solo hay 3 futuras de las 4 que corresponden. |
| `pantalla-300px` (100 %) | Conforme | Los seis segmentos caben en una fila. El marco amarillo es el foco del divisor, que es lo esperado. |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **N1** | F1-E11, F1-E15 y F1-R23 (vista previa = reproductor) | La vista previa aplica el mínimo de 32 px de `S` (sistema visual §10) sobre un lienzo de 225–316 px. Las líneas salen proporcionalmente más grandes, el ancla baja y el recorte del 86 % elimina futuras. Al 125 % solo se ve la activa. | El fotograma del reproductor reducido: `S` = 7,5 % del alto del lienzo, **sin** el mínimo de 32 px, y todo lo demás calculado sobre el lienzo. Con 5 líneas y 1 ya cantada deben verse la activa y 3 futuras (más la ya cantada si la hay) en las mismas posiciones relativas que en `reproductor-1920x1080-cinco-lineas`. **Fallo de la spec**, que era ambigua («aplicados escalados»): ya precisada en [06 · Feature 1, «Vista previa»](../../06-editor.md#022--feature-1--letra-en-pantalla) y en el [sistema visual](../../sistema-visual.md#022--feature-1--letra-en-pantalla). | **Bloquea alpha.1**: la vista previa es la herramienta para configurar la feature, y al 125 % (escala habitual en Windows) no sirve. |
| **N2** | Píldora «Ejemplo» (fase 5) | Centrada arriba; al 125 % tapa la línea activa. | Arriba a la izquierda, a 8 px de los bordes, nunca sobre la letra. | Se corrige después (con N1). |
| **N3** | F1-R19, puntos de espera | Los puntos quedan a ≈ 18 px de las mayúsculas de la +1 (unos 50 px entre centros a 1080p). Es lo que decía la spec («sobre la línea +1»), pero se ven pegados, como señaló QA. | El centro de los puntos a **mitad del hueco** entre la caja de la activa (o de la cuenta) y la de la +1: unos 8 px más arriba a 1080p. Spec precisada (sistema visual y 07, «Convivencia»). | Se corrige después (cosmético). |
| **N4** | F1-R17 y F1-R18 (renglones) | En 4:3, una línea larga que no cabe en 2 renglones al 75 % sale en 3. | La spec no lo cubría. **Acepto lo que hace el código** y lo escribo: 3 renglones equilibrados al 75 %, sin cortar texto ni reducir más. Sin cambio de código. | Ninguna. |
| **N5** | F1-E16 (capturas) | `pantalla-no-disponible` enseña el tooltip y no el motivo en texto; en `pantalla-reducido` la nota queda fuera de la vista; en `previa-pausa-siete` la línea seleccionada es la primera. | Repetir con la sección desplazada para que se vea el motivo `edi.pantalla.pasadas.minimo1` bajo el control (sin tooltip) y la nota `edi.pantalla.reducido`. En `previa-pausa-siete`, seleccionar la 4.ª línea para que se vean 2 ya cantadas y 4 futuras. | Se corrige después (QA, al repetir las capturas tras N1). |
