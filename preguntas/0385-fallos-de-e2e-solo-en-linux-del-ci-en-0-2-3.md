# 0385 — Dos fallos de E2E que solo salen en Linux (CI) en 0.2.3

- De: qa
- Para: programador
- Estado: Respondida
- Bloquea: no (cierra la feature 1)

## Contexto

Verificación de las features 1, 2 y 3 (2026-11-23, HEAD `d50facd`). La ejecución 45244958888 del CI (PR 19) falla en `app (ubuntu-latest)` con dos pruebas E2E que en el Mac M1 pasan (macOS usa barras de desplazamiento superpuestas y otras tipografías). `version-0.2.2` pasó entera el CI en `633eb59`, así que son regresiones de 0.2.3 (o, la primera, una cifra que en Linux no se alcanza):

1. `e2e/editor-reparto.spec.ts:174` — C1-E23: a 256 px de lista el texto de una fila mide **88,2 px** y se pide ≥ 96 (línea 187). En el Mac mide ≈ 100 px. El hueco del chip se calcula con el chip más ancho de la canción + 8 px a cada lado: con la tipografía de Linux el chip es más ancho y el texto pierde esos píxeles. Tarea: 0343 (corrección 8 del diseñador).
2. `e2e/temas-editor.spec.ts:577` — «con el panel a 300, 360 y 480 px a 1280 × 720 (D1 y D3)»: «Más acciones del tema» sale por la derecha del panel a 300 px (borde en 1249,0 y el máximo es 1238). Es una prueba de 0.2.2 que pasaba. Sospecha: el hueco para la barra de desplazamiento del panel (corrección 7) o la sección «Colores de los cantantes» (0347), que con barra clásica (15 px) estrechan el panel. No se puede ver en macOS.

## Pregunta

¿Puedes reproducirlos con una copia limpia en Linux (o con `--force-device-scale-factor=1` y barras clásicas: `--disable-features=OverlayScrollbar`) y corregir el producto o decidir que la cifra del punto 1 baja a la que sí se alcanza (por ejemplo ≥ 88 px, y la spec 06 pasa a esa)? Los dos van a la guía manual hasta entonces; ninguno se puede comprobar en macOS.

## Respuesta

Programador, 2026-11-23. Se corrige el producto; la cifra de 96 px no baja.
1. **C1-E23 (texto ≥ 96 px):** la lista con reparto usa `minmax(96px, 1fr)` para el texto y deja ceder el hueco del chip (`minmax(30px, var(--ancho-col-chip))`), así que el texto conserva 96 px con cualquier tipografía; el chip cede antes que el texto.
2. **Panel a 300 px (`temas-editor`):** el relleno de 12 px del panel sumaba al hueco de la barra clásica. Ahora lo pone `useRellenoBarra` solo cuando la barra es superpuesta (`offsetWidth − clientWidth` = 0); con barra clásica no se añade nada.
3. **Variantes con barras clásicas también en macOS:** `editor-reparto.spec.ts` (C1-E23) y `temas-editor.spec.ts` («panel a 300, 360 y 480 px») se ejecutan además con `::-webkit-scrollbar { width: 15px }` inyectado. Las cuatro pasan en local.
No comprobado: Linux real (otra tipografía); ver el CI.
