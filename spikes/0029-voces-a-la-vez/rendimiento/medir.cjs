// Mide el coste de pintar + capturar un fotograma de exportación a 1920×1080 (como `main/exportacion/ventana.ts`).
//   app/node_modules/.bin/electron medir.cjs --dist <dir> --escenarios base,z3,z4_60 --rondas 3 [--fotogramas 300]
'use strict'
const { app, BrowserWindow } = require('electron')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { performance } = require('node:perf_hooks')

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`)
  return i >= 0 ? process.argv[i + 1] : d
}
const DIST = path.resolve(arg('dist', 'dist-medicion'))
const ESCENARIOS = arg('escenarios', 'base,z3').split(',')
const RONDAS = Number(arg('rondas', 3))
const MAX_FOTOGRAMAS = Number(arg('fotogramas', 0))
const PNG = arg('png', '')
const ANCHO = 1920
const ALTO = 1080
const CALENTAMIENTO = 20
const TIPOS = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2'
}

app.commandLine.appendSwitch('force-device-scale-factor', '1')
// Sin ventanas abiertas entre escenarios Electron cerraría la app por defecto.
app.on('window-all-closed', () => undefined)

function servir() {
  return new Promise((resolver) => {
    const s = http.createServer((req, res) => {
      const f = path.join(
        DIST,
        req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0])
      )
      if (!f.startsWith(DIST) || !fs.existsSync(f)) return res.writeHead(404).end()
      res
        .writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' })
        .end(fs.readFileSync(f))
    })
    s.listen(0, '127.0.0.1', () => resolver(s))
  })
}

const pct = (a, p) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))]
const media = (a) => a.reduce((s, x) => s + x, 0) / a.length

async function una(url, id) {
  const ventana = new BrowserWindow({
    show: false,
    width: ANCHO,
    height: ALTO,
    useContentSize: true,
    enableLargerThanScreen: true,
    webPreferences: {
      offscreen: { useSharedTexture: false, deviceScaleFactor: 1 },
      sandbox: true,
      contextIsolation: true,
      backgroundThrottling: false,
      zoomFactor: 1
    }
  })
  const wc = ventana.webContents
  wc.setAudioMuted(true)
  wc.setFrameRate(240)
  await ventana.loadURL(url)
  const info = await wc.executeJavaScript(`__arrancar(${JSON.stringify(id)})`)
  const total = MAX_FOTOGRAMAS > 0 ? Math.min(MAX_FOTOGRAMAS, info.total) : info.total
  const capturarUna = async () => {
    const imagen = await wc.capturePage()
    return imagen.toBitmap()
  }
  const pintar = []
  const captura1 = []
  const captura = []
  const total_ms = []
  const nodos = []
  let zonas = 0
  let reintentos = 0
  let noAsentadas = 0
  for (let k = -CALENTAMIENTO; k < total; k++) {
    const n = info.desdeN + Math.max(k, 0)
    const t0 = performance.now()
    const r = await wc.executeJavaScript(`__fotograma(${n})`)
    const t1 = performance.now()
    // Igual que `ventana.ts`: dos capturas iguales = cuadro asentado; si difieren, se repite (hasta 3 reintentos).
    let previa = await capturarUna()
    const t2 = performance.now()
    let asentada = false
    let intentos = 1
    for (let i = 0; i < 3; i++) {
      const actual = await capturarUna()
      intentos++
      if (actual.equals(previa)) {
        asentada = true
        break
      }
      previa = actual
    }
    const t3 = performance.now()
    if (k >= 0) {
      pintar.push(t1 - t0)
      captura1.push(t2 - t1)
      captura.push(t3 - t1)
      total_ms.push(t3 - t0)
      nodos.push(r.lineas)
      zonas = Math.max(zonas, r.zonas)
      if (PNG && k === Math.floor(total / 2))
        fs.writeFileSync(path.join(PNG, `${id}.png`), (await wc.capturePage()).toPNG())
      reintentos += intentos - 2
      if (!asentada) noAsentadas++
    }
  }
  ventana.destroy()
  const lineasMax = Math.max(...nodos)
  return {
    id,
    fps: info.fps,
    fotogramas: total,
    lineasMedia: media(nodos),
    lineasMax,
    zonas,
    reintentos,
    noAsentadas,
    pintar: { media: media(pintar), p50: pct(pintar, 0.5), p95: pct(pintar, 0.95) },
    captura1: { media: media(captura1), p50: pct(captura1, 0.5), p95: pct(captura1, 0.95) },
    capturaReal: { media: media(captura), p50: pct(captura, 0.5), p95: pct(captura, 0.95) },
    fotograma: { media: media(total_ms), p50: pct(total_ms, 0.5), p95: pct(total_ms, 0.95) }
  }
}

app.whenReady().then(async () => {
  const servidor = await servir()
  const url = `http://127.0.0.1:${servidor.address().port}/index.html`
  const resultados = []
  for (let ronda = 0; ronda < RONDAS; ronda++) {
    // Orden alterno entre rondas para que la deriva térmica no favorezca a nadie.
    const orden = ronda % 2 === 0 ? ESCENARIOS : [...ESCENARIOS].reverse()
    for (const id of orden) {
      const r = await una(url, id)
      r.ronda = ronda
      resultados.push(r)
      console.error(
        `ronda ${ronda} ${id}: fotograma ${r.fotograma.media.toFixed(1)} ms (pintar ${r.pintar.media.toFixed(1)}, captura ${r.capturaReal.media.toFixed(1)}), líneas ${r.lineasMax}, no asentadas ${r.noAsentadas}`
      )
    }
  }
  console.log(
    JSON.stringify({
      equipo: process.platform + ' ' + process.arch,
      electron: process.versions.electron,
      chrome: process.versions.chrome,
      resultados
    })
  )
  servidor.close()
  app.quit()
})
