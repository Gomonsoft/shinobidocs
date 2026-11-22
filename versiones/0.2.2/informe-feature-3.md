# Informe de la feature 3 de 0.2.2 · Aviso de versión nueva

Tareas: [0284](../../tareas/0284-actualizaciones-version-y-servicio-en-main.md), [0285](../../tareas/0285-aviso-de-version-nueva-en-la-interfaz.md) y [0286](../../tareas/0286-verificacion-e-informe-de-la-feature-3.md). Decisión: [ADR 0023](../../adr/0023-aviso-de-version-nueva-con-github-releases.md), que cierra la pregunta [0037](../../preguntas/0037-autoactualizacion-de-la-app.md) (cerrada, opción B). Specs: [08](../../ux/08-ajustes-y-acerca.md#022--feature-3--aviso-de-versión-nueva), [09](../../ux/09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva) y [01](../../ux/01-primer-arranque.md#022--feature-3--mención-del-aviso-de-versión-nueva).

**Estado: Implementada y verificada con el doble; dos defectos abiertos para el programador y verificación manual pendiente.** Todo lo de este informe se ejecutó el 2026-11-22 en un Mac M1 (macOS, Node 24) sobre la rama `version-0.2.2`. El CI de GitHub no se ha consultado (no hay PR borrador de la feature todavía): su resultado consta como pendiente.

## Qué incluye

`shared/version.ts` (comparación SemVer 2.0), `main/actualizaciones/` (consulta a la API de *Releases* con `net.fetch`, canal, 24 h, `resume`, una manual a la vez), tres canales IPC reales, y en la interfaz: punto en ⚙, aviso con **Ver** al principio de Ajustes, bloque «Actualizaciones» en Acerca de (también en el diálogo del primer arranque) y la mención en la bienvenida. `desarrollo` y `local` no consultan nunca.

## Resultado de las pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` | Limpio |
| `npm run lint` | Limpio |
| `npm run format:check` | Limpio |
| Vitest de la feature (`shared/version.test.ts`, `main/actualizaciones`, `vistas/acerca`, y además `vistas/ajustes` y `navegacion`) | 13 archivos, **193 pasan** |
| `npm run test:cambios` (172 archivos afectados) | 2741 pasan, 7 omitidas, **1 falla**: `sesion/sesion.test.tsx:269` («abierto» recibe `c1` en lugar de `ninguno`). **Inestable**, no de la feature: el archivo suelto pasa 2 de 2 veces (34 de 34) y el fallo solo apareció con la carga del lote completo. Ajeno a 0284/0285 |
| `npm run build` + `npx playwright test e2e/actualizaciones.spec.ts` | **2 de 2 pasan** (25 s) |
| `npm run test:e2e:criticos` | **1 de 1 pasa** (18 s) |
| `npx playwright test e2e/editor-layout.spec.ts` | 22 pasan, 11 omitidas, **1 falla** (ver «Fallo conocido ajeno») |

Ninguna petición real a GitHub: la E2E usa el doble HTTP local (`SHINOBI_GITHUB_URL`).

## Criterios de la feature

Backlog: «la app empaquetada con canal `publicada` avisa de una *Release* más nueva de su canal, no consulta en `desarrollo` ni `local`, el doble recibe solo las cabeceras previstas y la pregunta 0037 consta como cerrada».

| Criterio | Estado |
|---|---|
| Avisa de una *Release* más nueva de su canal (F3-A2, F3-A4) | Cumplido en Vitest (tabla SemVer, filtro de canal, borradores, etiquetas inválidas) y en E2E con el doble. **No verificado** contra una Release real publicada |
| No consulta en `desarrollo` ni `local` (F3-A3) | Cumplido: Vitest y E2E (ninguna petición en 12 s). La espera de 5 min de la spec va a la guía (caso 9) |
| El doble recibe solo las cabeceras previstas (F3-A5) | Cumplido con una ampliación: además de las tres del ADR llegan `Host`, `Connection`, `Accept-Encoding`, `Accept-Language` y `Sec-Fetch-Dest|Mode|Site`; la E2E fija la lista exacta incluyendo las `Sec-Fetch-*`. Pregunta [0180](../../preguntas/0180-detalles-del-aviso-de-version-nueva-0284-0285.md) §3, abierta para el arquitecto. El código fija exactamente las tres del ADR (`consulta.ts:199-203`) con `credentials: 'omit'`, `cache: 'no-store'`, `redirect: 'error'` |
| Los enlaces no vienen de la respuesta (F3-A7) | Cumplido: main los construye (`consulta.ts:118-134`) y el renderer solo abre `estado.enlaces` y la guía fija; la E2E responde con URLs ajenas y no se usan |
| Texto y comportamiento de Ajustes, punto y aviso (F3-A8 a A13, A18) | Cumplido en los tests de componente y la E2E salvo lo que está en la guía manual (lector de pantalla, geometría) |
| Pregunta 0037 cerrada | Cumplido: Estado «Respondida» con la respuesta del 2026-11-21 que remite al ADR 0023 |
| Mención en el primer arranque sin scroll (F3-P1) | **No cumplido a 1024 × 576** (defecto D2). Cumplido a 1280 × 800 |
| `INSTALAR.md` con «Actualizar a una versión nueva» (spec 09 §F3.2) | Cumplido en esta tarea (ver más abajo) |
| Consulta real, «Descargar» por sistema, sin red, lector de pantalla, F3-A15 a A17, A19 | **No verificable aquí**: pasa a la [guía manual](../../Test-manuales/0.2.2/feature-3-aviso-de-version-nueva.md) |

## Defectos para el programador

- **D1 · Consulta antes de iniciar el servicio** (`app/src/main/actualizaciones/servicio.ts:137-141` y `:175`). `alCambiarConfig` llama a `evaluar()` con cualquier cambio de configuración, y `evaluar()` no comprueba `iniciado`. Si la configuración cambia antes de `ready-to-show`, o durante los 10 s de espera, hay una consulta automática antes de lo que dicen el ADR 0023 §3 y F3-A1 (10 s después de mostrar la ventana). Arreglo sugerido: `if (!this.iniciado) return` al principio de `evaluar()`. Gravedad baja; no se observó en las pruebas, es por lectura del código.
- **D2 · F3-P1 no se cumple a 1024 × 576** (bienvenida B1, `PantallasInicio.tsx`, `pa.actualizaciones`). Medido con una prueba temporal (borrada) en Electron con el runtime falso: con `SHINOBI_ACTUALIZACIONES_CANAL=publicada`, `documentElement.scrollHeight` = 666 px con la ventana de 576 (scroll de 90 px; el texto queda en y = 560–596, parcialmente fuera); con canal `local` (sin la mención) = 606 px, es decir, **30 px de scroll ya existían** y la mención añade 60. A 1280 × 800 la ventana quedó en 757 px de alto (limitada por la pantalla del equipo) y no hay scroll con la mención (757 = 757). El arreglo pasa por reducir espacio en B1 a esa altura (decisión de UX: la spec exige «sin scroll» a 1024 × 576 y el B1 base ya no lo cumple); se deja al programador y al diseñador.
- **Observación de diseño (no defecto)**: con `redirect: 'error'`, si GitHub redirigiera la API (repositorio renombrado), la consulta fallaría en silencio. Es lo que pide el ADR; se anota por si el repositorio cambia de nombre.
- **Pendiente de arquitecto**: la pregunta [0180](../../preguntas/0180-detalles-del-aviso-de-version-nueva-0284-0285.md) sigue abierta. Una consecuencia de su punto 2: el reintento tras un fallo automático solo se recuerda en memoria, así que cada reinicio con fallos previos vuelve a consultar; «como mucho una consulta automática al día» solo se cumple sin reinicios (con red caída no sale nada, pero con un 403 por cuota podría repetirse). No hay riesgo real de superar las 60 peticiones/hora.

## `INSTALAR.md`

El programador avisó de que faltaba la sección que enlaza el botón «Guía de instalación» (`#actualizar-a-una-versión-nueva`). La spec 09 §F3.2 la define con el texto completo, así que se añadió **tal cual** entre «Después de instalar» y «¿Sigue sin abrirse?», y se actualizó el índice del principio. Se quitó la marca interna `⟦P20⟧` de la spec. La frase de la copia de la versión preliminar queda con la variante sin la feature 9 («haz antes una copia de tus canciones»): cuando entre «Copia de seguridad», conviene cambiarla por la remisión a **Ajustes → Copia de seguridad** que prevé la spec.

**Pendiente de la spec 09, fuera del encargo**: §F3.1 (párrafo «¿Ya la tienes instalada?» en el README), §F3.3 (entrada en las notas de la versión 0.2.2) y §F3.4 (frase en el cuerpo de las compilaciones de desarrollo y viñeta en el README de `shinobi-karaoke-builds`). El README actual no tiene el párrafo.

## Fallo conocido ajeno: `editor-layout.spec.ts`

- «con la barra vertical de main a 1024 px de ancho no se salta a la disposición B»: falla con `Error: la barra vertical ocupa ancho · Expected: > 0 · Received: 0` (`editor-layout.spec.ts:861`). **Clasificación: dependiente de plataforma (macOS), prueba frágil, no regresión.** macOS dibuja barras de desplazamiento superpuestas, que no ocupan ancho (`offsetWidth - clientWidth` = 0); la prueba asume barras clásicas. El archivo no está cambiado por 0.2.2. Se ajustó la prueba para omitirla en macOS si la barra no ocupa ancho; en Windows y Linux se sigue ejecutando completa en el CI. Registrado en `docs/pruebas.md`, «Fallos conocidos clasificados».
- «tooltip a los 500 ms» (`:867`): **pasó** en esta ejecución; se mantiene como intermitente sin cambios.

## Lo que pasa a la guía manual

[`Test-manuales/0.2.2/feature-3-aviso-de-version-nueva.md`](../../Test-manuales/0.2.2/feature-3-aviso-de-version-nueva.md) (10 casos): mención del primer arranque a 1280 × 800 y 1024 × 576, aviso con dos versiones publicadas de verdad, «Descargar» con el instalador correcto en Windows, Mac y Linux, sin red sin mensajes, una sola petición, instalar encima, geometría del punto, lector de pantalla y teclado, compilación de desarrollo y las capturas F3-A19 (no tomadas; la spec las pide).

## Archivos tocados en esta tarea

`INSTALAR.md`, `app/e2e/editor-layout.spec.ts` (omisión en macOS), `docs/pruebas.md`, `docs/Test-manuales/0.2.2/feature-3-aviso-de-version-nueva.md`, este informe y la tarea 0286. No se tocó código de producción. El índice `docs/Test-manuales/README.md` no incluye aún la guía nueva.
