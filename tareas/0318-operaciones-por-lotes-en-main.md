# 0318 — Feature 8 · Operaciones por lotes en main
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0308
- ADRs: 0026 §4, 0016 §7, 0017
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`editarDatosVarias`, `eliminarVarias`, `cola.agregarVarias` y `cola.quitarVarias` (pregunta 0166 §5) con el patrón de «Aplicar tema».

## Criterios de aceptación
- [ ] Previsualizar con `version`, ejecutar con progreso y `CONFIRMACION_OBSOLETA`, resultado por canción.
- [ ] Eliminar cancela trabajos, preparación y exportación antes de la papelera; `EDICION_BLOQUEADA` por canción.

## Pruebas de feedback
- Unitarias: Servicios con dobles: todos los motivos.
- E2E: Ampliar `biblioteca-acciones.spec.ts`: «Eliminar…» con 3 canciones.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Qué se hizo.** `ServicioLotes` (`app/src/main/biblioteca/lotes.ts`, en `main/biblioteca/index.ts`): `previsualizarDatos/ejecutarDatos` (`biblioteca.editarDatosVarias.*`), `previsualizarEliminar/ejecutarEliminar` (`biblioteca.eliminarVarias.*`), `agregarACola` y `quitarDeCola` (`cola.agregarVarias/quitarVarias`). «Preparar» no se repite aquí: ya es `preparacion.previsualizar/preparar` (0308, con `aplicaPreparar` de `shared/derivados.ts`). Cableado en `main/ipc/handlers.ts` (dependencia `lotes`, fuera de `CANALES_NO_IMPLEMENTADOS`) y `main/index.ts` (`ServicioLotes`, evento `biblioteca:progresoLote`).
- **Patrón de «Aplicar tema».** `previsualizar*` → `{ version, canciones: [{ id, aplica, motivo?, trabajos, entradasCola, cambiaTema }] }`. La `version` es el hash de la acción, los argumentos y la huella de cada canción (estado, título, artista, álbum, estado de cada paso —no su progreso—, y lo que arrastra). `ejecutar*` recalcula en main y, si la versión no coincide, responde `CONFIRMACION_OBSOLETA` sin escribir nada; `detalles` lleva la vista previa nueva serializada (JSON). Una acción por lotes a la vez (`EN_CURSO`). Va canción a canción, emite `biblioteca:progresoLote { hechas, total }` (también 0 de n al empezar) y devuelve `{ resultados: [{ id, resultado: 'hecho' | 'omitida' | 'error', motivo? }] }`; lo hecho queda hecho y un fallo no detiene las siguientes.
- **Motivos.** Editar datos: `NADA_QUE_HACER` (ya tiene el valor), `CANCION_NO_DISPONIBLE` (dañada o desconocida), `EDICION_BLOQUEADA` (con sesión, la que suena: pregunta 0292); escribe por `biblioteca.actualizar` (cola de apariencia) con origen `usuario` solo en los campos que cambian; `album: null` lo vacía, el título nunca se toca; `cambiaTema` compara la resolución del catálogo antes y después. Eliminar: `CANCION_EN_REPRODUCCION` (la activa, también como defensa final); usa `biblioteca.eliminar` (que ya cancela trabajos, preparación y exportación con limpieza antes de la papelera del sistema, y la quita de la cola por `cancionEliminada`); un fallo de la papelera es `error` `ERROR_INTERNO` y la canción se queda. «A la cola»: solo Listas (`CANCION_NO_DISPONIBLE` para el resto), en el orden dado, `COLA_LLENA` corta el resto (parcial, esas con ese motivo); `quitarVarias` ignora las entradas ya consumidas y devuelve el estado como `cola.quitar`.
- **Archivos.** `main/biblioteca/lotes.ts` (+ `lotes.test.ts`), `main/biblioteca/index.ts`, `main/ipc/handlers.ts`, `main/index.ts`, `main/ipc/handlers.lotes.test.ts`, `e2e/biblioteca-acciones.spec.ts` (prueba nueva).
- **Cómo probarlo.** `npx vitest run src/main/biblioteca/lotes.test.ts src/main/ipc/handlers.lotes.test.ts` (13 + 4 casos con una biblioteca y un catálogo de temas reales en carpeta temporal y sesión doble: todos los motivos, `CONFIRMACION_OBSOLETA` (la selección cambió, empezó un trabajo, pasó a sonar), fallo de la papelera con reintento de solo esa, orden y `COLA_LLENA` parcial con deshacer). E2E **escrita, sin ejecutar**: «`Eliminar…` de varias (0318)» en `biblioteca-acciones.spec.ts`, por la API (`window.shinobi.biblioteca.eliminarVarias`) porque la barra de selección es de 0320.
- **Para 0320.** Flujo de cada acción: `previsualizar` al abrir el diálogo (esqueleto > 300 ms) → mostrar `aplica`/`motivo`/`trabajos`/`entradasCola`/`cambiaTema` por canción → `ejecutar(…, version)`; con `CONFIRMACION_OBSOLETA` el error trae en `detalles` (JSON) la vista previa nueva para repintar la lista (`tema.obsoleto`). Los motivos son códigos (`NADA_QUE_HACER`, `EDICION_BLOQUEADA`, `CANCION_NO_DISPONIBLE`, `CANCION_EN_REPRODUCCION`, `COLA_LLENA`, `ERROR_INTERNO`): la interfaz les pone su texto. «Reintentar las que faltan» es volver a previsualizar solo esas ids. `cola.agregarVarias` no tiene versión (sin diálogo).
- **Deuda.** `trabajos` cuenta trabajos vivos de la canción + la preparación en curso + exportaciones sin terminar (la spec habla de cada tipo por separado: la interfaz solo puede decir «se cancelará su trabajo»; si hace falta distinguir, `trabajosDe` pasaría a devolver un desglose). Manual (guía): eliminar un lote y recuperarlo de la papelera en Windows, macOS y Linux; durante una sesión real.
