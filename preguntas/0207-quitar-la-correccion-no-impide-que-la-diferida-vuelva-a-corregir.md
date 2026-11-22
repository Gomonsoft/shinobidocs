# 0207 — «Quitar la corrección» no impide una nueva corrección diferida
- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto
Por lectura de `main/letras/servicio.ts:282-298` (`corregirDesfaseDiferido`) y `main/index.ts:526` (`alListos` de los picos): la corrección sola solo exige `intacta === true`, sin `desfase_corregido_ms`, borrador y editor cerrado. «Quitar la corrección» (toast [Deshacer] o vista Letra) borra `desfase_corregido_ms` pero no toca `intacta` (solo la retiran cambios de tiempos, `shared/letras/retirar.ts`). Si los picos se vuelven a generar (Re-separar pistas, caché borrada), la letra se corrige otra vez sin que el usuario lo pida. No se ha reproducido; es por lectura.

## Pregunta
¿Se acepta que «Quitar la corrección» retire `intacta` (o marque «rechazada») para que la diferida no vuelva a actuar? Severidad baja.
