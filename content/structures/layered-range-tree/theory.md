---
kind: theory
title: Layered range tree
---

## ¿Qué problema resuelve?

Elimina el factor `lg n` de más que arrastra la consulta 2D del
[range tree](/structures/range-tree): en la versión ingenua, cada uno de los
`O(lg n)` nodos canónicos en X dispara una búsqueda binaria completa en su
árbol secundario de Y, para un total `O(lg² n)`. El profesor lo plantea como
la aplicación directa de [fractional cascading](/structures/fractional-cascading)
a ese caso concreto: "Un Layered Range Tree aplica exactamente esa idea a las
estructuras secundarias del árbol (que ya están relacionadas por mezcla
padre-hijos): O(lg n) por consulta 2D, el mismo espacio de antes."

## Intuición

En el range tree 2D, la lista de Y de un nodo padre **no es independiente**
de las de sus hijos: es exactamente la unión de ambas. Eso es la
precondición que fractional cascading necesita para funcionar sin ningún
trabajo adicional — no hace falta escoger qué la mitad de qué lista
promover, porque **toda** la lista del padre ya viene de los hijos. Basta
entonces con reemplazar cada árbol secundario por un arreglo ordenado y, al
construir el arreglo del padre mezclando los de sus dos hijos (igual que en
Merge Sort), anotar en cada posición del padre un puntero a su posición
equivalente en cada hijo. Bajar por el árbol durante una consulta deja de
ser "buscar de nuevo en cada nivel" y pasa a ser "saltar por el puntero ya
calculado".

## Estructura interna

Cada nodo del árbol primario (el mismo árbol primario de
[range-tree](/structures/range-tree), en X) guarda:

- un **arreglo ordenado** con las Y de todo su subárbol, en vez del árbol
  secundario del range tree ingenuo;
- dos arreglos de **puentes**, uno hacia el hijo izquierdo y otro hacia el
  derecho: `puenteIzq[i]` y `puenteDer[i]` son la posición, en el arreglo del
  hijo correspondiente, donde caería el mismo valor que está en la posición
  `i` del arreglo del padre.

> **Nota de apoyo** (no está en las diapositivas): el material no dice qué
> hacer cuando `i` cae después del último elemento de un hijo. La
> implementación necesita un **centinela**: una posición extra en cada
> arreglo de puentes (de tamaño `|arreglo del nodo| + 1`) que apunta al final
> del arreglo del hijo, para que ninguna búsqueda intente leer fuera de
> rango. Sin él, el caso "ningún elemento del hijo es mayor o igual" no
> tiene a dónde apuntar.

El invariante es más simple que el caso general de fractional cascading
(#31 del material): ahí sólo se promueve la mitad de cada lista para no
disparar el tamaño a `Θ(kn)`; aquí, como el arreglo del padre **es** la
unión de los de sus hijos, todo elemento del padre viene de alguno de los
dos y por lo tanto todos llevan puente — no hay nada que decidir promover.

## Operaciones

- [Reemplazo del BST secundario por un arreglo ordenado](/structures/layered-range-tree/operations/sorted-array-replacement) —
  construye el arreglo de cada nodo mezclando los de sus dos hijos.
- [Construcción de los puentes durante el merge](/structures/layered-range-tree/operations/bridge-build) —
  calcula `puenteIzq`/`puenteDer` reutilizando los índices del propio merge.
- [Consulta 2D](/structures/layered-range-tree/operations/range-query-2d) —
  desciende por los nodos canónicos en X saltando por los puentes en vez de
  volver a buscar en Y en cada uno.

## Análisis de complejidad

Estilo del profesor: **conteo directo de pasos**, sin recurrencia, sin
amortización, sin función potencial — el mismo estilo de
[fractional cascading](/structures/fractional-cascading) aplicado ahora al
árbol. La consulta ingenua hace `O(lg n)` nodos canónicos × `O(lg n)` de
búsqueda binaria en cada uno. La versión con puentes cambia ese `×` por un
`+`: `O(lg n)` nodos canónicos × `O(1)` cada uno (tras una única búsqueda
binaria real en la raíz) = `O(lg n)` en total — un factor de `lg n` menos.
El espacio no se re-deriva: el profesor lo afirma igual al del range tree
ingenuo, `O(n lg n)`, con el argumento de que un puente por elemento (en
realidad dos: uno por hijo) no agrega memoria significativa.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. El profesor sólo compara
explícitamente la consulta (`O(lg² n)` → `O(lg n)`) y el espacio
(`O(n lg n)` en ambos casos); no da un costo de tiempo de construcción
separado del de espacio, así que `sorted-array-replacement` y
`bridge-build` heredan el mismo `O(n lg n)` agregado de la construcción del
range tree 2D.

## Ejemplos

Ver [Ejemplos](/structures/layered-range-tree/examples).

## Comparación con estructuras relacionadas

| | Consulta 2D | Espacio |
| --- | --- | --- |
| [Range tree](/structures/range-tree) (ingenuo) | O(lg² n) | O(n lg n) |
| Layered range tree | O(lg n) | O(n lg n) |

El profesor generaliza además a `d` dimensiones: sin cascading,
`O(lg^{d-1} n)` (la última dimensión ya usa un arreglo con una búsqueda
binaria, sin BST completo); aplicando cascading en las dimensiones
intermedias, para `d > 2`, `O(lg^{d-2} n)`. Cada cascading adicional que se
pueda encadenar quita, literalmente, un factor de `lg n` del tiempo de
consulta, al costo de un puntero extra por elemento — no de una estructura
nueva.

## Prueba de dominio

Ver [Prueba de dominio](/structures/layered-range-tree/mastery-check).
