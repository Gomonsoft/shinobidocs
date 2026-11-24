# Spike 0029 · Voces a la vez (tarea 0356, ADR 0029 §7)

Prueba técnica desechable: no se empaqueta ni se importa desde `app/` o `worker/`, y **no modifica nada de `app/`**. Todo lo que cambia la regla (`parche/`) se aplica en memoria con un plugin de Vite al cargar los archivos en las pruebas. Letra inventada; sin red. **Resultado en [`informe.md`](informe.md).**

| Carpeta / archivo | Qué es |
|---|---|
| `informe.md` | Veredicto por criterio, cifras, riesgos y lo que no se pudo comprobar |
| `parche/reglaFinPorParte.mts` | La regla «inicios crecientes + fin por parte» como reemplazos de texto sobre 5 archivos de `app/src/shared`; `parche/diff.mts` escribe los archivos parcheados y cuenta las líneas |
| `datos/letraInventada.ts` | La letra inventada con las tres referencias (dúo a la vez, misma frase por dos, coro con la principal) y la voz sintética |
| `prototipo/solapes.ts` | `solapadas`, `aplanarSolapes`, `vistaParaLrc` y los adaptadores de «Ajustar los silencios» y dudosas |
| `pruebas/` | Criterio 1 (regla, 2 000 letras sin solapes), criterio 2 (modelo por zonas) y criterio 3 (las funciones automáticas) |
| `regresion.sh`, `vitest.regresion.config.mts` | Corre las pruebas **existentes** que tocan la regla, sin y con el parche |
| `rendimiento/` | Medida de captura a 1920 × 1080 en una ventana offscreen de Electron con el `AppExportacion` real y zonas por parte de prototipo |
| `vitest.config.mts`, `comparar.mts` | Configuración de las pruebas propias y cruce de las pasadas con y sin parche |

## Cómo repetirlo (desde `app/`, con sus `node_modules`)

Por defecto trabaja sobre `app/` del árbol; con `SPIKE_APP=<ruta>` usa otra copia (la medida del informe usó `git archive 552fbb2 app` para no mezclar cambios en curso).

```sh
# Pruebas propias (criterios 1 a 3)
npx vitest run --config ../docs/spikes/0029-voces-a-la-vez/vitest.config.mts --disable-console-intercept

# Pruebas existentes con y sin el parche (51 archivos)
bash ../docs/spikes/0029-voces-a-la-vez/regresion.sh /tmp/regresion

# Tamaño real del parche (desde la raíz del repo)
node --experimental-strip-types docs/spikes/0029-voces-a-la-vez/parche/diff.mts /tmp/parcheado

# Prueba 1.3 con y sin parche, cruzadas (los resultados de tiempos.ts/normalizar.ts solo existen sin el plugin)
SPIKE_SALIDA=/tmp/con.json npx vitest run --config ../docs/spikes/0029-voces-a-la-vez/vitest.config.mts -t "1.3"
SPIKE_SIN_PARCHE=1 SPIKE_SALIDA=/tmp/sin.json npx vitest run --config ../docs/spikes/0029-voces-a-la-vez/vitest.config.mts -t "1.3"
node --experimental-strip-types ../docs/spikes/0029-voces-a-la-vez/comparar.mts /tmp/con.json /tmp/sin.json

# Medida de captura (no es `npm run build`: compila a una carpeta temporal)
node --experimental-strip-types ../docs/spikes/0029-voces-a-la-vez/rendimiento/construir.mts /tmp/dist-medicion
node_modules/.bin/electron ../docs/spikes/0029-voces-a-la-vez/rendimiento/medir.cjs \
  --dist /tmp/dist-medicion --escenarios base,z3,z4_30,z5,base_60,z4_60,inventada --rondas 3 > /tmp/medicion.json
node --experimental-strip-types ../docs/spikes/0029-voces-a-la-vez/rendimiento/resumir.mts /tmp/medicion.json
# Con la 0364 real, cuando esté hecha: SPIKE_ZONAS_REALES=1 en el paso `construir.mts`
```

La medida de captura pide una ventana de Electron en marcha durante unos minutos: no la lances a la vez que Playwright ni que otra medida.
