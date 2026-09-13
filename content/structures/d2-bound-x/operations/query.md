---
kind: operation
title: Consulta
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-build.cpp
  - step-3-query.cpp
  - full-implementation.cpp
---

## Qué hace

Responde consultas `[x1, x2] × (−∞, b2] × (−∞, b3)`: rango cerrado en x,
dominancia en (y, z).

## Intuición

Se compone en dos capas: primero se localizan los O(lg n) nodos canónicos de
`[x1, x2]` en el BST sobre x —igual que en
[/structures/range-tree](/structures/range-tree)—, y luego, en cada uno de
esos nodos, se dispara **una** consulta de dominancia sobre la D₁ satélite de
ese nodo.

## Algoritmo

"La consulta usa la descomposición canónica de siempre: los O(lg n) nodos
canónicos de [x1, x2], disparando una consulta de dominancia en cada uno."
(#34)

1. Descomponer `[x1, x2]` en sus nodos canónicos sobre el BST de x — misma
   descomposición canónica de [/structures/range-tree](/structures/range-tree)
   (no se reexplica aquí).
2. Para cada nodo canónico v: consultar la D₁ satélite de v con `(b2, b3)` —
   la operación `dominance-query` de
   [/structures/dominance-2d](/structures/dominance-2d).
3. Reportar la unión de los resultados de todas las consultas de dominancia.

## Pseudocódigo

**Ausencia:** el material no trae pseudocódigo propio para esta consulta
(ninguna diapositiva de #32-34 lo incluye).

## C++

Ver `step-3-query.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

**Ausencia:** el profesor no da una cota propia aquí — "Nada nuevo todavía —
lo interesante empieza al agregar la segunda dimensión acotada." (#34). Sí
deja el **caso límite que motiva la siguiente estructura**: si se acotara y
con la misma técnica (otra descomposición canónica dentro de cada nodo
canónico de x), el costo sería O(lg n) nodos canónicos en x, cada uno con
O(lg n) nodos canónicos en y — **O(lg² n)** consultas, perdiendo el O(lg n)
buscado (#35-36). Esa es la razón de ser de
[/structures/d3-separation-node](/structures/d3-separation-node): evitar la
descomposición canónica en y por completo.

## Complejidad espacial

**Ausencia:** el material no la da en esta sección.

## Ejemplo

*(derivado del pseudocódigo; no aparece en las diapositivas)* Sobre el BST
del ejemplo de `build.md` (raíz x=4, hijos x=3 y x=6, nieto x=1), una
consulta `[2, 5] × (−∞, 6] × (−∞, 10]` descompone `[2,5]` en el nodo
canónico x=3 (que ya cae dentro del rango junto con su subárbol relevante) y
en la raíz x=4 según corresponda a la partición del BST; en cada nodo
canónico se dispara `dominance-query(6, 10)` sobre su D₁ satélite y se unen
los resultados.

## Casos límite

- **`[x1, x2]` no contiene ningún punto**: la descomposición canónica no
  produce nodos, o produce nodos cuyas D₁ satélite devuelven vacío — cero
  resultados.
- **`x1 = x2`**: se reduce a localizar un único valor de x en el BST; sigue
  usando la D₁ satélite de ese nodo (o su equivalente hoja).
- **`b2` o `b3` en −∞ efectivo (sin acotar)**: cada D₁ satélite reporta todo
  su subárbol — el material no discute este límite explícitamente, pero se
  sigue de la definición de dominancia de D₁.
