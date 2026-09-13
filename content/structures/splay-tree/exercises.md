---
kind: exercises
title: Ejercicios
items:
  - level: 1
    statement: >-
      Dado que x es hijo derecho de p, y p es hijo derecho de a, ¿qué caso
      de Splay aplica: zig, zig-zig o zig-zag? ¿Y si x es hijo izquierdo de
      p pero p es hijo derecho de a?
    hints:
      - "zig-zig requiere que x y p estén del MISMO lado respecto de su propio padre; zig-zag, de lados opuestos."
      - "zig sólo aplica cuando x no tiene abuelo (p es la raíz) — ninguno de estos dos casos lo es."
    solution: >-
      El primero es zig-zig (derecha-derecha, mismo lado). El segundo es
      zig-zag (izquierda de p, pero p es derecha de a: lados opuestos).
  - level: 2
    statement: >-
      Traza a mano `Search(5)` sobre el árbol `4(2(1,3),6(5,7))` (el mismo
      del ejemplo mínimo). Indica qué caso de Splay se aplica en cada
      iteración y el árbol resultante final.
    hints:
      - "5 es hijo izquierdo de 6, y 6 es hijo derecho de 4: ¿mismo lado o lados opuestos?"
      - "Son lados opuestos (izquierda bajo derecha) → una sola iteración de zig-zag, porque 6 es hijo directo de la raíz 4."
    solution: >-
      Una sola iteración: zig-zag (5 izquierdo de 6, 6 derecho de 4).
      Rotate(5) sobre 6, luego Rotate(5) sobre 4. Resultado:
      `5(4(2(1,3),null),6(null,7))`.
  - level: 3
    statement: >-
      Implementa `zigZig(x)` en C++ sobre la estructura de nodo con
      punteros a padre, izquierdo y derecho (ver `step-1-node.cpp` y
      `step-2-rotate.cpp`), reutilizando `rotate(Node*)`. Verifica con un
      `assert` que, tras aplicarlo a la configuración de tres niveles del
      diagrama del profesor (#65), el árbol resultante tiene x como raíz
      del subárbol de tres niveles y p como hijo directo de x (no de a).
    hints:
      - "zigZig llama primero rotate(p) — el par (p, a) — y sólo después rotate(x)."
      - "Si escribes rotate(x) dos veces en vez de rotate(p) luego rotate(x), obtienes move-to-root, no zig-zig: el assert sobre la posición final de p debe distinguir ambos."
    solution: >-
      `void zigZig(Node* x) { Node* p = x->parent; Node* a = p->parent;
      rotate(p); rotate(x); }` — el orden importa: `rotate(p)` primero
      reacomoda (p, a) antes de que `rotate(x)` suba a x. El assert
      `assert(x->parent == nullptr && p->parent == x)` verifica que x quedó
      como raíz y p como su hijo directo, tal como en el diagrama #65 (no
      como un hijo de segundo nivel, que sería el resultado de
      move-to-root).
  - level: 4
    statement: >-
      El modelo BST de este curso sólo define Buscar (#22-23); la
      literatura estándar de splay trees también define Insert y Delete.
      Adapta el algoritmo de Search de este tema para soportar `insert(k)`:
      ¿en qué punto del algoritmo estándar de inserción de un BST tendría
      que llamarse a Splay, y sobre qué nodo?
    hints:
      - "Insertar en un BST baja por el árbol hasta un puntero null y cuelga ahí el nodo nuevo — ese nodo nuevo es el candidato natural para splayar."
      - "Splayar el nodo recién insertado deja el árbol en el mismo estado 'auto-ajustado' que después de cualquier Search, sin inventar una operación nueva."
    solution: >-
      Insert(k) desciende como un BST ordinario hasta encontrar el puntero
      null donde k debería colgar, crea ahí el nuevo nodo, y llama
      `Splay(nuevo_nodo)` al final — exactamente el mismo patrón que
      Search(x): descender, luego splayar el nodo relevante. El profesor no
      define esta operación (el modelo sólo tiene Buscar), así que esta
      adaptación es una extensión, no un hueco del material.
  - level: 5
    statement: >-
      Diseña una secuencia de búsquedas de longitud m sobre un splay tree
      de n nodos donde el costo REAL total (sumando cada búsqueda
      individualmente, sin promediar) sea Ω(n·m) si el árbol nunca se
      reorganizara (fuera un BST estático degenerado), pero termine siendo
      O(m log n) en un splay tree real. ¿Qué patrón de la secuencia hace la
      diferencia?
    hints:
      - "Un árbol estático degenerado en cadena tiene un único nodo a profundidad n−1: buscarlo siempre cuesta Θ(n), sin importar qué se buscó antes."
      - "Repetir el MISMO valor una y otra vez es el patrón que un splay tree explota al máximo: después de la primera búsqueda, ese valor queda en la raíz."
    solution: >-
      Secuencia: buscar el mismo valor x (el más profundo de la cadena) m
      veces seguidas. En un BST estático degenerado, cada una de las m
      búsquedas cuesta Θ(n) (mismo camino largo cada vez): total Θ(n·m). En
      un splay tree, la primera búsqueda cuesta O(n) (sube x a la raíz),
      pero las m−1 siguientes cuestan O(1) cada una (x ya es la raíz):
      total O(n) + O(m) = O(n + m), muy por debajo de O(m log n) para m
      grande. El patrón es la propiedad del conjunto de trabajo de
      [search-sequence-properties](/structures/search-sequence-properties):
      repetir un valor reciente es exactamente lo que un BST estático no
      puede aprovechar y un splay tree sí.
  - level: 6
    statement: >-
      Demuestra por qué el algoritmo "move-to-root" (rotar (x, p) primero y
      (x, a) después, en vez del orden de zig-zig) NO puede lograr la cota
      amortizada de O(log n), usando como contraejemplo la cadena
      degenerada `1-2-3-...-n` (cada nodo hijo derecho del anterior) y la
      secuencia de búsquedas `Search(1), Search(2), Search(1), Search(2),
      ...` alternando entre las dos hojas más profundas.
    hints:
      - "Con move-to-root, subir el nodo más profundo un nivel a la vez dos veces por búsqueda deja el 'otro' nodo casi tan profundo como estaba, en vez de repartir la profundidad entre los dos como hace zig-zig."
      - "Cuenta cuántas rotaciones totales hacen falta para las primeras 2k búsquedas alternadas bajo cada algoritmo, y compara el crecimiento en función de n y k."
    solution: >-
      Bajo zig-zig, splayar repetidamente el nodo más profundo de una
      cadena reduce la profundidad de la mitad del árbol en cada llamada
      (el subárbol que compartían p y a se reparte entre ambos), así que la
      profundidad decae aproximadamente a la mitad cada vez: tras O(log n)
      búsquedas alternadas, ambos nodos quedan cerca de la raíz y el costo
      por búsqueda cae a O(1). Bajo move-to-root (rotar (x, p) antes que
      (p, a)), cada búsqueda sube al nodo buscado a la raíz pero deja al
      "otro" nodo de la alternancia casi tan profundo como estaba —la
      forma intermedia no reparte el subárbol, sólo mueve un camino a la
      vez— así que la secuencia alternada `Search(1), Search(2), ...`
      puede mantener a ambos nodos a profundidad Ω(n) indefinidamente,
      dando un costo real de Ω(n) por búsqueda, para siempre: costo total
      Ω(n·m) sobre m búsquedas, es decir Ω(n) amortizado, no O(log n). La
      diferencia es exactamente la nota de apoyo de
      [splay.md](/structures/splay-tree/operations/splay) y
      [zig-zig.md](/structures/splay-tree/operations/zig-zig): rotar el
      abuelo primero es lo que garantiza que la profundidad decae
      geométricamente; rotar el padre primero no lo garantiza.
---

Los niveles 1-2 reconocen y trazan los tres casos sobre árboles concretos
(ninguno viene del mazo: se derivan). El nivel 4 extiende el modelo (sólo
Buscar en el material) a Insert, marcado explícitamente como extensión, no
como hueco. Los niveles 5-6 son el corazón del tema: por qué la secuencia
importa y por qué el orden de rotación de zig-zig (no de move-to-root) es
lo que hace posible la cota amortizada.
