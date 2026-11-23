# 0328 — Feature 10 · Prueba técnica de alineación forzada sobre la voz separada
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: — (fase 1: puede empezar ya; fase 2: canciones con fines a mano, pregunta 0280)
- ADRs: 0028 §2
- Spec UX: —
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Medir el candidato A del ADR 0028. Primero un filtro barato con la copia del MVP (fase 1), que puede descartarlo. Después, si pasa, contra los fines hechos a mano del usuario, para decidir con el criterio cerrado de §2.4 (fase 2).

## Fases (revisión del 2026-11-22; ADR 0028, revisión «Fase de filtro con letras sin fines»)

La verdad de §2.4 (V1: fines hechos a mano) **no existe** en la copia de las 18 canciones del MVP: 16 de 17 son LRC sin fines y los fines de la canción 17 no son fiables. Por eso la prueba se parte en dos:
- **Fase 1 · filtro**: con esa copia, en este equipo. Puede descartar el candidato A, pero **no** puede darlo por bueno.
- **Fase 2 · decisión**: §2.4 tal cual, con V1. Solo si la fase 1 pasa.

### Fase 1 · filtro (con la copia de la biblioteca del MVP)

- [ ] **Material**: las canciones con `voz.flac` y tiempos de la copia, **sin** 5, 8, 12 y 15 de la [medida](../versiones/0.2.2/medidas-con-canciones-reales.md): son letras de otra versión o con otro ritmo. Quedan 13. Solo las de un idioma con modelo del candidato A (español; inglés con `…-xlsr-53-english` o A′). El idioma no está en `cancion.json`: la sesión principal pasa la lista de ids por idioma como argumento (`--idioma es=<ids>`). Nadie copia texto al repositorio.
- [ ] **Inicio de línea frente al LRC** (la referencia razonable de este material):
  - Por línea, ventana `[inicio_LRC − 1000 ms, inicio de la siguiente)`, más ancha que la de §2.1 para no anclar el resultado al LRC.
  - `Δ = inicio de la primera palabra alineada − inicio_LRC`.
  - Se mide cobertura, mediana de `|Δ|`, p90 de `|Δ − sesgo de su canción|` (sesgo = mediana de Δ con signo por canción) y el sesgo por canción. Global y por canción.
- [ ] **Coste y equivalencia** (criterios 5 y 6 de §2.4, que no necesitan verdad):
  - tiempo por canción de 4 min con CPU en este equipo, pico de RAM y bytes descargados;
  - determinismo (dos ejecuciones iguales);
  - emisiones propias frente a `transformers` y Viterbi propio frente a `forced_align`.
  - El coste con GPU NVIDIA queda para la fase 2 (en este equipo solo hay MPS, informativo).
- [ ] **Informativo, no criterio**:
  - Fin propuesto frente a la voz: fracción de fines tras los que `detectarVoz` sigue marcando voz ≥ 300 ms (cortes probables), comparada con los fines prudentes de «Ajustar los silencios» en las mismas líneas.
  - Palabras de las canciones 10 y 17 (109 líneas, origen desconocido), como V2.
- [ ] **Resultado de la fase 1**:
  - **No sirve** → plan B (§4) sin esperar a V1, si falla cualquiera:
    - cobertura < 80 %;
    - mediana de `|Δ|` > 300 ms;
    - p90 de `|Δ − sesgo|` > 600 ms;
    - el criterio 5 con CPU (≤ 1,5 × la duración, ≤ 4 GB de RAM);
    - el criterio 6.
  - Si pasa, **pasa el filtro**: se anota en ADR 0028 y la decisión espera a la fase 2.
  - Los umbrales doblan los de §2.4 para el fin (150/450 ms), porque la referencia (LRC sin revisar) tiene su propio error.

### Fase 2 · decisión (§2.4 sin cambios)

- [ ] Scripts en `docs/spikes/0028-alineacion/` con entorno `uv` propio; ejecución en el equipo del usuario en solo lectura; **ninguna letra ni audio en el repositorio**.
- [ ] Conjuntos V1 y V2 (y V3 si el usuario la prepara) y línea base de «Ajustar los silencios» calculada por el mismo script.
- [ ] Medidas de §2.3 (error del fin, cortes, confianza, palabras, coste con GPU y CPU, una línea con y sin modelo cargado, determinismo).
- [ ] Comprobación de que un codificador propio y un Viterbi propio dan las mismas emisiones y tramos que `transformers` y `forced_align`.
- [ ] Resultado (**todo**, **solo fines** o **nada**), umbrales de confianza, margen y factores escritos en ADR 0028 («Resultado de la prueba técnica») y estado del ADR actualizado.

## Pruebas de feedback
- Unitarias: Los scripts de la prueba no forman parte de la app (sin Vitest).
- E2E: Ninguna.
- Críticos: no
- Manual: la fase 1 la ejecuta el programador (lote F) con la copia de trabajo de las 18 canciones que prepara la sesión principal, fuera del repositorio. La fase 2 la ejecuta el programador en el equipo del usuario que tiene las canciones con fines a mano (V1), o el usuario con las instrucciones del README de la prueba.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
