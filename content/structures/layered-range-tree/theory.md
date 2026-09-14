---
kind: theory
title: Layered range tree
visualization:
  type: range-tree
  mode: layers
  steps:
    - note: >-
        Estructura interna: cada nodo del árbol primario en X guarda un
        arreglo ordenado con las Y de su subárbol, en vez del árbol
        secundario del range tree ingenuo. Aquí un hijo izquierdo L=[3,8] y
        un hijo derecho R=[5,9] ya lo tienen construido; su padre P=[3,5,8,9]
        también, pero todavía sin ningún puente.
      mode: layers
      arrays:
        - { id: L, label: L, row: 1, slot: left, cells: [3, 8] }
        - { id: R, label: R, row: 1, slot: right, cells: [5, 9] }
        - { id: P, label: P, row: 0, cells: [3, 5, 8, 9] }
    - note: >-
        El invariante: el arreglo del padre P no es independiente de los de
        sus hijos, es exactamente la unión de L y R. Es la precondición que
        fractional cascading necesita para funcionar sin trabajo extra — no
        hay que elegir qué mitad de qué lista promover, porque toda la
        lista del padre ya viene de los hijos.
      mode: layers
      arrays:
        - { id: L, label: L, row: 1, slot: left, cells: [3, 8] }
        - { id: R, label: R, row: 1, slot: right, cells: [5, 9] }
        - { id: P, label: P, row: 0, cells: [3, 5, 8, 9] }
    - note: >-
        puenteIzq[i] guarda, para cada posición i del padre, la posición
        equivalente en el arreglo del hijo izquierdo. P[0]=3 vino de L[0]=3,
        así que puenteIzq[0]=0 — el puente activo, en azul.
      mode: layers
      arrays:
        - { id: L, label: L, row: 1, slot: left, cells: [3, 8] }
        - { id: R, label: R, row: 1, slot: right, cells: [5, 9] }
        - { id: P, label: P, row: 0, cells: [3, 5, 8, 9] }
      bridges:
        - { from: P, fromIndex: 0, to: L, toIndex: 0, active: true }
    - note: >-
        puenteDer[i] hace lo mismo hacia el hijo derecho. P[1]=5 vino de
        R[0]=5, así que puenteDer[1]=0.
      mode: layers
      arrays:
        - { id: L, label: L, row: 1, slot: left, cells: [3, 8] }
        - { id: R, label: R, row: 1, slot: right, cells: [5, 9] }
        - { id: P, label: P, row: 0, cells: [3, 5, 8, 9] }
      bridges:
        - { from: P, fromIndex: 0, to: L, toIndex: 0, active: false }
        - { from: P, fromIndex: 1, to: R, toIndex: 0, active: true }
    - note: >-
        El invariante no se detiene ahí: las posiciones 0, 1 y 2 de P llevan
        puente hacia AMBOS hijos, no sólo hacia el que aportó el valor — a
        diferencia del caso general de fractional cascading, donde sólo se
        promueve la mitad de cada lista, aquí no hay nada que decidir
        promover, porque todo elemento del padre viene de alguno de los dos.
      mode: layers
      arrays:
        - { id: L, label: L, row: 1, slot: left, cells: [3, 8] }
        - { id: R, label: R, row: 1, slot: right, cells: [5, 9] }
        - { id: P, label: P, row: 0, cells: [3, 5, 8, 9] }
      bridges:
        - { from: P, fromIndex: 0, to: L, toIndex: 0, active: false }
        - { from: P, fromIndex: 0, to: R, toIndex: 0, active: false }
        - { from: P, fromIndex: 1, to: L, toIndex: 1, active: false }
        - { from: P, fromIndex: 1, to: R, toIndex: 0, active: false }
        - { from: P, fromIndex: 2, to: L, toIndex: 1, active: false }
        - { from: P, fromIndex: 2, to: R, toIndex: 1, active: false }
    - note: >-
        Nota de apoyo (no está en las diapositivas): qué hacer cuando i cae
        después del último elemento de un hijo necesita un centinela — una
        posición extra, marcada como frontera (•), en cada arreglo de
        puentes que apunta al final del arreglo del hijo correspondiente.
        Sin él, ninguna búsqueda tendría a dónde apuntar cuando ningún
        elemento del hijo es mayor o igual.
      mode: layers
      arrays:
        - { id: L, label: L, row: 1, slot: left, cells: [3, 8, "•"], states: [idle, idle, marked] }
        - { id: R, label: R, row: 1, slot: right, cells: [5, 9, "•"], states: [idle, idle, marked] }
        - { id: P, label: P, row: 0, cells: [3, 5, 8, 9, "•"], states: [idle, idle, idle, idle, marked] }
      bridges:
        - { from: P, fromIndex: 4, to: L, toIndex: 2, active: false }
        - { from: P, fromIndex: 4, to: R, toIndex: 2, active: false }
      caption: "centinela: puenteIzq[4]=2, puenteDer[4]=2 — una posición extra que apunta al final de cada hijo"
---

## ¿Qué problema resuelve?

Elimina el factor $\lg n$ de más que arrastra la consulta 2D del
[range tree](/structures/range-tree): en la versión ingenua, cada uno de los
$O(\lg n)$ nodos canónicos en X dispara una búsqueda binaria completa en su
árbol secundario de Y, para un total $O(\lg^2 n)$. El profesor lo plantea como
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
> hacer cuando $i$ cae después del último elemento de un hijo. La
> implementación necesita un **centinela**: una posición extra en cada
> arreglo de puentes (de tamaño $|\text{arreglo del nodo}| + 1$) que apunta al final
> del arreglo del hijo, para que ninguna búsqueda intente leer fuera de
> rango. Sin él, el caso "ningún elemento del hijo es mayor o igual" no
> tiene a dónde apuntar.

El invariante es más simple que el caso general de fractional cascading
(#31 del material): ahí sólo se promueve la mitad de cada lista para no
disparar el tamaño a $\Theta(kn)$; aquí, como el arreglo del padre **es** la
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
árbol. La consulta ingenua hace $O(\lg n)$ nodos canónicos × $O(\lg n)$ de
búsqueda binaria en cada uno. La versión con puentes cambia ese `×` por un
`+`: $O(\lg n)$ nodos canónicos × $O(1)$ cada uno (tras una única búsqueda
binaria real en la raíz) = $O(\lg n)$ en total — un factor de $\lg n$ menos.
El espacio no se re-deriva: el profesor lo afirma igual al del range tree
ingenuo, $O(n \lg n)$, con el argumento de que un puente por elemento (en
realidad dos: uno por hijo) no agrega memoria significativa.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. El profesor sólo compara
explícitamente la consulta ($O(\lg^2 n)$ → $O(\lg n)$) y el espacio
($O(n \lg n)$ en ambos casos); no da un costo de tiempo de construcción
separado del de espacio, así que `sorted-array-replacement` y
`bridge-build` heredan el mismo `O(n lg n)` agregado de la construcción del
range tree 2D.

## Ejemplos

Ver [Ejemplos](/structures/layered-range-tree/examples).

## Comparación con estructuras relacionadas

| | Consulta 2D | Espacio |
| --- | --- | --- |
| [Range tree](/structures/range-tree) (ingenuo) | $O(\lg^2 n)$ | $O(n \lg n)$ |
| Layered range tree | $O(\lg n)$ | $O(n \lg n)$ |

El profesor generaliza además a $d$ dimensiones: sin cascading,
$O(\lg^{d-1} n)$ (la última dimensión ya usa un arreglo con una búsqueda
binaria, sin BST completo); aplicando cascading en las dimensiones
intermedias, para $d > 2$, $O(\lg^{d-2} n)$. Cada cascading adicional que se
pueda encadenar quita, literalmente, un factor de `lg n` del tiempo de
consulta, al costo de un puntero extra por elemento — no de una estructura
nueva.

## Prueba de dominio

Ver [Prueba de dominio](/structures/layered-range-tree/mastery-check).
