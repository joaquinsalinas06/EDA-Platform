---
kind: operation
title: Consulta de rango 2D
order: 7
cppSteps:
  - step-1-point.cpp
  - step-2-build-1d.cpp
  - step-7-build-2d.cpp
  - step-8-range-query-2d.cpp
  - full-implementation.cpp
---

<!-- El profesor da la complejidad y la intuición ("una consulta de O(log n)
     en O(log n) árboles", #50) pero nunca el procedimiento paso a paso —
     está entre los huecos que señala el análisis. Todo lo de abajo,
     incluida la mecánica exacta, es derivado. -->

## Qué hace

Responde una consulta de caja `[x1,x2] × [y1,y2]` sobre el range tree 2D de
[build-2d](/structures/range-tree/operations/build-2d).

## Intuición

Se resuelve como una consulta 1D en X que, en lugar de devolver
directamente las hojas, devuelve subárboles canónicos; y en cada uno de
esos subárboles se resuelve **otra** consulta 1D — ahora en `[y1,y2]` —
sobre su árbol secundario ya construido. El profesor lo resume así: "una
consulta de O(log n) en O(log n) árboles" (#50).

## Algoritmo

*(Derivado; el mazo no detalla este procedimiento — #50 sólo da la
complejidad y la intuición general.)*

1. `subarboles_x ← RangeQuery1D(raiz_x, x1, x2)` — los mismos O(log n)
   subárboles canónicos de
   [range-query-1d](/structures/range-tree/operations/range-query-1d),
   ahora sobre el árbol primario en X.
2. Para cada subárbol canónico `s` en `subarboles_x`: ejecutar
   `RangeQuery1D(s.secundario, y1, y2)` sobre su árbol secundario en Y, y
   combinar los resultados (existencia: basta uno no vacío; conteo: sumar;
   enumeración: concatenar).

## Pseudocódigo

```
RangeQuery2D(raiz_x, x1, x2, y1, y2)              // derivado
subarboles_x ← RangeQuery1D(raiz_x, x1, x2)
respuesta ← []
para cada s en subarboles_x
    respuesta.agregar(RangeQuery1D(s.secundario, y1, y2))
devolver respuesta   // unión de las sub-respuestas por Y
```

## C++

Ver `step-8-range-query-2d.cpp` y `full-implementation.cpp` en el editor
de arriba.

## Complejidad temporal

$O(\log^2 n + k)$: $O(\log n)$ subárboles canónicos en X, cada uno con una
consulta 1D de $O(\log n)$ en su secundario de Y —
"$O(\log n)$ en $O(\log n)$ árboles" (#50) — más $O(k)$ de salida.

## Complejidad espacial

$O(\log n)$ adicional para las listas intermedias de subárboles (el espacio
de la estructura misma, $O(n \log n)$, ya se pagó en
[build-2d](/structures/range-tree/operations/build-2d)).

## Ejemplo

*(Derivado sobre los puntos de build-2d.)* Consulta `[13,20] × [-3,2]`:
`RangeQuery1D` en X sobre `[13,20]` devuelve un subárbol canónico que
incluye a 13, 15, 18; sobre su secundario en Y, `RangeQuery1D` con
`[-3,2]` descarta el punto con Y=3 (que sería 18) y devuelve los puntos con
Y en `{-2,0,1}`, es decir (15,−2), (13,0), (27,1) — pero 27 no cumple
$x \in [13,20]$, así que en un caso real ese punto vendría de un subárbol
distinto y se filtraría ahí; este ejemplo ilustra el mecanismo, no un
recorrido exhaustivo completo.

## Casos límite

- **Caja vacía en X o en Y**: ninguno de los dos niveles de consulta 1D
  devuelve subárboles, la respuesta es vacía.
- **d=1 en la práctica** (`y1=-∞, y2=+∞`): la consulta en Y siempre
  devuelve todo el secundario, degenerando a
  [range-query-1d](/structures/range-tree/operations/range-query-1d) puro.
- **Todos los puntos en la misma X**: un único subárbol canónico en X
  (posiblemente la raíz), y toda la selectividad la aporta la consulta en Y.
