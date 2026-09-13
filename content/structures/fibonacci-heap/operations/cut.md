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

Costo real `O(1)`: quitar `x` de una lista circular y agregarlo a otra son
ambas operaciones de reconexión de punteros, sin recorrer nada. El
profesor lo da directo, sin distinguir amortizado — el análisis amortizado
se hace sobre [Decrease-Key](/structures/fibonacci-heap/operations/decrease-key),
que es quien invoca `Cut` (a través de
[Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut)).

## Complejidad espacial

`O(1)` adicional.

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
  hace que la cuenta de nodos marcados `m(H)` baje en el análisis de
  potencial de Decrease-Key.
- **`H` está vacío antes del corte**: no puede ocurrir en este mazo, porque
  `Cut` siempre se invoca sobre un nodo `x` con padre `p`, y si existe un
  nodo con padre, `H` ya tiene al menos ese árbol.
