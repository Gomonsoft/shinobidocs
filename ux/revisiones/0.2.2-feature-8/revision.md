# Revisión de capturas · 0.2.2 · Feature 8 (acciones por lotes y lote de exportación)

- Revisor: diseñador UX. Fecha: 2026-11-23.
- Criterios: F8-B (02 · Feature 8) y F8-V10 ([10 · Feature 8](../../10-exportacion.md#022--feature-8--exportar-varias-canciones)), con las respuestas a 0285, 0292, 0300 y 0316. Hallazgos de QA: 0323.
- Revisadas **las 17 capturas**, una a una.

**Veredicto: no aprobada** hasta corregir E1 (aviso que tapa el formulario), que **bloquea alpha.3**.

| Captura | Resultado | Notas |
|---|---|---|
| `barra-acciones`, `menu-mas-acciones` | Conforme | Recuentos «(2 de 5)», «Aplicar tema…» primario, «Eliminar…» al final en `error`. |
| `dialogo-preparar`, `acciones-omitida-sin-fuente` | Conforme, con **E4** | Notas por canción, privacidad, aviso de letras sin marca y `SIN_FUENTE` con su texto nuevo. «Ya tiene esos datos» para una canción sin nada que preparar es el texto de «Editar datos…». |
| `dialogo-editar-datos` | Conforme | Casillas por campo, «(varios)», resumen. |
| `dialogo-eliminar`, `dialogo-eliminar-diez` | Conforme | Aviso de listas, casilla de confirmación con 10. |
| `resultado-eliminar-parcial` | Conforme | ✓ / ✕ con [Copiar detalles] y [Reintentar las que faltan]. |
| `lote-formulario` | **No conforme: E1, E2** | El aviso azul tapa la ayuda del formato («…Si tu» cortado), sin indicio de scroll. «1 de estas canciones ya tienen…». |
| `lote-formulario-omitir`, `-sustituir` | No conforme: **E2** | El botón dice «Exportar 2 videos» con «Omitir» (0301 resuelta, conforme). Textos en plural con k = 1. |
| `lote-ver-cuales` | Conforme | Con «→ {nombre}» y la nota por fila. |
| `lote-exportando`, `lote-cancelar` | Conforme | Progreso, filas con [✕], confirmación en línea. |
| `lote-resultado-parcial` | Conforme | Resumen, filas y [Mostrar la carpeta] primario. |
| `lote-detenido`, `lote-resultado-cambiar-opciones` | No conforme: **E3** | Son la misma pantalla; se acepta (0323 n.º 5). [Cambiar opciones] conforme. Texto «carpeta.. Puede». |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **E1** | 10 · Feature 8, «Notas» (precisada) | Las notas se pintan encima del cuerpo del formulario y tapan texto; no se nota que hay scroll. | Notas **dentro** del cuerpo con scroll, debajo de la estimación; solo el pie es fijo. | **Bloquea alpha.3** (oculta información del formulario) |
| **E2** | `exp.lote.aviso.existe` (0316) | «1 de estas canciones ya tienen…», «1 canciones no se exportarán…», «1 videos … se sustituirán». | Variantes singulares de la spec 10. | Se corrige después |
| **E3** | `exp.lote.detenido` (precisada) | «El lote se detuvo: No se puede guardar en esa carpeta.. Puede que…» | «El lote se detuvo: no se puede guardar en esa carpeta. Puede que…» (minúscula tras los dos puntos y un solo punto). | Se corrige después |
| **E4** | `bib.acc.preparar.nota.nada` | «Ya tiene esos datos» en «Preparar». | «No hay nada que preparar en ella». | Se corrige después |
