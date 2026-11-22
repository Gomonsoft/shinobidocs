# 0290 — Feature 1 · `PantallaLetra` con varias líneas y cambios por tiempo
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0288, 0289
- ADRs: 0022, 0019, 0011, 0017
- Spec UX: docs/ux/07-reproductor.md, docs/ux/10-exportacion.md y docs/ux/sistema-visual.md (0.2.2 · Feature 1)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Pintar el nuevo modelo en reproductor, secundaria, vista previa y exportación sin volver a renderizar React por fotograma.

## Criterios de aceptación
- [x] Montaje a tamaño `S`, medición estable de renglones (una vez por línea y tamaño), variables por nodo `--k-y`, `--k-escala`, `--k-opacidad`, `--k-gris`; `color-mix` para el gris.
- [x] Copias del «Fundido» solo durante el cambio; indicadores en posiciones relativas al ancla y con `esperaAparicion`.
- [x] Se retira la animación `.transicion` de la línea y su `data-nace-ms`; la cuenta conserva su mecanismo.
- [x] La instantánea de sesión y la de exportación llevan el estilo resuelto con `pantalla`; la exportación pasa `movimiento: 'completo'`.
- [x] F1-R17, R21, R22 y R23 cubiertos.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [x] El color del barrido se resuelve por línea: una función `colorDeLinea(linea, estilo)` (en 0.2.2 devuelve siempre `color_resaltado`) y variables CSS en el nodo de cada línea. Los indicadores de espera toman el color de la línea que viene.
- [x] El ancho de línea deja de ser un 88 % fijo en el CSS: pasa a la variable `--k-ancho-linea` (88 % por defecto), usada también en la reducción por longitud.
- [x] `PantallaLetra` pinta una lista de zonas `[{ id, lineas, region }]` (en 0.2.2, siempre una que cubre toda la pantalla); los indicadores de espera y la cuenta se dibujan en la zona de la línea que viene; la clave de cada nodo incluye la zona ([ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) §4 bis).

## Pruebas de feedback
- Unitarias: `PantallaLetra.test.tsx`: mismos cortes de renglón en todos los puestos (medición simulada), Letra lista sin color de resaltado, palabra a palabra igual que 0.2.1, modo fotograma.
- E2E: Una prueba en `exportacion.spec.ts`: 3 s a 640 × 480 con 5 líneas; el modelo del anfitrión a mitad de un cambio es igual a `fotogramaEn` (F1-R23).
- Críticos: sí (vista del flujo principal)
- Manual: Fluidez en un equipo modesto y en la secundaria con fondo en movimiento; si hay saltos, `will-change` solo durante el cambio.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecho:
- `karaoke/PantallaLetra.tsx` y `pantallaLetra.module.css` reescritos. Cada línea es un nodo montado a tamaño S (clase `.linea`) con `--k-reduccion` (reducción por longitud 1 → 0,75, medida una vez al montarla y de nuevo solo con cambio de letra, fuente, cuenta o `ResizeObserver`/`document.fonts`), y por fotograma `--k-y`, `--k-escala`, `--k-opacidad`, `--k-gris` escritos con `disponerBloque` (sin volver a renderizar React). El gris se compone con `color-mix` (`--k-color-gris` sale de `variablesEstilo`); la capa de resaltado se mezcla igual desde `--k-resaltado-linea`. React solo se vuelve a renderizar cuando cambia `claveDe(fotogramas)` (ids visibles, ids con copia en «Fundido», indicadores). Copias `saliente`/`entrante` solo durante el cambio de «Fundido». Se retira `.transicion` y el `data-nace-ms` de la línea; la cuenta conserva `entraNumero` y su `data-nace-ms`.
- Estructura palabra a palabra: sale de la letra (`palabrasVisibles`), no del instante, así que una línea no cambia de DOM al pasar de activa a ya cantada. Barrido por nodo (mediciones en un `WeakMap`).
- Indicadores: barra, cuenta y puntos son nodos hermanos de las líneas (los puntos ya no cuelgan de la +1), con `--k-y` = `indicadores.barraY/cuentaY/puntosY` de su zona, opacidad = `esperaAparicion` (barra y puntos; la cuenta lleva su entrada propia) y color de la línea que viene (`--k-indicador`, solo con barrido). `--k-fraccion` se escribe ahora también directamente en la barra: antes quedaba la del último render de React (en 0.2.1 la barra heredaba un valor viejo del `style` inline).
- Preparación 0.2.3: `karaoke/zonas.ts` (`ZonaLetra { id, lineas, region }`, región en fracciones del alto; `zonasDeLetra` devuelve una que cubre toda la pantalla); `PantallaLetra` calcula un fotograma por zona, dispone un bloque por zona y las claves de nodo son `zona:id:rol` (`data-zona`). `colorDeLinea(linea, estilo)` en `estiloCss.ts` (siempre `color_resaltado`) y `--k-resaltado-linea` por línea. `--k-ancho-linea: 88%` en `.raiz`, usada por líneas, título, cuenta y puntos.
- `render.ts`: se retira `claveTransicion` (la vista usa `claveLineas`). `actual`/`siguiente` se quedan con la semántica de 0.2.1 (`siguiente` da el color de los indicadores). La exportación: el anfitrión (`AppExportacion`) pasa `pantalla` normalizada y `movimiento: 'completo'` también a su modelo de desarrollo; el `PantallaLetra` ya recibía `movimiento="completo"`. Instantánea de sesión y de exportación: sin cambios de código (el estilo ya viene de `resolver(cancion).estilo`, con `pantalla` desde 0287).
- Caso límite de 0288 (entre 2,0 y 2,4 s): no hace falta tratamiento; un barrido de instantes con huecos de 1,9 a 2,5 s y N/P de 2/0 a 7/2 no encuentra dos líneas en el mismo puesto ni más de N en reposo (el bloque nuevo no tiene ya cantadas y las del anterior ocupan sus puestos).

Pruebas (Vitest): `PantallaLetra.test.tsx` (R23 instante fijo = reproductor en «Desplazamiento» y «Fundido»; copias solo durante el cambio; R16 puestos enteros; R17 reducción y nodo estables en +1/0/−1; R22 palabra a palabra; R21 Letra lista sin capa a mitad de un cambio; R19 posiciones relativas al ancla con N/P distintos; zona y color por línea), `pantalla.test.ts` (barrido de instantes del caso límite), `estiloCss.test.ts`. E2E: `e2e/exportacion.spec.ts` amplía la primera prueba (5 líneas, a mitad del cambio la imagen cambia más que en reposo): **escrita, sin ejecutar** (la ejecuta la sesión principal con los críticos). Críticos: pendiente de ejecutar.

Verificación manual (guía de 0.2.2): fluidez en un equipo modesto y en la secundaria con fondo en movimiento (si hay saltos, `will-change: transform, opacity` solo durante el cambio); capturas F1-R25 del diseñador; comprobar en una ventana real que el barrido de la barra de espera avanza (se escribe por fotograma) y que 4:3 con 7 líneas recorta como pide R18.

Para 0291 (panel Estilo): la vista previa del editor usa `estiloPrevia.pantalla`; `PantallaLetra` normaliza el estilo (ausente = 5 líneas) y recalcula `suelosDeOpacidad` al cambiar `estilo`/`pantalla` (conviene pasar un `estilo` estable). Para 0293 (subrayado): la capa `.resaltado` ya es por nodo y su color y opacidad pasan por `--k-gris`; el subrayado debe ir en esa capa y su opacidad seguir `1 − --k-gris`; `recorteBarrido` y las cajas se miden por nodo en `medirBarridos`.

Deuda: `lint` y `format:check` fallan hoy en archivos del lote C (`main/letras/servicio.test.ts`, `vistas/editor/estado.ts`, `vistas/letra/fixturesPicos.ts`), no en los míos.
