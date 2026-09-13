---
kind: operation
title: "Activación / desactivación de segmentos horizontales"
order: 1
cppSteps:
  - step-1-events.cpp
  - step-2-activation.cpp
  - full-implementation.cpp
---

## Qué hace

Marca un segmento horizontal como "presente" en el barrido durante el rango
de x en el que existe, y lo retira apenas ese rango termina.

## Intuición

La recta de barrido sólo necesita saber, en cada instante x, qué segmentos
horizontales tiene enfrente. Un segmento horizontal `[x1, x2]` a altura y
sólo importa mientras el barrido está entre x1 y x2 — antes o después, no
aporta nada. Activar/desactivar es la manera de mantener esa ventana viva
sin recorrer todos los segmentos en cada paso.

## Algoritmo

Textual del profesor (#34): "un segmento horizontal (con x1 ≤ x2) se activa
antes de procesar el punto x1 y se desactiva después de procesar el punto
x2". El orden de los eventos en x importa en el borde: activar **antes** de
procesar x1, desactivar **después** de procesar x2 — un segmento vertical
exactamente en x1 o x2 sí debe contar la intersección.

1. Ordenar todos los extremos de segmentos horizontales (activación en x1,
   desactivación en x2) junto con los segmentos verticales, por x.
2. Al llegar a un evento de activación: marcar la posición y del segmento
   horizontal como activa en la estructura elegida.
3. Al llegar a un evento de desactivación: desmarcarla.

El material no da pseudocódigo formal para este paso (#34-38 es prosa); el
de abajo es una transcripción directa de esa prosa.

## Pseudocódigo

```
// Evento de activación en x1: marcar y como activa
Activar(estructura, y):
    estructura.Update(y, +1)

// Evento de desactivación en x2: desmarcar y
Desactivar(estructura, y):
    estructura.Update(y, -1)
```

## C++

Ver `step-2-activation.cpp`: activación/desactivación como `+1`/`-1` sobre un
Fenwick tree indexado por y, que es una de las dos estructuras que el
profesor nombra en #38 (la otra es el Segment tree —
[segment-tree](/structures/segment-tree) y
[fenwick-tree](/structures/fenwick-tree) son andamio, no se reexplican
aquí).

## Complejidad temporal

O(log n) por activación o desactivación individual — heredado de la
actualización puntual del Fenwick tree
([fenwick-tree](/structures/fenwick-tree)); el profesor no separa esta
operación del total O(n log n) del caso simple (#38), que es la cifra que
reporta `meta.yaml`.

## Complejidad espacial

No aplica un análisis propio: el material no da espacio para esta variante.

## Ejemplo

Ver [examples.md](/structures/segment-intersection-sweep-line/examples),
caso "Normal": traza activación/desactivación de dos segmentos horizontales
sobre el mismo barrido que cuenta las intersecciones.

## Casos límite

- **Segmento horizontal de longitud 0** (x1 = x2): se activa y desactiva en
  el mismo evento x — el material no lo menciona explícitamente, pero se
  sigue de la regla de #34 sin ambigüedad.
- **Dos segmentos horizontales que comparten x1 o x2**: el orden "activa
  antes de procesar x1, desactiva después de procesar x2" (#34) resuelve el
  empate sin necesitar una regla adicional.
- **Segmentos horizontales de la misma orientación que se solapan en y**:
  el caso simple exige "no hay intersecciones de segmentos con la misma
  orientación" (#29); el material no dice qué pasa si dos horizontales se
  solapan — caso límite abierto que el usuario debe resolver si aparece en
  la práctica.
