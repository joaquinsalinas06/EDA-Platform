// Paso 2 — Push del stack persistente (Algoritmo 2 del profesor).
//
// El caso degenerado de path copying: el "camino" mide un solo nodo, así
// que Push no copia nada de la pila vieja, sólo crea el nodo nuevo.

#include <memory>
using namespace std;

struct StackNode {
    int value;
    shared_ptr<StackNode> next;
};

// nuevo <- nodo con valor x y siguiente <- S ;
// devolver nuevo ;        // S (la versión vieja) sigue intacta
shared_ptr<StackNode> push(const shared_ptr<StackNode>& s, int x) {
    return make_shared<StackNode>(StackNode{x, s});
}
