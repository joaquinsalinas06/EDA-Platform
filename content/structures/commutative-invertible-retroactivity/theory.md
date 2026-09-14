---
kind: theory
title: "Retroactividad conmutativa e invertible"
---

## ¿Qué problema resuelve?

El modelo de [retroactividad](/structures/retroactivity) plantea `Insert(t,
op)` y `Delete(t)` sobre una línea de tiempo, y advierte que la solución
ingenua —rehacer todo desde `t` hasta el presente— cuesta $O(m)$ si han
pasado `m` operaciones desde entonces. Esta técnica es la respuesta al "¿se
puede hacer mejor?" en el caso más favorable: cuando las operaciones que se
insertan o borran conmutan entre sí y son invertibles, la retroactividad
parcial es "casi trivial" — no hace falta rehacer nada.

## Intuición

Rehacer la secuencia sólo es necesario cuando **el orden importa**: si
insertar una operación en el tiempo `t` puede cambiar el resultado de todo
lo que vino después, no queda otra que reproducir esa cadena. Pero si el
orden *no* importa —si `op` conmuta con cualquier otra operación de la
secuencia— entonces da exactamente lo mismo aplicar `op` en el tiempo `t`
que aplicarla ahora mismo, al final: el resultado sobre la estructura
presente es idéntico. Eso convierte un `Insert` en el pasado en un `Insert`
en el presente, que cuesta lo que cuesta la operación en sí, sin overhead.

Falta borrar. Para eso entra la segunda propiedad: si toda operación tiene
una inversa que deshace exactamente su efecto, borrar `op` de la línea de
tiempo es lo mismo que aplicar $op^{-1}$ ahora — su efecto se cancela sin tener
que localizar ni deshacer nada en la posición original.

Ninguna de las dos propiedades sola alcanza: conmutatividad mueve `op` en el
tiempo sin cambiar el resultado, pero no dice cómo deshacerla; invertibilidad
da una forma de deshacer `op`, pero si el orden importara, deshacerla "ahora"
no cancelaría el efecto que tuvo sobre todo lo que pasó *entre* `t` y el
presente. Juntas, las dos cierran el argumento completo.

## Estructura interna

No aplica una estructura de datos nueva: esta técnica no agrega un invariante
propio sobre nodos ni celdas. Es una condición sobre **las operaciones** de
la estructura subyacente —definida en la sección anterior del mazo
(páginas 22-24, diapositiva 9)—:

- **Conmutativas**: $op_x$ seguida de $op_y$ tiene el mismo efecto que $op_y$
  seguida de $op_x$ — el orden no importa.
- **Invertibles**: existe $op_x^{-1}$ tal que aplicar $op_x$ y luego $op_x^{-1}$ deja
  la estructura exactamente como estaba.

Cuando *ambas* se cumplen para toda operación de la estructura, se puede
mantener retroactividad parcial (actualizaciones en cualquier tiempo,
consultas sólo en el presente — ver la taxonomía en
[retroactivity](/structures/retroactivity)) usando únicamente la estructura
presente, sin guardar la línea de tiempo completa.

## Operaciones

- [insert-retroactive](/structures/commutative-invertible-retroactivity/operations/insert-retroactive) — inserta `op` en el tiempo `t`, reducido a aplicar `op` ahora.
- [delete-retroactive](/structures/commutative-invertible-retroactivity/operations/delete-retroactive) — elimina la operación que estaba en `t`, reducido a aplicar su inversa ahora.

## Análisis de complejidad

Argumento algebraico (reducción por propiedades), no un conteo ni una
recurrencia. Las dos equivalencias son el análisis completo:

```
Insert(t, op)  ≡  Insert(ahora, op)          // por conmutatividad
Delete(t)      ≡  Insert(ahora, op⁻¹)        // por invertibilidad, si en t estaba op
```

Por conmutatividad, `op` puede "moverse" desde el tiempo `t` hasta el
presente sin cambiar el efecto sobre la estructura actual, así que
`Insert(t, op)` se reduce literalmente a aplicar `op` sobre la estructura
presente. Por invertibilidad, `Delete(t)` no necesita localizar ni deshacer
nada en la posición `t`: basta aplicar la inversa de la operación que estaba
ahí, ahora mismo, y el efecto se cancela.

La consecuencia es que **el costo se hereda íntegro de la operación
original**, sin ningún análisis adicional: no hay overhead retroactivo que
cobrar. El profesor lo ilustra con dos ejemplos (páginas 27-28,
diapositiva 11), ambos con retroactividad parcial:

| ejemplo | operación retroactiva | costo |
| --- | --- | --- |
| Tabla hash con inserciones | Insert / Delete retroactivos | $O(1)$ amortizado — igual que la operación original |
| Arreglo con `A[i] += Δ` | Insert / Delete retroactivos | $O(1)$ — igual que la operación original |

## Tabla de complejidad

Ver `meta.yaml`. Ambas operaciones heredan el costo de la operación de base
que reducen ($O(1)$ amortizado en los dos ejemplos del profesor); no hay una
cota genérica más allá de "el costo de la operación original", porque el
argumento es válido para cualquier operación que cumpla las dos propiedades.

## Ejemplos

Ver [examples.md](/structures/commutative-invertible-retroactivity#ejemplos)
— la tabla hash con inserciones y el arreglo con `A[i] += Δ`, más el
contraejemplo de una operación que no conmuta.

## Comparación con estructuras relacionadas

| | conmutativa e invertible (este tema) | [retroactividad general](/structures/retroactivity) |
| --- | --- | --- |
| condición sobre las operaciones | deben conmutar **y** ser invertibles | ninguna |
| qué se guarda | sólo la estructura presente | depende de la técnica (Segment Tree, rollback…) |
| overhead retroactivo | ninguno — cuesta lo mismo que la operación original | $O(lg m)$ (problemas descomponibles) o el costo del rollback, según la técnica |
| alcance | el "caso fácil": el profesor lo marca como el piso de la semana — la mayoría de estructuras interesantes (pilas, colas, BSTs, priority queues) tienen operaciones que sí dependen del orden y necesitan una técnica más general | cubre esas estructuras cuyas operaciones dependen del orden |

## Prueba de dominio

Ver [mastery-check.md](/structures/commutative-invertible-retroactivity#prueba-de-dominio).
