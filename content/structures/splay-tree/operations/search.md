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
visualization:
  type: tree
  steps:
    - note: >-
        Buscar 27 en este árbol de 5 nodos. Es el descenso plano de
        [`Buscar`](/structures/bst-computational-model/operations/search)
        del modelo BST — todavía no hay ningún Splay, sólo comparar y bajar.
        Se arranca en la raíz.
      highlight: ["n20"]
      nodes:
        - { id: n20, value: 20, parent: null, state: active }
        - { id: n10, value: 10, parent: n20, side: left }
        - { id: n30, value: 30, parent: n20, side: right }
        - { id: n25, value: 25, parent: n30, side: left }
        - { id: n27, value: 27, parent: n25, side: right }
    - note: >-
        27 > 20: el valor buscado es mayor que la raíz, así que se descarta
        todo el subárbol izquierdo (10) y se desciende al hijo derecho, 30.
      highlight: ["n20", "n30"]
      nodes:
        - { id: n20, value: 20, parent: null, state: marked }
        - { id: n10, value: 10, parent: n20, side: left, state: muted }
        - { id: n30, value: 30, parent: n20, side: right, state: active }
        - { id: n25, value: 25, parent: n30, side: left }
        - { id: n27, value: 27, parent: n25, side: right }
    - note: >-
        27 < 30: ahora el valor buscado es menor que el nodo actual, así que
        se descarta el subárbol derecho de 30 (vacío en este ejemplo) y se
        desciende al hijo izquierdo, 25.
      highlight: ["n30", "n25"]
      nodes:
        - { id: n20, value: 20, parent: null, state: muted }
        - { id: n10, value: 10, parent: n20, side: left, state: muted }
        - { id: n30, value: 30, parent: n20, side: right, state: marked }
        - { id: n25, value: 25, parent: n30, side: left, state: active }
        - { id: n27, value: 27, parent: n25, side: right }
    - note: >-
        27 > 25: se descarta el subárbol izquierdo de 25 (vacío) y se
        desciende al hijo derecho, 27.
      highlight: ["n25", "n27"]
      nodes:
        - { id: n20, value: 20, parent: null, state: muted }
        - { id: n10, value: 10, parent: n20, side: left, state: muted }
        - { id: n30, value: 30, parent: n20, side: right, state: muted }
        - { id: n25, value: 25, parent: n30, side: left, state: marked }
        - { id: n27, value: 27, parent: n25, side: right, state: active }
    - note: >-
        27 = 27: encontrado, a profundidad 3. Aquí termina el descenso de
        `Buscar` — el trabajo de `Search` no termina todavía.
      highlight: ["n27"]
      nodes:
        - { id: n20, value: 20, parent: null, state: muted }
        - { id: n10, value: 10, parent: n20, side: left, state: muted }
        - { id: n30, value: 30, parent: n20, side: right, state: muted }
        - { id: n25, value: 25, parent: n30, side: left, state: muted }
        - { id: n27, value: 27, parent: n25, side: right, state: answer }
    - note: >-
        Search(27) llama Splay(27): el nodo encontrado sube por rotaciones
        hasta la raíz — ver
        [`splay`](/structures/splay-tree/operations/splay) para el
        detalle paso a paso de esa parte (zig/zig-zig/zig-zag no se
        repiten aquí, es la misma operación referenciada, no reexplicada).
      highlight: ["n27"]
      nodes:
        - { id: n27, value: 27, parent: null, state: answer }
        - { id: n25, value: 25, parent: n27, side: left }
        - { id: n20, value: 20, parent: n25, side: left }
        - { id: n10, value: 10, parent: n20, side: left }
        - { id: n30, value: 30, parent: n27, side: right }
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

$O(\log n)$ **amortizado** (#68: "Cada operación toma $O(\log n)$ (amortizado)").
El costo real de una llamada es descenso + Splay: el descenso cuesta
exactamente la profundidad de x (hasta $O(n)$ real, igual que en
[`bst-computational-model`](/structures/bst-computational-model/operations/search)),
y Splay cuesta lo mismo que esa profundidad (cada paso sube uno o dos
niveles). El profesor da la cota sólo para el promedio sobre una secuencia
de búsquedas, no para una búsqueda aislada, que en el peor caso real sigue
siendo $O(n)$.

## Complejidad espacial

$O(1)$ adicional.

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
  esta única búsqueda es $O(n)$ — la cota amortizada de $O(\log n)$ sólo se
  cumple promediada sobre la secuencia completa.
