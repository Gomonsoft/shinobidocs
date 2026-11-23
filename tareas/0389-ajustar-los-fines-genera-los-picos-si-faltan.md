# 0389 — Feature 5 · «Ajustar los fines…» genera los picos de la voz si faltan
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0386 (hecha)
- ADRs: 0025 (revisión «Picos bajo demanda en "Ajustar los fines" (pregunta 0315)»), 0015 (caché de picos)
- Spec UX: docs/ux/02-biblioteca.md (F5-B12, `bib.prep.fines.dialogo`, toast «Ajustando los fines de «{título}»…»)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5. Lote D (`main/preparacion/**`); textos nuevos de la interfaz en `vistas/biblioteca/**` cuando el diseñador los fije.

## Objetivo
Que «Ajustar los fines…» funcione en las Listas del MVP y de 0.2.1, que tienen `voz.flac` pero aún no tienen la caché de picos.

## Criterios de aceptación
1. [ ] Si `picos.nivelBase(id)` devuelve `null`, `soloFinesLista` pide la generación con `picos.solicitar(id)` y espera hasta `lista` antes de calcular los fines.
   - Usa la misma espera que la corrida de un borrador: se extrae `esperarPicos` a una función que no necesita `Corrida`, con el sondeo de siempre y el límite `ESPERA_PICOS_MAXIMA_MS`.
   - Generar picos solo escribe la caché derivada (`pistas/.picos-voz-v1-*.bin`, ADR 0015): `cancion.json` y la letra no cambian por esto.
2. [ ] Resultados nuevos de `omitidas` (añadidos al catálogo `MotivoOmitida`):
   - `SIN_VOZ`: `solicitar` responde `no_disponible` porque falta `pistas/voz.flac`;
   - `SIN_PICOS`: la generación da `error` o pasa del límite.
   Ya no se usa `NADA_QUE_HACER` para estos casos.
3. [ ] `prepararFinesSinMarca` del resumen es `false` si la canción no tiene la pista de voz (pistas dañadas o sin separar), para que el ítem no se ofrezca en ese caso.
4. [ ] Interfaz:
   - el toast «Ajustando los fines de «{título}»…» se muestra durante la espera de los picos, sin texto nuevo;
   - para `SIN_VOZ` y `SIN_PICOS`, los textos que fije el diseñador (sentido: «no tiene la pista de voz: vuelve a separarla» y «no se pudo leer la voz; vuelve a intentarlo»);
   - hasta que existan, el texto genérico de hoy.
5. [ ] En lote, las Listas se procesan una tras otra, cada una con su espera. Un fallo de una no detiene las demás.

## Pruebas de feedback
- Unitarias (`servicio.test.ts` de la preparación, con picos falsos):
  - (a) sin caché → llama a `solicitar`, espera y pone los fines;
  - (b) `solicitar` da `no_disponible` → `SIN_VOZ`, sin escribir nada;
  - (c) `error` o límite superado → `SIN_PICOS`;
  - (d) `cancion.json` sin más cambios que los fines;
  - (e) dos Listas en lote, una sin voz: la otra recibe sus fines.
- Unitarias: resumen con pistas dañadas → `prepararFinesSinMarca: false`.
- E2E: `e2e/preparacion.spec.ts`, la prueba de la 0386 **sin** llamar antes a `picos.solicitar`: la Lista sembrada solo con `voz.flac` recibe sus fines.
- Críticos: sí.
- Manual: guía de la feature 5, con una Lista del MVP recién copiada (sin caché).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
