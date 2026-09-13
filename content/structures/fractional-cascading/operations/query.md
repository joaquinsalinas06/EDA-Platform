---
kind: operation
title: Consulta
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-augmented-list.cpp
  - step-3-build.cpp
  - step-4-query.cpp
  - full-implementation.cpp
---

<!-- El material da la consulta como lista numerada en prosa (#21-24), no
     como pseudocódigo formal; se transcribe literal y se traduce a pasos. -->

## Qué hace

Busca el mismo valor `x` en todas las listas aumentadas `L'1, ..., L'k`,
usando los puentes dejados por [`build`](/structures/fractional-cascading/operations/build)
para no repetir la búsqueda binaria en cada una.

## Intuición

Sólo hace falta ubicar a `x` una vez, con precisión, en `L'1`. A partir de
ahí, cada lista siguiente ya tiene "medio camino hecho": el puente más
cercano cae a lo más ±1 posición de donde `x` realmente iría en esa lista,
así que ajustar la posición exacta es O(1) en vez de otra búsqueda binaria
completa.

## Algoritmo

1. Una única búsqueda binaria de `x` en `L'1`: `O(lg n)`.
2. Desde esa posición, seguir el puente más cercano hacia `L'2`: cae a lo
   más ±1 posición de donde `x` realmente iría — ajustar con O(1)
   comparaciones.
3. Repetir el paso anterior para bajar a `L'3, ..., Lk`: O(1) cada uno.

## Pseudocódigo

```
Buscar x en todas las listas
 1. Una única búsqueda binaria de x en L'1: O(lg n).
 2. Desde esa posición, seguir el puente más cercano hacia L'2: cae a lo
    más ±1 posición de donde x realmente iría — ajustar con O(1)
    comparaciones.
 3. Repetir el paso anterior para bajar a L'3, ..., Lk: O(1) cada uno.
```

## C++

Ver `step-4-query.cpp` y `full-implementation.cpp` en el editor de arriba.
`full-implementation.cpp` contrasta este resultado contra la búsqueda
binaria ingenua (independiente en cada lista), verificando que ambas dan el
mismo resultado y contando las comparaciones de cada una.

## Complejidad temporal

`O(k + lg n)`: `O(lg n)` de la única búsqueda binaria real en `L'1`, más
`O(1)` por cada una de las `k − 1` listas restantes al bajar puentes. Total
literal del profesor (#24): "`O(lg n)` (una búsqueda real) + `O(k)` (bajar
puentes) = `O(k + lg n)`".

> **Nota de apoyo** (no está en las diapositivas): aquí `k` es el número de
> listas, no el tamaño de la respuesta como en el resto del curso — ver la
> nota en [theory.md](/structures/fractional-cascading#analisis-de-complejidad).

## Complejidad espacial

`O(1)` adicional: la consulta sólo recorre punteros ya construidos, no
reserva estructuras nuevas.

## Ejemplo

Sobre el ejemplo de `build` (`L'1 = [2, 5*, 8, 12*, 15]`, `L'2 = [3, 5, 9*,
12, 18*]`, `L3 = [4, 9, 13, 18, 22]`), buscar `x = 9`:

1. Búsqueda binaria en `L'1`: `9` cae entre `8` y `12*` (posición 4).
2. Seguir el puente más cercano (el de `12*`) hacia `L'2`: aterriza cerca de
   la posición de `9` en `L'2` (que sí está, en la posición 3) — ajuste O(1).
3. Bajar el puente de `9` (viene de L3) hacia `L3`: `9` está en la posición 2
   de `L3` — ajuste O(1).

*(derivado del pseudocódigo; no aparece en las diapositivas: el mazo no trae
un trazo numérico de la consulta, sólo de la construcción)*.

## Casos límite

- **`x` no está en ninguna lista**: la búsqueda binaria en `L'1` y los
  ajustes en cada lista siguen costando lo mismo — sólo cambia si el
  resultado final reporta "no encontrado" en cada `Li`.
- **`k = 1`**: la consulta se reduce a la única búsqueda binaria en `L'1`,
  sin puentes que bajar — `O(lg n)`, coherente con la fórmula general.
- **`x` menor que todos los elementos de `L'1`**: el puente sigue existiendo
  (apunta al primer elemento promovido), el ajuste O(1) sigue aplicando.
