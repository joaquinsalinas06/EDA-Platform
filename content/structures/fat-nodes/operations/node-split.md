---
kind: operation
title: Node-split
order: 3
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-write-field.cpp
  - step-4-node-split.cpp
  - full-implementation.cpp
visualization:
  type: persistent
  steps:
    - note: >-
        El registro de n está lleno (2p = 4 entradas, el máximo). La
        próxima escritura ya no cabe: dispara node-split. a1 es uno de
        los p predecesores que apuntan a n.
      highlight: ["n_old"]
      nodes:
        - { id: a1, value: "a1", parent: null }
        - { id: n_old, value: "n (registro lleno 4/4)", parent: a1 }
    - note: >-
        Nace un nodo nuevo n', limpio: registro vacío, valores actuales
        copiados de n (los que leerCampo devolvería justo antes de esta
        escritura). n (viejo) todavía no se toca.
      highlight: ["n_new"]
      nodes:
        - { id: a1, value: "a1", parent: null }
        - { id: n_old, value: "n (registro lleno 4/4)", parent: a1 }
        - { id: n_new, value: "n' (registro vacío)", parent: null }
    - note: >-
        Se redirige el puntero entrante de a1 hacia n' — esto es, en sí
        mismo, una escritura de campo sobre a1 (no una mutación mágica).
        Con p = 1 predecesor esto basta; con p > 1 se repite por cada
        predecesor.
      highlight: ["a1", "n_new"]
      nodes:
        - { id: a1, value: "a1", parent: null }
        - { id: n_old, value: "n (congelado)", parent: null }
        - { id: n_new, value: "n' (registro: 1/4)", parent: a1 }
    - note: >-
        n (viejo) queda congelado e intacto: sigue siendo la respuesta
        correcta para cualquier lectura con tiempo anterior al split. La
        estructura vive ahora repartida entre n (pasado) y n' (presente
        en adelante).
      highlight: ["n_old"]
      nodes:
        - { id: a1, value: "a1", parent: null }
        - { id: n_old, value: "n (congelado, consultable)", parent: null }
        - { id: n_new, value: "n' (registro: 1/4)", parent: a1 }
---

## Qué hace

Cuando el registro de modificaciones de un nodo `n` ya tiene `2p`
entradas y llega una escritura más, crea un nodo nuevo `n'`, limpio, con
los valores actuales de `n`, y redirige hacia `n'` los `p` punteros que
hasta ese momento apuntaban a `n`.

## Intuición

**El mazo nunca dibuja este diagrama** (segunda ausencia grave señalada en
el análisis de la fuente: ni el nodo gordo ni el split aparecen dibujados).
Lo que sigue se deriva directamente de la prosa de las páginas 25-26 y
31-33, apoyándose en el diagrama de la
[máquina de punteros](/structures/pointer-machine) como base.

La idea: un registro de tamaño `2p` ya no tiene dónde guardar una entrada
más. En vez de agrandarlo (eso rompería la cota `O(1)` de lectura), se
"vacía" creando un nodo hermano limpio que arranca desde los valores
actuales, y se hace que el mundo exterior — los `p` nodos que apuntaban al
viejo — empiece a apuntar al nuevo. El nodo viejo no se destruye: se queda
congelado, y sigue siendo la fuente correcta para cualquier consulta sobre
una versión anterior al split.

La parte delicada, y la razón de que esto no sea trivial: **redirigir un
puntero entrante no es una operación aparte del modelo** — es, ella misma,
una escritura de campo sobre el nodo predecesor, sujeta a las mismas
reglas de la [máquina de punteros](/structures/pointer-machine) (nodos con
O(1) campos, sin poder tocar "de golpe" quién apunta a quién). Si esa
escritura llena, a su vez, el registro del predecesor, dispara *otro*
split — la cascada está acotada porque cada nodo tiene a lo más un número
constante de predecesores.

## Algoritmo

1. Crear `n'`, con los valores originales iguales a
   `leerCampo(n, campo, t)` para cada campo (los valores vigentes de `n`
   justo antes de esta escritura), y registro vacío.
2. Para cada uno de los (a lo más `p`) nodos predecesores `pred` que
   apuntan a `n`: escribir en `pred` el campo correspondiente con el
   nuevo valor `n'` (esto es un `escribirCampo(pred, ..., n', t)`
   recursivo, no una mutación directa).
3. Aplicar sobre `n'` la escritura que disparó el split (siempre cabe: el
   registro de `n'` nace vacío).
4. `n` (el nodo viejo) no se modifica más: queda congelado.

## Pseudocódigo

Sin pseudocódigo en el mazo (todo es prosa); traducción directa de la
descripción de las páginas 25-26 y 31-33:

```
función nodeSplit(n, campo, valorNuevo, t):
    n' <- nodo nuevo con:
              valores originales = leerCampo(n, cadaCampo, t)
              registro vacío
    para cada predecesor pred que apunta a n:
        escribirCampo(pred, campoQueApuntaAN, n', t)
    n'.registro.agregar((campo, valorNuevo, t))
    // n queda intacto, congelado
    devolver n'
```

## C++

Ver `step-4-node-split.cpp` (`nodeSplit` y el `writeField` completo que
delega en él) y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

Costo real `cᵢ = O(1)` (crear `n'`) `+ O(p)` (una escritura de campo por
cada uno de los `p` predecesores). Con `Φ = Σ_v (entradas usadas en el
registro de v)`: el registro de `n` pasa de `2p` entradas a `0`
(`ΔΦ_split = −2p`), y cada redirección agrega a lo más 1 entrada al
registro de su predecesor (`ΔΦ_redirect ≤ +p`). El costo amortizado:

```
ĉᵢ = O(p) + (−2p + p) = O(p) − p = O(1)
```

**porque `p = O(1)` por hipótesis** del teorema — sin esa hipótesis, el
argumento no cierra: sería `O(p)` amortizado, no `O(1)`.

## Complejidad espacial

`O(1)` nodo nuevo, más el espacio que ya contaba cada redirección
individual en `write-field` (`+1` entrada por predecesor afectado).

## Ejemplo

*(Derivado de la descripción; no aparece en las diapositivas.)* Con
`p = 1`: un nodo `n` con predecesor único `a1` tiene su registro lleno
(4 de 4 entradas, `p = 2`). Llega `escribirCampo(n, valor, 999, t=5)`:
nace `n'` con el valor actual de `n` en `t=5`, se redirige `a1` (su campo
`siguiente` pasa a apuntar a `n'` mediante una escritura en el propio
`a1`), y se agrega `(valor, 999, 5)` al registro — ya vacío — de `n'`.
Consultar `leerCampo(a1.siguiente, valor, 4)` sigue devolviendo el valor de
`n` (el viejo): el registro de `a1` guarda que, en `t < 5`, su puntero
apuntaba a `n`.

## Casos límite

- **`p = 1`** (el caso del ejercicio del BST, páginas 34-35): un solo
  predecesor que redirigir — el caso más simple del split, y el que usa
  el ejercicio "¡Hazlo tú mismo!" del mazo.
- **Varios predecesores (`p > 1`)**: cada uno se redirige por separado;
  si alguno de ellos tiene, a su vez, el registro lleno, esa redirección
  dispara un split adicional sobre ese predecesor — el análisis de
  potencial es precisamente lo que garantiza que esta cascada nunca
  cuesta más de `O(1)` amortizado en total.
- **El nodo que se divide es la raíz (el único punto de entrada de la
  máquina de punteros)**: no tiene predecesores internos que redirigir,
  pero sí hay que actualizar el puntero externo a la versión — el mazo no
  lo discute explícitamente; se resuelve tratando ese puntero externo
  igual que cualquier otro campo con su propio registro.
- **`p` no es `O(1)`**: el mazo no lo menciona ("no discute el costo"); el
  teorema simplemente deja de aplicar, porque el paso 2 del análisis
  (`ΔΦ_redirect ≤ +p`) ya no cancela contra el `O(p)` real de forma
  favorable si `p` crece con `n`.
