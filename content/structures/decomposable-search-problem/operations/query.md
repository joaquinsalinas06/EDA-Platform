---
kind: operation
title: Query
order: 4
cppSteps:
  - step-5-query.cpp
  - full-implementation.cpp
---

<!-- Es el resultado final del tema: retroactividad COMPLETA, vía el mismo
     Query de segment tree ya conocido, aplicado al rango [inicio, t] del
     eje del tiempo. -->

## Qué hace

Responde `Query(t, op)` de la interfaz de
[retroactividad](/structures/retroactivity#estructura-interna) para
**cualquier** tiempo `t` del pasado — no sólo el presente. Es lo que hace
que este tema dé retroactividad **completa** y no sólo parcial.

## Intuición

Preguntar "¿cuál es el resultado como si estuviéramos en el tiempo `t`?" es
preguntar por el efecto acumulado de todas las operaciones activas desde el
inicio de la línea de tiempo hasta `t` — es decir, el rango $[1, t]$ del
segment tree de tiempo. Eso es exactamente un
[Query de rango de segment tree](/structures/segment-tree/operations/query):
se descompone `[1, t]` en `O(lg m)` nodos canónicos y se combinan con `f`,
sin recorrer las `t` hojas una por una.

## Algoritmo

Reduce directamente al [Query de segment tree](/structures/segment-tree/operations/query),
con el rango fijo en $[1, t]$:

1. Llamar `Query(raíz, 1, m, 1, t)` sobre el segment tree de tiempo.
2. Ese Query se descompone, como cualquier Query de rango, en a lo más
   $O(\lg m)$ nodos completamente cubiertos por $[1, t]$, combinados con `f`.
3. El resultado es la respuesta de la estructura de búsqueda original **como
   si `t` fuera el presente**.

## Pseudocódigo

```
Cualquier problema de búsqueda descomponible admite retroactividad completa
con un overhead multiplicativo de O(lg m) por operación, usando un Segment
Tree sobre el tiempo. Si la estructura original respondía en O(q), la
versión retroactiva responde en O(q · lg m).
```

(páginas 36-37). El pseudocódigo estructural del recorrido — el caso "fuera
de rango", el caso "completamente dentro", el caso "parcial" que recursa a
ambos hijos — es el de
[Query de segment tree](/structures/segment-tree/operations/query#pseudocódigo);
no se repite aquí.

## C++

Ver `step-5-query.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

$O(q \cdot \lg m)$, donde `q` es el costo de la estructura original y `m` el
número de operaciones. Textual (página 36-37): "Si la estructura original
respondía en `O(q)`, la versión retroactiva responde en `O(q · lg m)`". El
Query de rango visita $O(\lg m)$ nodos canónicos (el argumento heredado de
[Query de segment tree](/structures/segment-tree/operations/query)); en cada
uno se paga el costo $O(q)$ de la estructura original para reconstruir o
combinar su resultado local, de ahí el factor multiplicativo.

## Complejidad espacial

No la da el profesor. Heredada del
[Query de segment tree](/structures/segment-tree/operations/query):
$O(\lg m)$ de pila de recursión.

## Ejemplo

Ver la visualización de
[Time-segment-tree-build](/structures/decomposable-search-problem/operations/time-segment-tree-build) —
`Query(t=1)` devuelve `valor([1,1]) = 0` sin bajar al subárbol de `[2,2]`
(la operación de `t=2` queda fuera de su intervalo de vida); `Query(t=3)` se
descompone en los canónicos `[1,2]` y `[3,3]`, dando `5+0=5` (la misma
operación sí queda dentro de su intervalo de vida para esta consulta).

## Casos límite

- **`t` = el instante más reciente**: equivale a `Query(raíz)` completo, sin
  descomposición — coincide con el rango total $[1, m]$, que es la raíz.
- **`t` menor que el primer instante insertado**: el rango $[1, t]$ cae
  fuera de toda operación insertada; devuelve el neutro de `f` en $O(1)$.
- **`t = m` (la posición más reciente) tras un `Delete` reciente**: refleja
  el estado sin la operación borrada de inmediato — no hace falta rehacer
  nada más, porque `Delete` (ver [Update](/structures/decomposable-search-problem/operations/update))
  ya dejó el segment tree consistente antes de que llegue esta consulta.
