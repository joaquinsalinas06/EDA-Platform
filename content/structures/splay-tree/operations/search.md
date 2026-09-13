---
kind: operation
title: Search
order: 5
cppSteps:
  - step-1-node.cpp
  - step-2-rotate.cpp
  - step-3-zig-zig.cpp
  - step-4-zig-zag.cpp
  - step-5-splay.cpp
  - step-6-search.cpp
  - full-implementation.cpp
---

## Qué hace

Es [`Buscar(x)`](/structures/bst-computational-model/operations/search) del
modelo BST, seguida siempre de
[`Splay(x)`](/structures/splay-tree/operations/splay): "siempre mueve el
valor de búsqueda x_i a la raíz del árbol mediante la función Splay" (#60).
Es lo que hace del splay tree un BST **autoajustable**: cada consulta
reorganiza el árbol.

## Intuición

Descender por el árbol como en cualquier BST hasta encontrar x, y entonces
subirlo hasta la raíz con Splay. La búsqueda en sí no tiene nada especial —
el mecanismo de descenso es exactamente el de
[`bst-computational-model`](/structures/bst-computational-model/operations/search);
lo que hace diferente al splay tree es lo que pasa **después** de encontrar
x, no cómo se busca.

## Algoritmo

1. `v ← raíz`; descender como en
   [`Buscar`](/structures/bst-computational-model/operations/search) del
   modelo BST hasta que `v.valor = x`.
2. `Splay(v)`.
3. `v` (con `x`) es ahora la raíz.

## Pseudocódigo

```
Algoritmo: Search(x)
v ← Buscar(x)          // descenso estándar, ver bst-computational-model
Splay(v)
devolver v             // v es ahora la raíz
```

## C++

Ver `step-6-search.cpp` y `full-implementation.cpp` en el editor de
arriba: `search(x)` desciende igual que un BST ordinario y termina con una
llamada a `splay(v)`.

## Complejidad temporal

O(log n) **amortizado** (#68: "Cada operación toma O(log n) (amortizado)").
El costo real de una llamada es descenso + Splay: el descenso cuesta
exactamente la profundidad de x (hasta O(n) real, igual que en
[`bst-computational-model`](/structures/bst-computational-model/operations/search)),
y Splay cuesta lo mismo que esa profundidad (cada paso sube uno o dos
niveles). El profesor da la cota sólo para el promedio sobre una secuencia
de búsquedas, no para una búsqueda aislada, que en el peor caso real sigue
siendo O(n).

## Complejidad espacial

O(1) adicional.

## Ejemplo

Ver [examples.md](/structures/splay-tree/examples).

## Casos límite

- **`x` es la raíz**: descenso de costo 0, y
  [`Splay`](/structures/splay-tree/operations/splay) es un no-op (x ya es
  raíz).
- **`x` no está en el árbol**: igual que en
  [`bst-computational-model`](/structures/bst-computational-model/operations/search),
  el profesor asume búsquedas siempre resolubles (#24); no se define el
  costo de una búsqueda fallida ni si se hace splay del último nodo
  visitado — la literatura estándar sí lo hace, pero eso excede el material.
- **Árbol degenerado en cadena, x es la hoja más profunda**: costo real de
  esta única búsqueda es O(n) — la cota amortizada de O(log n) sólo se
  cumple promediada sobre la secuencia completa.
