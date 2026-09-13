---
kind: operation
title: Search
order: 3
cppSteps:
  - step-1-node.cpp
  - step-2-instrumented-move.cpp
  - step-4-instrumented-search.cpp
  - full-implementation.cpp
---

## Qué hace

Encuentra el nodo con valor `x`, empezando desde la raíz. Es la única
operación de consulta que el modelo soporta.

## Intuición

Es una secuencia de [`pointer-move`](/structures/bst-computational-model/operations/pointer-move):
en cada nodo se compara `x` contra el valor del nodo actual y se decide bajar
a la izquierda, bajar a la derecha, o detenerse porque ya se llegó. El costo
real es exactamente cuántos de esos movimientos hicieron falta, es decir, la
profundidad de `x` en el árbol vigente.

## Algoritmo

1. `v ← raíz`.
2. Mientras `v.valor ≠ x`: si `x < v.valor`, `v ← pointer-move(v, izquierda)`;
   si `x > v.valor`, `v ← pointer-move(v, derecha)`.
3. Devolver `v` (el modelo asume que `x` siempre está en el árbol, #24).

## Pseudocódigo

```
Algoritmo: Buscar(x)
v ← raíz
mientras v.valor ≠ x hacer
     si x < v.valor entonces
          v ← Pointer-Move(v, izquierda)
     sino
          v ← Pointer-Move(v, derecha)
devolver v
```

## C++

Ver `step-4-instrumented-search.cpp` y `full-implementation.cpp` en el
editor de arriba: `search(x)` llama a `moverA(...)` una vez por nivel
descendido, así que el contador de pointer-moves al terminar es exactamente
la profundidad de `x`.

## Complejidad temporal

O(log n) en el peor caso — pero esa cota es sobre **la forma del árbol**, no
una propiedad fija de `n`. El profesor lo dice en dos pasos: "En el peor
caso, ciertamente O(log n) es el mejor tiempo posible" (#26), pero de
inmediato aclara que "el trabajo de las búsquedas depende de la secuencia de
elementos que se buscan" (#27). Es decir: existe un BST con n nodos donde
Buscar(x) cuesta O(n) (un árbol degenerado en cadena) y otro con los mismos n
nodos donde cuesta O(log n) (uno balanceado) — la cota O(log n) es sólo
alcanzable, no garantizada por el modelo. Cuantificar exactamente de qué
depende ese costo es el tema de
[`search-sequence-properties`](/structures/search-sequence-properties).

## Complejidad espacial

O(1) adicional (el modelo no usa recursión ni estructuras auxiliares para
Buscar).

## Ejemplo

Ver [examples.md](/structures/bst-computational-model/examples).

## Casos límite

- **`x` es la raíz**: costo 0 pointer-moves.
- **Árbol degenerado en cadena** (cada nodo tiene un solo hijo): el peor
  caso real del modelo, O(n) pointer-moves para el nodo más profundo, aunque
  n sea el mismo que en un árbol balanceado.
- **`x` no está en el árbol**: excluido explícitamente por el profesor
  (#24); el modelo no define el costo de una búsqueda fallida.
