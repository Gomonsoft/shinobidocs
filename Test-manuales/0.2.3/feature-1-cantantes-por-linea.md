# Guía manual · 0.2.3 · Feature 1 · Cantantes por línea

> **No ejecutada todavía.** Recoge lo que las pruebas automáticas no pueden comprobar: un dúo real repartido de principio a fin (con ratón y sin él), el arrastre real entre carriles, legibilidad a distancia, daltonismo, la ventana secundaria y la compatibilidad con versiones anteriores. Lo demás de la feature lo cubren las pruebas ([informe](../../versiones/0.2.3/informe-feature-1.md)).

- Versión: 0.2.3 · Feature 1
- Specs: [06 · Feature 1](../../ux/06-editor.md#023--feature-1--cantantes-por-línea) (C1-E1 a E25) · [07 · Feature 1](../../ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla) (C1-R1 a R12) · [10 · Feature 1](../../ux/10-exportacion.md#023--feature-1--cantantes-en-el-video) · ADR [0029](../../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md)
- Informe: [informe-feature-1](../../versiones/0.2.3/informe-feature-1.md)
- Duración estimada: 1 h 45 min
- Requisitos: un monitor o televisor y, si puedes, una segunda pantalla; un reproductor de video externo; **un dúo real** (una canción tuya, lista y sincronizada, que cantan dos personas por turnos) y **las 2 canciones tuyas con coros entre paréntesis**; un simulador de daltonismo (el del sistema o una extensión del navegador sobre una captura); la copia de una biblioteca de 0.2.1 o una instalación de 0.2.1 si quieres hacer el caso 7.

## Preparación

1. Trabaja siempre sobre una copia: **no uses tu carpeta de datos real** para los casos con la semilla.
2. En `app/`: `npm run semilla -- --reparto --voces`. Crea (en `app/.datos-dev`, no en tu carpeta real) las canciones de la semilla de siempre y tres de esta versión: **Reparto: dúo con coros** (Ana y Luis, con Todos y Coro), **Reparto: un cantante con coros** y **Voces a la vez: dúo con coro** (esta es de la feature 3). Su audio es silencio: sirven para ver, no para oír.
3. `npm run dev` abre la aplicación con esa carpeta de datos. Para los casos con audio, usa tu copia de la biblioteca real de pruebas (memoria «canciones reales»).

## Casos

### 1. Repartir un dúo real de principio a fin

Criterios: C1-E2, C1-E3, C1-E5, C1-E7, C1-E8, C1-E13.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Abre tu dúo real en el editor. Pon en marcha un cronómetro. Funciones › «Cantantes y coros» › «Repartir entre varios cantantes». | Aparece el Cantante 2 con su nombre en edición y un carril vacío en la línea de tiempo («Arrastra aquí las líneas de…»). | ☐ |
| 1.2 | Nombra a los dos cantantes con los nombres reales. | Los chips de la lista pasan a la inicial de cada nombre (o «1» y «2» si dejas los predeterminados). | ☐ |
| 1.3 | Con el **ratón**: selecciona con Mayús + clic las líneas del segundo cantante y elige «¿Quién canta?» › su nombre. Repite para las líneas de los dos juntos con «Todos» y para algún coro. | Cada asignación es un paso de deshacer. Cada región cambia de carril sin moverse en el tiempo. | ☐ |
| 1.4 | Anota el tiempo que has tardado en repartir toda la canción. | Referencia de la spec: debería ser cómodo (unos pocos minutos para una canción de 4 min). Anota la cifra y si algún paso te confundió. | ☐ |
| 1.5 | Repite en otra canción **solo con el teclado**: C para abrir «¿Quién canta?», Alt + 1/2 para asignar, Alt + ↑/↓ para pasar a la parte vecina, Mayús + ↑/↓ para seleccionar un rango. | Todo se puede hacer sin ratón; el lector de pantalla (VoiceOver) anuncia «Línea para Luis.» o similar en cada asignación. | ☐ |
| 1.6 | Pulsa Ctrl/Cmd + Z tantas veces como asignaciones hiciste. | Vuelven las partes exactas de antes, de una en una. La letra, los tiempos y el estado de la canción no han cambiado. | ☐ |
| 1.7 | Pulsa Alt + 3 con dos cantantes. | No cambia nada y se anuncia que esta canción no tiene cantante 3. | ☐ |
| 1.8 | En macOS prueba Opción + 1/2 con teclado español y con teclado estadounidense. En Windows, prueba que AltGr + 1 **no** asigna. | Funcionan las dos distribuciones en macOS; AltGr no actúa. | ☐ |

### 2. Arrastre real entre carriles

Criterios: C1-E14, C1-E15.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Con tres carriles, arrastra el **cuerpo** de una región más de 8 px hacia el carril de otro cantante, con un movimiento algo torcido (también horizontal). | La región se asigna al carril de destino. Ningún tiempo cambia, aunque el gesto tuviera componente horizontal. El carril de destino se resalta y se ve la región arrastrada. | ☐ |
| 2.2 | Arrastra menos de 8 px. | Se comporta como un clic (selecciona la región). | ☐ |
| 2.3 | Empieza un arrastre y pulsa Esc. | Se cancela sin dejar paso de deshacer. | ☐ |
| 2.4 | Arrastra una región a «Suelta aquí para un cantante nuevo». | Se crea un cantante y se le asigna la línea en un solo paso. Con 4 cantantes la franja no aparece. | ☐ |
| 2.5 | Con 6 carriles (4 cantantes, Todos y Coro) a 1280 × 720, arrastra una línea hasta el carril del Coro, que es el último. | El carril del Coro es alcanzable durante el arrastre (no queda debajo de la vista general). | ☐ |
| 2.6 | Arrastra los **tiradores** de inicio y de fin de una región (no el cuerpo). | Cambian los tiempos como siempre; el cuerpo no cambia de carril. | ☐ |
| 2.7 | Reduce la ventana a 1024 × 576 con 4 o más carriles. | Los carriles se juntan solos (el botón queda inactivo con su explicación). Al agrandar la ventana vuelven. «Juntar carriles» no cambia. | ☐ |
| 2.8 | Pulsa «Juntar carriles» a mano, abre otra canción y reinicia la aplicación. | La preferencia se recuerda en las dos cosas. | ☐ |

### 3. Coros de tus canciones

Criterios: C1-E12.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Abre una de tus 2 canciones que traen los coros entre paréntesis (por ejemplo, 13 líneas de la forma «(Ah, ah…)»). | Aparece la sugerencia «N líneas van entre paréntesis: suelen ser coros.» con «Marcarlas como coro». | ☐ |
| 3.2 | Pulsa «Marcarlas como coro». | Las líneas pasan al Coro en un solo paso; la sugerencia desaparece. Una línea con un paréntesis solo al final no se marcó. | ☐ |
| 3.3 | Reproduce la canción a pantalla completa. | El coro sale arriba, entre un solo par de paréntesis, y sin insignia. Anota si alguna línea de coro tuya quedó mal asignada. | ☐ |

### 4. Legibilidad en pantalla (insignias a 5 m y cuarteto a 3–4 m)

Criterios: C1-R2 a C1-R8.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Reproduce «Reparto: dúo con coros» a pantalla completa y mírala desde 5 m. | Se sabe quién canta de un vistazo: cada parte en su zona y su color; la insignia («A», «L», «A·L» en Todos) se lee. Anota si la insignia se lee a esa distancia. | ☐ |
| 4.2 | Añade un tercer y un cuarto cantante a una copia de esa canción y reparte líneas entre los cuatro y el Coro. Mírala desde 3–4 m. | Cada línea está dentro de su zona, sin cortes; las zonas no se recolocan durante la canción; el icono de Todos (varias personas) se reconoce. | ☐ |
| 4.3 | Haz una captura de pantalla del dúo y pásala por el simulador de deuteranopía. | Con los colores predeterminados, se sigue sabiendo quién canta por la zona y la insignia. Sé atento a lo ya cantado en el cian de Luis: se ha visto poco distinto del blanco de lo que falta. Anótalo. | ☐ |
| 4.4 | Repite 4.1 en una ventana de 1440 × 1080 (4:3). | La línea más ancha con su insignia cabe y ninguna se corta. | ☐ |
| 4.5 | Reproduce con «Todas en un bloque» elegido en Estilo › Letra en pantalla › «Varias voces». | Un solo bloque como en 0.2.2, cada línea en el color de su parte, con insignia. | ☐ |

### 5. Ventana secundaria

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Con una segunda pantalla, abre la ventana secundaria y canta el dúo. | La secundaria muestra las mismas zonas, colores e insignias que la principal, sin desfase visible. | ☐ |
| 5.2 | Encola dos canciones: una con reparto y otra sin él. | Cada una se ve con su propio modelo (zonas en una; un solo bloque en la otra), sin restos de la anterior. | ☐ |

### 6. Video exportado

Criterios: C1-V1, C1-V2.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Exporta «Reparto: dúo con coros» a video y ábrelo en un reproductor externo. | El video muestra las mismas zonas, colores, insignias y paréntesis que el reproductor, en los mismos instantes. | ☐ |
| 6.2 | Exporta una canción **sin reparto** de la semilla y compárala con el mismo video hecho con 0.2.2. | Imagen idéntica a ojo (mismo puesto, mismas líneas y mismo barrido). | ☐ |

### 7. Compatibilidad: abrir en 0.2.1 y volver

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 7.1 | Copia tu biblioteca de pruebas con «Reparto: dúo con coros» a una instalación de 0.2.1 y ábrela. | La canción se ve y se reproduce **como una sola voz** (0.2.1 no conoce el reparto), sin error. | ☐ |
| 7.2 | **Sin editarla en 0.2.1**, vuelve a abrirla en 0.2.3. | Conserva el reparto completo (cantantes, nombres, Todos y Coro). | ☐ |
| 7.3 | Edita una línea y guarda **en 0.2.1**, y vuelve a 0.2.3. | Esperado: el reparto se ha perdido, porque 0.2.1 solo escribe los campos que conoce (medido: 0.2.1 lee la canción y descarta `partes` y `parte`). Anótalo si prefieres que se avise en las notas de la versión. | ☐ |
| 7.4 | Con 0.2.3, abre una canción de 0.2.1 sin reparto y mira las fechas de `cancion.json` y `temas.json` antes y después de abrir el editor y reproducir. | Las fechas no cambian: abrir no escribe. | ☐ |

### 8. Limitación aceptada: el coro que no cabe

Respuesta a la pregunta [0360](../../preguntas/0360-indicadores-de-espera-sobre-la-linea-en-una-zona-y-tamano-del-coro.md), punto 3: una línea de coro que no cabe ni con el tamaño mínimo de la zona del coro **no se dibuja** (no se corta), y es un caso raro. Esta prueba comprueba que es así y que no rompe nada.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 8.1 | En una copia de «Reparto: dúo con coros», añade tercer y cuarto cantante y reparte líneas. Escribe en el editor de la letra una línea de coro de unas 25 palabras (tres renglones en 1280 × 720) con paréntesis. | La canción se guarda sin error. | ☐ |
| 8.2 | Reprodúcela a pantalla completa (1280 × 720) y espera al coro largo. | La línea de coro larga **no aparece** (no sale cortada ni a medias); el resto de zonas sigue con normalidad y el barrido de los cantantes no se ve afectado. Anota si la ausencia se nota o confunde. | ☐ |
| 8.3 | Repite a 1920 × 1080. | Con más alto, la línea cabe o, si no, se comporta igual que en 8.2. | ☐ |
| 8.4 | Anota la limitación para las notas de la versión si el resultado es el esperado. | Queda registrado que el coro que no cabe desaparece (limitación aceptada de 0.2.3). | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
