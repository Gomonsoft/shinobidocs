# 023 — Revisión guiada de líneas dudosas

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §2.4 y §3.6); uso real
- Fecha: 2026-11-21
- Relacionadas: spec [06](../ux/06-editor.md) (fases 5, 8 y 9); propuestas 016, 019, 020 y 022

## Problema
Después de aplicar una letra o de «Ajustar los silencios», nada indica qué líneas merece la pena mirar.

- El usuario elige entre fiarse o repasar la canción entera. Final Ruin estuvo abierta 56 minutos entre su creación y su última modificación; Semestre de Otoño, 2 minutos y con 42 de 43 fines automáticos.
- «Ajustar los silencios» deja errores de hasta 4,7 s en alguna línea (informe de QA), mezclados con líneas correctas.
- Cuanto más haga la app sola (019, 020, 022), más importa señalar dónde puede haberse equivocado.

## Propuesta
Un modo «Revisar» en el editor que lista las líneas sospechosas y las recorre una a una: escucha la línea con su barrido, y el usuario la da por buena o la corrige antes de pasar a la siguiente.

Detalles para decidir:

- **Qué hace sospechosa a una línea** (sin modelos, con lo que ya hay):
  - el fin cae en mitad de la voz o mucho después de que acabe (picos de voz);
  - el inicio cae en silencio;
  - canta demasiado deprisa o demasiado despacio para su número de caracteres;
  - dura menos de medio segundo o se solapa con la siguiente;
  - con la 019: confianza baja del alineador.
- **Dónde.** Botón «Revisar (5)» en la pestaña «Funciones» y destino del botón «Revisar» de una tarjeta «Lista para revisar» (020). El número es el de líneas señaladas.
- **Cómo se recorre.** La línea señalada se selecciona, suena con medio segundo de margen (el doble clic de 0.2.1) y un panel dice el motivo: «El fin llega 1,2 s después de la voz». Acciones: «Está bien» (N), «Fin al final de la voz» (propuesta 016), «Abrir en el editor preciso» (P), «Anterior».
- **En la lista de líneas.** Marca discreta en las filas señaladas, con el motivo en el tooltip, también fuera del modo.
- **Final.** Al acabar: «Revisadas 5 líneas. ¿Marcar como lista?». Sin líneas señaladas: «No vemos nada raro. Puedes probarla a pantalla completa.»
- **Memoria.** Una línea dada por buena no vuelve a señalarse salvo que cambien sus tiempos.

## Valor y coste
- Valor: alto. Convierte la revisión de una canción en unos minutos y da confianza en lo automático.
- Coste estimado: M. Función pura de detección sobre letra y picos, modo de recorrido con teclado, marcas en la lista y una marca por línea en el archivo.
- Riesgos o dudas abiertas:
  - Demasiadas señales la vuelven inútil: los umbrales deben dejar pocas líneas por canción. Hay que calibrarlos con las 12 canciones.
  - Líneas correctas pero raras (un grito largo, un recitado rápido) saldrán señaladas; por eso «Está bien» se recuerda.
  - Coste de foco y teclado: es otro modo dentro de un editor que ya tiene «Sincronizar al ritmo» y la ventana del editor preciso.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
