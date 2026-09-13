// Implementación completa del montículo de Fibonacci. Junta los pasos 1-7.
// main() prueba el caso normal y los casos límite: montículo vacío, un
// solo nodo, y una cadena de cortes en cascada que sube varios niveles.
//
// g++ -std=c++20 -Wall full-implementation.cpp -o fh && ./fh

#include <iostream>
#include <vector>
#include <stdexcept>
#include <cassert>
using namespace std;

struct Node {
    int key;
    int degree = 0;
    bool mark = false;
    Node* parent = nullptr;
    Node* child = nullptr;
    Node* left;
    Node* right;

    explicit Node(int k) : key(k) {
        left = right = this;
    }
};

struct FibHeap {
    Node* minNode = nullptr;
    int n = 0;

    bool isEmpty() const { return minNode == nullptr; }

    // O(1): empalma el nodo x (o la lista circular que encabeza x) dentro
    // de la lista circular que encabeza "head". Sirve tanto para agregar
    // un solo nodo (Insert, Cut) como para concatenar dos listas enteras
    // (Union): en ambos casos son 4 punteros que se reconectan.
    static void spliceInto(Node* head, Node* x) {
        Node* headLeft = head->left;
        headLeft->right = x;
        Node* xLeft = x->left;
        x->left = headLeft;
        xLeft->right = head;
        head->left = xLeft;
    }

    // O(1): quita x de la lista circular en la que vive, dejándolo
    // apuntando a sí mismo.
    static void removeFromList(Node* x) {
        x->left->right = x->right;
        x->right->left = x->left;
        x->left = x->right = x;
    }

    // Algoritmo 5: Insert(H, x).
    Node* insert(int key) {
        Node* x = new Node(key);
        if (minNode == nullptr) {
            minNode = x;
        } else {
            spliceInto(minNode, x);
            if (x->key < minNode->key) minNode = x;
        }
        ++n;
        return x;
    }

    // Algoritmo 6: Union(H1, H2). H2 ("other") queda vacío tras unirse.
    void unionWith(FibHeap& other) {
        if (other.minNode == nullptr) return;
        if (minNode == nullptr) {
            minNode = other.minNode;
        } else {
            spliceInto(minNode, other.minNode);
            if (other.minNode->key < minNode->key) minNode = other.minNode;
        }
        n += other.n;
        other.minNode = nullptr;
        other.n = 0;
    }

    // Algoritmo 9: Cut(H, x, p).
    void cut(Node* x, Node* p) {
        if (p->child == x) {
            p->child = (x->right == x) ? nullptr : x->right;
        }
        removeFromList(x);
        --p->degree;
        x->parent = nullptr;
        x->mark = false; // las raíces nunca están marcadas
        spliceInto(minNode, x);
    }

    // Algoritmo 10: Cascading-Cut(H, y). Regla de las marcas: un nodo
    // pierde a lo mucho un hijo sin ser cortado de su propio padre.
    void cascadingCut(Node* y) {
        Node* z = y->parent;
        if (z != nullptr) {
            if (!y->mark) {
                y->mark = true;
            } else {
                cut(y, z);
                cascadingCut(z);
            }
        }
    }

    // Algoritmo 12: Decrease-Key(H, x, k).
    void decreaseKey(Node* x, int k) {
        if (k > x->key) {
            throw invalid_argument("decrease-key: la nueva llave es mayor que la actual");
        }
        x->key = k;
        Node* p = x->parent;
        if (p != nullptr && x->key < p->key) {
            cut(x, p);
            cascadingCut(p);
        }
        if (x->key < minNode->key) {
            minNode = x;
        }
    }

    // Binomial-Link(y, x) del mazo de binomial (Sem_1_Heaps_I-1.pdf#47-48):
    // y se vuelve hijo de x. Precondición del llamador: llave(y) >= llave(x).
    static void linkTrees(Node* y, Node* x) {
        removeFromList(y);
        y->parent = x;
        y->mark = false;
        if (x->child == nullptr) {
            x->child = y;
            y->left = y->right = y;
        } else {
            spliceInto(x->child, y);
        }
        ++x->degree;
    }

    // Algoritmo 14: Consolidate(H).
    void consolidate() {
        if (minNode == nullptr) return;

        // D(n) = O(lg n): cota de grado probada en theory.md vía la
        // recurrencia de Fibonacci. 2*log2(n+1)+2 es un tamaño de sobra.
        int maxDegree = 2;
        while ((1 << maxDegree) < n + 1) ++maxDegree;
        vector<Node*> A(maxDegree + 2, nullptr);

        // Recolectar la lista original de raíces: no se puede recorrer
        // con "cur = cur->right" una lista circular que Consolidate va a
        // reordenar mientras la recorre.
        vector<Node*> roots;
        Node* start = minNode;
        Node* cur = start;
        do {
            roots.push_back(cur);
            cur = cur->right;
        } while (cur != start);

        for (Node* w : roots) {
            Node* x = w;
            int d = x->degree;
            while (A[d] != nullptr) {
                Node* y = A[d];
                if (x->key > y->key) swap(x, y);
                linkTrees(y, x);
                A[d] = nullptr;
                ++d;
            }
            A[d] = x;
        }

        minNode = nullptr;
        for (Node* x : A) {
            if (x == nullptr) continue;
            x->left = x->right = x;
            if (minNode == nullptr) {
                minNode = x;
            } else {
                spliceInto(minNode, x);
                if (x->key < minNode->key) minNode = x;
            }
        }
    }

    // Algoritmo 13: Extract-Min(H). Dos pasos: remover (subir hijos de z
    // a la lista de raíces) y consolidar (fusionar por grado).
    Node* extractMin() {
        Node* z = minNode;
        if (z != nullptr) {
            if (z->child != nullptr) {
                Node* c = z->child;
                vector<Node*> children;
                Node* cc = c;
                do {
                    children.push_back(cc);
                    cc = cc->right;
                } while (cc != c);
                for (Node* child : children) {
                    removeFromList(child);
                    child->parent = nullptr;
                    child->mark = false;
                    spliceInto(z, child);
                }
                z->child = nullptr;
            }

            // Si, tras subir a los hijos, z sigue apuntándose a sí mismo,
            // z era la única raíz y no tenía hijos: el montículo queda
            // vacío (caso límite explícito del pseudocódigo del profesor).
            Node* remaining = z->right;
            bool heapBecomesEmpty = (remaining == z);
            removeFromList(z);

            if (heapBecomesEmpty) {
                minNode = nullptr;
            } else {
                minNode = remaining;
                consolidate();
            }
            --n;
        }
        return z;
    }

    ~FibHeap() { freeAll(minNode); }

    static void freeAll(Node* start) {
        if (!start) return;
        Node* cur = start;
        vector<Node*> toDelete;
        do {
            toDelete.push_back(cur);
            cur = cur->right;
        } while (cur != start);
        for (Node* node : toDelete) {
            freeAll(node->child);
            delete node;
        }
    }
};

int main() {
    // --- Caso límite: montículo vacío ---
    {
        FibHeap h;
        assert(h.isEmpty());
        assert(h.extractMin() == nullptr);
        cout << "OK: montículo vacío\n";
    }

    // --- Caso límite: un solo nodo ---
    {
        FibHeap h;
        h.insert(42);
        assert(!h.isEmpty());
        assert(h.minNode->key == 42);
        Node* z = h.extractMin();
        assert(z->key == 42);
        assert(h.isEmpty());
        delete z;
        cout << "OK: un solo nodo\n";
    }

    // --- Caso normal: insertar, extraer en orden, unión ---
    {
        FibHeap h;
        vector<int> values = {23, 7, 21, 3, 18, 52, 38, 30, 17, 24, 26};
        vector<Node*> handles;
        for (int v : values) handles.push_back(h.insert(v));

        FibHeap h2;
        h2.insert(1);
        h2.insert(100);
        h.unionWith(h2);
        assert(h2.isEmpty()); // Union deja a H2 vacío
        assert(h.minNode->key == 1);

        vector<int> extracted;
        while (!h.isEmpty()) {
            Node* z = h.extractMin();
            extracted.push_back(z->key);
            delete z;
        }
        assert(is_sorted(extracted.begin(), extracted.end()));
        assert(extracted.size() == values.size() + 2);
        cout << "OK: caso normal (insert + union + extract-min en orden)\n";
    }

    // --- Decrease-key + extract-min combinados sobre un caso más grande ---
    {
        FibHeap h;
        vector<Node*> handles;
        for (int v = 0; v < 20; ++v) handles.push_back(h.insert(100 + v));

        // Forzar consolidación real (varios extract-min antes de decrecer llaves).
        Node* first = h.extractMin();
        delete first;

        h.decreaseKey(handles[15], 5);   // pasa a ser el nuevo mínimo
        h.decreaseKey(handles[10], 50);
        assert(h.minNode->key == 5);

        vector<int> extracted;
        while (!h.isEmpty()) {
            Node* z = h.extractMin();
            extracted.push_back(z->key);
            delete z;
        }
        assert(is_sorted(extracted.begin(), extracted.end()));
        assert(extracted[0] == 5);
        cout << "OK: decrease-key + extract-min sobre un heap consolidado\n";
    }

    // --- Caso límite: cadena de cortes en cascada que sube varios niveles ---
    // Se construye a mano la estructura mínima que dispara dos cascadas
    // seguidas: r (raíz) -> a -> b -> c -> d, con a, b, c ya marcados.
    // decreaseKey sobre d simula que d rompió el invariante con c: se
    // corta d, y como c ya estaba marcado, la cascada sube a b, y como b
    // ya estaba marcado, sube a a, y como a NO estaba marcado, se marca y
    // la cascada se detiene ahí (a no se corta).
    {
        FibHeap h;
        Node* r = h.insert(1); // raíz mínima real del heap
        h.n = 5; // n se ajusta a mano: los nodos de abajo no pasan por insert()

        Node* a = new Node(10);
        Node* b = new Node(20);
        Node* c = new Node(30);
        Node* d = new Node(40);

        // Encadenar r -> a -> b -> c -> d como una lista de un solo hijo
        // por nivel (grado 1 en cada uno), imitando la cadena G -> P -> C
        // del ejemplo del profesor pero extendida un nivel más.
        r->child = a; a->parent = r; r->degree = 1;
        a->child = b; b->parent = a; a->degree = 1;
        b->child = c; c->parent = b; b->degree = 1;
        c->child = d; d->parent = c; c->degree = 1;

        b->mark = true;
        c->mark = true;
        // d y a arrancan sin marca en este montaje: a se marcará recién
        // al final de la cascada; d es hoja y nunca necesita marca.

        h.decreaseKey(d, -100); // rompe el invariante con c: dispara Cut + Cascading-Cut

        // d ahora es raíz, sin marca, sin padre.
        assert(d->parent == nullptr);
        assert(d->mark == false);
        assert(h.minNode == d);

        // c se cortó en cascada (estaba marcado): ahora es raíz, sin marca.
        assert(c->parent == nullptr);
        assert(c->mark == false);

        // b se cortó en cascada (estaba marcado): ahora es raíz, sin marca.
        assert(b->parent == nullptr);
        assert(b->mark == false);

        // a NO se cortó (no estaba marcado antes de esta cascada): sigue
        // siendo hijo de r, pero ahora queda marcado.
        assert(a->parent == r);
        assert(a->mark == true);

        cout << "OK: cascada de cortes de varios niveles (d -> c -> b, se detiene en a)\n";

        // Limpieza manual: d, c, b quedaron como raíces sueltas fuera de
        // la lista de r (spliceInto ya las unió a la lista de raíces de
        // h), así que el destructor de h las alcanza igual.
    }

    cout << "Todas las pruebas pasaron.\n";
    return 0;
}
