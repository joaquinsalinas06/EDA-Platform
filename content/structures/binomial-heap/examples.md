---
kind: examples
title: Ejemplos
---

<!-- El mazo no trae ejemplos numéricos para el montículo binomial (única
     carencia grande que reporta el análisis de la fuente). Los tres
     ejemplos de abajo están derivados ejecutando a mano el pseudocódigo
     del profesor; no aparecen en las diapositivas. -->

## Mínimo

El caso más pequeño donde Union hace algo distinto de "simplemente pegar
las dos listas": dos montículos de un solo nodo cada uno, `{7}` y `{3}`.

`Union({7}, {3})`: ambos son `B0` (mismo grado), así que se enlazan con
[Binomial-Link](/structures/binomial-heap/operations/binomial-link). Como
`key(7) ≥ key(3)`, 7 se vuelve hijo de 3. Resultado: un único `B1` con raíz
3 e hijo 7 — dos nodos, `10₂`. Sin este acarreo (si las llaves tuvieran
grados distintos, por ejemplo un `B0` y un `B1`), Union simplemente los
dejaría como dos raíces separadas, sin ningún enlace.

## Normal

Construir un montículo insertando 5, 2, 9, 1, 8 en ese orden (traza
completa, cada Insert es una Union con un `B0` nuevo):

| insertar | montículo resultante (raíces, con hijos entre paréntesis) | por qué |
| --- | --- | --- |
| 5 | `{5}` | primer nodo, un `B0` suelto |
| 2 | `{2(hijo 5)}` | 5 y 2 son ambos `B0`: acarreo, nace un `B1` (raíz 2, porque `2 ≤ 5`) |
| 9 | `{9, 2(hijo 5)}` | 9 es `B0`, el montículo ya tiene un `B1`: sin acarreo, 9 queda suelto |
| 1 | `{1(hijos 2 y 9; 2 conserva a 5)}` | 9 y 1 son `B0`, se funden en `B1` (raíz 1, hijo 9); ese `B1` nuevo choca con el `B1` existente (raíz 2, hijo 5): segundo acarreo, se funden en un `B2` (raíz 1, hijos 2 y 9) |
| 8 | `{8, 1(hijos 2(hijo 5) y 9)}` | 8 es `B0`, el montículo ya tiene un `B2` y ningún `B0` ni `B1`: sin acarreo |

Al final: 5 nodos = `101₂`, un `B0` (8) y un `B2` (raíz 1). `Find-Min`
recorre las dos raíces y devuelve 1 en `O(lg n)` — aquí, dos
comparaciones.

## Límite

El caso patológico de Insert: un montículo que ya tiene `B0, B1, B2` (7
nodos, `111₂`) y se inserta un nuevo `B0`. El acarreo se propaga por los
tres órdenes existentes, fundiéndolos todos en un único `B3` de 8 nodos
(`1000₂`) — el equivalente binomial de sumar 1 a `0111₂` y que el acarreo
recorra los cuatro bits. Es exactamente el caso que hace que un Insert
individual cueste `O(lg n)` en el peor caso, aunque el análisis agregado
(ver [theory.md](/structures/binomial-heap)) muestre que amortizado sigue
costando `O(1)`.

Esto es lo que el montículo binomial viene a arreglar frente al
[montículo binario](/structures/binary-heap): ahí, unir dos montículos de
`n₁` y `n₂` elementos cuesta `Θ(n₁ + n₂)` sin importar la forma de los
datos; aquí, incluso en el peor caso de Insert, el costo se queda en
`O(lg n)`.
