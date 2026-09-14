---
kind: operation
title: "Consulta online vía persistencia"
order: 4
cppSteps:
  - step-1-events.cpp
  - step-2-activation.cpp
  - step-3-intersection-count.cpp
  - step-4-crossing-order.cpp
  - step-5-persistent-query.cpp
  - full-implementation.cpp
---

## Qué hace

Convierte el caso general offline (#40-47) — que necesita conocer todos los
puntos de consulta por adelantado para procesarlos junto con el barrido —
en uno **online**: cada consulta se resuelve de inmediato, sin haber
barrido todavía hasta ese punto, aplicando persistencia sobre la
[balanced-bst](/structures/balanced-bst) de
[crossing-order](/structures/segment-intersection-sweep-line/operations/crossing-order).

## Intuición

En el caso offline, responder una consulta en $x_i$ exige haber procesado
el barrido hasta ahí. Si en cambio cada evento del barrido produce una
**versión nueva** de la BBST de cruces — vía
[path-copying](/structures/path-copying), sin destruir las versiones
anteriores — entonces consultar "¿qué pasaba en $x_i$?" es simplemente
consultar la versión de la BBST que existía en ese instante, sin importar
si el barrido ya llegó ahí en la vida real o no.

## Algoritmo

El material da únicamente la fórmula (#50), sin desarrollarla:

```
Query(t_{x_i}, Successor(y_i))
```

$t_{x_i}$ se entiende como la versión persistente de la BBST justo después
de procesar los eventos de barrido hasta $x_i$, y `Successor(y_i)` como la
consulta de sucesor de `y_i` en esa versión — pero el material no define
ninguna de las dos piezas con precisión.

> **Hueco declarado** (no se inventa la semántica): el análisis de la
> fuente marca `Query(t_{x_i}, Successor(y_i))` (#50) como **sin definir**.
> No se dice qué devuelve `Query`, cómo se indexan las versiones $t_{x_i}$
> cuando $x_i$ no coincide con ningún evento del barrido, ni sobre qué
> estructura exacta corre `Successor`. Requiere confirmación del usuario;
> aquí sólo se declara la ausencia, no se completa.

Lo que sí está establecido (#49): "es posible usar persistencia sobre el
BBST" para lograr que las consultas sean online, apoyándose en
[path-copying](/structures/path-copying) — cada actualización de la BBST
(activar o desactivar un segmento) copia sólo el camino modificado y
produce una nueva versión, sin tocar las anteriores.

## Pseudocódigo

```
// Por cada evento de barrido en x: aplicar Activar/Desactivar con
// path-copying y guardar la raíz de la versión resultante.
raiz[x] = PathCopyingUpdate(raiz_anterior, evento)

// Consulta online (semántica exacta de Query/Successor: sin definir, #50)
// Query(t_{x_i}, Successor(y_i))
```

## C++

Ver `step-5-persistent-query.cpp`: guarda, para cada evento de barrido, la
raíz de la versión de la estructura de cruces en ese instante (siguiendo la
idea de [path-copying](/structures/path-copying)), y verifica que consultar
una versión pasada da lo mismo que habría dado el barrido detenido en ese
instante — sin implementar `Successor` sobre esa versión, porque su
semántica exacta no está definida en el material (ver hueco arriba).

## Complejidad temporal

$O(\log n)$ por consulta (#51) — heredado del costo de consultar una versión
persistente de la BBST, el mismo argumento que
[path-copying](/structures/path-copying) usa para `query-old-version`. El
profesor no separa el costo de construir las versiones del costo de
consultarlas.

## Complejidad espacial

No aplica un análisis propio: el material no da espacio para esta variante
(ver, en cambio, el espacio $O(\lg n)$ por actualización que sí da
[path-copying](/structures/path-copying) para `segment-tree-update`, la
misma idea aplicada a la BBST aquí).

## Ejemplo

Ver [examples.md](/structures/segment-intersection-sweep-line/examples),
caso "Límite": consulta a una versión pasada de la BBST de cruces.

## Casos límite

- **Consulta en un $x_i$ que no coincide con ningún evento del barrido**: el
  material no dice si se toma la versión del mayor evento ≤ $x_i$ u otra
  convención — parte del hueco declarado arriba.
- **Consulta antes del primer evento**: no hay versión previa; el material
  no cubre este caso.
- **La retroactividad parcial (#53-55) es un mecanismo distinto**, aplicable
  sólo a segmentos completamente horizontales, con la misma cota $O(\log n)$
  por consulta pero sin persistencia de por medio — el deck la menciona sin
  mecanismo (ver [retroactivity](/structures/retroactivity)); no se
  desarrolla aquí porque el material no la conecta explícitamente con el
  barrido.
