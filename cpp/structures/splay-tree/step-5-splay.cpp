// Paso 5 — Splay(x): el bucle que el mazo no da explícitamente (#64-66 son
// sólo los tres diagramas de caso). Aplica zig / zig-zig / zig-zag según la
// posición relativa de x hasta que x llega a la raíz.

#include "step-4-zig-zag.cpp"

void splay(Node*& root, Node* x) {
    while (x != root) {
        Node* p = x->parent;
        if (p == root) {
            zig(root, x);
        } else {
            Node* g = p->parent;
            bool xLeftOfP = (x == p->left);
            bool pLeftOfG = (p == g->left);
            if (xLeftOfP == pLeftOfG) {
                zigZig(root, x);
            } else {
                zigZag(root, x);
            }
        }
    }
}
