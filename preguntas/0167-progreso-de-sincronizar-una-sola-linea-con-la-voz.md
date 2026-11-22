# 0167 — Progreso de «Sincronizar esta línea con la voz»

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no (se aplica la opción recomendada por defecto, regla del [plan de 0.2.2](../versiones/0.2.2/plan-4.md#regla-de-decisión))

## Contexto

Feature 10 de 0.2.2 (sincronía automática con la voz, solo si la prueba técnica sale bien). La spec suponía que sincronizar **una sola línea** tarda menos de 2 s y no mostraba progreso. El arquitecto ha medido que cargar el modelo (1,26 GB) tarda segundos: el editor lo deja cargado mientras se usa (se libera tras 5 min sin uso o al salir del editor) y la primera vez hay que mostrar el progreso de la carga ([ADR 0028](../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md) §3.2; respuesta a [0157](0157-contratos-de-las-features-8-a-11-para-las-specs.md) §19). Ni el ADR ni las tareas dicen **cómo** se muestra, así que he aplicado la opción que recomiendo en [06 · Feature 10, «Una sola línea»](../ux/06-editor.md#una-sola-línea).

## Pregunta

1. **Dónde se ve el progreso de una sola línea.**
   - **A (provisional).** En línea, bajo el botón «Sincronizar esta línea con la voz» del panel Sincronía: «Preparando la escucha (tarda unos segundos la primera vez)…» con barra indeterminada mientras carga el modelo, y «Escuchando la línea…» después. Con el modelo ya cargado, solo el botón cambia a «Escuchando la línea…». El resto del editor sigue usable.
   - B. Un diálogo pequeño, como el de toda la canción (bloquea el editor mientras dura).
2. **Cancelar.**
   - **A (provisional).** [Cancelar] junto al progreso (y Esc con el foco en él); no cambia nada.
   - B. Sin cancelar: se espera a que termine.
3. **Si la línea cambia mientras se escucha** (el usuario mueve su inicio, su fin o su texto).
   - **A (provisional).** El resultado se descarta sin aplicar nada y se avisa: «La línea cambió mientras la escuchábamos. No hemos cambiado nada.» con [Volver a sincronizar la línea].
   - B. Bloquear la edición de esa línea mientras dura.

## Opción provisional tomada (si no bloquea)

La A en los tres puntos. Criterio F10-E13b de la spec 06.

## Respuesta
