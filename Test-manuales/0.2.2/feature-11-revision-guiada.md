# Guía manual · Feature 11 · Revisión guiada de líneas dudosas

> **No ejecutada todavía.** Recoge lo que las pruebas automáticas no pueden comprobar: la tasa de líneas señaladas en tus canciones ya revisadas (criterio de «hecha»), cuántos errores de verdad señala y cuántos no, el tiempo que ahorra y el recorrido solo con teclado. Las cifras de las pruebas automáticas están en el [informe](../../versiones/0.2.2/informe-feature-11.md).

- Versión: 0.2.2 · Feature 11
- Specs: [06 · Feature 11](../../ux/06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas) (F11-E), [02 · Biblioteca](../../ux/02-biblioteca.md) (F11-B) · ADR: [0024](../../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) · Tareas: [0334](../../tareas/0334-deteccion-de-lineas-dudosas.md), [0335](../../tareas/0335-modo-revisar-en-el-editor.md), [0336](../../tareas/0336-revision-guiada-desde-la-biblioteca.md), [0370](../../tareas/0370-retirar-origen-fin-al-editar-un-fin-a-mano.md), [0337](../../tareas/0337-verificacion-e-informe-de-la-feature-11.md)
- Duración estimada: 1 h 30 min.
- Requisitos:
  - Tu biblioteca real, con canciones **que ya diste por buenas** (Listas) y, si las tienes, «Semestre de Otoño» y «Cursiva la Letra».
  - Dos o tres borradores recién preparados por la app (guía de la feature 5, caso 3).
  - Cronómetro. Auriculares o altavoces. Una copia de la carpeta de datos antes de empezar.

## Casos

### 1. Calibración con tus canciones ya revisadas (criterio de «hecha»: ≤ 10 % señaladas)

> **Pendiente del usuario.** La biblioteca real no está en el equipo de pruebas. **No se marca como cumplido.**

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | `cd app && npm run calibrar:dudosas -- <carpeta de tu biblioteca>` (solo lectura; `--json` si quieres la salida entera). | Tabla por canción: líneas, señaladas, porcentaje, recuento por motivo y «supera el 10 %». Solo cifras: no escribe nada. | ☐ |
| 1.2 | Mira las canciones que **ya diste por buenas**. | Cada una señala **≤ 10 %** de sus líneas. Anota las que superan el 10 %: ____ de ____ y el motivo dominante de cada una. Si superan, los umbrales (`shared/dudosas.ts`, ADR 0024 §3) se ajustan con nota en el ADR. | ☐ |
| 1.3 | Para una que supere el 10 %, abre el editor y mira una línea señalada: ¿realmente está mal? | Anota: falsas alarmas ____ de ____. | ☐ |

### 2. Cuántas señala de verdad y cuántas se le escapan

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Toma 2 canciones recién preparadas. Abre cada una con **Revisar** y anota cuántas líneas señala (el título del panel dice «quedan n de n»). | n = ____ y ____ | ☐ |
| 2.2 | **Sin corregir nada**, canta cada una entera. Apunta las líneas que estaban mal de verdad. | Errores reales: ____ y ____; de ellos, **señalados**: ____ y ____; **no señalados**: ____ y ____ | ☐ |
| 2.3 | Compara. | Casi todo error real viene señalado; los no señalados son pocos. | ☐ |

### 3. Cronometrar la revisión frente a repasar la canción entera

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Cronometra una revisión guiada completa (**Revisar** hasta «Revisión terminada»). | Anota el tiempo: ____ | ☐ |
| 3.2 | Cronometra, en otra canción de duración parecida, repasar la sincronía escuchándola entera. | Anota el tiempo: ____. La guiada debe ser claramente más corta. | ☐ |

### 4. Una canción terminada a mano casi no señala nada

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Abre una canción Lista que sincronizaste tú, y en **Funciones** mira «Revisar la sincronía». | Pocas líneas por revisar o «No vemos nada raro en esta canción.». | ☐ |
| 4.2 | Dale «Está bien» a una línea, cierra el editor y vuelve a abrirlo. | La línea sigue dada por buena (no vuelve). Mueve su inicio 0,3 s: vuelve a evaluarse. | ☐ |
| 4.3 | Ctrl/Cmd + Z tras «Fin al final de la voz» en una línea. | El fin vuelve a donde estaba: es **un** paso de deshacer. | ☐ |

### 5. El recorrido completo sin ratón

Criterio: F11-E14.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Con el editor abierto, pulsa **R**. | Empieza el recorrido en la primera línea señalada; suena su tramo (de 0,5 s antes a 0,5 s después). | ☐ |
| 5.2 | **N** (Está bien), Ctrl/Cmd + ↓ / ↑, Mayús + L, P, I, O, Esc. | Todo se hace con teclado; cada línea se anuncia una vez con su texto y su motivo; el foco nunca se queda en la página. | ☐ |
| 5.3 | **Esc** con el recorrido activo. | Termina el recorrido sin salir del editor; Esc otra vez vuelve a la Biblioteca. | ☐ |
| 5.4 | Repite con un lector de pantalla. | El motivo de cada línea y «quedan n de n» se anuncian sin repetirse. | ☐ |
| 5.5 | Con «Escuchar cada línea al llegar» desmarcada, reinicia la app y vuelve a entrar. | La preferencia se conserva y no suena sola. | ☐ |

### 6. Marcar como lista con líneas pendientes

Criterio: F11-E12, F11-B3. La regla es la misma en el editor y en la Biblioteca.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | En un borrador con una línea con **voz tarde** o con **fin fijado** que corta la voz, pulsa «Marcar como lista» en el editor. | Aparece «¿Marcar como lista sin revisar?» con «Revisar ahora» enfocado; «Marcar igualmente» marca. | ☐ |
| 6.2 | Lo mismo desde el ⋯ de su tarjeta «Lista para revisar» en la Biblioteca. | Mismo diálogo con el mismo número de líneas importantes. «Marcar igualmente» la marca sin abrir el editor. | ☐ |
| 6.3 | Una canción cuyas pendientes son solo «muy corta», «muy larga» o fines automáticos. | Se marca sin preguntar, aunque la tarjeta diga «⚑ n líneas por revisar». | ☐ |
| 6.4 | **Una canción que sincronizaste tú a mano** y se quedó «Lista para revisar» (sin haber pasado por la preparación). | **Conocido** ([pregunta 0241](../../preguntas/0241-linea-y-dialogo-de-revision-no-existen-en-listas-para-revisar-sin-registro.md)): su tarjeta no tiene la línea ⚑ y marcar desde el ⋯ no pregunta, aunque el editor sí lo haría. Anota si te ocurre. | ☐ |
| 6.5 | «▶ Probar» una «Lista para revisar» desde la Biblioteca, sal y pulsa [Marcar como lista] del toast. | Pregunta si hay pendientes importantes. **Conocido**: desde la **vista de progreso** marca sin preguntar ([pregunta 0242](../../preguntas/0242-defectos-menores-de-la-feature-5-y-11-hallados-en-la-verificacion.md), punto 2). | ☐ |

### 7. Entrar por «Revisar» y lo que pasa solo

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 7.1 | Pulsa **Revisar** en una «Lista para revisar» **que hiciste tú a mano**. | Se abre el editor con el recorrido empezado y **suena sola** la primera línea señalada (preferencia por defecto), con un zoom a la línea. Anota si te resulta bien o molesto ([pregunta 0244](../../preguntas/0244-hallazgos-de-diseno-de-las-features-5-y-11-sin-especificar.md), punto 2). | ☐ |
| 7.2 | Pulsa el toast «está lista para revisar» [Revisar] al terminar una preparación. | **Conocido**: abre el editor sin el recorrido (pregunta 0242, punto 1). | ☐ |
| 7.3 | Deja 0 pendientes. | «Revisión terminada», «Probar a pantalla completa (F)»; en un borrador, «Marcar como lista» se resalta 2 s **sin marcar nada**. La canción no cambia de estado sola. | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
| | | | |
