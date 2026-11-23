# 0278 — Las letras del MVP y de 0.2.1 no tienen `intacta`: «Preparar» y la comprobación diferida no hacen nada con ellas (0.2.2, feature 5)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
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

## Respuesta

Arquitecto, 2026-11-22. **No se infiere `intacta`.** Ninguna heurística distingue una letra de LRCLIB que nadie tocó de una a la que el usuario ajustó los inicios en el MVP: el MVP no guardaba quién tocó los tiempos. Lo que se decide (ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), revisión «Elección con el veredicto prudente y "Preparar" sobre letras sin marca»):

- «Preparar» sobre un borrador cuya letra **no** está `intacta` y tiene líneas con inicio y sin fin **aplica**, pero solo con el paso `ajustando_fines` y **tras una confirmación explícita**.
  - Contrato: `previsualizar` devuelve `confirmar: "finesSinMarca"`; `preparar(ids, { finesSinMarca: true })`.
  - Pone fines prudentes solo en las líneas con `fin_ms: null` (`origen_fin: "preparacion"`, se quitan con «Quitar esos fines»).
  - **Nunca** toca inicios, fines ya fijados, palabras ni `offset_ms`, y **nunca** corrige el desfase solo.
- Se elige esto y no «actuar sin pedir confirmación» porque `intacta` falta también cuando el usuario cambió un tiempo **en 0.2.2**. La confirmación cubre los dos casos con el consentimiento del usuario. El riesgo que queda es bajo: un fin automático se cambia por uno ajustado a la voz, y es reversible.
- La comprobación diferida no cambia: sigue exigiendo `intacta`.
- Un borrador con letra sin tiempos sigue en `NADA_QUE_HACER`.

**Cambios de código**: tareas [0380](../tareas/0380-preparar-letras-sin-marca-con-confirmacion.md) (contrato y main: `aplicaPreparar` en `shared/derivados.ts`, `pasoFines` en `main/preparacion/servicio.ts`, el diario, el resumen con `prepararFinesSinMarca` y la IPC) y [0382](../tareas/0382-confirmacion-de-preparar-con-letras-sin-marca.md) (interfaz, tras la spec).

**Criterio de «hecha» de la feature 5**: «los 5 borradores del usuario se rescatan con "Preparar"» pasa a decir:
- Los borradores sin letra se preparan con «Preparar» (con red real).
- Los que tienen una letra anterior a 0.2.2 reciben fines tras confirmar, sin mover ningún inicio.

**Cambios de spec para el diseñador** (`docs/ux/02-biblioteca.md`):
1. Hoy «Preparar» de la tarjeta solo aparece en borradores sin letra, y los borradores del MVP con letra completa se ven como «Lista para revisar», sin «Preparar». Hay que decidir dónde se ofrece para una canción con `prepararFinesSinMarca`. Propuesta del arquitecto: un ítem en el ⋯ de esas tarjetas (p. ej. «Ajustar los fines automáticamente»), y el caso dentro de «Preparar» de la selección múltiple.
2. **Confirmación obligatoria** antes de actuar. Sentido: «Esta letra puede tener cambios tuyos. Solo pondremos fin a las líneas que no lo tienen, donde la voz se para claramente. No moveremos ningún inicio ni la letra entera. Puedes quitar esos fines después.» [Cancelar] [Ajustar los fines]. En lote, una sola confirmación: la del diálogo de Feature 8, con una variante nueva de `bib.acc.preparar.nota` («Ya tiene letra (puede tener cambios tuyos): solo pondrá los fines que faltan»).
3. La fila «Canciones de antes de 0.2.2» de «Preparar una canción» se actualiza con lo anterior.
