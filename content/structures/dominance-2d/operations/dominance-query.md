---
kind: operation
title: "ConsultaDominancia"
order: 3
cppSteps:
  - step-1-ray-reformulation.cpp
  - step-2-subdivision-build.cpp
  - step-3-dominance-query.cpp
  - full-implementation.cpp
---

## Qué hace

`ConsultaDominancia(S, b2, b3)` reporta todos los puntos de `S` con
`y_i ≤ b2` y `z_i ≤ b3`, caminando por la subdivisión de
[subdivision-build](/structures/dominance-2d/operations/subdivision-build)
en vez de comparar cada punto uno por uno.

## Intuición

El rayo horizontal de la consulta (ver
[ray-reformulation](/structures/dominance-2d/operations/ray-reformulation))
entra por la derecha, a la altura `b3`, y avanza hacia la izquierda. En vez
de simular ese avance por todo el plano, la estructura hace lo contrario:
localiza primero, con una búsqueda binaria, en qué **cara** de la columna
izquierda cae la altura `b3` — y desde ahí camina cara por cara hacia la
derecha, hasta llegar a la posición `b2`. Cada cara que se cruza corresponde
o bien al rayo de un punto real (se reporta) o bien a una cara "vacía" que
sólo existe por el grado acotado de la subdivisión.

## Algoritmo

1. Búsqueda binaria de `b3` en la columna izquierda de `S` → `O(lg n)`.
2. Caminar hacia la derecha, cara por cara, mientras la posición horizontal
   de la cara actual sea menor que `b2`:
   - si el borde de la cara actual es el rayo de un punto, agregar ese punto
     al resultado;
   - avanzar a la cara vecina hacia la derecha (`O(1)`, por el grado
     acotado).
3. Devolver el resultado cuando la caminata alcanza `b2`.

## Pseudocódigo

Transcripción literal (el deck repite este bloque idéntico en dos overlays,
#30 como "Algoritmo 1" y #31 como "Algoritmo 2" — mismo cuerpo, el segundo
sólo agrega el párrafo de costo debajo; es el mismo algoritmo, no dos):

```
Algoritmo: ConsultaDominancia(S, b2, b3)
cara ← búsqueda binaria de b3 en la columna izquierda de S   // O(lg n)
resultado ← lista vacía
mientras la posición horizontal de cara es < b2 hacer
    si el borde de cara es un rayo de un punto entonces
        agregar ese punto a resultado
     cara ← cara vecina hacia la derecha                      // O(1)
devolver resultado
```

## C++

Ver `step-3-dominance-query.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

`O(lg n + k)`. Conteo directo por pasos, output-sensitive: `O(lg n)` de la
búsqueda binaria inicial, más `O(1)` por cada cara visitada. Se visita
exactamente una cara por punto reportado (más un puñado de caras "vacías"),
así que el total es `O(lg n + k)` (#31) — el mismo patrón de descomposición
que el profesor usa en todo el deck (#54): `O(lg n) + O(1)·O(lg n) + O(k)`.

## Complejidad espacial

No requiere espacio adicional más allá de la subdivisión ya construida
(`O(n)`, ver
[subdivision-build](/structures/dominance-2d/operations/subdivision-build))
y la lista de resultado, de tamaño `k`.

## Ejemplo

*(derivado del pseudocódigo; no aparece en las diapositivas — no hay un
solo valor concreto en las 76 páginas del deck)*: con
`(1,5), (2,1), (4,4), (5,2)` y consulta `(b2,b3) = (4,4)`, la búsqueda
binaria ubica `b3=4` en la columna izquierda; la caminata avanza por las
columnas `y=1` (rayo en `z=5`, por encima de `4`, no se reporta), `y=2`
(rayo en `z=1 ≤ 4`, se reporta), `y=4` (rayo en `z=4 ≤ 4`, se reporta), y se
detiene ahí porque la siguiente columna (`y=5`) ya no es `< b2=4`.
Resultado: `{(2,1), (4,4)}`, `k=2`.

## Casos límite

- **`k=0`** (ningún punto dominado): la caminata todavía hace el `O(lg n)`
  de la búsqueda binaria y luego sólo cruza caras "vacías" hasta `b2`.
- **`k=n`** (todos los puntos dominados, `b2` y `b3` mayores que todo el
  conjunto): la caminata visita una cara por cada uno de los `n` puntos —
  el costo se acerca a `O(lg n + n)`, consistente con la cota.
- **"Un puñado de caras vacías"** (#31): el profesor menciona
  explícitamente que la caminata puede visitar algunas caras que no
  reportan punto, y que eso no rompe la cota `O(lg n + k)` porque su número
  está acotado por el grado de la subdivisión, no por `n`.
