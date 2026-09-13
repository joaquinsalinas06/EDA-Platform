---
kind: operation
title: Build
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-range-tree-generic.cpp
  - step-3-build-satellite.cpp
  - full-implementation.cpp
---

## Qué hace

Construye D₄: un árbol de rango sobre z donde cada nodo guarda, para los
puntos de sus dos hijos, una copia de D₃ (normal a la derecha, invertida a
la izquierda) (#46).

## Intuición

Es literalmente el `build` de [D3-separation-node](/structures/d3-separation-node),
aplicado sobre z en vez de y. Donde D₃ construye un árbol de rango sobre y y
cuelga D₂/D₂′ de cada nodo, D₄ construye un árbol de rango sobre z y cuelga
D₃/D₃′. El mismo procedimiento, una dimensión arriba.

## Algoritmo

1. Ordenar los puntos por z.
2. Construir un árbol de rango balanceado sobre esa coordenada (idéntico al
   de D₃ sobre y).
3. En cada nodo v: construir sobre los puntos de derecha(v) una D₃ normal
   (z ≤ b3), y sobre los de izquierda(v) una D₃ invertida (z ≥ a3).

El material no da un pseudocódigo separado para esto — la descripción en
prosa (#46) es la única fuente, y es la misma que la de D₃ con y → z.

## Pseudocódigo

> **Nota de apoyo**: el profesor no da pseudocódigo para D₄ (ni para D₃).
> Lo de abajo es una transcripción directa de la prosa de #46, marcada como
> derivada, parametrizada en la dimensión para dejar visible que es el mismo
> procedimiento que D₃:

```
Construir(puntos, dim):        // dim = y para D_3, dim = z para D_4
    árbol ← ÁrbolDeRangoBalanceado(puntos, clave = dim)
    para cada nodo v de árbol:
        v.satelite_derecha ← Construir_D_{dim-1}(derecha(v), normal)
        v.satelite_izquierda ← Construir_D_{dim-1}(izquierda(v), invertida)
    devolver árbol
```

## C++

Ver el editor arriba. `cpp/structures/d4-bound-z/` construye el árbol de
rango genérico parametrizado en la dimensión y lo aplica dos veces (sobre y
y sobre z) para dejar explícito que D₃ y D₄ comparten el mismo código de
construcción — no se reimplementa D₃.

## Complejidad temporal

El profesor no da una cota propia de esta construcción (ver theory.md,
Análisis de complejidad). Lo único cuantitativo en esta sección es el costo
de *usar* D₄ ya construida, no el de construirla.

## Complejidad espacial

Tampoco se da por separado para `build`; la única cifra de espacio del mazo
(#57, #62) es O(n lg³ n) para la pila completa D₁–D₄ con cascading, no para
D₄ sola ni para su sola construcción.

## Ejemplo

Ver [Ejemplos](/structures/d4-bound-z/examples) — caso derivado, el mazo no
trae valores concretos.

## Casos límite

- Un único punto: el árbol de rango sobre z es una hoja; los satélites D₃
  normal/invertida se construyen sobre conjuntos vacíos o de un punto.
- Todos los puntos con el mismo z: el árbol de rango degenera según el
  mismo criterio de desempate que ya usa D₃ sobre y — el material no lo
  trata explícitamente para ninguna de las dos.
- El profesor no discute estos casos para D₄ ni para D₃ ("implícito pero no
  discutido", según el análisis de la sección anterior); se listan aquí
  porque el schema los pide, no porque el mazo los desarrolle.
