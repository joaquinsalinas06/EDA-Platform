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
        Estado antes del corte: la cadena R → G → P → C (raíz, abuelo,
        padre, hijo) — un nivel más que el mínimo, para que se vea de
        verdad cómo la cascada sube "nivel a nivel" y no se confunda con
        un solo corte. G y P ya están marcados (cada uno perdió un hijo
        antes de este momento, en operaciones anteriores); R y C no. C
        acaba de perder su invariante con P (por ejemplo, un
        [Decrease-Key](/structures/fibonacci-heap/operations/decrease-key)
        sobre C) y se va a cortar.
      highlight: ["C"]
      nodes:
        - { id: R, value: "R", parent: null }
        - { id: G, value: "G", parent: R, state: marked }
        - { id: P, value: "P", parent: G, state: marked }
        - { id: C, value: "C", parent: P, state: active }
    - note: >-
        Cut(H, C, P): C se separa de P y se agrega como raíz nueva, sin
        padre y sin marca (las raíces nunca están marcadas). grado(P) baja
        en 1. Hasta aquí es un corte normal, sin cascada todavía.
      highlight: ["C", "P"]
      nodes:
        - { id: R, value: "R", parent: null }
        - { id: G, value: "G", parent: R, state: marked }
        - { id: P, value: "P", parent: G, state: marked }
        - { id: C, value: "C", parent: null, state: active }
    - note: >-
        Cascading-Cut(H, P): P ya estaba marcado, así que no basta con
        marcarlo de nuevo (ya tenía la advertencia); pierde un *segundo*
        hijo (a C) y eso dispara su propio corte. La cascada sube un
        nivel, hacia el padre de P, que es G.
      highlight: ["P"]
      nodes:
        - { id: R, value: "R", parent: null }
        - { id: G, value: "G", parent: R, state: marked }
        - { id: P, value: "P", parent: G, state: active }
        - { id: C, value: "C", parent: null }
    - note: >-
        Cut(H, P, G): P se separa de G y se agrega como raíz, sin marca.
        grado(G) baja en 1. Igual que antes: primero el corte de este
        nivel, la decisión de si sigue en cascada viene después.
      highlight: ["P", "G"]
      nodes:
        - { id: R, value: "R", parent: null }
        - { id: G, value: "G", parent: R, state: marked }
        - { id: P, value: "P", parent: null, state: active }
        - { id: C, value: "C", parent: null }
    - note: >-
        Cascading-Cut(H, G): G también estaba marcado, así que igual que
        con P, la marca no alcanza — G pierde su segundo hijo (a P) y se
        corta también. La cascada sube un nivel más, hacia el padre de G,
        que es R. Ésta es la segunda cascada seguida: la razón por la que
        el diagrama necesita cuatro niveles para verse de verdad.
      highlight: ["G"]
      nodes:
        - { id: R, value: "R", parent: null }
        - { id: G, value: "G", parent: R, state: active }
        - { id: P, value: "P", parent: null }
        - { id: C, value: "C", parent: null }
    - note: >-
        Cut(H, G, R): G se separa de R y se agrega como raíz, sin marca.
        grado(R) baja en 1. Cascading-Cut(H, R): R no tiene padre (es
        raíz de todo el árbol), así que aquí la recursión se detiene sin
        marcar a R — el otro punto de parada posible, además de "nodo sin
        marca".
      highlight: ["G", "R"]
      nodes:
        - { id: R, value: "R", parent: null }
        - { id: G, value: "G", parent: null, state: active }
        - { id: P, value: "P", parent: null }
        - { id: C, value: "C", parent: null }
    - note: >-
        Estado final: R, G, P y C quedan como cuatro raíces sueltas,
        ninguna marcada — la cascada consumió las dos marcas que había
        (en G y en P) y se detuvo en la raíz del árbol original. Si
        cualquiera de estos cuatro nodos vuelve a perder un hijo en el
        futuro, empieza de cero: se marca la primera vez, se corta la
        segunda.
      highlight: ["R", "G", "P", "C"]
      nodes:
        - { id: R, value: "R", parent: null }
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
la cota de grado $D(n) = O(\lg n)$ (ver
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

Costo real $O(c)$, con $c$ el número de cortes reales que dispara la
cascada: cada nivel de recursión hace $O(1)$ de trabajo (marcar, o cortar y
subir un nivel), y la recursión termina en la primera raíz o el primer
nodo sin marcar que encuentra. El profesor no da esta cota por separado en
el mazo: se absorbe dentro del análisis amortizado de
[Decrease-Key](/structures/fibonacci-heap/operations/decrease-key), que es
su único invocador aquí.

## Complejidad espacial

$O(c)$ de pila de recursión, con $c$ la longitud de la cascada (o $O(1)$
si se reescribe de forma iterativa, ya que cada llamada sólo necesita el
nodo actual).

## Ejemplo

Ver la visualización paso a paso arriba: una cadena `R → G → P → C` (un
nivel más que el ejemplo mínimo del mazo, páginas 16-18, diapositiva 9,
para que se vea la cascada subir dos niveles seguidos), donde tanto `G`
como `P` ya estaban marcados. Cortar `C` dispara `Cascading-Cut` sobre `P`
(marcado $\implies$ se corta también) y esa misma cascada sigue sobre `G` (también
marcado $\implies$ se corta) hasta llegar a `R`, que no tiene padre y detiene la
recursión. El resultado — `R`, `G`, `P`, `C` como cuatro raíces sueltas,
ninguna marcada — es la versión de dos cascadas seguidas del mismo
mecanismo que muestra el mazo con una sola.

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
  costo amortizado de Decrease-Key sigue siendo $O(1)$ a pesar de este
  peor caso $O(c)$.
