# 0379 — Feature 4 · La limitación del encaje llega a la vista Letra, al editor y a la preparación
- Estado: Hecha
- Paso del pipeline: 3 y 4
- Depende de: 0378; **cambio de spec del diseñador** en `docs/ux/05-letra.md` y `06-editor.md` (textos de `dudosa` con limitación; ver la pregunta 0275, «Cambios de spec»)
- ADRs: 0024 (revisión «Medida con canciones reales y guardas de prudencia»)
- Spec UX: docs/ux/05-letra.md#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase y docs/ux/06-editor.md#022--feature-4--comprobar-la-letra-con-la-voz-y-corregir-el-desfase
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 4. Lote C (`shared/letrasBusqueda.ts`, `main/letras/busqueda.ts`, `vistas/letra/**`, `vistas/editor/comprobar/**`). Lote D, una línea: `main/preparacion/servicio.ts` (`encajeDe`).

## Objetivo

Que «No está claro» diga **por qué** cuando la causa es un límite del método («la voz casi no tiene pausas» o «moverla casi no cambia nada») y no coros o partes sin letra.

## Criterios de aceptación

- [ ] `encajeCandidatoSchema` (`shared/letrasBusqueda.ts`) gana `limitacion: z.enum(['vozContinua', 'sinContraste']).nullable().optional().catch(undefined)`. `main/letras/busqueda.ts` y `encajeDe` de `main/preparacion/servicio.ts` lo copian de `ResultadoEncaje`, igual que el evento `letras:encaje`.
- [ ] Vista Letra (candidatos, vista previa y C) y editor («Comprobar la letra con la voz…»): un resultado `dudosa` con `limitacion` muestra los textos nuevos de la spec. Sin `limitacion`, los de hoy (`let.comp.dudosa.ayuda`, `let.comp.actual.dudosa` y `edi.comprobar.dudosa`).
- [ ] No cambia el orden de los candidatos (un `dudosa` con limitación ordena como `dudosa`) ni el motivo de la no elección (`duda`), salvo que la spec diga otra cosa.
- [ ] Una corrección ya guardada (`desfase_corregido_ms`) sigue mostrando `let.comp.actual.corregida` con [Quitar la corrección] aunque la comprobación de ahora salga `dudosa` con limitación: lo que se ve no puede contradecir lo guardado sin ofrecer cómo volver atrás.

## Pruebas de feedback

- Unitarias:
  - `encajeCandidatoSchema` con y sin `limitacion`, y con un valor desconocido (se lee como ausente).
  - `vistas/letra/comprobacion.test.ts` y el componente del diálogo del editor: el texto de cada limitación y el de siempre sin ella.
- E2E: `e2e/letras.spec.ts` y `e2e/editor.spec.ts`, si la spec añade un criterio con la voz densa. El doble necesitaría un escenario de voz continua; solo si la spec lo pide.
- Críticos: sí.
- Manual: la guía de la feature 4 (qa) añade un caso: una canción con voz casi continua dice «No está claro» con su motivo, y nunca «coincide».
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

Hecha (2026-11-22, programador).

- `shared/letrasBusqueda.ts`: `encajeCandidatoSchema.limitacion` (lectura tolerante). `main/letras/busqueda.ts` y `encajeDe` (`main/preparacion/servicio.ts`) la copian; el evento `letras:encaje` la lleva por el mismo esquema. El orden de candidatos y el motivo `duda` no cambian.
- Vista Letra: `Comprobacion` `dudosa` lleva `limitacion` (`vistas/letra/comprobacion.ts`); candidato `let.comp.dudosa.limitada`, vista previa `let.comp.limitacion.*` (`BusquedaLetra.tsx`), C `let.comp.actual.limitada` en gris (`LetraElegida.tsx`); la corrección guardada sigue ganando (`let.comp.actual.corregida`). Motivo de «Elige la letra» `let.prep.motivo.limitada` cuando el mejor candidato es `dudosa` con limitación y el motivo guardado es `duda`. No hay [Corregir el desfase] ni [Buscar otra letra] con limitación; `desfaseMs` no se presenta.
- Editor: diálogo con `edi.comprobar.limitada.*`, icono `circle-help`, solo [Cerrar].
- Pruebas: `letrasBusqueda.test.ts`, `comprobacion.test.ts`, `preparacion.test.ts`, `Dialogos.test.tsx`. E2E: no escritas (F4-E2 y la voz densa piden un escenario nuevo del doble de LRCLIB; no se ha añadido). Capturas por tomar: `candidato-limitado` (candidato LRCLIB sin fines con `sinContraste` seleccionado) y `actual-limitada` (F4-L12). Con la biblioteca real, casi todo saldrá «No podemos comprobarla» (pregunta 0295).
