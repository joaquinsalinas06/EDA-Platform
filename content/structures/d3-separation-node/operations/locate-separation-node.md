---
kind: operation
title: Localización del nodo de separación
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-build.cpp
  - step-3-locate-separation-node.cpp
  - full-implementation.cpp
---

## Qué hace

Dada una consulta `[a2,b2]` sobre `y`, encuentra el nodo `v_split` del árbol
de rango donde los caminos de búsqueda de `a2` y de `b2` dejan de coincidir.
Es la operación central de D₃: todo lo demás (la construcción de las
satélites, la consulta de dos disparos) existe en función de este nodo.

## Intuición

Mientras se busca `a2` y `b2` bajando desde la raíz, mientras ambos caigan
del mismo lado de la clave del nodo actual, van juntos por el mismo camino.
En el momento en que uno va a la izquierda y el otro a la derecha, se
separan — y no vuelven a juntarse nunca (por la propiedad de orden del BST).
Textual del profesor: "Al buscar a2 y b2 en el árbol de y, sus caminos
coinciden hasta un nodo v_split donde se separan — exactamente como en un
árbol de rangos 1D clásico." (#40).

La propiedad que hace útil a `v_split` (y que el C++ de esta operación
verifica explícitamente, no sólo la afirma): es el nodo **más profundo**
donde ambos caminos todavía coinciden. Por construcción del árbol, eso
implica:

- todo punto en `derecha(v_split)` tiene `y > clave(v_split) ≥ a2` (porque el
  camino de `a2` no se fue a la derecha en `v_split`) — `y ≥ a2` ya
  garantizado;
- todo punto en `izquierda(v_split)` tiene `y ≤ clave(v_split) < b2` (porque
  el camino de `b2` no se fue a la izquierda en `v_split`) — `y ≤ b2` ya
  garantizado.

Por eso alcanza con las satélites D₂ (normal, a la derecha) y D₂′ (invertida,
a la izquierda) construidas en `build`: cada una sólo tiene que resolver la
mitad de la condición que le falta.

```
                     v_split
                    /   |   \
        busca a2  ↙     |     ↘  busca b2
                 /       |       \
        izquierda(v)     |    derecha(v)
      "y ≤ b2 ya vale"   |  "y ≥ a2 ya vale"
      falta: y ≥ a2      |  falta: y ≤ b2
      → consulta D2'     |  → consulta D2
       (invertida)       |    (normal)
```

Pie del profesor (#45): "Los caminos de a2 y b2 se separan en v_split; de ahí
en adelante ya no hace falta seguir bajando."

## Algoritmo

No hay pseudocódigo propio del profesor para esta sección; el algoritmo es el
descenso estándar de nodo de separación de un árbol de rango 1D, que el
profesor invoca por nombre ("exactamente como en un árbol de rangos 1D
clásico", #40) sin repetirlo — se referencia
[range-tree](/structures/range-tree), no se reexplica.

1. Empezar en la raíz.
2. Mientras `a2` y `b2` sigan cayendo del mismo lado de la clave del nodo
   actual (ambos ≤ o ambos >), bajar juntos por ese lado.
3. En cuanto uno cae a la izquierda y el otro a la derecha (o uno coincide
   exactamente con la clave), el nodo actual es `v_split`.

## Pseudocódigo

```
función localizarNodoDeSeparacion(raiz, a2, b2):
    v = raiz
    mientras v no sea hoja:
        si b2 <= clave(v):
            v = hijoIzquierdo(v)
        si_no si a2 > clave(v):
            v = hijoDerecho(v)
        si_no:
            devolver v          # a2 y b2 caen en lados distintos: se separan aquí
    devolver v
```

## C++

Ver `step-3-locate-separation-node.cpp` en el editor de arriba. El
`full-implementation.cpp` agrega un assert que recalcula ambos caminos
(raíz→a2 y raíz→b2) de forma independiente y comprueba que `v_split` es
exactamente el nodo más profundo donde coinciden — no basta con que el
descenso "diga" que encontró el nodo, hay que confirmar la propiedad.

## Complejidad temporal

El profesor no da una cota propia aquí, pero la iguala explícitamente a un
caso ya conocido: "exactamente como en un árbol de rangos 1D clásico" (#40),
que es el mismo descenso de altura acotada que ya usa
[range-tree](/structures/range-tree) para `predecessor-successor`. No se
inventa un número nuevo; se referencia el ya establecido.

## Complejidad espacial

No aplica más allá del árbol ya construido en `build`: la localización no
reserva estructuras nuevas, sólo desciende.

## Casos límite

- `a2 == b2`: ambos caminos son literalmente el mismo, así que `v_split` es
  el nodo donde se encontraría esa clave (o la hoja donde terminaría la
  búsqueda). El profesor no discute este caso; es la lectura directa del
  algoritmo.
- `v_split` es una hoja: mencionado como implícito y no discutido por el
  profesor (el material no dice qué pasa "si v_split es una hoja, o si a2 y
  b2 caen del mismo lado"). En la implementación, una hoja no tiene
  satélites propias (ver [Casos límite de Construcción](/structures/d3-separation-node/operations/build)),
  así que la consulta sobre ese nodo debe tratarse como caso base.
