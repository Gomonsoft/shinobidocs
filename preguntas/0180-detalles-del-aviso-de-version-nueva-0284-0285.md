# 0180 — Detalles del aviso de versión nueva que ADR 0023 y las specs no fijan
- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en las tareas [0284](../tareas/0284-actualizaciones-version-y-servicio-en-main.md) y [0285](../tareas/0285-aviso-de-version-nueva-en-la-interfaz.md))

## Contexto

Al implementar el aviso aparecieron cuatro huecos pequeños.

## Pregunta

1. **Enlaces en el contrato IPC.** El ADR 0023 §5 dice que main construye los enlaces, pero `actualizaciones.estado()` (0339) no los devuelve y el renderer no sabe si la app corre como AppImage. ¿Se acepta añadir `enlaces: { novedades, descargar, directa } | null` a `estadoActualizacionesSchema`?
2. **Reintento tras un fallo automático.** ADR 0023 §3 dice «se reintenta en la siguiente ventana de 24 h»; la spec 08 dice «más adelante». `ultima_comprobacion` solo cambia con respuesta, así que sin más regla se reintentaría cada hora. ¿Qué vale?
3. **Cabeceras que llegan al doble (F3-A5).** Además de las tres del ADR, `net.fetch` envía `Host`, `Connection`, `Accept-Encoding`, `Accept-Language` y `Sec-Fetch-Dest|Mode|Site`. ¿Se amplía la lista del ADR/spec con las `Sec-Fetch-*`?
4. **Guía de instalación.** El botón abre `…/blob/main/INSTALAR.md#actualizar-a-una-versión-nueva`, pero `INSTALAR.md` aún no tiene esa sección (spec 09 · Feature 3).

## Opción provisional tomada (si no bloquea)

1. Sí: se añadió `enlaces` (validado con `enlaceSchema`, es decir, `ENLACES_PERMITIDOS`) a `estadoActualizacionesSchema`; el renderer solo abre esos enlaces.
2. Conservadora: tras un intento automático (con o sin respuesta) no hay otro automático hasta pasadas 24 h (memoria del proceso; un reinicio vuelve a evaluar). Un fallo no escribe nada en `config.json`.
3. La prueba E2E fija la lista exacta incluyendo las `Sec-Fetch-*`.
4. Se usa ese enlace; hasta que exista la sección, GitHub abre el archivo sin posicionar.

## Respuesta

Arquitecto, 2026-11-22. **Se confirman las cuatro opciones aplicadas; no hay cambios de código.** Quedan fijadas en ADR [0023](../adr/0023-aviso-de-version-nueva-con-github-releases.md), «Revisión 2026-11-22 (pregunta 0180)».

1. **`enlaces`**: sí. `enlaces: { novedades, descargar, directa } | null` forma parte de `estadoActualizacionesSchema`, validado con `enlaceSchema` (`ENLACES_PERMITIDOS`). Main los construye (sabe si es AppImage) y el renderer solo abre esos.
2. **Reintento**: tras un intento **automático**, con respuesta o sin ella, no hay otro automático hasta pasadas 24 h. Se cuenta en la memoria del proceso; un fallo no escribe en `config.json` y un reinicio vuelve a evaluar. Es lo que quería decir «la siguiente ventana de 24 h». La comprobación manual («Buscar ahora») no está sujeta a esta espera.
3. **Cabeceras**: sí. La E2E fija la lista exacta de lo que llega al doble, incluidas las `Sec-Fetch-Dest`, `Sec-Fetch-Mode` y `Sec-Fetch-Site` que añade Chromium. Son técnicas y no identifican a nadie: entran en los «datos técnicos de cualquier petición web» de la spec. La app sigue fijando solo tres. Si una actualización de Electron cambia la lista, la E2E falla a propósito y se revisa aquí antes de ampliarla.
4. **Enlace a INSTALAR.md**: se mantiene `…/blob/main/INSTALAR.md#actualizar-a-una-versión-nueva`. La sección la añade qa; mientras no exista, GitHub abre el archivo sin posicionar, que es aceptable.
