---
kind: operation
title: Extract-Min
order: 7
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - step-4-cut-cascading.cpp
  - step-5-decrease-key.cpp
  - step-6-consolidate.cpp
  - step-7-extract-min.cpp
  - full-implementation.cpp
---

## Qué hace

Retira y devuelve el nodo con la llave mínima del montículo, y deja la
estructura lista para la siguiente extracción.

## Intuición

Es donde se paga toda la pereza acumulada por
[Insert](/structures/fibonacci-heap/operations/insert),
[Union](/structures/fibonacci-heap/operations/union) y
[Decrease-Key](/structures/fibonacci-heap/operations/decrease-key). El
profesor lo describe en dos pasos de alto nivel:

```
Paso 1: remover
Se quita la raíz mínima; todos sus hijos pasan a la lista de raíces (sin
marca, pues las raíces nunca están marcadas).

Paso 2: consolidar
Se recorre la lista de raíces enlazando pares de árboles del mismo grado
(la raíz con llave mayor se vuelve hijo de la otra), repitiendo hasta que
todos los grados en la lista de raíces sean distintos — igual que un
montículo binomial.
```

El paso 2 es exactamente
[Consolidate](/structures/fibonacci-heap/operations/consolidate).

## Algoritmo

1. `z ← min(H)`.
2. Si `z ≠ nulo`:
   1. Agregar cada hijo de `z` a la lista de raíces de `H`, quitándole el
      padre (y la marca, porque las raíces nunca están marcadas).
   2. Quitar `z` de la lista de raíces.
   3. Si `z` era la única raíz: `min(H) ← nulo`.
   4. Si no: `min(H) ←` alguna raíz restante, y llamar
      [Consolidate](/structures/fibonacci-heap/operations/consolidate)`(H)`.
3. Devolver `z`.

## Pseudocódigo

```
Algoritmo 13: Extract-Min(H)
z ← min(H) ;
si z ≠ nulo entonces
    Agregar cada hijo de z a la lista de raíces, quitándole el padre ;
    Quitar z de la lista de raíces ;
    si z era la única raíz entonces
        min(H) ← nulo ;
    en otro caso
        min(H) ← alguna raíz restante ;
        Consolidate(H) ;

devolver z ;
```

## C++

Ver `step-7-extract-min.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

Costo real `O(D(n) + t(H))`: subir los hijos de `z` a la lista de raíces
es `O(grado(z))`, acotado por `O(D(n))` (la cota de grado máximo); y
[Consolidate](/structures/fibonacci-heap/operations/consolidate) recorre
las `t(H)` raíces resultantes. Con el potencial
`Φ(H) = t(H) + 2·m(H)`: después de consolidar quedan a lo más `D(n) + 1`
raíces (por cómo funciona el arreglo `A[0..D(n)]` de Consolidate), y
`m(H)` no aumenta (subir hijos a la raíz sólo los desmarca), así que
`ΔΦ ≤ (D(n) + 1) − t(H)`. El costo amortizado resulta
`ĉ = O(D(n) + t(H)) + (D(n) + 1) − t(H) = O(D(n)) = O(lg n)`, porque
`D(n) = O(lg n)` por la cota de grado probada vía la recurrencia de
Fibonacci (ver
[Análisis de complejidad](/structures/fibonacci-heap#análisis-de-complejidad)
en la teoría).

## Complejidad espacial

`O(D(n))` adicional dentro de Consolidate (el arreglo `A`); `O(1)` para el
resto de Extract-Min.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Sea `H` con
`min(H)` de llave `3`, grado 2, con hijos de llaves `9` y `15`, y otras dos
raíces sueltas de llaves `7` y `20`. `Extract-Min(H)` sube `9` y `15` a la
lista de raíces (ahora `{9, 15, 7, 20}`), quita `3`, y como no era la única
raíz, fija `min(H)` a cualquiera de las restantes (por ejemplo `9`) y llama
a `Consolidate`, que reordena esas cuatro raíces por grado (ver el ejemplo
de [Consolidate](/structures/fibonacci-heap/operations/consolidate)) hasta
dejar el verdadero mínimo (`7`) como `min(H)`.

## Casos límite

- **Montículo vacío** (`z = nulo`): la guarda `si z ≠ nulo` evita todo el
  cuerpo; `devolver z` devuelve nulo. El profesor codifica la guarda pero
  no lo comenta en prosa.
- **`z` era la única raíz** (con o sin hijos): tratado explícitamente en
  el pseudocódigo. Si además no tenía hijos, el montículo queda vacío
  (`min(H) ← nulo`) sin llamar a Consolidate. Si tenía hijos, esos hijos
  pasan a ser las únicas raíces y sí hace falta consolidar (para
  encontrar el nuevo mínimo entre ellos), aunque el pseudocódigo del
  profesor no distingue este sub-caso por separado.
- **`z` es una hoja (grado 0) y hay más raíces**: el paso de subir hijos
  no hace nada; sólo se quita `z` de la lista y se consolida el resto.
- **Todas las raíces terminan con grados distintos sin que Consolidate
  tenga que enlazar nada**: sigue costando `O(t(H))` recorrerlas, aunque
  no haya ningún `Binomial-Link`.
