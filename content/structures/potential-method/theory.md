---
kind: theory
title: "El método del potencial"
visualization:
  type: tree
  steps:
    - note: >-
        Estado inicial D0 de un montículo de Fibonacci (derivado, no aparece
        tal cual en las diapositivas): t=5 árboles, m=2 nodos marcados ⇒
        Φ=t+2m=9. Este es el saldo del que parte toda la secuencia; no hay
        todavía costo real ni ΔΦ que calcular.
      caption: "Φ(D₀) = t + 2m = 5 + 2·2 = 9"
      nodes:
        - { id: phi, value: 9 }
    - note: >-
        Insert (pág. 34): agrega un árbol de un nodo, t pasa a 6, m no
        cambia. El costo real cᵢ=O(1) es barato, pero el potencial SUBE
        (ΔΦ=+1): la operación "ahorra" de más, dejando crédito para pagar
        algo futuro más caro (un corte en cascada, un Consolidate).
      caption: "cᵢ=O(1)   ΔΦ=Φ(D₁)−Φ(D₀)=10−9=+1   ĉᵢ=cᵢ+ΔΦ=O(1)+1=O(1)"
      highlight: ["phi"]
      nodes:
        - { id: phi, value: 10, state: active }
    - note: >-
        Union (pág. 35): concatena dos listas circulares de raíces sin
        cambiar t ni m (se suman, no se recalculan). Aquí el costo
        amortizado coincide exactamente con el real: no hay nada que
        prepagar ni que cobrar todavía, ΔΦ=0.
      caption: "cᵢ=O(1)   ΔΦ=Φ(D₂)−Φ(D₁)=10−10=0   ĉᵢ=cᵢ+ΔΦ=O(1)+0=O(1)"
      nodes:
        - { id: phi, value: 10 }
    - note: >-
        Decrease-Key con c=3 cortes en cascada (derivado: c=3 sobre el
        estado anterior). El costo real cᵢ=O(c)=3 es proporcional a la
        cascada, pero el potencial CAE (ΔΦ≤4−c=1 en el peor caso aquí
        tomado como −4, ya que los tres cortes desmarcan nodos que ya
        tenían crédito acumulado desde Insert): la caída de Φ absorbe casi
        todo el trabajo extra de los cortes, dejando ĉᵢ=O(1) sin importar
        cuán larga sea la cascada.
      caption: "cᵢ=O(c)=3   ΔΦ=Φ(D₃)−Φ(D₂)=11−10=+1 (≤4−c)   ĉᵢ=cᵢ+ΔΦ=3+1=O(1)"
      highlight: ["phi"]
      nodes:
        - { id: phi, value: 11, state: active }
    - note: >-
        Extract-Min (pág. 39-42, derivado sobre este mismo estado): mover
        los hijos de la raíz mínima sube t a 9 de golpe, y Consolidate lo
        reduce hasta D(n)+1=4 raíces. El costo real cᵢ=O(D(n)+t(H))=12 es
        el más caro de las cuatro operaciones, pero el potencial CAE fuerte
        (ΔΦ=−5): es la única que no queda en O(1) amortizado — el potencial
        no alcanza a cancelar todo el trabajo de recorrer las raíces
        viejas, sólo a bajarlo de O(t(H)) a O(D(n)).
      caption: "cᵢ=O(D(n)+t(H))=12   ΔΦ=Φ(D₄)−Φ(D₃)=6−11=−5   ĉᵢ=cᵢ+ΔΦ=12−5=O(D(n))=7"
      highlight: ["phi"]
      nodes:
        - { id: phi, value: 6, state: active }
---

## ¿Qué problema resuelve?

El análisis amortizado agregado (semana 1, Insert del [montículo
binomial](/structures/binomial-heap)) sólo dice "en promedio, cada operación
cuesta esto sobre una secuencia" — pero no explica *por qué* una operación
cara individual (un corte en cascada largo, un `Consolidate` con muchas
fusiones) queda pagada. El profesor lo enuncia así en el resumen del mazo:
"El método del potencial ($\Phi = t + 2m$) es lo que **formaliza ese 'pago
diferido'**: por eso Decrease-Key es $O(1)$ amortizado sin importar cuántos
cortes en cascada ocurran, y Extract-Min es $O(\lg n)$ amortizado gracias a la
cota de grado que acabamos de probar."

Es decir: resuelve el problema de *justificar* el pago diferido con una
cuenta explícita, en lugar de apelar a la intuición de "esto se cobra en
otro lado".

## Intuición

Se guarda un "saldo" — el potencial $\Phi$ — como una función del estado
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

- **$D_i$**: el estado de la estructura de datos después de la i-ésima
  operación ($D_0$ es el estado inicial, antes de cualquier operación). El
  profesor usa esta notación sin definirla explícitamente.
- **$\Phi$**: una función real sobre estados, $\Phi(D_i)$, elegida por quien hace el
  análisis — no por la estructura. Para el montículo de Fibonacci
  (aplicación en [fibonacci-heap](/structures/fibonacci-heap)), el profesor
  fija:

  $$\Phi(H) = t(H) + 2 \cdot m(H)$$

  donde $t(H)$ es el número de árboles en la lista de raíces y $m(H)$ el
  número de nodos marcados.

- **$\hat{c}_i$**: el costo amortizado de la i-ésima operación, definido como

  $$\hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1})$$

  donde $c_i$ es el costo real de esa operación. Al término $\Phi(D_i) - \Phi(D_{i-1})$
  se le llama $\Delta\Phi$ en las aplicaciones (páginas 34-42).

El invariante que hace que todo esto sirva para algo es la **condición de
validez** (página 32): "si Φ nunca cae por debajo de su valor inicial, la
suma de costos amortizados acota por arriba la suma de costos reales". No es
un invariante sobre la estructura de datos en sí — es una condición sobre la
elección de $\Phi$, que quien analiza debe verificar.

## Operaciones

No aplica: `operations: []` en el knowledge map. El método del potencial no
tiene una interfaz con operaciones propias — sus "pasos" son siempre los
mismos, sin importar la estructura a la que se le aplique:

1. Elegir $\Phi$, una función del estado completo.
2. Para cada operación de costo real $c_i$, calcular $\Delta\Phi = \Phi(D_i) - \Phi(D_{i-1})$.
3. El costo amortizado es $\hat{c}_i = c_i + \Delta\Phi$.
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

$$
\sum_{i=1}^{n} \hat{c}_i = \sum_{i=1}^{n} \big(c_i + \Phi(D_i) - \Phi(D_{i-1})\big)
= \sum_{i=1}^{n} c_i + \big(\Phi(D_n) - \Phi(D_0)\big)
$$

(los términos intermedios se cancelan: es una suma telescópica.)

Si además $\Phi(D_n) \ge \Phi(D_0)$ para todo n — la condición de validez, "Φ nunca
cae por debajo de su valor inicial" —, entonces:

$$
\sum_{i=1}^{n} \hat{c}_i = \sum_{i=1}^{n} c_i + \big(\Phi(D_n) - \Phi(D_0)\big) \geq \sum_{i=1}^{n} c_i
$$

es decir, la suma de costos amortizados es una cota superior válida de la
suma de costos reales — que es exactamente lo que se necesita para acotar el
costo total de una secuencia de operaciones. Nótese que esto funciona para
*cualquier* $\Phi$ que cumpla la condición: elegir un buen $\Phi$ (uno que cancele
los términos costosos, como $2 \cdot m(H)$ cancela los cortes en cascada) es lo que
hace que la cota amortizada resultante sea ajustada y útil, no sólo válida.

Para verificar la condición en la práctica basta con $\Phi(H) = t(H) + 2 \cdot m(H) \ge
0$ siempre (ambos términos son conteos, nunca negativos) — el profesor no lo
verifica explícitamente porque es inmediato, pero es la razón por la que el
$\Phi$ elegido para Fibonacci sí satisface la condición de validez.

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
| qué acota | el promedio de la secuencia completa, de una sola vez | cada operación individual, vía $\hat{c}_i = c_i + \Delta\Phi$ |
| de dónde sale la cota | contar directamente sobre la secuencia (ej. bits que cambian en el contador binario) | elegir una función $\Phi$ del estado y verificar que no caiga bajo su valor inicial |
| ejemplo del profesor | Insert del [montículo binomial](/structures/binomial-heap): contador binario, sin potencial | Insert/Union/Decrease-Key/Extract-Min del [montículo de Fibonacci](/structures/fibonacci-heap) |
| qué explica que el análisis agregado no explica | por qué una operación cara puntual (un corte en cascada largo) queda pagada, sin apelar sólo al promedio | — |

## Prueba de dominio

Ver [mastery-check.md](/structures/potential-method#prueba-de-dominio).
