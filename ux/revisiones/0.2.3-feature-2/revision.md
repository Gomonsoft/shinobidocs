# Revisión de diseño · 0.2.3 · Feature 2 — Voz en los coros (editor)

Fecha: 2026-11-23. Revisa el Diseñador UX. Capturas: `editor-1280x720-100-coros-nivel.png` y `editor-1280x720-100-coros-sin-voz.png`. Falta `coros-preparando`.

Referencia: [06 · 0.2.3 · Feature 2](../../06-editor.md#023--feature-2--voz-en-los-coros) y [sistema visual · 0.2.3](../../sistema-visual.md#023--varios-cantantes-y-coros). Gravedad: **bloquea** (antes de cerrar la alpha) o **menor**.

## Veredicto por criterio

| Criterio | Veredicto | Notas |
|---|---|---|
| C2-E1 | Parcial | En una canción con coros aparece el título «Voz en los coros» al final de «Cantantes y coros». No se ve el deslizador ni el 50 %, porque la sección queda cortada por debajo del borde del panel. |
| C2-E2 – C2-E4 | Tests | |
| C2-E5 | No verificable | En `coros-sin-voz` no se ve «Escuchar un coro» inactivo ni `edi.coros.sinVoz`: la sección queda fuera de la vista. Sí se ve el resto del estado: «Voz» e «Instrumental» inactivos y «Ajustar los silencios…» con su explicación. |
| C2-E6 | Tests; captura pendiente | Sin `coros-preparando` no se puede revisar cómo se presenta `edi.coros.preparando`. |
| C2-E7 | Tests | |
| C2-E8 | No cumple | Falta una captura y las otras dos no muestran la sección. |

## Correcciones

1. **Bloquea** (la revisión visual de la feature 2). Repetir `coros-nivel` y `coros-sin-voz` con la sección «Voz en los coros» **entera** a la vista: deslizador, valor «50 %», ayuda, límite y «Escuchar un coro» (inactivo en `coros-sin-voz`, con su tooltip). Se puede desplazar el panel o bajar el divisor de la línea de tiempo. Así queda en C2-E8.
2. **Bloquea** (la revisión visual de la feature 2). Añadir `coros-preparando`:
   - Se fuerza con una mezcla de prueba que tarda más de 500 ms y con «Escuchar: Instrumental» elegido.
   - Debe verse `edi.coros.preparando` junto al selector «Escuchar», en `t-pequeno` `texto-3`, sin spinner.
   - Así queda en C2-E8.
3. **Menor.** Compartida con la feature 1 ([corrección 4](../0.2.3-feature-1/revision.md#correcciones)): en `coros-sin-voz`, el aviso de la onda («Disponible…») asoma debajo de la primera región del carril del Cantante 1. Con carriles, ese mensaje pasa a la celda sobre las etiquetas.

## Segunda vuelta (2026-11-23): veredicto final

**Aprobada.**

| Criterio | Veredicto final |
|---|---|
| C2-E1 | Aprobado. `coros-nivel` muestra «Voz en los coros» con el deslizador a 50 %, «Escuchar un coro», la ayuda y el límite. |
| C2-E5 | Aprobado. En `coros-sin-voz` el botón está inactivo y el deslizador sigue editable; el texto `edi.coros.sinVoz` es un tooltip y lo comprueba el test. |
| C2-E6 | Aprobado. `coros-preparando` muestra «Preparando los coros…» junto a «Escuchar» con «Instrumental» elegido, en `texto-3` y sin spinner. |
| C2-E8 | Aprobado. Están las tres capturas con la sección entera. |
| C2-E2 – C2-E4, C2-E7 | Cubiertos por los tests. |

Las tres correcciones de la primera vuelta están aplicadas; en la 3, el aviso de la onda es ahora un icono sobre las etiquetas.

## Observación sin cambio

En una canción de un solo cantante con coros, «Cantantes y coros» muestra «Repartir entre varios cantantes» y, debajo, «Voz en los coros», como pide la spec. No hace falta una fila de recuento del Coro.
