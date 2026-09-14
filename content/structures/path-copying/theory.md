---
kind: theory
title: Path Copying
---

## ¿Qué problema resuelve?

Una estructura [persistente](/structures/persistence-levels) nunca muta un
nodo ya construido. La pregunta que abre el tema: si nunca modificamos
nodos, ¿cómo actualizamos algo sin copiar toda la estructura en cada
operación? La respuesta del profesor: **Path Copying**. Sólo se copian los
nodos que están en el camino desde la raíz hasta el punto que cambia; todo
lo demás — los subárboles que no cambian — se comparte entre la versión
vieja y la nueva, vía punteros del [modelo pointer machine](/structures/pointer-machine).

A diferencia de [nodos gordos](/structures/fat-nodes), no hace falta ningún
registro de modificaciones ni ningún split: cada operación simplemente
construye un camino nuevo y reutiliza el resto.

## Intuición

Piensa en el árbol como una serie de decisiones descendentes: en cada nivel,
la operación decide "izquierda o derecha" (o, en un trie, "qué hijo del
alfabeto") hasta llegar al punto que hay que cambiar. Path copying clona
sólo los nodos de esa decisión — el camino — y en cada uno reengancha el
subárbol que no cambió con el puntero viejo, intacto. La versión anterior
queda completa y consultable porque nadie la tocó: sólo se le agregó, por
fuera, un camino nuevo que apunta hacia ella.

El caso degenerado de la técnica es el stack como lista enlazada: ya es un
"camino" de un solo nodo de largo, así que no hay nada que copiar aparte
del nodo nuevo — [Push](/structures/path-copying/operations/stack-push) es
persistencia funcional en su forma más pura, sin necesitar llamarla
"path copying" para verla.

## Estructura interna

Path copying no es una estructura de datos con su propio layout de nodo:
es una técnica de implementación que se aplica sobre estructuras ya
conocidas (stack, [segment tree](/structures/segment-tree), trie). El
invariante que impone sobre cualquiera de ellas es el mismo: **una versión
nunca se modifica después de crearse**. Cada operación de escritura recibe
un puntero a la raíz de la versión vieja y devuelve un puntero a la raíz de
una versión nueva; ambos punteros siguen siendo válidos y consultables para
siempre.

Lo que cambia entre estructuras es el largo del camino que hay que copiar:

| | Stack | Segment Tree | Trie |
| --- | --- | --- | --- |
| Altura relevante | `1` | $O(\lg n)$ | $O(L)$ |
| Nodos copiados por operación | `1` | $O(\lg n)$ | $O(L)$ |
| Espacio nuevo por operación | $O(1)$ | $O(\lg n)$ | $O(L)$ |

En los tres casos: path copying cuesta exactamente el largo del camino que
cambia, sin importar qué tan grande sea el resto de la estructura.

## Operaciones

- [Push (stack persistente)](/structures/path-copying/operations/stack-push) — agrega un elemento sin copiar nada más que el nodo nuevo.
- [Update (segment tree persistente)](/structures/path-copying/operations/segment-tree-update) — copia el camino raíz-hoja de la posición modificada.
- [Consultar una versión vieja](/structures/path-copying/operations/query-old-version) — la consulta normal del segment tree, partiendo de la raíz guardada.
- [Insert (trie persistente)](/structures/path-copying/operations/trie-insert) — copia un nodo por carácter de la cadena insertada.

## Análisis de complejidad

Estilo del profesor: **conteo directo del camino**, no amortizado — no hay
recurrencia ni potencial de por medio. El argumento se repite igual en los
tres ejemplos: la operación copia *exactamente un nodo por nivel* del
camino que toca, así que el costo en tiempo y el espacio nuevo son ambos
proporcionales al largo de ese camino. En genérico, sobre un árbol de
altura `h`, path copying cuesta $O(h)$ tiempo y $O(h)$ espacio extra
(Sem_3_Persistencia-1.pdf#53-54).

Esto contrasta deliberadamente con [nodos gordos](/structures/fat-nodes),
que sí usa el método del potencial: el mazo enseña dos estilos de análisis
distintos para el mismo problema (persistencia).

## Tabla de complejidad

El profesor nunca distingue mejor/promedio/peor en este tema — a diferencia
del resto del curso, sí da espacio explícitamente, y es el único tema del
mazo donde el espacio es un dato de primera clase.

## Ejemplos

Ver [examples.md](/structures/path-copying/examples).

## Comparación con estructuras relacionadas

Frente a [nodos gordos](/structures/fat-nodes) (que sí soportan
persistencia parcial y total con overhead de registro y split), path
copying sólo produce persistencia funcional
[persistence-levels](/structures/persistence-levels), pero sin ningún
registro de modificaciones: cada escritura es simplemente "construir un
camino nuevo". Es la técnica detrás de lo que se conoce como *persistent
segment tree*, muy usada en programación competitiva para responder
consultas sobre prefijos o versiones históricas de un arreglo. En la semana
4, [segment-intersection-sweep-line](/structures/segment-intersection-sweep-line)
la reutiliza sobre una estructura de barrido.

## Prueba de dominio

Ver [mastery-check.md](/structures/path-copying/mastery-check).
