# 0320 — Feature 8 · Barra de selección y diálogos de acciones por lotes
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0318
- ADRs: 0026 §4
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
La barra con «Preparar», «A la cola», «Exportar video…», «Editar datos…» y «Eliminar…».

## Criterios de aceptación
- [ ] Criterios de la spec 02 · Feature 8 (1024 px, «Más acciones», Supr).

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: La de 0318.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Qué se hizo.** Barra de selección con «Preparar», «Aplicar tema…» y «Más acciones» (menú: A la cola, Exportar video…, Exportar paquete…, Exportar la letra (.lrc)…, Editar datos…, Eliminar…), recuentos «({a} de {n})» y motivos `bib.acc.ninguna.*`, `toolbar` con ←/→, y Supr en el modo selección. «Preparar» usa `preparacion.previsualizar/preparar`; «Editar datos…» y «Eliminar…» el patrón previsualizar → `ejecutar(…, version)` con `CONFIRMACION_OBSOLETA` (la lista se repinta con la vista previa de `detalles`), progreso por `biblioteca.alProgresoLote`, resultado por canción y «Reintentar las que faltan» (solo esas ids); «A la cola» con `cola.agregarVarias` y [Deshacer] = `cola.quitarVarias(entradaIds)`; «Exportar paquete…» y la letra reutilizan `abrirExportarPaquete` y `exportarLetras`.
- **Archivos clave.** `app/src/renderer/src/vistas/biblioteca/acciones/` (`modelo.ts`, `textos.ts`, `useAccionVarias.ts`, `useAgregarVarias.ts`, `ListaCanciones.tsx`, `DialogoPreparar.tsx`, `DialogoDatos.tsx`, `DialogoEliminar.tsx`, `resultado.ts`), `BarraSeleccion.tsx`, `Biblioteca.tsx`, `tarjeta.ts` (`puedePrepararResumen`, compartida con la tarjeta), `componentes/MenuContextual.tsx` (disparador con texto), `sesion/acciones.ts`, `biblioteca.module.css`; tests `Biblioteca.lotes.test.tsx`, `acciones/modelo.test.ts`; E2E `e2e/biblioteca-acciones.spec.ts` («barra de selección (0320)»).
- **Cómo probarlo.** `npx vitest run src/renderer/src/vistas/biblioteca` y `npx playwright test e2e/biblioteca-acciones.spec.ts`.
- **Criterios.** F8-1, F8-2, F8-3 (previsualizar, notas, privacidad, toast), F8-6, F8-7, F8-8, F8-9, F8-10, F8-11, F8-12, F8-13 (teclado): cumplidos y cubiertos por unitarias; F8-1 a 1024 × 576 con el panel de cola abierto comprobado a mano con captura (la primera fila no se parte). F8-4 y F8-5 son de la cola de la feature 7 (0316). **No cumplido**: el aviso `bib.acc.preparar.aviso.finesSinMarca` y `preparar(ids, { finesSinMarca })` (esperan a 0378/0380/0381). F8-14: capturas pendientes.
- **Deuda y preguntas.** Pregunta 0300 (motivos sin texto, notas sin distinguir tipo de trabajo, omitidas por `NADA_QUE_HACER`). Un `scroll` de la página cierra el menú (comportamiento de siempre): en E2E el menú se abre con `dispatchEvent('click')` porque `click()` desplaza la barra fija.
- **Pendiente manual.** Capturas `docs/ux/revisiones/0.2.2-feature-8/biblioteca-{ancho}x{alto}-{escala}-{estado}.png`: `barra-acciones`, `menu-mas-acciones`, `dialogo-preparar`, `dialogo-editar-datos`, `dialogo-eliminar`, `dialogo-eliminar-diez`, `resultado-eliminar-parcial`; eliminar un lote real y recuperarlo de la papelera en Windows, macOS y Linux; lector de pantalla en los diálogos.
