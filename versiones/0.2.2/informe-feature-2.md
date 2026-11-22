# Informe de la feature 2 de 0.2.2 · Subrayado de lo cantado y aviso de daltonismo

Tareas: [0293](../../tareas/0293-subrayado-de-lo-cantado.md), [0294](../../tareas/0294-aviso-de-daltonismo-y-controles-del-subrayado.md) y [0295](../../tareas/0295-verificacion-e-informe-de-la-feature-2.md). Decisión: [ADR 0022](../../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) §5. Specs: [07 · Feature 2](../../ux/07-reproductor.md), [06 · Feature 2](../../ux/06-editor.md), [08 · Feature 2](../../ux/08-ajustes-y-acerca.md).

**Veredicto: hecha con reservas.** Ejecutado el 2026-11-22 en un Mac M1 sobre `version-0.2.2`; el CI no se ha consultado (sin PR borrador). Reservas: (1) **defecto visual** hallado en las capturas: la línea ya cantada muestra una línea oscura bajo cada renglón con el subrayado activo, contra F2-R5 (pregunta [0205](../../preguntas/0205-subrayado-de-lo-ya-cantado-deja-una-linea-oscura-bajo-la-ya-cantada.md)); (2) capturas sin revisar por el diseñador; (3) simulador de daltonismo y «ningún tema incluido avisa» solo manuales.

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` | Limpio |
| `npm run lint` | Limpio |
| `npm run format:check` | Limpio |
| `npx vitest run` (toda la suite, sola, sin carga) | 274 archivos pasan (1 omitido); **3749 pasan**, 13 omitidas, 0 fallan |
| `npm run test:e2e:criticos` | **1 de 1 pasa** (14 s) |
| `npx playwright test` (toda la regresión local) | **203 pasan, 43 omitidas, 1 falla**: `ventana.spec.ts` (de entorno: Retina, DPR 2) |
| Vitest de la feature (`contraste`, `barrido`, `PantallaLetra`, `PanelEstilo`, `ReproductorAjustes`, `estilo`, `main/sesion/servicio`) | 7 archivos, **143 pasan** |

La feature no tiene spec E2E propia (la tarea 0295 no la pide); las `fase5.spec.ts` y `editor.spec.ts` que 0293 ajustó pasan en la regresión completa.

## Criterios → evidencia

| Criterio | Evidencia |
|---|---|
| F2-R1, R2 | Vitest `barrido.test.ts` y `PantallaLetra.test.tsx` (recorte y ancho) |
| F2-R3 | **Parcial**: tramo por palabra en Vitest; el espacio entre palabras no se subraya por construcción (pregunta [0215](../../preguntas/0215-espacio-entre-palabras-en-el-subrayado.md), opción conservadora); sin prueba de píxel |
| F2-R4 | Vitest `PantallaLetra.test.tsx` (geometría igual con y sin subrayado) |
| F2-R5 | **Sin prueba y con defecto**: no hay prueba del color de la decoración (jsdom no calcula `color-mix`); la captura `subrayado-dos-renglones` muestra la línea oscura bajo la ya cantada |
| F2-R6 | Vitest `PantallaLetra.test.tsx:712` (nunca en Letra lista) |
| F2-R7 | **Sin prueba** (solo CSS, `pantallaLetra.module.css:159-163`); captura `subrayado-barra-espera` |
| F2-R8 | Vitest `main/sesion/servicio.test.ts` (secundaria) y `ReproductorAjustes.test.tsx`; reproductor local por código (`ReproductorBiblioteca.tsx:103-106`) sin prueba E2E. El video solo usa el estilo: la exportación no pasa la prop `subrayado` (por código) |
| F2-R9 | **4 capturas tomadas** |
| F2-E1, E5, E7, E8, E9 | Vitest `PanelEstilo.test.tsx` y `contraste.test.ts` (E5 y E7 con los pares de la spec; E8 sugerencia sin confusión; E9 nota «solo editor») |
| F2-E6 | Vitest `PanelEstilo.test.tsx` (aviso y acción) |
| F2-E2, E3, E4, E10 | **Sin prueba propia** (E4 y E10 «por código», lo dice la nota de 0294; E3 usa el mecanismo de temas ya probado en F1); guía |
| F2-E11 | **5 capturas tomadas** |
| F2-A1, A2, A3 | Vitest `ReproductorAjustes.test.tsx` (A2: persistir al reiniciar y que `cancion.json` no cambie no está en E2E) |
| F2-A4 | **1 captura tomada** |

Recuento (24 criterios: R1–R9, E1–E11, A1–A4): **13 con prueba** (R1, R2, R4, R6, R8, E1, E5, E6, E7, E8, E9, A1, A3), **2 parciales** (R3, A2), **3 solo capturas** (R9, E11, A4) y **6 sin cubrir por prueba**: R5 (con defecto), R7, E2, E3, E4, E10; pasan a la guía.

## Defectos

- **D1 · Subrayado fantasma en la ya cantada** (`app/src/renderer/src/karaoke/pantallaLetra.module.css:147-157`, sombra heredada de `:12`). Gravedad media (visible a 5 m, contradice F2-R5). Pregunta 0205.
- Observación: en la captura `aviso-daltonismo` salen además dos avisos de contraste de la combinación rojo sobre verde oscuro; es normal con esos colores, pero conviene que el diseñador lo sepa al revisar F2-E11.

## Capturas

`docs/ux/revisiones/0.2.2-feature-2/`: 4 de reproductor, 5 de editor y 1 de Ajustes. Generador: `app/e2e/capturas-022.spec.ts` (`SHINOBI_CAPTURAS_022_2=1`).

## Guía manual

[`feature-2-subrayado-y-daltonismo.md`](../../Test-manuales/0.2.2/feature-2-subrayado-y-daltonismo.md): simulador de daltonismo, ningún tema incluido avisa, subrayado a 5 m, segunda pantalla y Ajustes.

## Archivos tocados

`app/e2e/capturas-022.spec.ts`, `docs/pruebas.md`, guía e índice, este informe, preguntas 0205–0209 y la tarea 0295. Ningún código de producción.
