---
kind: operation
title: Bridge (puente)
order: 1
cppSteps:
  - step-1-timeline.cpp
  - step-2-bridge.cpp
  - full-implementation.cpp
visualization:
  type: persistent
  steps:
    - note: >-
        (Ejemplo derivado, no de las diapositivas: el ejemplo del profesor
        no tiene un puente interior no trivial). Insertamos ins(10) en
        t=1. Q en este instante: {10}.
      highlight: ["t1"]
      nodes:
        - { id: t1, value: "ins(10)", parent: null }
    - note: >-
        del-min en t=2 elimina el 10 (único elemento). Q en este instante
        queda vacío. Un conjunto vacío es subconjunto de cualquier cosa,
        así que t=2 es un puente: nada de lo que había "sobrevive" para
        poder contradecir la definición, porque no había nada.
      highlight: ["t2"]
      nodes:
        - { id: t1, value: "ins(10)", parent: null }
        - { id: t2, value: "del-min -> quita 10", parent: t1 }
    - note: >-
        ins(1) en t=3. Q en este instante: {1}. Todavía no sabemos si 1
        sobrevivirá hasta el presente.
      highlight: ["t3"]
      nodes:
        - { id: t1, value: "ins(10)", parent: null }
        - { id: t2, value: "del-min -> quita 10", parent: t1 }
        - { id: t3, value: "ins(1)", parent: t2 }
    - note: >-
        ins(2) en t=4. Q en este instante: {1, 2}.
      highlight: ["t4"]
      nodes:
        - { id: t1, value: "ins(10)", parent: null }
        - { id: t2, value: "del-min -> quita 10", parent: t1 }
        - { id: t3, value: "ins(1)", parent: t2 }
        - { id: t4, value: "ins(2)", parent: t3 }
    - note: >-
        del-min en t=5 elimina el mínimo, 1. Q_ahora = {2}. Con Q_ahora ya
        fijo, revisamos t=2: su estado (vacío) es subconjunto de {2}, así
        que sigue siendo puente. t=1, t=3 y t=4 no lo son: sus estados
        ({10}, {1}, {1,2}) contienen elementos que ya no están en Q_ahora.
        El puente t=2 es la marca de "aquí la cola se cortó limpio" — nada
        insertado antes de t=2 puede seguir vivo después.
      highlight: ["t2"]
      nodes:
        - { id: t1, value: "ins(10)", parent: null }
        - { id: t2, value: "del-min -> quita 10 (PUENTE)", parent: t1 }
        - { id: t3, value: "ins(1)", parent: t2 }
        - { id: t4, value: "ins(2)", parent: t3 }
        - { id: t5, value: "del-min -> quita 1 (Q_ahora={2})", parent: t4 }
---

## Qué hace

Decide si un instante `t'` de la línea de tiempo es un **puente**: un punto
donde el estado de la cola de prioridad "se corta limpio" respecto al
presente.

## Intuición

Un tiempo `t'` es un puente si todo lo que estaba presente en la cola en
ese instante sigue presente ahora — nada de lo que había en `t'` fue
eliminado después. Es el concepto central de todo el tema: si se encuentra
un puente cerca de un tiempo `t` cualquiera, se sabe que **nada anterior al
puente** puede haber sido eliminado en o después de `t` sin que ese
elemento haya pasado, primero, por sobrevivir al puente. Eso acota
exactamente cuánta línea de tiempo hay que mirar para responder cualquier
pregunta sobre "qué se eliminó desde tal tiempo" — que es justo lo que
necesita [Compute-M](/structures/retroactive-priority-queue/operations/compute-m).

## Algoritmo

Definición (páginas 56-57): un tiempo `t'` es un puente si

```
Q_t' ⊆ Q_ahora
```

es decir, todo elemento presente en la priority queue en el instante `t'`
sigue presente en el presente (`Q_ahora`).

Por qué ayuda: si `t'` es un puente, ningún elemento presente en `t'` puede
aparecer en el conjunto "eliminado desde `t`" para ningún `t ≥ t'` — por
definición, son sobrevivientes. Encontrar el puente más cercano antes de un
tiempo `t` da, entonces, una cota exacta de dónde puede empezar a buscarse
lo que se eliminó desde `t`: nunca antes del puente.

> **Nota de apoyo** (no está en las diapositivas): el instante "antes de
> toda operación" (`Q = ∅`) es trivialmente un puente, porque el conjunto
> vacío es subconjunto de cualquier cosa. Es útil como caso base: siempre
> existe al menos un puente (el inicio de la línea de tiempo), aunque no
> haya ninguno interior.

## Pseudocódigo

El profesor no da pseudocódigo para esta sección — el mazo entero de este
tema no trae "Algoritmo N", sólo la definición y la fórmula (ver
[Compute-M](/structures/retroactive-priority-queue/operations/compute-m)).
Lo siguiente es la única forma directa de aplicar la definición:

```
EsPuente(t', Q_ahora, Q_t'):
    devolver Q_t' ⊆ Q_ahora

PuenteMasCercanoAntes(t):
    para t' desde el tiempo inmediatamente antes de t, retrocediendo:
        si EsPuente(t'): devolver t'
    devolver "inicio de la línea de tiempo"   # siempre es puente
```

## C++

Ver `step-2-bridge.cpp` y `full-implementation.cpp` en el editor de arriba.

## Complejidad temporal

El profesor no da una cota propia para esta operación (ver `meta.yaml`): se
presenta como definición, no como algoritmo con costo propio. El costo real
de mantenerla y consultarla queda delegado al BST balanceado con
información agregada que sostiene a
[Compute-M](/structures/retroactive-priority-queue/operations/compute-m).

## Complejidad espacial

No la da el profesor.

## Ejemplo

Con el [ejemplo trabajado del profesor](/structures/retroactive-priority-queue/examples)
(`Q_ahora = {8}`, tras `ins(5), ins(2), del-min, ins(8), del-min`), el único
puente es el inicio de la línea de tiempo (`Q = ∅` antes de `t=1`): ninguno
de los estados intermedios (`{5}`, `{5,2}`, `{5}`, `{5,8}`) es subconjunto
de `{8}`.

*(Ejemplo derivado; no aparece en las diapositivas)*: sobre
`ins(10), del-min, ins(1), ins(2), del-min` (`t=1..5`), con
`Q_ahora = {2}`, el instante `t=2` (justo después del primer `del-min`, con
`Q_t=2 = ∅`) **sí** es un puente interior: nada de lo insertado antes de
`t=2` (el 10) sigue vivo, y el vacío es subconjunto de cualquier cosa. Es
el mismo ejemplo de la visualización de arriba.

## Casos límite

- **Ningún puente interior**: siempre queda el inicio de la línea de
  tiempo como puente trivial (`Q = ∅`); nunca hay "cero puentes".
- **El presente mismo**: el tiempo actual es siempre un puente
  (`Q_ahora ⊆ Q_ahora` es trivialmente cierto), pero no sirve para acotar
  nada hacia atrás — se necesita el más cercano *antes* del tiempo de
  interés.
- **Cola vacía en todo momento**: si nunca se insertó nada, todo instante
  es un puente.
