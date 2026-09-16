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
visualization:
  type: tree
  steps:
    - note: >-
        Estado inicial *(derivado del pseudocódigo; no aparece así en las
        diapositivas)*: `min(H) = z(3)`, de grado 2, con hijos `9` y `15`;
        además hay dos raíces sueltas más, `7` y `20`. `z` es lo único
        que se va a quitar.
      highlight: ["z"]
      nodes:
        - { id: z, value: 3, tag: z, parent: null, state: active }
        - { id: n9, value: 9, parent: z }
        - { id: n15, value: 15, parent: z }
        - { id: r7, value: 7, parent: null }
        - { id: r20, value: 20, parent: null }
    - note: >-
        Paso 1.1: cada hijo de `z` pasa a la lista de raíces de `H`,
        perdiendo su padre — y, como las raíces nunca están marcadas, se
        desmarcan si lo estaban. Aquí `9` y `15` se vuelven raíces
        sueltas, sin tocar a `7` ni a `20`.
      highlight: ["n9", "n15"]
      nodes:
        - { id: z, value: 3, tag: z, parent: null, state: active }
        - { id: n9, value: 9, parent: null }
        - { id: n15, value: 15, parent: null }
        - { id: r7, value: 7, parent: null }
        - { id: r20, value: 20, parent: null }
    - note: >-
        Paso 1.2: se quita `z` de la lista de raíces. Como no era la
        única raíz, `min(H)` se fija *temporalmente* a cualquier raíz
        restante (aquí, `9`) — todavía no es necesariamente el mínimo
        real; sólo un punto de partida para que `Consolidate` recorra
        desde ahí.
      highlight: ["n9"]
      nodes:
        - { id: n9, value: 9, tag: remaining, parent: null, state: active }
        - { id: n15, value: 15, parent: null }
        - { id: r7, value: 7, parent: null }
        - { id: r20, value: 20, parent: null }
    - note: >-
        Paso 2: se llama a
        [Consolidate](/structures/fibonacci-heap/operations/consolidate)(H)
        sobre las cuatro raíces `{9, 15, 7, 20}`, todas de grado 0. Ese
        proceso completo — el arreglo `A` por grado, las comparaciones y
        los enlaces — ya se traza paso a paso en el diagrama de
        Consolidate; aquí sólo se muestra el resultado.
      caption: "Consolidate({9, 15, 7, 20}) — ver el diagrama de Consolidate"
      highlight: ["n9", "n15", "r7", "r20"]
      nodes:
        - { id: n9, value: 9, parent: null }
        - { id: n15, value: 15, parent: null }
        - { id: r7, value: 7, parent: null }
        - { id: r20, value: 20, parent: null }
    - note: >-
        Resultado de consolidar (análogo al ejemplo de Consolidate:
        varias raíces de grado 0 se funden por pares, con acarreo si hace
        falta): supongamos que quedan dos raíces de grados distintos, `7`
        de grado 0 y `9` de grado 1 con `20` e `15` colgando de él —
        `collapsed` no hace falta aquí porque los subárboles caben
        completos en el diagrama.
      highlight: ["r7", "n9"]
      nodes:
        - { id: r7, value: 7, parent: null }
        - { id: n9, value: 9, parent: null }
        - { id: n15, value: 15, parent: n9 }
        - { id: r20, value: 20, parent: n9 }
    - note: >-
        Paso final: `min(H)` se actualiza al verdadero mínimo entre las
        raíces que dejó Consolidate — aquí `7`, no el `9` que se había
        fijado sólo como punto de partida. El montículo queda con dos
        raíces (grados 0 y 1) y `z(3)` es lo único que se devuelve como
        resultado de la operación.
      highlight: ["r7"]
      nodes:
        - { id: r7, value: 7, parent: null, state: answer }
        - { id: n9, value: 9, parent: null }
        - { id: n15, value: 15, parent: n9 }
        - { id: r20, value: 20, parent: n9 }
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

Costo real $O(D(n) + t(H))$: subir los hijos de `z` a la lista de raíces
es $O(\text{grado}(z))$, acotado por $O(D(n))$ (la cota de grado máximo); y
[Consolidate](/structures/fibonacci-heap/operations/consolidate) recorre
las $t(H)$ raíces resultantes. Con el potencial
$\Phi(H) = t(H) + 2 \cdot m(H)$: después de consolidar quedan a lo más $D(n) + 1$
raíces (por cómo funciona el arreglo `A[0..D(n)]` de Consolidate), y
$m(H)$ no aumenta (subir hijos a la raíz sólo los desmarca), así que
$\Delta\Phi \le (D(n) + 1) - t(H)$. El costo amortizado resulta
$\hat{c} = O(D(n) + t(H)) + (D(n) + 1) - t(H) = O(D(n)) = O(\lg n)$, porque
$D(n) = O(\lg n)$ por la cota de grado probada vía la recurrencia de
Fibonacci (ver
[Análisis de complejidad](/structures/fibonacci-heap#análisis-de-complejidad)
en la teoría).

## Complejidad espacial

$O(D(n))$ adicional dentro de Consolidate (el arreglo `A`); $O(1)$ para el
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
  tenga que enlazar nada**: sigue costando $O(t(H))$ recorrerlas, aunque
  no haya ningún `Binomial-Link`.
