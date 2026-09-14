import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  NODE_W,
  NODE_H,
  CELL_W,
  CELL_H,
  boxWidth,
  PORT_R,
  LINE_H,
  STATE_LABEL,
  resolveState,
  resolveEdgeState,
  nodeStyle,
  edgeStyle,
  type CanvasNode,
  type CanvasEdge,
  type CanvasGroup,
  type CanvasText,
  type CanvasStep,
} from '../visualizations/canvas-types.ts';

// Tipos y constantes viven en canvas-types.ts (puro, sin JSX: lo importan los
// layout.ts de cada familia, y `node --test` no puede quitar JSX de un .tsx).
// Se re-exportan aquí para que nada que ya importe de este archivo — como
// TreeVisualization.tsx — tenga que cambiar.
export type { CanvasNode, CanvasEdge, CanvasGroup, CanvasText, CanvasStep };

type Props = {
  steps: CanvasStep[];
  height?: number;
  width?: number;
};

/** Extremo de una arista recortado contra el borde de la caja destino, para
 * que una punta de flecha no quede enterrada bajo el nodo. Sólo se usa si la
 * arista pide `arrow` — las aristas de árbol siguen yendo centro a centro,
 * exactamente como hoy. */
function trimToBox(from: { x: number; y: number }, to: CanvasNode): { x: number; y: number } {
  const w = (to.w ?? NODE_W) / 2;
  const h = (to.h ?? NODE_H) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return { x: to.x, y: to.y };
  const scale = 1 / Math.max(Math.abs(dx) / w, Math.abs(dy) / h);
  return { x: to.x - dx * scale, y: to.y - dy * scale };
}

/**
 * Base compartida de todas las familias de visualización (árboles, grafos,
 * persistentes, range trees). No sabe qué está dibujando: recibe nodos ya
 * posicionados y los anima entre pasos.
 *
 * El movimiento sale gratis: cada nodo conserva su elemento del DOM entre pasos
 * (React lo reusa por `key`), así que basta una transición CSS sobre `transform`
 * para que se deslice a su posición nueva en vez de saltar.
 */
export default function VisualizationCanvas({ steps, width = 640, height = 260 }: Props) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const arrowId = useId();

  const last = steps.length - 1;
  const step = steps[Math.min(i, last)];

  const go = useCallback(
    (n: number) => setI((prev) => Math.max(0, Math.min(last, prev + n))),
    [last],
  );

  // Arranca sola la primera vez que entra en pantalla: si no, el usuario ve un
  // diagrama estático y nunca descubre que hay pasos.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (i >= last) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((p) => p + 1), 1200);
    return () => clearTimeout(t);
  }, [playing, i, last]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  const pos = new Map(step.nodes.map((n) => [n.id, n]));
  const progress = steps.length > 1 ? (i / last) * 100 : 100;
  const groups = step.groups ?? [];
  const annotations = step.annotations ?? [];

  return (
    <figure
      ref={box}
      tabIndex={0}
      onKeyDown={onKey}
      className="my-12 overflow-hidden rounded-lg border border-[var(--rule)] focus:outline-none focus-visible:border-[var(--accent)]"
      aria-label="Visualización paso a paso. Usa las flechas izquierda y derecha."
    >
      {/* Barra de progreso: el primer indicio de que esto se mueve. */}
      <div className="h-0.5 w-full bg-[var(--sunken)]">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="flex justify-center px-4 py-6"
        style={{
          background: 'var(--fill)',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--muted) 22%, transparent) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: width }}
          className="block w-full"
          role="img"
          aria-label={step.note}
        >
          <defs>
            <marker
              id={`${arrowId}-ink`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
            </marker>
            <marker
              id={`${arrowId}-accent`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {groups.map((g) => (
            <g key={g.id} style={{ transition: 'transform 450ms cubic-bezier(.2,.7,.3,1)' }}>
              <rect
                x={g.x}
                y={g.y}
                width={g.w}
                height={g.h}
                rx={6}
                fill={g.style === 'ghost' ? 'transparent' : 'color-mix(in srgb, var(--muted) 6%, transparent)'}
                stroke="var(--rule)"
                strokeWidth={1}
                strokeDasharray={g.style === 'ghost' ? '3 3' : undefined}
              />
              {g.label && (
                <text
                  x={g.x + 8}
                  y={g.y + 14}
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.06em"
                  fill="var(--faint)"
                  style={{ textTransform: 'uppercase' }}
                >
                  {g.label}
                </text>
              )}
            </g>
          ))}

          {step.edges.map((e) => {
            const a = pos.get(e.from);
            const bRaw = pos.get(e.to);
            if (!a || !bRaw) return null;
            const state = resolveEdgeState(e, step.highlight);
            const visual = edgeStyle(e.kind ?? 'tree', state);
            const b = e.arrow ? trimToBox(a, bRaw) : bRaw;
            const curve = e.curve ?? 0;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const cx = mx - (dy / len) * curve;
            const cy = my + (dx / len) * curve;
            const d = curve === 0 ? `M${a.x},${a.y} L${b.x},${b.y}` : `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;
            return (
              <path
                key={e.id ?? `${e.from}-${e.to}`}
                d={d}
                fill="none"
                stroke={visual.stroke}
                strokeWidth={visual.strokeWidth}
                strokeDasharray={visual.dash}
                markerEnd={e.arrow ? `url(#${state === 'active' ? `${arrowId}-accent` : `${arrowId}-ink`})` : undefined}
                style={{ transition: 'all 450ms cubic-bezier(.2,.7,.3,1)' }}
              />
            );
          })}

          {step.nodes.map((n) => {
            const state = resolveState(n, step.highlight);
            const visual = nodeStyle(state);
            const shape = n.shape ?? 'box';
            const [defaultW, defaultH] = shape === 'cell' ? [CELL_W, CELL_H] : [NODE_W, NODE_H];
            // La caja crece con su texto. Sin esto, una etiqueta larga
            // ("ins(3) <- se inserta aqui") se desborda de un recuadro de 38px.
            const w = n.w ?? boxWidth(String(n.label ?? ''), shape === 'cell' ? 11 : 13, defaultW);
            const h = n.h ?? defaultH;

            return (
              <g
                key={n.id}
                // El nombre accesible va en aria-label, NO en un <title>: React
                // 19 trata cualquier <title> como metadato de documento y lo iza
                // al <head> (está pensado para el título de la página, no para
                // el de un elemento SVG). El servidor lo vaciaba de su <g> y el
                // cliente no, lo que provocaba el "Minified React error #418" —
                // un desajuste de hidratación — en TODAS las páginas con
                // visualización. El escape hatch `itemProp` no lo evitaba dentro
                // del namespace SVG. aria-label da el mismo nombre accesible sin
                // crear ningún nodo que React pueda izar.
                role="img"
                aria-label={`${n.label} — ${STATE_LABEL[state]}`}
                style={{
                  transform: `translate(${n.x}px, ${n.y}px)`,
                  transition: 'transform 450ms cubic-bezier(.2,.7,.3,1)',
                }}
              >
                {shape === 'subtree' ? (
                  // Convención de los libros para "esto es un subárbol
                  // entero, no un nodo suelto": triángulo, vértice hacia el
                  // padre (arriba), base ancha abajo. El estado (idle/active/
                  // …) sigue viniendo de nodeStyle, igual que una caja.
                  <>
                    <polygon
                      points={`0,${-h / 2} ${-w / 2},${h / 2} ${w / 2},${h / 2}`}
                      fill={visual.fill}
                      stroke={visual.stroke}
                      strokeWidth={visual.strokeWidth}
                      strokeDasharray={visual.dash}
                      opacity={visual.opacity}
                      style={{ transition: 'fill 300ms, stroke 300ms, opacity 300ms' }}
                    />
                    <text
                      x={0}
                      y={h / 2 - 11}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={13}
                      fontWeight={500}
                      fontFamily="var(--font-mono)"
                      fill={visual.text}
                      opacity={visual.opacity}
                      style={{ transition: 'fill 300ms' }}
                    >
                      {n.label}
                    </text>
                  </>
                ) : shape === 'port' ? (
                  <>
                    <circle
                      r={PORT_R}
                      fill={visual.fill}
                      stroke={visual.stroke}
                      strokeWidth={visual.strokeWidth}
                      opacity={visual.opacity}
                      style={{ transition: 'fill 300ms, stroke 300ms, opacity 300ms' }}
                    />
                    {n.label && (
                      <text
                        x={0}
                        y={-PORT_R - 6}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight={500}
                        fontFamily="var(--font-mono)"
                        fill={visual.text}
                        opacity={visual.opacity}
                        style={{ transition: 'fill 300ms' }}
                      >
                        {n.label}
                      </text>
                    )}
                  </>
                ) : shape === 'record' ? (
                  <>
                    <rect
                      x={-w / 2}
                      y={-h / 2}
                      width={w}
                      height={h}
                      rx={4}
                      fill={visual.fill}
                      stroke={visual.stroke}
                      strokeWidth={visual.strokeWidth}
                      strokeDasharray={visual.dash}
                      opacity={visual.opacity}
                      style={{ transition: 'fill 300ms, stroke 300ms, opacity 300ms' }}
                    />
                    {visual.double && (
                      <rect
                        x={-w / 2 + 3}
                        y={-h / 2 + 3}
                        width={w - 6}
                        height={h - 6}
                        rx={2}
                        fill="none"
                        stroke={visual.stroke}
                        strokeWidth={1}
                      />
                    )}
                    {(n.lines ?? [n.label]).map((line, idx) => (
                      <text
                        key={idx}
                        x={0}
                        y={-h / 2 + LINE_H * (idx + 0.5)}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontFamily="var(--font-mono)"
                        fill={visual.text}
                      >
                        {line}
                      </text>
                    ))}
                    {n.divider !== undefined && (
                      <line
                        x1={-w / 2 + 4}
                        x2={w / 2 - 4}
                        y1={-h / 2 + LINE_H * (n.divider + 1)}
                        y2={-h / 2 + LINE_H * (n.divider + 1)}
                        stroke={visual.stroke}
                        strokeWidth={1}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <rect
                      x={-w / 2}
                      y={-h / 2}
                      width={w}
                      height={h}
                      rx={shape === 'cell' ? 2 : 5}
                      fill={visual.fill}
                      stroke={visual.stroke}
                      strokeWidth={visual.strokeWidth}
                      strokeDasharray={visual.dash}
                      opacity={visual.opacity}
                      style={{ transition: 'fill 300ms, stroke 300ms, opacity 300ms' }}
                    />
                    {visual.double && (
                      <rect
                        x={-w / 2 + 3}
                        y={-h / 2 + 3}
                        width={w - 6}
                        height={h - 6}
                        rx={2}
                        fill="none"
                        stroke={visual.stroke}
                        strokeWidth={1}
                      />
                    )}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={shape === 'cell' ? 12 : 14}
                      fontWeight={500}
                      fontFamily="var(--font-mono)"
                      fill={visual.text}
                      opacity={visual.opacity}
                      style={{ transition: 'fill 300ms' }}
                    >
                      {n.label}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {annotations.map((a) => (
            <text
              key={a.id}
              x={a.x}
              y={a.y}
              textAnchor={a.anchor ?? 'start'}
              fontSize={a.size ?? 12}
              fontFamily="var(--font-mono)"
              fill={a.state === 'active' ? 'var(--accent)' : a.state === 'muted' ? 'var(--faint)' : 'var(--muted)'}
              style={{ transition: 'fill 300ms' }}
            >
              {a.text}
            </text>
          ))}
        </svg>
      </div>

      <figcaption className="border-t border-[var(--rule)]">
        <p className="min-h-[3.25rem] px-5 py-3.5 text-[0.9375rem] leading-snug" aria-live="polite">
          {step.note}
        </p>

        <div className="flex items-center gap-1 border-t border-[var(--rule)] bg-[var(--fill)] px-3 py-2">
          <button
            onClick={() => go(-1)}
            disabled={i === 0}
            className="rounded px-2.5 py-1 text-sm transition-colors hover:bg-[var(--sunken)] disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Paso anterior"
          >
            ←
          </button>
          <button
            onClick={() => (i >= last ? (setI(0), setPlaying(true)) : setPlaying((p) => !p))}
            className="rounded px-3 py-1 text-[0.8125rem] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-wash)]"
          >
            {playing ? 'pausa' : i >= last ? 'repetir' : 'reproducir'}
          </button>
          <button
            onClick={() => go(1)}
            disabled={i === last}
            className="rounded px-2.5 py-1 text-sm transition-colors hover:bg-[var(--sunken)] disabled:opacity-25 disabled:hover:bg-transparent"
            aria-label="Paso siguiente"
          >
            →
          </button>

          <div className="ml-3 flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setPlaying(false); setI(idx); }}
                aria-label={`Paso ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === i ? 'w-5 bg-[var(--accent)]' : 'w-1.5 bg-[var(--rule)] hover:bg-[var(--muted)]'
                }`}
              />
            ))}
          </div>

          <span className="ml-auto font-mono text-[0.6875rem] tracking-widest text-[var(--faint)] uppercase">
            paso {i + 1}/{steps.length}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
