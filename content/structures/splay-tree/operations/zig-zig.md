---
kind: operation
title: Zig-zig
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-rotate.cpp
  - step-3-zig-zig.cpp
  - full-implementation.cpp
visualization:
  type: tree
  steps:
    - note: >-
        Caso zig-zig: x, su padre p y su abuelo a están en línea, del
        MISMO lado (aquí, x hijo izquierdo de p, p hijo izquierdo de a).
        Antes de tocar nada: éste es el árbol de tres niveles que hay que
        reacomodar (#65). A, B, C, D son subárboles completos.
      highlight: [x, p, a]
      nodes:
        - { id: a, value: a, parent: null }
        - { id: p, value: p, parent: a }
        - { id: D, value: D, parent: a }
        - { id: x, value: x, parent: p }
        - { id: C, value: C, parent: p }
        - { id: A, value: A, parent: x }
        - { id: B, value: B, parent: x }
    - note: >-
        Primera rotación — se rota el par (p, a), NO el par (x, p): p sube
        a la posición de a, a baja a ser hijo derecho de p, y C (que era
        hijo derecho de p) pasa a ser hijo izquierdo de a. x no se toca
        todavía: sigue siendo hijo izquierdo de p. Éste es el paso que
        distingue zig-zig del "move-to-root" ingenuo, que rotaría (x, p)
        primero.
      highlight: [p, a]
      nodes:
        - { id: p, value: p, parent: null }
        - { id: x, value: x, parent: p }
        - { id: a, value: a, parent: p }
        - { id: A, value: A, parent: x }
        - { id: B, value: B, parent: x }
        - { id: C, value: C, parent: a }
        - { id: D, value: D, parent: a }
    - note: >-
        Segunda rotación: ahora sí se rota el par (x, p), igual que un Zig
        simple. x sube a la raíz, p baja a su hijo derecho, y B (hijo
        derecho de x) pasa a ser hijo izquierdo de p. Resultado final:
        idéntico al diagrama del profesor (#65) — x en la raíz, con p y a
        colgando en cascada del lado derecho, no del mismo lado que antes.
      highlight: [x, p]
      nodes:
        - { id: x, value: x, parent: null }
        - { id: A, value: A, parent: x }
        - { id: p, value: p, parent: x }
        - { id: B, value: B, parent: p }
        - { id: a, value: a, parent: p }
        - { id: C, value: C, parent: a }
        - { id: D, value: D, parent: a }
---

## Qué hace

Es uno de los tres casos de [`splay`](/structures/splay-tree/operations/splay):
x, su padre p y su abuelo a están alineados del mismo lado (x izquierdo de p,
p izquierdo de a — o el espejo, ambos derechos). Dos rotaciones dejan a x en
la raíz de ese subárbol de tres niveles.

## Intuición

Es el caso que decide si Splay consigue o no la cota amortizada de
O(log n). La tentación es "subir x un nivel, y luego otro" (rotar (x, p),
después rotar (x, a)) — eso es el algoritmo move-to-root ingenuo. Zig-zig
hace algo distinto: **rota primero el par (p, a)** — la arista que
involucra al abuelo — y sólo después rota (x, p). El destino final (x en la
raíz) es el mismo en ambos órdenes, pero la forma **intermedia** no lo es:
rotar (p, a) primero reparte el subárbol que compartían p y a de forma más
pareja entre los dos, en vez de dejar a uno de ellos casi tan profundo como
estaba. Esa forma intermedia es la que hace que el argumento de potencial de
la literatura (no dado por el profesor) cierre.

> **Nota de apoyo** (no está en las diapositivas): si en cambio se rotara
> (x, p) primero y luego (x, a) — subir a x un nivel a la vez — se obtiene
> el algoritmo "move-to-root", que **no** logra O(log n) amortizado: existen
> secuencias de búsquedas donde move-to-root cuesta Ω(n) por operación en
> promedio, mientras que zig-zig (rotando el abuelo primero) sí logra
> O(log n). El material no discute esta distinción explícitamente — el
> profesor sólo da el diagrama de la forma final (#65) — pero es la razón
> de fondo por la que el orden de las dos rotaciones importa.

## Algoritmo

1. Sean `x` hijo de `p`, `p` hijo de `a`, ambos del mismo lado (caso
   izquierdo-izquierdo mostrado arriba; derecho-derecho es simétrico).
2. Rotar el par `(p, a)`: `Rotate(p)` — p sube a la posición de a.
3. Rotar el par `(x, p)`: `Rotate(x)` — x sube a la posición de p (que ahora
   es la raíz del subárbol).
4. `x` queda como raíz de los tres niveles; `p` es su hijo, `a` es hijo de
   `p`.

## Pseudocódigo

```
Algoritmo: ZigZig(x)
p ← x.padre
a ← p.padre
// mismo lado: x es izquierdo de p, y p es izquierdo de a (o el espejo)
Rotate(p)          // rota el par (p, a) — el abuelo — PRIMERO
Rotate(x)          // rota el par (x, p) — ahora x llega a la raíz
```

## C++

Ver `step-3-zig-zig.cpp` y `full-implementation.cpp` en el editor de
arriba: `zigZig(x)` llama `rotate(p)` antes que `rotate(x)`, en ese orden
exacto — invertir el orden de esas dos líneas reproduce move-to-root.

## Complejidad temporal

O(1), costo real (no amortizado): dos rotaciones, cada una O(1) por el
modelo BST, sin importar el tamaño de A, B, C o D (#65). Lo amortizado
—O(log n)— es una propiedad de la secuencia completa de pasos que hace
[`splay`](/structures/splay-tree/operations/splay), no de este paso
aislado.

## Complejidad espacial

O(1) adicional.

## Ejemplo

Ver [examples.md](/structures/splay-tree/examples).

## Casos límite

- **Espejo (derecho-derecho)**: x hijo derecho de p, p hijo derecho de a —
  simétrico, mismo orden de rotaciones (rotar `(p, a)` primero). El deck
  sólo dibuja la orientación izquierda (#65); la derecha no está pero se
  deriva por simetría.
- **A, B, C o D vacíos**: cada rotación sigue siendo O(1); algún puntero
  queda en `null`.
- **`a` era la raíz del árbol completo**: tras zig-zig, `x` es la nueva
  raíz global.
