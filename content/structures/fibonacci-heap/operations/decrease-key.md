---
kind: operation
title: Decrease-Key
order: 5
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-insert-union.cpp
  - step-4-cut-cascading.cpp
  - step-5-decrease-key.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - note: >-
        Estado inicial *(derivado del pseudocódigo; no aparece así en las
        diapositivas)*: `g(5)` es raíz y actual `min(H)`, `p(10)` es su
        hijo y ya está marcado (perdió un hijo antes), `y(15)` es hijo de
        `p`. Se va a llamar Decrease-Key(H, y, 2).
      highlight: ["y"]
      nodes:
        - { id: g, value: 5, parent: null }
        - { id: p, value: 10, parent: g, state: marked }
        - { id: y, value: 15, parent: p, state: active }
    - note: >-
        Paso 1: `llave(y) ← 2`. Ahora `llave(y)=2 < llave(p)=10`: se
        rompió el invariante de montículo mínimo entre `y` y su padre.
        A diferencia de un montículo binario, aquí NO se burbujea `y`
        hacia arriba intercambiando con `p` — eso costaría recorrer el
        árbol; en su lugar se va a cortar.
      highlight: ["y", "p"]
      nodes:
        - { id: g, value: 5, parent: null }
        - { id: p, value: 10, parent: g, state: marked }
        - { id: y, value: 2, parent: p, state: active }
    - note: >-
        Cut(H, y, p): `y` se separa de `p` y se agrega como raíz nueva,
        sin marca. grado(p) baja en 1. Este corte es O(1): sólo empalme
        de punteros, sin importar cuán abajo estuviera `y`.
      highlight: ["y", "p"]
      nodes:
        - { id: g, value: 5, parent: null }
        - { id: p, value: 10, parent: g, state: marked }
        - { id: y, value: 2, parent: null, state: active }
    - note: >-
        Cascading-Cut(H, p): como `p` YA estaba marcado, no basta con
        marcarlo de nuevo — perdió su segundo hijo (a `y`), así que se
        corta él mismo, y la cascada sube hacia su padre, `g`.
      highlight: ["p"]
      nodes:
        - { id: g, value: 5, parent: null }
        - { id: p, value: 10, parent: g, state: active }
        - { id: y, value: 2, parent: null }
    - note: >-
        Cut(H, p, g): `p` se separa de `g` y se agrega como raíz, sin
        marca. Cascading-Cut(H, g): `g` no tiene padre (es raíz), así que
        la cascada se detiene aquí sin marcarlo. `c=2` cortes reales en
        esta cascada.
      highlight: ["p", "g"]
      nodes:
        - { id: g, value: 5, parent: null, state: active }
        - { id: p, value: 10, parent: null }
        - { id: y, value: 2, parent: null }
    - note: >-
        Paso final del algoritmo: como `llave(y)=2 < llave(min(H))=5`,
        se actualiza `min(H) ← y`. Quedan tres raíces sueltas — `y(2)`,
        `p(10)`, `g(5)` — ninguna marcada, y el nuevo mínimo es `y`. El
        costo real fue `O(c)=O(2)`, pero el potencial cayó lo suficiente
        (dos nodos desmarcados) para que el amortizado siga siendo `O(1)`.
      highlight: ["y"]
      nodes:
        - { id: g, value: 5, parent: null }
        - { id: p, value: 10, parent: null }
        - { id: y, value: 2, parent: null, state: answer }
---

## Qué hace

Baja la llave de un nodo `x` a un valor `k`, y si eso rompe el invariante
de montículo mínimo con su padre, lo corta y dispara la regla de las
marcas hacia arriba.

## Intuición

Si `x` no tiene padre, o su nueva llave sigue siendo mayor o igual que la
de su padre, no hay nada más que hacer: el invariante local sigue válido.
Pero si `x` se vuelve menor que su padre, no se puede simplemente
"burbujear" hacia arriba como en un montículo binario — eso costaría
$O(\text{altura del árbol})$, que puede ser grande. En cambio, `x` se corta de
inmediato ([Cut](/structures/fibonacci-heap/operations/cut), $O(1)$) y se
convierte en su propia raíz; la regla de las marcas
([Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut))
se encarga de mantener acotado cuánto se puede desordenar el árbol del
padre por este corte.

## Algoritmo

1. `llave(x) ← k`.
2. `p ← padre(x)`.
3. Si `p ≠ nulo` y `llave(x) < llave(p)`: `Cut(H, x, p)` y
   `Cascading-Cut(H, p)`.
4. Si `llave(x) < llave(min(H))`: `min(H) ← x`.

## Pseudocódigo

```
Algoritmo 12: Decrease-Key(H, x, k)
llave(x) ← k ;
p ← padre(x) ;
si p ≠ nulo y llave(x) < llave(p) entonces
    Cut(H, x, p) ;
    Cascading-Cut(H, p) ;
si llave(x) < llave(min(H)) entonces
     min(H) ← x ;
```

## C++

Ver `step-5-decrease-key.cpp` y `full-implementation.cpp` en el editor de
arriba. La implementación rechaza explícitamente `k > llave(x)`: el
pseudocódigo del profesor asignaría la llave igual, rompiendo en silencio
el invariante de montículo mínimo (caso que el mazo no comenta).

## Complejidad temporal

Costo real $O(c)$ con $c$ el número de cortes en cascada disparados. Con
el potencial $\Phi(H) = t(H) + 2 \cdot m(H)$: cada uno de los $c$ cortes agrega un
árbol a la lista de raíces ($+1$ a $t(H)$) y desmarca a un nodo ($-2$ al
potencial, porque `Cut` siempre pone `marca ← falso`), salvo el último
nodo de la cadena, que sólo se marca sin cortarse ($+2$). El profesor
acota $\Delta\Phi \le 4 - c$, y el costo amortizado resulta
$\hat{c}_i = O(c) + (4 - c) = O(1)$: entre más cortes reales hace la operación,
más cae el potencial, y esa caída paga exactamente ese trabajo extra.

## Complejidad espacial

$O(c)$ de pila de recursión dentro de `Cascading-Cut` (o $O(1)$ con una
versión iterativa).

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Sobre el
mismo escenario `G → P → C` de la visualización de
[Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut), con
`P` ya marcado: `Decrease-Key(H, C, k)` con `k` menor que `llave(P)`
dispara `Cut(H, C, P)` y luego `Cascading-Cut(H, P)`, que al encontrar a
`P` ya marcado también lo corta y sube hasta `G`, deteniéndose ahí. Si
además `k < llave(min(H))`, el propio `C` se vuelve el nuevo mínimo.

## Casos límite

- **`x` ya es una raíz** (`p = nulo`): el paso 3 no aplica; sólo se
  actualiza la llave y, si corresponde, `min(H)`.
- **La nueva llave no rompe el invariante con el padre**
  (`llave(x) ≥ llave(p)`): no se corta nada; sólo cambia la llave.
- **$c = 0$ cortes** (el caso anterior): el costo real es $O(1)$, y el
  amortizado sigue siendo $O(1)$ — el análisis de potencial cubre ambos
  extremos con la misma fórmula.
- **`k > llave(x)`**: no está en el pseudocódigo del profesor, que lo
  asignaría igual y corrompería el invariante en silencio; esta
  implementación lo rechaza con una excepción en vez de eso.
