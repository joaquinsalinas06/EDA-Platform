---
kind: theory
title: Splay tree
---

## ¿Qué problema resuelve?

El [modelo computacional BST](/structures/bst-computational-model) fija qué
cuesta cada movimiento, y las
[propiedades de secuencias de búsqueda](/structures/search-sequence-properties)
describen cinco patrones que hacen que una secuencia sea "fácil" — pero
ninguna de las dos dice **cómo construir un árbol que aproveche esos
patrones**. Un [BST balanceado](/structures/balanced-bst) garantiza
O(lg n) en el peor caso, siempre, sin importar la secuencia — y por eso
mismo nunca sale más barato aunque la secuencia sea trivial (acceso
secuencial, un conjunto de trabajo pequeño). El splay tree es la respuesta
concreta: "Es un BST amortizado que siempre mueve el valor de búsqueda x_i a
la raíz del árbol mediante la función Splay" (#60). Es, además, el candidato
que el profesor presenta (sin demostrarlo) a
[dynamic-optimality](/structures/dynamic-optimality): la estructura que
podría ser dinámicamente óptima.

## Intuición

Cada vez que se busca un valor, el árbol se reorganiza para dejarlo en la
raíz — no de cualquier forma, sino subiéndolo mediante rotaciones locales
que además reacomodan el camino que recorrió. Un valor que se busca seguido
queda cerca de la raíz y la próxima búsqueda por él sale barata; un valor
que no se toca en mucho tiempo se hunde. El árbol nunca deja de ser un BST
válido (el orden in-order se preserva en cada rotación, ver
[`rotate`](/structures/bst-computational-model/operations/rotate)), pero su
forma cambia con cada acceso.

## Estructura interna

Un splay tree es un [BST](/structures/balanced-bst) ordinario sobre el
[modelo computacional BST](/structures/bst-computational-model): cada nodo
guarda su valor y punteros a padre, hijo izquierdo e hijo derecho. No hay
ningún campo extra de balance (ni altura, ni color, ni factor): el único
invariante es el de orden de un BST. Lo que distingue al splay tree no es
qué guarda cada nodo, sino **qué operación se ejecuta después de cada
búsqueda**: Splay(x), que siempre termina con x en la raíz.

## Operaciones

- [`zig`](/structures/splay-tree/operations/zig) — caso base: x es hijo de
  la raíz, una sola rotación.
- [`zig-zig`](/structures/splay-tree/operations/zig-zig) — x y su padre p
  son hijos del mismo lado de su abuelo a.
- [`zig-zag`](/structures/splay-tree/operations/zig-zag) — x y su padre p
  son hijos de lados opuestos.
- [`splay`](/structures/splay-tree/operations/splay) — la operación madre:
  aplica repetidamente el caso que corresponda hasta que x llega a la raíz.
- [`search`](/structures/splay-tree/operations/search) — Buscar(x) sobre el
  modelo BST, seguido de Splay(x).

## Análisis de complejidad

`professorAnalysisStyle: amortized` — y aquí la palabra no es una etiqueta
externa: aparece en la propia definición de la estructura ("Es un BST
**amortizado**", #60), en la cota de Splay ("complejidad **amortizada** de
O(log n) por búsqueda", #63) y en la propiedad general ("Cada operación toma
O(log n) (**amortizado**)", #68). Eso obliga a distinguir dos costos en todo
momento:

- **Costo real** de un paso individual (`zig`, `zig-zig`, `zig-zag`): O(1)
  cada uno — una o dos rotaciones, y cada rotación es O(1) por
  [el modelo BST](/structures/bst-computational-model/operations/rotate).
  El costo real de **un** Splay(x) completo puede ser O(n): si x está a
  profundidad n−1, hacen falta ~n/2 pasos, cada uno O(1), sumando O(n).
- **Costo amortizado**: promediado sobre cualquier secuencia de búsquedas,
  el profesor da O(log n) por Splay (#63) y por operación en general (#68).
  Una búsqueda aislada puede costar O(n) en el peor caso real; lo que la
  cota amortizada garantiza es que esa búsqueda cara sólo puede ocurrir si
  "prepagó" con búsquedas baratas anteriores.

> **Nota de apoyo** (no está en las diapositivas): el profesor **enuncia**
> la cota O(log n) amortizada pero no la **demuestra** — no define una
> función de potencial Φ, no da un argumento de rango, no prueba el Access
> Lemma. La demostración estándar en la literatura usa exactamente el
> [método del potencial](/structures/potential-method) con
> Φ = Σ log(tamaño del subárbol de cada nodo), pero eso no está en este
> mazo: la cota se enuncia sin derivarla.

**El punto que hay que entender de verdad**: por qué `zig-zig` rota primero
el **abuelo** `a` y no el padre `p`. El material da los diagramas (#65) pero
no discute esta decisión explícitamente — es la nota de apoyo más
importante de este tema:

> **Nota de apoyo** (no está en las diapositivas): rotar primero `p` (subir
> a `x` un nivel, luego rotar de nuevo) es el algoritmo "move-to-root"
> ingenuo, y **no** consigue la cota amortizada de O(log n). La razón es que
> ese orden no reduce la profundidad de los nodos que quedaron "colgando" en
> el camino tan agresivamente como rotar `a` primero: rotar el abuelo
> primero hace que el subárbol que compartían `p` y `a` quede dividido de
> forma más pareja entre los dos, en vez de que uno de los dos quede casi
> tan profundo como antes. Es exactamente la diferencia entre zig-zig
> (rota `a` primero) y aplicar `zig` dos veces seguidas (rota `p` primero,
> luego rota otra vez) — mismo destino final (x en la raíz), pero la forma
> intermedia del árbol es distinta, y esa forma es la que determina si el
> argumento de potencial de la literatura cierra o no.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. Nota de lectura: `zig`, `zig-zig` y
`zig-zag` llevan **costo real** O(1) (son los pasos atómicos); `splay` y
`search` llevan **costo amortizado** O(log n) (son las cotas que promedian
sobre una secuencia). No hay fila de "peor caso real de una operación
individual" para splay/search porque el profesor no la da — sí se discute
en el análisis de arriba (puede ser O(n)).

## Ejemplos

Ver [examples.md](/structures/splay-tree/examples).

## Comparación con estructuras relacionadas

| | [balanced-bst](/structures/balanced-bst) | splay tree (aquí) |
| --- | --- | --- |
| invariante | forma (altura balanceada) | ninguno extra: sólo orden BST |
| garantía | O(lg n) peor caso, **toda** operación | O(log n) sólo **amortizado** |
| se adapta a la secuencia | no — mismo costo sin importar el patrón | sí — exhibe las cinco propiedades de [search-sequence-properties](/structures/search-sequence-properties) que un BST estático no puede |
| optimalidad dinámica | no se plantea | es **el candidato** ([dynamic-optimality](/structures/dynamic-optimality)), conjetura abierta |

Este es el cierre del hueco que
[search-sequence-properties](/structures/search-sequence-properties) deja
explícito: esas cuatro propiedades (acceso secuencial, puntero dinámico,
conjunto de trabajo, cota de entropía) describen qué tan fácil puede ser una
secuencia, pero "ninguna de las cuatro dice cómo lograr esa cota — eso es
trabajo de una estructura concreta que se adapte a la secuencia". El splay
tree es esa estructura (#69-72): las cumple todas. Lo que sigue sin
responderse (#74-75) es si además cumple la propiedad unificada y si es
O(1)-competitivo contra el óptimo offline — ambas abiertas.

## Prueba de dominio

Ver [mastery-check.md](/structures/splay-tree/mastery-check).
