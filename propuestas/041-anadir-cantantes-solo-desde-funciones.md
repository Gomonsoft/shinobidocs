# 041 — Añadir cantantes solo desde Funciones, sin la franja «Suelta aquí para un cantante nuevo»

- Estado: Idea
- Origen: prueba manual del usuario en Windows con un dúo real (2026-11-23), guía [Feature 1 · Cantantes por línea](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md), caso 2 (arrastre entre carriles, paso 2.4); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-2
- Fecha: 2026-11-23
- Relacionadas: spec [06 · Feature 1](../ux/06-editor.md#023--feature-1--cantantes-por-línea) (C1-E14, C1-E15), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), incidencia I-1 de la misma nota

## Problema

Al arrastrar una región entre carriles aparece, justo debajo del último cantante, la franja «Suelta aquí para un cantante nuevo». En un dúo queda pegada al carril del cantante 2, que es el destino más habitual: soltar unos píxeles más abajo crea un cantante que nadie pidió. El usuario prefiere no poder crear cantantes arrastrando.

En su captura (ilustrativa: la canción es un dúo y no tiene tercer cantante) se ve un «Cantante 3» con 1 línea creado así, con su carril y su fila en Funciones › «Cantantes y coros».

## Propuesta

Quitar la franja de destino «cantante nuevo» del arrastre. Los cantantes se añaden y se quitan solo desde Funciones › «Cantantes y coros» («+ Añadir cantante»), que ya existe. El arrastre queda para mover líneas entre carriles que ya existen. Si se mantiene «¿Quién canta?» › «Añadir cantante» (menú y tecla C) lo decide el diseñador: el usuario pidió que «desde Funciones se controle todo eso».

## Valor y coste

- Valor: evita cantantes creados por accidente; un solo sitio para gestionar el reparto; la línea de tiempo no cambia de alto al empezar un arrastre.
- Coste: sin estimar (lo valora el arquitecto). Se quita comportamiento: fila virtual `nuevo` de la pista, criterio del paso 2.4 de la guía y lo que la spec 06 diga del destino «cantante nuevo».
- Riesgos: la única reproducción automática de la incidencia I-1 (pantalla vacía) fue al soltar sobre esa franja; quitarla puede ocultar la causa sin arreglarla. Conviene encontrar la excepción antes.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
