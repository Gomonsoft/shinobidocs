# 0312 — Feature 5 · Verificación e informe
- Estado: En revisión (hecha con reservas: faltan criterios del usuario)
- Paso del pipeline: 3
- Depende de: 0306–0311, 0371–0374, 0377
- ADRs: 0025
- Spec UX: docs/ux/02, 04, 05, 06 y 08 (0.2.2 · Feature 5)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 5.

## Criterios de aceptación
- [ ] **(Pendiente del usuario)** Con la biblioteca del usuario: `npm run calibrar:encaje -- <carpeta> --variantes` (tarea 0371) y decisión sobre los fines prudentes con el criterio de la pregunta 0222, anotada en el informe y en ADR 0025. También el número de canciones que caen en «Elige la letra» en una preparación real.
- [x] Incluye F6-N7 y F6-N8 de la spec 03 (álbum desde LRCLIB y aviso de búsqueda automática en «Añadir canción»), que pasaron de la feature 6 (pregunta 0220).
- [ ] **(Pendiente del usuario)** Preparar los 5 borradores reales del usuario (guía, caso 3).
- [x] Informe `docs/versiones/0.2.2/informe-feature-5.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- Ejecutado por `qa` el 2026-11-22 sobre una copia limpia de `10496b8`. **Veredicto: hecha con reservas.** Informe: [informe-feature-5](../versiones/0.2.2/informe-feature-5.md); guía: [feature-5-preparacion-desatendida](../Test-manuales/0.2.2/feature-5-preparacion-desatendida.md).
- Hecho: cifras de typecheck, lint, format, Vitest (4084), pytest (351), build, E2E de la feature (47 de 47), críticos (2 de 2, uno nuevo), regresión completa (214 / 63 omitidas / 2 fallos: `ventana` y `letras:401` inestable); 46 criterios mapeados (43 cubiertos, 2 parciales, 1 sin cubrir: F5-B3); 17 capturas; F6-N7 y F6-N8 cubiertos.
- **Pendiente del usuario** (guía): red real, los 5 borradores, lote sin 429, interruptor apagado con monitor de red, TV, `calibrar:encaje` y la decisión sobre los fines prudentes (pregunta 0222). La tarea 0371 (`--variantes`) sigue pendiente; el criterio de calibración no se puede cerrar sin ella.
- Defectos y preguntas: 0240 (pruebas frágiles), 0241 (línea y diálogo sin registro, media), 0242 (toast sin revisión, progreso sin diálogo, recuento de Ajustes, notificación sin foco), 0243 (`HEAD` con el interruptor apagado), 0244 (diseño).
QA, 2026-11-22 (canciones reales del MVP): `calibrar:encaje --variantes` (0371, hecha) ejecutado con 18 canciones del MVP: criterio de adopción de los fines prudentes **NO se cumple** (propias prudentes 13/17 = 76 %, ajenas 6/9/18 de 272 en las tres variantes); se queda como está (pregunta 0277). Hallazgo: las letras anteriores a 0.2.2 no tienen `intacta` y `Preparar` no actúa sobre ellas (pregunta 0278). Parte local sin red comprobada (fines prudentes y recuento de dudosas coinciden con el script). Sigue pendiente del usuario: red real, 5 borradores, lote, monitor de red, TV y el número de canciones que caen en «Elige la letra». Ver [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md).
