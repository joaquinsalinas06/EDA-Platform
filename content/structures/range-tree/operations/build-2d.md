---
kind: operation
title: Construcción 2D
order: 6
cppSteps:
  - step-1-point.cpp
  - step-2-build-1d.cpp
  - step-7-build-2d.cpp
  - full-implementation.cpp
visualization:
  type: range-tree
  steps:
    - note: >-
        Reproduce la diapositiva #47: árbol primario en X sobre los puntos
        (3,10) (4,7) (7,11) (9,6) (13,0) (15,−2) (18,3) (27,1) — misma forma
        que el árbol 1D de build-1d (las llaves X son las mismas: 3,4,7,9,
        13,15,18,27), pero cada hoja ahora es un punto (x,y) completo.
      highlight: []
      nodes:
        - { id: r9, value: 9, parent: null }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: p3, value: 10, parent: n3i }
        - { id: p4, value: 7, parent: n3i }
        - { id: n7i, value: 7, parent: n4 }
        - { id: p7, value: 11, parent: n7i }
        - { id: p9, value: 6, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15 }
        - { id: p13, value: 0, parent: n13i }
        - { id: p15, value: -2, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: p18, value: 3, parent: n18i }
        - { id: p27, value: 1, parent: n18i }
    - note: >-
        Cada nodo del primario (incluidas las hojas) tiene además un
        puntero a un range tree secundario ordenado por Y, construido sobre
        los mismos puntos de su subárbol. Aquí sólo el del nodo 15 (#47):
        cuelga de él, por una flecha (no una relación padre-hijo del árbol
        en X), un segundo árbol sobre sus 4 puntos — (13,0) (15,−2) (18,3)
        (27,1) — ordenados por Y: −2, 0, 1, 3. Falta un campo para expresar
        ese puntero cruzado; ver nota al final del bloque de operaciones.
      highlight: [n15]
      nodes:
        - { id: y0, value: 0, parent: null }
        - { id: yneg2i, value: -2, parent: y0 }
        - { id: pleaf15, value: -2, parent: yneg2i }
        - { id: pleaf13, value: 0, parent: yneg2i }
        - { id: y1i, value: 1, parent: y0 }
        - { id: pleaf27, value: 1, parent: y1i }
        - { id: pleaf18, value: 3, parent: y1i }
---

## Qué hace

Convierte el árbol de [build-1d](/structures/range-tree/operations/build-1d)
(ordenado por X) en un range tree 2D: cada nodo del árbol primario apunta a
un **árbol secundario**, ordenado por Y, construido sobre los mismos puntos
de su propio subárbol (Sem4_Orthogonal_Range_Search.pdf#46-47).

## Intuición

Un range tree se puede anidar porque, a diferencia de un arreglo, cada nodo
ya delimita un subconjunto contiguo de puntos (su subárbol) sobre el cual
tiene sentido construir *otra* estructura — un range tree por Y. Así, un
subárbol canónico en X (que
[range-query-1d](/structures/range-tree/operations/range-query-1d) ya sabe
encontrar en O(log n)) trae consigo, listo, un árbol secundario donde
consultar el rango en Y sin volver a mirar la X.

## Algoritmo

*(Derivado; #54 sólo da la idea de construir bottom-up con la información
de los hijos, sin pseudocódigo.)*

1. Construir el árbol primario en X como en
   [build-1d](/structures/range-tree/operations/build-1d).
2. Para cada nodo del primario, de las hojas hacia la raíz: el árbol
   secundario del nodo se arma en O(tamaño del subárbol) **mezclando** (por
   Y, como en mergesort) los árboles secundarios ya construidos de sus dos
   hijos — "cada range tree correspondiente a subárboles puede ser
   construido en O(n) usando la información de sus dos hijos" (#54).
3. La hoja de un solo punto es, trivialmente, su propio árbol secundario de
   tamaño 1.

## Pseudocódigo

```
BuildRangeTree2D(raiz_x)                          // derivado
si raiz_x es hoja
    raiz_x.secundario ← árbol_de_un_punto(raiz_x)
si no
    BuildRangeTree2D(raiz_x.izq)
    BuildRangeTree2D(raiz_x.der)
    raiz_x.secundario ← MezclarPorY(raiz_x.izq.secundario, raiz_x.der.secundario)
```

## C++

Ver `step-7-build-2d.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

O(n log n): construir el primario ya cuesta O(n log n)
([build-1d](/structures/range-tree/operations/build-1d)); mezclar los
secundarios nivel por nivel cuesta O(tamaño del subárbol) por nodo, que
sumado sobre los O(log n) niveles da O(n log n) adicional
(Sem4_Orthogonal_Range_Search.pdf#54-55).

## Complejidad espacial

O(n log n): "cada hoja debería estar incluida en O(log n) subárboles"
(#49) — cada punto vive en un árbol secundario por cada ancestro suyo en
el primario, y hay O(log n) ancestros por punto.

## Ejemplo

Ver la visualización de arriba: el árbol secundario del nodo 15, sobre sus
4 puntos, con raíz 0 e hijos −2 y 1 — exactamente la diapositiva #47.

## Casos límite

- **Nodo hoja**: su árbol secundario es un único punto, sin construcción
  real.
- **Raíz**: su árbol secundario contiene los n puntos ordenados por Y —
  el más grande y el único que cuesta O(n) mezclar de una sola vez.
- **Puntos con Y repetida**: el orden por Y necesita un criterio de
  desempate (por ejemplo, por X) para que el árbol secundario quede bien
  definido; el material no lo menciona.
