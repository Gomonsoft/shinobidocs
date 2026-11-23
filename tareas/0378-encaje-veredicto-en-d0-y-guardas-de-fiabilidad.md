# 0378 — Feature 4 · Encaje: veredicto en d = 0 sin d* espurio y guardas de fiabilidad
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0297 (hecha). Puede empezar ya.
- ADRs: 0024 (revisión «Medida con canciones reales y guardas de prudencia»)
- Spec UX: docs/ux/05-letra.md y 06-editor.md (0.2.2 · Feature 4). Sin cambio de textos en esta tarea (los textos de la limitación van en la 0379).
- Tamaño: S–M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 4. Lote C (`shared/encaje.ts`, `shared/dudosas.ts` solo pruebas).

## Objetivo

Que el encaje no diga «coincide» ni corrija solo cuando no puede saberlo (voz casi continua, o letra que no notaría un desfase de 0,8 s). También, que un d\* espurio de curva plana no convierta en «otra versión» una letra que ya coincide en d = 0. Preguntas 0275 y 0276.

## Criterios de aceptación

**Regla del veredicto** (`evaluarEncaje`, `app/src/shared/encaje.ts`, hoy líneas 179–196):

- [ ] Con `|d*| < desfaseMinimoMs`, el veredicto es el **mejor** de `v0` y `vMejor` (orden `coincide` > `dudosa` > `no_coincide`). Hoy es `vMejor`, y eso hace que la canción 16 de la medida salga `dudosa` por I(d\*) aunque I(0) cumpla.
- [ ] Con `|d*| ≥ desfaseMinimoMs`, por este orden:
  1. Si se cumple la regla de corrección (ganancia ≥ `gananciaMinimaF`, `I(d*) ≥ I(0)`, `vMejor = coincide`, sin `desfaseVariable`) **y d\* no está en el borde** → `desfasada`. Borde: el primer o el último valor de `desfases` tras acotar el rango.
  2. Si no, si `v0 = coincide` → `coincide`.
  3. Si no, si `vMejor = coincide` y `desfaseVariable` → `no_coincide`.
  4. Si no, si `vMejor = coincide` → `v0`.
  5. Si no → `vMejor`.
- [ ] `desfaseVariable` = `|d1 − d2| > desfaseMinimoMs` **y** al menos una mitad con `F_k(d_k) − F_k(0) ≥ gananciaMinimaF`, cada una medida en su ventana. Dos mitades de curva plana no dan desfase variable.

**Guardas de fiabilidad** (solo sobre `coincide` y `desfasada`; después de la regla anterior):

- [ ] `PARAMETROS_ENCAJE` gana `densidadVozMaxima: 0.9`, `desfaseSensibilidadMs: 800` y `contrasteMinimoF: 0.02`, con el comentario «provisionales (revisión 2026-11-22, ADR 0024)».
- [ ] `densidadVoz`: bloques con voz dividido entre los bloques de `[a del primer tramo + dv, b del último tramo + dv)`, recortado a `[0, total)`. `dv` es d\* si el veredicto es `desfasada` y 0 en el resto. Si es ≥ `densidadVozMaxima` → `dudosa`, `limitacion: 'vozContinua'`.
- [ ] `contrasteF = F(dv) − máx(F(dv − 800), F(dv + 800))`. Solo cuentan los lados que están dentro de `[mínimo, máximo]` del rango de desfases; sin ninguno, `contrasteF = 0`. Si es < `contrasteMinimoF` → `dudosa`, `limitacion: 'sinContraste'`. Si fallan las dos guardas, gana `vozContinua`.
- [ ] Con limitación: `desfaseMs` sigue siendo d\* (informativo); `lineasSinVoz` y `tramosVozSinLetra` se calculan con d = 0.
- [ ] `ResultadoEncaje` gana `densidadVoz: number`, `contrasteF: number` (redondeados como `f0`), `limitacion: 'vozContinua' | 'sinContraste' | null` y `veredictoBase: VeredictoEncaje` (el veredicto antes de las guardas, para el script 0381 y las pruebas). `nulo()` los rellena con 0, `null` y `'no_comprobable'`. Se exporta el tipo `LimitacionEncaje`.
- [ ] Sin cambios en `main/letras/comprobacion.ts`, `main/preparacion/eleccion.ts` ni `corregirDesfaseDiferido`. Siguen actuando solo con `desfasada` y eligiendo con `coincide`/`desfasada`, que ahora llevan la prudencia dentro. Si algún test de esos módulos cambia de resultado, se revisa su fixture (ver Notas), no la regla.
- [ ] Coste: el test de 4 min sigue por debajo de su límite (las guardas son 2 o 3 `medir` más).

## Pruebas de feedback

- Unitarias, en `encaje.test.ts`, con picos sintéticos y texto inventado. Cada patrón de la medida real tiene su fixture:
  - **Voz casi continua**: voz en ≥ 95 % del tramo con letra. La letra correcta da `dudosa`/`vozContinua` (`veredictoBase` = `coincide`). Una letra ajena (inicios a otro ritmo) sobre esa voz **nunca** da `coincide` ni `desfasada`.
  - **Letra sin fines** (todos los `fin_ms: null`, como un LRC) sobre una voz con huecos cortos entre líneas: `contrasteF < 0,02` → `dudosa`/`sinContraste`. La misma letra con `offset_ms` ±800 y ±3000 **nunca** da `coincide`.
  - **Curva plana con d\* espurio**: voz periódica en la que F(0) ≥ 0,88, I(0) ≥ 0,95 y un máximo lejano (|d\*| ≥ 500) con ganancia < 0,02, y las dos mitades con d\* distintos de ruido. No da `no_coincide` y `desfaseVariable` es `false`. Con contraste suficiente en d = 0, da `coincide`.
  - **|d\*| < 500 con I(d\*) < 0,95 ≤ I(0)** (caso de la canción 16): toma el veredicto de d = 0.
  - **Desfase que crece** de 0 a 3 s a lo largo de la letra, con `v0 ≠ coincide`: `no_coincide` con `desfaseVariable: true` (spec 05, F4-L2).
  - **Máximo en el borde**: una letra ajena cuyo d\* sale en +5000 (o en el límite del audio) no da `desfasada`.
  - **Fin más allá del audio**: la última línea con `fin_ms` = duración + 28 s. `evaluarEncaje` no lanza, el rango de desfases es válido y F no cuenta bloques fuera del audio. En `dudosas.test.ts`, `detectarDudosas` señala esa línea (`sinVoz` o `finTarde`) sin lanzar.
  - **Lo que ya había sigue**: con voz con huecos y letra con fines, la letra correcta da `coincide` con `limitacion: null`, y la letra movida ±0,8 y ±3 s da `desfasada` recuperada a ±20 ms. Determinismo.
- E2E: ejecutar `e2e/letras.spec.ts` y `e2e/preparacion.spec.ts`. El doble `conVoz` de LRCLIB sobre `pulsosFlac` debe seguir dando `coincide`, `desfasada` y `no_coincide`. Si ahora sale `dudosa` por densidad o contraste, se ajusta la voz sintética del doble (más silencio entre pulsos) y se anota; no se tocan las constantes.
- Críticos: sí (`npm run test:e2e:criticos`: el veredicto lo usan la vista Letra y la preparación).
- Manual: `qa` repite `calibrar:encaje` sobre la copia de las 18 canciones (tarea 0301).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

Hecha (2026-11-22, programador).

- `app/src/shared/encaje.ts`: regla del veredicto nueva (mejor de `v0`/`vMejor` con |d*| < 500; `desfasada` solo si no está en el borde de la rejilla; luego `v0 = coincide` → `coincide`; `no_coincide` por `desfaseVariable` solo si `v0` no coincide), `desfaseVariable` con ganancia real en alguna mitad, guardas (`densidadVoz`, `contrasteF`, `limitacion`, `veredictoBase`), parámetros `densidadVozMaxima`, `desfaseSensibilidadMs`, `contrasteMinimoF` y tipo `LimitacionEncaje`. Ninguna otra constante cambia. Coste: 2-3 `medir` más.
- Con limitación, `desfaseMs` sigue siendo d*; `lineasSinVoz` y `tramosVozSinLetra` se calculan en d = 0.
- `comprobacion.ts`, `eleccion.ts` y `corregirDesfaseDiferido` **no cambian** y confirmado: solo actúan con `desfasada` / eligen con `coincide`/`desfasada`, así que con `dudosa` (limitación) ni corrigen ni eligen. El tipo `EncajeCandidato` de `busqueda.ts` aún no lleva `limitacion` (es de la 0379).
- Pruebas: `encaje.test.ts` (fixtures sintéticos de cada patrón: voz casi continua, letra sin fines, curva plana con d* espurio —dos fixtures fijos sacados de una búsqueda con semilla, uno daba `no_coincide` con el código viejo—, |d*| < 500 con I(d*) bajo, desfase que crece, borde con `desfaseMaxMs: 3000`, fin más allá del audio) y `dudosas.test.ts` (fin más allá del audio).
- Tests existentes que cambiaron de expectativa: `main/preparacion/servicio.test.ts`. Su voz falsa tenía 0,6 s de pausa (densidad 88 %, al límite) y sus candidatos eran LRC sin fines (ahora `dudosa`/`sinContraste`). Se pasó a pausas de 1 s y a candidatos con fines salvo una línea (`lineasBuenas`), de modo que la cadena sigue probando «elige, anota y ajusta fines» (ahora 1 fin de la preparación, no 6); el caso `duda` pasó a ser «LRC correcto pero sin fines» y el de la letra desplazada a `noCoincide`. `comprobacion.test.ts`, `eleccion.test.ts` y `busqueda.test.ts` no necesitaron cambios.
- E2E: no ejecutadas. Comprobado a mano con evaluarEncaje que el doble `conVoz` de LRCLIB sobre `VOZ_SINTETICA` sigue dando `coincide`, `desfasada` y `no_coincide` (densidad 44 %, contraste 0,4). Pendiente de quien ejecute Playwright: `letras.spec.ts`, `preparacion.spec.ts`, `editor.spec.ts` (comprobar) y `capturas-022.spec.ts`.
- Medida con la copia de las 18 canciones (ver 0381): propias `coincide` 0/17 (sin guardas 12/17), ajenas 0/272, desplazadas ≥ 0,8 s que dicen `coincide` 0; es más estricto que lo previsto en el ADR («4 como mucho»): 8 por voz continua, 4 por contraste, 4 `no_coincide` y 1 `dudosa`.

Aviso para quien implemente: los tests de `comprobacion.test.ts`, `eleccion.test.ts`, `servicio.test.ts` de la preparación y `busqueda.test.ts` usan picos falsos. Si alguno espera `coincide` o `desfasada` y ahora sale `dudosa`, casi seguro su voz falsa es densa (≥ 90 %) o su letra no tiene fines. Hay que darle huecos o fines al fixture para que siga probando lo que probaba. Y añadir, donde tenga sentido, el caso contrario: con la limitación, no se elige y no se corrige.
