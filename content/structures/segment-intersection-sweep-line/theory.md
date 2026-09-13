---
kind: theory
title: "Intersección de segmentos con barrido"
---

## ¿Qué problema resuelve?

Es el paso que conecta [vertical-ray-shooting](/structures/vertical-ray-shooting)
con una consulta que sí se puede resolver: "Dados n segmentos, determinar si
algún par de ellos se intersectan en un punto" (#25). La técnica es **sweep
line**: "una recta vertical barriendo de menor a mayor x e interactuando con
los objetos con los que se intersecte" (#27).

> **Nota de apoyo** (no está en las diapositivas): el material titula esta
> sección "Reducción a intersección de segmentos" para resolver
> vertical-ray-shooting, pero el problema que plantea en #25 es *detectar*
> intersecciones entre segmentos, no *encontrar el primer segmento sobre un
> punto* que pide vertical-ray-shooting. La conexión entre ambos aparece
> recién en #50 (`Query(t_{x_i}, Successor(y_i))`) y el paso "segmento →
> cara" que necesitaría PPL no se explica en el material — queda como hueco
> (ver Casos límite y `crossing-order`).

## Intuición

Una recta vertical barre el plano de izquierda a derecha. Cada segmento
horizontal se **activa** justo antes de que el barrido llegue a su extremo
izquierdo y se **desactiva** justo después de pasar su extremo derecho — "un
segmento horizontal (con x1 ≤ x2) se activa antes de procesar el punto x1 y
se desactiva después de procesar el punto x2" (#34). Mientras un segmento
horizontal está activo, "aporta con 1 punto de intersección" (#34-35) a
cualquier segmento vertical que lo cruce en ese instante. Contar cruces se
vuelve entonces contar cuántos segmentos horizontales están activos dentro
del rango vertical que cubre el segmento vertical de turno.

Diagrama del barrido en el caso simple (ejemplo derivado del pseudocódigo;
no aparece en las diapositivas — el material no trae pseudocódigo ni
ejemplo numérico, #34-38 es prosa pura):

```
y
5 |        ┄┄┄┄┄┄┄┄●  H2 [x=4..7, y=5]
4 |
3 |   ●┄┄┄┄┄┄┄┄●          H1 [x=1..6, y=3]
2 |        │
1 |        │  V1 [x=4, y=0..5]
0 +---│----│----│----│----│----│----│---- x
  0   1    2    3    4    5    6    7

barrido en x=4: H1 activo (1..6), H2 activo (4..7) → V1 cruza ambos → 2
```

## Estructura interna

No es una estructura nueva: es una **reducción** que delega el estado del
barrido en una estructura ya cubierta.

- **Caso simple** (#28-38): segmentos verticales u horizontales, sin
  intersecciones entre segmentos de la misma orientación (#29). El estado
  activo/inactivo de cada posición y horizontal se guarda en un
  [segment-tree](/structures/segment-tree) o un
  [fenwick-tree](/structures/fenwick-tree) (andamio, sin explicar en el
  deck): activar/desactivar es una actualización puntual, y contar cruces
  de un segmento vertical es una consulta de rango (RSQ, #32) sobre ese
  rango de posiciones y.
- **Caso general** (#40-51): "si los segmentos pueden ser arbitrarios, no es
  posible usar la idea anterior así como está" (#41) — ya no basta con
  activo/inactivo, porque el orden vertical de los segmentos que cruzan la
  recta de barrido cambia con x. El estado pasa a ser una
  [balanced-bst](/structures/balanced-bst) que ordena los cruces con la
  recta vertical (#43); el comparador de esa BBST depende de x, la sutileza
  técnica que el material da por hecha.
- **Consulta online** (#49-51): aplicar [path-copying](/structures/path-copying)
  sobre esa BBST convierte cada evento del barrido en una versión
  persistente, así que una consulta a un instante `x_i` ya pasado no
  necesita rehacer el barrido — sólo consulta la versión correspondiente.

## Operaciones

- [Activación / desactivación de segmentos horizontales](/structures/segment-intersection-sweep-line/operations/segment-activation)
- [Conteo de intersecciones de un segmento vertical](/structures/segment-intersection-sweep-line/operations/intersection-count)
- [Orden de cruces (caso general)](/structures/segment-intersection-sweep-line/operations/crossing-order)
- [Consulta online vía persistencia](/structures/segment-intersection-sweep-line/operations/persistent-online-query)

## Análisis de complejidad

Estilo del profesor: **reducción + herencia de cota**. En ningún punto de
#28-51 se plantea una recurrencia ni se amortiza nada — el costo de cada
variante se atribuye directamente a la estructura elegida para representar
el estado del barrido:

- Caso simple: "Usando un Segment tree o un Fenwick tree se puede resolver
  este caso especial en O(n log n)" (#38) — cita textual, el costo es el de
  n activaciones/desactivaciones/consultas sobre esa estructura, sin
  desglose adicional.
- Caso general offline: O((n+q) log n) total (#47) — n eventos y q consultas,
  cada uno O(log n) sobre la BBST de cruces (#43).
- Caso general online con persistencia: O(log n) por consulta (#51) — se
  hereda del costo de consultar una versión persistente de la BBST, el mismo
  argumento de [path-copying](/structures/path-copying).

## Tabla de complejidad

Ver `meta.yaml`. Todas las filas están marcadas `worst` únicamente: el
profesor no distingue mejor/promedio ni dio espacio para ninguna de estas
variantes.

## Ejemplos

Ver [examples.md](/structures/segment-intersection-sweep-line/examples).

## Comparación con estructuras relacionadas

| | caso simple | caso general offline | caso general online |
| --- | --- | --- | --- |
| estado del barrido | activo/inactivo por posición y | orden de cruces (BBST) | versión persistente de la BBST |
| estructura que hereda el costo | segment-tree o fenwick-tree | balanced-bst | balanced-bst + path-copying |
| costo total | O(n log n) (#38) | O((n+q) log n) (#47) | O(log n) por consulta (#51) |
| restricción | sin intersecciones de la misma orientación (#29) | ninguna | ninguna |

## Prueba de dominio

Ver [mastery-check.md](/structures/segment-intersection-sweep-line/mastery-check).
