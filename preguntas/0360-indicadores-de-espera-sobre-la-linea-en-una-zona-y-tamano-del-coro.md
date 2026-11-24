# 0360 — Indicadores de espera sobre la línea próxima en una zona, y tamaño de la zona del coro

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (opción literal de la spec aplicada, anotada abajo)

## Contexto

Tarea 0364 (zonas). Al ver las capturas `reproductor-1920x1080-espera-zona` y `duo-coro` aparecen dos puntos que la spec no resuelve del todo.

1. **La cuenta 3·2·1 tapa la línea próxima.** La spec 07 dice que los indicadores van «con las mismas posiciones relativas a esa línea (barra encima, cuenta en su sitio, puntos sobre ella)». En 0.2.2 el sitio principal está vacío durante el hueco (la próxima espera en el puesto +1); en las zonas la próxima espera **en el sitio principal** al 55 % (`subidaAlSalir`), así que la cuenta (tamaño `S`, centrada en el ancla) se dibuja encima de su texto y no se lee bien ninguna de las dos cosas (se ve en la captura de la zona del coro: «2» sobre «(Ah, ah, la marea)»). Los puntos quedan justo debajo y la barra encima, sin problema.
2. **Tamaño de la zona del coro.** La spec dice «como las de cantante (`S_zona`)» y «se reduce hasta caber, mínimo 50 % de `S`». Como la zona del coro mide la mitad, una línea de dos renglones a `S_zona` no cabe; para que la forma sea estable (una sola vez por canción y ventana) se calcula `S_coro = máx(0,5 S, mín(S_zona, alto del coro / 2,4))`. En un dúo con coro a 1920 × 1080 sale ≈ 77 % de `S` (los cantantes, 100 %). El caso extremo «un renglón con …» de la spec **no** está implementado: solo se deja de dibujar lo que no cabe.

## Aplicado (conservador)

1. Cuenta en el ancla, como en la spec, aunque tape la próxima.
2. `S_coro` como arriba.

## Pregunta

1. Con la próxima ya en el sitio principal, ¿dónde va la cuenta? **Recomendada**: encima de la línea, entre la barra y el texto (barra a −1,5 `S`, cuenta a −0,9 `S`, puntos a +0,9 `S` como hoy), sin tapar la línea; en la zona del coro, que es baja, la barra pasa a la derecha de la cuenta.
2. ¿Basta el tamaño del coro así calculado, o quiere el 100 % de `S_zona` con la reducción solo cuando una línea concreta no cabe (forma menos estable)?

## Respuesta

Diseñador UX, 2026-11-23. Spec 07 («Disposición por zonas», fila «Indicadores de espera») y sistema visual · 0.2.3 («Tamaño en la zona del coro») actualizados. Visto en `espera-zona` a 1920 × 1080 y 1280 × 720: el «2» tapa «(Ah, ah, la marea)».

1. **Cuenta encima de la línea, en una sola fila con los demás indicadores** (variante de tu recomendación, igual en todas las zonas, también la del coro): fila centrada a `0,9 × S_zona` por encima del centro del primer renglón de la próxima; de izquierda a derecha, puntos · barra · cuenta, solo los activos y centrados como grupo; barra al 40 % del ancho de la zona (25 % si comparte fila); cuenta a `0,6 × S_zona`. Nada se dibuja sobre el texto. **Código**: en la disposición de indicadores por zona, sustituir las tres posiciones relativas (barra −0,9 S, cuenta en el ancla, puntos sobre la línea) por esa fila; sin zonas (bloque de 0.2.2), nada cambia.
2. **Tamaño del coro: tu fórmula estable, con la fila de indicadores incluida**: `S_coro = máx(0,5 S, mín(S_zona, alto_coro / 3,3))` (2,4 de dos renglones + 0,9 de la fila). **Código**: cambiar el divisor 2,4 por 3,3.
3. **Caso extremo del «…»: limitación aceptada en 0.2.3**, no se exige ahora. Una línea de coro que no cabe ni con `S_coro` mínimo no se dibuja (la regla «nunca cortada» de 0.2.2). Anotado en el sistema visual; QA lo añade a la guía manual y a las notas. Es raro (cuatro cantantes, coro y un coro de más de dos renglones).
