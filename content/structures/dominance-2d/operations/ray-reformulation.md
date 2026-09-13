---
kind: operation
title: "Reformulación como rayos"
order: 1
cppSteps:
  - step-1-ray-reformulation.cpp
  - full-implementation.cpp
---

## Qué hace

Convierte cada punto `(y_i, z_i)` del conjunto en un **rayo vertical** que
sale de `(y_i, z_i)` hacia `z = +∞`, y convierte la consulta `(b2, b3)` en un
**rayo horizontal** que sale de `(b2, b3)` hacia la izquierda (`y → -∞`). No
es una estructura de datos por sí sola: es el cambio de pregunta sobre el que
se construyen [subdivision-build](/structures/dominance-2d/operations/subdivision-build)
y [dominance-query](/structures/dominance-2d/operations/dominance-query).

## Intuición

Igual que [vertical-ray-shooting](/structures/vertical-ray-shooting) volvió
tratable la localización de puntos disparando un rayo desde el punto de
consulta hacia un segmento, aquí se invierte el papel: cada dato (un punto)
dispara su propio rayo, y es la consulta la que se convierte en el objeto que
"barre". Preguntar "¿el punto está dominado?" (una comparación de dos
desigualdades sobre coordenadas) se vuelve "¿el rayo horizontal de la
consulta atraviesa el rayo vertical de este punto?" (una intersección
geométrica).

## Algoritmo

1. Punto `(y_i, z_i)` → rayo vertical `{(y_i, z) : z ≥ z_i}`.
2. Consulta `(b2, b3)` → rayo horizontal `{(y, b3) : y ≤ b2}`.
3. El punto `i` es dominado (`y_i ≤ b2 ∧ z_i ≤ b3`) exactamente cuando su
   rayo vertical y el rayo horizontal de la consulta se cruzan (#21).

## Pseudocódigo

El profesor no da pseudocódigo para este paso — es una reformulación
conceptual, no un procedimiento. La transcripción del único pseudocódigo del
tema (`ConsultaDominancia`) está en
[dominance-query](/structures/dominance-2d/operations/dominance-query).

## C++

Ver `step-1-ray-reformulation.cpp` y `full-implementation.cpp` en el editor
de arriba.

## Complejidad temporal

El profesor no da un costo propio para la reformulación: es una
equivalencia, no un cómputo. El costo real vive en
[dominance-query](/structures/dominance-2d/operations/dominance-query).

## Complejidad espacial

Un rayo por punto: `O(n)` rayos antes de construir la subdivisión (que luego
los recorta y extiende — ver
[subdivision-build](/structures/dominance-2d/operations/subdivision-build)).

## Ejemplo

*(derivado del pseudocódigo; no aparece en las diapositivas, que sólo traen
el diagrama cualitativo #22-23 sin coordenadas)*: los puntos
`(1,5), (2,1), (4,4), (5,2)` se convierten en cuatro rayos verticales que
nacen en esas coordenadas y suben. La consulta `(b2,b3) = (4,4)` es un rayo
horizontal a la altura `z=4` que entra desde `y=4` hacia la izquierda: cruza
los rayos de `(2,1)` y `(4,4)` (ambos con `y ≤ 4` y `z ≤ 4`), pero no el de
`(1,5)` (su rayo empieza en `z=5`, por encima de la altura `4`) ni el de
`(5,2)` (su rayo está a la derecha de `b2=4`).

## Casos límite

- **`b2` o `b3` menor que todo el conjunto**: ningún rayo es atravesado,
  `k = 0`.
- **Empate `y_i = b2` o `z_i = b3`**: el material usa `≤` en ambas
  coordenadas (#17), así que el punto exactamente sobre el borde del rayo de
  consulta cuenta como dominado.
- **Dos puntos con la misma `y_i`**: sus rayos verticales coinciden en `x`;
  la subdivisión los distingue por su posición en `z` dentro de la misma
  columna (ver casos límite de
  [subdivision-build](/structures/dominance-2d/operations/subdivision-build)).
