---
kind: theory
title: "Árboles binomiales"
---

## ¿Qué problema resuelve?

Por sí solo, ninguno: el profesor lo introduce sin más motivación que su
definición recursiva. Es el bloque de construcción del [montículo
binomial](/structures/binomial-heap): una colección de árboles binomiales,
uno por cada bit en 1 del número de elementos, es lo que permite que ese
montículo combine la forma perfectamente balanceada de un
[binary-heap](/structures/binary-heap) con la posibilidad de fusionar dos
montículos rápido. El árbol binomial es la pieza; la razón de ser aparece
recién en `binomial-heap`.

## Intuición

Un árbol binomial se arma **doblando** un árbol igual a sí mismo:

```
B0          B1            B2               B3

 o           o             o                    o
             |            / \                 / | \
             o           o   o                o  o  o
                         |                    /\  |
                         o                   o  o o
                                              |
                                              o
```

(`B3` es el resultado de colgar un `B2` extra de la raíz de `B3` visto como
`B2 + B2`; dibujado como definición recursiva, la raíz de `B3` cuelga de
izquierda a derecha las raíces de `B2`, `B1` y `B0`.)

`B_k` se obtiene uniendo dos copias de `B_{k-1}`: la raíz de una se convierte
en el **hijo más a la izquierda** de la raíz de la otra. Por eso la raíz de
`B_k` termina con hijos que son, de izquierda a derecha, las raíces de
`B_{k-1}, B_{k-2}, ..., B_1, B_0` — cada hijo es a su vez la raíz de un árbol
binomial más pequeño.

## Estructura interna

Cada nodo guarda: una llave, un puntero a su **primer hijo** y un puntero a
su **siguiente hermano** (representación hijo-izquierdo/hermano-derecho,
la única forma natural de guardar un número variable de hijos por nodo).

El invariante no es sobre el orden de las llaves (este material no impone
heap-order en el árbol binomial puro; esa propiedad se añade recién en
`binomial-heap`) sino sobre la **forma**:

- `B_0` es un único nodo (caso base de la recursión).
- `B_k` = dos `B_{k-1}` enlazados por su raíz.

La forma queda determinada enteramente por `k`; no hay dos árboles binomiales
de orden `k` con formas distintas. Ese es precisamente el motivo de que sus
propiedades se puedan contar de forma exacta y no sólo acotar.

## Operaciones

Ninguna. Es un concepto — una definición con propiedades, no una estructura
con una interfaz. La operación de enlazar dos `B_{k-1}` en un `B_k`
(`binomial-link`) se define y analiza como parte de
[binomial-heap](/structures/binomial-heap), que es quien la usa.

## Análisis de complejidad

El profesor no analiza costos aquí — no hay operación que costar. Lo que da
son **propiedades de conteo** que se demuestran por inducción sobre la
definición recursiva `B_k = B_{k-1} + B_{k-1}`:

- **Número de nodos de `B_k` es `2^k`.** Caso base: `B_0` tiene `2^0 = 1`
  nodo. Paso inductivo: `B_k` son dos copias de `B_{k-1}`, luego
  `|B_k| = 2 · |B_{k-1}| = 2 · 2^{k-1} = 2^k`.
- **Altura de `B_k` es `k`.** Caso base: `B_0` tiene altura 0. Paso
  inductivo: la altura de `B_k` es uno más que la altura del `B_{k-1}` que
  queda colgando como subárbol más profundo, es decir `(k-1) + 1 = k`.
- **Grado de la raíz de `B_k` es `k`.** Cada enlace añade exactamente un hijo
  nuevo a la raíz sobreviviente (la raíz del otro `B_{k-1}`), y hay `k`
  enlaces acumulados desde `B_0`.
- **El número de nodos a profundidad `i` es exactamente `C(k, i)`** (el
  coeficiente binomial "k eligiendo i") — de ahí el nombre. Se sigue de que
  la raíz de `B_k` tiene como subárboles a `B_0, B_1, ..., B_{k-1}`: un nodo
  a profundidad `i` de `B_k` es, o bien la raíz de uno de esos subárboles
  (si `i = 0`), o un nodo a profundidad `i-1` dentro de alguno de ellos. Esto
  da la recurrencia de Pascal `C(k,i) = C(k-1,i-1) + C(k-1,i)`, exactamente
  la misma que define al coeficiente binomial.

## Tabla de complejidad

No aplica: `meta.yaml` deja `complexity: {}` a propósito. El profesor no da
cotas de costo para este tema — sólo las propiedades de conteo de la tabla de
arriba, que no son complejidad de ninguna operación sino invariantes de la
forma del árbol.

## Ejemplos

Ver [examples.md](/structures/binomial-tree#ejemplos) — construcción de
`B_0` a `B_3` y verificación de las cuatro propiedades sobre `B_3`.

## Comparación con estructuras relacionadas

| | árbol binomial `B_k` | [binary-heap](/structures/binary-heap) |
| --- | --- | --- |
| forma | fija para cada `k`, determinada por la recursión | árbol binario casi completo, un solo árbol |
| orden de llaves | ninguno (es sólo forma) | min-heap sobre un único árbol |
| unidad de fusión | dos árboles del mismo orden se enlazan en O(1) | fusionar dos heaps completos cuesta reconstruir |

## Prueba de dominio

Ver [mastery-check.md](/structures/binomial-tree#prueba-de-dominio).
