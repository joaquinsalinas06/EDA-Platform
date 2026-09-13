---
kind: operation
title: Zig-zag
order: 3
cppSteps:
  - step-1-node.cpp
  - step-2-rotate.cpp
  - step-4-zig-zag.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - "note: >-"
        Caso zig-zag: x, su padre p y su abuelo a están en zigzag — lados
        OPUESTOS (aquí, x hijo derecho de p, p hijo izquierdo de a). Es la
        forma que hay que comparar contra zig-zig: mismos tres niveles,
        orientación distinta (#66).
      highlight: [x, p, a]
      nodes:
        - "{ id: a, value: a, parent: null }"
        - "{ id: p, value: p, parent: a }"
        - "{ id: D, value: D, parent: a }"
        - "{ id: A, value: A, parent: p }"
        - "{ id: x, value: x, parent: p }"
        - "{ id: B, value: B, parent: x }"
        - "{ id: C, value: C, parent: x }"
    - "note: >-"
        Primera rotación: se rota el par (x, p) — x sube a la posición de
        p, y B (hijo izquierdo de x) pasa a ser hijo derecho de p. A
        diferencia de zig-zig, aquí SÍ se rota x primero: no hay "abuelo
        primero" que valga, porque los dos giros van en direcciones
        opuestas y no se refuerzan entre sí.
      highlight: [x, p]
      nodes:
        - "{ id: a, value: a, parent: null }"
        - "{ id: x, value: x, parent: a }"
        - "{ id: D, value: D, parent: a }"
        - "{ id: p, value: p, parent: x }"
        - "{ id: C, value: C, parent: x }"
        - "{ id: A, value: A, parent: p }"
        - "{ id: B, value: B, parent: p }"
    - "note: >-"
        Segunda rotación: se rota el par (x, a) — x sube a la raíz, y C
        (hijo derecho de x) pasa a ser hijo izquierdo de a. Resultado: x en
        la raíz con p y a como sus dos hijos directos (no en cascada, como
        en zig-zig) — ésa es la diferencia visual que importa entre los dos
        casos (#66).
      highlight: [x, a]
      nodes:
        - "{ id: x, value: x, parent: null }"
        - "{ id: p, value: p, parent: x }"
        - "{ id: a, value: a, parent: x }"
        - "{ id: A, value: A, parent: p }"
        - "{ id: B, value: B, parent: p }"
        - "{ id: C, value: C, parent: a }"
        - "{ id: D, value: D, parent: a }"
---

## Qué hace

Es el segundo caso de [`splay`](/structures/splay-tree/operations/splay):
x y su padre p están en lados opuestos respecto de su abuelo a (x derecho
de p, p izquierdo de a — o el espejo). Dos rotaciones dejan a x en la raíz.

## Intuición

A diferencia de [zig-zig](/structures/splay-tree/operations/zig-zig), aquí
no hay distinción entre "rotar el abuelo primero" o "rotar el padre
primero": como las dos direcciones son opuestas, rotar `(x, p)` primero y
`(x, a)` después es simplemente el único orden razonable — x se mueve hacia
arriba en zigzag, nunca en línea recta. El resultado visual también es
distinto: en zig-zig, p y a terminan en cascada (uno colgando del otro); en
zig-zag, p y a terminan como los dos hijos **directos** de x. Esa es la
diferencia que hay que ver, no sólo leer.

## Algoritmo

1. Sean `x` hijo de `p`, `p` hijo de `a`, en lados opuestos (caso
   izquierdo-derecho mostrado arriba; derecho-izquierdo es simétrico).
2. Rotar el par `(x, p)`: `Rotate(x)` — x sube a la posición de p.
3. Rotar el par `(x, a)`: `Rotate(x)` — x sube a la posición de a (ahora
   raíz del subárbol).
4. `x` queda como raíz; `p` y `a` quedan como sus dos hijos directos.

## Pseudocódigo

```
Algoritmo: ZigZag(x)
p ← x.padre
a ← p.padre
// lados opuestos: x es derecho de p, y p es izquierdo de a (o el espejo)
Rotate(x)          // rota el par (x, p) — x sube un nivel
Rotate(x)          // rota el par (x, a) — x sube a la raíz
```

## C++

Ver `step-4-zig-zag.cpp` y `full-implementation.cpp` en el editor de
arriba: `zigZag(x)` llama `rotate(x)` dos veces seguidas — a diferencia de
`zigZig`, que llama primero `rotate(p)`.

## Complejidad temporal

O(1), costo real (no amortizado): dos rotaciones O(1) cada una, sin
importar el tamaño de A, B, C o D (#66). Igual que zig-zig, lo amortizado
es propiedad de la secuencia de pasos de
[`splay`](/structures/splay-tree/operations/splay) completo, no de este
paso solo.

## Complejidad espacial

O(1) adicional.

## Ejemplo

Ver [examples.md](/structures/splay-tree/examples).

## Casos límite

- **Espejo (derecho-izquierdo)**: x hijo izquierdo de p, p hijo derecho de
  a — simétrico. El deck sólo dibuja una orientación (#66); la espejada se
  deriva por simetría.
- **A, B, C o D vacíos**: cada rotación sigue siendo O(1).
- **`a` era la raíz del árbol completo**: tras zig-zag, `x` es la nueva
  raíz global.
