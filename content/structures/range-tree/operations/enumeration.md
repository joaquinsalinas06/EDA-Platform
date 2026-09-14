---
kind: operation
title: Enumeración
order: 5
cppSteps:
  - step-1-point.cpp
  - step-2-build-1d.cpp
  - step-3-predecessor-successor.cpp
  - step-4-range-query-1d.cpp
  - step-6-enumeration.cpp
  - full-implementation.cpp
---

## Qué hace

Lista todos los puntos dentro de `[l1, r1]`, o los primeros `k` que se
pidan (Sem4_Orthogonal_Range_Search.pdf#16,38).

## Intuición

Igual que [existence-count](/structures/range-tree/operations/existence-count),
parte de los subárboles canónicos de
[range-query-1d](/structures/range-tree/operations/range-query-1d): "iterar
sobre los O(log n) subárboles" (#38) y recorrer las hojas de cada uno. Como
los subárboles son disjuntos y su unión es exactamente la respuesta, no
hay que filtrar ni deduplicar nada al recorrerlos.

## Algoritmo

*(Derivado; el profesor sólo da la idea de iterar los subárboles en #38.)*

1. `subarboles ← RangeQuery1D(raiz, l1, r1)`.
2. Para cada subárbol canónico, recorrer sus hojas (in-order o cualquier
   recorrido) y agregarlas a la salida.
3. Detenerse en cuanto se acumulen `k` resultados, si la consulta pide sólo
   `k` puntos.

## Pseudocódigo

```
Enumerar(raiz, l1, r1)                            // derivado
salida ← []
para cada s en RangeQuery1D(raiz, l1, r1)
    para cada hoja h en subárbol(s)   // recorrido normal del subárbol
        salida.agregar(h)
devolver salida
```

## C++

Ver `step-6-enumeration.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

$O(\log n + k)$: $O(\log n)$ para hallar los subárboles canónicos
([range-query-1d](/structures/range-tree/operations/range-query-1d)), más
recorrer sus hojas — la suma de tamaños de subárboles disjuntos que caen en
la respuesta es exactamente `k` (Sem4_Orthogonal_Range_Search.pdf#38).

## Complejidad espacial

$O(k)$ para la salida (además del $O(\log n)$ de la lista de subárboles).

## Ejemplo

*(Derivado sobre el ejemplo de
[range-query-1d](/structures/range-tree/operations/range-query-1d).)*
Para `[5,16]`: recorrer el subárbol 7 da las hojas `7, 9`; recorrer el
subárbol 13 da `13, 15`. Salida: `{7, 9, 13, 15}`.

## Casos límite

- **`k` pedido menor que el total de puntos en rango**: se puede detener a
  mitad de un subárbol canónico, sin necesidad de recorrerlo completo.
- **Ningún punto en rango**: `RangeQuery1D` no devuelve subárboles, la
  salida es la lista vacía.
- **Todo el árbol en rango**: enumerar equivale a recorrer todas las hojas,
  $O(n)$ — coherente con `k = n` en la fórmula $O(\log n + k)$.
