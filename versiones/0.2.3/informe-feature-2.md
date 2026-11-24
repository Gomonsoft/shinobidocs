# Informe de la feature 2 · Voz en los coros (0.2.3)

- Tarea: [0354](../../tareas/0354-verificacion-e-informe-de-la-feature-2-de-0-2-3.md) · ADR [0030](../../adr/0030-voz-original-en-las-lineas-de-coro.md) · Specs: [06](../../ux/06-editor.md#023--feature-2--voz-en-los-coros), [07](../../ux/07-reproductor.md#023--feature-2--voz-en-los-coros), [10](../../ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video)
- Verificación de QA: 2026-11-23, Mac M1, HEAD `d50facd` (misma build y mismas cifras globales que el [informe de la feature 1](informe-feature-1.md#cifras-medidas-por-qa)).
- Revisión del diseñador: [revisión](../../ux/revisiones/0.2.3-feature-2/revision.md) (dos correcciones que bloqueaban; las capturas están regeneradas en el último commit, sin revisar todavía).

## Veredicto: **lista con reservas**

La mezcla es la correcta en las medidas que se pueden hacer sin oído. **Nada de lo que decide el oído se ha comprobado**: chasquidos en las rampas, mezcla en 3 canciones reales, voz guía silenciada y al 30 %, memoria con 10 minutos (cifras solo calculadas), video en un reproductor externo. Todo eso está en la [guía manual](../../Test-manuales/0.2.3/feature-2-voz-en-los-coros.md) y es el criterio de «hecha» de la feature (backlog), de modo que **no está hecha hasta que alguien la ejecute**.

## Medidas propias

| Qué | Resultado |
|---|---|
| Mezcla de la exportación (`mezclar` del worker, pistas sintéticas: instrumental en silencio, voz = tono de 1 kHz) con la envolvente de `shared/coros.ts` al 50 % | **−6,02 dB** exactos respecto a la voz en el centro del coro (esperado −6,02; la spec pide ± 1 dB); amplitud **0** a más de 450 ms antes y después del tramo |
| Rampas de la exportación (150 ms, lineales) | el salto máximo de una muestra a otra en todo el audio es **la mitad** que el de la voz original al 100 % (cociente 0,50): la rampa no crea discontinuidad. No sustituye al oído |
| Mezcla sin envolvente | hash idéntico al de 0.2.2 (0, −3,5 y +6 dB, con y sin voz) |
| Tramos (`tramosCoro`) | huecos de 400, 800, 1 200 y 1 400 ms entre el fin de un coro y el inicio del siguiente dan **un solo tramo**; 1 600 y 2 000 ms, dos (ver observación) |
| pytest del worker | 400 pasan; 7 pruebas nuevas de envolvente (`test_exportar.py`), una de extremo a extremo |
| Vitest | `coros.test` 10, `motorAudio.coros.test` 12 (entre ellas C2-E3, E4 y E6), `mezclaCoros.test` 5, `servicio.test` de exportación con coros (en la ejecución 45234965863 del CI de Windows falló por un defecto de la prueba, ya corregido) |
| E2E | «el deslizador “Voz en los coros” guarda el nivel de la canción» pasa (2 pasadas). No hay E2E del video con coros |

## Veredicto por criterio

| Criterio | Veredicto | Evidencia |
|---|---|---|
| C2-E1 sección solo con coros, 50 % por defecto, no escribe al abrir | Cumple | Vitest y E2E del deslizador |
| C2-E2 deslizador de 5 en 5, ráfaga = un paso | Cumple | Vitest; E2E |
| C2-E3 mezcla derivada (± 1 dB y 450 ms) | Cumple | `motorAudio.coros.test`; la medida equivalente de la exportación, arriba |
| C2-E4 bucle y velocidades con la derivada | Cumple (Vitest) | `motorAudio.coros.test` «C2-E4» |
| C2-E5 «Escuchar un coro» | Cumple (Vitest) | de 2 s antes a 1 s después; sin voz: inactivo con su texto |
| C2-E6 rehacer a los 300 ms, «Preparando…» a los 500 ms, fallo | Cumple (Vitest) | 4 pruebas del motor; «Preparando…» en pantalla: captura regenerada, sin revisar |
| C2-E7 teclado y `aria-valuetext` | Cumple (Vitest) | |
| C2-E8 capturas | **Pendiente de revisión** | las tres existen y la sección se ve entera según el programador; el diseñador no las ha vuelto a ver |
| C2-R1…R6 reproductor y secundaria | Cumple (Vitest) | `motorReproductor.test`, `Reproductor.test`; el oído y la secundaria real: guía 2 y 3 |
| C2-V1…V6 exportación | Cumple (Vitest y pytest) | casilla marcada con «Solo instrumental» y coros, sin casilla con «Instrumental y voz», lote con k canciones, `exp.audio.coros`; el video real: guía 5 |
| C2-V7 capturas de exportación | **No comprobado** | no hay `exportacion-…-coros-*.png` en `0.2.3-feature-2/` (solo las tres del editor) |
| Memoria del editor (4 y 10 min) | **No medido** | cifras calculadas por el programador (≈ 92 y ≈ 230 MB de la pista derivada); guía 4 |
| Chasquidos «en 3 canciones reales» | **No comprobado** | guía 1, 2 y 5 |
| Constantes de `coros.ts` (150/300/1000/150 ms) | Sin cambios | provisionales; si la guía pide otras, nota en el ADR 0030 |

## Observaciones

- **Ambigüedad de la spec, sin cambiar nada**: C2-R2 dice «líneas de coro separadas por 800 ms forman un solo tramo; separadas por 1,2 s, dos». En el código `CORO_UNIR_MS = 1000` se aplica a los **tramos** (que ya llevan +150 ms antes y +300 ms después), y el test lo dice (`coros.test`: «huecos entre tramos de 800 y 1 200 ms»). Medido: dos líneas con **1,2 o 1,4 s** de silencio entre ellas se fusionan en un tramo y la voz original suena también en ese hueco (donde, si canta la voz principal, se oirá). Con 1,6 s ya son dos. Es lo que dice el ADR; hay que decidir si la spec debe hablar de tramos. No es una pregunta bloqueante.
- El E2E del video con coros no existe: la parte visible (casilla) y la mezcla están en Vitest/pytest y la parte audible es manual.
- `exportacion.coros` (la casilla) queda en `true` por defecto en la configuración; sin coros no aparece ni cambia el audio (medido con la semilla: mismo `mezclar` y mismo plan).

## Pasa a la guía manual

[Guía de la feature 2](../../Test-manuales/0.2.3/feature-2-voz-en-los-coros.md): chasquidos con 3 canciones (0, 50 y 100 % en el editor; voz guía silenciada y al 30 % en el reproductor), ventana secundaria con dos niveles, memoria con 4 y 10 minutos, video con y sin la casilla en un reproductor externo.
