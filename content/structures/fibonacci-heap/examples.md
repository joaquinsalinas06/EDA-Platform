---
kind: examples
title: Ejemplos
---

## Mínimo

Un montículo con un solo nodo, `Insert(H, 5)` sobre un `H` vacío: se crea
un árbol de un solo nodo, se agrega como única raíz, y como `min(H)` era
nulo, `min(H) ← 5`. `Extract-Min(H)` sobre ese montículo devuelve `5` y,
como era la única raíz sin hijos, deja `min(H) ← nulo` sin llamar a
Consolidate — el único caso donde Extract-Min no paga ningún costo de
reordenamiento.

*(Derivado del pseudocódigo; no aparece en las diapositivas.)*

## Normal

El único ejemplo que trae el mazo, verificado visualmente, es simbólico y
de una sola operación: la cadena `G → P → C` de
[Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut)
(páginas 16-18, diapositiva 9). Para un ejemplo completo con llaves
numéricas, se deriva la siguiente traza:

Sea `H` vacío. Se ejecuta `Insert(H, 7)`, `Insert(H, 3)`, `Insert(H, 5)`:
las tres quedan como raíces sueltas de grado 0, y `min(H) = 3`. Se llama
`Extract-Min(H)`:

1. `z ← min(H) = 3`. `3` no tiene hijos, así que el paso de "subir hijos"
   no hace nada.
2. Se quita `3` de la lista de raíces (quedan `{7, 5}`); como `3` no era
   la única raíz, `min(H) ←` alguna de las restantes y se llama
   `Consolidate(H)`.
3. `Consolidate` recorre `{7, 5}` — ver la visualización paso a paso en
   [Consolidate](/structures/fibonacci-heap/operations/consolidate) para
   el mismo caso con una raíz extra de grado 0 — y como ambas tienen
   grado 0, se enlazan: `Binomial-Link(7, 5)` hace de `7` hijo de `5`
   (porque `7 > 5`). Resultado: una sola raíz, `5`, de grado 1, con `7`
   como hijo. `min(H) = 5`.

*(Derivado del pseudocódigo; no aparece en las diapositivas.)*

## Límite

El peor caso real de una sola llamada a `Extract-Min` ocurre cuando la
raíz mínima tiene grado `D(n) = O(lg n)` (el máximo posible) y además hay
muchas raíces sueltas adicionales que consolidar: se suben hasta `D(n)`
hijos a la lista de raíces y luego se recorren y enlazan `t(H)` raíces en
total, dando el costo real `O(D(n) + t(H))` de la tabla de complejidad.

Sin embargo, ese peor caso real **no** es el peor caso amortizado: el
análisis con `Φ(H) = t(H) + 2·m(H)` muestra que, sin importar cuántas
raíces `t(H)` haya antes de consolidar, siempre quedan a lo más `D(n) + 1`
después — esa caída de potencial paga exactamente el trabajo extra de
recorrer muchas raíces, dejando el costo amortizado en `O(D(n)) = O(lg n)`.
Es la estructura que "arregla" la debilidad de Union en `Θ(n)` del
[montículo binario](/structures/binary-heap) y la logra sin sacrificar la
velocidad de Extract-Min del [montículo binomial](/structures/binomial-heap):
la pereza de Insert/Union/Decrease-Key nunca hace que Extract-Min cueste
más, amortizadamente, de lo que ya costaba en el binomial.

*(Derivado del pseudocódigo; no aparece en las diapositivas.)*
