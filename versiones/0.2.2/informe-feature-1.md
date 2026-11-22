# Informe de la feature 1 de 0.2.2 · Letra en pantalla con varias líneas

Tareas: [0287](../../tareas/0287-esquema-de-letra-en-pantalla-y-reemplazo-por-cancion.md) a [0292](../../tareas/0292-verificacion-e-informe-de-la-feature-1.md). Decisión: [ADR 0022](../../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md). Specs: [07 · Feature 1](../../ux/07-reproductor.md), [06 · Feature 1](../../ux/06-editor.md).

**Veredicto: hecha con reservas.** Todo se ejecutó el 2026-11-22 en un Mac M1 (macOS, Node 24, pantalla Retina) sobre `version-0.2.2`, con el árbol limpio. El CI de GitHub no se ha consultado (no hay PR borrador de la feature): consta como pendiente. Reservas: (1) las capturas F1-R25 y F1-E16 están tomadas pero **aún no las ha revisado el diseñador** (criterio del backlog); (2) cinco criterios del editor solo tienen cobertura parcial o ninguna (lista abajo); (3) fluidez, 4:3 con 7 líneas, 24/60 FPS y equipo modesto son solo manuales.

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` | Limpio |
| `npm run lint` | Limpio |
| `npm run format:check` | Limpio |
| `npx vitest run` (toda la suite, sola, sin carga) | 274 archivos pasan (1 omitido); **3749 pasan**, 13 omitidas, 0 fallan |
| `npm run test:e2e:criticos` | **1 de 1 pasa** (14 s) |
| `npx playwright test` (toda la regresión local, sin `test:cambios` porque el árbol está limpio) | **203 pasan, 43 omitidas (opt-in y red), 1 falla**: `ventana.spec.ts` (de entorno, ver abajo) |
| Vitest de la feature (`shared/pantalla`, `estilo`, `temas`, `main/biblioteca/escritura`, `karaoke/`, `editor/estilo/`, `estado.apariencia`, `Editor.temas`) | 27 archivos, **364 pasan** |
| `exportacion.spec.ts`, `fase5.spec.ts`, `reproductor.spec.ts`, `temas-editor.spec.ts` (juntas) | 32 pasan, 4 omitidas, 1 falla en una ejecución y 5 de 5 en solitario: `reproductor.spec.ts:252` (intermitente bajo carga, ver [pruebas.md](../../pruebas.md)); en la regresión completa pasó |

Fallos de la regresión local y clasificación (detalle en [pruebas.md](../../pruebas.md), «Fallos conocidos clasificados»):

- `ventana.spec.ts`: **de entorno** (macOS Retina: `devicePixelRatio` = 2 y el alto del contenido queda limitado por la pantalla). No toca nada de 0.2.2 (`main/index.ts` no cambia el tamaño de ventana respecto a v0.2.1).
- `editor.spec.ts:410` (marcadores): **intermitente de la prueba**. 1 fallo en unas 45 ejecuciones; ver el informe de la feature 4 (§ «Intermitente del arrastre»).

## Criterios de la spec → evidencia

Evidencia «Vitest» = prueba cuyo nombre o notas de 0288–0291 la citan y que pasa hoy; no he reabierto cada aserción.

| Criterio | Evidencia |
|---|---|
| F1-R1, R2, R6–R10, R12–R16, R20 | Vitest `karaoke/render.test.ts` (modelo) |
| F1-R3, R4, R11, R18, R19 | Vitest `karaoke/pantalla.test.ts` |
| F1-R5 | Vitest `estilo.test.ts` (leer no escribe) y E2E `temas-migracion` (archivos sin reescribir, pasa). Con 5 líneas por defecto: `normalizarEstilo` comprobado además con una canción real de 0.2.1 (ver «Compatibilidad») |
| F1-R17 | **Parcial**: Vitest `PantallaLetra.test.tsx` (reducción por longitud estable por nodo); jsdom no mide renglones. Cortes iguales a 16:9 y 4:3: guía manual |
| F1-R21, R22 | Vitest `PantallaLetra.test.tsx` |
| F1-R23 | Vitest `PantallaLetra.test.tsx` (instante fijo = reproductor, en «Desplazamiento» y «Fundido») y E2E `exportacion.spec.ts` (5 líneas; a mitad del cambio la imagen cambia más que en reposo) |
| F1-R24 | Vitest `contraste.test.ts` |
| F1-R25 | **17 capturas tomadas** (8 estados × 2 tamaños + `cuatro-tercios-siete-lineas` a 1440 × 1080). Pendiente de revisión del diseñador |
| F1-E1, E3, E4, E5, E12 | Vitest `SeccionPantalla.test.tsx` |
| F1-E6, E7 | **Parcial**: Vitest `usePantalla.test.ts` y `ejemploPantalla.test.ts` (reproduce el ejemplo, 12,5 s, tres relevos); Esc, anuncios y que no añada pasos de historial solo por lectura de código |
| F1-E8, E10 | Vitest `usePantalla.test.ts`, `temas.test.ts`, `escritura.test.ts` (parte de main) |
| F1-E9 | **Parcial**: D3 en Vitest; el cambio en las canciones que usan el tema, no en integración |
| F1-E2 | **Parcial**: no se despacha nada al montar; no hay comparación del archivo antes y después |
| F1-E11 | **Parcial**: `fotogramaEstatico` en Vitest; vista en la captura `previa-pausa-siete` |
| F1-E13 (anchos 300/360/480) | **Sin cubrir** con prueba; solo la captura `pantalla-300px` y la guía |
| F1-E14 (teclado) | **Parcial**: roles y `aria-disabled` en Vitest; operación completa con teclado: guía |
| F1-E15 (Probar a pantalla completa = vista previa) | **Sin cubrir** con prueba (el código usa el mismo `estiloPrevia`, `Editor.tsx:575-583`); guía |
| F1-E16 | **16 capturas tomadas** (8 estados × 2 escalas) |

Recuento: R1–R24 = 23 con prueba + 1 parcial (R17); R25 capturas. E1–E15 = 7 con prueba, 6 parciales (E2, E6, E7, E9, E11, E14) y 2 sin cubrir (E13, E15); E16 capturas. Sin cubrir con ninguna evidencia automática ni captura: **F1-E13 y F1-E15** (pasan a la guía).

## Compatibilidad con 0.2.1 (backlog: «una biblioteca de 0.2.1 se ve con 5 líneas sin reescribir archivos y 0.2.1 sigue abriendo una canción de 0.2.2»)

- **0.2.2 abre 0.2.1 con 5 líneas sin reescribir**: `estilo.test.ts` y `temas.test.ts` (ningún campo nuevo se escribe al leer), E2E `temas-migracion.spec.ts` (archivos sin reescribir, pasa) y comprobación manual-automática de esta tarea: la canción 1 de la semilla (sin bloque `pantalla`) se lee con el esquema actual y `normalizarEstilo` da `{lineas:5, pasadas:1, transicion:'desplazamiento'}`, sin escribir.
- **0.2.1 abre 0.2.2**: `temas.test.ts` lo prueba con una **copia congelada** del esquema de apariencia (no con el código real de 0.2.1). Para no depender de esa copia, esta tarea extrajo `app/src/shared` de la etiqueta `v0.2.1` y parseó con su `cancionSchema` una canción de 0.2.2 con **todos** los campos nuevos de las features 1, 2 y 4 (`pantalla` con `zonas`, `subrayar_cantado`, `colores_partes`, `reemplazo_pantalla`, `intacta`, `desfase_corregido_ms`, `idioma`, `origen_fin`, `revisada`, `parte`): **la lee sin error y descarta los campos nuevos**. Script de un solo uso, no queda en el repositorio. Falta, y va a la guía, abrir de verdad una compilación 0.2.1 sobre una biblioteca de 0.2.2.

## Defectos

Ninguno nuevo en código de producción en esta feature. Observaciones para el diseñador (no defectos): en `reproductor-1920x1080-pausa-larga-indicadores.png` los puntos de espera quedan muy pegados a la línea +1 (unos 50 px entre centros).

## Capturas

`docs/ux/revisiones/0.2.2-feature-1/`: 17 de reproductor (`reproductor-{ancho}x{alto}-{estado}.png`) y 16 de editor (`editor-1280x720-{100|125}-{estado}.png`). Las genera `app/e2e/capturas-022.spec.ts` (opt-in, `SHINOBI_CAPTURAS_022_1=1`) sobre la semilla con letras inventadas; el viewport exacto se fija con CDP porque macOS limita el alto de la ventana a la pantalla (757 px en este equipo).

## Lo que pasa a la guía manual

[`feature-1-letra-en-pantalla.md`](../../Test-manuales/0.2.2/feature-1-letra-en-pantalla.md): legibilidad a 5 m, fluidez (equipo modesto y secundaria con fondo en movimiento), 4:3 con 7 líneas, video a 24 y 60 FPS frente al reproductor, mareo/movimiento reducido real, F1-E13, E14, E15 y abrir 0.2.2 → 0.2.1.

## Archivos tocados en esta tarea

`app/e2e/capturas-022.spec.ts` (nuevo), `docs/pruebas.md`, la guía y su índice, este informe, las preguntas 0205–0209 y la tarea 0292. Ningún código de producción.
