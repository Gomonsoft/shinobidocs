# 0388 — Doble clic en una palabra del editor preciso: casos que no estaban confirmados
- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no

## Contexto

Incidencia I-3 ([nota](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md)). Ya confirmaste el caso principal: **con la canción sonando, el doble clic en una palabra reproduce desde ahí y no vuelve**. La spec queda en [06 · Doble clic en una palabra del editor preciso (I-3)](../ux/06-editor.md#doble-clic-en-una-palabra-del-editor-preciso-reproduce-desde-ahí-i-3). Faltaban los demás casos; se han decidido así, como provisionales.

## Pregunta

¿Estás de acuerdo con estos casos?

## Opción provisional tomada (si no bloquea)

1. **Doble clic con la canción en pausa**: también empieza a sonar desde la palabra (250 ms antes) y sigue, sin volver. Antes escuchaba solo la palabra y volvía. Así el doble clic significa siempre «reproducir desde aquí», como el doble clic en una línea de la línea de tiempo.
2. **Con el bucle de la línea activo**: el bucle sigue, pero empieza desde la palabra; al acabar la línea vuelve al principio de la línea, como siempre. Tampoco vuelve a donde estaba.
3. **Un solo clic**: solo selecciona la palabra; nunca mueve ni para la canción.
4. **Para escuchar solo una palabra y volver** sigue estando «▶ Palabra» (Mayús + Espacio). Después queda como estaba: si la canción sonaba, sigue sonando desde donde estaba.
5. **Teclado**: Mayús + Intro sobre una palabra hace lo mismo que el doble clic (para quien no usa ratón). Intro sigue marcando.

## Respuesta
