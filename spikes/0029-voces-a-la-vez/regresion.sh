#!/usr/bin/env bash
# Corre las pruebas existentes que tocan la regla, sin y con el parche, y resume los resultados.
#   SPIKE_APP=<copia de app/> docs/spikes/0029-voces-a-la-vez/regresion.sh <directorio-de-salida>
set -u
AQUI="$(cd "$(dirname "$0")" && pwd)"
APP="${SPIKE_APP:-$AQUI/../../../app}"
OUT="${1:?directorio de salida}"
mkdir -p "$OUT"
ARCH=(
  src/shared/letra.test.ts src/shared/encaje.test.ts src/shared/dudosas.test.ts src/shared/silencios.test.ts
  src/shared/derivados.test.ts src/shared/coros.test.ts src/shared/escucha.test.ts src/shared/reparto.test.ts
  src/shared/cancion.test.ts src/shared/letras/ src/main/letras/ src/main/preparacion/servicio.test.ts
  src/main/copias/ src/main/biblioteca/recuentoRevision.test.ts
  src/renderer/src/karaoke/render.test.ts src/renderer/src/karaoke/pantalla.test.ts
  src/renderer/src/karaoke/PantallaLetra src/renderer/src/vistas/editor/estado
  src/renderer/src/vistas/editor/lineaTiempo.test.ts src/renderer/src/vistas/editor/guardado.test.ts
  src/renderer/src/vistas/letra/
)
cd "$APP"
for modo in sin con; do
  if [ "$modo" = sin ]; then export SPIKE_SIN_PARCHE=1; else unset SPIKE_SIN_PARCHE; fi
  SPIKE_APP="$APP" npx vitest run --config "$AQUI/vitest.regresion.config.mts" --reporter=json --outputFile="$OUT/reg-$modo.json" "${ARCH[@]}" > "$OUT/reg-$modo.log" 2>&1
  node -e "const r=require('$OUT/reg-$modo.json');console.log('$modo parche:',r.numTotalTests,'tests;',r.numPassedTests,'ok;',r.numFailedTests,'fallan;',r.testResults.length,'archivos')"
done
node -e "
const a=require('$OUT/reg-sin.json'),b=require('$OUT/reg-con.json');
const mapa=r=>new Map(r.testResults.flatMap(f=>f.assertionResults.map(t=>[f.name.split('/app/')[1]+' > '+t.fullName,t.status])));
const A=mapa(a),B=mapa(b);let cambian=[];
for(const [k,v] of B) if(A.get(k)!==v) cambian.push(k+': '+A.get(k)+' → '+v);
console.log('tests que cambian de resultado con el parche:',cambian.length);cambian.slice(0,40).forEach(x=>console.log(' -',x));
"
