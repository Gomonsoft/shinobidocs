# 0293 — Feature 2 · Subrayado de lo ya cantado: datos, resolución y render
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0290
- ADRs: 0022 §5
- Spec UX: docs/ux/07-reproductor.md, docs/ux/10-exportacion.md y docs/ux/sistema-visual.md (0.2.2 · Feature 2)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Dibujar el subrayado en la capa de resaltado y resolver cuándo se ve.

## Criterios de aceptación
- [x] `estilo.letra.subrayar_cantado` y `config.reproductor.subrayar_cantado` (tolerantes); resolución en reproductor local, sesión (main) y exportación (solo el estilo).
- [x] `PantallaLetra` con `subrayado`; `recorteBarrido(…, { margenInferior })`; opacidad `1 − mezclaGris` al salir; barra de espera con pista al 35 %.
- [x] F2-R1 a R8 cubiertos.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [x] Test: el subrayado toma el color del nodo de su línea (sale del ajuste de color por línea de la 0290).

## Pruebas de feedback
- Unitarias: `barrido.test.ts`, `PantallaLetra.test.tsx` (anchos medidos, palabra a palabra, cajas iguales con y sin subrayado, Letra lista sin subrayado), resolución en la sesión.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecho:
- `shared/estilo.ts`: `letra.subrayar_cantado` opcional y tolerante (ilegible = ausente; no se escribe al leer) y `conSubrayadoDelEquipo(estilo, preferencia)`. `config.reproductor.subrayar_cantado` ya existía (lote A).
- Resolución: reproductor local en `ReproductorBiblioteca` (`useMemo`, el estilo es dependencia del bucle de pintado); sesión en main (`servicio.ts`: `estiloVisible` al revalidar/cargar la entrada y al proyectar la candidata); exportación sin cambios (solo el estilo). La prueba desde el editor y la vista previa usan solo el estilo (el editor es del lote C): F2-R8 se cumple en el reproductor local y la secundaria.
- `PantallaLetra`: prop `subrayado?` (ausente = el del estilo; sin barrido nunca). Clase `.subrayado` en la raíz: decoración de la capa `.resaltado` (continua, `máx(2px, 0,07em)`, a 0,12em, `text-decoration-color` = color de la línea × `1 − --k-gris`), y barra con pista al 35 %. `recorteBarrido(…, { margenInferior })` (0,19 × cuerpo, sin pasar del renglón siguiente); la caja y la disposición no cambian.
- Preparación 0.2.3: el color del subrayado sale de `--k-resaltado-linea` del nodo (el mismo ajuste por línea de 0290).
- Pruebas: `barrido.test.ts`, `PantallaLetra.test.tsx` (clase, R4 sin cambios de geometría, R1 recorte y ancho igual, color por línea), `estilo.test.ts`, `servicio.test.ts` (F2-R8 sesión). Corregí además dos E2E que asumían una sola línea en pantalla (`fase5.spec.ts`, `editor.spec.ts`).
- Parcial: F2-R3 segunda mitad (el espacio entre palabras no se subraya): pregunta 0215, opción conservadora aplicada. F2-R5 (opacidad `1 − avance`) descansa en `--k-gris` ya probado en 0289; sin prueba propia del color de decoración (jsdom no calcula `color-mix`). F2-R9 capturas: diseñador.
Críticos: ver informe.
