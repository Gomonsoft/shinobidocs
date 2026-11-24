# 0393 — Elegir la letra sin comprobarla con tu audio cuando el encaje no puede decidir
- Estado: Hecha
- Paso del pipeline: 3 (letra) y transversal (preparación desatendida)
- Depende de: 0392 (las cifras del ADR se midieron con la ventana de 800 ms). **Se entrega junto con [0395](0395-aviso-de-letra-elegida-sin-comprobar.md)**: sin ella, la vista Letra diría «coincide con tu audio» de una letra sin comprobar.
- ADRs: 0025 §3 y su revisión «Elegir sin comprobar con tu audio…» (2026-11-23, punto 1); 0024 (guardas)
- Spec UX: — en esta tarea (solo main y contrato). La interfaz va en 0395.
- Tamaño: M
- Versión: 0.2.3, [plan 6](../versiones/0.2.3/plan-6.md), punto 2. Arregla el criterio de «hecha» de la feature 5 de 0.2.2 (0 de 7 en Windows). Provisional: [pregunta 0393](../preguntas/0393-elegir-la-letra-sin-comprobarla-con-tu-audio.md).

## Objetivo
Que la preparación desatendida elija sola la letra de LRCLIB cuando la comprobación con la voz no puede afirmar ni negar nada (`dudosa` con limitación), la marque «sin comprobar» y siga hasta «Lista para revisar». No corrige nunca su desfase.

## Criterios de aceptación
1. [ ] **`elegirLetra`** (`app/src/main/preparacion/eleccion.ts`):
   - El camino de hoy no cambia: si algún candidato cumple 1–3 (`coincide` o `desfasada`), se decide como ahora, con la ambigüedad incluida.
   - Si ninguno cumple, se buscan los **elegibles sin comprobar**: candidatos con tiempos (`sincronia !== 'texto'`), `|diferencia_ms| ≤ DIFERENCIA_DURACION_MAXIMA_MS` y `encaje.veredicto === 'dudosa'` con `encaje.limitacion` distinto de `null` y de `undefined`.
   - Si hay alguno y todos tienen la misma `textoClave`: `{ tipo: 'elige', candidato: el primero, desfaseMs: null, sinComprobar: true }`. Si dos textos difieren: `{ tipo: 'no_elige', motivo: 'ambigua' }`.
   - Si no hay ninguno, los motivos de hoy (`sin_encaje`, `dudosa`, `no_coincide`) no cambian.
   - `DecisionEleccion` de tipo `elige` gana `sinComprobar: boolean`, `false` en el camino de hoy. El comentario JSDoc cita la revisión de ADR 0025.
2. [ ] **Registro** (`app/src/shared/cancion.ts`): `preparacion.eleccion` gana `sin_comprobar: z.literal(true).optional().catch(undefined)`. Un archivo de 0.2.2 sin el campo se lee igual, y 0.2.2 ignora el campo (lectura tolerante). `cancion.esquema` no sube.
3. [ ] **Preparación** (`app/src/main/preparacion/servicio.ts`, `pasoComprobar`):
   - Con `sinComprobar`, guarda la letra como hoy, sin `desfase_ms`, y escribe `eleccion: { por: 'app', fecha, lrclib_id, sin_comprobar: true }`.
   - El resto de la corrida no cambia (fines prudentes, dudosas, `lista_para_revisar`).
   - `app.log` registra `preparacion <id>: letra elegida sin comprobar (limitacion=<vozContinua|sinContraste>)`. Para ello la decisión lleva también la limitación del candidato elegido.
4. [ ] **Resumen IPC**:
   - `resumenPreparacionSchema` (`app/src/shared/ipc.ts`) gana `eleccionSinComprobar: z.boolean()`.
   - `main/biblioteca/resumen.ts` la calcula como `p.eleccion?.por === 'app' && p.eleccion.sin_comprobar === true`.
   - Si el usuario elige otra letra, `eleccion.por` pasa a `usuario` (ya ocurre) y `eleccionSinComprobar` queda en `false`. `preparacionTrasEscribir` no tiene que borrar el campo.
5. [ ] **`npm run calibrar:encaje`** (`app/scripts/calibrar-encaje.ts`) imprime una línea «Elección sin comprobar» con la regla del punto 1 aplicada a lo que ya mide (letras tal cual):
   - propias elegibles x/n;
   - ajenas elegibles y/pares, y las de pares con duraciones a ≤ 2000 ms (z/w);
   - desplazadas ±0,8 s o más elegibles k/m.

   Solo cifras e ids. En `--json`, el mismo bloque con esos nombres.
6. [ ] La vista Letra (búsqueda interactiva) y la comprobación diferida no cambian. Una letra elegida sin comprobar **nunca** se corrige sola: su veredicto es `dudosa`, y la corrección exige `desfasada`.

## Pruebas de feedback
- Unitarias (`eleccion.test.ts`):
  - un candidato `dudosa` con `vozContinua` y otro con `sinContraste`, cada uno solo y en duración: se elige, con `sinComprobar: true` y `desfaseMs: null`;
  - `dudosa` sin limitación: `no_elige` con `dudosa`;
  - dos elegibles sin comprobar con el mismo texto (cambiando solo mayúsculas y puntuación): se elige el primero. Con textos distintos: `ambigua`;
  - uno `coincide` y otro `dudosa` con limitación y texto distinto: se elige el `coincide` con `sinComprobar: false` (el camino de hoy manda);
  - elegible sin comprobar a 2500 ms de duración: `no_elige` con `duracion`.
- Unitarias (`servicio.test.ts` de preparación):
  - candidato LRC **sin fines** sobre la voz sintética de la suite (hoy sale `dudosa` con limitación y va a `elige_letra`): llega a `lista_para_revisar` con `eleccion.sin_comprobar: true`, `busqueda.resultado: 'elegida'`, sin `desfase_ms` y con los fines prudentes puestos;
  - las pruebas que hoy esperan `elige_letra` por `duda` con un único candidato con limitación se actualizan a la regla nueva, diciendo cuáles en la nota de implementación. Las de `no_coincide`, solo texto y duración siguen igual.
- Unitarias (`resumen.test.ts` o equivalente): `eleccionSinComprobar` es verdadera con `por: 'app'` y `sin_comprobar`, y falsa con `por: 'usuario'` o sin el campo. Un registro de 0.2.2 sin el campo se lee.
- `scripts/calibrar-encaje.test.ts`: la línea nueva sale con las cifras de las canciones de la fixture.
- E2E: ninguna nueva en esta tarea (las de la interfaz van con 0395). Si alguna spec E2E de la preparación espera hoy «Elige la letra» con una letra de la semilla que ahora se elige sola, se actualiza y se dice cuál.
- Críticos: no.
- Manual: guía de la feature 5 de 0.2.2, caso 1, en Windows con canciones nuevas de YouTube. Se anotan cuántas llegan solas, cuántas «sin comprobar» y si alguna eligió una letra de otra versión.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
- `main/preparacion/eleccion.ts`: rama «elegibles sin comprobar» (`sinComprobar`, `limitacion`); `shared/cancion.ts`: `eleccion.sin_comprobar`; `shared/ipc.ts` + `main/biblioteca/resumen.ts`: `eleccionSinComprobar`; `preparacion/servicio.ts` `pasoComprobar`: escribe la marca y registra «letra elegida sin comprobar (limitacion=…)»; nunca pasa `desfase_ms`.
- `scripts/calibrar-encaje.ts`: línea «Elección sin comprobar» y campo `sinComprobar` en el resultado (sirve para `--json`).
- Pruebas: `eleccion.test.ts`, `preparacion/servicio.test.ts` (candidato sin fines → `lista_para_revisar` con `sin_comprobar`, sin `desfase_ms`, fines puestos), `biblioteca/resumen.test.ts`, `scripts/calibrar-encaje.test.ts`.
- Prueba existente actualizada: «guarda el motivo de la no elección» ya no tiene el caso `duda` (una letra sin fines con un único candidato ahora se elige sin comprobar).
- Sin E2E nuevos; las specs de preparación inyectan registros y no pasan por `elegirLetra`.
