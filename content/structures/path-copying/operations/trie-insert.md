---
kind: operation
title: Insert (trie persistente)
order: 4
cppSteps:
  - step-1-node.cpp
  - step-2-stack-push.cpp
  - step-3-segment-tree-update.cpp
  - step-4-trie-insert.cpp
  - full-implementation.cpp
---

## Qué hace

Inserta la cadena `s` en un trie persistente a partir de `nodo`, devolviendo
la raíz de una nueva versión del trie. La versión vieja sigue intacta.

## Intuición

El camino relevante aquí no es la altura de un árbol balanceado sino el
largo de la cadena: cada carácter de `s` es un nivel de descenso, y path
copying copia exactamente un nodo por carácter — el resto del trie (todas
las demás ramas, de todas las demás cadenas ya insertadas) se comparte sin
tocarse. Por eso el espacio total tras insertar varias cadenas es
`O(Σ Lᵢ)`, el mismo orden que un trie efímero normal: cada carácter
insertado crea a lo más un nodo nuevo, sin importar cuántas versiones
acumules.

## Algoritmo

1. Copiar `nodo` en `nuevo`.
2. Si se llegó al final de la cadena (`i = |s|`): marcar `nuevo.esFinal ←
   verdadero` y **devolver `nuevo`** (caso base).
3. Si no: tomar el carácter `c = s[i]`; buscar `hijoViejo = nodo.hijos[c]`
   (o un trie vacío si ese hijo no existe todavía).
4. `nuevo.hijos[c] ← Insert(hijoViejo, s, i+1)`; los demás hijos de `nuevo`
   siguen apuntando a los mismos subárboles que tenía `nodo` (compartidos,
   no se copian).
5. Devolver `nuevo`.

## Pseudocódigo

```
Algoritmo 4: Insert(nodo, s, i)
nuevo ← copia de nodo ;
si i = |s| entonces
     nuevo.esFinal ← verdadero ;
     devolver nuevo ;
en otro caso
     c ← s[i] ;
     hijoViejo ← nodo.hijos[c] (o un Trie vacío si no existe) ;
     nuevo.hijos[c] ← Insert(hijoViejo, s, i+1) ;
     devolver nuevo ;
```

## C++

Ver `step-4-trie-insert.cpp` y `full-implementation.cpp` en el editor de
arriba.

## Complejidad temporal

`O(L)` con `L = |s|`, por conteo directo: Insert copia exactamente un nodo
por carácter de `s`, uno por cada nivel del camino desde la raíz hasta el
nodo final. No se toca ninguna otra rama del trie.

## Complejidad espacial

`O(L)` de espacio nuevo por inserción — los mismos nodos copiados en
tiempo. Tras `n` inserciones de cadenas con largos `L₁, ..., Lₙ`, el
espacio total es `O(Σ Lᵢ)`: el mismo orden que un trie efímero normal,
porque cada carácter insertado crea a lo más un nodo nuevo sin importar
cuántas versiones se acumulen.

## Ejemplo

*(Derivado del pseudocódigo; no aparece en las diapositivas — el material
nunca instancia el trie con cadenas concretas.)* Sea un trie vacío (versión
`v0`). `Insert(v0, "ab", 0)` copia la raíz (`nuevo`), ve `c = 'a'`, no
encuentra `hijos['a']` en `v0` (usa un trie vacío como `hijoViejo`), e
inserta recursivamente `"ab"` desde `i=1` en ese trie vacío: se crea un
nodo para `'a'` cuyo hijo `'b'` es otro nodo nuevo con `esFinal =
verdadero`. El resultado, `v1`, es un camino nuevo de dos nodos (`a → b`)
colgando de una raíz también nueva; `v0` sigue siendo el trie vacío
original.

## Casos límite

- **Hijo inexistente** (único caso límite codificado en el pseudocódigo
  del profesor): `hijoViejo ← nodo.hijos[c]`, o un trie vacío si `c` no
  tenía hijo todavía — así se puede insertar sobre una rama que no existía
  sin caso especial adicional.
- **Caso base sin retorno explícito**: tal como aparece en las diapositivas,
  el pseudocódigo marca `nuevo.esFinal ← verdadero` cuando `i = |s|` pero
  no corta ahí — sigue a `c ← s[i]`, que indexa fuera de la cadena. Aquí se
  corrige agregando `devolver nuevo` dentro de ese caso (ver también el
  bloque `en otro caso` que aísla el resto), tanto en el pseudocódigo de
  arriba como en el C++.
- **Insertar una cadena que ya es prefijo de otra insertada antes** (o
  viceversa): el algoritmo no distingue este caso — simplemente marca
  `esFinal` en el nodo correspondiente a esa longitud; el material no lo
  menciona explícitamente.
- **`s` vacía (`L = 0`)**: la raíz misma se marca `esFinal ← verdadero` de
  inmediato, sin ninguna copia adicional.
