---
kind: operation
title: Push (stack persistente)
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-stack-push.cpp
  - step-3-segment-tree-update.cpp
  - step-4-trie-insert.cpp
  - full-implementation.cpp
---

## Qué hace

Agrega un elemento `x` a una pila persistente `S`, devolviendo una nueva
versión de la pila. La versión vieja `S` sigue intacta y consultable.

## Intuición

Un stack implementado como lista enlazada ya es un "camino" de un solo
nodo de largo: la cima. Por eso path copying, en este caso, se reduce a
crear un único nodo nuevo que apunta al resto de la lista vieja — no hay
nada más que copiar, porque no hay más camino que recorrer. Es el caso
degenerado de la técnica, y el profesor lo señala así: es persistencia
funcional en su forma más pura, en cualquier nivel de persistencia, sin
necesitar llamarla "path copying".

## Algoritmo

1. Crear un nodo `nuevo` con valor `x` y `siguiente` apuntando a la cima
   actual de `S`.
2. Devolver `nuevo` como la raíz (cima) de la versión nueva de la pila.
3. `S` (la versión vieja) no se toca: sigue siendo un puntero válido a la
   pila tal como estaba antes del push.

## Pseudocódigo

```
Algoritmo 2: Push(S, x) — persistente
nuevo ← nodo con valor x y siguiente ← S ;
devolver nuevo ;        // S (la versión vieja) sigue intacta
```

## C++

Ver `step-2-stack-push.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

`O(1)`: crear un nodo y enlazarlo cuesta lo mismo sin importar cuántos
elementos tenga la pila o cuántas versiones existan.

## Complejidad espacial

`O(1)` nuevo por operación: un solo nodo. Ninguna estructura anterior se
copia ni se recorre.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas — el material no
instancia el stack con elementos concretos.)* Sea `S` la pila persistente
con cima `7 → 2 → 7` (de la más reciente a la más antigua). `Push(S, 42)`
crea un nodo `42` con `siguiente` apuntando al nodo `7` que era la cima de
`S`, y devuelve ese nodo `42` como la nueva versión. La versión vieja sigue
siendo `7 → 2 → 7`, accesible por quien todavía tenga ese puntero.

## Casos límite

- **Pila vacía**: `S = nulo`. `Push(nulo, x)` crea un nodo con
  `siguiente ← nulo`: el primer elemento de una pila nueva, sin ningún
  caso especial en el algoritmo.
- **Empujar sobre una versión vieja**: nada lo impide — se puede hacer
  `Push` sobre cualquier versión pasada de `S`, no sólo sobre la más
  reciente, y eso genera una rama distinta de versiones (persistencia
  confluente si esas ramas se combinan después).
- **`Pop` no aparece en el material** (sólo `Push`): el profesor no da
  pseudocódigo para retirar el tope de la pila persistente.
