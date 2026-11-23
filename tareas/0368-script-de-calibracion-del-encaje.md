# 0368 — Feature 4 · Script de calibración del encaje (`calibrar:encaje`)
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0297
- ADRs: 0024 §1 (tabla de calibración), 0015
- Spec UX: —
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), entrega alpha.1 (feature 4). Lote C (`app/scripts/calibrar-*.ts`).

## Objetivo
Que el usuario, en su equipo, pueda repetir la calibración de ADR 0024 con su biblioteca («10/10 propias, 0 ajenas aceptadas» y los desplazamientos recuperados) sin que nada salga de su carpeta de datos. Lo necesitan la tarea 0301 y la guía manual de la feature 4.

## Criterios de aceptación
- [x] `app/scripts/calibrar-encaje.ts`, `calibrar-encaje-cli.mjs` y `npm run calibrar:encaje -- <carpeta-de-biblioteca> [--ids a,b,c] [--json]`, con el mismo patrón que `calibrar:silencios`. Herramienta de desarrollo, fuera del paquete.
- [x] **Entrada**: la carpeta de la biblioteca, fuera del repositorio, **solo lectura**. Lee `cancion.json` y los picos ya generados (`leerNivelBase` de `main/picos/formato.ts`). Una canción sin picos o sin letra con tiempos sale como «omitida» con su motivo; el script no genera picos.
- [x] **Cálculo**: con `evaluarEncaje` y `PARAMETROS_ENCAJE` de `shared/`:
  - propias: cada letra contra su voz;
  - ajenas: cada letra contra la voz de cada otra canción (N × (N − 1) pares);
  - desplazadas: cada letra propia movida ±0,4, ±0,8, ±1,5 y ±3 s.
- [x] **Salida** (solo cifras, por la salida estándar):
  - una tabla por canción con id corto, título, líneas con inicio, veredicto, F(0), I(0), d\*, F(d\*), ganancia F(d\*) − F(0) y `desfaseVariable`;
  - por desplazamiento, el veredicto y el error de d\* frente al desplazamiento aplicado;
  - un resumen con propias aceptadas (x/N), ajenas aceptadas (x/pares) y desplazamientos ≥ 0,5 s recuperados (x/total).
  - Con `--json`, lo mismo en JSON.
- [x] **Nunca escribe** en la carpeta de datos: abre todo en modo lectura, sin cachés ni temporales dentro. **Nunca imprime ni copia textos de letra**: solo títulos, ids y cifras.

## Pruebas de feedback
- Unitarias: `calibrar-encaje.test.ts` con una biblioteca temporal sintética (3 canciones con picos generados por el test y letras inventadas): propia `coincide`, ajena rechazada, desplazada 0,8 s recuperada, canción sin picos omitida, y la carpeta intacta después de ejecutar (comparación de árbol y `mtime`).
- E2E: Ninguna.
- Críticos: no (solo `app/scripts/`)
- Manual: el usuario lo ejecuta con su biblioteca (guía de la feature 4, caso 1) y las cifras van al informe 0301.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
**Hecho**: `app/scripts/calibrar-encaje.ts`, `calibrar-encaje-cli.mjs`, `calibrar-encaje.test.ts` y el script `calibrar:encaje` en `package.json`. Reutiliza `leerNivelBase`, `evaluarEncajeConPicos` y `PARAMETROS_ENCAJE`; solo lee (`readdir`, `readFile`, `stat`, `open(..., 'r')`); sin biblioteca real no se ejecutó contra ninguna carpeta del usuario (el test usa una temporal sintética y comprueba que el árbol —rutas, tamaños y `mtime`— queda igual).
**Uso**: `npm run calibrar:encaje -- <carpeta-de-biblioteca> [--ids a,b,c] [--json]`. Salida por la estándar: tabla por canción (id corto, líneas con inicio, veredicto, F(0), I(0), d*, F(d*), ganancia, variable, título), desplazadas ±0,4/±0,8/±1,5/±3 s (veredicto, d*, error frente al desplazamiento) y resumen: propias aceptadas (coincide) x/N, ajenas aceptadas (coincide o desfasada) x/pares, desplazamientos ≥ 0,5 s recuperados (desfasada con d* = −desplazamiento ± 50 ms) x/total. Las letras se evalúan con `offset_ms: 0` (los tiempos del archivo, sin correcciones previas). Las canciones sin picos o sin letra con tiempos salen como AVISO.
**Pendiente**: lo ejecuta el usuario con su biblioteca (guía de la feature 4, caso 1; cifras al informe 0301).
