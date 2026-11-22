# 0155 — Decisiones provisionales de UX de 0.2.2 (features 1 a 3)

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no (opciones provisionales aplicadas en las specs; ver cada punto)

## Contexto

Regla del [plan de 0.2.2](../versiones/0.2.2/plan-4.md#regla-de-decisión): se aplica la opción que recomiendo, la marco en la spec como «decisión provisional» y las reúno aquí. Puedes cambiar cualquiera al revisar. Ninguna cambia datos guardados de forma irreversible.

Specs: [07 · Feature 1](../ux/07-reproductor.md#022--feature-1--letra-en-pantalla-con-varios-enunciados) y [Feature 2](../ux/07-reproductor.md#022--feature-2--resaltado-que-no-depende-solo-del-color), [06 · Feature 1](../ux/06-editor.md#022--feature-1--letra-en-pantalla) y [Feature 2](../ux/06-editor.md#022--feature-2--resaltado-que-no-depende-solo-del-color), [08 · Feature 3](../ux/08-ajustes-y-acerca.md#022--feature-3--aviso-de-versión-nueva), [09 · Feature 3](../ux/09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva).

## Pregunta

### Feature 1 · Letra en pantalla

Las once decisiones del plan siguen aplicadas tal cual (ajustes en el tema; lo existente pasa a 5 líneas; 1 ya cantada por defecto; ya cantada solo con 4 o más; hasta 2 con 6 o 7; «Fundido» y «Sin animación»; dos tiempos; futuras a la vista en las pausas; dos renglones con forma estable; activa del mismo tamaño; la exportación usa el tema). Al convertir la exploración en spec he concretado esto:

1. **Cuándo hay «un solo movimiento» y cuándo «dos tiempos».**
   - **A (provisional).** Si entre el fin de una línea y el inicio de la siguiente pasa menos que la duración de la animación (350 ms en «Desplazamiento», 250 ms en «Fundido»), la línea espera en su sitio y el bloque se mueve una sola vez. Con un hueco mayor, dos tiempos.
   - B. Siempre dos tiempos, aunque el hueco sea de 10 ms (dos movimientos encadenados casi a la vez).
2. **«Cambio de línea» en el panel Estilo.**
   - **A (provisional).** Tres opciones en vertical, cada una con su explicación debajo (no caben en una fila a 300 px de ancho).
   - B. Una lista desplegable.
3. **«Ver un ejemplo» de la letra en pantalla.**
   - **A (provisional).** Dura 12,5 s, sin audio: tres cambios seguidos, una pausa de 3 s y una entrada. Además se reproduce solo al elegir otro tipo de cambio de línea.
   - B. Solo al pulsar el botón.

### Feature 2 · Resaltado que no depende solo del color

4. **Alcance.** La propuesta 033 trae cuatro piezas.
   - **A (provisional).** Entran el **subrayado de lo ya cantado** y el **aviso de colores que se confunden con daltonismo**. El fondo de lectura, el contorno de la letra y el tema «Alta legibilidad» quedan para más adelante: son legibilidad de la letra sobre el fondo, no resaltado, y con 5 a 7 líneas el fondo de lectura necesita un diseño propio.
   - B. Entra la propuesta entera.
5. **Refuerzo: una sola opción.**
   - **A (provisional).** Una casilla «Subrayar lo ya cantado». No se ofrece «Color y contorno»: a 5 m y en las líneas pequeñas no se distingue.
   - B. Las tres opciones de la propuesta (solo color, subrayado, contorno).
6. **Ajuste para todo el equipo.**
   - **A (provisional).** Además de la casilla del tema, hay una casilla en Ajustes → Reproductor, «Subrayar siempre lo ya cantado», para activarlo en todas las canciones de una vez (por ejemplo, si canta alguien con daltonismo). No afecta a los videos exportados: esos usan lo del tema.
   - B. Solo en el tema.
7. **Por defecto.**
   - **A (provisional).** Apagado: ninguna canción existente cambia.
   - B. Encendido en todas.
8. **Nivel del aviso nuevo.**
   - **A (provisional).** ⚠ como los demás avisos de contraste, con el botón «Subrayar lo ya cantado». Desaparece al activar el subrayado.
   - B. Solo informativo (ⓘ).

Añadidas tras implementar la feature 2 (2026-11-22):

14. **Subrayado con tiempos por palabra.** ([0215](0215-espacio-entre-palabras-en-el-subrayado.md))
    - **A (provisional).** Un tramo de subrayado por palabra; los espacios entre palabras no se subrayan (como el barrido, que tampoco los pinta). Sin tiempos por palabra, el subrayado es continuo.
    - B. Subrayar también los espacios: exige rehacer cómo se colocan las palabras y puede cambiar dónde se parte un renglón.
15. **El aviso de daltonismo salta con el tema de pruebas «Neón»** (letra casi blanca `#E8F1FF`, resaltado cian claro `#4DE1FF`).
    - **A (provisional).** El aviso es correcto y el umbral no cambia: con daltonismo esos dos colores solo se distinguen por luminosidad y entre sí apenas tienen contraste (1,36:1). «Neón» es un tema de la semilla de desarrollo, no se distribuye; el tema de serie «Shinobi» no avisa. Si uno de tus temas reales avisa y crees que se lee bien, dímelo y lo revisamos con el arquitecto.
    - B. Hacer el aviso menos estricto para que «Neón» no avise (dejaría pasar pares que se confunden de verdad).

### Feature 3 · Aviso de versión nueva

9. **Activado por defecto.**
   - **A (provisional).** Sí. La bienvenida lo dice en una línea, las notas de la versión lo cuentan y se desactiva en Ajustes → Acerca de. Quien actualice desde 0.2.1 no ve la bienvenida: se entera por las notas y por Ajustes.
   - B. Apagado hasta que el usuario lo active.
   - C. Preguntar la primera vez con un diálogo.
10. **Dónde se ve.**
    - **A (provisional).** Un punto en el botón ⚙ (se quita al entrar en Ajustes) y una línea en Acerca de. Sin diálogo ni toast.
    - B. Además, un toast una vez al detectarla.
11. **«Descargar».**
    - **A (provisional).** Abre el navegador con la descarga directa del instalador de tu sistema (en Linux, el `.deb` o el AppImage según cuál uses). «Ver novedades» abre la página de la versión.
    - B. Los dos botones abren la página de la versión.
12. **Versiones preliminares.**
    - **A (provisional).** Quien usa una preliminar recibe avisos de preliminares y estables; quien usa una estable, solo de estables. No hay opción para «apuntarse» a las preliminares desde una estable.
    - B. Añadir esa opción en Ajustes.
13. **Con qué frecuencia.**
    - **A (provisional).** Al arrancar si han pasado 24 h desde la última consulta, y cada 24 h si la app sigue abierta.
    - B. Solo al arrancar.

## Opción provisional tomada (si no bloquea)

La A en todos los puntos.

## Respuesta
