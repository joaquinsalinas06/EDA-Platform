---
kind: operation
title: Construcción
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-augmented-list.cpp
  - step-3-build.cpp
  - full-implementation.cpp
visualization:
  type: range-tree
  steps:
    - "note: >-"
        L3 es la última lista: no se modifica. Todo lo que sigue promueve
        elementos hacia ella, nunca al revés.
      highlight: ["l3-4", "l3-9", "l3-13", "l3-18", "l3-22"]
      nodes:
        - "{ id: l3-4, value: 4, parent: null }"
        - "{ id: l3-9, value: 9, parent: null }"
        - "{ id: l3-13, value: 13, parent: null }"
        - "{ id: l3-18, value: 18, parent: null }"
        - "{ id: l3-22, value: 22, parent: null }"
    - "note: >-"
        Se construye L'2 = L2 ∪ {mitad de L3}. Los elementos promovidos
        (9 y 18, marcados con ∗ en el material) guardan un puente: un
        puntero a su posición exacta en L3. El resto de L'2 (3, 5, 12) son
        propios de L2, sin puente.
      highlight: ["lp2-9", "lp2-18"]
      nodes:
        - "{ id: l3-4, value: 4, parent: null }"
        - "{ id: l3-9, value: 9, parent: null }"
        - "{ id: l3-13, value: 13, parent: null }"
        - "{ id: l3-18, value: 18, parent: null }"
        - "{ id: l3-22, value: 22, parent: null }"
        - "{ id: lp2-3, value: 3, parent: null }"
        - "{ id: lp2-5, value: 5, parent: null }"
        - '{ id: lp2-9, value: "9*", parent: l3-9 }'
        - "{ id: lp2-12, value: 12, parent: null }"
        - '{ id: lp2-18, value: "18*", parent: l3-18 }'
    - "note: >-"
        Se construye L'1 = L1 ∪ {mitad de L'2}. Los promovidos (5 y 12,
        tomados de L'2) guardan puente hacia su posición en L'2. Nótese que
        L'2 ya tenía sus propios puentes hacia L3: el puente no se
        "reexplica" en cada nivel, sólo baja un paso a la vez.
      highlight: ["lp1-5", "lp1-12"]
      nodes:
        - "{ id: l3-4, value: 4, parent: null }"
        - "{ id: l3-9, value: 9, parent: null }"
        - "{ id: l3-13, value: 13, parent: null }"
        - "{ id: l3-18, value: 18, parent: null }"
        - "{ id: l3-22, value: 22, parent: null }"
        - "{ id: lp2-3, value: 3, parent: null }"
        - "{ id: lp2-5, value: 5, parent: null }"
        - '{ id: lp2-9, value: "9*", parent: l3-9 }'
        - "{ id: lp2-12, value: 12, parent: null }"
        - '{ id: lp2-18, value: "18*", parent: l3-18 }'
        - "{ id: lp1-2, value: 2, parent: null }"
        - '{ id: lp1-5, value: "5*", parent: lp2-5 }'
        - "{ id: lp1-8, value: 8, parent: null }"
        - '{ id: lp1-12, value: "12*", parent: lp2-12 }'
        - "{ id: lp1-15, value: 15, parent: null }"
---

<!-- Derivado del pseudocódigo del profesor (#16-17); no hay bloque de
     pseudocódigo formal en el mazo, sólo la definición constructiva, que se
     transcribe literal. -->

## Qué hace

Construye, de abajo hacia arriba, la familia de listas aumentadas `L'1, ...,
L'k` a partir de las listas originales `L1, ..., Lk`, dejando un puntero
("puente") en cada elemento promovido hacia su posición exacta en la lista
siguiente.

## Intuición

No hace falta copiar la lista completa de un nivel al anterior para poder
"heredar" su posición: basta una fracción. Promover la mitad mantiene el
tamaño acotado (ver el argumento de la serie geométrica en
[theory.md](/structures/fractional-cascading#analisis-de-complejidad)) y aun
así deja suficientes puentes para que la consulta no repita la búsqueda
binaria en cada lista.

## Algoritmo

1. `L'k ← Lk` (la última lista no cambia).
2. Para `i` de `k−1` a `1`:
   - `L'i ← Li ∪ {cada elemento par de L'i+1}` (mezclados en orden).
   - Cada elemento tomado de `L'i+1` guarda un puente: un puntero a su
     posición exacta en `L'i+1`.

## Pseudocódigo

```
Construcción (de abajo hacia arriba)
Sea L'k = Lk. Para i de k−1 a 1:

    L'i = Li ∪ {cada elemento par de L'i+1}.

Cada elemento promovido (tomado de L'i+1) guarda un puente: un puntero
a su posición exacta en L'i+1.
```

## C++

Ver `step-2-augmented-list.cpp`, `step-3-build.cpp` y
`full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

El material no da una cota de tiempo propia para `build` — sólo la cota de
**tamaño** de `L'1` (ver más abajo). Fusionar dos listas ordenadas de tamaño
`m` y `m'` cuesta `O(m + m')`; sumado sobre los k niveles esto es lineal en
el tamaño total construido.

## Complejidad espacial

`O(n)` en total para todas las `L'i`, promoviendo sólo la mitad de cada
lista — argumento de serie geométrica: `|L'i| ≤ |Li| + ½|L'i+1|`. Promover
**todos** los elementos en vez de la mitad dispara el tamaño a `Θ(kn)`, de
vuelta al costo que fractional cascading busca evitar.

## Ejemplo

El único ejemplo numérico del material (#18-19), con `k = 3` listas:

```
L3     4    9    13   18   22        (no cambia)
L'2    3    5    9*   12   18*       (9 y 18 promovidos desde L3)
L'1    2    5*   8    12*  15        (5 y 12 promovidos desde L'2)
```

Los elementos marcados con `*` fueron promovidos desde la lista de abajo y
guardan un puente (línea punteada en el material) a su posición original.

## Casos límite

- **`k = 1`** (una sola lista): no hay nada que promover, `L'1 = L1` y la
  consulta se reduce a una búsqueda binaria simple.
- **Promover todos en vez de la mitad**: caso límite explícito del profesor
  (#25-26) — el tamaño de `L'1` se dispararía a `Θ(kn)`, perdiendo la
  ganancia de espacio que hace viable la técnica.
- **`L'k = Lk`**: la última lista es un caso base fijo, nunca recibe
  promociones.
