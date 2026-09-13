---
kind: theory
title: "Propiedades de análisis de secuencias de búsqueda"
---

## ¿Qué problema resuelve?

El [modelo computacional BST](/structures/bst-computational-model) establece
que, en el peor caso, `Buscar(x)` cuesta `O(log n)` y que ese `O(log n)` "es
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
siendo `O(log n)`." No son cinco ideas independientes — son cinco maneras de
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
enteras en `[1, n]` y una secuencia de búsqueda `{x1, x2, ..., xm}` (todas
resolubles, sin búsquedas fallidas).

Las cinco propiedades y sus dos lemas de implicación:

1. **Propiedad de acceso secuencial**: "Si la secuencia de búsqueda es
   {1, 2, ..., n}, entonces resolver todas las consultas toma O(1) por
   búsqueda (amortizado)."
2. **Propiedad del puntero dinámico**: "Si elementos consecutivos cumplen
   con `|x_i − x_{i−1}| = k_i`, entonces resolver las consultas toma
   `O(log k_i)` por búsqueda (amortizado)."
3. **Cota de entropía / optimalidad estática**: "Si un valor k aparece en
   una fracción `p_k` de la secuencia, entonces resolver todas las consultas
   toma `O(Σ_k p_k log(1/p_k))` por búsqueda (amortizado)." Esa suma es la
   entropía de Shannon de la distribución de frecuencias, aunque el profesor
   nunca la nombra así.
4. **Propiedad del conjunto de trabajo**: "Si `t_i` valores diferentes
   fueron buscados entre la última ocurrencia de `x_i` y la posición i,
   entonces resolver todas las consultas toma `O(log t_i)` por búsqueda
   (amortizado)."
5. **Propiedad unificada**: "Si `t_ij` valores diferentes han sido buscados
   entre `x_i, ..., x_j`, entonces resolver la consulta para `x_j` toma
   `O(log min_{i<j} {|x_i − x_j| + t_{i,j} + 2})` (amortizado)." El `+2`
   dentro del logaritmo evita `log(0)` y `log(1) = 0` cuando `x_i = x_j` y
   `t_{i,j} = 0`; el profesor no explica por qué ese valor específico, sólo
   que hace falta algo para que el argumento del logaritmo no colapse.

Los dos lemas que relacionan las propiedades entre sí:

- **Lema 1**: "La propiedad del puntero dinámico implica la propiedad de
  acceso secuencial." (Directo: si toda la secuencia es {1,...,n}, entonces
  `k_i = 1` para todo i, y `O(log 1) = O(1)`.)
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

`hasVisualization: false` para este tema (no hay componente de
visualización paso a paso: lo que se visualiza es el **patrón de la
secuencia**, no la ejecución de un algoritmo). El material trae tres
gráficos de dispersión (eje horizontal `i` = posición, eje vertical `x_i` =
valor buscado) que se transcriben aquí como diagramas ASCII:

**Acceso secuencial** — puntos en (1,1) (2,2) (3,3) (4,4) (5,5) (6,6): la
diagonal perfecta.

```
x_i
 6 |                     ●
 5 |               ●
 4 |         ●
 3 |   ●
 2 | ●
 1 ● 
   +--+--+--+--+--+--+--
     1  2  3  4  5  6   i
```

**Puntero dinámico** — puntos en (1,1) (2,3) (3,2) (4,5) (5,4) (6,6):
saltos pequeños alrededor de la diagonal (nunca se aleja más de `k_i` en
cada paso).

```
x_i
 6 |                     ●
 5 |               ●
 4 |         ●
 3 |    ●
 2 |       ●
 1 ●
   +--+--+--+--+--+--+--
     1  2  3  4  5  6   i
```

**Conjunto de trabajo** — puntos en (1,1) (2,3) (3,7) (4,3) (5,2) (6,3): el
valor 3 se repite en i=2, 4 y 6 — poca "distancia de trabajo" cada vez que
vuelve.

```
x_i
 7 |      ●
 ...
 3 |   ●     ●     ●
 2 |               ●
 1 ●
   +--+--+--+--+--+--+--
     1  2  3  4  5  6   i
```

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

- La cota de entropía ya es un promedio (`Σ_k p_k log(1/p_k)` está definida
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
individual, sin promediar, sigue siendo `O(log n)` según el
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
| unidad de análisis | una operación aislada | la secuencia completa `{x1, ..., xm}` |
| resultado | `O(log n)` es el mejor tiempo posible en el peor caso | `O(1)` a `O(log k_i)` según qué tan "fácil" sea la secuencia |

Estas propiedades son, a su vez, el lenguaje en el que se describe qué tan
buena es una estructura concreta: el
[Splay Tree](/structures/splay-tree) se caracteriza (sin demostración en el
mazo) por cuáles de estas cinco cumple, y
[dynamic-optimality](/structures/dynamic-optimality) pregunta si existe un
BST que iguale la propiedad unificada frente al óptimo offline.

## Prueba de dominio

Ver [mastery-check.md](/structures/search-sequence-properties#prueba-de-dominio).
