import VisualizationCanvas, { type CanvasStep } from '../../components/VisualizationCanvas';
import { layout, W, type PersistentStep } from './layout';

/**
 * Familia "persistent": path copying, árbol de versiones (Euler) y nodo
 * gordo (registro + split). Único trabajo: posicionar (ver ./layout.ts). El
 * render, la línea de tiempo y la animación los pone VisualizationCanvas.
 */
export default function PersistentVisualization({ steps }: { steps: PersistentStep[] }) {
  const frames = steps.map(layout);
  const canvasSteps: CanvasStep[] = steps.map((s, i) => ({
    note: s.note,
    highlight: s.highlight ?? [],
    nodes: frames[i].nodes,
    edges: frames[i].edges,
    groups: frames[i].groups,
    annotations: frames[i].annotations,
  }));

  const height = Math.max(...frames.map((f) => f.height), 34);
  return <VisualizationCanvas steps={canvasSteps} width={W} height={height} />;
}
