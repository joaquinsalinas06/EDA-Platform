---
kind: operation
title: Decrease-Key
order: 5
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - step-4-cut-cascading.cpp
  - step-5-decrease-key.cpp
  - full-implementation.cpp
---

## Qué hace

Baja la llave de un nodo `x` a un valor `k`, y si eso rompe el invariante
de montículo mínimo con su padre, lo corta y dispara la regla de las
marcas hacia arriba.

## Intuición

Si `x` no tiene padre, o su nueva llave sigue siendo mayor o igual que la
de su padre, no hay nada más que hacer: el invariante local sigue válido.
Pero si `x` se vuelve menor que su padre, no se puede simplemente
"burbujear" hacia arriba como en un montículo binario — eso costaría
O(altura del árbol), que puede ser grande. En cambio, `x` se corta de
inmediato ([Cut](/structures/fibonacci-heap/operations/cut), O(1)) y se
convierte en su propia raíz; la regla de las marcas
([Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut))
se encarga de mantener acotado cuánto se puede desordenar el árbol del
padre por este corte.

## Algoritmo

1. `llave(x) ← k`.
2. `p ← padre(x)`.
3. Si `p ≠ nulo` y `llave(x) < llave(p)`: `Cut(H, x, p)` y
   `Cascading-Cut(H, p)`.
4. Si `llave(x) < llave(min(H))`: `min(H) ← x`.

## Pseudocódigo

```
Algoritmo 12: Decrease-Key(H, x, k)
llave(x) ← k ;
p ← padre(x) ;
si p ≠ nulo y llave(x) < llave(p) entonces
    Cut(H, x, p) ;
    Cascading-Cut(H, p) ;
si llave(x) < llave(min(H)) entonces
     min(H) ← x ;
```

## C++

Ver `step-5-decrease-key.cpp` y `full-implementation.cpp` en el editor de
arriba. La implementación rechaza explícitamente `k > llave(x)`: el
pseudocódigo del profesor asignaría la llave igual, rompiendo en silencio
el invariante de montículo mínimo (caso que el mazo no comenta).

## Complejidad temporal

Costo real `O(c)` con `c` el número de cortes en cascada disparados. Con
el potencial `Φ(H) = t(H) + 2·m(H)`: cada uno de los `c` cortes agrega un
árbol a la lista de raíces (`+1` a `t(H)`) y desmarca a un nodo (`−2` al
potencial, porque `Cut` siempre pone `marca ← falso`), salvo el último
nodo de la cadena, que sólo se marca sin cortarse (`+2`). El profesor
acota `ΔΦ ≤ 4 − c`, y el costo amortizado resulta
`ĉᵢ = O(c) + (4 − c) = O(1)`: entre más cortes reales hace la operación,
más cae el potencial, y esa caída paga exactamente ese trabajo extra.

## Complejidad espacial

`O(c)` de pila de recursión dentro de `Cascading-Cut` (o `O(1)` con una
versión iterativa).

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Sobre el
mismo escenario `G → P → C` de la visualización de
[Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut), con
`P` ya marcado: `Decrease-Key(H, C, k)` con `k` menor que `llave(P)`
dispara `Cut(H, C, P)` y luego `Cascading-Cut(H, P)`, que al encontrar a
`P` ya marcado también lo corta y sube hasta `G`, deteniéndose ahí. Si
además `k < llave(min(H))`, el propio `C` se vuelve el nuevo mínimo.

## Casos límite

- **`x` ya es una raíz** (`p = nulo`): el paso 3 no aplica; sólo se
  actualiza la llave y, si corresponde, `min(H)`.
- **La nueva llave no rompe el invariante con el padre**
  (`llave(x) ≥ llave(p)`): no se corta nada; sólo cambia la llave.
- **`c = 0` cortes** (el caso anterior): el costo real es `O(1)`, y el
  amortizado sigue siendo `O(1)` — el análisis de potencial cubre ambos
  extremos con la misma fórmula.
- **`k > llave(x)`**: no está en el pseudocódigo del profesor, que lo
  asignaría igual y corrompería el invariante en silencio; esta
  implementación lo rechaza con una excepción en vez de eso.
