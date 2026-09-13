---
kind: operation
title: Insert retroactivo
order: 1
cppSteps:
  - step-1-accumulator.cpp
  - step-2-insert-retroactive.cpp
  - step-3-delete-retroactive.cpp
  - step-4-noncommutative-counterexample.cpp
  - full-implementation.cpp
---

## Qué hace

Inserta la operación `op` en el tiempo `t` de la línea de tiempo (que puede
ser un tiempo pasado), asumiendo que `op` conmuta con cualquier otra
operación de la estructura.

## Intuición

Como `op` conmuta con todo lo demás, no importa en qué posición de la línea
de tiempo se aplique realmente: el efecto sobre la estructura presente es el
mismo si se aplica en `t` (y se deja que "viaje" hacia adelante conmutando
con cada operación intermedia) que si se aplica directamente ahora. No hace
falta representar la línea de tiempo ni reproducir nada entre `t` y el
presente.

## Algoritmo

1. Verificar (fuera del alcance de esta operación, es una condición previa
   sobre la estructura) que `op` conmuta con toda otra operación aplicable.
2. Aplicar `op` directamente sobre la estructura presente.

## Pseudocódigo

```
Insert(t, op)  ≡  Insert(ahora, op)          // por conmutatividad
```

(páginas 25-26, diapositiva 10)

## C++

Ver `step-2-insert-retroactive.cpp` y `full-implementation.cpp` en el editor
de arriba.

## Complejidad temporal

`O(1)` amortizado — igual que aplicar la operación original sobre la
estructura de base, porque no hay ningún trabajo adicional que hacer por ser
"retroactiva": es literalmente la misma llamada, sólo reetiquetada. Ver
`meta.yaml` para el razonamiento completo.

## Complejidad espacial

El profesor no la da. No se necesita guardar la línea de tiempo completa
para sostener retroactividad parcial con esta técnica: basta la estructura
presente.

## Ejemplo

*(derivado del pseudocódigo; no aparece en las diapositivas)*: sobre un
acumulador que soporta `Add(Δ)` (conmutativa: sumar en cualquier orden da el
mismo total), con historial real `Add(+3)` en t=1 y `Add(+5)` en t=2
(acumulador presente = 8), insertar retroactivamente `Add(+2)` en t=0 (antes
de ambas) se resuelve como `Add(+2)` aplicado ahora: acumulador presente =
10. No hace falta reproducir `Add(+3)` ni `Add(+5)`.

## Casos límite

- **`op` no conmuta con alguna operación de la estructura** (por ejemplo,
  una asignación `A[i] = v`): la equivalencia `Insert(t, op) ≡ Insert(ahora,
  op)` deja de ser válida, porque el resultado sí depende de dónde caiga
  `op` respecto a las demás. Esta técnica no aplica; ver el contraejemplo en
  [examples.md](/structures/commutative-invertible-retroactivity#ejemplos).
- **Insertar la misma llave dos veces** en el ejemplo de la tabla hash: el
  profesor advierte de pasada (sin desarrollarlo) que insertar una llave
  *nueva* conmuta con insertar otra llave *distinta*, pero insertar la misma
  llave dos veces no conmuta de la misma manera con su propia repetición.
- **`t` en el presente**: caso degenerado donde `Insert(t, op) ≡ Insert(ahora,
  op)` es trivialmente cierto porque `t` ya es "ahora".
