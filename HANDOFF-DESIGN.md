# Handoff — plataforma y visualizaciones

Este documento es para el agente que trabaja **la plataforma**. El contenido del
curso (teoría, C++, ejercicios) lo genera otro agente en el worktree principal.
Trabajamos en paralelo sobre el mismo repo, así que lo primero es el reparto.

## Reparto de territorio — no negociable

| Zona | Dueño | Puedes |
| --- | --- | --- |
| `src/**` (componentes, layouts, estilos, visualizaciones, páginas) | **tú** | escribir |
| `astro.config.mjs`, `package.json`, `tailwind`, config en general | **tú** | escribir |
| `content/knowledge-map.json` | agente de contenido | **sólo leer** |
| `content/structures/**`, `cpp/**` | agente de contenido | **sólo leer** |
| `content/analysis/**` | agente de contenido | **sólo leer** — es tu documentación de referencia |
| `src/lib/schemas.ts`, `src/content.config.ts` | compartido | **sólo con aviso** (ver abajo) |
| `templates/**`, `AGENTS.md` | agente de contenido | **sólo leer** |

`schemas.ts` y `content.config.ts` son la frontera entre los dos: si necesitas un
campo nuevo en el frontmatter (por ejemplo para una visualización de tipo
`persistent`), **anótalo en la sección "Cambios de contrato solicitados" al final
de este archivo** en vez de cambiarlo por tu cuenta. El contenido ya escrito
tendría que regenerarse si cambias un campo obligatorio.

## Arrancar

El repo está inicializado con git pero **sin ningún commit**, a propósito: el
primer commit lo hace el usuario o tú, con vuestra identidad, no otro agente.
Un worktree necesita al menos un commit, así que el orden es:

```sh
cd /Users/joaquins/uni/26-2/eda/EDA-Platform
git add -A && git commit -m "..."            # primer commit, con tu identidad
git worktree add ../EDA-Platform-design -b design
cd ../EDA-Platform-design
pnpm install
pnpm dev
```

`pnpm build`, `pnpm check` y `pnpm test` deben pasar antes de cada commit.
El worktree comparte historia con el principal, así que `git merge design` al final.

Mientras no exista ese primer commit, se puede trabajar igual copiando el
directorio, pero entonces la fusión final hay que hacerla a mano.

## Qué hay ya construido (no lo rehagas)

- **Diseño "Manual técnico"** ya definido y aplicado: IBM Plex Sans para leer, IBM
  Plex Mono para datos, un solo azul (`--accent`) reservado a lo **activo**, jerarquía
  por tamaño y peso de fondo en vez de bordes. Los tokens están en
  `src/styles/global.css`. La descripción completa está en `AGENTS.md` § Diseño.
  **Respeta esa dirección**: nada de gradientes, nada de decorativo, el color sólo
  marca estado.
- `VisualizationCanvas.tsx` — la base compartida de todas las familias. Ver abajo.
- `CodeEditor.tsx`, `ExerciseBlock.tsx`, `ComplexityTable.astro`, `SectionRail.astro`,
  `PrerequisiteBanner.astro`, `MasteryChecklist.astro`, `KnowledgeMapNav.astro`.
- Layout de tres columnas, modo claro/oscuro, view transitions, animaciones
  scroll-driven nativas (`.reveal`, `.draw`, `.stagger`).
- `remark-math`, `rehype-katex` y `katex` **ya están instalados pero SIN configurar**
  (tarea 1).

## Las tareas, en orden

### 1. Renderizar matemáticas — urgente, bloquea contenido que ya está aterrizando

El curso entero es análisis amortizado. Ahora mismo las fórmulas salen como texto
plano o metidas en bloques de código.

**Qué hacer**: configurar `remark-math` + `rehype-katex` en `astro.config.mjs`
(`markdown: { remarkPlugins, rehypePlugins }`), importar el CSS de KaTeX, y ajustar
los estilos para que las fórmulas no desentonen con el resto (KaTeX trae su propia
tipografía; decide si la dejas o la alineas a Plex).

**Dónde ver qué tipo de matemáticas hay que soportar** — esto no es teórico, son las
fórmulas reales del curso:
- `content/analysis/week-01-sem-1-heaps-i.md` líneas ~66-78 — sumatorias con techos
  y pisos: `T(n) ≤ Σ_{h=0}^{⌊lg n⌋} ⌈n/2^(h+1)⌉ · O(h)`, series geométricas.
- `content/analysis/week-02-...-1-1.md` sección `### potential-method` — la función
  potencial `Φ(H)`, coste amortizado `ĉᵢ = cᵢ + Φᵢ − Φᵢ₋₁`.
- `content/analysis/week-05-sem5-dynamic-optimality-i.md` sección
  `### propiedades-de-secuencias-de-busqueda` — cinco propiedades, cada una con su
  cota; es el mazo con más notación.

**Ojo**: el contenido ya generado usa bloques de código para algunas fórmulas.
Cuando KaTeX funcione, avísame y yo hago que los agentes de contenido usen `$...$`
y `$$...$$` de aquí en adelante. **No edites tú el contenido.**

### 2. Las dos familias de visualización que faltan

`src/components/VisualizationCanvas.tsx` es la base y **no debería cambiar**: recibe
pasos ya posicionados y los anima. Su contrato:

```ts
type CanvasStep = {
  note: string;                                    // qué pasa y POR QUÉ
  nodes: { id, label, x, y }[];                    // ya posicionados
  edges: { from, to }[];
  highlight: string[];                             // ids en azul
};
```

El movimiento sale gratis: React conserva el elemento del DOM por `key`, así que una
transición CSS sobre `transform` hace que los nodos se deslicen entre pasos.

`src/visualizations/tree/` es el ejemplo a seguir: `layout.ts` (pura, testeada en
`layout.test.ts`) convierte `{id, value, parent}` en coordenadas, y
`TreeVisualization.tsx` delega el render. **Copia esa separación**: layout puro y
testeable, render delegado.

#### 2a. Familia `persistent` — 3 temas de la semana 3

Tiene que mostrar **qué se copia y qué se comparte entre versiones**. Es una cosa
distinta a un árbol: hay dos versiones coexistiendo y aristas de compartición.

**Dónde ver exactamente qué dibuja el profesor:**
- `content/analysis/week-03-sem-3-persistencia.md` **líneas 412-424** — el mejor
  diagrama del mazo, descrito nodo por nodo: Segment Tree de 4 hojas, el camino
  raíz→`[3,4]`→`[4,4]` en naranja (copiado) y `[1,2]`,`[1,1]`,`[2,2]`,`[3,3]`
  compartidos sin tocar. **Esta es la visualización canónica de path copying.**
- `content/analysis/week-03-sem-3-persistencia.md` **líneas 248-258** — el árbol de
  versiones de 7 nodos y el recorrido de Euler que lo linealiza.
- Mismo archivo, sección `### fat-nodes`: el análisis marca como **ausencias graves**
  que el profesor nunca dibuja un nodo gordo ni el split. Son justo los dos diagramas
  que el tema exige. Tendrás que diseñarlos — es diseño, no invención de contenido.

Necesitarás probablemente: dos colores de arista (copiada / compartida), y nodos
capaces de mostrar una lista de tuplas `(campo, valor, tiempo)` en vez de un número.
Eso puede requerir un campo nuevo en el contrato → anótalo al final.

#### 2b. Familia `range-tree` — 3 temas de las semanas 4 y 5

**Dónde ver exactamente qué dibuja el profesor:**
- `content/analysis/week-04-sem4-orthogonal-range-search.md` **líneas 46-56** — los
  tres diagramas, con TODOS los valores:
  - `#29` layout del range tree 1D: raíz 9, hijos 4 y 15, nivel 3/7/13/18, hojas
    {3,4,7,9,13,15,18,27}.
  - `#35` la consulta `[5,16]`: nodos **amarillos** = delimitadores (hojas 4 y 18),
    nodos **rojos** = raíces de los subárboles canónicos de la respuesta (7 y 13).
    Es el diagrama más claramente paso a paso del mazo.
  - `#47` el 2D: árbol primario en X con hojas `(3,10) (4,7) (7,11) (9,6) (13,0)
    (15,−2) (18,3) (27,1)`, y colgando del nodo 15 por una flecha, el árbol
    secundario ordenado por Y.
- `content/analysis/week-05-cs3014-...-6.md` sección `### layered-range-tree` — los
  **puentes** del fractional cascading entre arreglos ordenados. Esto ya no es un
  árbol: son arreglos en capas con flechas entre posiciones.

**Problema de diseño que te toca resolver**: el profesor usa amarillo y rojo, y
nuestra paleta es monocroma + un azul. Necesitas más de un estado ("delimitador" vs
"respuesta" vs "descartado") sin romper la regla de un solo color. Opciones: usar
relleno/borde/opacidad en vez de tono, o ampliar la paleta a un segundo color de
señal declarado en los tokens. **Tú decides, pero decláralo en `AGENTS.md` § Diseño
para que quede como regla del proyecto.**

El 2D anidado y los puentes probablemente no caben en el contrato actual de
`CanvasStep` (que asume un grafo plano de nodos). Esta es la parte donde
seguramente haya que **generalizar la base**. Adelante — sólo mantén
`TreeVisualization` funcionando (hay tests).

### 3. Navegación y buscador — el mapa tiene 33 temas

`src/components/KnowledgeMapNav.astro` pinta los temas planos por semana. Con 5
semanas, 33 temas y ~90 operaciones se vuelve un muro.

**Dónde ver la escala real**: `content/knowledge-map.json` — está completo, con las
5 semanas y los 33 temas ya definidos. Míralo antes de diseñar.

Hace falta: colapsar por semana (recordando el estado), y un buscador tipo Ctrl-K
sobre temas y operaciones. Los datos ya están todos en el knowledge map y en la
colección `docs`; no hace falta índice externo.

### 4. Vista de comparación entre estructuras

El curso **es** comparar montículos. El profesor tiene su propia tabla comparativa
binario/binomial/Fibonacci.

**Dónde verla**: `content/analysis/week-01-sem-1-heaps-i.md` sección
`### binary-heap`, el bloque de tabla — ahí está la tabla del profesor con insert,
find-min, extract-min, union, decrease-key y delete. La de Fibonacci está en el
análisis de la semana 2.

Hoy cada estructura tiene su tabla aislada (`ComplexityTable.astro`). Falta la
página que las pone lado a lado, leyendo los `meta.yaml` de varias estructuras.
Ojo: muchas celdas estarán vacías a propósito — el profesor casi nunca da
mejor/promedio/espacio, y **rellenarlas sería inventar**. La tabla debe mostrar `—`.

## Cómo verificar

```sh
pnpm check    # coherencia del knowledge map (no deberías romperlo, pero corre igual)
pnpm test     # tests de layout — si generalizas la base, AMPLÍALOS
pnpm build    # falla si rompes un schema
pnpm dev      # revisión visual: claro/oscuro y ancho de móvil (~390px)
```

Cada familia de visualización nueva necesita su `layout.test.ts`, igual que
`src/visualizations/tree/layout.test.ts`. Es el patrón del repo.

## Contexto que conviene leer una vez

- `AGENTS.md` — el principio rector del proyecto y las restricciones del brief
  original (no gamificación, no gradientes, nunca complejidad sin razonamiento,
  nunca solución antes de las pistas, el código nunca estático).
- `content/analysis/` — 3.500 líneas con el análisis exhaustivo de los 9 PDFs del
  curso. **Es tu fuente para saber qué hay que visualizar.** No inventes diagramas
  que el material no pide; sí diseña los que el material pide y el profesor no dibujó
  (el análisis los marca como "ausencias").

---

## Cambios de contrato solicitados

Anota aquí lo que necesites de `src/lib/schemas.ts` o `src/content.config.ts` en vez
de cambiarlo directamente. Formato: qué campo, en qué colección, para qué, y si es
obligatorio u opcional.

<!-- ejemplo:
- `visualization.steps[].nodes[].fields?: {name, value, time}[]` — opcional, en la
  colección `docs`, para que la familia `persistent` pueda dibujar nodos gordos.
-->
