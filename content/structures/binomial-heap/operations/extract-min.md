---
kind: operation
title: Extract-Min
order: 5
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-binomial-link.cpp
  - step-4-find-min.cpp
  - step-5-union.cpp
  - step-6-insert.cpp
  - step-7-extract-min.cpp
  - full-implementation.cpp
---

## Qué hace

Quita y devuelve el nodo con la menor llave de todo el montículo.

## Intuición

La raíz mínima desaparece, pero sus hijos ya son, cada uno, la raíz de un
árbol binomial válido más pequeño (un `B_k` sin su raíz se descompone en un
`B_0, B_1, ..., B_{k-1}`, exactamente uno de cada orden menor). Esos hijos
forman por sí solos un montículo binomial nuevo, y basta unirlo
([Union](/structures/binomial-heap/operations/union)) de vuelta con lo que
quedó del montículo original.

## Algoritmo

1. Encontrar la raíz `x` con la menor llave (Find-Min), recorriendo la
   lista de raíces.
2. Quitar `x` de la lista de raíces de `H`.
3. Construir `H'`, un montículo binomial cuya lista de raíces son los
   hijos de `x`.
4. `H ← Union(H, H')`.

## Pseudocódigo

```
Algoritmo 9: Extract-Min(H)
Encontrar la raíz x con menor llave, recorriendo la lista de raíces ;
Quitar x de la lista de raíces de H ;
H' ← montículo binomial con los hijos de x como su lista de raíces ;
H ← Union(H, H') ;
devolver x ;
```

## C++

Ver `cpp/structures/binomial-heap/step-7-extract-min.cpp`: `extractMin`
localiza el mínimo con `findMin`, lo desengancha de la lista de raíces,
invierte la lista de sus hijos (Binomial-Link siempre inserta el hijo más
nuevo al frente, así que la lista de hijos queda en orden de grado
descendente y hay que invertirla antes de tratarla como raíces de `H'`), y
llama `heapUnion`.

## Complejidad temporal

`O(lg n)`. Encontrar el mínimo recorre a lo mucho `⌊lg n⌋ + 1` raíces:
`O(lg n)`. Los hijos de la raíz mínima son a lo mucho `lg n` nuevas raíces
(un `B_k` tiene hijos `B_0, ..., B_{k-1}`, y `k = O(lg n)`), y Union entre
`H` y `H'` cuesta, a su vez, `O(lg n)`. Sumando los dos términos: `O(lg n)`.

## Complejidad espacial

`O(1)` adicional: no se copian nodos, sólo se reconecta la lista de hijos
de la raíz extraída como la nueva lista de raíces de `H'`.

## Ejemplo

Sobre el montículo de dos árboles obtenido en el ejemplo de
[Insert](/structures/binomial-heap/operations/insert) — `B0` (9) y `B1`
(raíz 2, hijo 5) —, Extract-Min encuentra el mínimo (2), lo quita, y
convierte a su único hijo (5) en la lista de raíces de `H'` = `{5}` (un
`B0`). `Union({9}, {5})` combina los dos `B0` en un `B1` con raíz 5 e hijo
9. Resultado: un solo árbol, `B1` (raíz 5, hijo 9). (Derivado a mano; el
mazo no trae esta traza.)

## Casos límite

- Si la raíz mínima no tiene hijos (es un `B0`), `H'` queda vacío y
  `Union(H, ∅)` simplemente devuelve `H` sin la raíz extraída. El mazo no
  comenta este caso, pero el pseudocódigo lo cubre sin necesitar un `si`
  aparte.
- Si `H` tiene un solo nodo, tras extraerlo `H` queda vacío.
- Montículo vacío de entrada: no hay mínimo que extraer; el mazo no lo
  discute (en la implementación, se devuelve "no hay nada que extraer").
