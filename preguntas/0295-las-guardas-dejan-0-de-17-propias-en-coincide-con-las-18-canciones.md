# 0295 — Las guardas de fiabilidad dejan 0 de 17 propias en «coincide» con las 18 canciones reales (0.2.2, feature 4)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto

Con 0378 y 0381 aplicadas, `calibrar:encaje --variantes` sobre la copia de las 18 canciones (solo cifras): propias `coincide` **0/17** (sin guardas: 12/17), ajenas aceptadas 0/272, desplazadas ≥ 0,8 s que dicen `coincide` 0, propias `desfasada` 0, correcciones con error > 200 ms 0, criterio de seguridad SÍ. El ADR 0024 (revisión 2026-11-22) preveía «4 como mucho». Reparto de las 17 propias: 8 `dudosa/vozContinua`, 4 `dudosa/sinContraste`, 4 `no_coincide` (letras que no corresponden al audio) y 1 `dudosa` sin limitación. El contraste a 0,8 s es < 0,02 en 16 de 17 (mediana 0,002): con LRC sin fines F casi no cambia al mover la letra, como diagnosticó el ADR, y ni las pocas con voz no continua y F(0) buena lo superan.

## Pregunta

Ninguna decisión pendiente para implementar: es el comportamiento pedido (seguro). Se avisa de que, con esta biblioteca, la comprobación no afirma «coincide» en ninguna canción, así que la elección automática de la preparación irá siempre a «Elige la letra» y la interfaz de la 0379 mostrará casi siempre «No está claro». Medir cuántas letras buenas se pierden exige canciones revisadas con fines (pregunta 0280).

## Opción provisional

Se deja como está (la decisión del ADR).

## Respuesta

Arquitecto, 2026-11-22. El resultado es el comportamiento pedido (seguro) y **no se recalibra nada**. Mi previsión («4 como mucho») era optimista: el contraste de F a 0,8 s es casi nulo incluso en las canciones de voz no continua. Queda anotado en ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), revisión «Resultado con las guardas: 0/17 coincide».

**1. Las 4 `no_coincide`.** Por la tabla de la [medida](../versiones/0.2.2/medidas-con-canciones-reales.md) y la regla de 0378, son las canciones **5, 8, 15 y 17**. Y la `dudosa` sin limitación es la **12** (F(0) = 0,842, d\* = −940). El programador lo confirma con `--json`.
- **5, 8 y 15: veredicto correcto.** Las dos primeras tienen letra de otra versión (I(0) de 0,78 y 0,74; la 8 acaba 28 s después del audio). La 15 tiene un desfase que crece de −0,8 a −2,1 s.
- **17: veredicto falso, por sus propios fines.** Son fines por palabra del MVP que cortan antes de que acabe la voz. Sin fines, su F sube a 0,939. Es un límite de F con fines mal puestos, no de la regla. No se toca ahora. Al revisarla a mano, el usuario la arreglaría.
- **12: la regla hace lo que debe.** F(0) < 0,85, y la letra podría ir con otro ritmo.

**2. Sí hay una señal que merece medirse: los inicios.** Un inicio es un instante. Moverlo 0,8 s lo saca del arranque de voz aunque la línea no tenga fin, así que puede discriminar desplazamientos donde F no puede. I(d) ya mira inicios, pero «hay voz en los 400 ms siguientes» se cumple casi siempre con voz densa. La propuesta mira **arranques tras una pausa** y lo corrige por el azar. Se define como **medida, no como cambio**: tarea [0385](../tareas/0385-medir-el-encaje-por-inicios-en-letras-sin-fines.md). Es un script de solo lectura sobre la copia, con cifras por canción y un criterio cerrado de adopción:
- 0 ajenas, 0 desplazadas ≥ 0,8 s aceptadas y 0 falsas correcciones;
- ≥ 6 de las 12 propias plausibles aceptadas;
- para corregir además el desfase, ≥ 80 % recuperadas a ±200 ms.
Con voz continua puede que tampoco sirva (habrá pocos arranques): el script lo dirá.

**3. Mientras tanto.**
- **La app** dice «No está claro» con su motivo (0379). Cuando la limitación es de la letra o de la voz y no de la app, el texto debe sugerir qué hacer: escucharla en el editor, «Ajustar los silencios» y mover la letra a mano.
- **La preparación** sigue sin elegir sola: la canción llega a «Elige la letra» con las candidatas ya buscadas y ordenadas, y el usuario elige con un clic. Elegir sola sin comprobar es una decisión de producto, y va al usuario en la pregunta [0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md) (opción B: elegir sola si hay una única candidata con tiempos y duración exacta, y marcarla «sin comprobar con tu audio»). No se aplica sin su respuesta.
- **Notas de la versión**: la feature 4 **no** se anuncia como capaz de corregir desfases. El texto propuesto: «Comprueba la letra con la voz separada cuando es posible y te avisa si parece de otra versión. Con letras que no marcan el fin de cada línea (las de LRCLIB, casi siempre) todavía no puede comprobar si van adelantadas o atrasadas: te lo dice y no cambia nada». Lo aplica la sesión principal en `lanzamientos/notas/0.2.2/`.

**4. Sí: la elección automática de la feature 5 depende ahora de la 0385 o de la feature 10.** Lo demás de la feature 5 funciona sin ellas: buscar la letra, separar, ordenar las candidatas, poner fines y llegar a «Lista para revisar» una vez elegida la letra. Pero que la canción **llegue sola** a «Lista para revisar» con una letra de LRCLIB sin fines exige una comprobación fiable del encaje. Hay dos caminos:
- (a) los inicios, si la 0385 cumple su criterio;
- (b) la alineación forzada de la feature 10, cuya confianza por línea mira el **texto** contra la voz (señal D de ADR 0024 §1) y además pone los fines.
Plan y backlog actualizados: el criterio de la feature 5 se parte en «llega a "Elige la letra" o a "Lista para revisar"» (hoy) y «elige sola» (depende de 0385 o de la feature 10). La prueba técnica 0328 gana peso: su fase 1 debería ir antes que la etapa 1.

