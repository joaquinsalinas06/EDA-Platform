---
kind: theory
title: "Dominancia 2D (D₁)"
---

## ¿Qué problema resuelve?

Dentro de cada nodo de un [layered range tree](/structures/layered-range-tree)
(o de la estructura que el profesor está construyendo paso a paso hacia el
fractional cascading generalizado), el subárbol guarda un conjunto de puntos
en el plano $(y, z)$ y hace falta responder, muchas veces, la misma pregunta:
"dado un conjunto de puntos $(y_i, z_i)$ y una consulta $(b_2, b_3)$, reportar
todos los puntos con $y_i \le b_2$ y $z_i \le b_3$" — en tiempo $O(\lg n)$ y espacio
$O(n)$. Ese problema geométrico tiene nombre propio: **consulta de dominancia
en 2D**, y esta estructura (a la que el profesor llama $D_1$) es su solución.

Un [Layered Range Tree](/structures/layered-range-tree) corriente ya resuelve
esto anidando un árbol dentro de otro, pero eso no basta aquí: más adelante
(en $D_2$, $D_3$, $D_4$) va a hacer falta **una copia de esta estructura por
cada nodo de otro árbol**, y el espacio total tiene que seguir siendo $O(n)$
por copia. Una estructura puramente geométrica, sin árbol anidado dentro, es
más fácil de acoplar en las capas siguientes — por eso $D_1$ se construye
como una subdivisión del plano y no como un árbol de árboles.

## Intuición

La misma jugada que reformuló la localización de puntos como
[vertical ray shooting](/structures/vertical-ray-shooting): en vez de
preguntar directamente "¿este punto domina a aquel?", cada punto $(y_i, z_i)$
se convierte en un **rayo vertical** que sale de $(y_i, z_i)$ hacia arriba
(hacia $z = +\infty$), y la consulta $(b_2, b_3)$ se convierte en un **rayo
horizontal** que sale de $(b_2, b_3)$ hacia la izquierda. Un punto cumple
$y_i \le b_2 \land z_i \le b_3$ si y solo si su rayo vertical es atravesado por el rayo
horizontal de la consulta — la pregunta de dominancia se volvió una pregunta
de intersección de rayos, exactamente como PPL se volvió vertical ray
shooting. Ver [ray-reformulation](/structures/dominance-2d/operations/ray-reformulation).

```
                z
                |
                |        ↑           ↑        ↑
                |        |           |        |   (rayos verticales, uno
                |        |           |        |    por cada punto (y_i,z_i))
        b3 ─ ─ ─|┄┄┄┄┄┄┄┄●┄┄┄┄┄┄┄┄┄┄┄●┄┄┄┄┄┄┄┄┄┄┄┄┄●────  ← rayo de consulta
                |        |           |        |     (b2,b3), va hacia
                |        ●           |        |      la izquierda
                |                    ●
                |
                +──────────────────────────────●──────── y
                                              b2
```

Los puntos cuyo rayo vertical queda a la izquierda de $b_2$ **y** por debajo
de la altura $b_3$ son exactamente los que el rayo horizontal atraviesa: los
dominados.

## Estructura interna

Los $n$ rayos verticales dividen el plano en una **subdivisión planar de
caras de grado acotado** (un número constante de vecinos por cara) — un
resultado geométrico de **Chazelle (1986)** que garantiza que esta
subdivisión existe con $O(n)$ caras en total, aun cuando cada rayo podría en
principio interactuar con muchos otros. El invariante de espacio es que **no
todos los segmentos llegan hasta el final**: algunos se extienden y otros se
cortan, siguiendo la misma idea de "promover la mitad" que ya aparece en
fractional cascading sobre listas — aquí aplicada a rayos en vez de a
elementos de un arreglo. Ver
[subdivision-build](/structures/dominance-2d/operations/subdivision-build).

Cada cara de la subdivisión tiene, como borde, o bien un tramo de un rayo
(un punto real) o bien un borde "vacío" que solo existe para mantener el
grado acotado de sus vecinas.

## Operaciones

- [ray-reformulation](/structures/dominance-2d/operations/ray-reformulation) — convertir puntos y consulta en rayos verticales/horizontales.
- [subdivision-build](/structures/dominance-2d/operations/subdivision-build) — construir la subdivisión planar de grado acotado sobre los $n$ rayos.
- [dominance-query](/structures/dominance-2d/operations/dominance-query) — `ConsultaDominancia(S, b2, b3)`: búsqueda binaria más caminata por caras.

## Análisis de complejidad

El estilo aquí es **conteo directo por pasos, output-sensitive** — no hay
recurrencia, ni amortización, ni potencial. El costo se descompone en "una
búsqueda real + $O(1)$ por paso × número de pasos", y el número de pasos se
acota por $k$ (el tamaño de la respuesta), no por $n$. Justificación literal
del profesor (#31): "Costo total: $O(\lg n)$ de la búsqueda inicial, más
$O(1)$ por cada cara visitada. Como se visita exactamente una cara por punto
reportado (más un puñado de caras 'vacías'), el total es $O(\lg n + k)$." Es
el mismo patrón que usa en todo el deck para las estructuras output-sensitive
(#54): $O(\lg n) + O(1) \cdot O(\lg n) + O(k)$.

## Tabla de complejidad

Ver [meta.yaml](/structures/dominance-2d) — la única entrada con costo propio
es `dominance-query`; `ray-reformulation` y `subdivision-build` no tienen
costo temporal propio en el material (sólo el hecho de espacio $O(n)$
segmentos, citado arriba).

## Ejemplos

Ver [examples.md](/structures/dominance-2d/examples).

## Comparación con estructuras relacionadas

| | vertical-ray-shooting | dominance-2d (D₁) |
| --- | --- | --- |
| pregunta | ¿qué segmento toca primero el rayo vertical desde un punto? | ¿qué puntos atraviesa el rayo horizontal de una consulta? |
| rayo que se dispara | vertical, desde el punto de consulta | horizontal, desde $(b_2, b_3)$ |
| qué resuelve | localización de un punto entre segmentos | dominancia de un conjunto de puntos |
| usada por | [segment-intersection-sweep-line](/structures/segment-intersection-sweep-line) | [d2-bound-x](/structures/d2-bound-x), guardándola una vez por nodo de otro árbol (#33) |

## Prueba de dominio

Ver [mastery-check.md](/structures/dominance-2d/mastery-check).
