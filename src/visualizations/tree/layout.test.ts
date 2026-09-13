import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layout, W, type TreeNode } from './layout.ts';

const byId = (nodes: ReturnType<typeof layout>) => new Map(nodes.map((n) => [n.id, n]));

test('el padre queda centrado entre sus dos hijos', () => {
  const tree: TreeNode[] = [
    { id: 'r', value: 8, parent: null },
    { id: 'l', value: 3, parent: 'r' },
    { id: 'd', value: 10, parent: 'r' },
  ];
  const n = byId(layout(tree));
  assert.equal(n.get('r')!.x, (n.get('l')!.x + n.get('d')!.x) / 2);
  assert.ok(n.get('l')!.x < n.get('r')!.x && n.get('r')!.x < n.get('d')!.x);
});

test('el orden horizontal es el inorden', () => {
  const tree: TreeNode[] = [
    { id: 'n8', value: 8, parent: null },
    { id: 'n3', value: 3, parent: 'n8' },
    { id: 'n10', value: 10, parent: 'n8' },
    { id: 'n1', value: 1, parent: 'n3' },
    { id: 'n6', value: 6, parent: 'n3' },
  ];
  const order = layout(tree)
    .sort((a, b) => a.x - b.x)
    .map((n) => n.label);
  assert.deepEqual(order, ['1', '3', '6', '8', '10']);
});

test('un árbol degenerado se abanica en vez de apilarse en vertical', () => {
  const chain: TreeNode[] = [1, 2, 3, 4, 5].map((v, i) => ({
    id: `n${v}`,
    value: v,
    parent: i === 0 ? null : `n${v - 1}`,
  }));
  const nodes = layout(chain);
  const xs = nodes.sort((a, b) => a.y - b.y).map((n) => n.x);
  // Cada nivel se desplaza a la derecha; ninguno comparte columna con su padre.
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] > xs[i - 1], `nivel ${i} no se desplazó`);
  // Y todo cabe en el lienzo.
  for (const n of nodes) assert.ok(n.x > 0 && n.x < W, `x=${n.x} fuera del viewBox`);
});

test('sin nodos no revienta', () => {
  assert.deepEqual(layout([]), []);
});

test('un nodo `collapsed` (subárbol entero) conserva la marca y se posiciona como hoja', () => {
  // El caso real: una rotación con A/B/C como subárboles completos colgando
  // de n y p — no son claves sueltas, tienen que dibujarse distinto.
  const tree: TreeNode[] = [
    { id: 'p', value: 'p', parent: null },
    { id: 'n', value: 'n', parent: 'p' },
    { id: 'C', value: 'C', parent: 'p', collapsed: true },
    { id: 'A', value: 'A', parent: 'n', collapsed: true },
    { id: 'B', value: 'B', parent: 'n', collapsed: true },
  ];
  const n = byId(layout(tree));
  assert.equal(n.get('A')!.collapsed, true);
  assert.equal(n.get('B')!.collapsed, true);
  assert.equal(n.get('C')!.collapsed, true);
  assert.equal(n.get('p')!.collapsed, undefined, 'un nodo normal no debería quedar marcado');
  assert.equal(n.get('n')!.collapsed, undefined);
});
