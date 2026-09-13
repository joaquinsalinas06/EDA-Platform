import { z } from 'astro/zod';

// Única fuente de verdad de los contratos. La importan: el build de Astro
// (src/content.config.ts, src/lib/structures.ts) y scripts/check-knowledge-map.mjs.
// No duplicar ninguno de estos schemas en otro archivo.

export const VISUALIZATION_TYPES = ['tree', 'graph', 'persistent', 'range-tree'] as const;

const complexityCase = z.object({
  // Sólo la cota que el profesor sí da es obligatoria. En este curso casi nunca
  // distingue mejor/promedio ni menciona espacio: dejar esos campos vacíos es
  // FIEL al material; rellenarlos sería inventar. La tabla muestra "no lo da".
  worst: z.string(),
  best: z.string().optional(),
  avg: z.string().optional(),
  space: z.string().optional(),
  // El brief prohíbe dar complejidad sin razonamiento: sin esto el build falla.
  reasoning: z.string().min(20, 'la complejidad necesita su razonamiento, no solo la notación'),
  /** Cita de dónde sale la cota: "Sem_1_Heaps_I-1.pdf#19". */
  source: z.string().optional(),
});

export const metaSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['structure', 'algorithm', 'concept']).default('structure'),
  week: z.string(),
  prerequisites: z.array(z.string()).default([]),
  buildsOn: z.array(z.string()).default([]),
  usedBy: z.array(z.string()).default([]),
  complexity: z.record(complexityCase).default({}),
  professorAnalysisStyle: z.string().optional(),
  hasVisualization: z.boolean().default(false),
  visualizationType: z.enum(VISUALIZATION_TYPES).optional(),
  placeholder: z.boolean().default(false),
});

export const topicSchema = z.object({
  type: z.enum(['structure', 'algorithm', 'concept']),
  title: z.string(),
  week: z.string(),
  prerequisites: z.array(z.string()).default([]),
  buildsOn: z.array(z.string()).default([]),
  usedBy: z.array(z.string()).default([]),
  operations: z.array(z.string()).default([]),
  sourceSlides: z.array(z.string()).default([]),
  hasVisualization: z.boolean().default(false),
  visualizationType: z.enum(VISUALIZATION_TYPES).optional(),
  complexityStyleFromProfessor: z.string().optional(),
  // Concepto indispensable que no aparece explícito en las PPTs. Nunca inventar temas del curso.
  supportConcept: z.boolean().default(false),
  placeholder: z.boolean().default(false),
  status: z.enum(['pending', 'generated']).default('pending'),
});

export const knowledgeMapSchema = z.object({
  weeks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      sourceFiles: z.array(z.string()).default([]),
      topics: z.array(z.string()).default([]),
    }),
  ),
  topics: z.record(topicSchema),
});

export type Meta = z.infer<typeof metaSchema>;
export type KnowledgeMap = z.infer<typeof knowledgeMapSchema>;
export type Topic = z.infer<typeof topicSchema>;
