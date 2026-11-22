# 0289 — Feature 1 · Disposición del bloque, gris de la letra y suelo de contraste
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0287
- ADRs: 0022
- Spec UX: docs/ux/sistema-visual.md (0.2.2 · Feature 1), docs/ux/07-reproductor.md (0.2.2 · Feature 1)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Funciones puras que pasan del modelo a píxeles y calculan el gris y las opacidades mínimas.

## Criterios de aceptación
- [ ] `renderer/src/karaoke/pantalla.ts`: `disponerBloque` con tabla de puestos, ancla calculada, apilado con alturas inyectadas, interpolación, dos copias en «Fundido» y recorte 10 %–86 % (ADR 0022 §3).
- [ ] `contraste.ts`: `grisDeLetra` (luminancia WCAG) y `suelosDeOpacidad` (3:1 contra cada muestra), una vez por estilo.
- [ ] Criterios F1-R3, R4, R11, R18, R19 y R24 cubiertos sin DOM.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [ ] El color con el que se calculan los suelos de contraste es un parámetro de la función (por defecto `letra.color`, como dice ADR 0022 §4; en 0.2.2 nadie pasa otro; pregunta 0195).
- [ ] Tests de `disponerBloque` con líneas de 3 y 4 renglones: la geometría no asume 1 o 2.

## Pruebas de feedback
- Unitarias: `pantalla.test.ts` (renderer): anclas ± 0,5 % a 1920 × 1080 y 1280 × 720, escalas, fundido ≤ 0,3 × S, recorte con 7 líneas en 4:3, indicadores relativos al ancla; `contraste.test.ts`: gris y suelos con `#F2E8D5`/`#111111` y el tema Shinobi.
- E2E: Ninguna.
- Críticos: no
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecho (puro, sin DOM; no cambia lo que se ve):
- `renderer/src/karaoke/pantalla.ts` (nuevo): `disponerBloque({ lineas, alturas, pantalla, region, altoPantallaPx?, cambio, aparicion?, suelos? })` -> `{ ancla, tamano, lineas: [{ id, copias: [{ rol, centroY, escala, opacidad, mezclaGris, dibujar }] }], indicadores }`. Tabla de puestos (`escalaDePuesto`, `objetivoOpacidad`), ancla calculada (`anclaDeBloque`; 45 % con 2 líneas), apilado con alturas inyectadas (0,6 × S junto a la activa, 0,25 × S entre las demás), interpolación en «Desplazamiento», dos copias (`saliente`/`entrante`, 0,3 × S) en «Fundido» solo para líneas que cambian de puesto, recorte 10 %–86 % por región (el que cambia entre origen y destino se funde con el avance). Opacidad final = `máx(objetivo, suelo)` solo si el objetivo > 0, luego × retirada × aparición.
- `contraste.ts`: `grisDeLetra` (inversa de la curva sRGB; `#FFD400` -> `#D8D8D8`), `suelosDeOpacidad(estilo, pantalla, colorLetra = estilo.letra.color)` (paso 0,01, contra cada muestra de `muestrasFondo`, sin efecto si ni al 100 % llega a 3:1), una vez por estilo (la vista debe usar `useMemo`).
- Preparación 0.2.3: el color de los suelos es un parámetro (por defecto `letra.color`, ver pregunta 0195: la tarea decía `color_resaltado`); tests con líneas de 3 y 4 renglones. Ajuste ADR 0029 §4 bis: `region { y0Px, altoPx }` (en 0.2.2 toda la pantalla; `altoPantallaPx` opcional da el `S` de la pantalla entera, por defecto el de la región); test de un bloque en la mitad inferior.
- `indicadores`: `barraY = ancla - 0,9 S`, `cuentaY = ancla`, `puntosY = ancla + 1,2 S` (borde superior de la +1 si la activa fuese de un renglón; no depende de N ni P).

Pruebas: `pantalla.test.ts` (tabla de anclas ± 0,5 % a 1920 × 1080 y 1280 × 720 con 1 y 2 renglones, escalas, interpolación, fundido <= 0,3 × S, recorte con 7 líneas, indicadores, suelo, región inferior) y `contraste.test.ts` (gris, suelos con `#F2E8D5`/`#111111` y tema Shinobi, parámetro de color). Criterios F1-R3, R4, R11, R18, R19, R24 cubiertos. E2E y críticos: no. Manual: —.
Para la 0290: `PantallaLetra` debe pintar una lista de zonas `[{ id, lineas, region }]` (en 0.2.2 una) llamando a `disponerBloque` por zona; medir `alturas` a tamaño S; escribir `--k-y` con `centroY`.
