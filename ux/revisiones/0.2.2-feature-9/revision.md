# Revisión de capturas · 0.2.2 · Feature 9 (copia, paquete y letra)

- Revisor: diseñador UX. Fecha: 2026-11-23.
- Criterios: F9-16 y F9-A7 ([02](../../02-biblioteca.md#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra), [08](../../08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad), [06](../../06-editor.md#022--feature-9--exportar-la-letra-desde-el-editor)), con 0259, 0292 y 0316. Hallazgos de QA: 0323.
- Revisadas **las 18 capturas**, una a una.

**Veredicto: no aprobada** hasta corregir K1 (casilla de ajustes tapada al restaurar), que **bloquea alpha.3**.

| Captura | Resultado | Notas |
|---|---|---|
| `exportar-paquete`, `exportar-paquete-ligero` | Conforme | Dos opciones con tamaño, aviso de derechos y su variante ligera. |
| `creando-paquete` | Conforme | |
| `paquete-creado` | No conforme: **K3** | «1 / MB» partido y la ruta en tres renglones. |
| `actividad-paquete` | Conforme | Fila `act.paq` con [Ir] y [✕] (antes bloqueante, 0292: cerrada). |
| `importar-revisar`, `importar-resultado` | Conforme | Resultado con sus claves (0259). |
| `importar-conflictos` | No conforme: **K4** | Sin la etiqueta visible «Para las que ya tienes:». |
| `importadas-resaltadas` | **No concluyente: K5** | No se ve el resalte ni se sabe cuáles se importaron. El resalte sí se ve en `tarjeta-sin-audio` (borde `info`). |
| `paquete-version-nueva`, `vacio-con-enlace`, `tarjeta-sin-audio` | Conforme | |
| `copia-nunca`, `copia-ultima-recordatorio` | No conforme: **K6** | El ⓘ queda solo en un renglón encima del texto. |
| `copia-dialogo` | Conforme | |
| `copia-creando` | No conforme: **K2** | «el paquete se sigue creando» y toast «Paquete cancelado» en una copia. |
| `restaurar-revisar` | **No conforme: K1** | La lista corta la quinta fila (conforme: scroll propio) y la casilla «Restaurar también mis ajustes» queda tapada por el pie, sin indicio de scroll. |
| `editor-…-exportar-letra` | Conforme | Sección tras «Exportar video». |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **K1** | 08 · Feature 9 (fila nueva «Diálogo de restaurar: espacio») | El pie tapa la casilla de ajustes. | Cuerpo con scroll propio y solo el pie fijo; la casilla se alcanza desplazando y nunca queda debajo del pie. | **Bloquea alpha.3** (no se puede ver ni cambiar si se restauran los ajustes) |
| **K2** | 08 (`aj.copia.segundoPlano`, `aj.copia.toast.cancelada`) | Textos de paquete en la copia. | «Puedes cerrar este cuadro: la copia se sigue creando.» y «Copia cancelada. No se ha guardado nada.» | Se corrige después |
| **K3** | 02, «Fin» de «Creando el paquete» (precisada) | Tamaño partido y ruta en tres renglones. | Nombre y tamaño en un renglón (espacio no separable entre cifra y unidad); carpeta en una línea con recorte por el centro y la ruta completa en `title`. | Se corrige después |
| **K4** | 02, «Para las que ya tienes» (precisada) | Control sin etiqueta. | «Para las que ya tienes:» visible a la izquierda del control. | Se corrige después |
| **K5** | 02 (0292 n.º 3), captura | No se ve resalte en la captura. | Repetir la captura dentro de los 2 s, con las importadas visibles y con borde `info`. | Se corrige después (QA) |
| **K6** | Sistema visual (patrón C2 de la feature 4) | ⓘ en un renglón aparte. | Icono a la izquierda del texto, en la misma línea. | Se corrige después |

## Segunda revisión (2026-11-23)

Revisadas `restaurar-revisar`, `restaurar-revisar-inicio`, `paquete-creado`, `importar-conflictos`, `copia-creando`, `copia-cancelada`, `copia-nunca`, `copia-ultima-recordatorio` e `importadas-resaltadas`.

| N.º | Resultado | Evidencia |
|---|---|---|
| **K1** | **Corregida** | `-inicio`: cuerpo con difuminado inferior que indica que sigue. `restaurar-revisar`: desplazado, la casilla «Restaurar también mis ajustes» se ve entera sobre el pie, con barra de scroll. El tooltip del botón inactivo es de *hover*: conforme. |
| **K2** | **Corregida en el texto; por confirmar el toast** | «la copia se sigue creando» y el toast «Copia cancelada…». Pero en las dos capturas aparece además «Paquete cancelado. No se ha guardado nada.»: si es un resto de un paso anterior de la captura, conforme (QA: cerrar los toasts entre capturas); **si cancelar una copia emite los dos toasts, es un defecto**: solo debe salir «Copia cancelada». Se corrige después. |
| **K3** | **Corregida** | Tamaño sin partir y ruta recortada por el centro. Que un nombre muy largo ocupe dos renglones **vale**: el nombre no se recorta (es lo que el usuario buscará en la carpeta); lo que no se debe partir es «1 MB». |
| **K4** | **Corregida** | «Para las que ya tienes:» visible. |
| **K5** | **Corregida** | Las dos importadas con borde `info`. |
| **K6** | **Corregida** | ⓘ en la misma línea en `copia-nunca` y `copia-ultima-recordatorio`. |

**Veredicto: aprobada con correcciones menores** (solo la confirmación del doble toast de K2; nada bloquea alpha.3).
