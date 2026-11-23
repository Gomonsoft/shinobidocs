# 0382 — Feature 5 · Confirmación de «Preparar» con letras sin marca en la Biblioteca
- Estado: Pendiente (espera la spec)
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

(las rellena el programador al terminar)
