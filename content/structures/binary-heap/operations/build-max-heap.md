---
kind: operation
title: Build-Max-Heap
order: 2
cppSteps:
  - step-1-array-indices.cpp
  - step-2-max-heapify.cpp
  - step-3-build-max-heap.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - note: >-
        Derivado del pseudocódigo; no aparece en las diapositivas (que sólo
        traen el ejemplo de Max-Heapify aislado). Se reutiliza el mismo
        arreglo, ahora tratado como entrada arbitraria de Build-Max-Heap:
        A = [4, 14, 10, 8, 2, 9, 3], n=7, así que se recorre i = ⌊7/2⌋=3 hasta 1.
      highlight: []
      nodes:
        - { id: n1, value: 4, parent: null }
        - { id: n2, value: 14, parent: n1 }
        - { id: n3, value: 10, parent: n1 }
        - { id: n4, value: 8, parent: n2 }
        - { id: n5, value: 2, parent: n2 }
        - { id: n6, value: 9, parent: n3 }
        - { id: n7, value: 3, parent: n3 }
    - note: >-
        i=3: Max-Heapify(A,3,7). A[3]=10 contra hijos A[6]=9 y A[7]=3: 10 ya
        es el mayor de los tres, "largest" se queda en 3, no hay intercambio.
      highlight: [n3, n6, n7]
      nodes:
        - { id: n1, value: 4, parent: null }
        - { id: n2, value: 14, parent: n1 }
        - { id: n3, value: 10, parent: n1 }
        - { id: n4, value: 8, parent: n2 }
        - { id: n5, value: 2, parent: n2 }
        - { id: n6, value: 9, parent: n3 }
        - { id: n7, value: 3, parent: n3 }
    - note: >-
        i=2: Max-Heapify(A,2,7). A[2]=14 contra hijos A[4]=8 y A[5]=2: 14 ya
        es el mayor, no hay intercambio.
      highlight: [n2, n4, n5]
      nodes:
        - { id: n1, value: 4, parent: null }
        - { id: n2, value: 14, parent: n1 }
        - { id: n3, value: 10, parent: n1 }
        - { id: n4, value: 8, parent: n2 }
        - { id: n5, value: 2, parent: n2 }
        - { id: n6, value: 9, parent: n3 }
        - { id: n7, value: 3, parent: n3 }
    - note: >-
        i=1: Max-Heapify(A,1,7). Aquí sí hay violación: A[1]=4 es menor que
        A[2]=14. Esta es exactamente la secuencia de intercambios del ejemplo
        de Max-Heapify (ver esa operación) — termina en [14, 8, 10, 4, 2, 9, 3].
      highlight: [n1, n2]
      nodes:
        - { id: n1, value: 14, parent: null }
        - { id: n2, value: 8, parent: n1 }
        - { id: n3, value: 10, parent: n1 }
        - { id: n4, value: 4, parent: n2 }
        - { id: n5, value: 2, parent: n2 }
        - { id: n6, value: 9, parent: n3 }
        - { id: n7, value: 3, parent: n3 }
---

## Qué hace

Convierte un arreglo `A[1..n]` arbitrario en un montículo máximo, en el
propio arreglo (in-place).

## Intuición

Si se llama Max-Heapify de abajo hacia arriba, cada llamada puede confiar en
que los subárboles de sus hijos ya son montículos válidos (porque ya se
procesaron), así que sólo necesita reparar la raíz de su propio subárbol.
Las hojas ya son montículos triviales de un solo nodo, así que ni siquiera
hace falta tocarlas.

## Algoritmo

1. Para `i` desde `⌊n/2⌋` hasta `1` (en orden decreciente): llamar
   `Max-Heapify(A, i, n)`.
2. Toda posición `i > ⌊n/2⌋` es hoja y ya es trivialmente un montículo
   máximo de un solo nodo, por eso el recorrido empieza en `⌊n/2⌋` y no en `n`.

## Pseudocódigo

```
Algoritmo 3: Build-Max-Heap(A, n)
para i ← ⌊n/2⌋ a 1 hacer
   Max-Heapify(A, i, n) ;
```

## C++

Ver `step-3-build-max-heap.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

`Θ(n)`. El profesor **refuta explícitamente** la cota ingenua de llamar
Max-Heapify (O(lg n)) por cada una de las n/2 posiciones, que daría
`O(n lg n)`: la cota real es más ajustada porque la mayoría de los nodos
están cerca de las hojas, donde Max-Heapify hace poco trabajo. Usa el lema
de que a lo más `⌈n/2^(h+1)⌉` nodos están a altura `h`, y suma el costo real
nivel por nivel:

```
T(n) ≤ Σ_{h=0}^{⌊lg n⌋} ⌈n/2^(h+1)⌉ · O(h) = O(n · Σ_{h=0}^{∞} h/2^h)
```

y cierra usando que esa serie geométrica derivada converge a 2, dando
`T(n) = O(n)`. Es análisis agregado por sumatoria sobre niveles, no
amortizado ni potencial.

## Complejidad espacial

El profesor no la da. La construcción es in-place: no reserva arreglos
adicionales (O(1) más allá de la pila de Max-Heapify).

## Ejemplo

Derivado del pseudocódigo (ver visualización arriba): sobre
`A = [4, 14, 10, 8, 2, 9, 3]`, las posiciones `i=3` e `i=2` ya cumplen el
invariante localmente; sólo `i=1` dispara la misma cadena de intercambios
que el ejemplo de Max-Heapify, terminando en `[14, 8, 10, 4, 2, 9, 3]`.

## Casos límite

- **Arreglo ya es montículo**: cada llamada a Max-Heapify termina de
  inmediato (ningún intercambio), pero igual se hacen las `⌊n/2⌋` llamadas.
- **`n ≤ 1`**: `⌊n/2⌋ = 0`, el bucle no itera — un arreglo de 0 o 1
  elementos ya es trivialmente un montículo.
- **Orden inverso** (el peor caso real para el número de intercambios):
  sigue siendo `Θ(n)` total, no por elemento — es justamente lo que el
  argumento agregado por niveles demuestra.
