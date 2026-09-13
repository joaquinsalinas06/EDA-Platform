// Paso 6 — Search(x): Buscar(x) del modelo BST (descenso estándar) seguido
// siempre de Splay(x) (#60). El modelo del curso sólo define Buscar
// (#22-23); insertPlain de abajo es andamiaje para construir árboles de
// prueba, no una operación del splay tree.

#include "step-5-splay.cpp"

Node* search(Node*& root, int x) {
    Node* v = root;
    while (v->value != x) {
        v = (x < v->value) ? v->left : v->right;
    }
    splay(root, v);
    return v;
}

// Andamiaje: inserción de BST sin balanceo, para construir árboles de
// prueba con las llaves que hagan falta. No es una operación del splay
// tree (el modelo del curso no define Insert, ver huecos en el análisis).
Node* insertPlain(Node* root, Node* node) {
    if (root == nullptr) return node;
    Node* v = root;
    while (true) {
        if (node->value < v->value) {
            if (v->left == nullptr) { v->left = node; node->parent = v; break; }
            v = v->left;
        } else {
            if (v->right == nullptr) { v->right = node; node->parent = v; break; }
            v = v->right;
        }
    }
    return root;
}
