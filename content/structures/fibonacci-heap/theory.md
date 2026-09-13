---
kind: theory
title: "Montículo de Fibonacci"
---

## ¿Qué problema resuelve?

El profesor lo formula como propiedad, no como problema externo: "¿Por qué
es tan rápido insert, union y decrease-key? Porque no reorganizan nada de
inmediato: solo agregan el nuevo nodo/árbol a la lista de raíces en O(1), o
cortan un nodo y lo agregan como raíz en O(1). Todo el 'desorden' se limpia
recién en Extract-Min". En el resumen del mazo: "el montículo de Fibonacci
es **perezoso**". Es la cola de prioridad que logra `Insert`, `Union` y
`Decrease-Key` en O(1) amortizado, pagando ese trabajo pospuesto de golpe
en `Extract-Min`. La [tabla comparativa de la semana 1](/structures/binary-heap#comparación-con-estructuras-relacionadas)
ya anunciaba esta mejora frente al [montículo binario](/structures/binary-heap)
y el [montículo binomial](/structures/binomial-heap).

## Intuición

Una colección de árboles con raíz — "no necesariamente binomiales", a
diferencia del binomial — organizados en una lista circular de raíces, con
un puntero directo `min(H)` al menor. Insertar y unir son casi gratis
porque sólo empalman listas. La pereza tiene un precio: los árboles se
dejan crecer desordenados, y sólo cuando hace falta encontrar el mínimo
después de extraerlo (`Extract-Min`) se paga, de una sola vez, el trabajo
de reordenar (`Consolidate`) — igual que en un montículo binomial, fusionar
árboles del mismo grado hasta que todos los grados en la lista de raíces
sean distintos.

`Decrease-Key` añade una segunda idea: cuando bajar una llave rompe el
invariante de montículo mínimo con el padre, el nodo se corta y sube a la
lista de raíces en O(1) — pero cortar demasiados hijos del mismo padre sin
control destruiría la cota de grado que hace rápido a `Extract-Min`. La
**regla de las marcas** limita el daño: "cada nodo puede perder a lo mucho
un hijo sin ser cortado de su propio padre". Perder un segundo hijo
dispara un corte en cascada hacia arriba.

## Estructura interna

Cada nodo guarda: `llave`, `grado` (número de hijos), `padre`, un puntero a
un hijo, punteros de lista circular doblemente enlazada entre hermanos, y
`marca(x)` — un booleano.

Invariantes:

- **Montículo mínimo** en cada árbol: la llave de un nodo es menor o igual
  que la de sus hijos (igual que en [binary-heap](/structures/binary-heap),
  pero aquí sobre árboles de grado arbitrario, no un arreglo).
- **Las raíces nunca están marcadas** (página 20 del mazo) — invariante
  explícita y crítica: `marca` sólo tiene sentido en un nodo que tiene
  padre.
- **Regla de las marcas**: un nodo no-raíz que ya perdió un hijo se marca
  (`marca(x) ← verdadero`); si pierde un *segundo* hijo, se corta de su
  propio padre en cascada. `marca(x)` se activa la primera vez que `x`
  pierde un hijo desde que se convirtió en hijo de alguien, y se resetea a
  `falso` en cuanto `x` mismo se corta y pasa a la lista de raíces (`Cut`
  lo pone en `falso` explícitamente).

Esta regla está formulada como "a lo más un hijo perdido sin corte" — y no,
por ejemplo, "nunca perder un hijo" — porque es exactamente lo que la
demostración de la cota de grado `D(n) = O(lg n)` necesita: acota cuánto
puede haber decrecido el grado de un hijo desde que se enlazó, sin prohibir
que decrezca del todo (eso volvería la estructura demasiado rígida para que
`Decrease-Key` siga siendo O(1) amortizado).

## Operaciones

- [Insert](/structures/fibonacci-heap/operations/insert) — agrega un
  nodo nuevo como árbol de un solo elemento a la lista de raíces.
- [Union](/structures/fibonacci-heap/operations/union) — concatena dos
  listas de raíces.
- [Cut](/structures/fibonacci-heap/operations/cut) — separa un nodo de su
  padre y lo agrega como raíz.
- [Cascading-Cut](/structures/fibonacci-heap/operations/cascading-cut) —
  aplica la regla de las marcas, subiendo el corte por la cadena de
  ancestros si hace falta.
- [Decrease-Key](/structures/fibonacci-heap/operations/decrease-key) —
  baja una llave y, si rompe el invariante con el padre, dispara `Cut` y
  `Cascading-Cut`.
- [Consolidate](/structures/fibonacci-heap/operations/consolidate) —
  fusiona árboles de igual grado hasta que todos los grados en la lista de
  raíces son distintos.
- [Extract-Min](/structures/fibonacci-heap/operations/extract-min) —
  retira la raíz mínima, sube sus hijos a la lista de raíces y llama a
  `Consolidate`.

`Find-Min` y `Delete` **no tienen pseudocódigo ni análisis en este mazo**:
sólo aparecen con su complejidad (`Θ(1)` y `O(lg n)` respectivamente) en la
tabla comparativa de la semana 1. `Find-Min` existe implícitamente como
leer el puntero `min(H)` que `Insert` y `Union` mantienen; no se documenta
como operación separada aquí.

## Análisis de complejidad

El profesor introduce aquí, por primera vez en el curso, el
**[método del potencial](/structures/potential-method)**: define el costo
amortizado de la operación `i` como `ĉᵢ = cᵢ + Φ(Dᵢ) − Φ(Dᵢ₋₁)`, con la
condición de que si `Φ` nunca cae por debajo de su valor inicial, la suma
de costos amortizados acota por arriba la suma de costos reales. El
potencial concreto que fija para este montículo es:

```
Φ(H) = t(H) + 2·m(H)
```

donde `t(H)` es el número de árboles en la lista de raíces y `m(H)` el
número de nodos marcados. Aplicado operación por operación:

- **Insert**: agrega un árbol, `t(H)` sube en 1, `m(H)` no cambia →
  `ΔΦ = 1`. Costo amortizado `ĉ = O(1) + 1 = O(1)`.
- **Union**: concatenar no cambia ni `t(H)` ni `m(H)` (la suma de ambos se
  conserva) → `ΔΦ = 0`. Costo amortizado `ĉ = O(1)`.
- **Decrease-Key**: con `c` cortes reales en cascada, cada corte agrega un
  árbol (+1 a `t(H)`) y desmarca un nodo (−2 al potencial por ese nodo),
  salvo el último de la cadena, que sólo se marca (+2). El profesor acota
  `ΔΦ ≤ 4 − c`, y el costo amortizado
  `ĉᵢ = O(c) + (4 − c) = O(1)`: cuantos más cortes reales hace la
  operación, más cae el potencial, y esa caída paga exactamente el trabajo
  extra.
- **Extract-Min**: tras mover los hijos de la raíz mínima y consolidar,
  quedan a lo más `D(n) + 1` árboles (contra los `t(H)` de antes), así que
  `ΔΦ ≤ (D(n) + 1) − t(H)`. El costo amortizado resulta
  `ĉ = O(D(n) + t(H)) + (D(n) + 1) − t(H) = O(D(n))`.

Todo esto depende de la cota estructural `D(n) = O(lg n)` (el grado máximo
posible de cualquier nodo), que el profesor prueba con un argumento
**combinatorio/inductivo** separado (páginas 24-31), subordinado al
potencial:

Sea `x` un nodo de grado `k`, con hijos `y₁, …, y_k` en el orden en que se
enlazaron. Cuando `yᵢ` se convirtió en el i-ésimo hijo de `x`, `x` ya tenía
al menos `i − 1` hijos previos (`y₁, …, y_{i−1}`) — y por cómo enlaza
`Consolidate` (dos árboles se enlazan sólo si tienen el mismo grado),
`yᵢ` tenía en ese momento grado al menos `i − 1` también. Por la regla de
las marcas, desde entonces `yᵢ` puede haber perdido a lo mucho un hijo sin
haber sido cortado de `x`; su grado actual es, entonces, al menos `i − 2`.
Sea `s_k` el número mínimo de nodos que puede tener un árbol cuya raíz
tiene grado `k`. Contando la raíz, más al menos 1 nodo del hijo `y₁`
(grado 0 en el peor caso), más al menos `s_{i−2}` nodos por cada hijo
`yᵢ` con `i ≥ 2`:

```
s_k ≥ 2 + Σ_{i=0}^{k−2} s_i
```

Esta es exactamente la recurrencia de los números de Fibonacci
(`s_k ≥ F_{k+2}`, demostrable por inducción), y el **Teorema** que cierra
el argumento dice: "el número mínimo de nodos en un árbol cuya raíz tiene
grado k es `F_{k+2}}`", con `F_{k+2} = Θ(φ^k)` y `φ = (1+√5)/2` la razón
áurea. Como `n ≥ s_k = Θ(φ^k)`, despejar `k` da `D(n) = O(lg n)` — de ahí
el nombre de la estructura: la cota de grado crece tan lento como
Fibonacci crece rápido.

## Tabla de complejidad

La tabla se genera desde `meta.yaml`. El profesor nunca distingue
mejor/promedio/peor caso ni menciona espacio en este mazo (igual que en
[binary-heap](/structures/binary-heap) y
[binomial-heap](/structures/binomial-heap)): da un costo real y, cuando
corresponde, uno amortizado — ambos aparecen en el `reasoning` de cada
operación.

## Ejemplos

Ver [Ejemplos](/structures/fibonacci-heap/examples).

## Comparación con estructuras relacionadas

| | Insert | Union | Decrease-Key | Extract-Min |
| --- | --- | --- | --- | --- |
| [Montículo binario](/structures/binary-heap) | Θ(lg n) | Θ(n) | Θ(lg n) | Θ(lg n) |
| [Montículo binomial](/structures/binomial-heap) | O(lg n) | O(lg n) | O(lg n) | O(lg n) |
| Montículo de Fibonacci | O(1) amortizado | O(1) amortizado | O(1) amortizado | O(lg n) amortizado |

El mazo de semana 2 no reproduce esta tabla comparativa (viene de la
semana 1); se arma aquí a partir de las tres estructuras ya documentadas.
La ganancia declarada de Fibonacci sobre binomial es exactamente pasar
Insert, Union y Decrease-Key de O(lg n) a O(1) amortizado, siendo perezoso.

## Prueba de dominio

Ver [Prueba de dominio](/structures/fibonacci-heap/mastery-check).
