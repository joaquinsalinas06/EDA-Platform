---
kind: theory
title: "D₂ — acotar x"
---

## ¿Qué problema resuelve?

[/structures/dominance-2d](/structures/dominance-2d) (D₁) responde consultas de
dominancia: (−∞, b2] × (−∞, b3). D₂ añade la primera acotación real de la
cadena que este curso construye hacia el rango 3D completo — un intervalo
cerrado en x — para responder consultas de la forma:

```
[x1, x2] × (−∞, b2] × (−∞, b3)
```

rango cerrado en x, dominancia en (y, z).

## Intuición

D₂ es literalmente D₁ colgado de un árbol. Un
[/structures/range-tree](/structures/range-tree) (BST estándar) organiza los
puntos por x; cada nodo, además de su rol en el BST, guarda una copia de la
estructura de dominancia D₁ para los puntos de su subárbol. Acotar x se
resuelve exactamente como en el range tree: descomposición canónica sobre el
BST. Acotar (y, z) se resuelve delegando en D₁, que ya sabe hacerlo.

> **Nota de apoyo** (no está en las diapositivas): esto es la misma
> composición "árbol de rangos con estructura satélite por nodo" que ya
> aparece en range tree 2D — aquí la estructura satélite no es otro BST, es
> D₁.

## Estructura interna

Un BST estándar sobre x. Cada nodo guarda, para los puntos de su subárbol,
una copia de la estructura de dominancia (D₁) que acabamos de construir.

El invariante es el mismo del BST sobre x (no se reexplica aquí —
[/structures/range-tree](/structures/range-tree)); lo único nuevo es qué
guarda cada nodo como estructura satélite: no un valor, sino una instancia
completa de D₁ sobre los puntos de ese subárbol.

## Operaciones

- [Construcción](/structures/d2-bound-x/operations/build) — BST sobre x, D₁
  satélite por nodo.
- [Consulta](/structures/d2-bound-x/operations/query) — descomposición
  canónica en x, una consulta de dominancia por nodo canónico.

## Análisis de complejidad

Estilo del profesor: **composición estructural** — descomposición canónica ×
costo de la subestructura, sin plantear recurrencia ni amortizar (#34).

El profesor no da una cota numérica propia para D₂ en esta sección: "Nada
nuevo todavía — lo interesante empieza al agregar la segunda dimensión
acotada." (#34). La cota se compone después, cuando D₂ se combina con
[/structures/d3-separation-node](/structures/d3-separation-node) y con
fractional cascading generalizado — no le corresponde a esta sección
adelantarla.

> **¡Piénsalo!** advertencia del profesor (#35-36): si se acotara y con la
> misma técnica —descomposición canónica sobre un árbol de y dentro de cada
> nodo canónico de x— el costo sería O(lg n) nodos canónicos en x, cada uno
> con O(lg n) nodos canónicos en y: **O(lg² n)** consultas. Se perdería el
> O(lg n) buscado. Esto es exactamente lo que motiva
> [/structures/d3-separation-node](/structures/d3-separation-node): evitar la
> descomposición canónica en y por completo.

## Tabla de complejidad

Sin entradas propias: D₂ no tiene una fila de complejidad en meta.yaml
(`complexity: {}`) porque el profesor no la da en esta sección (ver arriba).

## Ejemplos

Ver [examples.md](/structures/d2-bound-x/examples).

## Comparación con estructuras relacionadas

| Estructura | Qué acota | Delega en |
| --- | --- | --- |
| [dominance-2d](/structures/dominance-2d) (D₁) | nada (dominancia pura en y, z) | — |
| **d2-bound-x (D₂)** | x (intervalo cerrado) | D₁ por nodo |
| [d3-separation-node](/structures/d3-separation-node) (D₃) | x e y (ambos intervalos) | D₂ / D₂′ por nodo de separación |

## Prueba de dominio

Ver [mastery-check.md](/structures/d2-bound-x/mastery-check).
