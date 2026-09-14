---
kind: theory
title: Segment tree
---

> **Concepto de apoyo, no material del curso.** El profesor nunca explica el
> segment tree en ninguna diapositiva (`sourceSlides` está vacío en el
> knowledge map) — lo usa como pieza ya conocida en las semanas 3, 4 y 5. Esta
> página es el andamio mínimo para entender esos tres usos, no un tutorial
> general de segment trees. Todo lo que sigue es derivación estándar, no una
> cita del profesor.

## ¿Qué problema resuelve?

Mantener un arreglo `A[1..n]` bajo dos operaciones que compiten entre sí:
cambiar un valor (`update`) y combinar un rango de valores con una función
asociativa como suma, mínimo o máximo (`query`). Un arreglo plano hace una de
las dos en $O(1)$ y la otra en $O(n)$; el segment tree hace ambas en $O(\lg n)$.

Esto es exactamente lo que el curso necesita en tres sitios que **no**
enseñan el segment tree, sólo lo usan:

- **Persistencia (path copying)**: el segment tree es el ejemplo que usa el
  profesor para mostrar path copying, porque su `update` sólo toca un camino
  raíz-hoja — el mínimo posible para hacerlo persistente por copia.
- **Retroactividad (problemas de búsqueda descomponibles)**: se construye un
  segment tree **sobre el eje del tiempo** (cada hoja es un instante, no un
  valor de datos) para dar retroactividad completa con overhead $O(\lg m)$.
- **Barrido de segmentos (localización de puntos)**: se nombra, junto al
  Fenwick tree, como solución del caso simple (segmentos horizontales y
  verticales sin intersecciones de la misma orientación) en $O(n \lg n)$.

## Intuición

Un árbol binario donde cada nodo representa un rango `[l, r]` del arreglo: la
raíz representa todo `[1, n]`, cada nodo interno se parte en dos mitades
(hijo izquierdo `[l, m]`, hijo derecho `[m+1, r]`) y las hojas son los rangos
de un solo elemento `[i, i]`. Cada nodo guarda el resultado combinado de su
rango, así que la raíz siempre tiene la respuesta para todo el arreglo sin
tener que recorrerlo.

## Estructura interna

Cada nodo guarda:

- el rango `[l, r]` que representa (implícito por la posición del nodo, no
  necesita almacenarse si se pasa por parámetro),
- `valor`: el resultado de combinar `A[l..r]` con la función elegida (suma,
  mínimo, máximo — cualquier función asociativa),
- dos hijos (o ninguno, si es hoja).

Invariante: `valor(nodo) = combinar(valor(hijo_izq), valor(hijo_der))` para
todo nodo interno, y `valor(hoja_i) = A[i]`. Está formulado así — combinación
local de dos hijos, no recálculo global — porque es lo único que `update`
necesita rehacer en cada nodo del camino: $O(1)$ por nodo, no $O(n)$.

Para 4 hojas, el árbol que reutiliza `path-copying` y `decomposable-search-problem`:

```
            [1,4]
           /      \
       [1,2]      [3,4]
       /   \        /  \
   [1,1] [2,2]  [3,3] [4,4]
```

## Operaciones

- [Build](/structures/segment-tree/operations/build) — construye el árbol
  desde un arreglo inicial.
- [Update](/structures/segment-tree/operations/update) — cambia el valor de
  una posición y recalcula su camino hasta la raíz. Es la operación que
  `path-copying` reusa tal cual para hacerse persistente.
- [Query](/structures/segment-tree/operations/query) — combina un rango
  `[l, r]` arbitrario descomponiéndolo en nodos del árbol.

## Análisis de complejidad

No hay un estilo del profesor que seguir aquí (no hay diapositivas). El
razonamiento es el estándar de la literatura, por conteo estructural:

- **Build**: el árbol tiene exactamente $2n-1$ nodos ($n$ hojas, $n-1$ internos
  para un arreglo de tamaño $n$); construirlo visita cada nodo una vez, $O(1)$
  de trabajo por nodo → $O(n)$ total.
- **Update**: sólo el camino raíz-hoja de la posición modificada cambia — a lo
  más $\lceil \lg n \rceil$ nodos, uno por nivel — y cada uno se recalcula en
  $O(1)$ desde sus hijos → $O(\lg n)$.
- **Query**: un rango arbitrario se descompone en a lo más $O(\lg n)$ nodos
  "canónicos" (completamente dentro del rango); el argumento estándar es que
  en cada nivel de la recursión a lo más dos llamadas siguen siendo "parciales"
  (una por cada extremo del rango), el resto termina en $O(1)$ → $O(\lg n)$
  niveles × $O(1)$ por nivel.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. Aquí, a diferencia de las estructuras
que sí vienen del profesor, se omite `source` en cada entrada porque no hay
diapositiva que citar — el `reasoning` deja explícito que es derivación
estándar.

## Ejemplos

Ver [Ejemplos](/structures/segment-tree/examples).

## Comparación con estructuras relacionadas

| | Update | Query de rango |
| --- | --- | --- |
| Arreglo plano | $O(1)$ | $O(n)$ |
| Segment tree | $O(\lg n)$ | $O(\lg n)$ |
| Fenwick tree (usado en semana 4 como alternativa para el caso de suma/conteo) | $O(\lg n)$ | $O(\lg n)$ |

El Fenwick tree hace lo mismo con menos memoria pero sólo para funciones
invertibles (suma); el segment tree soporta cualquier función asociativa
(incluye mínimo y máximo), que es lo que necesita retroactividad para una
función de combinación general.

## Prueba de dominio

Ver [Prueba de dominio](/structures/segment-tree/mastery-check).
