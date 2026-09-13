---
kind: operation
title: Cascading-Cut
order: 4
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - step-4-cut-cascading.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - note: >-
        Estado antes del corte: la cadena G → P → C (abuelo, padre, hijo).
        P ya está marcado (perdió un hijo antes de este momento) — el
        gris indica esa marca. G y C no están marcados. C acaba de perder
        su invariante con P (por ejemplo, Decrease-Key sobre C) y se va a
        cortar.
      highlight: ["C"]
      nodes:
        - { id: G, value: "G", parent: null }
        - { id: P, value: "P (marcado)", parent: G }
        - { id: C, value: "C", parent: P }
    - note: >-
        Cut(H, C, P): C se separa de P y se agrega como raíz nueva, sin
        padre y sin marca (las raíces nunca están marcadas). grado(P) baja
        en 1.
      highlight: ["C", "P"]
      nodes:
        - { id: G, value: "G", parent: null }
        - { id: P, value: "P (marcado)", parent: G }
        - { id: C, value: "C (nueva raíz)", parent: null }
    - note: >-
        Cascading-Cut(H, P): como P SÍ estaba marcado, no basta con
        marcarlo de nuevo — se corta también, y la cascada sigue hacia el
        padre de P, que es G.
      highlight: ["P"]
      nodes:
        - { id: G, value: "G", parent: null }
        - { id: P, value: "P (se corta)", parent: G }
        - { id: C, value: "C", parent: null }
    - note: >-
        Cut(H, P, G): P se separa de G y se agrega como raíz, sin marca.
        Cascading-Cut(H, G): G no tiene padre (es raíz), así que la
        cascada se detiene aquí sin marcar a G. Resultado final: G, P y C
        son tres raíces sueltas, ninguna marcada — exactamente el estado
        que muestra el mazo tras el ejemplo (páginas 16-18).
      highlight: ["G", "P", "C"]
      nodes:
        - { id: G, value: "G", parent: null }
        - { id: P, value: "P", parent: null }
        - { id: C, value: "C", parent: null }
---

## Qué hace

Aplica la regla de las marcas hacia arriba: si el padre de un nodo recién
cortado ya había perdido un hijo antes (estaba marcado), lo corta también
y repite el proceso con el abuelo — una cascada que sube hasta encontrar
un nodo sin marca o una raíz.

## Intuición

Esta es la operación que le pone freno a la pereza de `Cut`: si se
permitiera que un nodo perdiera cualquier cantidad de hijos sin
consecuencias, los árboles podrían quedar arbitrariamente desbalanceados y
la cota de grado `D(n) = O(lg n)` (ver
[Análisis de complejidad](/structures/fibonacci-heap#análisis-de-complejidad))
se rompería. La regla dice: "cada nodo puede perder a lo mucho un hijo sin
ser cortado de su propio padre". La primera vez que un nodo pierde un
hijo, sólo se marca (una advertencia). La segunda vez, se corta él mismo —
y como cortarlo puede hacer que *su* padre pierda un hijo, el proceso se
repite hacia arriba: de ahí "cascada".

## Algoritmo

1. `z ← padre(y)`.
2. Si `z ≠ nulo`:
   - Si `marca(y) = falso`: marcar `y` (`marca(y) ← verdadero`) y
     detenerse.
   - Si no (`y` ya estaba marcado): `Cut(H, y, z)`, y repetir el proceso
     con `Cascading-Cut(H, z)`.

La recursión para sola cuando llega a una raíz (`z = nulo`) o a un nodo
que todavía no estaba marcado.

## Pseudocódigo

```
Algoritmo 10: Cascading-Cut(H, y)
z ← padre(y) ;
si z ≠ nulo entonces
    si marca(y) = falso entonces
        marca(y) ← verdadero ;
    en otro caso
        Cut(H, y, z) ;
        Cascading-Cut(H, z) ;
```

## C++

Ver `step-4-cut-cascading.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

Costo real `O(c)`, con `c` el número de cortes reales que dispara la
cascada: cada nivel de recursión hace `O(1)` de trabajo (marcar, o cortar y
subir un nivel), y la recursión termina en la primera raíz o el primer
nodo sin marcar que encuentra. El profesor no da esta cota por separado en
el mazo: se absorbe dentro del análisis amortizado de
[Decrease-Key](/structures/fibonacci-heap/operations/decrease-key), que es
su único invocador aquí.

## Complejidad espacial

`O(c)` de pila de recursión, con `c` la longitud de la cascada (o `O(1)`
si se reescribe de forma iterativa, ya que cada llamada sólo necesita el
nodo actual).

## Ejemplo

Ver la visualización paso a paso arriba: la cadena `G → P → C` del mazo
(páginas 16-18, diapositiva 9), donde `P` ya estaba marcado. Cortar `C`
dispara la cascada hacia `P` (que se corta) y se detiene en `G` (que no
tiene padre). El resultado — `G`, `P`, `C` como tres raíces sueltas, sin
marca — es exactamente lo que muestra el mazo original.

## Casos límite

- **`y` es ya una raíz** (`padre(y) = nulo`): la condición `z ≠ nulo` es
  falsa de entrada; la función no hace nada. Consistente con "las raíces
  nunca están marcadas": nunca debería llamarse `Cascading-Cut` con una
  marca pendiente sobre una raíz.
- **La cascada llega hasta la raíz del árbol completo**: se detiene ahí
  sin marcarla (las raíces no se marcan), sin importar cuántos hijos haya
  perdido antes.
- **`y` no estaba marcado**: la cascada se detiene en el primer paso, sin
  ningún corte adicional — el caso más común, y la razón por la que el
  costo amortizado de Decrease-Key sigue siendo O(1) a pesar de este
  peor caso O(c).
