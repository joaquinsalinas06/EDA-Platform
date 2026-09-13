---
kind: operation
title: Update
order: 3
cppSteps:
  - step-4-update.cpp
  - full-implementation.cpp
---

<!-- El profesor es explícito en que esta operación NO es nueva: "¡el mismo
     Update que ya conocemos!" (página 34-35). Esta página no reexplica el
     mecanismo de segment-tree#update; sólo lo que cambia al reinterpretarlo
     sobre el eje del tiempo (Insert/Delete retroactivos como su punto de
     entrada). -->

## Qué hace

Implementa `Insert(t, op)` y `Delete(t)` retroactivos de la interfaz de
[retroactividad](/structures/retroactivity#estructura-interna): insertar o
eliminar una operación en el tiempo `t`, posiblemente pasado.

## Intuición

`Insert(t, op)` ocupa la hoja que representa el instante `t` con el efecto de
`op`; `Delete(t)` la deja en el elemento neutro de `f`. En ambos casos, eso
es exactamente lo que hace un
[Update de segment tree](/structures/segment-tree/operations/update):
escribir un valor nuevo en una hoja y recalcular el camino raíz-hoja hacia
arriba. No hay ninguna diferencia mecánica con el Update ya conocido — sólo
cambia qué significa la posición que se actualiza (un instante de tiempo, no
una celda de un arreglo).

## Algoritmo

Reduce directamente al [Update de segment tree](/structures/segment-tree/operations/update),
sin ningún paso adicional:

1. `Insert(t, op)`: llamar `Update(raíz, 1, m, t, efecto(op))` sobre el
   segment tree de tiempo — mismo algoritmo, sin modificación.
2. `Delete(t)`: llamar `Update(raíz, 1, m, t, neutro)` — vaciar la hoja `t`
   al elemento neutro de `f` (`0` para suma, `-∞` para máx, etc.).

## Pseudocódigo

```
Insertar/eliminar una operación en el tiempo t actualiza O(lg m) nodos del Segment Tree
(donde m es el número de operaciones) — ¡el mismo Update que ya conocemos!
```

(páginas 34-35). El pseudocódigo estructural completo — el camino raíz-hoja,
la comparación `i ≤ m` para decidir el lado, el recálculo al volver — es el
de [Update de segment tree](/structures/segment-tree/operations/update#pseudocódigo);
no se repite aquí para no duplicarlo.

## C++

Ver `step-4-update.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

`O(lg m)`. Textual (página 34-35): "Insertar/eliminar una operación en el
tiempo t actualiza `O(lg m)` nodos del Segment Tree (donde m es el número de
operaciones)". El argumento se hereda sin repetirse: el camino raíz-hoja de
un segment tree de `m` hojas tiene altura `⌈lg m⌉`, y cada nodo del camino
se recalcula en `O(1)`.

## Complejidad espacial

No la da el profesor. Heredada del
[Update de segment tree](/structures/segment-tree/operations/update):
`O(lg m)` de pila de recursión (o `O(1)` adicional en la variante iterativa).

## Ejemplo

Ver la visualización de
[Time-segment-tree-build](/structures/decomposable-search-problem/operations/time-segment-tree-build) —
`Insert(t=2, op)` con efecto `+5` toca el camino `[1,4] → [1,2] → [2,2]`, y
`Delete(t=2)` toca el mismo camino de vuelta, escribiendo el neutro `0` en
`[2,2]`.

## Casos límite

- **Insertar en un tiempo `t` ya ocupado**: el mazo no lo menciona (hueco
  del material — ver la nota de apoyo en `time-segment-tree-build.md`). La
  implementación de este tema lo trata como sobrescribir la franja `t`.
- **`Delete(t)` sobre un tiempo `t` vacío**: no cambia nada — escribir el
  neutro donde ya había el neutro es un Update válido, sólo redundante.
- **`m = 1`**: `Insert`/`Delete` escriben directamente en la única hoja, sin
  ningún nodo intermedio que recalcular (`⌈lg 1⌉ = 0`).
