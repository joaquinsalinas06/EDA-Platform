---
kind: operation
title: Leer un campo en la versión t
order: 1
cppSteps:
  - step-1-node.cpp
  - step-2-structure.cpp
  - full-implementation.cpp
---

## Qué hace

Devuelve el valor de un campo de un nodo, tal como era en una versión
(tiempo) `t` dada — no necesariamente la más reciente.

## Intuición

El nodo nunca borra un valor viejo cuando se escribe uno nuevo: lo agrega
al registro de modificaciones, con marca de tiempo. Leer en la versión `t`
es entonces buscar hacia atrás en ese registro la primera modificación
que "ya había pasado" para el tiempo `t`, y si nunca hubo ninguna, usar el
valor con el que el nodo nació.

## Algoritmo

Textual del profesor (página 24): "Se revisa el registro de
modificaciones de más reciente a más antigua, y se toma la primera con
tiempo ≤ t; si no hay ninguna, se usa el valor original del nodo."

1. Recorrer el registro del nodo de atrás hacia adelante (más reciente
   primero).
2. Devolver el valor de la primera entrada de ese campo con
   `tiempo ≤ t`.
3. Si ninguna entrada aplica, devolver el valor original del campo.

## Pseudocódigo

El profesor no da pseudocódigo formal para ningún algoritmo de nodos
gordos (todo es prosa); lo siguiente es la traducción directa del
párrafo de la página 24, no una invención:

```
función leerCampo(nodo, campo, t):
    para cada entrada (c, valor, tiempo) en registro(nodo),
         de la más reciente a la más antigua:
        si c = campo y tiempo <= t:
            devolver valor
    devolver valorOriginal(nodo, campo)
```

## C++

Ver `step-1-node.cpp` (el nodo y su registro), `step-2-structure.cpp`
(`readValue` / `readNext`) y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

`O(1)`. El registro tiene tamaño acotado por `2p` (con `p = O(1)` por
hipótesis), así que aunque el algoritmo lo recorra entero en el peor caso,
ese recorrido es de longitud constante. El profesor lo dice directo: "O(1),
pues el registro tiene tamaño acotado" (página 24). No hay distinción
entre costo real y amortizado aquí: leer nunca modifica el registro, así
que no hay nada que un análisis de potencial tenga que explicar.

## Complejidad espacial

`O(1)` adicional: la operación no crea estructura nueva, sólo recorre la
que ya existe.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas.)* Un nodo `v`
nace en `t=0` con `valor = 20`. Se escribe `valor = 200` en `t=1` y
`valor = 201` en `t=2`. `leerCampo(v, valor, 0)` devuelve `20` (valor
original, ninguna entrada tiene tiempo ≤ 0 salvo que se escriba en t=0);
`leerCampo(v, valor, 1)` devuelve `200`; `leerCampo(v, valor, 1.5)` —o
cualquier tiempo entre escrituras— también devuelve `200`, porque es la
entrada más reciente con tiempo ≤ 1.5.

## Casos límite

- **Ninguna modificación registrada**: "si no hay ninguna, se usa el
  valor original del nodo" (página 24) — el caso base explícito del
  profesor.
- **`t` anterior a la creación del nodo**: no lo cubre la persistencia
  parcial (el nodo no existía); lo resuelve
  [nodos gordos bidireccionales](/structures/fat-nodes/operations/bidirectional-fat-nodes)
  cuando la versión que se consulta queda "detrás" en el árbol de
  versiones.
- **El registro está en su tamaño máximo (`2p`)**: sigue siendo `O(1)`
  porque `2p` es constante — el caso límite de tamaño no degrada el
  costo, es justamente lo que dispara
  [node-split](/structures/fat-nodes/operations/node-split) en la
  siguiente escritura, no en la lectura.
