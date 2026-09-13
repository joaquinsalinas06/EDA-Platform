---
kind: examples
title: Ejemplos
---

<!-- El material (#32-34) no trae ejemplos numéricos propios. Los tres casos
     de abajo son derivados del pseudocódigo/descripción del profesor. -->

## Mínimo

*(derivado; no aparece en las diapositivas)* Un solo punto `(4, 8)`. El BST
sobre x es una sola hoja, cuya D₁ satélite contiene ese único punto.
Cualquier consulta `[x1, x2] × (−∞, b2] × (−∞, b3)` con `x1 ≤ 4 ≤ x2` se
reduce a una sola consulta de dominancia sobre esa D₁, con `b2 ≥ 8` y
`b3 ≥ 4` para que el punto aparezca.

## Normal

*(derivado; no aparece en las diapositivas)* Puntos
`{(1,5), (3,2), (4,8), (6,1)}`. El BST sobre x tiene raíz x=4, hijo izquierdo
x=3 (con hijo izquierdo x=1) e hijo derecho x=6. Cada nodo guarda su D₁
satélite (ver `operations/build.md`). Una consulta
`[2, 5] × (−∞, 6] × (−∞, 10]` descompone `[2,5]` canónicamente en el BST de
x y dispara una consulta de dominancia `(6, 10)` en cada nodo canónico
resultante.

## Límite

*(derivado; no aparece en las diapositivas)* Todos los puntos tienen la misma
x (por ejemplo `{(5,1), (5,2), (5,3)}`): el BST sobre x degenera a un único
nodo relevante (o una cadena, según cómo se rompan los empates), y toda la
carga de la consulta cae sobre una sola D₁ satélite — D₂ no aporta nada en
este caso, el trabajo real lo hace D₁. El profesor no discute este caso en
la sección; se sigue directamente de que D₂ es un BST estándar sobre x.
