# 0285 — Feature 3 · Aviso de versión nueva en la interfaz
- Estado: Hecha
- Paso del pipeline: 0
- Depende de: 0284
- ADRs: 0023
- Spec UX: docs/ux/08-ajustes-y-acerca.md, docs/ux/09-descarga-e-instalacion.md, docs/ux/01-primer-arranque.md y docs/ux/sistema-visual.md (secciones 0.2.2 · Feature 3)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Mostrar el punto del botón ⚙, la línea de Acerca de, «Buscar actualizaciones», el interruptor y la mención del primer arranque.

## Criterios de aceptación
- [x] Lo que pide la spec 08 · Feature 3 con los textos de su microcopy.
- [x] El aviso no aparece en la ventana secundaria ni en la de exportación.
- [x] «Ver novedades» y «Descargar» abren solo enlaces construidos por main (`ENLACES_PERMITIDOS`).
- [x] Mención en el primer arranque (spec 01 · Feature 3).

## Pruebas de feedback
- Unitarias: Componentes con el doble de `window.shinobi`: estados `nueva`, `al_dia`, `error`, sin conexión, canal de desarrollo (botón desactivado con motivo).
- E2E: Una secundaria (`actualizaciones.spec.ts`) con el doble HTTP: punto en ⚙, línea de Acerca de y lista exacta de cabeceras recibidas por el doble.
- Críticos: sí
- Manual: Primer arranque con la mención; aviso con una Release real.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** `vistas/acerca/`: `BloqueActualizaciones.tsx` (estados al día, nunca, nueva estable/preliminar, error a mano, buscando, aviso desactivado, `desarrollo`/`local`; casilla con su privacidad; «Ver novedades»/«Descargar»/«Guía de instalación» abren solo `estado.enlaces`, construidos por main), `useActualizaciones.ts`, `modeloActualizaciones.ts` (punto, fecha), `textosActualizaciones.ts` (microcopy de spec 08 y `pa.actualizaciones`). `AcercaDe` lo muestra bajo la línea de canal (también en el diálogo del primer arranque, sin punto). `Ajustes.tsx`: aviso `aj.act.banner` con [Ver] (foco en el `h3`) y `marcarVista` al abrir. `navegacion/Marco.tsx`: punto de 8 px y nombre/tooltip `aj.act.tooltip` en ⚙ (la ventana secundaria y la de exportación no usan `Marco`). `PantallasInicio.tsx`: `pa.actualizaciones` en B1 solo en canal `publicada`. `e2e/actualizaciones.spec.ts`.

**Pruebas.** `vistas/acerca/Actualizaciones.test.tsx` (estados, enlaces, casilla con fallo, banner, canales) y E2E con doble HTTP: punto en ⚙ tras la consulta de los 10 s, aviso y línea en Ajustes, el punto se apaga al volver, lista exacta de cabeceras (incluye `Sec-Fetch-*`, pregunta 0180), la respuesta trae URLs ajenas que no se usan, y desarrollo sin ninguna petición en 12 s.

**Para la guía manual (0286).** Primer arranque con la mención (sin scroll a 1280x800 ni 1024x576, F3-P1; no medido aquí); aviso con una Release real y «Descargar» abriendo el instalador de cada sistema; sin red sin ningún mensaje; capturas de F3-A19 (no tomadas); lectores de pantalla (anuncio de «Buscar»).

**Deuda.** `INSTALAR.md` aún no tiene la sección «Actualizar a una versión nueva» (el botón la enlaza). No se probó la geometría de B1.
