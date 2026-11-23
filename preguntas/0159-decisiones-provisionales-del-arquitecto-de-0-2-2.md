# 0159 — Decisiones provisionales del arquitecto en 0.2.2

- De: arquitecto
- Para: usuario
- Estado: Abierta
- Bloquea: no (se aplica la opción recomendada por defecto, regla del plan)

## Contexto

Al definir las once features de 0.2.2 (ADR 0022–0028) he tomado por defecto las opciones de abajo. Las técnicas no necesitan tu respuesta; estas sí pueden interesarte porque cambian lo que ves, lo que sale del equipo o lo que se puede compartir. Si alguna no te convence, di cuál y se cambia.

## Pregunta

| N.º | Decisión | Opción aplicada (recomendada) | Alternativa | ADR |
|---|---|---|---|---|
| 1 | **Buscar la letra automáticamente al añadir una canción**: título, artista, álbum y duración salen hacia LRCLIB sin que entres en Letra | Interruptor en Ajustes, **activado por defecto**, mencionado al añadir y en el primer arranque | Desactivado por defecto (solo «Preparar» y la vista Letra buscan) | 0025 §4, revisión de 0005 |
| 2 | **La app elige la letra sola** | Solo si tiene tiempos, la duración difiere ≤ 2 s y la comprobación con la voz dice «coincide»; si dos letras distintas cumplen, te pregunta | Nunca elegir; dejar siempre «Elige la letra» | 0025 §3 |
| 3 | **Fines automáticos en la preparación** | «Ajustar los silencios» prudente: solo fines automáticos, sin activar la cuenta 3·2·1 (o la sincronía con la voz si entra y su modelo está descargado) | No tocar los fines | 0025 §2 |
| 4 | **Listas enteras de YouTube** | Se permiten en modo lote, hasta 50 vídeos, descargados uno a uno con pausas, con un aviso legal propio la primera vez | No permitir listas (solo varios enlaces sueltos) | 0026 §3 |
| 5 | **Paquete de canción con audio** (se puede pasar a otra persona aunque la app no lo promueva; la visión excluye «compartir») | Existen las dos variantes; el paquete de canción propone por defecto la **ligera** (sin audio; las de YouTube recuperan su audio solas) y la copia de seguridad, la completa | Solo la variante ligera | 0027 |
| 6 | **Aviso de versión nueva**: una consulta al día a GitHub (ve tu IP y la versión) | Activado por defecto, con interruptor; nunca en compilaciones de desarrollo | Desactivado por defecto | 0023 |
| 7 | **Corrección del desfase de toda la letra** | Mínimo 0,5 s (medido con tus canciones: por debajo, la medida no distingue una letra correcta) | 0,15 s como proponía la spec | 0024 §1 |
| 8 | **Sincronía con la voz** (feature 10) | Primero una prueba técnica con criterio cerrado; si no lo cumple, entra la propuesta 027 (marcar inicio y fin al ritmo) y la 016 ya queda dentro de la revisión guiada | Meter la etapa 1 sin prueba | 0028 |
| 9 | **Modelo de alineación** | Español e inglés, 1,26 GB cada uno, descargados solo cuando tú lo pidas (Ajustes o el diálogo) | Descargar el español en el primer arranque | 0028 §3.2 |
| 10 | **Entregas** | Cuatro: alpha.1 (3, 1, 2, 4), alpha.2 (6, 5, 11), alpha.3 (7, 8, 9), alpha.4 (10) | Una sola entrega con las once | backlog |
| 11 | **Volver a 0.2.1** tras usar 0.2.2 | Se abre todo sin errores, pero si 0.2.1 guarda una canción o un tema, pierde lo nuevo (5 líneas, subrayado, preparación…) | Subir el esquema (0.2.1 no abriría nada de 0.2.2) | 0006, 0022 |

Además, para la prueba técnica de la feature 10 ayudaría (opcional) que marcaras a mano, con el editor preciso de 0.2.1, las palabras de unas 20 líneas de una canción lenta y de la rápida: hoy solo 67 fines de tus canciones son con seguridad hechos a mano (los de Tragedia Termina, Dedos Rotos y casi todos los de A Pesar de Mí salieron de «Ajustar los silencios»).

## Opción provisional tomada (si no bloquea)

La columna «Opción aplicada» de cada fila.

## Respuesta

**Nota del arquitecto (2026-11-22, pregunta 0260)**: fila 4: se mantiene el aviso legal **propio** de las listas, que se acepta una vez y se guarda aparte. Es la opción más prudente; la spec 03 se ajusta a ella. Sigue siendo provisional: puedes preferir que valga el aviso de YouTube ya aceptado, o no permitir listas.

