---
kind: theory
title: Fractional cascading
visualization:
  type: range-tree
  mode: layers
  steps:
    - note: >-
        Partimos de las mismas tres listas del ejemplo de esta página: L1,
        L2, L3, cada una ordenada por separado. Buscar el mismo x en las
        tres, una por una, exige tres búsquedas binarias independientes —
        sin ninguna relación entre ellas.
      mode: layers
      arrays:
        - { id: L3, label: L3, row: 2, cells: [4, 9, 13, 18, 22] }
        - { id: L2raw, label: L2, row: 1, cells: [3, 5, 12] }
        - { id: L1raw, label: L1, row: 0, cells: [2, 8, 15] }
    - note: >-
        Si L2 guardara una copia COMPLETA de L3 (no sólo una fracción),
        localizar x en L3 se traduciría directo a su posición en L2 — pero
        el tamaño se dispara: L2 pasa de 3 elementos propios a 8 (los 5 de
        L3 copiados enteros), y ese crecimiento se repite en cada nivel
        hasta Θ(kn).
      mode: layers
      arrays:
        - { id: L3, label: L3, row: 2, cells: [4, 9, 13, 18, 22] }
        - id: L2full
          label: "L2 (copia completa de L3)"
          row: 1
          cells: [3, 4, 5, 9, 12, 13, 18, 22]
          states: [idle, copied, idle, copied, idle, copied, copied, copied]
    - note: >-
        En cambio, promovemos sólo la mitad de L3: de cada dos elementos,
        uno sube (9 y 18, marcados como frontera de lo que se va a
        promover). Alcanza para heredar la posición sin duplicar el
        tamaño de la lista de arriba.
      mode: layers
      arrays:
        - id: L3
          label: L3
          row: 2
          cells: [4, 9, 13, 18, 22]
          states: [idle, marked, idle, marked, idle]
        - { id: L2raw, label: L2, row: 1, cells: [3, 5, 12] }
    - note: >-
        Se construye L'2 = L2 ∪ {mitad de L3}. Los promovidos (9 y 18)
        quedan marcados como nuevos en esta versión y guardan un puente a
        su posición exacta en L3; el resto de L'2 (3, 5, 12) son los
        propios de L2, sin puente.
      mode: layers
      arrays:
        - { id: L3, label: L3, row: 2, cells: [4, 9, 13, 18, 22] }
        - id: Lp2
          label: "L'2"
          row: 1
          cells: [3, 5, 9, 12, 18]
          states: [idle, idle, copied, idle, copied]
      bridges:
        - { from: Lp2, fromIndex: 2, to: L3, toIndex: 1, active: true }
        - { from: Lp2, fromIndex: 4, to: L3, toIndex: 3, active: true }
    - note: >-
        El mismo patrón se repite un nivel más arriba: L'1 = L1 ∪ {mitad
        de L'2} (5 y 12, promovidos y marcados como nuevos). El invariante
        |L'i| ≤ |Li| + ½|L'i+1| se cumple en cada nivel — es justo lo que
        evita el Θ(kn) del segundo paso.
      mode: layers
      arrays:
        - { id: L3, label: L3, row: 2, cells: [4, 9, 13, 18, 22] }
        - id: Lp2
          label: "L'2"
          row: 1
          cells: [3, 5, 9, 12, 18]
          states: [idle, marked, idle, marked, idle]
        - id: Lp1
          label: "L'1"
          row: 0
          cells: [2, 5, 8, 12, 15]
          states: [idle, copied, idle, copied, idle]
      bridges:
        - { from: Lp2, fromIndex: 2, to: L3, toIndex: 1, active: false }
        - { from: Lp2, fromIndex: 4, to: L3, toIndex: 3, active: false }
        - { from: Lp1, fromIndex: 1, to: Lp2, toIndex: 1, active: true }
        - { from: Lp1, fromIndex: 3, to: Lp2, toIndex: 3, active: true }
    - note: >-
        Resultado final: tres listas de 5 elementos cada una — 15 en
        total, lineal en n, no Θ(kn) como en el segundo paso. La cadena de
        puentes conecta L'1 con L'2 y L'2 con L3: es lo que permite bajar
        de nivel en O(1) en vez de repetir la búsqueda binaria completa
        (ver `query`).
      mode: layers
      arrays:
        - { id: L3, label: L3, row: 2, cells: [4, 9, 13, 18, 22] }
        - id: Lp2
          label: "L'2"
          row: 1
          cells: [3, 5, 9, 12, 18]
        - id: Lp1
          label: "L'1"
          row: 0
          cells: [2, 5, 8, 12, 15]
      bridges:
        - { from: Lp2, fromIndex: 2, to: L3, toIndex: 1, active: false }
        - { from: Lp2, fromIndex: 4, to: L3, toIndex: 3, active: false }
        - { from: Lp1, fromIndex: 1, to: Lp2, toIndex: 1, active: false }
        - { from: Lp1, fromIndex: 3, to: Lp2, toIndex: 3, active: false }
      caption: "|L'1| + |L'2| + |L3| = 5 + 5 + 5 = 15 = O(n)"
---

## ¿Qué problema resuelve?

Dadas $k$ listas ordenadas $L_1, \ldots, L_k$ (cada una de tamaño $\le n$), buscar el
mismo valor $x$ en todas. Esto es justo lo que necesita el
[range tree](/structures/range-tree) al descender por sus nodos: cada nodo
del árbol guarda una lista ordenada asociada, y responder una consulta exige
localizar la misma clave en la lista de varios nodos del camino.

Lo obvio es repetir una búsqueda binaria independiente por lista: $O(k \lg n)$.
Fractional cascading lo baja a **$O(k + \lg n)$**: una sola búsqueda binaria cara,
y $O(1)$ por cada lista adicional.

## Intuición

Si cada lista guardara una copia completa de la lista anterior, la posición
de $x$ en una se traduciría directo a la posición en la otra — pero copiar
todo hace que el tamaño total se dispare a $\Theta(kn)$, de vuelta al costo
original (sólo que ahora en espacio). La idea es que **no hace falta la
lista entera para heredar la posición: basta una fracción de ella**. Copiando
sólo la mitad de cada lista hacia la anterior, un puntero ("puente") desde
cada elemento copiado a su posición real basta para que, tras localizar $x$
una sola vez, bajar de lista en lista cueste $O(1)$ por paso en vez de otra
búsqueda binaria completa.

## Estructura interna

Se construye una nueva familia de listas $L'_1, \ldots, L'_k$ de abajo hacia
arriba:

```
Sea L'k = Lk. Para i de k−1 a 1:
    L'i = Li ∪ {cada elemento par de L'i+1}.
```

Cada elemento promovido (tomado de $L'_{i+1}$) guarda un **puente**: un puntero
a su posición exacta en $L'_{i+1}$. $L'_k$ no cambia — es la última lista, no
tiene de dónde promover.

El invariante de tamaño es lo que hace que valga la pena:

$$|L'_i| \le |L_i| + \tfrac{1}{2}|L'_{i+1}|$$

Promover **todos** los elementos (no sólo la mitad) rompería esto:
$|L'_i| = |L_i| + |L'_{i+1}|$ se dispara a $\Theta(kn)$. Promover la mitad es lo que
convierte esa recurrencia en una serie geométrica que converge (ver
[Análisis de complejidad](#analisis-de-complejidad)).

## Operaciones

- [`build`](/structures/fractional-cascading/operations/build): construir
  las listas aumentadas $L'_1, \ldots, L'_k$ y sus puentes, de abajo hacia arriba.
- [`query`](/structures/fractional-cascading/operations/query): buscar el
  mismo valor $x$ en todas las listas, bajando puentes desde una única
  búsqueda binaria en $L'_1$.

## Análisis de complejidad

El profesor usa dos argumentos distintos, uno por costo:

**Tiempo de `query`** — conteo directo de pasos: una única búsqueda binaria
real en $L'_1$ cuesta $O(\lg n)$. Desde esa posición, seguir el puente más
cercano hacia $L'_2$ cae a lo más $\pm 1$ posición de donde $x$ realmente iría —
ajustar con $O(1)$ comparaciones. Repetir para bajar a $L'_3, \ldots, L_k$: $O(1)$
cada uno. Total: $O(\lg n) + O(k) = O(k + \lg n)$.

**Tamaño de `build`** — serie geométrica:

$$|L'_i| \le |L_i| + \tfrac{1}{2}|L'_{i+1}|$$

Al desenrollar la recurrencia, el factor $\tfrac{1}{2}$ en cada nivel hace que la suma total
sobre las $k$ listas converja — no crezca linealmente con $k$ — y quede en
$|L'_1| = O(n)$, sin importar cuántas listas haya. Es el argumento que
justifica por qué basta una fracción y no la lista completa: copiar toda la
lista pierde esa convergencia geométrica y el tamaño vuelve a depender de $k$.

> **Nota de apoyo** (no está en las diapositivas): en este mazo **$k$ es el
> número de listas** ($O(k + \lg n)$). En el resto del curso — y en la
> notación estándar de "búsqueda + reporte" que usan
> [`range-tree`](/structures/range-tree) y otras estructuras de esta semana —
> **$k$ es el tamaño de la respuesta** ($O(\lg n + k)$). Las dos cotas se ven
> idénticas y significan cosas distintas. El profesor no lo advierte en
> ningún punto del material; es la confusión más probable de examen sobre
> este tema.

## Tabla de complejidad

Ver `meta.yaml`. Sólo `build` (tamaño, no tiempo de construcción) y `query`
(tiempo) tienen cota propia en el material — el profesor no da un costo de
tiempo aparte para construir las listas aumentadas, sólo la cota de tamaño
que resulta de la serie geométrica.

## Ejemplos

Ver [examples.md](/structures/fractional-cascading#ejemplos).

## Comparación con estructuras relacionadas

| | búsqueda ingenua en k listas | fractional cascading |
| --- | --- | --- |
| costo | $O(k \lg n)$: una búsqueda binaria completa por lista | $O(k + \lg n)$: una búsqueda binaria + $O(1)$ por lista |
| qué evita repetir | nada — cada lista se busca desde cero | la búsqueda binaria, vía los puentes |
| espacio extra | ninguno | $O(n)$ en total (promoviendo la mitad); $\Theta(kn)$ si se promoviera todo |

Se usa dentro de [`layered-range-tree`](/structures/layered-range-tree),
aplicándola a las listas asociadas a cada nodo del
[range tree](/structures/range-tree). El mazo siguiente la generaliza de
"cadena de listas" a "grafo de estructuras" en
[`generalized-fractional-cascading`](/structures/generalized-fractional-cascading).

## Prueba de dominio

Ver [mastery-check.md](/structures/fractional-cascading#prueba-de-dominio).
