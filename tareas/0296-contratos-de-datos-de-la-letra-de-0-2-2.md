# 0296 — Features 4, 5, 10 y 11 · Campos nuevos de la letra y reglas de main
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0339
- ADRs: 0024 §1 y §4, 0028 §3.3, 0021, 0006
- Spec UX: —
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Añadir los campos de la letra que usan varias features, con sus reglas de escritura en main, antes de que las features los necesiten.

## Criterios de aceptación
- [ ] `letra.intacta`, `letra.desfase_corregido_ms`, `letra.idioma`; por línea `origen_fin` (catálogo `letra|silencios|preparacion|alineacion`), `revisada { inicio_ms, fin_ms, texto }`, `alineacion { confianza }`; `origen_palabras` admite `auto`. Todos opcionales y tolerantes.
- [ ] Main: `intacta` al guardar una letra nueva y se retira con la primera escritura que cambie tiempos; `origen_fin` retirado si `fin_ms` es `null`; `revisada` y `alineacion` retiradas si cambian sus tiempos o el texto; `origen_fin: "letra"` al importar un fin de la letra.
- [ ] `letras.guardarTiempos` admite `origen_fin` y `revisada` por línea; `offset_ms` sigue escribiéndose ahí.
- [ ] `palabrasVisibles` incluye `auto` (no se produce aún ninguna).
- [ ] `shared/idioma.ts` con `detectarIdioma`; main lo pone al guardar una letra nueva.

## Pruebas de feedback
- Unitarias: `letra.test.ts` y tests del servicio de letras: cada regla de retirada, copia congelada del `elementoLetraSchema` de 0.2.1, `detectarIdioma` con textos inventados.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
