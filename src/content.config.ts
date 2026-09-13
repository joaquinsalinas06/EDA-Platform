import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { VISUALIZATION_TYPES } from './lib/schemas';

// Un nodo de visualización: lista plana, el layout lo calcula el componente.
const vizNode = z.object({
  id: z.string(),
  value: z.union([z.string(), z.number()]),
  parent: z.string().nullable().default(null),
});

const visualization = z.object({
  type: z.enum(VISUALIZATION_TYPES),
  steps: z
    .array(
      z.object({
        note: z.string(),
        nodes: z.array(vizNode),
        highlight: z.array(z.string()).default([]),
      }),
    )
    .min(1),
});

const theory = z.object({
  kind: z.literal('theory'),
  title: z.string(),
});

const operation = z.object({
  kind: z.literal('operation'),
  title: z.string(),
  order: z.number().int(),
  /** Archivos en cpp/structures/<id>/, en orden progresivo: nodo → implementación completa. */
  cppSteps: z.array(z.string()).default([]),
  visualization: visualization.optional(),
});

const examples = z.object({
  kind: z.literal('examples'),
  title: z.string(),
});

const exercises = z.object({
  kind: z.literal('exercises'),
  title: z.string(),
  items: z
    .array(
      z.object({
        level: z.number().int().min(1).max(6),
        statement: z.string(),
        // El brief prohíbe revelar la solución antes de las pistas progresivas.
        hints: z.array(z.string()).min(1, 'un ejercicio sin pistas no puede revelar solución'),
        solution: z.string().optional(),
      }),
    )
    .default([]),
});

const mastery = z.object({
  kind: z.literal('mastery'),
  title: z.string(),
  canExplain: z.array(z.string()).default([]),
  canDo: z.array(z.string()).default([]),
});

export const collections = {
  // Todo el markdown de una estructura vive bajo content/structures/<id>/.
  // El id de la entrada empieza siempre por el id de la estructura.
  docs: defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: './content/structures',
      // id = ruta sin extensión: "demo-bst/theory", "demo-bst/operations/insert".
      generateId: ({ entry }) => entry.replace(/\.md$/, ''),
    }),
    schema: z.discriminatedUnion('kind', [theory, operation, examples, exercises, mastery]),
  }),
  weeks: defineCollection({
    loader: glob({ pattern: '*.md', base: './content/weeks' }),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      sourceFiles: z.array(z.string()).default([]),
    }),
  }),
};
