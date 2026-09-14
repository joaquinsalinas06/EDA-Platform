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
        posición 4: Update(v1, l=1, r=4, pos=4).
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
        En la raíz, m=2 y pos=4 > m: se desciende por el hijo derecho
        [3,4]. El hijo izquierdo [1,2] — con sus dos hojas [1,1] y [2,2],
        tres nodos en total — queda fuera del camino desde este mismo
        instante: nunca se visita, y por eso se podrá compartir entero.
      highlight: ["v1-root", "v1-34"]
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v1-root, state: muted }
        - { id: v1-34, value: "[3,4]", parent: v1-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12, state: muted }
        - { id: v1-22, value: "[2,2]", parent: v1-12, state: muted }
        - { id: v1-33, value: "[3,3]", parent: v1-34 }
        - { id: v1-44, value: "[4,4]", parent: v1-34 }
    - note: >-
        En [3,4], m=3 y pos=4 > m: se desciende por el hijo derecho
        [4,4]. [3,3] queda descartado del camino igual que [1,2] arriba,
        pero es un único nodo (una hoja), no un subárbol: la diferencia
        de tamaño entre lo que se comparte aquí y lo que se comparte en
        la raíz es justo lo que hay que notar.
      highlight: ["v1-34", "v1-44"]
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v1-root, state: muted }
        - { id: v1-34, value: "[3,4]", parent: v1-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12, state: muted }
        - { id: v1-22, value: "[2,2]", parent: v1-12, state: muted }
        - { id: v1-33, value: "[3,3]", parent: v1-34, state: muted }
        - { id: v1-44, value: "[4,4]", parent: v1-34 }
    - note: >-
        Caso base en [4,4]: l=r=4, se llegó a la hoja del camino. El
        camino completo que se recorrió al bajar fue raíz → [3,4] → [4,4]:
        tres nodos, uno por nivel — eso es todo lo que este Update va a
        copiar.
      highlight: ["v1-44"]
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null }
        - { id: v1-12, value: "[1,2]", parent: v1-root, state: muted }
        - { id: v1-34, value: "[3,4]", parent: v1-root }
        - { id: v1-11, value: "[1,1]", parent: v1-12, state: muted }
        - { id: v1-22, value: "[2,2]", parent: v1-12, state: muted }
        - { id: v1-33, value: "[3,3]", parent: v1-34, state: muted }
        - { id: v1-44, value: "[4,4]", parent: v1-34, state: active }
    - note: >-
        Se crea el nodo nuevo [4,4]', copia de [4,4] con el valor
        actualizado. El [4,4] de v1 no se toca — sigue colgado de [3,4] en
        el panel de v1, consultable como siempre.
      highlight: ["v2-44"]
      versions:
        - { id: v1, label: v1 }
        - { id: v2, label: v2 }
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null, version: v1 }
        - { id: v1-12, value: "[1,2]", parent: v1-root, version: v1 }
        - { id: v1-34, value: "[3,4]", parent: v1-root, version: v1 }
        - { id: v1-11, value: "[1,1]", parent: v1-12, version: v1 }
        - { id: v1-22, value: "[2,2]", parent: v1-12, version: v1 }
        - { id: v1-33, value: "[3,3]", parent: v1-34, version: v1 }
        - { id: v1-44, value: "[4,4]", parent: v1-34, version: v1 }
        - { id: v2-44, value: "[4,4]'", parent: null, version: v2 }
    - note: >-
        Al volver de la recursión en [3,4]: se copia como [3,4]'. Su hijo
        izquierdo apunta al [3,3] de v1 tal cual — un solo nodo compartido,
        marcado `shared` — y su hijo derecho apunta al [4,4]' nuevo.
      highlight: ["v2-34"]
      versions:
        - { id: v1, label: v1 }
        - { id: v2, label: v2 }
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null, version: v1 }
        - { id: v1-12, value: "[1,2]", parent: v1-root, version: v1 }
        - { id: v1-34, value: "[3,4]", parent: v1-root, version: v1 }
        - { id: v1-11, value: "[1,1]", parent: v1-12, version: v1 }
        - { id: v1-22, value: "[2,2]", parent: v1-12, version: v1 }
        - { id: v1-33, value: "[3,3]", parent: v1-34, version: v1, state: shared }
        - { id: v1-44, value: "[4,4]", parent: v1-34, version: v1 }
        - { id: v2-34, value: "[3,4]'", parent: null, version: v2 }
        - { id: v2-44, value: "[4,4]'", parent: v2-34, version: v2 }
      links:
        - { from: v1-root, to: v1-12, kind: tree }
        - { from: v1-root, to: v1-34, kind: tree }
        - { from: v1-12, to: v1-11, kind: tree }
        - { from: v1-12, to: v1-22, kind: tree }
        - { from: v1-34, to: v1-33, kind: tree }
        - { from: v1-34, to: v1-44, kind: tree }
        - { from: v2-34, to: v2-44, kind: tree }
        - { from: v2-34, to: v1-33, kind: shared }
    - note: >-
        Al volver a la raíz: se copia como [1,4]'. Su hijo derecho apunta
        al [3,4]' nuevo; su hijo izquierdo apunta al [1,2] de v1
        **completo** — no a una hoja suelta, sino a la raíz de un
        subárbol de tres nodos ([1,2], [1,1], [2,2]) que se comparte
        entero, tal cual, con sus dos hijos incluidos.
      highlight: ["v2-root"]
      versions:
        - { id: v1, label: v1 }
        - { id: v2, label: v2 }
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null, version: v1 }
        - { id: v1-12, value: "[1,2]", parent: v1-root, version: v1, state: shared }
        - { id: v1-34, value: "[3,4]", parent: v1-root, version: v1 }
        - { id: v1-11, value: "[1,1]", parent: v1-12, version: v1, state: shared }
        - { id: v1-22, value: "[2,2]", parent: v1-12, version: v1, state: shared }
        - { id: v1-33, value: "[3,3]", parent: v1-34, version: v1 }
        - { id: v1-44, value: "[4,4]", parent: v1-34, version: v1 }
        - { id: v2-root, value: "[1,4]'", parent: null, version: v2 }
        - { id: v2-34, value: "[3,4]'", parent: v2-root, version: v2 }
        - { id: v2-44, value: "[4,4]'", parent: v2-34, version: v2 }
      links:
        - { from: v1-root, to: v1-12, kind: tree }
        - { from: v1-root, to: v1-34, kind: tree }
        - { from: v1-12, to: v1-11, kind: tree }
        - { from: v1-12, to: v1-22, kind: tree }
        - { from: v1-34, to: v1-33, kind: tree }
        - { from: v1-34, to: v1-44, kind: tree }
        - { from: v2-root, to: v2-34, kind: tree }
        - { from: v2-34, to: v2-44, kind: tree }
        - { from: v2-root, to: v1-12, kind: shared }
        - { from: v2-34, to: v1-33, kind: shared }
    - note: >-
        Estado final: sólo tres nodos son nuevos (raíz', [3,4]', [4,4]'),
        marcados `answer` — el camino que Update realmente copió. Todo lo
        demás — el subárbol [1,2]/[1,1]/[2,2] completo y la hoja [3,3] —
        se comparte con v1 sin duplicarse, y v1 sigue intacta y
        consultable por su propia raíz.
      highlight: ["v2-root", "v2-34", "v2-44"]
      versions:
        - { id: v1, label: v1 }
        - { id: v2, label: v2 }
      nodes:
        - { id: v1-root, value: "[1,4]", parent: null, version: v1 }
        - { id: v1-12, value: "[1,2]", parent: v1-root, version: v1, state: shared }
        - { id: v1-34, value: "[3,4]", parent: v1-root, version: v1 }
        - { id: v1-11, value: "[1,1]", parent: v1-12, version: v1, state: shared }
        - { id: v1-22, value: "[2,2]", parent: v1-12, version: v1, state: shared }
        - { id: v1-33, value: "[3,3]", parent: v1-34, version: v1, state: shared }
        - { id: v1-44, value: "[4,4]", parent: v1-34, version: v1 }
        - { id: v2-root, value: "[1,4]'", parent: null, version: v2, state: answer }
        - { id: v2-34, value: "[3,4]'", parent: v2-root, version: v2, state: answer }
        - { id: v2-44, value: "[4,4]'", parent: v2-34, version: v2, state: answer }
      links:
        - { from: v1-root, to: v1-12, kind: tree }
        - { from: v1-root, to: v1-34, kind: tree }
        - { from: v1-12, to: v1-11, kind: tree }
        - { from: v1-12, to: v1-22, kind: tree }
        - { from: v1-34, to: v1-33, kind: tree }
        - { from: v1-34, to: v1-44, kind: tree }
        - { from: v2-root, to: v2-34, kind: tree }
        - { from: v2-34, to: v2-44, kind: tree }
        - { from: v2-root, to: v1-12, kind: shared }
        - { from: v2-34, to: v1-33, kind: shared }
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
3. Si no: calcular $m = \lfloor (l+r)/2 \rfloor$.
   - Si $pos \le m$: `nuevo.izq ← Update(nodo.izq, l, m, pos, val)`; el hijo
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

$O(\lg n)$ por conteo directo del camino: Update copia exactamente un nodo
por nivel, y la altura del segment tree es $O(\lg n)$. No hay recurrencia que
resolver más allá de esa cuenta: es literal, un nodo por nivel.

## Complejidad espacial

$O(\lg n)$ de espacio nuevo por operación: los mismos nodos que se copiaron
en tiempo son los que ocupan memoria nueva. Todo el resto del árbol —
potencialmente $O(n)$ nodos — se reutiliza vía punteros compartidos, sin
duplicarse.

## Ejemplo

El del profesor (página 57): segment tree de 4 hojas, rangos `[1,4]`,
`[1,2]`, `[3,4]`, `[1,1]`, `[2,2]`, `[3,3]`, `[4,4]`. Al actualizar la
posición 4, se copian raíz, `[3,4]` y `[4,4]`; `[1,2]`, `[1,1]`, `[2,2]`,
`[3,3]` se comparten con la versión anterior sin tocarlos. Ver el bloque
de visualización arriba para el paso a paso completo (descenso, copia del
camino, compartición del resto).

## Casos límite

- **$n = 1$ (segment tree de una sola hoja)**: el camino tiene largo 1;
  Update se reduce al mismo caso degenerado que
  [Push del stack](/structures/path-copying/operations/stack-push): un
  solo nodo copiado.
- **Actualizar la misma posición dos veces**: cada llamada genera una
  versión nueva independiente; la primera actualización no se pierde,
  sigue siendo la versión intermedia consultable por su propia raíz.
- **Actualizar sobre una versión vieja, no la más reciente**: el algoritmo
  no lo impide — genera una rama de versiones distinta a partir de esa
  raíz vieja.
