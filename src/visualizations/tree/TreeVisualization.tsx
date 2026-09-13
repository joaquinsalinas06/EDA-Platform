import VisualizationCanvas, { type CanvasStep } from '../../components/VisualizationCanvas';
import { layout, W, type TreeNode } from './layout';

export type TreeStep = { note: string; nodes: TreeNode[]; highlight: string[] };

/**
 * Familia "árbol". Único trabajo: posicionar los nodos (ver ./layout.ts).
 * El render, la línea de tiempo y la animación los pone VisualizationCanvas.
 */
export default function TreeVisualization({ steps }: { steps: TreeStep[] }) {
  const canvasSteps: CanvasStep[] = steps.map((s) => ({
    note: s.note,
    highlight: s.highlight,
    nodes: layout(s.nodes),
    edges: s.nodes.filter((n) => n.parent).map((n) => ({ from: n.parent!, to: n.id })),
  }));

  // El lienzo crece con el árbol más profundo de la secuencia: un árbol
  // degenerado no se sale del viewBox.
  const deepest = Math.max(...canvasSteps.flatMap((s) => s.nodes.map((n) => n.y)), 34);
  return <VisualizationCanvas steps={canvasSteps} width={W} height={deepest + 44} />;
}
