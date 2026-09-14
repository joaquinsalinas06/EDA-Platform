---
kind: operation
title: Compute-M
order: 2
cppSteps:
  - step-1-timeline.cpp
  - step-2-bridge.cpp
  - step-3-compute-m.cpp
  - full-implementation.cpp
---

## Qué hace

Calcula `M`: el elemento que decide el efecto neto de una inserción
retroactiva `Insert(t, 'insert(k)')`. `M` es, o bien `k` mismo, o bien el
elemento que `k` desplaza entre los ya eliminados.

## Intuición

La definición de `M` (ver
[Insert-retroactive](/structures/retroactive-priority-queue/operations/insert-retroactive))
pide "el máximo entre `k` y todo lo que se eliminó en tiempo $\ge t$". Mirado
así, calcularlo cuesta recorrer todo lo eliminado desde `t` hacia adelante —
$O(r)$, "de vuelta al $O(r)$ del rollback genérico" (páginas 54-55): el
mismo costo que este tema entero existe para evitar.

El [puente](/structures/retroactive-priority-queue/operations/bridge) es la
salida: si `t'` es el puente más cercano antes de `t`, nada presente en
`t'` puede estar entre lo eliminado desde `t` (porque sobrevive hasta el
presente, por definición de puente). Eso permite reemplazar "todo lo
eliminado desde `t`" — que exige mirar hacia adelante en el tiempo, difícil
de mantener — por "todo lo insertado desde `t'` que no está en `Q_ahora`" —
que sí se puede mantener con un agregado por subárbol en un BST balanceado
indexado por tiempo.

## Algoritmo

Fórmula final, usando el puente más cercano (páginas 58-59). Sea `t'` el
puente más cercano antes de `t`:

$$\max\{\, k' : k' \text{ eliminado en tiempo} \ge t \,\} = \max\{\, k' \notin Q_{ahora} : k' \text{ insertado en tiempo} \ge t' \,\}$$

y entonces:

$$M = \max\big(\, \{k\} \cup \{\, k' \notin Q_{ahora} : k' \text{ insertado en tiempo} \ge t' \,\} \,\big)$$

## Pseudocódigo

El profesor no da pseudocódigo para esta sección (todo el tema son
fórmulas, no "Algoritmo N"). Lo siguiente es la traducción directa de la
fórmula de arriba:

```
Compute-M(t, k, Q_ahora):
    t' ← PuenteMasCercanoAntes(t)
    candidatos ← { k' : k' insertado en tiempo ≥ t' y k' ∉ Q_ahora }
    devolver máx({k} ∪ candidatos)
```

## C++

Ver `step-3-compute-m.cpp` y `full-implementation.cpp` en el editor de
arriba. Se implementan las dos versiones — la ingenua $O(r)$ y la que usa
el puente — y se comprueba con `assert` que dan el mismo resultado.

## Complejidad temporal

El cálculo **ingenuo** (recorrer todo lo eliminado desde `t`) es $O(r)$,
dado explícitamente por el profesor (páginas 54-55) como el costo que este
método existe para evitar. La versión con el puente más cercano más un BST
balanceado con agregados es la que, según el resultado citado (Demaine,
Iacono, Langerman, 2007, páginas 63-64), sostiene el $O(\lg n)$ amortizado
final de Insert/Delete retroactivos — pero el profesor no aísla una cota
propia sólo para "calcular M con el puente": la cota que sí da es para la
operación completa (ver
[Insert-retroactive](/structures/retroactive-priority-queue/operations/insert-retroactive)).

## Complejidad espacial

No la da el profesor.

## Ejemplo

Del [ejemplo trabajado del profesor](/structures/retroactive-priority-queue/examples):
$Q_{ahora} = \{8\}$, se inserta `Insert(2,5, 'insert(3)')` (tiempo `t=2,5`, entre
`t=2` y `t=3`). $M = \max(\{3\} \cup \{2, 5\}) = 5$ (los eliminados en tiempo $\ge 2,5$
son `2` y `5`).

*(Cálculo derivado usando el puente; no aparece en las diapositivas)*: el
único puente antes de `t=2,5` en ese ejemplo es el inicio de la línea de
tiempo ($t'=0$, $Q_0=\emptyset$). Los candidatos por la fórmula del puente son
$\{k' \text{ insertado en } t \ge 0\} \setminus Q_{ahora} = \{5, 2, 8\} \setminus \{8\} = \{2, 5\}$ — el mismo
conjunto que el cálculo ingenuo, porque en este ejemplo no hay un puente
interior que acote más (ver
[Bridge](/structures/retroactive-priority-queue/operations/bridge) para un
ejemplo derivado con un puente interior real, donde la diferencia sí se
nota).

## Casos límite

- **`t` antes de toda inserción relevante**: el puente más cercano es el
  inicio de la línea de tiempo, y la fórmula del puente coincide con la
  ingenua (no hay nada que descartar).
- **`k` mayor que todo lo eliminado desde `t`**: $M = k$; `k` entra
  directo a `Q_ahora` sin desplazar a nadie.
- **Nada eliminado desde `t`**: el conjunto de candidatos es vacío,
  $M = k$ trivialmente.
