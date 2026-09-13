---
kind: operation
title: Splay
order: 4
cppSteps:
  - step-1-node.cpp
  - step-2-rotate.cpp
  - step-3-zig-zig.cpp
  - step-4-zig-zag.cpp
  - step-5-splay.cpp
  - full-implementation.cpp
---

## Qué hace

Es la operación madre del splay tree: "se encarga de mover el valor x
buscado a la raíz pero balanceando algunos nodos sobre la marcha. Usa
rotaciones por casos específicos para tener una complejidad amortizada de
O(log n) por búsqueda" (#60-63). No es un caso más — es el bucle que decide,
en cada iteración, cuál de los tres casos aplicar:
[`zig`](/structures/splay-tree/operations/zig),
[`zig-zig`](/structures/splay-tree/operations/zig-zig) o
[`zig-zag`](/structures/splay-tree/operations/zig-zag).

## Intuición

Splay(x) repite "mira dónde está x respecto de su padre y su abuelo, aplica
el caso que corresponda" hasta que x llega a la raíz. Cada iteración sube a
x al menos un nivel (dos, si el caso es zig-zig o zig-zag), así que el
número de iteraciones está acotado por la profundidad inicial de x. El
material da los tres casos como diagramas (#64-66) pero no da explícitamente
el bucle que los aplica repetidamente ni el criterio de selección — eso es
lo que se completa aquí.

> **Nota de apoyo** (no está en las diapositivas): el criterio para elegir
> caso en cada iteración es puramente estructural, no depende de valores:
> - si x no tiene abuelo (su padre es la raíz) → [`zig`](/structures/splay-tree/operations/zig);
> - si x y su padre son hijos del mismo lado de su abuelo → [`zig-zig`](/structures/splay-tree/operations/zig-zig);
> - si son hijos de lados opuestos → [`zig-zag`](/structures/splay-tree/operations/zig-zag).
>
> El deck no dice explícitamente que estos tres casos se repiten en bucle
> hasta que x es raíz, ni qué hace Splay si x ya es la raíz al llamarlo
> (la respuesta razonable: nada, cero rotaciones) — es el hueco más
> bloqueante para implementar Splay a partir sólo de las diapositivas.

## Algoritmo

1. Mientras `x` no sea la raíz:
2. Si `x.padre` es la raíz → aplicar [`zig`](/structures/splay-tree/operations/zig)
   y terminar (x ya es la raíz).
3. Si `x` y `x.padre` son hijos del mismo lado de `x.padre.padre` → aplicar
   [`zig-zig`](/structures/splay-tree/operations/zig-zig).
4. Si son hijos de lados opuestos → aplicar
   [`zig-zag`](/structures/splay-tree/operations/zig-zag).
5. Repetir desde el paso 1.

## Pseudocódigo

```
Algoritmo: Splay(x)
mientras x ≠ raíz hacer
     p ← x.padre
     si p = raíz entonces
          Zig(x)
     sino
          a ← p.padre
          si (x = p.izquierdo y p = a.izquierdo) o
             (x = p.derecho y p = a.derecho) entonces
               ZigZig(x)
          sino
               ZigZag(x)
// x es ahora la raíz
```

## C++

Ver `step-5-splay.cpp` y `full-implementation.cpp` en el editor de arriba:
`splay(x)` es el bucle de arriba, llamando `zig`, `zigZig` o `zigZag` según
la posición relativa de x, p y a.

## Complejidad temporal

O(log n) **amortizado** (#63) — no peor caso de una llamada aislada. Cada
iteración del bucle es O(1) real (un `zig`, `zig-zig` o `zig-zag`, cada uno
O(1)), y el número de iteraciones es a lo más la profundidad de x, que en el
peor caso real es O(n) (un árbol degenerado): el costo real de **una**
llamada a Splay puede ser O(n). Lo que el profesor garantiza es que,
promediado sobre cualquier secuencia de llamadas a Splay, el costo por
llamada es O(log n) — la cota amortizada no dice nada sobre una llamada
aislada, sólo sobre el total de la secuencia.

## Complejidad espacial

O(1) adicional (versión iterativa, sin recursión).

## Ejemplo

Ver [examples.md](/structures/splay-tree/examples).

## Casos límite

- **`x` ya es la raíz**: el bucle no se ejecuta ni una vez, cero
  rotaciones — Splay es un no-op.
- **`x` es hijo directo de la raíz**: una sola iteración, siempre
  [`zig`](/structures/splay-tree/operations/zig) (nunca zig-zig ni
  zig-zag, porque no hay abuelo).
- **Árbol degenerado en cadena, x es la hoja más profunda**: el número de
  iteraciones es O(n) — el peor caso real de una llamada, distinto de la
  cota amortizada de O(log n).
