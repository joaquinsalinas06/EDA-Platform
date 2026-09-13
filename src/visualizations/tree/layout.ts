export type TreeNode = {
  id: string;
  value: string | number;
  parent: string | null;
  /** Este nodo representa un subárbol entero (p.ej. "A"/"B"/"C" en una
   * rotación), no una clave suelta — se dibuja como un triángulo, la
   * convención de los libros, no como una caja normal. */
  collapsed?: boolean;
};
export type LaidOut = { id: string; label: string; x: number; y: number; collapsed?: boolean };

export const W = 640;
const ROW = 56;

/**
 * Convierte {id, value, parent} en coordenadas.
 *
 * Las hojas ocupan columnas consecutivas en inorden; cada padre se centra
 * sobre sus hijos, y un padre con un solo hijo se desplaza media columna para
 * que se vea de qué lado cuelga (sin eso, una cadena degenerada se dibuja como
 * una línea vertical ilegible).
 */
export function layout(nodes: TreeNode[]): LaidOut[] {
  const children = new Map<string | null, TreeNode[]>();
  for (const n of nodes) {
    const list = children.get(n.parent) ?? [];
    list.push(n);
    children.set(n.parent, list);
  }
  for (const list of children.values()) list.sort((a, b) => (a.value < b.value ? -1 : 1));

  const out: LaidOut[] = [];
  let column = 0;

  const visit = (node: TreeNode, depth: number): number => {
    const kids = children.get(node.id) ?? [];
    const left = kids.filter((k) => k.value < node.value);
    const right = kids.filter((k) => k.value >= node.value);

    const lx = left.map((k) => visit(k, depth + 1));
    const rx = right.map((k) => visit(k, depth + 1));

    let cx: number;
    if (lx.length && rx.length) cx = (Math.max(...lx) + Math.min(...rx)) / 2;
    else if (lx.length) cx = Math.max(...lx) + 0.5;
    else if (rx.length) cx = Math.min(...rx) - 0.5;
    else cx = column++;

    out.push({ id: node.id, label: String(node.value), x: cx, y: depth, collapsed: node.collapsed });
    return cx;
  };

  for (const root of children.get(null) ?? []) visit(root, 0);
  if (out.length === 0) return out;

  // Normaliza: los desplazamientos de hijo único pueden dar columnas negativas.
  const min = Math.min(...out.map((n) => n.x));
  const max = Math.max(...out.map((n) => n.x));
  const gap = W / (max - min + 2);
  return out.map((n) => ({ ...n, x: gap * (n.x - min + 1), y: 34 + n.y * ROW }));
}
