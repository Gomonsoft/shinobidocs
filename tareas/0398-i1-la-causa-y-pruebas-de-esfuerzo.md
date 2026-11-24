# 0398 — I-1 · La causa de la pantalla en negro y pruebas de esfuerzo del editor
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0396, 0397
- ADRs: 0029
- Spec UX: docs/ux/06-editor.md (sin cambios)
- Tamaño: M
- Versión: 0.2.3 ([plan 6](../versiones/0.2.3/plan-6.md), punto 1b)

## Objetivo
Encontrar la excepción que vaciaba el editor, corregirla con una prueba que la reproduzca, y dejar pruebas de esfuerzo.

## Causa encontrada
`PantallaLetra.tsx` guardaba el último fotograma de la reproducción en un estado (`vivo`) que nunca se invalidaba, y mientras sonaba lo usaba tal cual aunque las zonas ya fueran otras. Si el número de zonas cambiaba (Estilo › «Varias voces»; añadir un cantante, p. ej. soltando una región en la franja «cantante nuevo»; el primer coro) con la canción sonando o la vista previa de un ejemplo en marcha, o se reanudaba la reproducción con un `vivo` de antes del cambio, `zonas.map((zona, i) => fotogramas[i]!)` leía un fotograma que no existía y `f.espera` lanzaba `TypeError: Cannot read properties of undefined (reading 'espera')` al dibujar. Sin límite de errores, React desmontaba todo el árbol. Encaja con los cuatro disparadores de I-1 (soltar una región en un carril o franja que cambia el número de zonas; doble clic en una línea del cantante 3, que arranca el audio con un `vivo` anterior a su creación; cambiar «Varias voces») y con que solo ocurriera tras un rato de uso (hace falta haber reproducido antes).
Corrección: el fotograma en vivo se guarda junto a las zonas con las que se calculó y solo se usa si son las vigentes; si no, se calcula en el instante del audio (`PantallaLetra.tsx`, el estado `vivo` y el cálculo de `fotogramas`).

## Pruebas
- `PantallaLetra.cambioDeZonas.test.tsx`: reproduce el `TypeError` (3 casos). Fallan sin la corrección.
- `editor.propiedades.test.tsx`: secuencias aleatorias (asignar, añadir y quitar cantantes, deshacer, rehacer, «Varias voces», seleccionar) con la pista y la vista previa montadas y la canción sonando o no. Sin la corrección fallan 6 de 8 semillas; con ella pasan, y 300 semillas × 40 pasos (ejecución puntual) tampoco encuentran otra excepción.
- E2E `editor-arrastre.spec.ts` (B1): arrastre real con el ratón de un cantante a otro, a Todos, a Coro y a la franja «cantante nuevo», con deshacer, sobre la semilla de reparto y la de voces; a 1713 × 1336 con «Ver canción completa» la franja aparece.
- E2E `editor-esfuerzo.spec.ts` (B2): 40 pasos pseudoaleatorios con el audio sonando. Sin la corrección el editor se queda vacío; con ella, no.

## Notas de implementación
Descartado con pruebas (sin fallo en 300 secuencias, el E2E de arrastre y las pruebas de la pista): `PistaSincronia` (filas virtuales, `subfilasJuntas`, índices de `tops`/`filas`), `parteDe` con cantantes quitados o `todos` con un cantante, la caché de `zonasDeLetra`, deshacer y rehacer con `partes`, y cambios en el número de hooks. La franja «cantante nuevo» sigue como estaba (propuesta 041 sin decidir).
