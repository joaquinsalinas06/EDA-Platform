---
kind: operation
title: Delete-retroactive
order: 4
cppSteps:
  - step-1-timeline.cpp
  - step-2-bridge.cpp
  - step-3-compute-m.cpp
  - step-4-insert-retroactive.cpp
  - full-implementation.cpp
---

## Qué hace

Elimina de la línea de tiempo una operación (`insert(k)` o `del-min`) que
ocurrió en el tiempo `t`, y actualiza `Q_ahora` con el efecto neto
correspondiente.

## Intuición

> **Ausencia del material**: el mazo **no desarrolla** esta operación. La
> menciona una sola vez, en el enunciado del resultado final (páginas
> 63-64, diapositiva 30): "Insert y Delete retroactivos parciales sobre
> una priority queue cuestan $O(\lg n)$ amortizado" — Delete aparece ahí y en
> ningún otro lado. No hay fórmula de efecto neto propia para Delete, no
> hay pseudocódigo, y no hay ejemplo numérico. De las cuatro operaciones
> del tema, es la única sin ningún desarrollo del profesor.

Lo que sí puede decirse, apoyado en lo que el profesor *sí* desarrolla
para [Insert-retroactive](/structures/retroactive-priority-queue/operations/insert-retroactive):
si insertar en el pasado tiene un efecto neto acotado a un único
intercambio, es razonable esperar (por simetría del problema) que borrar
una operación del pasado tenga una estructura de efecto igual de acotada.
Pero **el mazo no dice cuál es ese efecto**, y encima Delete tiene una
dificultad extra que Insert no tiene: la operación borrada pudo haber sido
un `insert(k)` (símil directo de deshacer una inserción) o un `del-min`
(¿qué significa "deshacer" una extracción, si no se sabe qué habría
eliminado la cola de no haber existido ese `del-min`?). El profesor no
distingue estos dos casos en ningún momento.

## Algoritmo

**No hay algoritmo del profesor para transcribir.** A diferencia de
[Bridge](/structures/retroactive-priority-queue/operations/bridge) y
[Compute-M](/structures/retroactive-priority-queue/operations/compute-m),
que sí tienen una fórmula explícita aunque no un "Algoritmo N" con ese
nombre, Delete-retroactivo no tiene ni fórmula: sólo la cota final citada.
Escribir aquí un algoritmo completo sería inventar contenido que el curso
no cubre — contra la regla de fidelidad al profesor de este proyecto.

## Pseudocódigo

**No hay material fuente para derivarlo.** El pseudocódigo de
[Insert-retroactive](/structures/retroactive-priority-queue/operations/insert-retroactive)
sí es una derivación defendible (traduce directamente la fórmula de `M`
que el profesor sí da); esto no lo es, porque no hay ninguna fórmula de la
que partir.

## C++

No hay una función `delete_retroactive` propia en
`cpp/structures/retroactive-priority-queue/`: implementarla exigiría
inventar el algoritmo que el punto anterior explica que no está en el
material. Ver `full-implementation.cpp`, que sí demuestra por completo
[Bridge](/structures/retroactive-priority-queue/operations/bridge),
[Compute-M](/structures/retroactive-priority-queue/operations/compute-m)
e [Insert-retroactive](/structures/retroactive-priority-queue/operations/insert-retroactive).

## Complejidad temporal

$O(\lg n)$ amortizado — la misma cota citada que Insert-retroactivo, de la
misma línea del profesor (páginas 63-64): "Insert y Delete retroactivos
parciales... cuestan $O(\lg n)$ amortizado". Es una cita, no una derivación;
y a diferencia de Insert, aquí el mazo ni siquiera da el argumento
estructural (el "efecto neto es un único intercambio") que sostiene la
cota de Insert — sólo el número final.

## Complejidad espacial

No la da el profesor.

## Ejemplo

**No hay ejemplo del profesor**, y tampoco hay base para derivar uno con
confianza: la fórmula que se derivaría un ejemplo (el equivalente a
$M = \max(\{k\} \cup \{...\})$ de Insert) no existe para Delete. Inventar un
número aquí sería inventar el algoritmo, no sólo el ejemplo.

## Casos límite

**No aplica** en ausencia de un algoritmo: no hay casos límite propios de
Delete-retroactivo que discutir sin antes tener el algoritmo mismo. Los
casos límite reales de este tema — $M = k$ vs $M \ne k$, ausencia de puente
interior— están documentados en
[Insert-retroactive](/structures/retroactive-priority-queue/operations/insert-retroactive)
y [Bridge](/structures/retroactive-priority-queue/operations/bridge).
