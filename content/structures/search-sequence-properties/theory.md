---
kind: theory
title: "Propiedades de análisis de secuencias de búsqueda"
visualization:
  type: tree
  steps:
    - note: >-
        Secuencia fácil (acceso secuencial): x1=1. Primera búsqueda, sin
        patrón previo que aprovechar todavía.
      highlight: ["k1"]
      nodes:
        - { id: k4, value: 4 }
        - { id: k2, value: 2, parent: k4, side: left }
        - { id: k6, value: 6, parent: k4, side: right }
        - { id: k1, value: 1, parent: k2, side: left, state: active }
        - { id: k3, value: 3, parent: k2, side: right }
        - { id: k5, value: 5, parent: k6, side: left }
        - { id: k7, value: 7, parent: k6, side: right }
    - note: >-
        x2=2, a un paso de x1 (k_2=1): el puntero dinámico ya está cerca de
        la búsqueda anterior. O(1) amortizado.
      highlight: ["k2"]
      nodes:
        - { id: k4, value: 4 }
        - { id: k2, value: 2, parent: k4, side: left, state: active }
        - { id: k6, value: 6, parent: k4, side: right }
        - { id: k1, value: 1, parent: k2, side: left }
        - { id: k3, value: 3, parent: k2, side: right }
        - { id: k5, value: 5, parent: k6, side: left }
        - { id: k7, value: 7, parent: k6, side: right }
    - note: >-
        x3=3, otra vez k_3=1: la diagonal de acceso secuencial se sostiene.
        Toda la secuencia {1,2,3,...} cuesta O(1) por búsqueda, amortizado.
      highlight: ["k3"]
      nodes:
        - { id: k4, value: 4 }
        - { id: k2, value: 2, parent: k4, side: left }
        - { id: k6, value: 6, parent: k4, side: right }
        - { id: k1, value: 1, parent: k2, side: left }
        - { id: k3, value: 3, parent: k2, side: right, state: active }
        - { id: k5, value: 5, parent: k6, side: left }
        - { id: k7, value: 7, parent: k6, side: right }
    - note: >-
        Mismo árbol, secuencia cara: x4=7 tras x3=3 (k_4=4, salto grande).
        Ninguna de las cinco propiedades da una cota barata todavía.
      highlight: ["k7"]
      nodes:
        - { id: k4, value: 4 }
        - { id: k2, value: 2, parent: k4, side: left }
        - { id: k6, value: 6, parent: k4, side: right }
        - { id: k1, value: 1, parent: k2, side: left }
        - { id: k3, value: 3, parent: k2, side: right }
        - { id: k5, value: 5, parent: k6, side: left }
        - { id: k7, value: 7, parent: k6, side: right, state: active }
    - note: >-
        x5=2: otro salto grande (k_5=5) y sin repetición reciente que ayude
        al conjunto de trabajo. Sigue sin haber propiedad barata que aplique.
      highlight: ["k2"]
      nodes:
        - { id: k4, value: 4 }
        - { id: k2, value: 2, parent: k4, side: left, state: active }
        - { id: k6, value: 6, parent: k4, side: right }
        - { id: k1, value: 1, parent: k2, side: left }
        - { id: k3, value: 3, parent: k2, side: right }
        - { id: k5, value: 5, parent: k6, side: left }
        - { id: k7, value: 7, parent: k6, side: right }
    - note: >-
        x6=6: cada búsqueda de esta secuencia cuesta el peor caso O(log n)
        del modelo BST, contra el O(1) amortizado de la secuencia de arriba
        sobre el mismo árbol — la diferencia es la secuencia, no la estructura.
      highlight: ["k6"]
      nodes:
        - { id: k4, value: 4 }
        - { id: k2, value: 2, parent: k4, side: left }
        - { id: k6, value: 6, parent: k4, side: right, state: active }
        - { id: k1, value: 1, parent: k2, side: left }
        - { id: k3, value: 3, parent: k2, side: right }
        - { id: k5, value: 5, parent: k6, side: left }
        - { id: k7, value: 7, parent: k6, side: right }
---

## ¿Qué problema resuelve?

El [modelo computacional BST](/structures/bst-computational-model) establece
que, en el peor caso, `Buscar(x)` cuesta $O(\log n)$ y que ese $O(\log n)$ "es
el mejor tiempo posible" — pero enseguida observa que "el trabajo de las
búsquedas depende de la secuencia de elementos que se buscan." Ese es
exactamente el problema que abren estas propiedades: el peor caso no es la
métrica interesante, porque trata todas las secuencias como si fueran
igual de difíciles cuando no lo son. El profesor lo enuncia como el punto de
partida: hace falta una forma de medir la calidad de un BST **en función de
la secuencia de búsquedas**, no del peor caso sobre todas las secuencias
posibles.

## Intuición

Cada una de las cinco propiedades es una forma distinta de decir lo mismo:
"esta secuencia tiene un patrón que un BST que se adapta puede aprovechar,
así que sale barata en promedio (amortizado), aunque el peor caso siga
siendo $O(\log n)$." No son cinco ideas independientes — son cinco maneras de
capturar "facilidad" en una secuencia:

- **Acceso secuencial**: la secuencia entera es fácil porque siempre avanza
  en el mismo orden ({1, 2, ..., n}).
- **Puntero dinámico**: cada búsqueda individual es fácil porque está cerca
  de la anterior (aunque la secuencia global salte).
- **Cota de entropía / optimalidad estática**: la secuencia es fácil porque
  unos pocos valores se repiten mucho (poca "sorpresa" por búsqueda).
- **Conjunto de trabajo**: una búsqueda es fácil porque su valor ya se pidió
  hace poco (localidad temporal, no de valor).

Ninguna de las cuatro dice cómo lograr esa cota — eso es trabajo de una
estructura concreta que se adapte a la secuencia (el
[Splay Tree](/structures/splay-tree) es la que el profesor trae después). Lo
que este tema define es **qué significa que una secuencia sea fácil**, no
cómo aprovecharla.

## Estructura interna

No aplica en el sentido de nodos o punteros: es un conjunto de propiedades
sobre secuencias de búsqueda, definidas sobre el vocabulario que fija el
[modelo computacional BST](/structures/bst-computational-model) — llaves
enteras en $[1, n]$ y una secuencia de búsqueda $\{x_1, x_2, \dots, x_m\}$ (todas
resolubles, sin búsquedas fallidas).

Las cinco propiedades y sus dos lemas de implicación:

1. **Propiedad de acceso secuencial**: "Si la secuencia de búsqueda es
   {1, 2, ..., n}, entonces resolver todas las consultas toma O(1) por
   búsqueda (amortizado)."
2. **Propiedad del puntero dinámico**: "Si elementos consecutivos cumplen
   con $|x_i - x_{i-1}| = k_i$, entonces resolver las consultas toma
   $O(\log k_i)$ por búsqueda (amortizado)."
3. **Cota de entropía / optimalidad estática**: "Si un valor k aparece en
   una fracción $p_k$ de la secuencia, entonces resolver todas las consultas
   toma $O(\sum_k p_k \log(1/p_k))$ por búsqueda (amortizado)." Esa suma es la
   entropía de Shannon de la distribución de frecuencias, aunque el profesor
   nunca la nombra así.
4. **Propiedad del conjunto de trabajo**: "Si $t_i$ valores diferentes
   fueron buscados entre la última ocurrencia de $x_i$ y la posición i,
   entonces resolver todas las consultas toma $O(\log t_i)$ por búsqueda
   (amortizado)."
5. **Propiedad unificada**: "Si $t_{ij}$ valores diferentes han sido buscados
   entre $x_i, \dots, x_j$, entonces resolver la consulta para $x_j$ toma
   $O(\log \min_{i<j} \{|x_i - x_j| + t_{i,j} + 2\})$ (amortizado)." El $+2$
   dentro del logaritmo evita $\log(0)$ y $\log(1) = 0$ cuando $x_i = x_j$ y
   $t_{i,j} = 0$; el profesor no explica por qué ese valor específico, sólo
   que hace falta algo para que el argumento del logaritmo no colapse.

Los dos lemas que relacionan las propiedades entre sí:

- **Lema 1**: "La propiedad del puntero dinámico implica la propiedad de
  acceso secuencial." (Directo: si toda la secuencia es $\{1,\dots,n\}$, entonces
  $k_i = 1$ para todo i, y $O(\log 1) = O(1)$.)
- **Lema 2**: "La propiedad del conjunto de trabajo implica la propiedad de
  cota de entropía."

Y un comentario de orthogonalidad, no un lema formal: "se podría decir que
la propiedad del puntero dinámico y la del conjunto de trabajo son
'ortogonales' entre sí" — ninguna implica a la otra. La propiedad unificada
generaliza a las cuatro; es alcanzable con
[máquina de punteros](/structures/bst-computational-model), pero "aún no se
sabe si es posible obtener la complejidad con un modelo BST" — pregunta
abierta que retoma [dynamic-optimality](/structures/dynamic-optimality).

### Visualizaciones del patrón de la secuencia

El diagrama en la parte superior de esta página contrasta las dos familias
de patrón sobre el **mismo BST fijo** (claves 1-7): los primeros tres pasos
recorren una secuencia fácil (acceso secuencial, {1,2,3}, O(1) amortizado
por búsqueda), y los últimos tres una secuencia sin patrón aprovechable
(saltos grandes sin repetición, O(log n) por búsqueda) — mismo árbol, mismo
peor caso posible, costo real muy distinto según la secuencia. El material
trae tres gráficos de dispersión adicionales (eje horizontal $i$ = posición,
eje vertical $x_i$ = valor buscado) para acceso secuencial, puntero dinámico
y conjunto de trabajo — ver los puntos exactos en
[examples.md](/structures/search-sequence-properties#ejemplos).

## Operaciones

No aplica: `operations: []` en el knowledge map. Estas propiedades no
definen una interfaz propia — se enuncian sobre `Buscar(x)`, la única
operación que trae el [modelo computacional BST](/structures/bst-computational-model).

## Análisis de complejidad

`professorAnalysisStyle: amortized` — cada una de las cinco propiedades
lleva literalmente la palabra "(amortizado)" entre paréntesis, y las cinco
son cotas *por búsqueda, promediadas sobre la secuencia completa*, que es
justo la definición de análisis amortizado. El profesor **no** usa el
método del potencial aquí (compárese con
[potential-method](/structures/potential-method)): no define una función Φ
ni acredita/debita nada — enuncia las cinco cotas y los dos lemas sin
demostrarlos.

Ver la tabla de complejidad más abajo para las cinco cotas exactas. Dos
observaciones del propio material que no caben en la tabla:

- La cota de entropía ya es un promedio ($\sum_k p_k \log(1/p_k)$ está definida
  sobre toda la secuencia); llamarla "amortizada" además es redundante,
  aunque el profesor lo hace igual.
- La propiedad unificada es la única de la que el profesor dice
  explícitamente qué modelo la alcanza: "es posible obtener esta
  complejidad usando máquina de punteros", pero "aún no se sabe si es
  posible obtener la complejidad con un modelo BST" — la brecha exacta que
  motiva [dynamic-optimality](/structures/dynamic-optimality).

## Tabla de complejidad

La tabla se genera desde `meta.yaml`, indexada por el nombre de cada
propiedad (no hay una única "operación" que costar). Nota de lectura: las
cinco filas son cotas **amortizadas** — el peor caso de una búsqueda
individual, sin promediar, sigue siendo $O(\log n)$ según el
[modelo computacional BST](/structures/bst-computational-model); estas
propiedades acotan el promedio sobre la secuencia completa, no el costo de
una búsqueda aislada.

## Ejemplos

Ver [examples.md](/structures/search-sequence-properties#ejemplos) — las
tres secuencias concretas que trae el mazo (acceso secuencial, puntero
dinámico, conjunto de trabajo), más el caso límite de qué pasa con una
secuencia que no cumple ninguna de las cinco.

## Comparación con estructuras relacionadas

| | [modelo computacional BST](/structures/bst-computational-model) | propiedades de secuencias (aquí) |
| --- | --- | --- |
| qué acota | el peor caso de una búsqueda individual, sobre cualquier secuencia | el promedio (amortizado) sobre una secuencia con un patrón específico |
| unidad de análisis | una operación aislada | la secuencia completa $\{x_1, \dots, x_m\}$ |
| resultado | $O(\log n)$ es el mejor tiempo posible en el peor caso | $O(1)$ a $O(\log k_i)$ según qué tan "fácil" sea la secuencia |

Estas propiedades son, a su vez, el lenguaje en el que se describe qué tan
buena es una estructura concreta: el
[Splay Tree](/structures/splay-tree) se caracteriza (sin demostración en el
mazo) por cuáles de estas cinco cumple, y
[dynamic-optimality](/structures/dynamic-optimality) pregunta si existe un
BST que iguale la propiedad unificada frente al óptimo offline.

## Prueba de dominio

Ver [mastery-check.md](/structures/search-sequence-properties#prueba-de-dominio).
