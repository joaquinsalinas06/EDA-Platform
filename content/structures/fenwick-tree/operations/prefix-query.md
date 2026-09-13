---
kind: operation
title: Prefix query
order: 2
cppSteps:
  - step-1-lowbit.cpp
  - step-2-update.cpp
  - step-3-prefix-query.cpp
  - full-implementation.cpp
---

<!-- Concepto de apoyo: no hay diapositiva que citar (sourceSlides vacío). -->

## Qué hace

Devuelve la suma `A[1] + ... + A[i]` combinando los rangos ya precomputados
en `tree`, sin sumar elemento por elemento.

## Intuición

`[1, i]` se puede cubrir sin traslape con una cantidad logarítmica de rangos
`tree[j]`: el primero es el rango que termina en `i` (`tree[i]` mismo), el
siguiente es el rango que termina justo antes de donde empezó ese, y así
sucesivamente — se llega a cada uno bajando con `i -= lowbit(i)`.

## Algoritmo

1. `suma ← 0`.
2. Mientras `i > 0`: sumar `tree[i]` a `suma`.
3. Retroceder `i ← i - (i & -i)`.
4. Repetir hasta que `i` llegue a 0; devolver `suma`.

## Pseudocódigo

```
PrefixQuery(tree, i)
suma ← 0
mientras i > 0
    suma ← suma + tree[i]
    i ← i - (i & -i)
devolver suma
```

## C++

Ver `step-3-prefix-query.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

O(lg n): cada paso apaga un bit de `i`; con `⌈lg n⌉` bits en total, el ciclo
termina en a lo más esa cantidad de iteraciones (ver theory.md).

## Complejidad espacial

O(1) adicional: no hay recursión, sólo un ciclo.

## Ejemplo

Para `n = 8` con los rangos de theory.md, `PrefixQuery(i=6)` suma `tree[6]`
(rango `(4,6]`) y `tree[4]` (rango `(0,4]`): `6 → 4 → 0` (termina). Juntos,
`(0,4] ∪ (4,6] = (0,6]`, exactamente el prefijo pedido, sin traslape.

## Casos límite

- **i = 0**: el ciclo no entra ninguna vez; devuelve `0` (suma vacía).
- **i = n**: recorre el camino más largo posible dentro de `[1,n]`, pero
  sigue siendo O(lg n).
- **Rango completo vía resta**: `suma(l, r) = PrefixQuery(r) -
  PrefixQuery(l-1)` — no es una operación nueva, es esta misma combinada
  dos veces; por eso Fenwick sólo sirve para operaciones invertibles (ver
  la comparación en theory.md).
