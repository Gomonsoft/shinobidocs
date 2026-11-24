# 0364 — Feature 1 · Disposición por zonas en pantalla
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0348
- ADRs: 0029 §4 bis, 0022 §2–§3
- Spec UX: docs/ux/07-reproductor.md#disposición-por-zonas y docs/ux/sistema-visual.md#023--varios-cantantes-y-coros (Disposición por zonas)
- Tamaño: L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cada parte en su franja de la pantalla, en el reproductor, la secundaria, la vista previa y el video.

## Criterios de aceptación
- [x] `renderer/src/karaoke/zonas.ts` con `zonasDePantalla` (orden Coro arriba y cantantes, área 12 %–86 %, separación 0,3 × S, coro a la mitad y 1 línea, cantantes con 2) y `S_zona` calculado una vez por canción y tamaño de ventana, con los mínimos de 0,75 y 0,5 × S (C1-R2, C1-R6).
- [x] Por zona, `fotogramaEn` sobre su subsecuencia (Todos repetido en cada zona de cantante) con `N = lineas`, `P = 0` y la opción nueva `subidaAlSalir` en `render.ts`; `disponerBloque` en su región (C1-R4, repetición; C1-R5, zona del coro).
- [x] Opacidad por zona (100 % mientras suena, 55 % si no, lineal en D, instantánea con movimiento reducido) sobre los puestos y antes del suelo de contraste (C1-R3).
- [x] Indicadores de espera y cuenta en la zona de la línea que viene (C1-R9); «Líneas a la vez» y «Líneas ya cantadas» no se aplican en zonas, y con `zonas: "una"` se ve el bloque de 0.2.2 (C1-R10).
- [x] Mismo modelo en la vista previa, el reproductor, la secundaria y el anfitrión de exportación en el mismo instante; el diálogo de exportación no tiene controles nuevos (C1-R11, C1-V1, C1-V2).
- [x] Tiempo de un fotograma de exportación con 3 zonas frente a 0.2.2, anotado en las notas.

## Pruebas de feedback
- Unitarias: `zonas.test.ts` (geometría en 50 instantes a 1920 × 1080 y 1280 × 720, 4:3, ningún cambio de posición, opacidad), `render.test.ts` (`subidaAlSalir`), test compartido de modelo entre superficies.
- E2E: Ampliar `exportacion.spec.ts` con 20 fotogramas de un dúo con coro (C1-V1).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.**
- `renderer/src/karaoke/zonas.ts` (reescrito): `zonasDeLetra(letra, { zonas, duracionMs })` (subsecuencias por zona, Coro arriba y un cantante por ranura, «Todos» repetido en cada cantante, con el fin de cada línea resuelto en la letra entera y cacheadas por letra), `geometriaDeZonas` (área 12 %–86 %, separación 0,3 S, coro a la mitad, `S_zona` mínimo 0,75 S igual para todos los cantantes, tamaño del coro con mínimo 0,5 S), `zonasDePantalla` (la forma del ADR), `fotogramasDeZonas` y `fotogramasEstaticosDeZonas`.
- `render.ts`: opción `subidaAlSalir` (`puestoEn` con tercer parámetro; sin líneas ya cantadas, la salida y la subida van en un solo cambio) y `opacidadZona` en el fotograma (1 mientras suena una línea suya, 0,55 si no, lineal en D, instantánea con movimiento reducido); `fotogramaEstatico` admite `zona`.
- `pantalla.ts`: `disponerBloque` admite `tamanoPx`, `ancla`, `limites` y `opacidadZona` (esta última multiplica antes del suelo de contraste). `contraste.ts`: `sueloDeContraste`.
- `PantallaLetra.tsx` + CSS: pinta cada zona con su región; `--k-escala-zona` escala la fuente de las líneas de la zona (se escribe antes de medir); el título, la aparición y la espera salen de la letra entera y la espera se dibuja en la zona de la línea que viene (Todos: la del primer cantante).
- Anfitrión de exportación (`exportacion/AppExportacion.tsx`): el modelo de desarrollo `__fotogramaExportacion` lleva ahora el de todas las zonas (`fotogramas`).
- Sin reparto o con `zonas: "una"` el camino es el de 0.2.2 (misma zona única, mismas llamadas; el test de 50 instantes y `exportacion.spec.ts` lo confirman).

**Criterios.** C1-R2 (zonas Coro, Cantante 1, Cantante 2 dentro del 12 %–86 %, coro a la mitad y 1 línea, sin cambiar de sitio; geometría a 1920 × 1080, 1280 × 720 y 1440 × 1080; un cantante con coros, dos; trío, tres) cumplido en `zonas.test.ts`. C1-R3 (zona que suena al 100 %, las demás su próxima al 55 % sin barrido) cumplido. C1-R4 (Todos en cada zona de cantante) cumplido. C1-R5 cumplido. C1-R6 (80 %; con 4 cantantes y coro `S_zona` ≥ 0,75 S; nada dibujado fuera de su zona: `disponerBloque` con los límites de la región) cumplido; `S_coro = máx(0,5 S, mín(S_zona, alto_coro / 3,3))` (2,4 de dos renglones más 0,9 de la fila de indicadores). **Limitación aceptada en 0.2.3** (respuesta a 0360): una línea de coro que no cabe ni con `S_coro` mínimo no se dibuja (regla «nunca cortada»); el corte en un renglón con «…» queda para más adelante. C1-R7 (insignia) sin cambios respecto a 0348. C1-R9 cumplido (respuesta a la pregunta 0360): en las zonas los indicadores van en UNA fila (`.filaEspera`, `data-fila-espera`) a 0,9 × `S_zona` por encima del centro del primer renglón de la próxima, puntos · barra · cuenta, solo los activos y centrados como grupo; barra al 40 % del ancho (25 % si comparte fila) y cuenta a 0,6 × `S_zona`; en la zona de la línea que viene (una sola vez antes de Todos) y nunca sobre el texto; sin zonas, como en 0.2.2. C1-R10 cumplido (con zonas «Líneas a la vez» y «Líneas ya cantadas» no cambian nada; con `una`, el modelo de 0.2.2). C1-R11 cumplido (mismo modelo en 20 instantes en el anfitrión, y mismo DOM entre el instante fijo y el reloj). C1-V1 cumplido. C1-V2: el diálogo no cambia.

**Tiempo del video.** `e2e/exportacion.spec.ts` (dúo con coro, 8 s a 640 × 480 y 24 FPS) mide con `console.log` el tiempo por fotograma de la canción sin reparto y el del dúo con 3 zonas: 21,4 frente a 18,5 ms (la primera exportación incluye el arranque); 42,6 / 23,7 y 44,3 / 24,1 en dos repeticiones. Con 3 zonas no es más lento que sin reparto. El video del dúo tiene amarillo a los 2,5 s y cian (Luis) a los 6 s.

**Cómo probarlo.** `npx vitest run src/renderer/src/karaoke src/renderer/src/exportacion`; `npx playwright test e2e/exportacion.spec.ts`; capturas: `SHINOBI_CAPTURAS_023_1=1 npx playwright test e2e/capturas-023.spec.ts --workers=1` (salen en `docs/ux/revisiones/0.2.3-feature-1/`).

**Para la 0360 (voces a la vez).** Cada zona ya es una secuencia independiente (`fotogramaEn` sobre su subsecuencia con su caché de sucesos), así que dos zonas con línea activa a la vez funcionan sin cambios en `fotogramaEn`; `opacidadZona` ya da 1 a cada zona que suena. Lo que habrá que cambiar: (1) `zonasDeLetra` resuelve el fin con `finEfectivo` en la letra entera (limitado por la siguiente línea de cualquier parte); con solapes tendrá que ser «por parte» y «Todos» contar para todas. (2) El fotograma global que da la espera, el título y `siguiente` (`fotogramasDeZonas`) usa la letra entera: la espera solo debe salir cuando ninguna zona suena. (3) Los indicadores van en la zona de la línea que viene. Preguntas abiertas en [0360](../preguntas/0360-indicadores-de-espera-sobre-la-linea-en-una-zona-y-tamano-del-coro.md).

**Deuda.** El caso extremo del coro (un renglón con «…»), aceptado como limitación; `alturas` se guarda por id de línea, no por zona (vale porque las zonas de cantante comparten tamaño y el coro no repite ids).
