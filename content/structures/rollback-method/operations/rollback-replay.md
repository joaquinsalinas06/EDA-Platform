---
kind: operation
title: "Deshacer y rehacer (rollback-replay)"
order: 1
cppSteps:
  - step-1-log-structure.cpp
  - step-2-naive-recompute.cpp
  - step-3-rollback-replay.cpp
  - full-implementation.cpp
---

## Qué hace

Implementa `Insert(t, op)` y `Delete(t)` retroactivos — insertar o eliminar
una operación en el tiempo `t` del [log de retroactividad](/structures/retroactivity) —
cuando la estructura no cumple ni conmutatividad ni invertibilidad
combinadas ni es un problema de búsqueda descomponible: el único recurso
genérico que queda.

## Intuición

No hay atajo: para que el cambio en `t` se refleje en el presente, hay que
"reproducir" de nuevo, en orden, todas las operaciones que ocurrieron
después de `t` — porque cualquiera de ellas pudo depender del estado que el
cambio en `t` acaba de alterar. Antes de poder reproducirlas, hay que
"rebobinar" la estructura hasta justo antes de `t`, deshaciendo esas mismas
operaciones en orden inverso.

## Algoritmo

Textual del profesor (páginas 39-40, diapositiva 18):

1. Guardar la secuencia completa de operaciones (el log).
2. Deshacer (rollback) todas las operaciones posteriores a `t`.
3. Aplicar el cambio (insertar `op` en `t`, o eliminar la operación que
   estaba en `t`).
4. Rehacerlas (replay) en orden.

Requiere que cada operación (y su inversa) sea `O(1)` u `O(lg n)` —
cualquier estructura eficiente y reversible sirve.

## Pseudocódigo

```
Método de rollback (para Insert(t, op) o Delete(t)):
1. Guardamos la secuencia completa de operaciones (un log).
2. Deshacemos (rollback) todas las operaciones posteriores a t.
3. Aplicamos el cambio.
4. Las rehacemos en orden.

Requiere: que cada operación (y su inversa) sea O(1) u O(lg n)
          — cualquier estructura eficiente y reversible sirve.

Costo: O(r) × (costo de una operación individual),
       donde r = número de operaciones después de t.
```

## C++

Ver `step-3-rollback-replay.cpp` y `full-implementation.cpp` en el editor de
arriba. `full-implementation.cpp` cuenta explícitamente cuántas operaciones
se deshicieron/rehicieron por cada llamada — es la cifra que hace visible el
costo del método (ver [amortized-cost](/structures/rollback-method/operations/amortized-cost)).

## Complejidad temporal

`O(r) × (costo de una operación individual)`, con `r` = número de
operaciones posteriores a `t` en el log — deshacer `r`, aplicar 1, rehacer
`r`. Razonamiento completo en
[amortized-cost](/structures/rollback-method/operations/amortized-cost).

## Complejidad espacial

> **Nota de apoyo** (no está en las diapositivas): el profesor no cuantifica
> el espacio del log. Implícitamente hace falta guardar las `m` operaciones
> completas (y ser capaz de reconstruir/almacenar su inversa), es decir
> `O(m)` operaciones guardadas, donde `m` es el tamaño total del log.

## Ejemplo

Ver [examples.md](/structures/rollback-method/examples) — el profesor no
trae valores concretos en esta sección; los ejemplos ahí están derivados y
marcados como tales.

## Casos límite

- **`t` cerca del presente**: `r` es pequeño, el método es barato (página
  42).
- **`t` muy atrás en la historia**: `r ≈ m` (el tamaño completo del log), tan
  caro como rehacer toda la secuencia desde cero (página 42).
- **No lo menciona el profesor**: qué pasa si `t` cae en un tiempo ya
  ocupado por otra operación, ni qué pasa si alguna operación en el rango a
  rehacer no es invertible — el método simplemente deja de aplicar, pero el
  mazo no lo dice explícitamente.
