---
kind: examples
title: Ejemplos
---

<!--
Las cuatro aplicaciones son las que trae el mazo (páginas 34-42), en
términos de c, D(n) y t(H) — el profesor nunca instancia un montículo de
Fibonacci con llaves concretas, así que no hay números de nodo por nodo que
trazar; se traza la fórmula. El desarrollo completo de estas cuatro
operaciones (pseudocódigo, invariantes) vive en fibonacci-heap: aquí sólo se
usan como ilustración del mecanismo Φ → ΔΦ → ĉ.
-->

## Mínimo

**Insert** y **Union** (páginas 34-35): el caso donde `ΔΦ` casi no hace
trabajo.

- Insert agrega un árbol de un solo nodo a la lista de raíces: `cᵢ = O(1)`,
  `Δt = +1`, `Δm = 0` ⇒ `ΔΦ = +1`. Costo amortizado:
  `ĉᵢ = O(1) + 1 = O(1)`.
- Union concatena dos listas circulares de raíces: `cᵢ = O(1)`, no cambia ni
  el número de árboles ni el de nodos marcados ⇒ `ΔΦ = 0`. Costo amortizado:
  `ĉᵢ = O(1) + 0 = O(1)`.

En ambos casos el costo amortizado coincide con el costo real porque `ΔΦ` es
pequeño — no hay nada que "prepagar" todavía.

## Normal

**Decrease-Key** (páginas 36-38): el caso donde `ΔΦ` sí hace el trabajo
central del método — cancelar un término que crece sin cota.

Con `c` cortes totales (el corte de `x` respecto a su padre, más `c − 1`
cortes en cascada hacia arriba):

```
cᵢ = O(c)                                  ← cortar es O(1) cada uno, c cortes
Δt = +c                                    ← cada nodo cortado pasa a la lista de raíces
```

De los `c` nodos que quedan marcados o desmarcados:
- los primeros `c − 1` cortes desmarcan un nodo que **ya estaba marcado**
  (perdía la marca al cortarse): `−2` cada uno.
- el último corte puede dejar **recién marcado** al padre del último nodo
  cortado (si no era raíz): `+2`.

```
ΔΦ ≤ c + (−2(c − 1) + 2) = c − 2c + 2 + 2 = 4 − c
```

Sumando:

```
ĉᵢ = O(c) + (4 − c) = O(1)
```

El profesor lo subraya así: "¡El término `c` se cancela! No importa cuántos
cortes en cascada ocurran." Éste es el ejemplo que justifica todo el
mecanismo: sin `Φ`, `Decrease-Key` parecería costar `O(c)` en el peor caso de
una operación individual; con `Φ`, el costo amortizado es `O(1)` sin importar
qué tan largo sea el corte en cascada.

Caso límite dentro de este mismo ejemplo: `c = 1` (sin cascada, un solo
corte). La fórmula lo cubre sin distinguirlo — `ΔΦ ≤ 1 + (4 − 1) = 4 − 1 =
3`, `ĉᵢ = O(1) + 3 = O(1)` — pero el mazo no lo comenta explícitamente.

## Límite

**Extract-Min** (páginas 39-42): el caso donde el costo amortizado **no**
queda en `O(1)` — es el que efectivamente domina el costo de una secuencia de
operaciones y el que motiva la cota de grado `D(n) = O(lg n)` que el mazo
demuestra justo antes.

```
cᵢ = O(D(n) + t(H))       ← consolidar recorre hasta D(n)+1 posiciones y t(H) raíces
ΔΦ ≤ (D(n) + 1) − t(H)    ← tras consolidar quedan a lo más D(n)+1 árboles, y se
                             pierden los t(H) árboles que había antes
```

Sumando:

```
ĉᵢ = O(D(n) + t(H)) + (D(n) + 1 − t(H)) = O(D(n))
```

y con la cota de grado `D(n) = O(lg n)` (que depende de los números de
Fibonacci, fuera del alcance de este tema), el costo amortizado de
Extract-Min queda en **`O(lg n)`** — el único de los cuatro que no se reduce
a `O(1)`. Es el caso que "viene a arreglar" la elección de `Φ = t + 2m`: el
término `t(H)` en `Φ` es justamente lo que permite que el costo real de
recorrer todas las raíces (`O(t(H))`) se cancele en `ΔΦ`, dejando sólo
`O(D(n))`.
