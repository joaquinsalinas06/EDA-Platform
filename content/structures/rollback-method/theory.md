---
kind: theory
title: "Método de rollback"
---

## ¿Qué problema resuelve?

Las dos técnicas anteriores de esta semana ([retroactividad conmutativa e
invertible](/structures/commutative-invertible-retroactivity) y los
problemas de búsqueda descomponibles) sólo aplican cuando la estructura
cumple una propiedad fuerte (conmutatividad + invertibilidad, o
descomponibilidad). El método de rollback es la respuesta a "¿y si no
cumple ninguna de las dos?" — textual: "**Cuando nada de lo anterior
aplica.** Guardamos la secuencia completa de operaciones (un log). Para
`Insert(t, op)` o `Delete(t)`: deshacemos (rollback) todas las operaciones
posteriores a t, aplicamos el cambio, y las rehacemos en orden."

Es la técnica bruta pero general: no exige nada de la estructura salvo que
cada operación (y su inversa) sea reversible y barata. Por eso el interés
del método no está en cómo funciona — es la idea de deshacer y rehacer, la
más obvia posible — sino en **cuánto cuesta hacerlo así**.

## Intuición

Se guarda el [modelo de retroactividad](/structures/retroactivity) completo
como un log de operaciones ordenado en el tiempo. Para cambiar el pasado en
el tiempo `t`, no hay ningún atajo algebraico disponible: hay que
literalmente "rebobinar" la estructura hasta `t`, deshaciendo cada operación
posterior una por una (en orden inverso), aplicar ahí el cambio, y luego
"reproducir" de nuevo esas mismas operaciones en orden hacia adelante.

## Estructura interna

- **El log**: la secuencia completa de operaciones aplicadas, ordenada por
  tiempo. Es la misma noción de línea de tiempo del
  [modelo de retroactividad](/structures/retroactivity), pero aquí se
  materializa explícitamente como una lista que se puede recorrer en ambos
  sentidos.
- **Invertibilidad de cada operación**: el método reutiliza exactamente la
  noción de invertibilidad definida en
  [retroactividad conmutativa e invertible](/structures/commutative-invertible-retroactivity)
  — "existe una operación `opₓ⁻¹` tal que aplicar `opₓ` y luego `opₓ⁻¹` deja
  la estructura exactamente como estaba" — pero aquí **no se exige además
  conmutatividad**. Esa es la diferencia entre las dos técnicas: la anterior
  necesita ambas propiedades para volverse casi gratis; ésta sólo necesita
  invertibilidad, y paga el precio de no tener conmutatividad rehaciendo
  todo en orden.
- **El requisito de costo por operación** (página 40): "Que cada operación
  (y su inversa) sea $O(1)$ u $O(\lg n)$ — cualquier estructura eficiente y
  reversible sirve." El método no impone una estructura subyacente
  particular: cualquiera que sea reversible y eficiente por operación
  individual funciona.

## Operaciones

- [Deshacer y rehacer (rollback-replay)](/structures/rollback-method/operations/rollback-replay) —
  el mecanismo de `Insert(t, op)` y `Delete(t)` retroactivos.
- [El costo amortizado del método (amortized-cost)](/structures/rollback-method/operations/amortized-cost) —
  no es una operación ejecutable, sino el análisis de cuánto cuesta el
  mecanismo anterior: el conteo directo del trabajo rehecho y la cota
  inferior que lo acompaña.

## Análisis de complejidad

Ver el desglose completo en
[amortized-cost](/structures/rollback-method/operations/amortized-cost) — el
análisis ES el contenido de esta técnica, no un apéndice. En resumen: el
costo de `Insert(t, op)` o `Delete(t)` es $O(r)$ veces el costo de una
operación individual, con `r` = número de operaciones posteriores a `t` en
el log; y el profesor da además una cota inferior $\Omega(r)$ que muestra que, en
general, no se puede hacer mejor sin explotar alguna propiedad extra de la
estructura.

## Tabla de complejidad

| operación | peor caso | de dónde sale |
| --- | --- | --- |
| `Insert(t, op)` / `Delete(t)` | `O(r) × (costo de una operación individual)`, `r` = operaciones después de `t` | conteo directo: deshacer `r`, aplicar 1, rehacer `r` |
| cota inferior | $\Omega(r)$ | argumento de adversario informal (ver amortized-cost) |

El profesor no cuantifica el costo en espacio del log (queda implícito: hay
que guardarlo completo).

## Ejemplos

Ver [examples.md](/structures/rollback-method/examples) — el profesor no da
ningún ejemplo numérico en esta sección, así que los ejemplos ahí están
derivados y marcados como tales.

## Comparación con estructuras relacionadas

| | [retroactividad conmutativa e invertible](/structures/commutative-invertible-retroactivity) | método de rollback |
| --- | --- | --- |
| qué exige | conmutatividad **e** invertibilidad | sólo invertibilidad |
| costo retroactivo | $O(1)$ — igual que la operación original | `O(r)` × costo de una operación, con `r` = operaciones después de `t` |
| por qué | la posición temporal es irrelevante por conmutatividad; borrar es aplicar la inversa | no hay atajo: hay que rehacer todo lo posterior en orden |
| alcance | sólo estructuras cuyas operaciones cumplen ambas propiedades | cualquier estructura con operaciones reversibles y eficientes — el piso genérico |

El profesor lo posiciona explícitamente como ese piso: "las técnicas
especializadas (como la de la siguiente sección) son valiosas: **rompen esta
barrera** aprovechando propiedades específicas del problema" — la
[cola de prioridad retroactiva](/structures/retroactive-priority-queue) cita
este método dos veces como la cota a superar.

## Prueba de dominio

Ver [mastery-check.md](/structures/rollback-method/mastery-check).
