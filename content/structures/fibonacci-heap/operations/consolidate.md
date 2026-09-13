---
kind: operation
title: Consolidate
order: 6
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - step-4-cut-cascading.cpp
  - step-5-decrease-key.cpp
  - step-6-consolidate.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - "note: >-"
        Estado inicial (derivado, no está en las diapositivas): tres
        raíces sueltas de grado 0 con llaves 7, 3 y 5, resultado de haber
        subido los hijos de la antigua raíz mínima en Extract-Min. A[d]
        está vacío para todo d.
      highlight: ["r7", "r3", "r5"]
      nodes:
        - "{ id: r7, value: 7, parent: null }"
        - "{ id: r3, value: 3, parent: null }"
        - "{ id: r5, value: 5, parent: null }"
    - "note: >-"
        Se procesa la raíz 7 (grado 0): A[0] está vacío, así que sólo se
        guarda A[0] = 7. Nada se enlaza todavía.
      highlight: ["r7"]
      nodes:
        - "{ id: r7, value: 7, parent: null }"
        - "{ id: r3, value: 3, parent: null }"
        - "{ id: r5, value: 5, parent: null }"
    - "note: >-"
        Se procesa la raíz 3 (grado 0): A[0] ya tiene a 7. Como
        llave(3) < llave(7), NO se intercambia (3 ya es el menor);
        Binomial-Link(7, 3) hace de 7 hijo de 3. A[0] se limpia, d pasa a
        1, y como A[1] está vacío, se guarda A[1] = 3 (ahora de grado 1).
      highlight: ["r3", "r7"]
      nodes:
        - "{ id: r3, value: 3, parent: null }"
        - "{ id: r7, value: 7, parent: r3 }"
        - "{ id: r5, value: 5, parent: null }"
    - "note: >-"
        Se procesa la raíz 5 (grado 0): A[0] está vacío (se limpió en el
        paso anterior), así que sólo se guarda A[0] = 5. Fin del
        recorrido: quedan A[0] = 5 y A[1] = 3(con hijo 7) — todos los
        grados en la lista de raíces final son distintos, exactamente como
        en un montículo binomial.
      highlight: ["r5"]
      nodes:
        - "{ id: r3, value: 3, parent: null }"
        - "{ id: r7, value: 7, parent: r3 }"
        - "{ id: r5, value: 5, parent: null }"
---

## Qué hace

Recorre la lista de raíces y fusiona árboles del mismo grado, dos a la
vez, hasta que todos los grados que quedan en la lista de raíces son
distintos entre sí.

## Intuición

Es el precio que se paga por toda la pereza de
[Insert](/structures/fibonacci-heap/operations/insert),
[Union](/structures/fibonacci-heap/operations/union) y
[Decrease-Key](/structures/fibonacci-heap/operations/decrease-key): esas
operaciones dejan la lista de raíces desordenada — potencialmente muchas
raíces de grado 0, o grados repetidos. `Consolidate` la reordena de golpe,
"igual que un montículo binomial" (página 20 del mazo): usa un arreglo
`A` indexado por grado como casilleros; cuando dos árboles caen en la
misma casilla, se enlazan con
[Binomial-Link](/structures/binomial-heap/operations/binomial-link) (la
raíz de llave mayor se vuelve hijo de la menor) y el árbol resultante,
ahora de grado uno más, sigue intentando encontrar casilla libre.

## Algoritmo

1. Crear un arreglo `A[0..D(n)]`, todo en nulo.
2. Para cada raíz `w` de la lista *original* de raíces:
   1. `x ← w`, `d ← grado(x)`.
   2. Mientras `A[d] ≠ nulo`: sea `y ← A[d]`; si `llave(x) > llave(y)`,
      intercambiar `x` y `y`; llamar
      [Binomial-Link](/structures/binomial-heap/operations/binomial-link)`(y, x)`;
      poner `A[d] ← nulo`, `d ← d + 1`.
   3. `A[d] ← x`.
3. Reconstruir la lista de raíces a partir de `A`; actualizar `min(H)`.

## Pseudocódigo

```
Algoritmo 14: Consolidate(H)
Crear arreglo A[0..D(n)], todo en nulo ;
para cada raíz w de la lista original de raíces hacer
   x ← w ; d ← grado(x) ;
   mientras A[d] ≠ nulo hacer
       y ← A[d] ;
       si llave(x) > llave(y) entonces
            intercambiar x y y
       Binomial-Link(y, x) ;
       A[d] ← nulo; d ← d + 1 ;
     A[d] ← x ;
Reconstruir la lista de raíces a partir de A; actualizar min(H) ;
```

## C++

Ver `step-6-consolidate.cpp` y `full-implementation.cpp` en el editor de
arriba. `linkTrees` es la reimplementación local de
[Binomial-Link](/structures/binomial-heap/operations/binomial-link) sobre
los nodos de este archivo (el profesor la llama por nombre sin
redefinirla, asumiendo el montículo binomial de la semana 1).

## Complejidad temporal

Costo real, **no amortizado**: `O(D(n) + t(H))`, con `t(H)` el número de
raíces originales (recorrerlas todas) y `D(n) = O(lg n)` el tamaño del
arreglo `A` (la cota de grado máximo, probada en
[Análisis de complejidad](/structures/fibonacci-heap#análisis-de-complejidad)
vía la recurrencia de Fibonacci). Es la pieza real que
[Extract-Min](/structures/fibonacci-heap/operations/extract-min) paga
completa; su efecto — dejar a lo más `D(n) + 1` árboles, sin importar
cuántos había antes — es lo que hace que el costo *amortizado* de
Extract-Min salga `O(D(n))` y no `O(t(H))`.

## Complejidad espacial

`O(D(n))` para el arreglo `A`.

## Ejemplo

Ver la visualización paso a paso arriba: tres raíces sueltas de grado 0
(llaves 7, 3, 5) se reducen a dos raíces de grados distintos (5 de grado 0,
y 3 de grado 1 con 7 como hijo) — el mismo comportamiento que fusionar
árboles binomiales de igual grado.

## Casos límite

- **Montículo vacío** (`min(H) = nulo`): no hay raíces que recorrer; la
  implementación puede retornar de inmediato sin crear el arreglo `A`.
- **Una sola raíz**: el bucle la procesa, `A[d]` estaba vacío, se guarda
  sin ningún enlace — `Consolidate` no cambia nada.
- **Todas las raíces ya tienen grados distintos**: cada una encuentra su
  casilla `A[d]` vacía en el primer intento; no ocurre ningún
  `Binomial-Link`, pero igual se paga el recorrido `O(t(H))` completo.
- **Muchas raíces del mismo grado (el caso que sí hace trabajo real)**:
  cada fusión sube el grado en 1 y puede volver a colisionar con `A[d+1]`,
  encadenando varios enlaces para una sola raíz original — acotado por
  `D(n)` porque el grado no puede subir más que eso.
