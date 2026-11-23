# 0301 — Consultas de carpeta que necesita el diálogo de exportar varias
- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

La spec 10 · Feature 8 pide en el formulario del lote (G) el aviso «{k} de estas canciones ya tienen un video en esta carpeta» y que «Mostrar la carpeta» abra la carpeta sin seleccionar ningún archivo.

## Pregunta

1. ¿Puede main ofrecer, sin ejecutar nada, el recuento (y los nombres propuestos) de las canciones del lote que ya tienen un archivo en la carpeta elegida? Por ejemplo `exportacion.previsualizarLote({ cancionIds, formato, carpetaId })` → `{ nombres: [{ cancionId, archivo, existe }] }`. Con él la interfaz calcularía `exp.lote.aviso.existe` y mostraría el nombre de cada archivo en «Ver cuáles».
2. ¿Puede añadirse una forma de abrir la carpeta de un lote (por `loteId` o `carpetaId`) sin seleccionar un archivo?

## Opción aplicada

Sin (1) el aviso no se muestra; sin (2) «Mostrar la carpeta» revela el primer video terminado del lote. Ver también la pregunta 0300 (puntos 8 y 9).

## Respuesta

(pendiente)
