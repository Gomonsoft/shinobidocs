# 042 — Carril del Coro opcional en la línea de tiempo

- Estado: Idea
- Origen: prueba manual del usuario en Windows con un dúo real sin coros (2026-11-23), guía [Feature 1 · Cantantes por línea](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-3
- Fecha: 2026-11-23
- Relacionadas: spec [06 · Feature 1](../ux/06-editor.md#023--feature-1--cantantes-por-línea), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), propuesta [041](041-anadir-cantantes-solo-desde-funciones.md)

## Problema

Con el reparto activo, la línea de tiempo muestra siempre el carril del Coro, aunque la canción no tenga ninguna línea de coro («Arrastra aquí las líneas de Coro», «Sin líneas» en Funciones). En un dúo sin coros ocupa alto de la línea de tiempo sin servir para nada. En palabras del usuario: «no todas las canciones lo necesitan».

## Propuesta

Una casilla para activar o desactivar el carril del Coro de la canción, en Funciones › «Cantantes y coros». Apagada, el carril no se muestra en la línea de tiempo. Queda para el diseñador: el valor inicial, qué pasa si la canción ya tiene líneas de coro (no dejar apagarla, o avisar), si la sugerencia «N líneas van entre paréntesis» la enciende sola, y si la preferencia es de la canción o de la app.

## Valor y coste

- Valor: menos carriles en pantalla en los dúos sin coros (más alto para la onda y menos destinos donde soltar por error); relacionado con el límite de alto que obliga a «Juntar carriles» en ventanas pequeñas.
- Coste: sin estimar (lo valora el arquitecto). Si la preferencia se guarda en la canción, toca el esquema de `partes`.
- Riesgos: que un coro existente quede oculto; compatibilidad con canciones ya repartidas en 0.2.3-alpha.1.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
