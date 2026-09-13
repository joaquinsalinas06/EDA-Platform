---
kind: operation
title: Composition
order: 3
cppSteps:
  - step-3-path-cascade-query.cpp
  - full-implementation.cpp
---

## Qué hace

Junta [Applicability](/structures/generalized-fractional-cascading/operations/applicability)
y [Bounded-degree-check](/structures/generalized-fractional-cascading/operations/bounded-degree-check)
en el resultado final: con el grafo de cascading generalizado conectando
[D₄ sobre D₃ sobre D₂ sobre D₁](/structures/d4-bound-z), una sola búsqueda
binaria real al entrar por `x` alcanza para navegar **todos** los niveles.

## Intuición

Una vez que se sabe que el grafo cumple grado acotado (D₄/D₃ lo cumple con
grado ≤ 5), la navegación completa es exactamente la misma idea de
[fractional cascading](/structures/fractional-cascading) sobre una cadena,
aplicada arista por arista del camino que la consulta recorre en el grafo:
una única búsqueda real donde se entra, y de ahí en adelante, cada paso —
incluyendo los saltos entre estructura normal y su gemela invertida — es
O(1) porque el puente ya deja la posición a ajustar, no a rebuscar.

## Algoritmo

1. Fijar el camino del grafo que la consulta 3D necesita recorrer (por
   ejemplo, entrar por D₄, bajar a D₃, seguir el enlace a la estructura
   invertida si hace falta).
2. Hacer **una única** búsqueda binaria real en el vértice de entrada:
   `O(lg n)`.
3. Para cada paso siguiente del camino (`O(k)` pasos en total), bajar el
   puente correspondiente y ajustar en `O(1)` — el mismo mecanismo de
   [fractional cascading#query](/structures/fractional-cascading/operations/query),
   aplicado a la arista concreta que toca en ese paso del grafo.
4. El costo total es la suma de estos pasos: `O(lg n)` (la búsqueda real) +
   `O(1) · O(lg n)` (los pasos de descenso) + `O(k)` (reportar) =
   `O(lg n + k)`.

## Pseudocódigo

```
Con el grafo de cascading generalizado conectando D4 sobre D3 sobre D2
sobre D1, una sola busqueda binaria real al entrar por x alcanza para
todos los niveles: cada paso hacia abajo (incluyendo los saltos entre
estructura normal e invertida) es O(1).

O(lg n)              + O(1) . O(lg n) + O(k) = O(lg n + k)
`- una busqueda real   `- pasos de descenso    `- reporte
```

## C++

Ver `step-3-path-cascade-query.cpp` y `full-implementation.cpp` en el
editor de arriba. `full-implementation.cpp` contrasta esta consulta
—recorriendo un camino de 4 vértices del grafo D₄-like, incluyendo un salto
a la gemela invertida— contra búsqueda binaria independiente en cada
vértice del camino, contando comparaciones de ambas.

## Complejidad temporal

`O(lg n + k)`, donde `k` es el número de pasos del camino recorrido. Textual
(#54): `O(lg n) + O(1)·O(lg n) + O(k) = O(lg n + k)`. Es el mismo argumento
de conteo directo de
[fractional cascading#query](/structures/fractional-cascading/operations/query#complejidad-temporal),
aplicado a un camino de un grafo en vez de a una cadena fija: el grado
acotado es lo que garantiza que cada paso siga costando `O(1)`, sin importar
cuál arista se recorra.

## Complejidad espacial

`O(n lg³ n)` para la consulta 3D completa (#57): "cada punto aparece, en
promedio, `O(lg³ n)` veces entre las distintas copias de D₁, D₂ y D₃
anidadas dentro de D₄" — un argumento de multiplicidad, no de conteo de
pasos, igual que el `O(n lg n)` del range tree 2D de la semana 4.

## Ejemplo

`full-implementation.cpp` recorre el camino `[raíz, hijo, raíz, gemela
invertida]` sobre el grafo D₄-like de 5 vértices y muestra, comparación por
comparación, que el cascading a lo largo del camino usa menos comparaciones
en total que buscar independientemente en cada uno de los 4 vértices del
camino — el mismo patrón de ahorro de
[fractional cascading](/structures/fractional-cascading), ahora sobre un
grafo.

## Casos límite

- **Camino de un solo vértice (`k = 1`)**: la navegación se reduce a la
  única búsqueda binaria real, sin ningún paso de descenso — `O(lg n)`,
  coherente con la fórmula general.
- **El camino repite un vértice** (por ejemplo, entra y vuelve a la raíz
  antes de saltar a la gemela invertida, como en el ejemplo de C++): no
  rompe nada — cada paso del camino sigue costando `O(1)` porque depende de
  la arista que se recorre, no de si el vértice ya se visitó antes.
- **d dimensiones (generalización, #64-66)**: para `d ≥ 3`, el cascading
  completo (Chazelle & Guibas 1986) da `O(lg^(d−2) n + k)` con espacio
  `O(n lg^(d−1) n)`; la alternativa de cascading sólo en el nivel más
  interno (Willard 1985; Gabow, Bentley & Tarjan 1984) da `O(lg^(d−1) n + k)`
  con el mismo espacio. Para `d = 3` (este caso): `lg^(d−2) n = lg n` contra
  `lg^(d−1) n = lg² n` — la diferencia exacta que separa D₁-D₄ completo de
  la versión más simple.
