# 0290 — Feature 1 · `PantallaLetra` con varias líneas y cambios por tiempo
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0288, 0289
- ADRs: 0022, 0019, 0011, 0017
- Spec UX: docs/ux/07-reproductor.md, docs/ux/10-exportacion.md y docs/ux/sistema-visual.md (0.2.2 · Feature 1)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Pintar el nuevo modelo en reproductor, secundaria, vista previa y exportación sin volver a renderizar React por fotograma.

## Criterios de aceptación
- [ ] Montaje a tamaño `S`, medición estable de renglones (una vez por línea y tamaño), variables por nodo `--k-y`, `--k-escala`, `--k-opacidad`, `--k-gris`; `color-mix` para el gris.
- [ ] Copias del «Fundido» solo durante el cambio; indicadores en posiciones relativas al ancla y con `esperaAparicion`.
- [ ] Se retira la animación `.transicion` de la línea y su `data-nace-ms`; la cuenta conserva su mecanismo.
- [ ] La instantánea de sesión y la de exportación llevan el estilo resuelto con `pantalla`; la exportación pasa `movimiento: 'completo'`.
- [ ] F1-R17, R21, R22 y R23 cubiertos.

## Pruebas de feedback
- Unitarias: `PantallaLetra.test.tsx`: mismos cortes de renglón en todos los puestos (medición simulada), Letra lista sin color de resaltado, palabra a palabra igual que 0.2.1, modo fotograma.
- E2E: Una prueba en `exportacion.spec.ts`: 3 s a 640 × 480 con 5 líneas; el modelo del anfitrión a mitad de un cambio es igual a `fotogramaEn` (F1-R23).
- Críticos: sí (vista del flujo principal)
- Manual: Fluidez en un equipo modesto y en la secundaria con fondo en movimiento; si hay saltos, `will-change` solo durante el cambio.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
