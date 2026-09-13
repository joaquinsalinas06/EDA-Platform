---
kind: operation
title: Union
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - full-implementation.cpp
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

Costo real `O(1)`: concatenar dos listas circulares es reconectar cuatro
punteros, sin importar cuántas raíces tenga cada una. Con
`Φ(H) = t(H) + 2·m(H)`: `t(H)` y `m(H)` del resultado son exactamente la
suma de los de `H1` y `H2` (nada se crea ni se destruye al concatenar), así
que `ΔΦ = 0` y el costo amortizado `ĉ = O(1) + 0 = O(1)`.

## Complejidad espacial

`O(1)` adicional.

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
