---
kind: operation
title: Extract-Min
order: 5
cppSteps:
  - step-1-array-indices.cpp
  - step-2-max-heapify.cpp
  - step-5-find-extract-min.cpp
  - full-implementation.cpp
---

<!-- Derivado; no aparece en las diapositivas (sólo Θ(lg n) en la tabla
     comparativa, Sem_1_Heaps_I-1.pdf#35-42). Nombre "de mínimo" por la
     convención de esa tabla, aplicado aquí a un montículo MÁXIMO — ver la
     nota de apoyo sobre la simetría max<->min en theory.md. -->

## Qué hace

Retira y devuelve el extremo del montículo (aquí, el máximo), dejando el
resto como un montículo máximo válido.

## Intuición

No se puede simplemente borrar la raíz: eso deja un hueco que rompe la
forma de árbol casi completo. La solución es mover el **último** elemento a
la raíz (eso sí preserva la forma) y dejar que Max-Heapify repare el
invariante hundiéndolo a su lugar.

## Algoritmo

1. Guardar `A[1]` como el valor a devolver.
2. Mover `A[n]` a `A[1]`; achicar el montículo (`n ← n - 1`).
3. Si el montículo no quedó vacío, llamar `Max-Heapify(A, 1, n)`.
4. Devolver el valor guardado.

## Pseudocódigo

```
Extract-Min(A, n)
si n = 0 entonces error "montículo vacío" ;
max ← A[1] ;
A[1] ← A[n] ;
n ← n - 1 ;
si n > 0 entonces Max-Heapify(A, 1, n) ;
devolver max
```

## C++

Ver `step-5-find-extract-min.cpp` y `full-implementation.cpp` en el editor
de arriba.

## Complejidad temporal

`Θ(lg n)`, tal como aparece en la tabla comparativa. Se deriva directo de
Max-Heapify: mover el último elemento a la raíz es O(1), y restaurar el
invariante con Max-Heapify cuesta O(lg n) por el mismo argumento de altura
(un único camino raíz-hoja).

## Complejidad espacial

O(1) adicional, más la pila de Max-Heapify si se usa su versión recursiva.

## Ejemplo

Derivado: sobre `A = [14, 8, 10, 4, 2, 9, 3]`, `Extract-Min` guarda `14`,
mueve el último elemento (`3`) a la raíz: `[3, 8, 10, 4, 2, 9]`, y llama
Max-Heapify(A,1,6): `3` contra hijos `8` y `10`, el mayor es `10`, se
intercambia; en la posición 3, `3` no tiene hijos (n=6), termina.
Resultado: `[10, 8, 3, 4, 2, 9]`.

## Casos límite

- **Montículo vacío**: no hay raíz que extraer; la implementación de
  referencia lanza una excepción.
- **Un solo elemento**: se retira ese elemento y el montículo queda vacío;
  no hace falta llamar Max-Heapify (guarda explícita `n > 0`).
- **Los dos elementos restantes empatados**: la comparación estricta de
  Max-Heapify no genera un intercambio innecesario.
