---
kind: operation
title: Actualización de aristas
order: 2
cppSteps: []
---

## Qué hace

En el escenario dinámico ("se permite insertar y eliminar aristas", #17,
frente al estático "los puntos y aristas no cambian", #16), modifica el mapa
planar insertando o eliminando una arista.

## Intuición

El mazo no da ninguna — sólo nombra la operación como parte de la
clasificación estático/dinámico del problema (#16-17). No hay ninguna
imagen mental que el profesor ofrezca para "cómo" se actualiza el mapa.

## Algoritmo

**No hay uno en el material.** El profesor enuncia la operación —
insertar/eliminar aristas en el escenario dinámico — pero no desarrolla
ningún algoritmo para ella (#17). Lo único que el mazo hace con mapas
dinámicos es el caso **restringido**: mapas ortogonales con retroactividad
parcial (#53-55), que cubre la consulta (`locate`) bajo cambios, no la
mecánica de `edge-update` en sí.

Lo que sí cita el mazo, sin derivarlo ni usarlo en el curso, son resultados
de la literatura para mapas generales dinámicos (#60-61):

- Baumgarten, Jung y Mehlhorn (1994): consulta e inserción
  O(log n · log log n), eliminación O(log² n).
- Arge, Brodal y Georgiadis (2006): consulta O(log n), inserción
  O(log^{1+ε} n), eliminación O(log^{2+ε} n).

Son citas de cultura del área, no contenido del curso — de ahí que esta
operación no tenga entrada en la tabla de complejidad de `meta.yaml`.

## Pseudocódigo

```
(ninguno — el material no da pseudocódigo para esta operación)
```

## C++

No hay implementación para esta operación: escribir una inventaría un
algoritmo que el mazo nunca da. `cppSteps` queda vacío a propósito.

## Complejidad temporal

No la deriva el profesor. Ver los resultados de literatura citados arriba
(#60-61) — son referencias, no una cota que este curso establezca.

## Complejidad espacial

No la da el profesor.

## Ejemplo

No hay ejemplo del profesor para esta operación — el mazo no la ilustra con
ningún caso concreto de insertar o eliminar una arista.

## Casos límite

- **Mapa ortogonal vs. mapa general**: la única variante que el mazo
  desarrolla algo más allá del enunciado es la restringida a aristas
  horizontales, vía retroactividad parcial sobre `locate` (#53-55) — y aun
  así, sin describir el mecanismo de inserción/eliminación en sí, sólo la
  cota de la consulta resultante.
- **Retroactividad parcial "sólo funciona para segmentos completamente
  horizontales"** (#53): el mazo no explica qué pasa si se necesita
  eliminar/insertar una arista no horizontal en ese esquema — queda fuera
  de alcance del material.
