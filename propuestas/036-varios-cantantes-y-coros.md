# 036 — Varios cantantes y coros

- Estado: Aceptada para 0.2.3 (etapas 1 y 2)
- Origen: usuario (2026-11-22)
- Fecha: 2026-11-22
- Relacionadas: [exploración](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md), preguntas [0160](../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md) y [0161](../preguntas/0161-viabilidad-tecnica-de-varios-cantantes-y-coros.md), features 1, 2, 4, 9, 10 y 11 de [0.2.2](../versiones/0.2.2/plan-4.md), ADR 0006 y 0022, propuesta [034](034-cantantes-en-la-cola-y-mando-desde-el-movil.md)

## Problema

Hoy toda la letra la canta una sola voz: en un dúo no se sabe qué línea es de quién, los coros se ven igual que la voz principal y quien canta sin voz guía no oye los coros que nadie hace. En la biblioteca del usuario, 2 de 17 canciones ya traen coros entre paréntesis desde LRCLIB (13 líneas enteras y unas 7 con un eco al final).

## Propuesta

Cada línea tiene una parte (Cantante 1 a 4, «Todos» o «Coro»). En el editor se asigna con un menú, la tecla C, selección múltiple o arrastrando la línea a otro carril de la línea de tiempo; en pantalla, lo cantado se pinta en el color de cada cantante con una insignia con su inicial, y el coro va entre paréntesis. En las líneas de coro, la voz original sube al volumen elegido para la canción. Más adelante: voces a la vez (columnas «Reparto» y grupos en pantalla) y cambio de cantante a mitad de línea.

## Valor y coste

- Valor: dúos y grupos en fiestas; coros que se oyen sin voz guía; base para cantar acompañado. Una canción de un solo cantante no cambia.
- Coste estimado: etapa 1 M–L (datos, lista, línea de tiempo, Estilo, render); etapa 2 S–M (audio y exportación); etapa 3 L (reglas de la letra y modelo de pantalla); etapa 4 M.
- Riesgos o dudas abiertas: la voz separada lleva juntas la principal y los coros; las voces a la vez cambian reglas que usan cinco funciones; conviene ajustar ahora los contratos de las features 1 y 2 de 0.2.2 para no rehacerlas.
- Recomendación del diseñador: versión propia 0.2.3 con las etapas 1 y 2; etapas 3 y 4 en 0.3.0.

## Decisión

Aceptada por el usuario el 2026-11-22 para la versión **0.2.3** (etapas 1 y 2: líneas enteras por cantante con carriles, colores e insignia, y voz original en los coros). Las etapas 3 y 4 quedan para más adelante. 0.2.2 no cambia de alcance: solo se prepara con seis ajustes sin efecto visible en las tareas 0287, 0289, 0290, 0293, 0294 y 0296. Indicación del usuario: los cantantes los añade el usuario en cada canción y cada uno tiene su carril desde que se crea. Plan: [0.2.3](../versiones/0.2.3/plan-5.md).
