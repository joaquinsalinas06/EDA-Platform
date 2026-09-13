---
kind: operation
title: d dimensiones
order: 8
cppSteps:
  - step-1-point.cpp
  - step-2-build-1d.cpp
  - step-7-build-2d.cpp
  - step-9-d-dimensions.cpp
  - full-implementation.cpp
---

## Qué hace

Extiende la construcción 2D a `d` dimensiones: "en cada uno de los árboles
de una componente en la dimensión k podemos agregar punteros hacia range
trees ordenados por la dimensión (k+1)" (Sem4_Orthogonal_Range_Search.pdf#52).

## Intuición

El mismo anidamiento de [build-2d](/structures/range-tree/operations/build-2d)
y [range-query-2d](/structures/range-tree/operations/range-query-2d), una
dimensión más: cada nodo del range tree de la dimensión `k` cuelga un range
tree de la dimensión `k+1` sobre los puntos de su subárbol, y así hasta
llegar a un range tree 1D final en la última dimensión. Es exactamente el
mismo argumento de multiplicidad que 2D, repetido `d-1` veces.

## Algoritmo

*(Derivado; el mecanismo concreto de anidar una dimensión más nunca se
detalla en el mazo — sólo la idea general en #52.)*

1. Construir el range tree de la dimensión 1 (build-1d, ordenado por la
   primera componente).
2. Para cada nodo, de las hojas hacia la raíz, construir un range tree de
   la dimensión 2 sobre los puntos de su subárbol (ordenado por la segunda
   componente) — igual que
   [build-2d](/structures/range-tree/operations/build-2d).
3. Repetir para las dimensiones `3, 4, ..., d`: el range tree de la
   dimensión `k` de cada nodo cuelga, a su vez, un range tree de la
   dimensión `k+1` sobre los mismos puntos.
4. Consultar una caja `d`-dimensional es resolver una consulta 1D en la
   dimensión 1 que, por cada subárbol canónico, dispara una consulta en la
   dimensión 2 sobre su range tree colgado, que a su vez dispara una en la
   dimensión 3, y así hasta la dimensión `d`.

## Pseudocódigo

```
RangeQueryD(raiz, [l_1,r_1], ..., [l_d,r_d])      // derivado
si d = 1
    devolver RangeQuery1D(raiz, l_1, r_1)
si no
    subarboles ← RangeQuery1D(raiz, l_1, r_1)     // dimensión 1 de este nivel
    respuesta ← []
    para cada s en subarboles
        respuesta.agregar(
            RangeQueryD(s.siguiente_dimension, [l_2,r_2], ..., [l_d,r_d])
        )
    devolver respuesta
```

## C++

Ver `step-9-d-dimensions.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

O(log^d n + k): multiplicidad — cada dimensión adicional multiplica el
costo de consulta por un factor O(log n)
(Sem4_Orthogonal_Range_Search.pdf#57). El profesor cierra notando que este
factor se puede mejorar en O(log n) para d ≥ 2 sin decir cómo — "¿Es
posible mejorarlo? Sí..." (#58-59); lo resuelve fractional cascading, en
la semana 5.

## Complejidad espacial

O(n log^(d-1) n): cada punto vive en O(log n) range trees por cada
dimensión más allá de la primera (Sem4_Orthogonal_Range_Search.pdf#56) —
el mismo argumento de "cada hoja en O(log n) subárboles" de
[build-2d](/structures/range-tree/operations/build-2d), aplicado `d-1`
veces.

## Ejemplo

*(Derivado.)* Para d=3, cada nodo del range tree en X cuelga un range tree
en Y, y cada nodo de ese secundario en Y cuelga, a su vez, un range tree en
Z — tres niveles de anidamiento, tres consultas 1D encadenadas.

## Casos límite

- **d=1**: no hay anidamiento; es exactamente
  [build-1d](/structures/range-tree/operations/build-1d) /
  [range-query-1d](/structures/range-tree/operations/range-query-1d), con
  espacio O(n) — el profesor separa d=1 de d≥2 justamente porque la
  fórmula general O(n log^(d-1) n) no aplica ahí (#55).
- **d muy grande**: el factor log^d n crece rápido; el material no discute
  a partir de qué `d` deja de ser práctico.
- **d=2**: caso base del anidamiento, cubierto por
  [build-2d](/structures/range-tree/operations/build-2d) y
  [range-query-2d](/structures/range-tree/operations/range-query-2d).
