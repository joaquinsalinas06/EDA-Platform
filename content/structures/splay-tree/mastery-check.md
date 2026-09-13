---
kind: mastery
title: Prueba de dominio
canExplain:
  - "Por qué zig-zig rota primero el par (padre, abuelo) y no el par (x, padre) — y por qué el orden inverso (move-to-root) no logra la cota amortizada."
  - "La diferencia entre costo real (O(1) por zig/zig-zig/zig-zag, hasta O(n) por una llamada completa a Splay) y costo amortizado (O(log n) sobre cualquier secuencia)."
  - "Por qué zig-zag no tiene la misma distinción de orden que zig-zig: por qué ahí rotar x dos veces seguidas SÍ es correcto."
  - "Por qué el splay tree exhibe las propiedades de secuencias (acceso secuencial, puntero dinámico, conjunto de trabajo, cota de entropía) que un BST estático no puede — y por qué eso lo hace candidato a optimalidad dinámica, sin serlo demostradamente."
canDo:
  - "Trazar Splay(x) a mano sobre un árbol de al menos 3 niveles, identificando en cada iteración si el caso es zig, zig-zig o zig-zag, sin ver el material."
  - "Implementar zigZig y zigZag en C++ reutilizando rotate(Node*), con el orden de llamadas correcto en cada caso."
  - "Diseñar una secuencia de búsquedas donde el splay tree salga asintóticamente más barato que un BST estático, y explicar qué propiedad de search-sequence-properties está explotando."
---

Si el nivel 6 de `exercises.md` (por qué move-to-root falla) no sale sin ver
la solución, repetir primero el paso de `zigZig` en `full-implementation.cpp`
imprimiendo el árbol después de cada rotación — ver la forma intermedia es
lo que hace evidente la diferencia.
