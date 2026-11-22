# 0207 — «Quitar la corrección» no impide una nueva corrección diferida
- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto
Por lectura de `main/letras/servicio.ts:282-298` (`corregirDesfaseDiferido`) y `main/index.ts:526` (`alListos` de los picos): la corrección sola solo exige `intacta === true`, sin `desfase_corregido_ms`, borrador y editor cerrado. «Quitar la corrección» (toast [Deshacer] o vista Letra) borra `desfase_corregido_ms` pero no toca `intacta` (solo la retiran cambios de tiempos, `shared/letras/retirar.ts`). Si los picos se vuelven a generar (Re-separar pistas, caché borrada), la letra se corrige otra vez sin que el usuario lo pida. No se ha reproducido; es por lectura.

## Pregunta
¿Se acepta que «Quitar la corrección» retire `intacta` (o marque «rechazada») para que la diferida no vuelva a actuar? Severidad baja.

## Respuesta

Arquitecto, 2026-11-22. Es un defecto; se corrige con una marca y **no** retirando `intacta`. `intacta` significa «ningún tiempo de línea editado» y la usa la preparación para seguir con los fines (ADR 0025); quitar la corrección no cambia ningún tiempo de línea. Regla fijada en ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), «Revisión 2026-11-22 (pregunta 0207)», y en la tarea nueva [0369](../tareas/0369-quitar-la-correccion-impide-la-diferida.md) (S, alpha.1; la 0367 ya estaba hecha).

**Regla**: quitar una corrección que existía (vista Letra, editor o [Deshacer] del toast de la diferida) deja `letra.desfase_descartado: true`. Con esa marca, la comprobación diferida y la preparación no vuelven a corregir solas esa letra; el usuario sí puede corregirla a mano. Una letra nueva nace sin la marca.

**Cambios de código**:
1. `app/src/shared/letra.ts`, en `letraSchema`, junto a `desfase_corregido_ms` (línea 285): `desfase_descartado: z.literal(true).optional().catch(undefined),`.
2. `app/src/main/letras/servicio.ts`, en `guardarTiempos` (hacia las líneas 384–393): si `letra.desfase_corregido_ms !== undefined && peticion.desfase_corregido_ms === null`, la letra resultante lleva `desfase_descartado: true`. En cualquier otro caso se conserva el valor guardado (el spread de la letra ya lo hace). Un `null` sin corrección previa no pone la marca.
3. `app/src/main/letras/servicio.ts`, `corregirDesfaseDiferido` (línea 286): la condición de salida pasa a `if (letra.intacta !== true || letra.desfase_corregido_ms !== undefined || letra.desfase_descartado === true) return null`.
4. `letras.guardar` (letra nueva): no copia la marca. Ya pasa, porque construye la letra desde cero; un test lo fija.

**Tests** (`app/src/main/letras/servicio.test.ts`):
- (a) con una corrección guardada, `guardarTiempos` con `desfase_corregido_ms: null` deja `desfase_descartado: true` y quita `desfase_corregido_ms`;
- (b) después, `corregirDesfaseDiferido(id, 800)` devuelve `null` y `offset_ms` no cambia;
- (c) `desfase_corregido_ms: null` sin corrección previa no pone la marca;
- (d) `guardar` de una letra nueva sobre una canción marcada deja la letra sin marca;
- (e) en `letra.test.ts`: lectura tolerante (un valor no válido se lee como ausente).
