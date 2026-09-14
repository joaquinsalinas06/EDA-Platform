---
kind: theory
title: Range tree
visualization:
  type: range-tree
  steps:
    - note: >-
        Árbol de build-1d sobre las hojas {3, 4, 7, 9, 13, 15, 18, 27}
        (diapositiva #29). Las dos ideas de esta página se apoyan en este
        mismo árbol: primero la descomposición canónica, luego el
        anidamiento.
      highlight: []
      nodes:
        - { id: r9, value: 9, parent: null }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: l3, value: 3, parent: n3i }
        - { id: l4, value: 4, parent: n3i }
        - { id: n7i, value: 7, parent: n4 }
        - { id: l7, value: 7, parent: n7i }
        - { id: l9, value: 9, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15 }
        - { id: l13, value: 13, parent: n13i }
        - { id: l15, value: 15, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: l18, value: 18, parent: n18i }
        - { id: l27, value: 27, parent: n18i }
    - note: >-
        Primera idea — descomposición canónica: para un rango como [5,16],
        Predecessor(5)=4 y Successor(16)=18 delimitan la búsqueda (ver
        predecessor-successor). Ambos quedan fuera del rango.
      highlight: [l4, l18]
      nodes:
        - { id: r9, value: 9, parent: null }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: l3, value: 3, parent: n3i }
        - { id: l4, value: 4, parent: n3i, state: marked }
        - { id: n7i, value: 7, parent: n4 }
        - { id: l7, value: 7, parent: n7i }
        - { id: l9, value: 9, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15 }
        - { id: l13, value: 13, parent: n13i }
        - { id: l15, value: 15, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: l18, value: 18, parent: n18i, state: marked }
        - { id: l27, value: 27, parent: n18i }
    - note: >-
        El camino se separa en la raíz (LCA de las dos hojas
        delimitadoras): desde aquí se recorren dos caminos, uno hacia cada
        delimitador (ver range-query-1d).
      highlight: [r9]
      nodes:
        - { id: r9, value: 9, parent: null, state: active }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: l3, value: 3, parent: n3i }
        - { id: l4, value: 4, parent: n3i, state: marked }
        - { id: n7i, value: 7, parent: n4 }
        - { id: l7, value: 7, parent: n7i }
        - { id: l9, value: 9, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15 }
        - { id: l13, value: 13, parent: n13i }
        - { id: l15, value: 15, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: l18, value: 18, parent: n18i, state: marked }
        - { id: l27, value: 27, parent: n18i }
    - note: >-
        En O(log n) pasos aparecen los subárboles canónicos completos
        {7, 13} (hojas 7, 9, 13, 15): la respuesta se arma sin visitar cada
        hoja — la ventaja frente a recorrer el arreglo entero punto por
        punto.
      highlight: [n7i, n13i]
      nodes:
        - { id: r9, value: 9, parent: null }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: l3, value: 3, parent: n3i }
        - { id: l4, value: 4, parent: n3i, state: marked }
        - { id: n7i, value: 7, parent: n4, state: answer }
        - { id: l7, value: 7, parent: n7i }
        - { id: l9, value: 9, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15, state: answer }
        - { id: l13, value: 13, parent: n13i }
        - { id: l15, value: 15, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: l18, value: 18, parent: n18i, state: marked }
        - { id: l27, value: 27, parent: n18i }
    - note: >-
        Segunda idea — anidamiento: como el subárbol 7 ya delimita un
        subconjunto contiguo de puntos (7 y 9), sobre ÉL se puede construir
        un segundo range tree completo (aquí esquemático, ordenado por otra
        componente). Un arreglo ordenado no ofrece este subárbol ya
        delimitado — por eso el profesor cambia el arreglo por un árbol
        (ver build-2d).
      highlight: [n7i]
      panels:
        - { id: secondary, label: "Segunda dimensión (esquemático)", anchor: n7i }
      nodes:
        - { id: r9, value: 9, parent: null }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: l3, value: 3, parent: n3i }
        - { id: l4, value: 4, parent: n3i, state: marked }
        - { id: n7i, value: 7, parent: n4, state: answer }
        - { id: l7, value: 7, parent: n7i }
        - { id: l9, value: 9, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15, state: answer }
        - { id: l13, value: 13, parent: n13i }
        - { id: l15, value: 15, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: l18, value: 18, parent: n18i, state: marked }
        - { id: l27, value: 27, parent: n18i }
        - { id: sec7_root, value: 6, parent: null, panel: secondary }
        - { id: sec7_leaf9, value: 6, parent: sec7_root, panel: secondary }
        - { id: sec7_leaf7, value: 11, parent: sec7_root, panel: secondary }
    - note: >-
        No es un privilegio del nodo 7: el otro subárbol canónico, 13,
        cuelga el suyo propio de la misma forma. Las dos ideas juntas son
        el range tree: descomposición canónica (O(log n) subárboles sin
        tocar cada hoja) + anidamiento (cada subárbol cuelga otro range
        tree) — el desarrollo completo está en build-2d y range-query-2d.
      highlight: [n13i]
      panels:
        - { id: secondary2, label: "Segunda dimensión (esquemático)", anchor: n13i }
      nodes:
        - { id: r9, value: 9, parent: null }
        - { id: n4, value: 4, parent: r9 }
        - { id: n3i, value: 3, parent: n4 }
        - { id: l3, value: 3, parent: n3i }
        - { id: l4, value: 4, parent: n3i, state: marked }
        - { id: n7i, value: 7, parent: n4, state: answer }
        - { id: l7, value: 7, parent: n7i }
        - { id: l9, value: 9, parent: n7i }
        - { id: n15, value: 15, parent: r9 }
        - { id: n13i, value: 13, parent: n15, state: answer }
        - { id: l13, value: 13, parent: n13i }
        - { id: l15, value: 15, parent: n13i }
        - { id: n18i, value: 18, parent: n15 }
        - { id: l18, value: 18, parent: n18i, state: marked }
        - { id: l27, value: 27, parent: n18i }
        - { id: sec13_root, value: -2, parent: null, panel: secondary2 }
        - { id: sec13_leaf15, value: -2, parent: sec13_root, panel: secondary2 }
        - { id: sec13_leaf13, value: 0, parent: sec13_root, panel: secondary2 }
      caption: >-
        Descomposición canónica + anidamiento — con esas dos ideas se
        construyen todas las operaciones de esta estructura.
---

## ¿Qué problema resuelve?

Resuelve [búsqueda ortogonal por rangos](/structures/orthogonal-range-search)
sobre puntos **estáticos**: existencia, conteo y enumeración de los puntos
dentro de una caja. El profesor lo introduce como salida a un callejón sin
salida: con un arreglo ordenado ya se resuelve el caso $d=1$ en
$O(\log n + k)$, pero "si usamos arreglos, va a ser complicado aumentar
dimensiones de manera anidada". El range tree reemplaza el arreglo por un
[árbol binario de búsqueda balanceado](/structures/balanced-bst) precisamente
porque un árbol **sí** se puede anidar: cada nodo puede colgar de sí mismo
otro range tree para la siguiente dimensión.

## Intuición

La idea central: toda consulta de rango en un árbol ordenado se puede
responder como la unión de **$O(\log n)$ subárboles canónicos** — subárboles
completos, disjuntos entre sí, cuya unión de hojas es exactamente el
conjunto de puntos dentro del rango. Encontrar esos $O(\log n)$ subárboles
cuesta $O(\log n)$; una vez encontrados, contarlos, verificar si hay alguno
no vacío, o enumerar sus hojas son operaciones que se construyen encima sin
volver a tocar el resto del árbol. Subir de dimensión es entonces "colgar
otro range tree de cada nodo": cada subárbol canónico en X trae consigo un
subárbol canónico en Y ya armado.

## Estructura interna

> **Diferencia con el [BST balanceado](/structures/balanced-bst) de libro**:
> ahí las llaves viven en cualquier nodo y los internos son puntos reales.
> Aquí el profesor guarda **las llaves sólo en las hojas**; los nodos
> internos no son puntos del conjunto, son puramente delimitadores para
> guiar la búsqueda. Esa es la diferencia que hace funcionar la
> descomposición canónica: como todo punto vive en una hoja, cualquier
> subárbol interno corresponde exactamente a un rango contiguo de puntos,
> nunca a "un punto más un rango".

Cada hoja guarda un punto (o su llave, en 1D). Cada nodo interno guarda
**sólo el máximo del subárbol izquierdo**, para minimizar la memoria usada
(Sem4_Orthogonal_Range_Search.pdf#26) — no la llave completa de ningún
punto, sólo el valor que permite decidir hacia qué lado continuar una
búsqueda: para buscar `x`, si `x ≤ valor(nodo)` se baja por la izquierda,
si no por la derecha. Para [existencia y conteo](/structures/range-tree/operations/existence-count)
cada nodo además guarda la cantidad de hojas de su subárbol.

En el árbol de la diapositiva #29, con hojas
`{3, 4, 7, 9, 13, 15, 18, 27}`: la raíz vale 9 porque el máximo del
subárbol izquierdo (las hojas 3, 4, 7, 9) es 9; sus hijos 4 y 15 son, a su
vez, el máximo del subárbol izquierdo de cada mitad.

```
                9
        /               \
       4                 15
     /   \              /    \
    3     7           13      18
   / \   / \         /  \    /  \
  3   4 7   9      13    15 18   27
```

## Operaciones

- [Construcción 1D](/structures/range-tree/operations/build-1d) — ordena
  los puntos y arma el árbol de abajo hacia arriba con las llaves en las
  hojas.
- [Predecessor / Successor](/structures/range-tree/operations/predecessor-successor) —
  ubica las hojas frontera de un rango; adapta la idea de
  [balanced-bst](/structures/balanced-bst) a un árbol con llaves sólo en
  las hojas.
- [Consulta de rango 1D](/structures/range-tree/operations/range-query-1d) —
  la descomposición canónica: descender hasta P, luego bordear los dos
  caminos a los delimitadores marcando subárboles.
- [Existencia / Conteo](/structures/range-tree/operations/existence-count) —
  combina los contadores de los subárboles canónicos.
- [Enumeración](/structures/range-tree/operations/enumeration) — recorre las
  hojas de cada subárbol canónico.
- [Construcción 2D](/structures/range-tree/operations/build-2d) — cuelga un
  range tree secundario (ordenado por Y) de cada nodo del árbol primario
  (ordenado por X).
- [Consulta de rango 2D](/structures/range-tree/operations/range-query-2d) —
  una consulta 1D en X que dispara, por cada subárbol canónico, una
  consulta 1D en su árbol secundario de Y.
- [d dimensiones](/structures/range-tree/operations/d-dimensions) — el
  mismo anidamiento, una dimensión más.

## Análisis de complejidad

Estilo del profesor: **conteo estructural / argumento de multiplicidad**
(nunca recurrencias, nunca amortizado, nunca función potencial). Dos ideas
concentran todo el análisis:

- **Consulta 1D**: el camino de la raíz a cada delimitador tiene longitud
  $O(\log n)$; en cada nodo de esos dos caminos se agrega a lo más un
  subárbol canónico a la respuesta, así que hay $O(\log n)$ subárboles
  ("tendremos $O(\log n)$ subárboles que contengan nuestra respuesta",
  Sem4_Orthogonal_Range_Search.pdf#33-34). Sumar sus contadores o recorrer
  sus hojas cuesta $O(\log n)$ o $O(\log n + k)$ respectivamente — nunca se
  plantea una recurrencia $T(n)$.
- **Multiplicidad al anidar dimensiones**: el espacio en 2D sale de contar
  en cuántos árboles secundarios vive cada hoja — "cada hoja debería estar
  incluida en $O(\log n)$ subárboles" (#49) — y la consulta 2D sale de
  multiplicar "una consulta de $O(\log n)$ en $O(\log n)$ árboles" (#50). Repetir
  el argumento por cada dimensión adicional da $O(\log^d n + k)$ en consulta y
  $O(n \log^{d-1} n)$ en espacio (#56-57).

El profesor cierra anunciando una mejora futura sin desarrollarla: "¿Es
posible mejorarlo? Sí, se puede mejorar por un factor de $O(\log n)$ las
consultas para $d \ge 2$" (#58-59) — la resuelve fractional cascading, en la
semana 5.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. El profesor no distingue mejor caso,
promedio ni menciona espacio salvo cuando lo hace explícito (tamaño del
árbol 1D y espacio 2D/d-dimensional); esos campos se omiten donde no los
dio.

## Ejemplos

Ver [Ejemplos](/structures/range-tree/examples).

## Comparación con estructuras relacionadas

| | Consulta | Espacio |
| --- | --- | --- |
| Arreglo ordenado ($d=1$) | $O(\log n + k)$ | $O(n)$ |
| Range tree ($d=1$) | $O(\log n + k)$ | $O(n)$ |
| Range tree ($d=2$) | $O(\log^2 n + k)$ | $O(n \log n)$ |
| Range tree ($d$ dimensiones) | $O(\log^d n + k)$ | $O(n \log^{d-1} n)$ |

En $d=1$ el range tree iguala al arreglo ordenado (#20); su ventaja no es la
velocidad en 1D sino que, a diferencia del arreglo ("va a ser complicado
aumentar dimensiones de manera anidada", #22), sí se anida — de ahí que
recién en $d \ge 2$ el costo adicional en espacio y consulta aparezca, como
precio de esa capacidad de anidamiento.

## Prueba de dominio

Ver [Prueba de dominio](/structures/range-tree/mastery-check).
