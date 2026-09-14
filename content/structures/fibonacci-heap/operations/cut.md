---
kind: operation
title: Cut
order: 3
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
        Estado inicial *(derivado del pseudocódigo)*: `r(1)` es raíz y
        `min(H)`, `p(8)` es su hijo, y `p` tiene tres hijos —
        `x(15)`, ya marcado por haber perdido un hijo antes, `y(20)` y
        `z(25)`. `grado(p) = 3`. Se va a llamar `Cut(H, x, p)`.
      highlight: ["x"]
      nodes:
        - { id: r, value: 1, parent: null }
        - { id: p, value: 8, parent: r }
        - { id: x, value: 15, parent: p, state: marked }
        - { id: y, value: 20, parent: p }
        - { id: z, value: 25, parent: p }
    - note: >-
        Paso 1a: se quita `x` de la lista de hijos de `p`. `x` se separa
        del enlace padre-hijo; a `p` sólo le quedan `y` y `z`.
      highlight: ["x", "p"]
      nodes:
        - { id: r, value: 1, parent: null }
        - { id: p, value: 8, parent: r, state: active }
        - { id: x, value: 15, parent: null, state: active }
        - { id: y, value: 20, parent: p }
        - { id: z, value: 25, parent: p }
    - note: >-
        Paso 1b: `grado(p) ← grado(p) − 1`, de 3 a 2. Es una actualización
        de contador, separada de desenlazar a `x` — ninguna otra
        estructura se toca.
      highlight: ["p"]
      nodes:
        - { id: r, value: 1, parent: null }
        - { id: p, value: 8, parent: r, state: active }
        - { id: x, value: 15, parent: null }
        - { id: y, value: 20, parent: p }
        - { id: z, value: 25, parent: p }
    - note: >-
        Paso 2a: se agrega `x` a la lista de raíces de `H` — empalme de
        punteros en O(1), igual que en
        [Insert](/structures/fibonacci-heap/operations/insert). `x`
        todavía conserva su marca vieja en este instante.
      highlight: ["x"]
      nodes:
        - { id: r, value: 1, parent: null }
        - { id: p, value: 8, parent: r }
        - { id: x, value: 15, parent: null, state: marked }
        - { id: y, value: 20, parent: p }
        - { id: z, value: 25, parent: p }
    - note: >-
        Paso 2b: `padre(x) ← nulo` (ya lo estaba desde el paso 1a) y
        `marca(x) ← falso`. Como raíz, `x` no puede seguir marcado — la
        marca sólo tiene sentido en un nodo con padre.
      highlight: ["x"]
      nodes:
        - { id: r, value: 1, parent: null }
        - { id: p, value: 8, parent: r }
        - { id: x, value: 15, parent: null, state: active }
        - { id: y, value: 20, parent: p }
        - { id: z, value: 25, parent: p }
    - note: >-
        Estado final: `x(15)` es raíz independiente y sin marca,
        `p(8)` quedó con `grado = 2` y sus hijos restantes `y`, `z`. Aquí
        `p` no estaba marcado, así que el corte termina sin propagarse. Si
        `p` ya hubiera estado marcado (por haber perdido un hijo antes),
        este mismo `Cut` sería el disparador de
        [Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut)
        sobre `p` — esa continuación no se repite aquí.
      highlight: []
      nodes:
        - { id: r, value: 1, parent: null }
        - { id: p, value: 8, parent: r }
        - { id: x, value: 15, parent: null }
        - { id: y, value: 20, parent: p }
        - { id: z, value: 25, parent: p }
---

## Qué hace

Separa un nodo `x` de su padre `p` y lo agrega como raíz nueva en la lista
de raíces de `H`.

## Intuición

Es la operación de bajo nivel que hace posible que `Decrease-Key` sea
rápido: en vez de reordenar todo el árbol cuando una llave baja demasiado,
el nodo simplemente "escapa" hacia arriba, convirtiéndose en su propio
árbol de raíz. Como toda raíz, deja de estar marcado — la marca sólo tiene
sentido en un nodo que todavía tiene padre.

## Algoritmo

1. Quitar `x` de la lista de hijos de `p`; decrementar `grado(p)`.
2. Agregar `x` a la lista de raíces de `H`; `padre(x) ← nulo`;
   `marca(x) ← falso`.

## Pseudocódigo

```
Algoritmo 9: Cut(H, x, p)
Quitar x de la lista de hijos de p; grado(p) ← grado(p) − 1 ;
Agregar x a la lista de raíces de H; padre(x) ← nulo; marca(x) ← falso ;
```

## C++

Ver `step-4-cut-cascading.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

Costo real $O(1)$: quitar `x` de una lista circular y agregarlo a otra son
ambas operaciones de reconexión de punteros, sin recorrer nada. El
profesor lo da directo, sin distinguir amortizado — el análisis amortizado
se hace sobre [Decrease-Key](/structures/fibonacci-heap/operations/decrease-key),
que es quien invoca `Cut` (a través de
[Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut)).

## Complejidad espacial

$O(1)$ adicional.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Sea `p` un
nodo con hijos `{x, y, z}` y `grado(p) = 3`. `Cut(H, x, p)` quita `x` de
esa lista (quedan `{y, z}`, `grado(p) = 2`), agrega `x` a la lista de
raíces de `H`, y pone `padre(x) ← nulo`, `marca(x) ← falso`
(independientemente de si `x` estaba marcado antes).

## Casos límite

- **`x` es el único hijo de `p`**: `grado(p)` pasa a `0`; el puntero de
  `p` a "algún hijo" debe quedar en nulo.
- **`x` ya estaba marcado**: `Cut` lo desmarca igual — es la raíz que
  hace que la cuenta de nodos marcados $m(H)$ baje en el análisis de
  potencial de Decrease-Key.
- **`H` está vacío antes del corte**: no puede ocurrir en este mazo, porque
  `Cut` siempre se invoca sobre un nodo `x` con padre `p`, y si existe un
  nodo con padre, `H` ya tiene al menos ese árbol.
