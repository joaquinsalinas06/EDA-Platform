---
kind: theory
title: "Vertical ray shooting"
---

## ¿Qué problema resuelve?

[Planar point location](/structures/planar-point-location) pregunta "¿en qué
cara del mapa cae este punto de consulta?" — una pregunta sobre regiones,
difícil de atacar directamente porque una cara no tiene una forma canónica
sobre la cual construir una estructura de datos. El profesor la vuelve
tratable con una reformulación: "podemos caracterizar la cara de cada punto
según el primer segmento que 'choque' si trazamos un rayo desde el mismo
verticalmente hacia arriba (eje Y positivo) o abajo (eje Y negativo). Este
nuevo problema se llama vertical ray shooting" (#19-20).

Esa es la idea entera del tema: en vez de preguntar por una cara (una
región, sin estructura evidente), se pregunta por un segmento (un objeto
lineal, con coordenadas). PPL **se reduce** a vertical ray shooting — resolver
el segundo resuelve el primero, porque cada cara queda identificada por el
primer segmento que la delimita por arriba.

## Intuición

Un mapa planar es un conjunto de caras separadas por segmentos. Si desde un
punto de consulta se dispara un rayo vertical hacia arriba, ese rayo tiene
que cruzar la frontera de la cara donde está el punto antes de cruzar
cualquier otra — y esa frontera, en la dirección del rayo, es exactamente un
segmento del mapa. Ese primer segmento **es** la cara: dos puntos en la misma
cara siempre dan con el mismo primer segmento al disparar el rayo, y puntos
en caras distintas dan con segmentos distintos (o el mismo segmento visto
desde lados opuestos, lo cual también identifica la cara sin ambigüedad).

```
                y
                |
   segmento A __|________________   ← primer segmento que toca el rayo de P
                |
                |      P
                |      .
                |      ↑  rayo vertical hacia arriba desde P
                |      |
   segmento B __|______|__________
                |
                +---------------------- x
```

La pregunta "¿qué cara?" se volvió la pregunta "¿qué segmento cruza primero
la vertical de mi punto, por encima de él?" — la misma información, pero
ahora expresada sobre objetos (segmentos) en vez de regiones.

## Estructura interna

Vertical ray shooting no guarda un nodo ni un invariante propio: es una
**reformulación** del problema de PPL, no una estructura de datos nueva.
Quien sí necesita estructura es la operación (ver abajo) y, sobre todo, la
reducción posterior a [segment-intersection-sweep-line](/structures/segment-intersection-sweep-line),
que es quien aporta la maquinaria real (segment tree, BBST, persistencia).

## Operaciones

- [ray-query](/structures/vertical-ray-shooting/operations/ray-query) — dado
  un punto de consulta, encontrar el primer segmento que un rayo vertical
  hacia arriba (o hacia abajo) toca.

## Análisis de complejidad

El estilo del profesor aquí es **reducción**, no cómputo directo: el valor
del tema no es una cota propia, sino la equivalencia que permite atacar el
problema. El profesor da la forma concreta de resolver la consulta: "si
consideramos las rectas verticales x = x_i para los puntos de consulta, la
respuesta se reducirá al menor y ≥ y_i de los segmentos que se intersectan
con la recta" (#22). Es decir, ray-query se convierte en: de todos los
segmentos que cruzan la vertical x = x_i, tomar el de menor `y` que aún esté
por encima de `y_i` (o el de mayor `y` por debajo, si el rayo va hacia
abajo).

Esa reformulación ("menor y ≥ y_i entre los segmentos que cruzan x = x_i") es
justo la forma de una consulta de sucesor sobre un conjunto de valores que
cambia mientras la recta vertical barre de izquierda a derecha — que es
exactamente el problema que resuelve
[segment-intersection-sweep-line](/structures/segment-intersection-sweep-line)
(#24 en adelante). Vertical ray shooting no tiene, por tanto, un análisis de
costo propio: hereda el de esa reducción, O(log n) por consulta con
persistencia sobre un BBST (#51).

## Tabla de complejidad

La única entrada de la tabla (`ray-query`) es heredada, no calculada aquí —
ver [meta.yaml](/structures/vertical-ray-shooting) y el razonamiento arriba.
El profesor sí menciona, como resultado citado y sin construirlo en el
curso, que el ray shooting estático general tiene una solución de
Agarwal (1992) en O((n/√s) polylog n) con espacio O(s^(1+ε)), s ∈ [1,n]
(#63) — un resultado de referencia, no la técnica que el curso construye.

## Ejemplos

Ver [examples.md](/structures/vertical-ray-shooting/examples).

## Comparación con estructuras relacionadas

| | planar-point-location | vertical-ray-shooting |
| --- | --- | --- |
| pregunta | ¿en qué cara cae el punto? | ¿qué segmento toca primero el rayo vertical desde el punto? |
| objeto de la pregunta | una región (sin forma canónica) | un segmento (coordenadas, orden) |
| cómo se resuelve | se reduce a vertical-ray-shooting | se reduce a [segment-intersection-sweep-line](/structures/segment-intersection-sweep-line) |

## Prueba de dominio

Ver [mastery-check.md](/structures/vertical-ray-shooting/mastery-check).
