---
kind: theory
title: "D₄ — acotar z"
---

## ¿Qué problema resuelve?

D₄ responde la consulta completa de la clase: una caja 3D cerrada en las tres
coordenadas, [x1,x2] × [a2,b2] × [a3,b3] — "la pregunta única de toda la
clase" desde la diapositiva #2. [D3-separation-node](/structures/d3-separation-node)
ya cerraba x y y, pero dejaba z abierta sólo por abajo: [x1,x2] × [a2,b2] ×
(−∞,b3]. D₄ acota z también por arriba, sin pagar el costo extra de una
descomposición canónica.

## Intuición

El profesor lo presenta como "la misma idea, un nivel más": D₃ resolvió
exactamente este problema para y usando D₂ como estructura satélite en un
árbol de rango. D₄ repite ese mismo movimiento una dimensión arriba, usando
D₃ como satélite. Si en D₃ el árbol de rango era sobre y y guardaba D₂ normal
a un lado del nodo de separación y D₂ invertida al otro, en D₄ el árbol de
rango es sobre **z** y guarda D₃ normal a un lado y D₃ invertida al otro.

> **Nota de apoyo** (no está en las diapositivas): "invertida" significa lo
> mismo que en D₃ — la misma estructura, pero acotando su dimensión libre por
> abajo (≥) en vez de por arriba (≤), para el lado del árbol donde esa
> dirección es la que falta por cerrar.

## Estructura interna

Un árbol de rango sobre z. Cada nodo v de este árbol guarda dos estructuras
satélite, sobre los puntos de sus dos hijos (#46):

- en derecha(v): una **D₃ normal** (acotada por arriba, z ≤ b3);
- en izquierda(v): una **D₃ invertida** (acotada por abajo, z ≥ a3).

Esto es exactamente lo mismo que guarda cada nodo de D₃ — sólo que ahí la
estructura satélite era D₂ y la dimensión del árbol era y. Nada del
mecanismo cambia: la razón de por qué alcanza con un nodo (el nodo de
separación, localizado al buscar a3 y b3 y ver dónde divergen sus caminos)
es idéntica a la de D₃, y el material no repite esa justificación para D₄ —
la da por heredada de D₃ (#46). Ver
[D3-separation-node](/structures/d3-separation-node) para esa justificación
completa: aquí no se reexplica.

Qué cambia, exactamente:
- la dimensión sobre la que se construye el árbol de rango (z en vez de y);
- la estructura satélite que cuelga de cada nodo (D₃ en vez de D₂).

Qué se hereda sin cambios:
- el árbol de rango en sí y su invariante (BST balanceado sobre la
  coordenada elegida);
- la idea de nodo de separación y por qué basta un único nodo en vez de
  O(lg n) nodos canónicos;
- la noción de estructura "normal" a un lado y "invertida" al otro.

## Operaciones

- [Build](/structures/d4-bound-z/operations/build) — la única operación que
  el mapa de conocimiento le asigna a D₄.

> **Nota de apoyo** (no está en las diapositivas, es información sobre el
> material): el profesor no desarrolla una consulta propia para D₄ en esta
> sección — ni la localización del nodo de separación ni el disparo de las
> dos consultas satélite se repiten para z. Las diapositivas #46-47 sólo
> describen la construcción y, a partir de ella, el costo de *usar* D₄ antes
> de aplicar cascading (ver abajo). La consulta se hereda literalmente de
> D₃: es el mismo procedimiento sobre z. Por eso el mapa de conocimiento le
> da a este tema una sola operación (`build`) y ninguna consulta propia.

## Análisis de complejidad

El profesor no da una cota numérica para construir D₄ — tampoco la dio para
D₂ ni D₃ (#34, y ningún dato análogo en #35-45): "exactamente la misma
construcción que D₃" no trae, en la sección de D₄, un análisis nuevo de
tiempo de construcción.

Lo que sí da en esta sección es el costo de **usar** D₄ tal como queda
construido, en dos estados distintos, con el mismo **estilo de composición
estructural** que D₂ y D₃ (multiplicar el costo de cada nivel anidado, no
recurrencia ni amortización):

| estado | consulta | espacio |
| --- | --- | --- |
| sin cascading todavía (#47) | O(lg² n + k) | — |
| con cascading completo (#54, #57, #62) | O(lg n + k) | O(n lg³ n) |

Cita literal (#47): "Tal como está, cada nivel (D₃ dentro de D₄) todavía
hace su propia búsqueda binaria real: O(lg n) · O(lg n) + k = O(lg² n + k).
Falta la pieza final." Esa "pieza final" es
[fractional cascading generalizado](/structures/generalized-fractional-cascading),
que no se desarrolla aquí — sólo se menciona como destino, tal como lo hace
el material (#48-55).

## Tabla de complejidad

`complexity: {}` en el meta.yaml: no hay una cota propia de `build` que
tabular. La tabla de arriba describe el costo de **usar** la estructura ya
construida, en dos momentos distintos de la exposición — no el costo de
construirla — y por eso vive en prosa y no en la tabla generada por la
plataforma.

## Ejemplos

Ver [Ejemplos](/structures/d4-bound-z/examples). El profesor no da ningún
valor concreto en las 76 páginas del mazo; el ejemplo se deriva a mano de la
descripción de la construcción, marcado como tal.

## Comparación con estructuras relacionadas

| | dimensión del árbol de rango | estructura satélite | qué acota |
| --- | --- | --- | --- |
| [D2-bound-x](/structures/d2-bound-x) | x (BST simple) | D₁ (dominancia) | x cerrado, y y z abiertos por arriba |
| [D3-separation-node](/structures/d3-separation-node) | y | D₂ normal / D₂ invertida | x e y cerrados, z abierto por arriba |
| D₄ (aquí) | z | D₃ normal / D₃ invertida | x, y y z cerrados — la caja completa |

Cada fila es la anterior, un nivel más. Es exactamente el patrón que el
material señala como preparación para
[fractional cascading generalizado](/structures/generalized-fractional-cascading):
"D₄ sobre D₃ sobre D₂ sobre D₁" (#53).

## Prueba de dominio

Ver [Prueba de dominio](/structures/d4-bound-z/mastery-check).
