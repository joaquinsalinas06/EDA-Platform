---
kind: theory
title: "Retroactividad"
---

## ¿Qué problema resuelve?

Ejecutaste una secuencia larga de operaciones sobre una estructura de datos.
Ahora te das cuenta de que **olvidaste una operación** en algún punto del
pasado — o que una operación pasada **estuvo mal** y hay que borrarla. La
solución ingenua es rehacer todo desde ese punto: si han pasado `m`
operaciones desde entonces, eso cuesta $O(m)$. La pregunta que abre el mazo
es si se puede hacer mejor que reconstruir la secuencia entera cada vez que
el pasado cambia.

Retroactividad es el nombre que se le da a ese problema — y a la interfaz
que lo plantea con precisión — no a una técnica para resolverlo. La técnica
llega después, con [retroactividad conmutativa e invertible](/structures/commutative-invertible-retroactivity),
[problemas de búsqueda descomponibles](/structures/decomposable-search-problem),
el [método de rollback](/structures/rollback-method) y el caso de estudio de
la [priority queue retroactiva](/structures/retroactive-priority-queue): las
cuatro toman esta interfaz como dada y compiten por acercarse a algo mejor
que $O(m)$.

## Intuición

Piensa en la secuencia de operaciones que se le hicieron a una estructura
como una **línea de tiempo**: cada operación ocurre en un instante `t`. La
manera normal de usar una estructura de datos es sólo agregar al final de
esa línea (el "ahora"). Retroactividad permite editar la línea **en medio**:
insertar una operación en un tiempo pasado, o borrar una que ya estaba ahí.

Lo que hace que esto sea difícil — y no una curiosidad de nomenclatura — es
que la línea de tiempo tiene una sola versión: cuando se edita el pasado,
**el presente se recalcula para reflejar ese cambio, como si el cambio
siempre hubiera estado ahí**. No hay un "antes" y un "después" del cambio
conviviendo en paralelo; sólo hay un presente, y siempre está al día con
todo lo que se editó del pasado.

> **Nota de apoyo** (no está en las diapositivas): el material no especifica
> cómo se representan los tiempos `t` (enteros, reales, orden denso) ni qué
> pasa si se intenta insertar en un tiempo que ya está ocupado por otra
> operación. Los ejemplos de este tema usan tiempos reales (por ejemplo,
> insertar en `t = 1.5` entre dos operaciones en `t = 1` y `t = 2`) para
> poder insertar "entre" dos operaciones existentes sin desplazarlas, pero
> es una convención del análisis, no una decisión del profesor.

## Estructura interna

El modelo tiene **tres operaciones** sobre una línea de tiempo de
operaciones (páginas 14-17 del mazo, construidas en 4 overlays). Son la
interfaz retroactiva completa; todas las técnicas del resto de la semana la
implementan sin cambiarla:

- **Insert(t, op)** — inserta la operación `op` en el tiempo `t` (que puede
  ser pasado).
- **Delete(t)** — elimina la operación que estaba en el tiempo `t`.
- **Query(t, op)** — responde una consulta como si se hiciera en el tiempo
  `t`.

Sobre esa interfaz, el profesor define una **taxonomía de dos niveles**
según dónde se permite cada tipo de operación:

| nivel | dónde se permiten las actualizaciones (Insert/Delete) | dónde se permiten las consultas (Query) |
| --- | --- | --- |
| retroactividad **parcial** | en cualquier tiempo (pasado incluido) | **sólo en el presente** (el tiempo más reciente) |
| retroactividad **completa (full)** | en cualquier tiempo | **en cualquier tiempo del pasado** |

La observación del profesor sobre esta tabla: "igual que con persistencia,
'parcial' suele ser significativamente más barato de lograr que 'completa'".
El punto de referencia contra el que se mide todo el resto de la semana es
la solución ingenua: $O(m)$, donde `m` es el número de operaciones en la
línea de tiempo — rehacer todo desde el tiempo editado hasta el presente.

## Operaciones

- [Insert-retroactive](/structures/retroactivity/operations/insert-retroactive) — insertar una operación en un tiempo (posiblemente pasado).
- [Delete-retroactive](/structures/retroactivity/operations/delete-retroactive) — eliminar la operación que ocupaba un tiempo dado.
- [Query](/structures/retroactivity/operations/query) — consultar el estado como si se preguntara en un tiempo `t`.

## Análisis de complejidad

Esta sección es, en las palabras del propio mazo, una **definición de
modelo y taxonomía**: no hay una recurrencia ni un argumento amortizado que
derivar aquí, porque el modelo en sí no fija una implementación. Lo único
que se establece es el punto de referencia — la solución ingenua cuesta
$O(m)$, rehaciendo la secuencia completa desde el tiempo editado — y la
observación de que la variante parcial (consultar sólo el presente) suele
ser más barata de lograr que la completa (consultar cualquier tiempo
pasado), exactamente igual que ocurre con los niveles de persistencia.

Cerrar esa brecha entre "rehacer todo" ($O(m)$) y algo mejor es precisamente
lo que hacen las cuatro técnicas que `usan` este modelo, cada una con su
propio argumento de complejidad.

## Tabla de complejidad

No aplica: `meta.yaml` deja `complexity: {}` a propósito. El modelo de
retroactividad no tiene un costo propio que tabular — el único número que
da esta sección es el de referencia, la solución ingenua $O(m)$, y las
cotas reales llegan con cada técnica (ver sus respectivas tablas de
complejidad).

## Ejemplos

Ver [examples.md](/structures/retroactivity/examples) — una línea de tiempo
mínima, una edición retroactiva típica y el caso límite que motiva por qué
$O(m)$ no basta.

## Comparación con estructuras relacionadas

La distinción que más importa, y la que el propio mazo señala explícitamente
como una dualidad (página 13): retroactividad **no es** persistencia, aunque
ambas "editan el pasado" en el sentido coloquial.

| | [persistencia](/structures/persistence-levels) | retroactividad |
| --- | --- | --- |
| qué pasa al modificar el pasado | se crea una **versión nueva**; la versión "presente" original sigue existiendo, intacta, en paralelo | el **presente se actualiza** para reflejar el cambio, como si siempre hubiera estado ahí |
| cuántas líneas de tiempo hay | muchas (un árbol o DAG de versiones) | **una sola** |
| qué se consulta | el pasado, sin tocarlo | el pasado, para **modificarlo** — y el presente se recalcula |
| niveles | parcial / total / confluente / funcional | parcial / completa (full) |

El profesor lo resume así: "son ideas duales — persistencia **ramifica el
futuro**; retroactividad **reescribe el pasado** y propaga el efecto hacia
el presente". El paralelo parcial/completa de este tema espeja directamente
el parcial/total de persistencia, pero el eje que cambia (ramificar vs.
reescribir) es la diferencia real, no un detalle de vocabulario.

## Prueba de dominio

Ver [mastery-check.md](/structures/retroactivity/mastery-check).
