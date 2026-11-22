# 034 — Cantantes en la cola y mando desde el móvil

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.12); referentes (Karaoke Eternal, Karaoke Mugen, KaraFun)
- Fecha: 2026-11-21
- Relacionadas: specs [02](../ux/02-biblioteca.md) y [07](../ux/07-reproductor.md) (fase 4); [ADR 0017](../adr/0017-ventana-secundaria-sesion-en-vivo-y-cola-de-reproduccion.md), [ADR 0008](../adr/0008-seguridad-de-electron-y-protocolos-propios.md); propuestas 001, 005 y 031

## Problema
La sesión en otra pantalla está pensada para una persona que maneja y canta.

- La cola no sabe quién canta. La pantalla del público muestra «A continuación» con el título, y alguien tiene que decir en voz alta a quién le toca.
- Todo se hace desde el ordenador principal. En una reunión, quien quiere pedir una canción tiene que ir hasta el ordenador o pedírselo a quien lo maneja.
- Los karaokes para fiestas lo resuelven con el móvil: en Karaoke Eternal los invitados escanean un QR y añaden canciones desde el navegador; Karaoke Mugen tiene una lista pública con modos restringido y cerrado; KaraFun ofrece mando desde el móvil y nombre del cantante por entrada.

## Propuesta
Dos etapas de tamaño muy distinto. La primera vale por sí sola.

**Etapa 1 · Nombre del cantante en la cola (S).**
- Al añadir a la cola se puede escribir quién canta (opcional), con los nombres ya usados en la sesión como sugerencia.
- El panel de cola lo muestra en cada entrada y la tarjeta «A continuación» de la pantalla del público dice «Canta: Ana».
- Aviso suave si la misma persona tiene dos entradas seguidas. Sin rotación automática.

**Etapa 2 · Pedir canciones desde el móvil (L).**
- Durante una sesión, la app ofrece una página en la red local. La pantalla del público muestra un QR entre canciones.
- Desde el móvil, un invitado ve las canciones listas, busca, escribe su nombre y pide una. No puede pausar, saltar ni borrar.
- Quien maneja decide el modo: «Las peticiones entran en la cola» o «Las peticiones esperan mi aprobación», y puede cerrarlo en cualquier momento.

Detalles para decidir:

- La etapa 2 solo funciona con la sesión abierta y se apaga al cerrarla. Desactivada por defecto.
- La página no pide instalar nada y solo se sirve en la red local.
- El QR se muestra en la cuenta entre canciones, nunca sobre la letra.

## Valor y coste
- Valor: la etapa 1, medio y barato. La etapa 2, alto en fiestas y nulo en uso individual.
- Coste estimado: etapa 1 S (un campo en la entrada de cola y dos textos). Etapa 2 L: servidor local, página para móvil, emparejamiento, moderación y un ADR de seguridad.
- Riesgos o dudas abiertas:
  - **Seguridad.** Abrir un servidor en la red local cambia el modelo del ADR 0008, que hoy no expone nada. Cortafuegos del sistema, redes de invitados que aíslan los dispositivos y redes públicas.
  - No hay evidencia de eventos con invitados en el uso real, y la sesión con dos pantallas sigue sin probarse en un equipo real.
  - No pude confirmar cómo funciona la rotación de cantantes en los referentes; por eso no se propone.
  - Recomendación: aprobar la etapa 1 cuando se toque la cola, y dejar la etapa 2 para después de un evento real.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
