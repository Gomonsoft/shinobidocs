# 0382 — Feature 5 · Confirmación de «Preparar» con letras sin marca en la Biblioteca
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0380; **cambio de spec del diseñador** en `docs/ux/02-biblioteca.md` (ver la pregunta 0278, «Cambios de spec»)
- ADRs: 0025 (revisión «Elección con el veredicto prudente y "Preparar" sobre letras sin marca»)
- Spec UX: docs/ux/02-biblioteca.md («Preparar» una canción, y Feature 8, «Preparar» de la selección)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5. Lote D (`vistas/biblioteca/**`).

## Objetivo

Que el usuario confirme antes de que «Preparar» ponga fines en una letra que pudo haber editado él (letras del MVP, de 0.2.1 o de 0.2.2 ya tocadas).

## Criterios de aceptación

- [ ] Donde la spec ofrezca «Preparar» para una canción con `prepararFinesSinMarca` (resumen) o con `confirmar: 'finesSinMarca'` (`previsualizar`), se muestra la confirmación de la spec antes de llamar a `preparacion.preparar(ids, { finesSinMarca: true })`. Cancelar no llama a nada.
- [ ] En la confirmación de la selección múltiple (Feature 8), la nota de esas canciones usa el texto nuevo de la spec. El botón confirma todas las aplicables con `finesSinMarca: true`; no hay un segundo diálogo.
- [ ] Sin `confirmar`, «Preparar» se comporta como hoy (sin diálogo en la tarjeta).

## Pruebas de feedback

- Unitarias:
  - Componente de la tarjeta o del menú: con `prepararFinesSinMarca` aparece la confirmación; Cancelar no llama a `preparar`; Confirmar la llama con `{ finesSinMarca: true }`.
  - Diálogo de lote: la nota nueva y la llamada con la opción.
- E2E: `e2e/biblioteca*.spec.ts`, si la spec añade un criterio con su selector.
- Críticos: no, salvo que la spec lo meta en el flujo principal.
- Manual: guía de la feature 5 (qa): preparar una canción del MVP con letra de LRCLIB, confirmar, y comprobar a oído y en el editor que ningún inicio se movió y que «Quitar esos fines» los retira.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

Hecha (2026-11-22, programador), con una reserva (pregunta 0296).

- Nuevos: `vistas/biblioteca/useAjustarFines.tsx` (hook, diálogo con foco inicial en [Cancelar], toasts de inicio y de resultado, sin red y sin abrir la vista de progreso) y `textosAjustarFines.ts`. Cambios mínimos en `TarjetaCancion.tsx` (ítem «Ajustar los fines…» tras «Preparar») y `Biblioteca.tsx` (hook y diálogo).
- Contrato: el resumen gana `lineasSinFin` (para el número del diálogo) además de `prepararFinesSinMarca`.
- Selección múltiple (`vistas/biblioteca/acciones/`, dir. nueva de otro programador): `modelo.ts` admite en «Preparar» las canciones con `prepararFinesSinMarca`; `DialogoPreparar.tsx` usa `confirmar` para la nota `bib.acc.preparar.nota.finesSinMarca`, muestra `bib.acc.preparar.aviso.finesSinMarca` y llama `preparar(ids, { finesSinMarca: true })` solo si hay alguna (sin segundo diálogo).
- Editor: el bloque «Preparación automática» muestra solo el renglón de fines con `edi.prep.intro.fines` (sin búsqueda ni elección), y sin banner al entrar. Progreso: `prog.prep.omitido.sinMarca` en «Comprobar» mientras corre.
- Pendiente: en Lista y Letra lista el ítem no aparece (main las omite con YA_LISTA; pregunta 0296).
- Pruebas: `useAjustarFines.test.tsx`, `DialogoPreparar.sinMarca.test.tsx`, `progreso/preparacion.test.ts`, `editor/preparacion/modelo.test.ts`. E2E escrita sin ejecutar en `e2e/preparacion.spec.ts` (menú ⋯, diálogo, Cancelar sin cambios, confirmar). Capturas por tomar: ⋯ con «Ajustar los fines…», `bib.prep.fines.dialogo`, ambos toasts, diálogo de «Preparar» por lotes con el aviso, bloque del editor con `edi.prep.intro.fines`.
