---
kind: theory
title: "El método del potencial"
---

## ¿Qué problema resuelve?

El análisis amortizado agregado (semana 1, Insert del [montículo
binomial](/structures/binomial-heap)) sólo dice "en promedio, cada operación
cuesta esto sobre una secuencia" — pero no explica *por qué* una operación
cara individual (un corte en cascada largo, un `Consolidate` con muchas
fusiones) queda pagada. El profesor lo enuncia así en el resumen del mazo:
"El método del potencial (Φ = t + 2m) es lo que **formaliza ese 'pago
diferido'**: por eso Decrease-Key es O(1) amortizado sin importar cuántos
cortes en cascada ocurran, y Extract-Min es O(lg n) amortizado gracias a la
cota de grado que acabamos de probar."

Es decir: resuelve el problema de *justificar* el pago diferido con una
cuenta explícita, en lugar de apelar a la intuición de "esto se cobra en
otro lado".

## Intuición

Se guarda un "saldo" — el potencial `Φ` — como una función del estado
completo de la estructura, no de una operación en particular. Cada operación
paga su costo real más el cambio en ese saldo:

- Si la operación *aumenta* el potencial (por ejemplo, Insert agrega un
  árbol a la lista de raíces), el costo amortizado es mayor que el real: la
  operación está "ahorrando" para pagar algo futuro.
- Si la operación *reduce* el potencial (por ejemplo, un corte en cascada
  desmarca nodos que ya tenían crédito acumulado), el costo amortizado es
  menor que el real: la operación está "retirando" ahorro que alguna
  operación anterior ya dejó pagado.

El truco de Decrease-Key es exactamente esto: cada corte en cascada individual
es barato de cobrarle a la operación que lo dispara *porque ya fue prepagado*
por la operación que marcó ese nodo. El método del potencial es lo que hace
ese prepago verificable con una fórmula, no con una historia.

## Estructura interna

El método tiene tres piezas, en el orden en que el profesor las da (página
32-33):

- **`Dᵢ`**: el estado de la estructura de datos después de la i-ésima
  operación (`D₀` es el estado inicial, antes de cualquier operación). El
  profesor usa esta notación sin definirla explícitamente.
- **`Φ`**: una función real sobre estados, `Φ(Dᵢ)`, elegida por quien hace el
  análisis — no por la estructura. Para el montículo de Fibonacci
  (aplicación en [fibonacci-heap](/structures/fibonacci-heap)), el profesor
  fija:

  ```
  Φ(H) = t(H) + 2·m(H)
    t(H) = número de árboles en la lista de raíces
    m(H) = número de nodos marcados
  ```

- **`ĉᵢ`**: el costo amortizado de la i-ésima operación, definido como

  ```
  ĉᵢ = cᵢ + Φ(Dᵢ) − Φ(Dᵢ₋₁)
  ```

  donde `cᵢ` es el costo real de esa operación. Al término `Φ(Dᵢ) − Φ(Dᵢ₋₁)`
  se le llama `ΔΦ` en las aplicaciones (páginas 34-42).

El invariante que hace que todo esto sirva para algo es la **condición de
validez** (página 32): "si Φ nunca cae por debajo de su valor inicial, la
suma de costos amortizados acota por arriba la suma de costos reales". No es
un invariante sobre la estructura de datos en sí — es una condición sobre la
elección de `Φ`, que quien analiza debe verificar.

## Operaciones

No aplica: `operations: []` en el knowledge map. El método del potencial no
tiene una interfaz con operaciones propias — sus "pasos" son siempre los
mismos, sin importar la estructura a la que se le aplique:

1. Elegir `Φ`, una función del estado completo.
2. Para cada operación de costo real `cᵢ`, calcular `ΔΦ = Φ(Dᵢ) − Φ(Dᵢ₋₁)`.
3. El costo amortizado es `ĉᵢ = cᵢ + ΔΦ`.
4. Sumar sobre la secuencia completa de operaciones.

La aplicación completa de estos cuatro pasos a Insert, Union, Decrease-Key y
Extract-Min vive en [fibonacci-heap](/structures/fibonacci-heap) (páginas
34-42 del mazo), que es quien la usa. Aquí sólo se traza el mecanismo con
esos mismos cuatro casos como ilustración (ver [examples.md](/structures/potential-method#ejemplos)),
sin repetir el análisis de la estructura completa.

## Análisis de complejidad

La razón por la que la condición de validez basta para acotar el costo real
total es una **suma telescópica** — el profesor la da como resultado, sin
derivarla (hueco que el material asume resuelto):

```
Σᵢ₌₁ⁿ ĉᵢ = Σᵢ₌₁ⁿ (cᵢ + Φ(Dᵢ) − Φ(Dᵢ₋₁))
         = Σᵢ₌₁ⁿ cᵢ + (Φ(Dₙ) − Φ(D₀))      ← los términos intermedios se cancelan
```

Si además `Φ(Dₙ) ≥ Φ(D₀)` para todo n — la condición de validez, "Φ nunca
cae por debajo de su valor inicial" —, entonces:

```
Σᵢ₌₁ⁿ ĉᵢ = Σᵢ₌₁ⁿ cᵢ + (Φ(Dₙ) − Φ(D₀)) ≥ Σᵢ₌₁ⁿ cᵢ
```

es decir, la suma de costos amortizados es una cota superior válida de la
suma de costos reales — que es exactamente lo que se necesita para acotar el
costo total de una secuencia de operaciones. Nótese que esto funciona para
*cualquier* `Φ` que cumpla la condición: elegir un buen `Φ` (uno que cancele
los términos costosos, como `2·m(H)` cancela los cortes en cascada) es lo que
hace que la cota amortizada resultante sea ajustada y útil, no sólo válida.

Para verificar la condición en la práctica basta con `Φ(H) = t(H) + 2·m(H) ≥
0` siempre (ambos términos son conteos, nunca negativos) — el profesor no lo
verifica explícitamente porque es inmediato, pero es la razón por la que el
`Φ` elegido para Fibonacci sí satisface la condición de validez.

## Tabla de complejidad

No aplica: `meta.yaml` deja `complexity: {}` a propósito. El método del
potencial no tiene un costo propio que tabular — produce cotas de costo
*para otras estructuras* (ver la tabla de complejidad de
[fibonacci-heap](/structures/fibonacci-heap), que es donde ese resultado se
reporta).

## Ejemplos

Ver [examples.md](/structures/potential-method#ejemplos) — las cuatro
aplicaciones del mazo (Insert, Union, Decrease-Key, Extract-Min) trazadas
paso a paso sobre la fórmula, del caso donde `ΔΦ` es trivial al caso donde el
término `c` de los cortes en cascada se cancela contra `ΔΦ`.

## Comparación con estructuras relacionadas

| | análisis agregado (semana 1) | método del potencial |
| --- | --- | --- |
| qué acota | el promedio de la secuencia completa, de una sola vez | cada operación individual, vía `ĉᵢ = cᵢ + ΔΦ` |
| de dónde sale la cota | contar directamente sobre la secuencia (ej. bits que cambian en el contador binario) | elegir una función `Φ` del estado y verificar que no caiga bajo su valor inicial |
| ejemplo del profesor | Insert del [montículo binomial](/structures/binomial-heap): contador binario, sin potencial | Insert/Union/Decrease-Key/Extract-Min del [montículo de Fibonacci](/structures/fibonacci-heap) |
| qué explica que el análisis agregado no explica | por qué una operación cara puntual (un corte en cascada largo) queda pagada, sin apelar sólo al promedio | — |

## Prueba de dominio

Ver [mastery-check.md](/structures/potential-method#prueba-de-dominio).
