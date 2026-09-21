import VisualizationCanvas, { type CanvasStep } from '../../components/VisualizationCanvas';
import { layout, W, type PersistentStep } from './layout';

/**
 * Familia "persistent": path copying, árbol de versiones (Euler) y nodo
 * gordo (registro + split). Único trabajo: posicionar (ver ./layout.ts). El
 * render, la línea de tiempo y la animación los pone VisualizationCanvas.
 */
export default function PersistentVisualization({ steps }: { steps: PersistentStep[] }) {
  const frames = steps.map(layout);
  const height = Math.max(...frames.map((f) => f.height), 34);
  const width = Math.max(...frames.map((f) => f.width ?? W), W);

  // El `viewBox` es fijo en `width` (el paso más ancho) en todos los pasos;
  // VisualizationCanvas hace zoom sobre el centro del lienzo para que un
  // paso más angosto se vea a tamaño completo en vez de chico y perdido.
  // Para que ese zoom quede centrado en el contenido real (no en un punto
  // arbitrario), el contenido de cada paso se centra aquí dentro del mismo
  // `width` compartido, y `width: f.width` es lo que le dice a cuánto hacer
  // zoom.
  const canvasSteps: CanvasStep[] = steps.map((s, i) => {
    const f = frames[i];
    const offset = (width - (f.width ?? width)) / 2;
    return {
      note: s.note,
      highlight: s.highlight ?? [],
      nodes: offset ? f.nodes.map((n) => ({ ...n, x: n.x + offset })) : f.nodes,
      edges: f.edges,
      groups: offset ? f.groups.map((g) => ({ ...g, x: g.x + offset })) : f.groups,
      annotations: offset ? f.annotations.map((a) => ({ ...a, x: a.x + offset })) : f.annotations,
      width: f.width,
    };
  });

  return <VisualizationCanvas steps={canvasSteps} width={width} height={height} />;
}
