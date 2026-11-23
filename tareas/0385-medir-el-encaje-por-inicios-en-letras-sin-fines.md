# 0385 — Feature 4 · Medir una señal de encaje por inicios de línea (letras sin fines), sin cambiar el veredicto
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0378 y 0381 (hechas o en el árbol). Puede empezar ya.
- ADRs: 0024 (revisión «Resultado con las guardas: 0/17 coincide (pregunta 0295)»)
- Spec UX: —
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 4. Lote C (`app/scripts/calibrar-*.ts`). **Solo medida**: no toca `shared/encaje.ts` ni ningún llamador.

## Objetivo

Saber, con la copia de las 18 canciones y antes de decidir nada, si los **inicios** de línea permiten afirmar «coincide» y estimar el desfase en letras sin fines. F no sirve: el contraste a 0,8 s tiene mediana 0,002. Un inicio es un instante, así que moverlo 0,8 s lo saca de su arranque de voz aunque la línea no tenga fin.

## Definición de la señal (para medir, provisional)

Sobre `detectarVoz` (los mismos intervalos que el encaje):

- **Arranque de voz**: el inicio de un intervalo de voz precedido por al menos `pausaMinimaMs` sin voz. Se miden 150, 250 y 400 ms.
- **Acierto de una línea** en el desfase d: hay un arranque en `[inicio + d − antesMs, inicio + d + despuesMs]`. Se miden las ventanas (−300, +150) y (−200, +200), porque los LRC suelen marcar algo antes de cantar.
- **O(d)**: fracción de líneas con acierto. **Azar(d)**: la que saldría con los mismos arranques y los inicios repartidos al azar. Es analítica: `1 − exp(−densidad de arranques × ancho de la ventana)`. **O\*(d) = (O − Azar) / (1 − Azar)**.
- **Contraste de inicios**: `O*(0) − máx(O*(±800))`. **d\*\_inicios**: el d de la rejilla de ±5 s (paso 20 ms) que maximiza O\*, con la misma regla de borde que el encaje.
- Canciones con menos de `arranquesMinimos` arranques (8, 12 y 20) se dan como «no medible».

## Criterios de aceptación

- [ ] `calibrar:encaje --inicios` (combinable con `--variantes`, `--ids` y `--json`). Por cada combinación de `pausaMinimaMs` y ventana, imprime:
  - por canción propia: arranques, densidad de arranques, O(0), Azar, O\*(0), O\*(±400/±800/±1500), contraste de inicios, d\*\_inicios y el veredicto del encaje actual con su limitación;
  - un resumen con la **regla candidata**: «coincide por inicios» si O\*(0) ≥ `oMin` y el contraste de inicios ≥ `cMin`. Se recorren `oMin` ∈ {0,5; 0,6; 0,7} y `cMin` ∈ {0,2; 0,3; 0,4}. Se aplica solo a las letras que el encaje actual deja en `dudosa`, nunca a `no_coincide`. Para cada combinación: propias aceptadas, ajenas aceptadas (272 pares), desplazadas ≥ 0,8 s aceptadas y, con d\*\_inicios, desplazadas recuperadas a ±200 ms, propias con |d\*\_inicios| ≥ 500 (falsas correcciones) y correcciones con error > 200 ms.
- [ ] Una línea por combinación: `Criterio de adopción (pregunta 0295): SÍ/NO`. Es SÍ si se dan todas:
  1. ajenas aceptadas = **0** en tal cual y sin fines;
  2. desplazadas ≥ 0,8 s aceptadas = **0**;
  3. propias con falsa corrección = **0**;
  4. propias aceptadas ≥ **6 de las 12** que el encaje sin guardas daba por `coincide` (la referencia plausible de letra correcta en esta copia sin revisar; las 5, 8 y 15 y la 17 no cuentan);
  5. si además se quiere proponer el desfase: ≥ 80 % de las desplazadas de esas propias recuperadas a ±200 ms y 0 correcciones con error > 200 ms. Si 1–4 se cumplen y 5 no, la señal solo sirve para afirmar «coincide», no para corregir.
- [ ] El script elige y anota la combinación **más estricta** que cumple (la de menos propias aceptadas entre las que cumplen 1–4). No elige la que más acepta.
- [ ] Solo lectura, sin textos de letra, y la salida de siempre no cambia sin `--inicios`.

## Pruebas de feedback

- Unitarias: `calibrar-encaje.test.ts` con picos sintéticos.
  - Una letra sin fines sobre voz con pausas: O\*(0) alto y contraste alto. Desplazada 0,8 s, baja.
  - La misma sobre voz continua: «no medible» o O\* cerca de 0.
  - Una ajena: O\* cerca de 0.
  - Azar analítico frente a uno contado sobre una rejilla, ±0,02.
- E2E: Ninguna.
- Críticos: no.
- Manual: **la ejecuta `qa` o el programador con la copia de las 18 canciones** y deja las cifras (sin títulos) en la pregunta 0295 o en un anexo de `medidas-con-canciones-reales.md`. El arquitecto decide con esas cifras. Si se adopta, será una tarea aparte que cambie `encaje.ts`, con nota en ADR 0024, y que se vuelva a medir con canciones revisadas (pregunta 0280).
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación

(las rellena el programador al terminar)
