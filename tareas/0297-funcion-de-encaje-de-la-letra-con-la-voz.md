# 0297 — Feature 4 · `shared/encaje.ts`
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0296
- ADRs: 0024 §1
- Spec UX: docs/ux/05-letra.md (0.2.2 · Feature 4)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura de comprobación y desfase global.

## Criterios de aceptación
- [ ] `evaluarEncaje` con los cinco veredictos, `lineasSinVoz`, `tramosVozSinLetra`, `desfaseVariable` y `PARAMETROS_ENCAJE` de ADR 0024.
- [ ] Sumas prefijas: < 10 ms para 4 min; determinista.
- [ ] Corrección y «Quitar la corrección» como funciones puras sobre `offset_ms` y `desfase_corregido_ms`.

## Pruebas de feedback
- Unitarias: `encaje.test.ts` con picos sintéticos (casos de ADR 0024 §5).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**: `shared/encaje.ts` (exportado desde `shared/index.ts`): `PARAMETROS_ENCAJE` (tal cual ADR 0024), `evaluarEncaje(letra, voz, { duracionMs })` (cinco veredictos, `lineasSinVoz`, `tramosVozSinLetra`, `desfaseVariable`, `f0/i0/fDesfase/iDesfase`), `evaluarEncajeConPicos` (atajo con `detectarVoz`), `corregirDesfase` (suma a `offset_ms`, 10 ms, ±30 s, acumula `desfase_corregido_ms` con lo realmente aplicado) y `quitarCorreccion`. Sumas prefijas sobre bloques de 10 ms; ninguna línea sale del audio (rango de d acotado). Si |d*| >= 500 ms y no se cumple la regla de corrección (ganancia < 0,02 o I peor), el veredicto es el de d = 0; si el desfase es variable, `no_coincide`.
**Archivos**: `app/src/shared/encaje.ts`, `encaje.test.ts` (17 pruebas con picos sintéticos y texto inventado: coincide, ±0,8 y ±3 s recuperado a ±20 ms, <0,5 s sin corrección, otra versión, desfase variable, `no_comprobable`, curva plana, límite de audio, límite de ±30 s, quitar la corrección, determinismo, 4 min).
**Probar**: `npx vitest run src/shared/encaje.test.ts`.
**Pendiente (canciones reales)**: no se pudo repetir la calibración del ADR (10/10 propias, 0/90 ajenas, canción rápida sin corrección); se usan las constantes ya calibradas. Verificar a mano con la biblioteca real. El rendimiento «< 10 ms para 4 min» se comprueba en la prueba con margen de 100 ms (CI); medida local aparte no registrada.
**Deuda**: `intacta` no se retira desde aquí (lo hace `retirarCamposObsoletos`); el editor (0299) debe guardar con `guardarTiempos` el nuevo `offset_ms` y tendrá que escribir `desfase_corregido_ms` (aún sin canal de escritura: ver aviso para 0299/0300).
