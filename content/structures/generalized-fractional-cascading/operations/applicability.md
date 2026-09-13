---
kind: operation
title: Applicability
order: 1
cppSteps:
  - step-1-graph-vertex.cpp
  - full-implementation.cpp
---

<!-- Es una CONDICIÓN, no un algoritmo -- igual que
     /structures/decomposable-search-problem/operations/decomposability.md.
     "Algoritmo" describe cómo se VERIFICA la condición sobre un grafo dado,
     no un procedimiento que se ejecuta para producir un resultado. -->

## Qué hace

No calcula nada por sí sola: es el requisito que un grafo de listas debe
cumplir para que [fractional cascading](/structures/fractional-cascading)
generalizado aplique. Responde la pregunta central de este tema: **dado un
grafo de listas, ¿puedo aplicar fractional cascading aquí?**

## Intuición

[Fractional cascading](/structures/fractional-cascading) sobre una cadena
funciona porque cada lista tiene un único vecino hacia donde bajar un
puente en O(1). La generalización pregunta qué hace falta para que ese
mismo truco funcione sobre un grafo cualquiera: que cada vértice tenga un
número **constante** de vecinos. Si el grado no está acotado, un vértice
necesitaría mantener un puente por cada vecino, y ese número podría crecer
con `n` — el paso ya no sería O(1).

## Algoritmo

No hay un algoritmo que ejecutar; hay una condición que verificar sobre el
grafo `(V, E)` antes de aplicar el resto del tema:

1. ¿Cada vértice `v ∈ V` guarda un conjunto (lista ordenada) de elementos?
2. ¿Cada arista está etiquetada con boletos (bridges) hacia elementos
   vecinos, como en [fractional cascading](/structures/fractional-cascading#estructura-interna)?
3. ¿El grado de **todo** vértice está acotado por una constante `d`
   (independiente de `n`)?
4. Si las tres respuestas son sí: la técnica aplica, y la navegación
   completa cuesta `O(k + lg n)` — una búsqueda real al entrar, y `O(1)`
   por cada uno de los `k` pasos.
5. Si algún vértice tiene grado no acotado: la técnica **no** aplica sobre
   ese grafo tal cual — ver el contraejemplo en Casos límite.

## Pseudocódigo

La condición formal, transcrita del mazo (#51) — funciona como el
"algoritmo" de verificación:

```
Fractional cascading funciona en cualquier grafo donde:
  - cada vertice guarda un conjunto de elementos;
  - las aristas estan etiquetadas con boletos hacia elementos vecinos;
  - cada vertice tiene grado acotado (un numero constante de vecinos).
Bajo esas condiciones, la navegacion completa cuesta O(k + lg n):
una busqueda real al entrar, y O(1) por cada paso.
```

## C++

Ver `step-1-graph-vertex.cpp` y `full-implementation.cpp` en el editor de
arriba: definen el grafo D₄-like (grado acotado por 5) sobre el que se
verifica la condición en
[Bounded-degree-check](/structures/generalized-fractional-cascading/operations/bounded-degree-check),
y `full-implementation.cpp` construye además el contraejemplo de grado no
acotado.

## Complejidad temporal

`O(1)` **por hipótesis** sobre un vértice concreto — no es una cota que se
derive, es la exigencia de la propia condición (#51). Verificar el grafo
**entero** cuesta recorrer todos sus vértices una vez (ver
[Bounded-degree-check](/structures/generalized-fractional-cascading/operations/bounded-degree-check)
para esa cota).

## Complejidad espacial

No aplica: la condición no reserva memoria propia. El costo de espacio real
del grafo cascadeado aparece en
[Composition](/structures/generalized-fractional-cascading/operations/composition).

## Ejemplo

El grafo D₄-like de [D₄](/structures/d4-bound-z) cumple la condición: cada
nodo tiene a lo más 5 vecinos (padre, dos hijos, dos enlaces a la gemela
invertida, #52), un número fijo que no crece con `n`. Ver
[examples.md](/structures/generalized-fractional-cascading/examples) para
el contraejemplo de un grafo que **no** la cumple.

## Casos límite

- **Grafo con un solo vértice sin vecinos** (`k = 1`): grado 0, cumple la
  condición trivialmente — la "navegación" es una única búsqueda binaria,
  sin ningún paso de descenso.
- **Grado acotado pero distinto de 5**: la condición no exige exactamente 5
  — exige *alguna* constante `d`. D₄/D₃ da 5 como cota concreta de esta
  construcción (#52), no como parte de la definición general (#51).
- **Grado no acotado (el contraejemplo)**: un vértice conectado a una
  fracción de los `n` vértices restantes (por ejemplo, un nodo "hub" con
  grado proporcional a `n`) rompe la condición — mantener un puente por
  vecino ya no es `O(1)` por vértice. Ver
  [Bounded-degree-check](/structures/generalized-fractional-cascading/operations/bounded-degree-check#casos-límite)
  para los números concretos de cuánto se dispara el tamaño.
