---
kind: operation
title: Escribir un campo (caso con espacio)
order: 2
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - step-3-write-field.cpp
  - full-implementation.cpp
visualization:
  type: persistent
  mode: fat-node
  steps:
    - note: >-
        Nodo v: p=2, así que 2p=4 entradas de registro como máximo. Ahora
        mismo lleva dos escritas — (valor,200,t=1) y (valor,201,t=2) —,
        registro 2/4: todavía queda espacio.
      nodes:
        - { id: orig, value: "v: 10 (original, t=0)" }
        - { id: e1, value: "t=1: valor=200" }
        - { id: e2, value: "t=2: valor=201" }
    - note: >-
        Llega escribirCampo(v, valor, 202, t=3). Como |registro|=2 < 2p=4,
        cabe: se agrega la tupla nueva al final del registro, todavía sin
        confirmar.
      highlight: ["e3"]
      nodes:
        - { id: orig, value: "v: 10 (original, t=0)" }
        - { id: e1, value: "t=1: valor=200" }
        - { id: e2, value: "t=2: valor=201" }
        - { id: e3, value: "t=3: valor=202", state: copied }
    - note: >-
        Entrada confirmada: el registro pasa a 3/4 entradas usadas. Todavía
        queda un espacio antes de tocar el límite 2p.
      nodes:
        - { id: orig, value: "v: 10 (original, t=0)" }
        - { id: e1, value: "t=1: valor=200" }
        - { id: e2, value: "t=2: valor=201" }
        - { id: e3, value: "t=3: valor=202" }
    - note: >-
        Llega escribirCampo(v, valor, 203, t=4). |registro|=3 < 2p=4:
        todavía cabe — es exactamente el caso límite "2p-1 entradas, la
        próxima escritura aún entra".
      highlight: ["e4"]
      nodes:
        - { id: orig, value: "v: 10 (original, t=0)" }
        - { id: e1, value: "t=1: valor=200" }
        - { id: e2, value: "t=2: valor=201" }
        - { id: e3, value: "t=3: valor=202" }
        - { id: e4, value: "t=4: valor=203", state: copied }
    - note: >-
        Entrada confirmada: el registro llega a 4/4 = 2p, su tamaño
        máximo. Las cuatro entradas quedan marcadas como el límite: la
        próxima escritura ya no va a cumplir |registro| < 2p.
      nodes:
        - { id: orig, value: "v: 10 (original, t=0)" }
        - { id: e1, value: "t=1: valor=200", state: marked }
        - { id: e2, value: "t=2: valor=201", state: marked }
        - { id: e3, value: "t=3: valor=202", state: marked }
        - { id: e4, value: "t=4: valor=203", state: marked }
    - note: >-
        Llega escribirCampo(v, valor, 204, t=5): |registro|=4 = 2p, ya no
        aplica el caso "con espacio" — esta operación no procesa esta
        escritura. Control pasa a
        node-split(v, valor, 204, 5), que crea un nodo nuevo y redirige los
        punteros entrantes (ver esa página; no se reimplica aquí).
      highlight: ["attempt"]
      nodes:
        - { id: orig, value: "v: 10 (original, t=0)" }
        - { id: e1, value: "t=1: valor=200", state: marked }
        - { id: e2, value: "t=2: valor=201", state: marked }
        - { id: e3, value: "t=3: valor=202", state: marked }
        - { id: e4, value: "t=4: valor=203", state: marked }
        - { id: attempt, value: "intento t=5: valor=204 -> node-split", state: active }
---

## Qué hace

Registra un nuevo valor para un campo del nodo, en el tiempo actual —
sin destruir el valor anterior — siempre que el registro de
modificaciones todavía tenga espacio.

## Intuición

Escribir en un nodo gordo no sobrescribe nada: agrega una entrada más al
registro, con marca de tiempo. Mientras el registro no esté lleno, esto es
tan barato como escribir en la máquina de punteros ordinaria — sólo que en
vez de un solo valor, el nodo acumula un historial acotado de valores.

## Algoritmo

1. Si `|registro(nodo)| < 2p`: agregar la tupla
   `(campo, valorNuevo, tiempoActual)` al final del registro.
2. Si el registro ya tiene $2p$ entradas, esta operación **no aplica** —
   ver [node-split](/structures/fat-nodes/operations/node-split).

## Pseudocódigo

No hay pseudocódigo formal en el mazo para esta operación (páginas 29-30
son prosa y el análisis de potencial, no un algoritmo). Traducción
directa:

```
función escribirCampo(nodo, campo, valorNuevo, t):
    si |registro(nodo)| < 2p:
        registro(nodo).agregar((campo, valorNuevo, t))
        devolver nodo
    si_no:
        devolver nodeSplit(nodo, campo, valorNuevo, t)
```

## C++

Ver `step-3-write-field.cpp` (sólo el caso con espacio, `writeFieldNoSplit`)
y `full-implementation.cpp` (el `writeField` completo, que delega en
`nodeSplit` cuando hace falta) en el editor de arriba.

## Complejidad temporal

Costo real $c_i = O(1)$: agregar una tupla al final de una lista. Con el
potencial $\Phi = \sum_v (\text{entradas usadas en el registro de } v)$, esta operación
sube $\Phi$ en exactamente 1 ($\Delta\Phi = +1$), así que el costo amortizado es
$\hat{c}_i = O(1) + 1 = O(1)$ (páginas 29-30). El profesor no distingue
mejor/promedio/peor: da directamente el costo real y el amortizado, y
ambos coinciden en este caso.

## Complejidad espacial

$+1$ entrada en el registro del nodo — el espacio extra "por cada cambio"
que promete el teorema DSST.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Con
`p = 2` (`2p = 4` entradas máximo): un nodo `v` nace con `valor = 10` en
`t=0`. `escribirCampo(v, valor, 200, 1)` agrega `(valor, 200, 1)` — el
registro pasa de 0 a 1 entrada. `escribirCampo(v, valor, 201, 2)` agrega
una segunda — el registro sigue con espacio (2 de 4), así que ninguna de
estas dos escrituras dispara un split.

## Casos límite

- **Nodo recién creado (registro vacío)**: la primera escritura siempre
  cabe; nunca dispara split por sí sola.
- **Escribir dos veces el mismo campo en el mismo tiempo $t$**: el mazo no
  lo discute; esta implementación agrega ambas entradas (la lectura
  siempre toma la última agregada con $\text{tiempo} \le t$, así que la segunda
  escritura "gana").
- **El registro llega exactamente a $2p - 1$ entradas**: la próxima
  escritura todavía cabe (llega a $2p$, el máximo); es la escritura
  *siguiente a esa* la que ya no cabe y dispara
  [node-split](/structures/fat-nodes/operations/node-split) — el caso
  límite central de todo el análisis (páginas 25-26).
