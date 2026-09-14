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
    - note: >-
        Estado inicial (derivado, no está en las diapositivas): cuatro
        raíces sueltas de grado 0 con llaves 8, 4, 6 y 2, en ese orden en
        la lista circular. A todavía está vacío en todas las casillas —
        éste es el caso "con acarreo" (como sumar en binario): varias
        colisiones de grado se van a encadenar.
      caption: "A = [ _ , _ , _ ]"
      highlight: ["r8", "r4", "r6", "r2"]
      nodes:
        - { id: r8, value: 8, parent: null }
        - { id: r4, value: 4, parent: null }
        - { id: r6, value: 6, parent: null }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Se procesa la raíz 8 (grado 0): A[0] está vacío, así que sólo se
        guarda A[0] = 8. Nada se enlaza todavía.
      caption: "A = [ 8 , _ , _ ]"
      highlight: ["r8"]
      nodes:
        - { id: r8, value: 8, parent: null }
        - { id: r4, value: 4, parent: null }
        - { id: r6, value: 6, parent: null }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Se procesa la raíz 4 (grado 0): A[0] ya tiene a 8, mismo grado ⇒
        hay que enlazar. Se compara llave(4) contra llave(8): como 4 no es
        mayor, 4 se queda como padre y 8 pasa a ser su hijo —
        Binomial-Link(8, 4).
      caption: "A = [ 8 , _ , _ ]  →  comparando 4 vs 8"
      highlight: ["r4", "r8"]
      nodes:
        - { id: r8, value: 8, parent: null }
        - { id: r4, value: 4, parent: null }
        - { id: r6, value: 6, parent: null }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Tras el enlace: 8 cuelga de 4, A[0] se limpia y el grado del árbol
        resultante sube a 1. Como A[1] está vacío, se guarda A[1] = 4 (con
        su hijo 8) ahí. Es el mismo "acarreo" de sumar dos unos en binario:
        la casilla de abajo queda libre y la de arriba recibe el resultado.
      caption: "A = [ _ , 4(8) , _ ]"
      highlight: ["r4", "r8"]
      nodes:
        - { id: r8, value: 8, parent: r4 }
        - { id: r4, value: 4, parent: null }
        - { id: r6, value: 6, parent: null }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Se procesa la raíz 6 (grado 0): A[0] está vacío (se limpió en el
        paso anterior), así que sólo se guarda A[0] = 6. Todavía no hay
        colisión en este grado.
      caption: "A = [ 6 , 4(8) , _ ]"
      highlight: ["r6"]
      nodes:
        - { id: r8, value: 8, parent: r4 }
        - { id: r4, value: 4, parent: null }
        - { id: r6, value: 6, parent: null }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Se procesa la raíz 2 (grado 0): A[0] tiene a 6, mismo grado ⇒
        enlazar. llave(2) < llave(6), así que 2 se queda como padre y 6
        pasa a ser su hijo — Binomial-Link(6, 2). El árbol resultante
        (2 con hijo 6) sube a grado 1 y busca casilla en A[1].
      caption: "A = [ 6 , 4(8) , _ ]  →  comparando 2 vs 6"
      highlight: ["r2", "r6"]
      nodes:
        - { id: r8, value: 8, parent: r4 }
        - { id: r4, value: 4, parent: null }
        - { id: r6, value: 6, parent: null }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Segundo acarreo en la misma raíz: A[1] ya tiene a 4 (con hijo 8).
        Se compara llave(2) contra llave(4): 2 es menor, así que 2 se
        queda como padre y todo el árbol de 4 (con su hijo 8) pasa a ser
        hijo de 2 de un solo golpe — es lo que exige `collapsed` cuando el
        subárbol es grande, aquí se ve completo porque cabe. A[1] se
        limpia, el grado sube a 2 y A[2] está vacío, así que se guarda
        A[2] = 2.
      caption: "A = [ _ , _ , 2(6, 4(8)) ]"
      highlight: ["r2", "r4"]
      nodes:
        - { id: r8, value: 8, parent: r4 }
        - { id: r4, value: 4, parent: r2 }
        - { id: r6, value: 6, parent: r2 }
        - { id: r2, value: 2, parent: null }
    - note: >-
        Fin del recorrido: la lista de raíces se reconstruye a partir de
        A y queda una única raíz, 2, de grado 2, con hijos 6 (hoja) y 4
        (que a su vez tiene a 8 como hijo) — todos los grados de la lista
        de raíces final son distintos (aquí sólo queda uno), exactamente
        como fusionar cuatro árboles binomiales de grado 0 en una cadena de
        acarreos hasta un único árbol de grado 2.
      caption: "A = [ _ , _ , 2(6, 4(8)) ]  — final"
      highlight: ["r2"]
      nodes:
        - { id: r8, value: 8, parent: r4 }
        - { id: r4, value: 4, parent: r2 }
        - { id: r6, value: 6, parent: r2 }
        - { id: r2, value: 2, parent: null }
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

Costo real, **no amortizado**: $O(D(n) + t(H))$, con $t(H)$ el número de
raíces originales (recorrerlas todas) y $D(n) = O(\lg n)$ el tamaño del
arreglo `A` (la cota de grado máximo, probada en
[Análisis de complejidad](/structures/fibonacci-heap#análisis-de-complejidad)
vía la recurrencia de Fibonacci). Es la pieza real que
[Extract-Min](/structures/fibonacci-heap/operations/extract-min) paga
completa; su efecto — dejar a lo más $D(n) + 1$ árboles, sin importar
cuántos había antes — es lo que hace que el costo *amortizado* de
Extract-Min salga $O(D(n))$ y no $O(t(H))$.

## Complejidad espacial

$O(D(n))$ para el arreglo `A`.

## Ejemplo

Ver la visualización paso a paso arriba: cuatro raíces sueltas de grado 0
(llaves 8, 4, 6, 2) se reducen, con dos acarreos encadenados, a una sola
raíz de grado 2 (llave 2, con hijos 6 y 4, y 4 a su vez con hijo 8) — el
mismo comportamiento que sumar en binario cuando varias posiciones
generan acarreo, o que fusionar cuatro árboles binomiales de grado 0 en
una sola pasada.

## Casos límite

- **Montículo vacío** (`min(H) = nulo`): no hay raíces que recorrer; la
  implementación puede retornar de inmediato sin crear el arreglo `A`.
- **Una sola raíz**: el bucle la procesa, `A[d]` estaba vacío, se guarda
  sin ningún enlace — `Consolidate` no cambia nada.
- **Todas las raíces ya tienen grados distintos**: cada una encuentra su
  casilla `A[d]` vacía en el primer intento; no ocurre ningún
  `Binomial-Link`, pero igual se paga el recorrido $O(t(H))$ completo.
- **Muchas raíces del mismo grado (el caso que sí hace trabajo real)**:
  cada fusión sube el grado en 1 y puede volver a colisionar con `A[d+1]`,
  encadenando varios enlaces para una sola raíz original — acotado por
  $D(n)$ porque el grado no puede subir más que eso.
