---
kind: operation
title: Consultar una versión vieja (segment tree)
order: 3
cppSteps:
  - step-1-node.cpp
  - step-2-stack-push.cpp
  - step-3-segment-tree-update.cpp
  - step-4-trie-insert.cpp
  - full-implementation.cpp
---

## Qué hace

Responde una consulta de rango sobre una versión pasada del segment tree
persistente, sin afectar (ni copiar) ninguna versión.

## Intuición

Esta es la razón de ser de todo el tema: como
[Update](/structures/path-copying/operations/segment-tree-update) nunca
modifica la versión de la que parte, el puntero a la raíz que devolvió en
su momento sigue siendo un segment tree completo y válido. Consultar el
pasado no es una operación distinta de consultar el presente: es la misma
[consulta del segment tree](/structures/segment-tree/operations/query),
sólo que arrancando desde una raíz distinta.

## Algoritmo

1. Guardar, en el momento de cada `Update`, el puntero a la raíz que
   devuelve (esa raíz identifica la versión).
2. Para consultar la versión `k`, usar el puntero guardado de esa versión
   como raíz de entrada.
3. Ejecutar la [consulta normal](/structures/segment-tree/operations/query)
   del segment tree desde esa raíz — sin ninguna variante especial.

## Pseudocódigo

El profesor no da pseudocódigo propio para esta operación: "basta guardar
el puntero a la raíz de esa versión (devuelto por Update en su momento) y
hacer la consulta normal desde ahí." Es la misma
[Query](/structures/segment-tree/operations/query) ya cubierta como
prerrequisito, sin modificaciones.

## C++

Ver `full-implementation.cpp` en el editor de arriba: la consulta reutiliza
la misma función de query sobre cualquier raíz guardada.

## Complejidad temporal

$O(\lg n)$, exactamente el costo de una consulta cualquiera del segment
tree, "sin ningún costo adicional por ser una versión del pasado" — no hay
indirección extra ni reconstrucción: la versión vieja ya existe, completa,
en memoria.

## Complejidad espacial

No aplica costo adicional: consultar no crea nodos nuevos.

## Ejemplo

Con el ejemplo del [diagrama de Update](/structures/path-copying/operations/segment-tree-update):
tras actualizar la posición 4 y obtener la raíz nueva `[1,4]'`, una consulta
sobre la raíz vieja `[1,4]` (guardada antes del Update) sigue devolviendo
los valores originales — incluido el valor viejo de la posición 4 — porque
esa raíz nunca fue tocada.

## Casos límite

- **Consultar la versión más antigua (la inicial, antes de cualquier
  Update)**: funciona igual, siempre que se haya guardado su raíz.
- **Consultar una versión intermedia que comparte nodos con la versión
  consultada actual**: no hay conflicto — cada consulta sólo lee, nunca
  escribe, así que compartir nodos entre versiones es seguro.
- **No guardar el puntero de una versión**: esa versión queda inalcanzable
  (se pierde, aunque sus nodos puedan seguir vivos si otra versión los
  comparte); el material no cubre recolección de basura ni liberación de
  versiones muertas.
