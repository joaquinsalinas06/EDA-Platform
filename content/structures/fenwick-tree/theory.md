---
kind: theory
title: Fenwick tree
---

> **Concepto de apoyo, no material del curso.** El profesor lo nombra una
> sola vez, sin explicarlo: "usando un Segment tree o un Fenwick tree se
> puede resolver este caso especial en O(n lg n)"
> (`content/analysis/week-04-sem4-planar-point-location.md`, mención #38,
> caso simple del barrido de segmentos). `sourceSlides` está vacío en el
> knowledge map. Esta página es sólo lo necesario para entender esa mención
> al lado del [segment tree](/structures/segment-tree), no un tutorial
> completo de Fenwick trees. Todo lo que sigue es derivación estándar.

## ¿Qué problema resuelve?

Mantener un arreglo bajo `update` (sumar un valor a una posición) y
`prefix-query` (suma de `A[1..i]`) en O(lg n) ambas — el mismo problema que
resuelve el segment tree, pero restringido a sumas (o cualquier operación
invertible), a cambio de un arreglo auxiliar de tamaño `n` en vez de un
árbol de `2n-1` nodos.

Es exactamente lo que el caso simple del barrido de segmentos necesita
(#34-38): contar cuántas posiciones activas hay en un rango del sweep line
es una suma de indicadores 0/1, nada más.

## Intuición

Cada índice `i` no guarda un solo elemento: guarda la suma de un rango que
termina en `i`, cuyo tamaño lo determina el bit menos significativo de `i`
(`i & (-i)`, el "lowbit"). Ese truco es todo el mecanismo:

- `i & (-i)` aísla el bit `1` más bajo de `i` en binario.
- El rango que cubre el índice `i` tiene exactamente ese tamaño:
  `(i - lowbit(i), i]`.

Para `n = 8`:

```
i    binario   lowbit   rango que cubre
1    0001        1      (0,1]
2    0010        2      (0,2]
3    0011        1      (2,3]
4    0100        4      (0,4]
5    0101        1      (4,5]
6    0110        2      (4,6]
7    0111        1      (6,7]
8    1000        8      (0,8]
```

Como diagrama de barras (cada `#` es una posición cubierta):

```
i=1 #
i=2 ##
i=3   #
i=4 ####
i=5     #
i=6    ##
i=7      #
i=8 ########
```

`update(i)` sólo necesita tocar los índices que **incluyen** a `i` en su
rango — se llega a ellos subiendo con `i += lowbit(i)`. `prefix-query(i)`
necesita sumar los rangos que **cubren** `[1,i]` sin traslape — se llega a
ellos bajando con `i -= lowbit(i)`. Son la misma familia de saltos, en
direcciones opuestas.

## Estructura interna

Un arreglo `tree[1..n]` donde `tree[i] = suma(A[i - lowbit(i) + 1 .. i])`.
No hay nodos ni punteros: el árbol implícito en el nombre "Fenwick tree" está
codificado enteramente en la aritmética de bits sobre el índice.

## Operaciones

- [Update](/structures/fenwick-tree/operations/update) — suma un valor a la
  posición `i` y propaga el cambio a todos los índices cuyo rango la cubre.
- [Prefix query](/structures/fenwick-tree/operations/prefix-query) — suma
  `A[1..i]` combinando O(lg n) rangos ya precomputados.

## Análisis de complejidad

No hay estilo del profesor que seguir (no hay diapositivas). El argumento
estándar: tanto `i += lowbit(i)` como `i -= lowbit(i)` cambian el patrón de
bits de `i` de forma monótona (el primero apaga y sube al menos un bit; el
segundo apaga un bit) — con `lg n` bits en total, ninguno de los dos puede
repetirse más de `lg n` veces antes de salir del rango `[1,n]` o llegar a 0.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`; se omite `source` en cada entrada
porque no hay diapositiva que citar.

## Ejemplos

Ver [Ejemplos](/structures/fenwick-tree/examples).

## Comparación con estructuras relacionadas

| | Update | Prefix-query | Memoria | Restricción |
| --- | --- | --- | --- | --- |
| [Segment tree](/structures/segment-tree) | O(lg n) | O(lg n) | O(n) (≈2n-1 nodos) | ninguna: cualquier función asociativa (suma, mínimo, máximo) |
| Fenwick tree | O(lg n) | O(lg n) | O(n) (un arreglo) | sólo funciones **invertibles** (suma, XOR) |

Esto es exactamente por qué el profesor ofrece los dos como alternativas
para el caso simple del barrido (#38) y no en el caso general: ahí sólo se
necesita contar (sumar indicadores), así que el Fenwick tree alcanza con
menos código y menos memoria. Si la operación necesaria fuera mínimo o
máximo — como pasaría en otra variante del problema — el Fenwick tree no
serviría (no invertible: no hay forma de "restar" un mínimo) y el segment
tree sería la única opción de las dos.

## Prueba de dominio

Ver [Prueba de dominio](/structures/fenwick-tree/mastery-check).
