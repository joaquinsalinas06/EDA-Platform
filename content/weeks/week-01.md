---
title: Semana 1 — Montículos I
summary: Del montículo binario al binomial. La pregunta que recorre la semana es cómo hacer barata la unión de dos montículos.
sourceFiles: ["raw-materials/week1/Sem_1_Heaps_I-1.pdf"]
---

El mazo arranca con el montículo binario sobre arreglo —indexación padre/hijo,
`Max-Heapify`, `Build-Max-Heap` en `Θ(n)`— y cierra mostrando su punto débil: la
unión cuesta `Θ(n)`.

Los árboles binomiales son la respuesta a eso, y el montículo binomial es la
estructura que los usa para conseguir unión logarítmica.
