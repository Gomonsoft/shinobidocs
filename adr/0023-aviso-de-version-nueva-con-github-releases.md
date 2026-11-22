# 0023 — Aviso de versión nueva: consulta diaria a la API de *Releases* de GitHub desde main, sin autoactualizar

- Estado: Aceptado (provisionales en [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md))
- Fecha: 2026-11-21
- Paso del pipeline: 0 (distribución)
- Versión: 0.2.2, feature 3 ([plan](../versiones/0.2.2/plan-4.md), [propuesta 026](../propuestas/026-aviso-de-version-nueva.md)). Specs: [08 · Feature 3](../ux/08-ajustes-y-acerca.md#022--feature-3--aviso-de-versión-nueva), [09 · Feature 3](../ux/09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva), [sistema visual · Feature 3](../ux/sistema-visual.md#022--feature-3--aviso-de-versión-nueva). Responde a [0156](../preguntas/0156-contratos-de-las-features-1-a-3-de-0-2-2-para-las-specs.md) §14–§20 y **cierra [0037](../preguntas/0037-autoactualizacion-de-la-app.md) con la opción B**.

## Contexto

La app no sabe si hay una versión más nueva. ADR 0020 publica cada versión como *Release* del repositorio público con etiqueta `v<semver>` (previas `-alpha.N`, `-beta.N`, `-rc.N`, marcadas *pre-release*), con nombres de instalador fijos sin versión (`Shinobi-Karaoke-Windows-x64.exe`, `Shinobi-Karaoke-Mac-chip-Apple.dmg`, `Shinobi-Karaoke-Linux-x64.AppImage`, `shinobi-karaoke-linux-x64.deb`; `app/electron-builder.yml`). Las compilaciones de desarrollo van a otro repositorio y la app conoce su canal (`publicada`, `desarrollo`, `local`; ADR 0020, revisión de la fase 10). No hay firma de código, así que la autoactualización no es fiable (0037).

Comprobado el 2026-11-21:

- La API REST sin autenticar admite **60 peticiones por hora** por IP. Una petición condicional que devuelve 304 **solo** deja de contar si va autenticada: sin token no ahorra cuota.
- `GET /repos/{owner}/{repo}/releases/latest` devuelve la última que **no** es previa ni borrador; para ver previas hay que usar la lista `GET /repos/{owner}/{repo}/releases`, que sin autenticar no incluye borradores.

## Alternativas consideradas

| Opción | Pros | Contras |
|---|---|---|
| **A. `GET /repos/Gomonsoft/shinobi-karaoke/releases?per_page=30` (JSON) desde main** | Incluye previas, nombres de recursos y fecha; JSON que ya sabemos validar con Zod; 1 petición al día está muy lejos del límite | Depende de la API de GitHub (formato estable y versionado con `X-GitHub-Api-Version`) |
| B. `/releases/latest` | Una sola *Release* | No ve previas: inútil mientras solo haya alfas (ADR 0020 §5) |
| C. Feed Atom `https://github.com/<repo>/releases.atom` | Sin cuota de API | XML que parsear (dependencia o código propio); no dice si es previa ni qué recursos tiene |
| D. Archivo `latest.json` propio como recurso de cada *Release* | Control total del formato | Otro paso en el workflow de publicación y el mismo problema de previas que B |
| E. electron-updater (`latest.yml`) en modo solo aviso | Estándar en Electron | Trae el actualizador entero, exige `publish` y los `latest*.yml` que ADR 0020 decidió no generar; sin firma no aporta |

## Decisión

Opción **A**.

### 1. Consulta

- **Quién**: `main/actualizaciones/` (`ServicioActualizaciones`), con `net.fetch` (usa el proxy del sistema, como LRCLIB, ADR 0005).
- **Petición**: `GET https://api.github.com/repos/Gomonsoft/shinobi-karaoke/releases?per_page=30` con `credentials: 'omit'`, `cache: 'no-store'`, `redirect: 'error'` y solo las cabeceras `User-Agent: ShinobiKaraoke/<versión> (https://github.com/Gomonsoft/shinobi-karaoke)` (el mismo que LRCLIB; la API exige un `User-Agent`), `Accept: application/vnd.github+json` y `X-GitHub-Api-Version: 2022-11-28`. Tiempo máximo 10 s; cuerpo de hasta 1 MB.
- **Qué sale del equipo** (0156 §15): la IP, la versión de la app y esas cabeceras. Sin cookies (`credentials: 'omit'`; la app nunca navega por GitHub dentro de Electron), sin `Referer`, sin identificador de instalación, sistema operativo ni datos de la biblioteca. Chromium puede añadir cabeceras técnicas estándar de cualquier petición (`Accept-Encoding`, `Accept-Language`): la spec las nombra como «datos técnicos de cualquier petición web». Una prueba de integración con el doble HTTP comprueba la lista exacta de cabeceras que llegan.
- **Sin ETag** (0156 §14): sin token no ahorra cuota y la respuesta pesa pocos KB.
- **Validación**: Zod sobre `[{ tag_name, draft, prerelease, published_at, assets: [{ name }] }]`; el resto se ignora. Una entrada que no valida se descarta sola, no toda la respuesta.

### 2. Qué cuenta como versión nueva

- Se toman las etiquetas con el formato de ADR 0020 §2 (`v` + SemVer, sufijo `alpha|beta|rc` con número), publicadas (`draft: false`) y con `published_at`.
- **Canal**: si la versión instalada (`app.getVersion()`) no tiene sufijo, solo cuentan las estables; si lo tiene, previas y estables (0156 §17). Las compilaciones `desarrollo` y `local` **no consultan nunca** (ni automática ni manualmente; el botón queda desactivado con el motivo que decida la spec).
- **Comparación**: precedencia SemVer 2.0 (`0.2.2-alpha.1 < 0.2.2-alpha.2 < 0.2.2-rc.1 < 0.2.2`), función pura `compararVersiones` en `shared/version.ts` (nuevo), sin dependencias. El número de compilación no interviene.
- **Resultado**: la mayor versión estrictamente superior a la instalada, o ninguna.

### 3. Cuándo

- **Al arrancar**: 10 s después de mostrar la ventana principal, si `avisar` está activo y han pasado 24 h desde `ultima_comprobacion` (o nunca se comprobó). También en el primer arranque, sin esperar a que termine la instalación del motor (no usa Python).
- **Con la app abierta**: un temporizador cada hora que solo consulta si han pasado 24 h desde la última. Tras `powerMonitor.on('resume')` se evalúa igual (los temporizadores se paran con el equipo en reposo). No interfiere con la sesión en otra pantalla: es una petición de main sin efecto en las ventanas; el aviso solo se pinta en la principal (spec 08).
- **Manual** («Buscar actualizaciones»): consulta siempre, aunque `avisar` esté apagado, y devuelve el resultado o el error para que la spec lo muestre. Como mucho una manual en curso a la vez.
- **Sin red o con error** (DNS, tiempo, 4xx, 5xx, 403 por cuota, cuerpo no válido): en automático no se muestra nada y se reintenta en la siguiente ventana de 24 h; queda una línea en el registro de main.

### 4. Configuración e IPC (0156 §16)

```jsonc
"actualizaciones": {                   // config.json; lectura tolerante por campo, esquema sigue en 1
  "avisar": true,                      // lo escribe el renderer con config.actualizar
  "ultima_comprobacion": "2026-11-21T10:00:00Z",   // solo main
  "disponible": { "version": "0.2.2", "publicada": "2026-11-25T18:00:00Z", "recursos": ["Shinobi-Karaoke-Windows-x64.exe"] } ,  // solo main; null si no hay
  "vista": "0.2.2"                     // última versión cuyo aviso vio el usuario (punto del botón ⚙); solo main
}
```

- `disponible` se guarda para que el aviso siga ahí sin red al día siguiente; se borra si la versión instalada ya es igual o mayor (tras actualizar).
- Canales (rol principal, ADR 0008): `actualizaciones.estado()` → `{ canal, avisar, disponible, vista, ultimaComprobacion, comprobando }`; `actualizaciones.comprobar()` → `{ resultado: 'nueva' | 'al_dia' | 'error', disponible?, codigo? }`; `actualizaciones.marcarVista({ version })`; evento `actualizaciones:cambio`. `avisar` se escribe con `config.actualizar` (admitido en `configParcialRendererSchema`).
- Códigos de error: `SIN_CONEXION` y `SERVICIO_NO_DISPONIBLE` (los de LRCLIB).

### 5. Enlaces (0156 §18)

- La app **construye** los enlaces: «Ver novedades» → `https://github.com/Gomonsoft/shinobi-karaoke/releases/tag/v<versión>`; «Descargar» → `…/releases/download/v<versión>/<archivo de este sistema>`. Nunca abre una URL que venga en la respuesta. Ya están dentro de `ENLACES_PERMITIDOS` (`github.com` + `/Gomonsoft/shinobi-karaoke`).
- **Archivo de este sistema**: Windows → `.exe`; macOS → `.dmg`; Linux → `.AppImage` si `process.env.APPIMAGE` existe (lo define el runtime de AppImage y es lo que usa electron-updater para detectarlo) y `.deb` si no. Si el archivo no figura en `assets` de esa *Release*, «Descargar» abre la página de la versión.
- **Sin autoactualización**: no se descarga ni se ejecuta nada. `publish: null` sigue en electron-builder (ADR 0020).

### 6. Pruebas (0156 §20)

- `SHINOBI_GITHUB_URL` (URL base del doble HTTP local) y `SHINOBI_ACTUALIZACIONES_VERSION` y `SHINOBI_ACTUALIZACIONES_CANAL` (versión y canal simulados), **solo sin empaquetar** (`app.isPackaged`), como `SHINOBI_LRCLIB_URL` (ADR 0005, 0009 §8).
- Vitest: `compararVersiones` (tabla de casos SemVer), filtro de canal, selección de la mayor, construcción de enlaces por plataforma, servicio con `fetch` inyectado (sin red, error, 403, cuerpo inválido, reloj de 24 h, `resume`).
- E2E: una prueba secundaria con el doble que compruebe el punto del botón ⚙, la línea de Acerca de y las cabeceras recibidas por el doble.
- Manual: con red real contra las *Releases* publicadas.

## Consecuencias

- Positivas: cierra 0037 sin firma; coste S; sin dependencias.
- Negativas / riesgos: un acceso a internet nuevo, con interruptor y mención en el primer arranque (spec); dependencia del formato de la API de GitHub (versionada); en redes que bloqueen `api.github.com` nunca hay aviso (silencioso por diseño).
- **Legales / privacidad**: GitHub recibe la IP y la versión una vez al día. Se documenta en el texto de primer arranque y en Ajustes.

## Fuentes

- GitHub, [Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) («60 requests per hour» sin autenticar) y [Best practices for using the REST API](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) (las condicionales con 304 solo no cuentan con `Authorization`), consultadas el 2026-11-21.
- GitHub, [REST API: Releases](https://docs.github.com/en/rest/releases/releases) (`latest` excluye previas y borradores; lista de *Releases*) y [Getting started: User-Agent obligatorio](https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api#user-agent).
- [SemVer 2.0.0, §11 precedencia](https://semver.org/spec/v2.0.0.html#spec-item-11).
- Electron, [`net.fetch`](https://www.electronjs.org/docs/latest/api/net#netfetchinput-init) y [`powerMonitor`](https://www.electronjs.org/docs/latest/api/power-monitor); electron-updater detecta AppImage por `process.env.APPIMAGE` ([electron-builder, AppImageUpdater](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/AppImageUpdater.ts)).
