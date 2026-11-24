# 0399 — Pantalla de error: sin «Abrir la carpeta de registros» y sin límite en la ventana de exportación
- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto
La spec «Pantalla de error de la interfaz» (ux/00) pide un botón «Abrir la carpeta de registros», que necesita una llamada nueva al proceso principal (hoy solo existe `sistema.abrirCarpetaDatos`), y un límite de errores también en la ventana de exportación.

## Pregunta
¿Se añade un canal `sistema.abrirCarpetaRegistros` y un límite en `exportacion.html`?

## Opción provisional tomada (si no bloquea)
Como permite la spec, el botón se omite (basta «Copiar detalles»; el usuario puede abrir la carpeta de datos desde Ajustes). La ventana de exportación sigue como estaba: un fallo suyo termina la exportación por el camino de siempre. La ventana secundaria lleva su límite (variante P) y sus errores llegan a `app.log` por `console-message` (su API está acotada por el ADR 0017 y no se le añade un canal).

## Respuesta
(pendiente)
