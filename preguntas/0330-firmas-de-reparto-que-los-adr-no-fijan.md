# 0330 — Firmas de `shared/reparto.ts` que el ADR 0029 deja abiertas

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (opción conservadora aplicada en la tarea 0340)

## Contexto

La tarea 0340 declara las funciones de ADR 0029 §3. La tabla da el nombre y «qué devuelve», pero no todas las firmas.

## Aplicado (fijar en ADR 0029 §3 si el arquitecto lo ve bien)

1. **`parteDe(linea, letra?)`**: el ADR escribe `parteDe(linea)`. La lectura tolerante de §1 («un cantante que no existe, o `todos` con un solo cantante, se lee como `c1`») necesita la letra, así que se añade un segundo argumento **opcional**. Sin él, solo mira el campo. El esquema de zod no repara `lineas[].parte` (solo la saca del catálogo); quien pinte o cuente debe usar `parteDe(linea, letra)`.
2. **`textoEnPantalla(linea)`** devuelve `{ texto, parentesis: boolean }`: `texto` es el guardado, sin tocar, y `parentesis` indica si el render debe dibujarlos (solo `coro` y si el texto no los trae).
3. **`recuentoPorParte(letra)`** devuelve `Record<Parte, number>` con las seis partes (líneas, no pausas).
4. **`inicial` / `insignia`** devuelven `{ tipo: "texto", texto } | { tipo: "icono", icono: "users" }` (o `null` en `insignia`). Con dos iniciales en choque se usan dos letras (primera en mayúscula, segunda en minúscula: «An», «Al»); un nombre que no empieza por letra o número usa el número de ranura.
5. **`asignar`** con una parte no disponible (cantante que no existe, `todos` con un solo cantante) devuelve la **misma** letra sin cambios (no lanza). `anadirCantante` con 4 cantantes y `quitarCantante('c1')` igual.
6. **Funciones extra** (no inventan contrato): `cantantesDe(letra)` (lectura tolerante de `partes.cantantes`), `vozEnCoros(letra)` (nivel o 0,5), `nombreNormalizado` y `validarReparto(letra)` (invariantes de escritura de §1, para main en 0341; lista de problemas vacía si es válido).
7. **`normalizarReparto`** conserva un `voz_en_coros` explícito (incluido 0,5) mientras `partes` siga existiendo, para que abrir y guardar no cambie el archivo. Una línea `coro` en una letra sin `partes` no obliga a crearla.
8. **`estilosIguales`** compara además `pantalla.zonas` con «ausente = `por_parte`».
9. **`colores_partes`**: se quitó la ranura `c1` del esquema (la reserva de 0.2.2 la admitía): una clave `c1` se ignora al leer y no se vuelve a escribir.
10. **`guardarTiemposSchema`** valida, solo cuando llega `partes`, que cada `parte` apunte a un cantante de esa lista y que `todos` tenga 2 o más; con `partes: null` solo se admite `coro`. «`parte` solo en líneas» lo comprueba main (el elemento de tiempos no lleva `tipo`).
11. **Semilla**: las dos canciones de ejemplo (`sembrar(datos, { reparto: true })`, `npm run semilla -- --reparto`, ids `…0050` y `…0051`) son opt-in para no cambiar los recuentos de las pruebas existentes.

## Respuesta

Arquitecto, 2026-11-23. **Se confirman los once puntos sin cambios de código.** Quedan fijados en ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), revisión «Firmas de `shared/reparto.ts` (pregunta 0330)». Dos precisiones, que no cambian lo implementado:
- **Punto 7**: conservar un `voz_en_coros` explícito vale mientras `partes` exista. La regla de §1 para **quitar** `partes` (solo `c1` sin nombre, sin `todos` ni `coro` y nivel ausente o 0,5) sigue mandando: un 0,5 explícito no impide quitarlo. Si el código ya lo hace así, basta con un test que lo fije. Si no, el cambio es en `normalizarReparto`: tratar `voz_en_coros === 0.5` como «ausente» **solo** al decidir si se quita `partes`.
- **Punto 1**: quien pinta, cuenta o exporta usa siempre `parteDe(linea, letra)`, con la letra. La forma sin letra queda para el esquema y los tests.
