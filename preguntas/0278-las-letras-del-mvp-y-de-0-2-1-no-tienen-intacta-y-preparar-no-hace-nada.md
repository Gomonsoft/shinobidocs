# 0278 — Las letras del MVP y de 0.2.1 no tienen `intacta`: «Preparar» y la comprobación diferida no hacen nada con ellas (0.2.2, feature 5)

- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

Con la biblioteca del MVP 0.1.0 del usuario (18 canciones, `esquema: 1`; informe [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)): `preparacion.previsualizar` y `preparar` devuelven `NADA_QUE_HACER` para las 3 «Lista para revisar» (LRC de LRCLIB sin fines, sin revisar) y para el borrador con letra manual sin tiempos. La causa está en `app/src/shared/derivados.ts:270-278` (`aplicaPreparar`): los pasos `comprobando` y `ajustando_fines` solo se añaden con `letra.intacta === true`, y ese campo lo pone main **al guardar una letra nueva** en 0.2.2: ninguna letra anterior lo tiene. Consecuencias con datos reales:

- «Preparar» (botón de la bandeja y del menú) no ofrece nada a los borradores de 0.2.1 que ya tienen letra. El rescate de los 5 borradores del usuario (guía de la feature 5, caso 3) **no pasará por la comprobación ni los fines**, aunque su letra sea de LRCLIB.
- La comprobación diferida de la feature 4 (ADR 0024 «Revisión 0210») tampoco corre sobre esas letras (exige `intacta`).
- Para probar la parte local hubo que escribir `intacta: true` a mano en la copia; entonces `preparar` pone fines prudentes (1–8 líneas de 52–86) y recuenta dudosas correctamente, y retira `intacta`.

## Pregunta

¿Debe tratarse una letra anterior a 0.2.2 como «intacta» cuando `origen: "lrclib"` y nunca se editó (p. ej. sin `palabras`, sin `fin_ms` salvo la última línea y sin `desfase_*`)? Alternativa: dejarlo así y que la guía/aviso diga que Preparar solo actúa sobre letras buscadas en 0.2.2 (y que el usuario pueda usar «Comprobar la letra con la voz» y «Ajustar los silencios» a mano). Si se infiere, hay que decidir cómo (la heurística es frágil: el MVP no guardaba si el usuario tocó los tiempos).

## Opción provisional

Ninguna; se mantiene el comportamiento de f2b66bf.
