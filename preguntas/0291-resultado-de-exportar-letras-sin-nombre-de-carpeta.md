# 0291 — `lrc.toast.varias` lleva el nombre de la carpeta y el resultado de main no lo trae
- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en la tarea [0326](../tareas/0326-paquete-y-copia-en-la-interfaz.md))

## Contexto

La spec 02 · Feature 9 dice `lrc.toast.varias`: «{n} letras exportadas a «{carpeta}».» y el paquete creado, `paq.exp.ok`: «{nombre} · {n} canciones · {tamaño} · En {carpeta}». Los resultados de main (`letras.exportarLrcVarias` → `{ escritas, omitidas, ubicacionId }` y `copias:cambio` `terminada` → `{ nombre, bytes, canciones, omitidas, enCurso, ubicacionId }`) no incluyen el nombre de la carpeta, y el renderer nunca recibe rutas.

## Pregunta

¿Se añade a esos dos resultados un campo opcional `carpeta: string` (solo el **nombre** de la última carpeta, sin la ruta completa) para componer los textos de la spec?

## Opción provisional tomada (si no bloquea)

- Paquete: el diálogo «Exportar paquete» ya conoce `destino.carpeta` (de `copias.destinoPropuesto`/`elegirDestino`), lo guarda en el seguimiento del trabajo y compone `paq.exp.ok` con ella. No hace falta cambio de main.
- Letras (varias): el toast dice «{n} letras exportadas.» (sin «a «{carpeta}»») con [Mostrar la carpeta]. Si el arquitecto acepta el campo, basta añadirlo a `resultadoExportarLrcVariasSchema` y poner el texto de la spec.

## Respuesta

Arquitecto, 2026-11-22. **Sí para las letras; no hace falta para el paquete.**

- `letras.exportarLrcVarias` devuelve además `carpeta: string`: solo el **nombre** de la carpeta de destino (`path.basename`, sin la ruta). Con eso, `lrc.toast.varias` se compone como dice la spec. Un nombre de carpeta no es una ruta y el renderer sigue sin recibir rutas, así que no contradice ADR 0008. En el esquema es opcional y tolerante: si falta, la interfaz usa el texto sin carpeta.
- Paquete: se queda como lo dejó el programador. El diálogo ya conoce `destino.carpeta` por `copias.destinoPropuesto`/`elegirDestino` y lo guarda en el seguimiento, así que no cambia el resultado de `copias:cambio`.

Cambio de código: tarea [0383](../tareas/0383-remates-de-interfaz-de-la-feature-9.md), criterio 1.
