---
kind: theory
title: Fractional cascading
---

## ¿Qué problema resuelve?

Dadas `k` listas ordenadas `L1, ..., Lk` (cada una de tamaño ≤ n), buscar el
mismo valor `x` en todas. Esto es justo lo que necesita el
[range tree](/structures/range-tree) al descender por sus nodos: cada nodo
del árbol guarda una lista ordenada asociada, y responder una consulta exige
localizar la misma clave en la lista de varios nodos del camino.

Lo obvio es repetir una búsqueda binaria independiente por lista: `O(k lg n)`.
Fractional cascading lo baja a **O(k + lg n)**: una sola búsqueda binaria cara,
y O(1) por cada lista adicional.

## Intuición

Si cada lista guardara una copia completa de la lista anterior, la posición
de `x` en una se traduciría directo a la posición en la otra — pero copiar
todo hace que el tamaño total se dispare a `Θ(kn)`, de vuelta al costo
original (sólo que ahora en espacio). La idea es que **no hace falta la
lista entera para heredar la posición: basta una fracción de ella**. Copiando
sólo la mitad de cada lista hacia la anterior, un puntero ("puente") desde
cada elemento copiado a su posición real basta para que, tras localizar `x`
una sola vez, bajar de lista en lista cueste O(1) por paso en vez de otra
búsqueda binaria completa.

## Estructura interna

Se construye una nueva familia de listas `L'1, ..., L'k` de abajo hacia
arriba:

```
Sea L'k = Lk. Para i de k−1 a 1:
    L'i = Li ∪ {cada elemento par de L'i+1}.
```

Cada elemento promovido (tomado de `L'i+1`) guarda un **puente**: un puntero
a su posición exacta en `L'i+1`. `L'k` no cambia — es la última lista, no
tiene de dónde promover.

El invariante de tamaño es lo que hace que valga la pena: `|L'i| ≤ |Li| +
½|L'i+1|`. Promover **todos** los elementos (no sólo la mitad) rompería esto:
`|L'i| = |Li| + |L'i+1|` se dispara a `Θ(kn)`. Promover la mitad es lo que
convierte esa recurrencia en una serie geométrica que converge (ver
[Análisis de complejidad](#analisis-de-complejidad)).

## Operaciones

- [`build`](/structures/fractional-cascading/operations/build): construir
  las listas aumentadas `L'1, ..., L'k` y sus puentes, de abajo hacia arriba.
- [`query`](/structures/fractional-cascading/operations/query): buscar el
  mismo valor `x` en todas las listas, bajando puentes desde una única
  búsqueda binaria en `L'1`.

## Análisis de complejidad

El profesor usa dos argumentos distintos, uno por costo:

**Tiempo de `query`** — conteo directo de pasos: una única búsqueda binaria
real en `L'1` cuesta `O(lg n)`. Desde esa posición, seguir el puente más
cercano hacia `L'2` cae a lo más ±1 posición de donde `x` realmente iría —
ajustar con O(1) comparaciones. Repetir para bajar a `L'3, ..., Lk`: O(1)
cada uno. Total: `O(lg n) + O(k) = O(k + lg n)`.

**Tamaño de `build`** — serie geométrica: `|L'i| ≤ |Li| + ½|L'i+1|`. Al
desenrollar la recurrencia, el factor ½ en cada nivel hace que la suma total
sobre las k listas converja — no crezca linealmente con k — y quede en
`|L'1| = O(n)`, sin importar cuántas listas haya. Es el argumento que
justifica por qué basta una fracción y no la lista completa: copiar toda la
lista pierde esa convergencia geométrica y el tamaño vuelve a depender de k.

> **Nota de apoyo** (no está en las diapositivas): en este mazo **`k` es el
> número de listas** (`O(k + lg n)`). En el resto del curso — y en la
> notación estándar de "búsqueda + reporte" que usan
> [`range-tree`](/structures/range-tree) y otras estructuras de esta semana —
> **`k` es el tamaño de la respuesta** (`O(lg n + k)`). Las dos cotas se ven
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
| costo | O(k lg n): una búsqueda binaria completa por lista | O(k + lg n): una búsqueda binaria + O(1) por lista |
| qué evita repetir | nada — cada lista se busca desde cero | la búsqueda binaria, vía los puentes |
| espacio extra | ninguno | O(n) en total (promoviendo la mitad); Θ(kn) si se promoviera todo |

Se usa dentro de [`layered-range-tree`](/structures/layered-range-tree),
aplicándola a las listas asociadas a cada nodo del
[range tree](/structures/range-tree). El mazo siguiente la generaliza de
"cadena de listas" a "grafo de estructuras" en
[`generalized-fractional-cascading`](/structures/generalized-fractional-cascading).

## Prueba de dominio

Ver [mastery-check.md](/structures/fractional-cascading#prueba-de-dominio).
