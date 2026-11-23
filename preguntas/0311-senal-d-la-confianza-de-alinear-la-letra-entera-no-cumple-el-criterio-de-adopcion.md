# 0311 — Señal D (tarea 0387): la confianza de alinear la letra entera no cumple el criterio de adopción (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (0329 y 0330 siguen esperando a la fase 2)

## Contexto

Medida de la [tarea 0387](../tareas/0387-medir-la-confianza-de-la-alineacion-como-comprobacion-del-encaje.md) sobre las 17 canciones con voz y tiempos (13 propias, 4 de otra versión: 5, 8, 12, 15), con el modelo del candidato A y las emisiones ya guardadas. Definición exacta, tablas por canción y por `cMin` en el [README del spike](../spikes/0028-alineacion/README.md). Solo cifras e ids abreviados.

## Resultado: **Criterio de adopción (señal D): NO**

| Condición | cMin 0,3 | 0,4 | 0,5 | 0,6 | 0,7 |
|---|---|---|---|---|---|
| 1. 0 ajenas aceptadas | sí | sí | sí | sí | sí |
| 2. 5 y 8 no aceptadas | sí | sí | sí | sí | sí |
| 3. 0 de 78 desplazadas aceptadas | **no (1)** | **no (1)** | **no (1)** | **no (1)** | **no (1)** |
| 4. propias aceptadas ≥ 7/13 | 10 | 9 | 9 | 9 | **6** |
| 5. margen ≥ 0,1 | **−0,236** | **−0,011** | **−0,011** | **−0,011** | **+0,081** |

- Confianza de la letra propia de 0,26 a 0,94 (mediana 0,70); mejor ajena 0,17 a 0,63. La voz de `2fec1a9d` (densa y continua) es la mejor ajena de 10 de las 11 letras `es`.
- Margen por canción: ≥ +0,1 en 10 de 13; `613de88b` +0,095, `8275d460` +0,065 y `ca2bf253` **−0,046** (su letra puntúa 0,577 y una ajena 0,629).
- Las propias no aceptadas con cMin 0,5: las dos inglesas (`8275d460` 0,26 y `f538b75e` 0,39), `906aeca5` (p90 835 ms) y `ca2bf253` (p90 662 ms).
- 5 y 8 se rechazan por p90 (3,2 s y 10,4 s) y no por la confianza (0,689 y 0,629, como varias propias). La 15 sale con 0,894 y p90 284 ms; la 12, con 0,668 y p90 1,2 s (informativas).

## Punto metodológico (la tarea lo dejaba sin resolver; no inventé más que lo mínimo)

«Desplazada» con una alineación de letra entera: la alineación y la confianza no cambian, solo el sesgo (sesgo − d). Apliqué la regla tal cual: se rechaza solo si |sesgo − d| > 500 ms. El único caso aceptado es `2fec1a9d` con +0,8 s: su sesgo propio de +430 ms lo compensa (−370 ms). Con un umbral |sesgo| ≤ 500 y pasos de 0,8 s es inevitable cuando el sesgo propio ya es grande; sin V1 no se sabe si ese sesgo es del LRC o del modelo (como en la fase 1). La confianza por sí sola no detecta ningún desplazamiento.

Ajenas de otro idioma o de longitud muy distinta: no se midieron (las de otro idioma se descartan por idioma según la tarea; no hubo pares inalineables).

## Preguntas

1. ¿Se da la señal D por no adoptada (0329 y 0330 siguen esperando a la fase 2)? Por la regla escrita, sí.
2. Si se quiere insistir: la muestra de propias con confianza baja son las dos inglesas y las de voz continua; mejorar eso requeriría otro modelo o V1, no más umbrales (un `cMin` de 0,4 a 0,6 deja el margen en −0,011 por una sola canción). No propongo ajustar nada sobre estos datos.
3. ¿Anotas el resultado en ADR 0024/0025/0028?

## Respuesta

Arquitecto, 2026-11-23. **La señal D no se adopta, y se cierra esta vía para la elección automática de la feature 5.** Las decisiones del script se validan: la regla se aplicó tal cual y el punto metodológico de las desplazadas está bien resuelto.

**Por qué es definitivo con este material**: la confianza no separa la letra propia de la de otra versión (la 15 puntúa 0,894; la 5 y la 8 igualan a varias propias). Una voz densa da confianza alta a cualquier letra, y la señal no ve desplazamientos. No es cuestión de umbrales.

**Cierre**: es la tercera medida negativa con el mismo material (encaje con guardas 0/17, inicios 1/12, señal D). No propongo una cuarta señal. **No queda nada útil que medir sin canciones revisadas.**
- La elección automática de letras de LRCLIB sin fines queda **fuera de 0.2.2**. Solo se reabre con evidencia nueva: canciones revisadas a mano u otro modelo. La alternativa sin evidencia es el punto 2 de la pregunta 0280 (elegir sola la única candidata y marcarla «sin comprobar»), que decide el usuario.
- 0329 y 0330 siguen bloqueadas por la fase 2 de ADR 0028.

**Anotado en**:
- ADR 0024, 0025 y 0028 (revisiones del 2026-11-23);
- plan y backlog (estado final de 0.2.2);
- propuesta [038](../propuestas/038-sincronizar-con-la-voz-solo-a-peticion.md) (alineación solo a petición, sin automatismos).

