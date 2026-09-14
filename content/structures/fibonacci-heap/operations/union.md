---
kind: operation
title: Union
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - note: >-
        Los dos montículos de entrada, uno al lado del otro — todavía
        completamente separados. `H1` = {`a(5)` como `min(H1)`, `b(9)`
        con hijo `c(14)`}. `H2` = {`d(12)` como `min(H2)`, `e(20)`}. A
        diferencia de [Union en montículo binomial](/structures/binomial-heap/operations/union),
        aquí no hay grados que alinear ni enlazar: sólo empalmar listas.
      highlight: []
      panels:
        - { id: h1, label: "H1" }
        - { id: h2, label: "H2" }
      nodes:
        - { id: a, value: 5, parent: null, panel: h1, state: active }
        - { id: b, value: 9, parent: null, panel: h1 }
        - { id: c, value: 14, parent: b, panel: h1 }
        - { id: d, value: 12, parent: null, panel: h2, state: active }
        - { id: e, value: 20, parent: null, panel: h2 }
    - note: >-
        Paso 1a: se conecta la cola de la lista circular de `H1` con la
        cabeza de la de `H2` — un solo empalme de punteros, sin tocar
        ningún nodo interno de ninguno de los dos árboles.
      highlight: ["b", "d"]
      links:
        - { from: b, to: d, kind: pointer }
      nodes:
        - { id: a, value: 5, parent: null, panel: h1 }
        - { id: b, value: 9, parent: null, panel: h1, state: active }
        - { id: c, value: 14, parent: b, panel: h1 }
        - { id: d, value: 12, parent: null, panel: h2, state: active }
        - { id: e, value: 20, parent: null, panel: h2 }
    - note: >-
        Paso 1b: se conecta la cola de `H2` de vuelta a la cabeza de `H1`,
        cerrando una única lista circular. Los paneles desaparecen: ya no
        hay "H1" y "H2", hay un solo bosque de cuatro árboles sueltos.
      highlight: ["e", "a"]
      links:
        - { from: e, to: a, kind: pointer }
      nodes:
        - { id: a, value: 5, parent: null, state: active }
        - { id: b, value: 9, parent: null }
        - { id: c, value: 14, parent: b }
        - { id: d, value: 12, parent: null }
        - { id: e, value: 20, parent: null, state: active }
    - note: >-
        Paso 2 (comparación): se comparan `min(H1)=5` y `min(H2)=12` para
        decidir cuál sobrevive como `min(H)` del montículo unido.
      highlight: ["a", "d"]
      nodes:
        - { id: a, value: 5, parent: null, state: active }
        - { id: b, value: 9, parent: null }
        - { id: c, value: 14, parent: b }
        - { id: d, value: 12, parent: null, state: active }
        - { id: e, value: 20, parent: null }
    - note: >-
        `min(H) ← mín(5, 12) = 5`. `a` queda como el mínimo global; `d`
        sigue siendo una raíz suelta más, sin ningún rol especial.
      highlight: ["a"]
      nodes:
        - { id: a, value: 5, parent: null, state: active }
        - { id: b, value: 9, parent: null }
        - { id: c, value: 14, parent: b }
        - { id: d, value: 12, parent: null }
        - { id: e, value: 20, parent: null }
    - note: >-
        Estado final: una sola lista de raíces con los cuatro árboles de
        `H1` y `H2` sin fusionar entre sí — `b(9)` y `d(12)` mismo grado
        (0 y 0 en realidad, pero incluso si compartieran grado, Fibonacci
        no los enlazaría aquí). El "desorden" de grados repetidos se paga
        recién en un futuro
        [Extract-Min](/structures/fibonacci-heap/operations/extract-min).
      highlight: []
      nodes:
        - { id: a, value: 5, parent: null }
        - { id: b, value: 9, parent: null }
        - { id: c, value: 14, parent: b }
        - { id: d, value: 12, parent: null }
        - { id: e, value: 20, parent: null }
---

## Qué hace

Combina dos montículos de Fibonacci en uno solo.

## Intuición

Igual de perezoso que Insert: como cada montículo es una lista circular de
raíces, unir dos montículos es sólo empalmar las dos listas en una — sin
comparar ni mover ningún nodo interno. Sólo hace falta comparar los dos
punteros `min` para decidir cuál sobrevive como el mínimo global.

## Algoritmo

1. Concatenar las listas de raíces de `H1` y `H2` en una sola lista
   circular.
2. `min(H) ← mín(min(H1), min(H2))`.
3. Devolver `H`.

## Pseudocódigo

```
Algoritmo 6: Union(H1, H2)
Concatenar las listas de raíces de H1 y H2 en una sola lista circular ;
min(H) ← mín(min(H1), min(H2)) ;
devolver H ;
```

## C++

Ver `step-3-insert-union.cpp` y `full-implementation.cpp` en el editor de
arriba. `unionWith` reutiliza el mismo `spliceInto` de Insert: empalmar una
lista circular completa dentro de otra es la misma operación de punteros
que empalmar un solo nodo.

## Complejidad temporal

Costo real $O(1)$: concatenar dos listas circulares es reconectar cuatro
punteros, sin importar cuántas raíces tenga cada una. Con
$\Phi(H) = t(H) + 2 \cdot m(H)$: $t(H)$ y $m(H)$ del resultado son exactamente la
suma de los de `H1` y `H2` (nada se crea ni se destruye al concatenar), así
que $\Delta\Phi = 0$ y el costo amortizado $\hat{c} = O(1) + 0 = O(1)$.

## Complejidad espacial

$O(1)$ adicional.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* `H1` con
`min(H1)` de llave `5` y `H2` con `min(H2)` de llave `12`: tras
`Union(H1, H2)`, la lista de raíces resultante contiene las raíces de
ambos, y `min(H) = 5` porque `5 < 12`.

## Casos límite

- **Uno de los dos está vacío**: si `H2` no tiene raíces, el resultado es
  simplemente `H1` sin cambios (y viceversa) — no hay nada que concatenar.
- **Ambos vacíos**: el resultado es un montículo vacío, `min(H) = nulo`.
- **Los dos mínimos empatan**: cualquiera de los dos puede quedar como
  `min(H)`; el pseudocódigo no distingue el caso de igualdad.
