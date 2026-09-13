---
kind: operation
title: Delete retroactivo
order: 2
cppSteps:
  - step-1-accumulator.cpp
  - step-2-insert-retroactive.cpp
  - step-3-delete-retroactive.cpp
  - step-4-noncommutative-counterexample.cpp
  - full-implementation.cpp
---

## Qué hace

Elimina la operación que estaba en el tiempo `t`, asumiendo que esa
operación es invertible.

## Intuición

No hace falta localizar `t` en ninguna representación de la línea de tiempo
ni reproducir lo que pasó desde ahí: si en `t` había `op`, aplicar su
inversa `op⁻¹` ahora cancela exactamente el efecto que `op` tuvo sobre el
presente — es el mismo argumento de [insert-retroactive](/structures/commutative-invertible-retroactivity/operations/insert-retroactive)
aplicado a `op⁻¹` en vez de a `op`.

## Algoritmo

1. Identificar `op`, la operación que estaba en el tiempo `t` (se asume
   conocida — típicamente registrada al momento de insertarla).
2. Aplicar `op⁻¹` sobre la estructura presente (por el argumento de
   `insert-retroactive`, insertar `op⁻¹` "ahora" tiene el mismo efecto que
   insertarla en `t`, por conmutatividad).

## Pseudocódigo

```
Delete(t)      ≡  Insert(ahora, op⁻¹)        // por invertibilidad, si en t estaba op
```

(páginas 25-26, diapositiva 10)

## C++

Ver `step-3-delete-retroactive.cpp` y `full-implementation.cpp` en el
editor de arriba.

## Complejidad temporal

`O(1)` amortizado — se reduce a un `Insert` de `op⁻¹` (ver
`insert-retroactive`), así que hereda el mismo costo que la operación
original, sin trabajo extra por ser un borrado retroactivo. Ver `meta.yaml`.

## Complejidad espacial

El profesor no la da. Como con `insert-retroactive`, no se necesita ninguna
estructura auxiliar más allá de la operación presente.

## Ejemplo

*(derivado del pseudocódigo; no aparece en las diapositivas)*: continuando
el acumulador del ejemplo de `insert-retroactive` (presente = 10, tras
insertar retroactivamente `Add(+2)` en t=0), borrar retroactivamente esa
misma operación se resuelve como `Add(-2)` aplicado ahora — la inversa de
`Add(+2)` es `Add(-2)` — y el acumulador vuelve a 8.

## Casos límite

- **La operación borrada no era invertible** (por ejemplo, un `max` que
  descartó el valor anterior): no existe `op⁻¹` que reconstruya el estado
  previo, porque aplicar `max` pierde información. La técnica no aplica; ver
  el contraejemplo en
  [examples.md](/structures/commutative-invertible-retroactivity#ejemplos).
- **Borrar dos veces la misma operación**: fuera del alcance de esta
  técnica — el profesor no lo menciona; requiere llevar cuenta de qué
  operaciones siguen "activas" en la línea de tiempo, que es exactamente el
  tipo de contabilidad que esta técnica evita necesitar.
- **`t` en el presente**: caso degenerado, análogo al de `insert-retroactive`.
