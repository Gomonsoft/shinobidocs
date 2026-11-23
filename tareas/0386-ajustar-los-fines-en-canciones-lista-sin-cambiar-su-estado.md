# 0386 — Feature 5 · «Ajustar los fines…» también en Lista y Letra lista, sin cambiar su estado
- Estado: Pendiente
- Paso del pipeline: 3 y 4
- Depende de: 0380 y 0382 (hechas)
- ADRs: 0025 (revisión «"Ajustar los fines" en canciones Lista (pregunta 0296)»)
- Spec UX: docs/ux/02-biblioteca.md (F5-B12, `bib.prep.fines.dialogo`) y docs/ux/06-editor.md («Quitar esos fines»)
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 5. Lote D (`shared/derivados.ts`, `main/preparacion/**`, `main/biblioteca/resumen.ts`). Lote C (`vistas/editor/**`, punto 5). La interfaz de la Biblioteca (0382) ya lo admite si `prepararFinesSinMarca` es `true`.

## Objetivo

Que las canciones Lista o Letra lista del usuario (14 de 18 en su biblioteca, marcadas en el MVP sin revisar, casi sin fines) puedan recibir fines prudentes tras confirmar. Su estado no cambia, no se toca nada más y el cambio se puede revertir.

## Criterios de aceptación

1. [ ] `aplicaPreparar` (`shared/derivados.ts`): para `estado: 'lista'` (también Letra lista) devuelve `{ aplica: true, pasos: ['ajustando_fines'], confirmar: 'finesSinMarca' }` solo si se cumplen todas:
   - la letra **no** es `intacta`;
   - hay alguna línea con inicio y `fin_ms: null`;
   - **ninguna** línea tiene `origen_fin: 'preparacion'` (ya se hizo antes; evita repetir);
   - no hay `preparacion.fines`.
   Si no se cumplen, `YA_LISTA` como hoy. Con `intacta`, una Lista sigue en `YA_LISTA`. Una «Preparar» completa nunca aplica a una Lista.
2. [ ] `resumen.prepararFinesSinMarca` sale de esa misma regla, así que es `true` en esas Listas.
3. [ ] `preparar(ids, { finesSinMarca: true })` sobre una Lista hace **solo los fines**:
   - lee el nivel base de picos (sin picos: omitida con `NADA_QUE_HACER`; **no** encola separación ni búsqueda);
   - aplica `proponerAjusteSilencios` en su variante prudente y escribe con `aplicarFinesPreparacion` (`origen_fin: 'preparacion'`);
   - **no** escribe `cancion.preparacion`, **no** cambia `estado`, no consulta la red y no llama a `marcarLista` ni a nada que la desmarque. `pasoFines` deja de exigir `estado === 'borrador'` solo en este camino.
   - Con una sesión en vivo (`edicionBloqueada()`): omitida con `EDICION_BLOQUEADA` **al pedirla**; no espera, como sí hace con un borrador.
   - Con el editor abierto sobre la canción: no escribe y lo dice (omitida, motivo `EN_EDICION` si existe, si no `EDICION_BLOQUEADA`).
4. [ ] El resultado de la canción en la tanda o en el toast trae el número de fines puestos. Con 0, la interfaz dice que no encontró dónde ponerlos (texto de la spec; si no lo hay, el diseñador lo añade).
5. [ ] **Reversible sin registro**: «Quitar esos fines» del editor aparece cuando la letra tiene líneas con `origen_fin: 'preparacion'`, haya o no `preparacion`. Hoy depende de `preparacion.fines` (`PanelFunciones.tsx`). Vuelve esos fines a automático, en un paso de deshacer, como hoy.
6. [ ] Una Lista que recibe fines no pierde su estado ni sus marcas `revisada` de líneas que no cambiaron. Main ya retira solo las que cambian.

## Pruebas de feedback

- Unitarias:
  - `derivados.test.ts`: Lista sin `intacta` con fines nulos → aplica con `confirmar`. La misma con una línea `origen_fin: 'preparacion'` → `YA_LISTA`. Lista `intacta` → `YA_LISTA`.
  - `servicio.test.ts` de la preparación:
    - una Lista recibe fines y conserva `estado`, no gana `preparacion` y ningún `inicio_ms`, fin fijado, `palabras` ni `offset_ms` cambia (comparación exacta);
    - sin picos se omite sin encolar nada;
    - con sesión en vivo se omite al momento;
    - no hay ninguna petición al doble de LRCLIB.
  - Editor: «Quitar esos fines» visible sin `preparacion` cuando hay `origen_fin: 'preparacion'`.
- E2E: `e2e/preparacion.spec.ts`: una Lista sembrada con LRC sin fines y voz con silencios. «Ajustar los fines…» desde el ⋯, confirmar; el archivo conserva `estado: "lista"` y gana fines `preparacion`; en el editor, «Quitar esos fines» los quita (F5-B12).
- Críticos: sí.
- Manual: guía de la feature 5, con la copia del MVP: una Lista recibe fines, suena igual al empezar cada línea y «Quitar esos fines» la deja como estaba.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

(las rellena el programador al terminar)
