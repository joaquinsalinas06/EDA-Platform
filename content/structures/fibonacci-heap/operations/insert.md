---
kind: operation
title: Insert
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - note: >-
        Estado inicial *(derivado del pseudocódigo; no aparece así en las
        diapositivas)*: la lista de raíces ya tiene dos árboles sueltos —
        `g(7)`, el actual `min(H)`, y `n(4)` con su hijo `h(9)`. Se va a
        llamar `Insert(H, 3)`.
      highlight: ["g"]
      nodes:
        - { id: g, value: 7, parent: null, state: active }
        - { id: n, value: 4, parent: null }
        - { id: h, value: 9, parent: n }
    - note: >-
        Paso 1: se inicializa `x` con `grado(x) ← 0`, `padre(x) ← nulo`,
        `marca(x) ← falso`. Todavía no es parte de la lista de raíces —
        `copied` marca que es un nodo nuevo de esta versión, no tocado.
      highlight: ["x"]
      nodes:
        - { id: g, value: 7, parent: null }
        - { id: n, value: 4, parent: null }
        - { id: h, value: 9, parent: n }
        - { id: x, value: 3, parent: null, state: copied }
    - note: >-
        Paso 2: se agrega `x` como árbol de un solo nodo a la lista de
        raíces de `H` — empalme de punteros en O(1), sin recorrer ni
        comparar con nada todavía.
      highlight: ["x"]
      nodes:
        - { id: g, value: 7, parent: null }
        - { id: n, value: 4, parent: null }
        - { id: h, value: 9, parent: n }
        - { id: x, value: 3, parent: null, state: active }
    - note: >-
        Paso 3: se compara `llave(x)=3` contra `llave(min(H))=7`. Como
        `3 < 7`, se cumple la condición y toca actualizar `min(H)`.
      highlight: ["x", "g"]
      nodes:
        - { id: g, value: 7, parent: null, state: active }
        - { id: n, value: 4, parent: null }
        - { id: h, value: 9, parent: n }
        - { id: x, value: 3, parent: null, state: active }
    - note: >-
        `min(H) ← x`. `g` deja de ser el mínimo pero sigue como raíz
        suelta, sin marca de haber perdido ese rol.
      highlight: ["x"]
      nodes:
        - { id: g, value: 7, parent: null }
        - { id: n, value: 4, parent: null }
        - { id: h, value: 9, parent: n }
        - { id: x, value: 3, parent: null, state: active }
    - note: >-
        Estado final: tres árboles sueltos en la lista de raíces —
        `x(3)` como nuevo `min(H)`, `g(7)`, `n(4)` con hijo `h(9)` — nada
        se reordenó ni se enlazó. Ese reordenamiento sólo ocurre cuando un
        futuro [Extract-Min](/structures/fibonacci-heap/operations/extract-min)
        llame a [Consolidate](/structures/fibonacci-heap/operations/consolidate).
      highlight: []
      nodes:
        - { id: x, value: 3, parent: null }
        - { id: g, value: 7, parent: null }
        - { id: n, value: 4, parent: null }
        - { id: h, value: 9, parent: n }
---

## Qué hace

Agrega un elemento nuevo al montículo como un árbol de un solo nodo,
preservando el invariante de montículo mínimo.

## Intuición

No hay nada que reorganizar: el nodo nuevo se vuelve, por sí solo, un árbol
más en la lista circular de raíces. Es exactamente la pereza que describe
el mazo: "sólo agregan el nuevo nodo a la lista de raíces en O(1)". Si su
llave es menor que la del mínimo actual, se convierte en el nuevo mínimo;
si no, simplemente queda ahí hasta que algún `Extract-Min` lo toque.

## Algoritmo

1. Inicializar `grado(x) ← 0`, `padre(x) ← nulo`, `marca(x) ← falso`.
2. Agregar `x` como árbol de un solo nodo a la lista de raíces de `H`.
3. Si `min(H)` es nulo o `llave(x) < llave(min(H))`, actualizar
   `min(H) ← x`.

## Pseudocódigo

```
Algoritmo 5: Insert(H, x)
grado(x) ← 0; padre(x) ← nulo; marca(x) ← falso ;
Agregar x como un árbol de un solo nodo a la lista de raíces de H ;
si min(H) = nulo o llave(x) < llave(min(H)) entonces
    min(H) ← x ;
```

## C++

Ver `step-3-insert-union.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

Costo real $O(1)$: agregar un nodo a una lista circular doblemente
enlazada es empalmar cuatro punteros, sin recorrer nada. Con el potencial
$\Phi(H) = t(H) + 2 \cdot m(H)$ (ver [Análisis de complejidad](/structures/fibonacci-heap#análisis-de-complejidad)
en la teoría), $t(H)$ sube en 1 y $m(H)$ no cambia, así que $\Delta\Phi = 1$ y el
costo amortizado $\hat{c} = O(1) + 1 = O(1)$.

## Complejidad espacial

$O(1)$ adicional por nodo insertado (el nodo mismo).

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Sobre un
montículo con `min(H)` de llave `7`: `Insert(H, 3)` crea un nodo con
`grado = 0`, `marca = falso`, lo agrega a la lista de raíces, y como
`3 < 7`, actualiza `min(H)` al nuevo nodo.

## Casos límite

- **Montículo vacío**: `min(H) = nulo`, la condición del paso 3 se cumple
  de inmediato y el nuevo nodo se vuelve `min(H)` sin comparar llaves.
- **Insertar el nuevo mínimo global**: actualiza `min(H)`, sin tocar la
  estructura de árboles existente.
- **Insertar un valor mayor que todos**: el nodo queda como raíz suelta en
  la lista, sin afectar `min(H)`; sólo se reordenará cuando algún
  `Extract-Min` futuro llame a
  [Consolidate](/structures/fibonacci-heap/operations/consolidate).
