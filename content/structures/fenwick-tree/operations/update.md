---
kind: operation
title: Update
order: 1
cppSteps:
  - step-1-lowbit.cpp
  - step-2-update.cpp
  - step-3-prefix-query.cpp
  - full-implementation.cpp
---

<!-- Concepto de apoyo: no hay diapositiva que citar (sourceSlides vacío). -->

## Qué hace

Suma un valor `delta` a la posición `i` del arreglo, y propaga el cambio a
todos los rangos que incluyen a `i`.

## Intuición

Un rango `tree[j]` incluye a la posición `i` si y sólo si `j` es uno de los
índices que se alcanza subiendo desde `i` con `j += lowbit(j)`. No hace
falta saber cuáles son de antemano: el propio lowbit los genera uno a uno.

## Algoritmo

1. Mientras `i ≤ n`: sumar `delta` a `tree[i]`.
2. Avanzar `i ← i + (i & -i)`.
3. Repetir hasta que `i` supere `n`.

## Pseudocódigo

```
Update(tree, n, i, delta)
mientras i ≤ n
    tree[i] ← tree[i] + delta
    i ← i + (i & -i)
```

## C++

Ver `step-2-update.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

$O(\lg n)$: cada paso apaga y sube al menos un bit de `i`; con $\lceil \lg n \rceil$ bits en
total, el ciclo termina en a lo más esa cantidad de iteraciones (ver
theory.md).

## Complejidad espacial

$O(1)$ adicional: no hay recursión, sólo un ciclo.

## Ejemplo

Para `n = 8`, `Update(i=3, delta=+5)` toca `tree[3]` (rango `(2,3]`),
`tree[4]` (rango `(0,4]`) y `tree[8]` (rango `(0,8]`): `3 → 4 → 8 → 16`
(`16 > 8`, termina). `tree[5], tree[6], tree[7]` no cambian porque sus
rangos no incluyen la posición 3.

## Casos límite

- **i = n**: sólo toca `tree[n]` y termina de inmediato (`n + lowbit(n) >
  n` siempre).
- **Actualizar con `delta = 0`**: el algoritmo no lo detecta como especial;
  recorre el mismo camino sin cambiar ningún valor.
- **i fuera de `[1, n]`**: no está definido aquí; se asume `1 ≤ i ≤ n` como
  precondición.
