# 0389 — Pantalla de error de la interfaz: decisiones provisionales
- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no

## Contexto

Incidencia I-1 de las pruebas en Windows ([nota](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md)): una excepción al dibujar deja la ventana en negro, sin mensaje ni registro. El plan 6 (punto 1a) añade un límite de errores. La spec está en [00 · Pantalla de error de la interfaz](../ux/00-mapa-de-vistas.md#pantalla-de-error-de-la-interfaz).

## Pregunta

¿Te parecen bien estas decisiones? Se aplican ya como provisionales.

## Opción provisional tomada (si no bloquea)

1. **Tres límites**: uno por vista (la barra superior sigue viva y un fallo del editor no se lleva el resto de la app), uno para el reproductor a pantalla completa (al salir se vuelve al editor intacto) y uno global para la ventana. La ventana secundaria muestra al público solo «El reproductor se ha detenido.», sin detalles.
2. **Salidas sin reiniciar la app**: «Volver a cargar esta pantalla» (vuelve a montar la vista) e «Ir a la Biblioteca»; en el caso global, «Volver a cargar la ventana». Si la vista vuelve a fallar en menos de 10 s, se recomienda ir a la Biblioteca.
3. **Trabajo del editor**: al fallar, se envía lo pendiente de guardar (hoy el código lo descartaría) y la pantalla dice si quedó guardado. Se pierde el historial para deshacer de esa visita, y se avisa.
4. **Diagnóstico**: «Copiar detalles» (sin letras ni títulos de canciones) y «Abrir la carpeta de registros» dentro de un plegable, para que la pantalla no asuste. Si el arquitecto no quiere ahora la llamada para abrir la carpeta, ese botón se omite.

## Respuesta
