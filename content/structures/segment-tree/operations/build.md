---
kind: operation
title: Build
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-build.cpp
  - step-3-update.cpp
  - step-4-query.cpp
  - full-implementation.cpp
---

<!-- Concepto de apoyo: no hay diapositiva que citar (sourceSlides vacío en
     el knowledge map). Derivación estándar, no del profesor. -->

## Qué hace

Construye el árbol completo a partir de un arreglo inicial `A[1..n]`.

## Intuición

Recursivo de abajo hacia arriba: si el rango es una sola posición, el nodo es
una hoja con ese valor; si no, se parte el rango a la mitad, se construye
cada mitad por separado y el valor del nodo es la combinación de sus dos
hijos.

## Algoritmo

1. Si `l = r` (rango de un elemento): el nodo es una hoja con `valor = A[l]`.
2. Si no: `m ← (l + r) / 2`; construir recursivamente el hijo izquierdo sobre
   `[l, m]` y el derecho sobre `[m+1, r]`; `valor(nodo) ← combinar(valor(hijo_izq), valor(hijo_der))`.

## Pseudocódigo

```
Build(A, l, r)
si l = r
    devolver Hoja(valor = A[l])
si no
    m ← (l + r) / 2
    izq ← Build(A, l, m)
    der ← Build(A, m+1, r)
    devolver Nodo(izq, der, valor = combinar(izq.valor, der.valor))
```

## C++

Ver `step-2-build.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

O(n): el árbol tiene 2n-1 nodos en total y la recursión construye cada uno
exactamente una vez, con O(1) de trabajo (una combinación) por nodo interno.

## Complejidad espacial

O(n): 2n-1 nodos, cada uno O(1).

## Ejemplo

Para `A = [1, 2, 3, 4]`, el árbol de 4 hojas queda como en la estructura
interna de `theory.md`: raíz `[1,4]` con valor `combinar(3, 7) = 10` (si
combinar es suma), hijo izquierdo `[1,2]` con valor `3`, hijo derecho `[3,4]`
con valor `7`, y las cuatro hojas `[1,1]=1`, `[2,2]=2`, `[3,3]=3`, `[4,4]=4`.

## Casos límite

- **Un solo elemento (n = 1)**: el árbol es una única hoja, `Build` no hace
  ninguna llamada recursiva.
- **n no es potencia de 2**: la partición `m = (l+r)/2` sigue funcionando,
  sólo que el árbol queda desbalanceado en forma (no en altura: sigue siendo
  ⌈lg n⌉).
