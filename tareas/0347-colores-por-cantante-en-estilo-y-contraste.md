# 0347 — Feature 1 · Estilo: «Colores de los cantantes» y avisos de contraste por parte
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0340
- ADRs: 0029 §4, 0022 §4–§5, 0016
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Panel Estilo › «Colores de los cantantes» y Aviso de contraste) y docs/ux/sistema-visual.md#023--varios-cantantes-y-coros
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Elegir el color de cada ranura en el tema y avisar de contrastes malos.

## Criterios de aceptación
- [x] Subsección «Colores de los cantantes» en D1–D4 según la spec (Cantante 1 como enlace, «Más colores», plegada en D3 sin reparto, resumen en D1/D4); cada cambio es un paso de estilo y se ve en < 100 ms (C1-E17).
- [x] `colores_partes` con la herencia de temas; un tema sin el campo usa los predeterminados y no se reescribe (C1-E18).
- [x] `evaluarContraste` con las tres comprobaciones del sistema visual solo para partes en uso, «Sugerir un color» (el sugerido de mayor contraste que no se parezca a otra parte en uso) y el ⓘ sin punto en la pestaña (C1-E19).
- [x] Con los predeterminados y el tema «Shinobi» no hay ningún ⚠; si lo hubiera, propuesta al diseñador y nota en ADR 0029.

## Pruebas de feedback
- Unitarias: `contraste.test.ts` (cada regla, solo partes en uso, sugerencia), `temas.test.ts` (herencia y congelación con `colores_partes`).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.**
- `karaoke/contraste.ts`: `evaluarPartes(estilo, partes)` (las tres comprobaciones del sistema visual solo para las partes dadas: color frente al fondo, frente a la letra con ΔE y daltonismo, y entre partes), `sugerirColorParte` («Sugerir un color»: de `SUGERIDOS_LETRA`, visible ≥ 3:1 y ΔE ≥ 25 respecto a la letra y a las otras partes en uso) y `evaluarContraste(estilo, partesEnUso?)`, que añade `partes` y un marcador `'parte'` en `avisos` si hay algún ⚠ (enciende el punto de la pestaña; los ⓘ no).
- Panel Estilo: `estilo/SeccionColoresPartes.tsx` (+ `ChipParte`, `textosPartes`, `coloresPartes.module.css`, `partesEnUso`), dentro de «Letra» tras el subrayado: Cantante 1 como enlace que lleva el foco al selector de «Color de lo ya cantado», una fila por parte en uso, «Más colores (…)» plegable, solo Coro con un cantante y coros, nada sin reparto salvo plegada en D3 con [Mostrar], y resumen de solo lectura en D1/D4. Cada cambio es un `alCambiar` de estilo (un paso). Los avisos por parte se pintan en el bloque de contraste (⚠ con «Sugerir un color» y «Subrayar lo ya cantado»; ⓘ entre partes sin acciones).
- `Editor.tsx` (3 líneas, lote del editor avisado en el informe): `evaluarContraste(estilo, partesEnUso(letra))`, `letra` a `PanelEstilo` y `a !== 'parte'` en `avisosPestana`.
- Herencia: `colores_partes` viaja con el `estilo.letra` (ya lo cubría 0340); test nuevo en `temas.test.ts`.

**Criterios.** C1-E17 cumplido (resumen en D1/D4, plegado en D3, fila por parte, < 100 ms porque la vista previa lee el mismo estilo). C1-E18 cumplido (abrir no escribe; herencia y comparación de efectivos con test). C1-E19 cumplido. El cian original `#4ADEDE` daba un ⚠ de daltonismo frente a la letra blanca (ΔE simulado 16,5); el diseñador respondió la pregunta [0345](../preguntas/0345-cian-predeterminado-del-cantante-2-avisa-con-daltonismo-frente-a-la-letra.md) con `#35C6E8` y `COLORES_PARTES_PREDETERMINADOS.c2` ya lo usa: 5,63:1 con el fondo, ΔE 46,0 con la letra, ΔE simulado 31,9, y ningún ⚠ con los predeterminados y «Shinobi» (solo ⓘ entre partes: Cantante 1 con 4 y con Coro, Cantante 2 con Todos y Cantante 4 con Coro). Falta la nota en ADR 0029 §4 (del arquitecto).

**Cómo probarlo.** `npx vitest run src/renderer/src/karaoke/contraste.test.ts src/renderer/src/vistas/editor/PanelEstilo.partes.test.tsx src/shared/temas.test.ts`.

**Para 0363 (Varias voces).** La sección vive en `estilo/` junto a `SeccionPantalla`; `PanelEstilo` recibe ahora `letra?` (partes y líneas) y la subsección «Colores» va dentro de «Letra», así que «Varias voces» no choca. Usa `partesEnUso(letra)` para saber si hay reparto (en D3 siempre se muestra).

**Verificación a mano.** El enlace «= Color de lo ya cantado ↑» y «Más colores» con teclado; ancho del panel a 300 px (sin scroll horizontal, C1-E23); chips con borde de 2 px en el color de la parte.

**Deuda.** `estilo/ChipParte.tsx` duplica en pequeño el `ChipParte` del lote del editor (otra firma): unificar cuando ambos estén integrados. Sin captura propia (`estilo-colores` y `aviso-parte` son de 0349).
