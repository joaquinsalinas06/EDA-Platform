---
kind: operation
title: Insert
order: 3
cppSteps:
  - step-1-array-indices.cpp
  - step-2-max-heapify.cpp
  - step-3-build-max-heap.cpp
  - step-4-insert.cpp
  - full-implementation.cpp
---

<!-- Derivado del pseudocódigo del profesor; no aparece en las diapositivas.
     La tabla comparativa (Sem_1_Heaps_I-1.pdf#35-42) sólo da su complejidad,
     Θ(lg n), sin pseudocódigo ni ejemplo propio para el binario. -->

## Qué hace

Agrega un elemento nuevo al montículo, preservando el invariante de
montículo máximo.

## Intuición

Es "subir" un elemento: se coloca al final del arreglo (la única posición
que mantiene la forma de árbol casi completo) y, mientras sea mayor que su
padre, se intercambia con él — subiendo hacia la raíz.

## Algoritmo

1. Agregar la llave al final del arreglo (`A[n+1] ← key`, `n ← n+1`).
2. `i ← n`.
3. Mientras `i > 1` y `A[parent(i)] < A[i]`: intercambiar `A[parent(i)]` y
   `A[i]`; `i ← parent(i)`.

## Pseudocódigo

```
Insert(A, n, key)
n ← n + 1 ;
A[n] ← key ;
i ← n ;
mientras i > 1 y A[i/2] < A[i] hacer
     intercambiar A[i/2] y A[i] ;
     i ← i/2
```

## C++

Ver `step-4-insert.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

`Θ(lg n)`, tal como aparece en la tabla comparativa del profesor. El
razonamiento se deriva por el mismo argumento de altura que Max-Heapify: el
elemento nuevo sube por un único camino hoja-raíz, que tiene a lo más
`⌊lg n⌋` aristas.

## Complejidad espacial

O(1) adicional (versión iterativa).

## Ejemplo

Derivado: sobre `A = [14, 8, 10, 4, 2, 9, 3]` (el resultado de Max-Heapify
del ejemplo del profesor), `Insert(A, 7, 20)` agrega 20 en la posición 8,
lo compara contra su padre `A[4]=4`, sube; luego contra `A[2]=8`, sube;
luego contra `A[1]=14`, sube — 20 termina en la raíz porque es el nuevo
máximo.

## Casos límite

- **Montículo vacío**: `i = n = 1` tras agregar; la condición `i > 1` es
  falsa de entrada, no hay comparaciones que hacer.
- **Nuevo elemento es el menor de todos**: la condición `A[parent(i)] < A[i]`
  falla en el primer paso, el elemento se queda en la hoja donde se agregó.
- **Duplicados**: la comparación es estricta (`<`), un empate con el padre
  detiene la subida — sigue siendo válido para el invariante (`≥`).
