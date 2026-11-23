# 0324 — Feature 9 · Escribir paquetes de canción y copias de seguridad
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0339
- ADRs: 0027 §1–§2 y §7, 0012
- Spec UX: docs/ux/02-biblioteca.md y 08-ajustes-y-acerca.md (0.2.2 · Feature 9)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`ServicioCopias` (escritura) con `yazl`.

## Criterios de aceptación
- [ ] Formato `.shinobi` y manifiesto; SHA-256 en streaming; temporal y `rename`; cancelable; espacio; `EN_CURSO`.
- [ ] `yazl` y `yauzl` añadidas con sus avisos en `THIRD_PARTY_NOTICES.md` (ADR 0012).
- [ ] `config.copias.ultima`.

## Pruebas de feedback
- Unitarias: Main con biblioteca temporal.
- E2E: Ninguna (la de 0326).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Qué se hizo.** `ServicioCopias` (`app/src/main/copias/servicio.ts`): cola propia de concurrencia 1 (compartida con importar; `en_cola` si hay otro), `copias:progreso` como mucho 4 por segundo con `fraccion` por bytes y `cancion { hechas, total, titulo }`, cancelable, `copias:cambio` con `tipo` y, al terminar, `resultado` con `ubicacionId`. Escritura (`exportar.ts`, `zip.ts`): `yazl` en streaming con SHA-256 y bytes calculados sobre la marcha, audio y miniatura sin comprimir y JSON con deflate, manifiesto al final con todo comprobado, temporal `.<nombre>.<8 hex>.shinobi-parcial` junto al destino y `rename`; cancelar o fallar borra el temporal y deja intacto el archivo previo. Todos los archivos de una canción se abren antes de escribir ninguno (una pista borrada a mitad omite la canción, no deja un paquete a medias). Canciones con fuente o separación **en curso** se omiten con `EN_CURSO` (pregunta [0255](../preguntas/0255-adr-0027-frente-a-las-specs-de-la-feature-9-en-cuatro-puntos.md)); ilegibles, `CANCION_NO_DISPONIBLE`; sin ninguna que se pueda guardar, `NADA_QUE_HACER`. Espacio: suma de tamaños + ~1 % frente al libre del destino (`SIN_ESPACIO`) antes de empezar. Destino con el patrón `destinoId` (`destinos.ts`): nombres de la spec, última carpeta de paquetes o Documentos, carpeta de datos rechazada, un solo uso, caduca a los 30 min. Temas: en un paquete de canciones, solo los que resuelven la apariencia de sus canciones (más la asignación o el predeterminado que los eligió); en una copia, el catálogo entero. `ajustes.json` solo en copias y con la lista blanca de ADR 0027 §3 (`ajustes.ts`). `config.copias.ultima` = `{ fecha, canciones, bytes, tipo }` al terminar una copia. Estimación (`destinoPropuesto.estimacion`): suma de tamaños de archivo, sin leer contenido.
- **Dependencias.** `yazl` 3.3.1 y `yauzl` 3.4.0 (MIT) en `dependencies`, con `buffer-crc32` 1.0.0 y `pend` 1.2.0 (MIT); `@types/yazl` y `@types/yauzl` (MIT) en `devDependencies`. `THIRD_PARTY_NOTICES.md` y el lock actualizados (`npm run licencias`, `licencias:comprobar` OK). `scripts/verificar-paquete.mjs` admite estas dependencias en `app.asar` (pregunta [0258](../preguntas/0258-dependencias-de-la-feature-9-tipos-y-lista-de-paquete.md)).
- **Archivos.** `app/src/main/copias/{formato,zip,exportar,destinos,ajustes,temas,contexto,servicio,index}.ts`, `app/src/main/copias/montajeDePrueba.ts` y tests, `app/src/shared/ipc.ts` (ampliaciones opcionales, pregunta [0257](../preguntas/0257-contratos-ipc-de-copias-que-la-spec-necesita-y-no-traen.md)), `app/src/main/ipc/handlers.ts`, `app/src/main/index.ts` (cableado y cierre de la app), `app/package.json`, `app/package-lock.json`, `THIRD_PARTY_NOTICES.md`, `app/scripts/verificar-paquete.mjs`.
- **Cómo probarlo.** `npx vitest run src/main/copias`. Medido a mano con una mezcla de 800 MB (archivo disperso): exportar e importar en menos de 15 s en total, sin cargar el audio en memoria.
- **Deuda técnica.** ZIP64 (copias de más de 4 GB) no se ha podido probar en CI: `yazl` lo hace solo; queda para la guía manual (copia completa de 1,7 GB y de más de 4 GB). El Archivo de Utilidades de macOS no abre ZIP64 (la app sí).
