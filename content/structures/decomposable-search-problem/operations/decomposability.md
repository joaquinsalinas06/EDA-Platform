---
kind: operation
title: Decomposability
order: 1
cppSteps:
  - step-1-decomposability-check.cpp
  - full-implementation.cpp
---

<!-- Es una CONDICIÓN, no un algoritmo — el profesor la define así (página
     32-33) y todo el resto del tema depende de verificarla, no de ejecutar
     un procedimiento. Se respeta el esqueleto de 9 secciones, pero
     "Algoritmo" describe cómo se VERIFICA la condición, no un procedimiento
     que se corre. -->

## Qué hace

No hace nada por sí sola: es el requisito que un problema de búsqueda debe
cumplir para que el resto de este tema (segment tree sobre el tiempo, Update,
Query) aplique. Es la puerta de entrada — no un paso intermedio.

## Intuición

Si puedes responder sobre la unión de dos conjuntos combinando en tiempo
constante lo que ya sabes de cada uno por separado, nunca necesitas volver a
mirar los datos originales de ninguno de los dos. Esa es la propiedad exacta
que hace que un [segment tree](/structures/segment-tree) funcione: cada nodo
resume su rango combinando a sus dos hijos, sin descender más. Aquí el
"rango" que se combina son conjuntos de operaciones en vez de posiciones de
un arreglo — pero la propiedad que hace falta es idéntica.

## Algoritmo

No hay un algoritmo que ejecutar; hay una condición que verificar sobre el
problema `(S, Query)` antes de aplicar el resto del tema:

1. Tomar cualquier partición `S = A ∪ B`.
2. Preguntar: ¿existe una función `f`, calculable en `O(1)`, tal que
   `Query(x, A ∪ B) = f(Query(x, A), Query(x, B))` para todo `x`?
3. Si sí para **toda** partición posible: el problema es descomponible, y
   `f` es la función de combinación que va en cada nodo interno del segment
   tree sobre el tiempo.
4. Si se puede exhibir una partición donde ninguna `f` en `O(1)` funciona: el
   problema **no** es descomponible (al menos no de esta forma simple), y
   este tema no aplica — hace falta otra técnica (ver
   [retroactive-priority-queue](/structures/retroactive-priority-queue) para
   el caso de `Delete-Min`).

## Pseudocódigo

La definición formal, transcrita del mazo (páginas 32-33) — funciona como el
"algoritmo" de verificación:

```
Problema de búsqueda descomponible:
Un problema de búsqueda sobre un conjunto S es descomponible si, para
cualquier partición S = A ∪ B:

    Query(x, A ∪ B) = f( Query(x, A), Query(x, B) )

para alguna función f calculable en O(1).
```

## C++

Ver `step-1-decomposability-check.cpp` y `full-implementation.cpp` en el
editor de arriba: verifican con asserts los cuatro ejemplos del profesor
(mín, máx, suma, ∨) sobre una partición concreta, y muestran por qué
"cardinalidad de un conjunto" (contraejemplo derivado, no del mazo) falla la
condición.

## Complejidad temporal

`O(1)` **por hipótesis** — no es una cota que se derive, es la exigencia de
la propia definición ("para alguna función f calculable en O(1)", página
32-33). Verificar si una `f` concreta cumple esto es responsabilidad de
quien analiza el problema, no algo que la definición garantice.

## Complejidad espacial

No aplica: la condición no reserva memoria propia. El costo de espacio real
aparece recién en [time-segment-tree-build](/structures/decomposable-search-problem/operations/time-segment-tree-build),
que si el problema es descomponible.

## Ejemplo

Los cuatro problemas descomponibles que da el profesor, con `S = A ∪ B` y
`f` (página 32-33):

- **Mínimo**: `mín(A ∪ B) = mín( mín(A), mín(B) )`. `f = mín`.
- **Máximo**: `máx(A ∪ B) = máx( máx(A), máx(B) )`. `f = máx`.
- **Suma**: `suma(A ∪ B) = suma(A) + suma(B)`. `f = +`.
- **Existencia de un elemento con propiedad P**: `existe(A ∪ B) = existe(A) ∨ existe(B)`.
  `f = ∨`.

En los cuatro casos, conocer sólo el resumen agregado de `A` y de `B` (un
número, o un booleano) basta para responder sobre `A ∪ B` — nunca hace falta
volver a mirar los elementos individuales de `A` ni de `B`.

## Casos límite

- **`Delete-Min` sobre una priority queue** *(el contraejemplo del mazo,
  página 47)*: "Delete-Min no es un problema descomponible simple". Con
  `A = {5, 1}` y `B = {3}`: `mín(A) = 1`, `mín(B) = 3`. Extraer el mínimo de
  `A ∪ B = {5,1,3}` da `1`, y el nuevo estado es `{5,3}` — pero para saber
  eso hace falta saber **qué elemento de A o B era el mínimo global** y
  **qué queda después de quitarlo**, no sólo `mín(A)` y `mín(B)` por
  separado. No hay una `f` en `O(1)` que produzca "el nuevo `A'` o `B'`
  después de extraer" a partir únicamente de los resúmenes `mín(A)`,
  `mín(B)`: haría falta saber de cuál de los dos conjuntos salió el mínimo, y
  eso ya no es información que quepa en un resumen constante.
- **La partición no es disjunta, o `f` no es asociativa/conmutativa**: el
  mazo no lo menciona. Los cuatro ejemplos sí son asociativos y conmutativos,
  pero la definición formal no lo exige explícitamente — es un hueco del
  material, no una regla adicional que se pueda asumir con seguridad.
- **`f` existe pero no es `O(1)`** (por ejemplo, requiere recorrer `A` o `B`
  completos): la definición simplemente no se cumple: sin `f` en `O(1)`, el
  overhead `O(lg m)` de la sección completa deja de sostenerse — el segment
  tree seguiría construyéndose, pero cada nodo costaría más que `O(1)` en
  combinar, rompiendo la cota final.
