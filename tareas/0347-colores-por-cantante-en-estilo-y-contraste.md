# 0347 — Feature 1 · Estilo: colores por cantante, avisos de contraste y paleta predeterminada
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0340
- ADRs: 0029 §4, 0022 §4–§5, 0016
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1, panel Estilo) y docs/ux/sistema-visual.md (0.2.3)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Elegir el color de cada ranura en el tema y avisar de contrastes malos.

## Criterios de aceptación
- [ ] Sección «Cantantes y coros» del panel Estilo según la spec: plegada sin reparto; con reparto, un selector por parte en uso (Cantante 1 enlaza a «Color de lo ya cantado») y el resto bajo «Más colores»; en D1 y D4, el resumen sin «Cambiar solo en esta canción».
- [ ] Control de `estilo.pantalla.zonas` («Cada voz en su espacio» / «Todas en el mismo bloque», o lo que diga la spec) en la sección «Letra en pantalla» o «Cantantes y coros» del panel Estilo.
- [ ] `colores_partes` se guarda en el tema o en la canción con la herencia de siempre (ADR 0016) y con un paso de estilo.
- [ ] `evaluarContraste` con las reglas de ADR 0029 §4 solo para partes en uso (⚠ frente al fondo y a la letra, ⓘ entre partes con `confusionDaltonismo(a, b)`).
- [ ] Comprobación de `COLORES_PARTES_PREDETERMINADOS` contra los fondos de los temas incluidos; si alguno falla, propuesta de cambio al diseñador y nota en el ADR 0029.

## Pruebas de feedback
- Unitarias: `contraste.test.ts` (cada regla, solo partes en uso), `temas.test.ts` (herencia y congelación con `colores_partes`).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
