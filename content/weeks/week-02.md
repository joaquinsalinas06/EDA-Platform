---
title: Semana 2 — Montículo de Fibonacci
summary: "El método del potencial y la estructura que lo exprime: inserción y decrease-key amortizados en O(1)."
sourceFiles: ["raw-materials/week2/CS3014_Estructuras_de_Datos_Avanzadas_2s2026 (1)-1.pdf"]
---

Es el mazo donde el análisis amortizado deja de ser un comentario y se vuelve la
herramienta principal. El método del potencial se define aquí y se reusa en la
semana 3 para los nodos gordos.

El montículo de Fibonacci pospone el trabajo —no consolida al insertar— y paga la
cuenta en `Extract-Min`. Las marcas y los cortes en cascada son el mecanismo que
mantiene acotado el grado.
