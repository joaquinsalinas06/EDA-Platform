---
kind: operation
title: Update (segment tree persistente)
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-stack-push.cpp
  - step-3-segment-tree-update.cpp
  - step-4-trie-insert.cpp
  - full-implementation.cpp
visualization:
  type: persistent
  steps:
    - note: >-
        Versión v1 del segment tree de 4 hojas: raíz [1,4], hijos [1,2] y
        [3,4], hojas [1,1], [2,2], [3,3], [4,4]. Se va a actualizar la
        posición 4.
      highlight: []
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v1-root }
        - { id: v1-34, value: "[3,4]", parent: v1-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12 }
        - { id: v1-22, value: "[2,2]", parent: v1-12 }
        - { id: v1-33, value: "[3,3]", parent: v1-34 }
        - { id: v1-44, value: "[4,4]", parent: v1-34 }
    - note: >-
        Update(v1, l=1, r=4, pos=4): en la raíz, m=2 y pos=4 > m, así que
        se desciende por el hijo derecho [3,4], no por [1,2].
      highlight: ["v1-root", "v1-34"]
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v1-root }
        - { id: v1-34, value: "[3,4]", parent: v1-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12 }
        - { id: v1-22, value: "[2,2]", parent: v1-12 }
        - { id: v1-33, value: "[3,3]", parent: v1-34 }
        - { id: v1-44, value: "[4,4]", parent: v1-34 }
    - note: >-
        En [3,4], m=3 y pos=4 > m: se desciende por el hijo derecho [4,4],
        no por [3,3]. [1,2] no participa de este descenso.
      highlight: ["v1-34", "v1-44"]
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v1-root }
        - { id: v1-34, value: "[3,4]", parent: v1-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12 }
        - { id: v1-22, value: "[2,2]", parent: v1-12 }
        - { id: v1-33, value: "[3,3]", parent: v1-34 }
        - { id: v1-44, value: "[4,4]", parent: v1-34 }
    - note: >-
        Caso base en [4,4]: l=r=4. Se crea un nodo nuevo, copia de [4,4],
        con el valor actualizado. El [4,4] de v1 no se toca.
      highlight: ["v2-44"]
      nodes:
        - { id: v1-44, value: "[4,4] (v1)", parent: v1-34 }
        - { id: v2-44, value: "[4,4]' (v2)", parent: null }
    - note: >-
        Al volver de la recursión, [3,4]' se copia: su hijo izquierdo
        apunta al [3,3] de v1 tal cual (compartido, sin copiar), y su hijo
        derecho apunta al [4,4]' nuevo.
      highlight: ["v2-34"]
      nodes:
        - { id: v2-34, value: "[3,4]'", parent: null }
        - { id: v1-33, value: "[3,3]", parent: v2-34 }
        - { id: v2-44, value: "[4,4]'", parent: v2-34 }
    - note: >-
        Al volver a la raíz, [1,4]' se copia: su hijo izquierdo apunta al
        [1,2] de v1 completo (con sus hojas [1,1] y [2,2], compartido sin
        tocar), y su hijo derecho apunta al [3,4]' nuevo. Solo los tres
        nodos del camino (raíz, [3,4], [4,4]) se copiaron; [1,2], [1,1],
        [2,2], [3,3] se comparten con v1 sin tocarlos, y v1 sigue completa
        y consultable por su propia raíz.
      highlight: ["v2-root", "v2-34", "v2-44"]
      nodes:
        - { id: v2-root, value: "[1,4]'", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v2-root }
        - { id: v2-34, value: "[3,4]'", parent: v2-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12 }
        - { id: v1-22, value: "[2,2]", parent: v1-12 }
        - { id: v1-33, value: "[3,3]", parent: v2-34 }
        - { id: v2-44, value: "[4,4]'", parent: v2-34 }
---

## Qué hace

Actualiza la posición `pos` de un [segment tree](/structures/segment-tree)
persistente con el valor `val`, devolviendo el puntero a la raíz de una
**nueva** versión. La versión vieja (accesible por su propia raíz) queda
intacta.

## Intuición

El diagrama del profesor (segment tree de 4 hojas) es el ejemplo central
del tema: al actualizar la posición 4, sólo se copian los nodos en el
camino raíz → [3,4] → [4,4]; todo lo demás — [1,2] y sus hojas [1,1],
[2,2], y también [3,3] — se comparte con la versión anterior sin tocarlo.
Como cualquier descenso en un segment tree, en cada nivel sólo uno de los
dos hijos está en el camino hacia `pos`; el otro es exactamente el
subárbol que se puede compartir intacto.

Este resultado tiene nombre propio: es la estructura conocida como
*persistent segment tree*.

## Algoritmo

1. Copiar `nodo` en `nuevo`.
2. Si `l = r` (hoja, caso base): `nuevo.valor ← val`.
3. Si no: calcular `m = ⌊(l+r)/2⌋`.
   - Si `pos ≤ m`: `nuevo.izq ← Update(nodo.izq, l, m, pos, val)`; el hijo
     derecho, `nuevo.der`, se deja apuntando al mismo subárbol que ya
     tenía `nodo` (compartido, no se copia).
   - Si no: `nuevo.der ← Update(nodo.der, m+1, r, pos, val)`; el hijo
     izquierdo se comparte sin copiar.
   - `nuevo.valor ← combinar(nuevo.izq.valor, nuevo.der.valor)`.
4. Devolver `nuevo`.

## Pseudocódigo

```
Algoritmo 3: Update(nodo, l, r, pos, val)
nuevo ← copia de nodo ;
si l = r entonces
     nuevo.valor ← val ;
en otro caso
     m ← ⌊(l + r)/2⌋ ;
     si pos ≤ m entonces
         nuevo.izq ← Update(nodo.izq, l, m, pos, val) ;
     en otro caso
         nuevo.der ← Update(nodo.der, m+1, r, pos, val) ;
     nuevo.valor ← combinar(nuevo.izq.valor, nuevo.der.valor) ;
devolver nuevo ;
```

`combinar` es la misma función de combinación del
[segment tree](/structures/segment-tree) efímero: no se redefine aquí.

## C++

Ver `step-3-segment-tree-update.cpp` y `full-implementation.cpp` en el
editor de arriba.

## Complejidad temporal

`O(lg n)` por conteo directo del camino: Update copia exactamente un nodo
por nivel, y la altura del segment tree es O(lg n). No hay recurrencia que
resolver más allá de esa cuenta: es literal, un nodo por nivel.

## Complejidad espacial

`O(lg n)` de espacio nuevo por operación: los mismos nodos que se copiaron
en tiempo son los que ocupan memoria nueva. Todo el resto del árbol —
potencialmente `O(n)` nodos — se reutiliza vía punteros compartidos, sin
duplicarse.

## Ejemplo

El del profesor (página 57): segment tree de 4 hojas, rangos `[1,4]`,
`[1,2]`, `[3,4]`, `[1,1]`, `[2,2]`, `[3,3]`, `[4,4]`. Al actualizar la
posición 4, se copian raíz, `[3,4]` y `[4,4]`; `[1,2]`, `[1,1]`, `[2,2]`,
`[3,3]` se comparten con la versión anterior sin tocarlos. Ver el bloque
de visualización arriba para el paso a paso completo (descenso, copia del
camino, compartición del resto).

## Casos límite

- **`n = 1` (segment tree de una sola hoja)**: el camino tiene largo 1;
  Update se reduce al mismo caso degenerado que
  [Push del stack](/structures/path-copying/operations/stack-push): un
  solo nodo copiado.
- **Actualizar la misma posición dos veces**: cada llamada genera una
  versión nueva independiente; la primera actualización no se pierde,
  sigue siendo la versión intermedia consultable por su propia raíz.
- **Actualizar sobre una versión vieja, no la más reciente**: el algoritmo
  no lo impide — genera una rama de versiones distinta a partir de esa
  raíz vieja.
