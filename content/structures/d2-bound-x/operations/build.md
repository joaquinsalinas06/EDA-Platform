---
kind: operation
title: Construcción
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-build.cpp
  - full-implementation.cpp
---

## Qué hace

Construye D₂: un BST estándar sobre x donde cada nodo guarda, para los
puntos de su subárbol, una copia de la estructura de dominancia D₁.

## Intuición

Es la construcción de un [/structures/range-tree](/structures/range-tree) 1D
sobre x, sólo que la estructura satélite de cada nodo no es un array ordenado
ni otro BST: es una instancia completa de
[/structures/dominance-2d](/structures/dominance-2d) sobre los puntos de ese
subárbol.

## Algoritmo

"Un BST estándar sobre x. Cada nodo guarda, para los puntos de su subárbol,
una copia de la estructura de dominancia (D₁) que acabamos de construir."
(#33)

1. Construir el BST balanceado sobre las coordenadas x de los puntos —
   igual que [/structures/range-tree](/structures/range-tree) (no se
   reexplica aquí).
2. En cada nodo v, construir D₁ sobre el conjunto de puntos del subárbol de
   v.

## Pseudocódigo

**Ausencia:** el material no trae pseudocódigo propio para D₂ (ninguna
diapositiva de #32-34 lo incluye). Sólo el pseudocódigo `ConsultaDominancia`
de D₁ (#30-31), que no le pertenece a esta operación.

## C++

Ver `step-2-build.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

**Ausencia:** el profesor no da una cota propia para la construcción de D₂
en esta sección — "Nada nuevo todavía" (#34). Se compone recién con D₃/D₄ y
el cierre general (#53-63); adelantarla aquí sería inventar.

## Complejidad espacial

**Ausencia:** mismo motivo que arriba — el material no la da en esta
sección.

## Ejemplo

*(derivado del pseudocódigo; no aparece en las diapositivas)* Puntos
`{(1,5), (3,2), (4,8), (6,1)}`. El BST sobre x tiene, por ejemplo, raíz x=4
con hijo izquierdo x=3 (y su propio hijo izquierdo x=1) y derecho x=6. La
raíz guarda D₁ sobre los 4 puntos; el nodo x=3 guarda D₁ sobre
`{(1,5),(3,2)}`; el nodo x=6 guarda D₁ sobre `{(6,1)}`.

## Casos límite

- **Un solo punto**: el BST es una sola hoja, cuya D₁ satélite tiene un único
  punto.
- **Puntos con la misma x**: el material no lo trata; se resuelve igual que
  en cualquier BST estándar (desempate por orden de inserción o por otra
  coordenada), sin que eso afecte a D₂.
