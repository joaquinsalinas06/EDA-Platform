---
kind: operation
title: Pointer-move
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-instrumented-move.cpp
  - full-implementation.cpp
---

## Qué hace

Mueve la posición actual del recorrido a través de un único puntero: al
padre del nodo actual, o a uno de sus dos hijos.

## Intuición

Es el paso atómico del modelo: nunca se "salta" a un nodo arbitrario. Toda
otra operación del modelo (`search`, y los reacomodos de punteros que hace
`rotate`) se explica como una secuencia de estos pasos.

## Algoritmo

1. Dado el nodo actual `v` y una dirección (`parent`, `left`, `right`).
2. Seguir el puntero correspondiente de `v`.
3. La nueva posición actual es el nodo al que apunta ese puntero (o `null`
   si no existe).

## Pseudocódigo

```
Algoritmo: Pointer-Move(v, dirección)
si dirección = padre entonces
     devolver v.padre
si dirección = izquierda entonces
     devolver v.izquierdo
si dirección = derecha entonces
     devolver v.derecho
```

## C++

Ver `step-2-instrumented-move.cpp` y `full-implementation.cpp` en el editor
de arriba: cada llamada a `moverA(...)` incrementa un contador global de
pointer-moves, que es lo que el C++ de `search` reporta al final.

## Complejidad temporal

$O(1)$. El profesor lo postula como costo unitario del modelo (#19), no lo
deriva: seguir un puntero es un paso constante sin importar cuántos nodos
haya en el árbol.

## Complejidad espacial

$O(1)$ adicional: sólo se actualiza el puntero a la posición actual.

## Ejemplo

Ver [examples.md](/structures/bst-computational-model/examples).

## Casos límite

- **Mover al padre desde la raíz**: el puntero es `null`; el modelo asume
  que quien recorre el árbol no pide ese movimiento (no está definido qué
  hacer con él, porque no hace falta para `search`).
- **Mover a un hijo que no existe** (nodo con 0 o 1 hijos): el puntero es
  `null`; en `search` esto sólo ocurre si `x` no está en el árbol, caso que
  el modelo excluye explícitamente (#24).
