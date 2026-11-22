# 032 — Saltar la introducción y los silencios largos, y ensayar una estrofa

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.11)
- Fecha: 2026-11-21
- Relacionadas: spec [07](../ux/07-reproductor.md) (controles, atajos, indicadores de espera); [ADR 0018](../adr/0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md) §3 (huecos); propuestas 015 y 030

## Problema
El reproductor solo se mueve en saltos fijos de 5 y 10 segundos y con la barra de tiempo.

- Al **probar** una canción recién sincronizada, lo que interesa es llegar a la primera línea y al siguiente verso. Con una primera línea a los 18 s (A Pesar de Mí), cada prueba empieza con 18 s de espera o con varias pulsaciones de `L`.
- En un **solo instrumental** largo, quien canta espera mirando la cuenta 3·2·1. La app ya sabe dónde están esos huecos: son los que superan el silencio mínimo (4,0 s en todas las canciones del usuario).
- Para **ensayar** una estrofa difícil hay que volver al editor, que es donde está el bucle.

## Propuesta
Tres acciones en el reproductor, apoyadas en los huecos que la app ya calcula:

1. **Saltar al canto.** Durante la introducción o un hueco largo, una tecla lleva a 4 segundos antes de la siguiente línea, con su indicador de espera. Fuera de un hueco no hace nada.
2. **Línea anterior y siguiente.** Dos teclas saltan al inicio de la línea anterior o siguiente, en vez de 5 segundos a ciegas.
3. **Repetir esta estrofa.** Una tecla activa el bucle de la estrofa actual (de pausa a pausa, o de hueco a hueco); otra pulsación lo quita.

Detalles para decidir:

- **Aviso en pantalla.** Durante un hueco largo, con los controles visibles, un botón «Saltar al canto» junto a la barra de tiempo. Nunca en la franja central reservada a la letra.
- **Teclas.** A decidir en la spec: el reproductor ya usa Espacio, K, J, L, M, V, F, flechas, Inicio y 0. Propuesta inicial: `S` para saltar, `,` y `.` para línea anterior y siguiente (libres desde 0.2.1), `R` para repetir.
- **Indicador breve.** «Al canto», «Línea anterior», «Repitiendo la estrofa», como los demás atajos.
- **En la sesión con cola.** «Saltar al canto» sí; el bucle de estrofa no se ofrece en la ventana del público.
- **Sin configuración.** No se añade un ajuste de «saltar siempre la introducción»: es una acción de quien maneja, canción a canción.

## Valor y coste
- Valor: medio. Ahorra esperas cada vez que se prueba una canción, que es lo que más se hace mientras se crea, y da una forma de ensayar.
- Coste estimado: S–M. Los huecos y las estrofas ya se derivan de la letra; el motor ya tiene bucle (fase 2 de 0.2.0). Falta la interfaz, los atajos y sus textos en los diálogos de ayuda.
- Riesgos o dudas abiertas:
  - El reproductor ya tiene muchos atajos; cuatro más hay que justificarlos uno a uno.
  - `S` se retiró del editor en 0.2.1 por confundir; reutilizarla en el reproductor con otro significado puede confundir otra vez.
  - No pude confirmar cómo lo resuelven UltraStar Deluxe o KaraFun.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
