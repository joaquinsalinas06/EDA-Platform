---
kind: operation
title: Zig
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-rotate.cpp
  - full-implementation.cpp
---

## Qué hace

Es el caso base de [`splay`](/structures/splay-tree/operations/splay): x es
hijo directo de la raíz. Una única rotación deja a x en la raíz.

## Intuición

Es exactamente
[`rotate`](/structures/bst-computational-model/operations/rotate) del
modelo BST, aplicado una vez entre x y su padre p — no hay nada adicional
que decidir porque no hay abuelo. Es el único de los tres casos de Splay que
no involucra tres niveles.

## Algoritmo

1. Sea `x` hijo de la raíz `p` (#64).
2. Si `x` es hijo izquierdo de `p`: Right-Rotate(x). Si `x` es hijo derecho:
   Left-Rotate(x).
3. `x` queda como raíz; `p` queda como su hijo (del lado opuesto al que
   tenía `x`).

Diagrama del profesor (#64), con subárboles completos `A`, `B`, `C`:

```
antes:            después:
     p                  x
    / \                / \
   x   C     ⟹        A   p
  / \                    / \
 A   B                  B   C
```

## Pseudocódigo

```
Algoritmo: Zig(x)
p ← x.padre                      // p es la raíz
si x = p.izquierdo entonces
     Rotate(x)                   // right rotation, ver bst-computational-model
sino
     Rotate(x)                   // left rotation
// x es ahora la raíz
```

## C++

Ver `step-2-rotate.cpp` y `full-implementation.cpp` en el editor de arriba:
`zig(x)` reutiliza `rotateRight`/`rotateLeft`, la misma rutina de
[`rotate`](/structures/bst-computational-model/operations/rotate).

## Complejidad temporal

$O(1)$, costo real (no amortizado): una sola rotación, y `rotate` es $O(1)$ en
el modelo BST sin importar el tamaño de A, B o C (#64).

## Complejidad espacial

$O(1)$ adicional.

## Ejemplo

Ver [examples.md](/structures/splay-tree/examples).

## Casos límite

- **`x` ya es la raíz**: Zig no aplica; [`splay`](/structures/splay-tree/operations/splay)
  termina antes de llegar aquí.
- **Subárboles A, B o C vacíos**: la rotación sigue siendo $O(1)$, sólo que
  alguno de los punteros queda en `null`.
- **`p` era la raíz del árbol completo**: tras Zig, `x` es la nueva raíz —
  quien mantenga un puntero a la raíz del árbol debe actualizarlo.
