# 0348 — Feature 1 · Letra en pantalla: color por parte, insignia y paréntesis del coro
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0340
- ADRs: 0029 §4, 0022 §2–§5
- Spec UX: docs/ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla (Reglas de color y Señales que no dependen del color) y docs/ux/sistema-visual.md#023--varios-cantantes-y-coros
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Pintar el color, la insignia y los paréntesis en el bloque de líneas, que también usará cada zona (0364).

## Criterios de aceptación
- [x] `colorDeLinea` usa `colorDeParte`: barrido, subrayado e indicadores de espera (color de la línea que viene) en el color de la parte; texto sin cantar en `letra.color`; la que acaba pasa a gris, también su insignia (C1-R3, parte de color).
- [x] Letra lista con reparto: texto entero en el color de su parte, sin barrido ni subrayado (C1-R8).
- [x] Insignia (`insignia(letra, parte)`, texto o icono `users`) con las medidas del sistema visual, fuera del flujo a la izquierda del primer renglón; `--k-ancho-linea` al 80 % solo con varios cantantes (C1-R4, iniciales; C1-R6, ancho; C1-R7).
- [x] Paréntesis dibujados en las líneas de coro sin duplicar, barridos con la primera y la última palabra; coro sin insignia (C1-R5).
- [x] Una canción sin reparto da el mismo modelo y el mismo DOM que en 0.2.2, con el ancho al 88 % (C1-R1).

## Pruebas de feedback
- Unitarias: `PantallaLetra.test.tsx`, `render.test.ts` (regresión en 50 instantes), `barrido.test.ts` con la letra de ejemplo.
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** `PantallaLetra` pinta el reparto sin tocar `render.ts`, `barrido.ts` ni el modelo: todo lo nuevo sale de un `useMemo` por letra (`reparto`: parte, insignia y paréntesis por id de línea) que es `null` sin reparto, de modo que una canción de un solo cantante sin coros da exactamente el mismo DOM que en 0.2.2.
- `colorDeLinea(linea, estilo, partes?)` (`estiloCss.ts`) usa `colorDeParte`; sin mapa de partes devuelve `color_resaltado`. Lo usan el barrido, el subrayado (hereda `--k-resaltado-linea`) y los indicadores de espera (la línea que viene). Nueva `colorDeTextoListo` para Letra lista: texto entero en el color de su parte con varios cantantes y, con un solo cantante, solo las líneas de coro (`--k-color-linea`, también el relleno de los indicadores).
- Insignia: `<span data-insignia>` absoluto dentro del nodo de la línea (texto o icono `users`), con las medidas del sistema visual en em de la línea; su `--k-insignia-x` lo mide `colocarInsignia` (primera caja del texto, en px sin transformar) junto a `medirBarridos`, así que va con la escala, la opacidad y el gris de su línea. Las líneas con insignia envuelven el texto en `<span data-texto>` (solo ellas).
- Paréntesis: «(» con la primera palabra y «)» con la última (o con el texto entero), solo si `textoEnPantalla` lo pide. Los coros no llevan insignia (`insignia()` da `null`).
- `--k-ancho-linea: 80%` en la raíz solo con `variosCantantes`.
- Archivos: `renderer/src/karaoke/{PantallaLetra.tsx, estiloCss.ts, pantallaLetra.module.css}`; test nuevo `PantallaLetraReparto.test.tsx`.

**Criterios.** C1-R1 (mismo DOM en 50 instantes con y sin `partes` sin reparto, ancho sin tocar; `render.ts` intacto), C1-R3 (color, insignia, subrayado de la línea y texto sin cantar en el color de la letra), C1-R4 (Todos «A·L», color de Todos), C1-R5 (coro con paréntesis, sin insignia, sin duplicar), C1-R6 (80 %, sin zonas aún), C1-R7 (medidas en CSS; la posición a la izquierda del primer renglón se mide con `Range`, solo comprobable a mano), C1-R8 (Letra lista), C1-R9 en la parte de color (los indicadores toman el color de la línea que viene; su colocación en zona es de 0364). C1-R2, C1-R10 y la geometría del R6 son de la tarea 0364.

**Cómo probarlo.** `npx vitest run src/renderer/src/karaoke`; `npx playwright test e2e/exportacion.spec.ts e2e/reproductor.spec.ts` y `npm run test:e2e:criticos`.

**Para 0364 (zonas).** Pintar es por línea: reutiliza el mapa `reparto` y pasa a cada zona sus líneas; la clave de nodo ya lleva la zona. La insignia se mide con el nodo, así que cambia sola si la zona escala. El ancho 80 % es una variable de la raíz (`--k-ancho-linea`). Para Todos repetido en cada zona, la clave `zona:id:rol` ya evita choques. `colorDeLinea` recibe el mapa de partes por id, no la letra.

**Verificación a mano.** Ver que la insignia queda pegada al primer renglón (línea de dos renglones: solo el primero), a 0,3 em, sin tapar el texto, en 1920 × 1080 y 1280 × 720; que el gris de la línea que acaba alcanza a la insignia.

**Deuda.** El mensaje de espera (`alAnunciarEspera`) no cambia. Sin E2E propio: el feedback es de componente.
