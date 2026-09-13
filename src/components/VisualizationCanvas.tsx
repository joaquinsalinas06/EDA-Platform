import { useCallback, useEffect, useRef, useState } from 'react';

export type CanvasNode = { id: string; label: string; x: number; y: number };
export type CanvasEdge = { from: string; to: string };
export type CanvasStep = {
  note: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  highlight: string[];
};

type Props = {
  steps: CanvasStep[];
  height?: number;
  width?: number;
};

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
          {step.edges.map((e) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;
            const live = step.highlight.includes(e.from) || step.highlight.includes(e.to);
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={live ? 'var(--accent)' : 'var(--rule)'}
                strokeWidth={live ? 2 : 1.5}
                style={{ transition: 'all 450ms cubic-bezier(.2,.7,.3,1)' }}
              />
            );
          })}

          {step.nodes.map((n) => {
            const on = step.highlight.includes(n.id);
            return (
              <g
                key={n.id}
                style={{
                  transform: `translate(${n.x}px, ${n.y}px)`,
                  transition: 'transform 450ms cubic-bezier(.2,.7,.3,1)',
                }}
              >
                <rect
                  x={-19}
                  y={-16}
                  width={38}
                  height={32}
                  rx={5}
                  fill={on ? 'var(--accent)' : 'var(--paper)'}
                  stroke={on ? 'var(--accent)' : 'var(--rule)'}
                  strokeWidth="1.5"
                  style={{ transition: 'fill 300ms, stroke 300ms' }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="500"
                  fontFamily="var(--font-mono)"
                  fill={on ? 'var(--accent-ink)' : 'var(--ink)'}
                  style={{ transition: 'fill 300ms' }}
                >
                  {n.label}
                </text>
              </g>
            );
          })}
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
