# 0303 — Feature 6 · Propuesta de datos por campo y valores de la biblioteca
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0302
- ADRs: 0025 §6
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 6)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Que main devuelva `{ valor, origen, dudoso, alternativa }` por campo y la lista de valores existentes.

## Criterios de aceptación
- [ ] Orden de fuentes por campo de la spec 03 · Feature 6.
- [ ] `biblioteca.valoresDatos()` desde el índice en memoria.
- [ ] Origen `usuario` en cada campo que cambie el formulario o «Editar datos».

## Pruebas de feedback
- Unitarias: Main con dobles del worker: cada fuente y cada caso dudoso de la spec.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- `main/fuente/propuestaDatos.ts`: `proponerDatos(entrada, valores)` (puro) aplica el orden de fuentes por campo de la spec, la regla «Como en tu biblioteca» (`claveFlexible`; misma clave de identidad = mismo grupo, no se toca), la inversión título/artista (derecha = artista de la biblioteca o canal) y los casos dudosos (nombre sin patrón, título con restos, canal, invertido). `origenAlConfirmar` calcula `metadatos.origen` (`fuente`/`nombre`/`usuario`).
- `ServicioImportacionArchivo` y `ServicioYoutube` devuelven `datos` (por campo) junto a `metadatos` y guardan el origen al confirmar (también al sustituir la fuente). `main/index.ts` les inyecta `valoresDatos`.
- `ServicioBiblioteca.valoresDatos()` agrupa del índice en memoria (grafía visible = la de la canción más reciente, recuento, clave, `artistas` en álbumes); canal `biblioteca.valoresDatos` sustituido en `handlers.ts`. `biblioteca.actualizarMetadatos` pone `usuario` en lo que cambia (`main/biblioteca/origen.ts`); `aplicarCambio` fusiona el origen por campo.
- **Pruebas**: `propuestaDatos.test.ts` (20 casos: cada fuente y cada caso dudoso), `origen.test.ts`, `servicio.test.ts`, `handlers.test.ts`, y los tests con worker real de `archivo.test.ts` y `youtube.test.ts` (vídeo de YouTube Music con el doble).
- **Pendiente**: la carpeta (`carpeta`) y la lista (`lista`) ya se admiten en `proponerDatos` pero solo los usa el lote (feature 7, 0314/0315). N7 (álbum de LRCLIB) queda para la feature 5: pregunta 0220.
