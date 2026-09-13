---
kind: theory
title: Montículo Binario
---

## ¿Qué problema resuelve?

El material no plantea un problema motivador explícito para el montículo
binario: lo introduce directamente como definición ("un arreglo que
representa un árbol binario casi completo"). Su utilidad como estructura de
datos aparece implícita en la tabla comparativa de colas de prioridad
(insert, find-min, extract-min, union, decrease-key, delete) y se hace
explícita recién en el resumen: "el montículo binario es simple y Θ(n) para
construir, pero Θ(n) para Union" — la debilidad que motiva pasar al
montículo binomial.

## Intuición

Un árbol binario casi completo (todos los niveles llenos salvo quizás el
último, que se llena de izquierda a derecha) guardado sin punteros: cada
posición del arreglo *es* un nodo, y su posición numérica determina quiénes
son su padre y sus hijos. El invariante de montículo **máximo** dice que
cada nodo es mayor o igual que sus hijos — así la raíz siempre tiene el
elemento más grande, sin tener que buscarlo.

## Estructura interna

Arreglo `A[1..n]` (1-indexado, como lo define el profesor con las fórmulas
de índice). Para una posición `i`:

- padre: `⌊i/2⌋`
- hijo izquierdo: `2i`
- hijo derecho: `2i + 1`

Invariante de montículo máximo: para todo nodo `i` con padre, `A[⌊i/2⌋] ≥ A[i]`.
Está formulado como comparación local padre-hijo (no un orden total del
arreglo) porque es lo único que Max-Heapify necesita revisar y restaurar en
cada paso — de esa localidad sale que la reparación cueste sólo O(altura) y
no O(n).

## Operaciones

- [Max-Heapify](/structures/binary-heap/operations/max-heapify) — hunde un
  elemento hasta restaurar el invariante en su subárbol.
- [Build-Max-Heap](/structures/binary-heap/operations/build-max-heap) —
  convierte un arreglo arbitrario en montículo máximo.
- [Insert](/structures/binary-heap/operations/insert) — agrega un elemento
  y lo sube hasta su lugar.
- [Find-Min](/structures/binary-heap/operations/find-min) — lee el extremo
  del montículo (ver nota de apoyo abajo sobre el nombre).
- [Extract-Min](/structures/binary-heap/operations/extract-min) — retira el
  extremo y restaura el invariante.
- [Union](/structures/binary-heap/operations/union) — combina dos
  montículos en uno.
- [Decrease-Key](/structures/binary-heap/operations/decrease-key) — cambia
  la prioridad de un elemento ya insertado.
- [Delete](/structures/binary-heap/operations/delete) — retira un elemento
  arbitrario del montículo.

## Análisis de complejidad

El profesor usa dos estilos distintos, ambos **recurrence-based por conteo
de niveles**, nunca amortizado ni potencial (esos aparecen recién con el
montículo binomial y de Fibonacci):

- **Max-Heapify**: no plantea la recurrencia `T(n) = T(2n/3) + O(1)` con
  teorema maestro. Razona directo por altura del camino: "O(1) de trabajo
  por nivel, y a lo más O(lg n) niveles: T(n) = O(lg n)".
- **Build-Max-Heap**: suma el costo real nivel por nivel usando el lema de
  que a lo más `⌈n/2^(h+1)⌉` nodos están a altura `h`:
  `T(n) ≤ Σ_{h=0}^{⌊lg n⌋} ⌈n/2^(h+1)⌉ · O(h) = O(n · Σ h/2^h)`, y cierra
  porque esa serie geométrica derivada converge a 2. Es análisis agregado
  por sumatoria — de ahí sale la cota **ajustada** Θ(n), en vez de la cota
  ingenua O(n lg n) de llamar Max-Heapify n/2 veces sin este argumento.

> **Nota de apoyo** (no está en las diapositivas): el profesor enseña el
> montículo binario como **máximo**, pero la tabla comparativa de la
> diapositiva 19 nombra las operaciones de cola de prioridad en su forma
> de **mínimo** (find-min, extract-min, decrease-key) — convención genérica
> que usa para comparar contra el montículo binomial y el de Fibonacci
> (que sí enseña como min-heap). En este montículo *máximo*, esos nombres
> se leen con la raíz jugando el papel del extremo: "find-min" devuelve la
> raíz (el máximo), "extract-min" la retira, y "decrease-key" es en
> realidad *aumentar* una llave y subirla (porque en un max-heap moverse
> hacia la raíz significa hacerse más grande, no más chico). La simetría es
> exacta: todo lo dicho aquí para "máximo" vale para "mínimo" invirtiendo
> el comparador (`≥` por `≤`).

Insert, find-min, extract-min, union, decrease-key y delete **sólo
aparecen como filas de esa tabla**: el profesor no da pseudocódigo ni
análisis propio de ninguna para el binario. Sus páginas de operaciones se
derivan del mismo argumento de altura (sift-up/sift-down recorren a lo más
`⌊lg n⌋` niveles) — marcado como derivado en cada operación.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. El profesor nunca distingue
mejor/promedio/peor ni menciona espacio en este mazo: sólo da una cota por
operación (peor caso), y eso es lo único que aparece.

## Ejemplos

Ver [Ejemplos](/structures/binary-heap/examples). Sólo el de Max-Heapify
(`[4, 14, 10, 8, 2, 9, 3]`) está en las diapositivas; el resto se deriva.

## Comparación con estructuras relacionadas

| | Insert | Find-min | Extract-min | Union | Decrease-key | Delete |
| --- | --- | --- | --- | --- | --- | --- |
| Montículo binario | Θ(lg n) | Θ(1) | Θ(lg n) | Θ(n) | Θ(lg n) | Θ(lg n) |

El profesor sólo da esta fila para el binario en la tabla comparativa
(diapositiva 19); las filas de binomial y Fibonacci se explican en sus
propias estructuras. La razón declarada para pasar al montículo binomial es
que este "arregla Union (O(lg n))".

## Prueba de dominio

Ver [Prueba de dominio](/structures/binary-heap/mastery-check).
