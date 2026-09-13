# CS3014 — Plataforma de Estructuras de Datos Avanzadas

## Principio rector

Una única fuente de verdad: **`content/knowledge-map.json`**. Ningún agente
inventa contenido. Cada agente lee el knowledge map + el material fuente
(`raw-materials/weekN/`) y escribe **sólo** dentro del alcance que el mapa le
asigna.

Eso es lo que permite paralelizar sin que los agentes se pisen ni inventen temas.

## Comandos

```sh
pnpm dev      # servidor de desarrollo (o `astro dev --background`)
pnpm build    # falla si algún meta.yaml o frontmatter viola el schema
pnpm check    # coherencia knowledge-map ↔ carpetas ↔ referencias
pnpm test     # tests del layout de visualización
```

Siempre **pnpm**. La config del proyecto sale de los generadores oficiales
(`create astro`, `astro add`); no escribir config a mano. Dev server en segundo
plano: `astro dev --background`, y `astro dev stop|status|logs`.

## Estructura

```
content/
  knowledge-map.json          ← fuente de verdad; SÓLO lo toca el agente de integración
  weeks/week-0X.md
  structures/<id>/
    meta.yaml                 ← interfaz de coordinación entre agentes
    theory.md                 ← 9 secciones fijas
    operations/<op>.md        ← 9 secciones fijas + visualización + cppSteps
    examples.md               ← mínimo / normal / límite
    exercises.md              ← niveles 1–6 con pistas progresivas
    mastery-check.md
cpp/structures/<id>/          ← step-1..N.cpp + full-implementation.cpp
templates/                    ← lo que recibe cada subagente
raw-materials/weekN/          ← PPTs/PDFs sin procesar
src/
  lib/schemas.ts              ← TODOS los schemas Zod. No duplicarlos en otro lado.
  content.config.ts           ← Content Collections
  components/                 ← CodeEditor, VisualizationCanvas, ExerciseBlock…
  visualizations/tree/        ← primera familia sobre VisualizationCanvas
scripts/check-knowledge-map.mjs
```

## Fases

| Fase | Qué | Paraleliza |
| --- | --- | --- |
| 0 | Ingesta de material → actualizar knowledge map | no, incremental por semana |
| 1 | Scaffolding (hecho) | secuencial |
| 2+3+5 | Teoría, C++ y ejercicios por estructura | **sí, 1 agente por estructura** |
| 4 | Visualizaciones | sí, por familia |
| 6 | Integración + QA | secuencial, cierre |

## Cómo se procesa una semana nueva

```
1. Leer raw-materials/weekN/ (md, pdf o pptx).
2. Actualizar content/knowledge-map.json — ACTUALIZAR, nunca reescribir.
   Un concepto indispensable que no aparezca en las PPTs va como
   supportConcept: true; jamás como tema inventado del curso.
3. Resumir al usuario lo entendido y ESPERAR confirmación.
4. Por cada estructura pendiente, lanzar un subagente en paralelo con:
     - el fragmento del material que le toca
     - su meta.yaml
     - templates/
     - la ruta exacta donde debe escribir
5. Agente de integración (secuencial): cross-links, huérfanos,
   status: generated en el mapa, pnpm check && pnpm build.
```

### Reglas para los subagentes en paralelo

- Cada agente escribe **sólo** en `content/structures/<id>/` y `cpp/structures/<id>/`.
- **Nadie** edita `knowledge-map.json` salvo el agente de integración.
- Dos estructuras relacionadas (AVL depende de BST) se generan igual en
  paralelo: cada una **referencia** a la otra por id, no la reexplica.
- Las visualizaciones son props sobre el componente base, nunca un componente
  nuevo desde cero.

## Restricciones (del brief, no negociables)

- No inventar estructuras "típicas" que no estén en el material.
- No gamificación, no dashboards de tarjetas, no gradientes, no animación decorativa.
- El código nunca como bloque estático: siempre editor interactivo y progresivo.
- Nunca complejidad sin su razonamiento (el schema lo exige: `reasoning` ≥ 20 chars).
- Nunca revelar la solución de un ejercicio antes de las pistas.

## Diseño

Manual técnico. **IBM Plex Sans para leer, IBM Plex Mono para datos** (código,
complejidad, ids, contadores, etiquetas `.tag`). **Un solo azul** (`--accent`) y
sólo para lo que está ACTIVO: el paso actual, el nodo que se visita, la sección
donde vas, el nivel de un ejercicio. Nunca decorativo, nunca gradientes.

- Jerarquía por **tamaño y peso de fondo**, no por bordes: h1 hasta 52px, h2 24px
  con número de sección en mono azul (contador CSS — **los títulos del markdown
  van sin numerar**), cuerpo 17px, metadatos 11px.
- Tres columnas: nav del curso / contenido / riel con el índice de secciones
  (resalta en azul dónde vas) y metadatos. La prosa se limita a 72ch; el código,
  las tablas y las visualizaciones usan todo el ancho.
- Cada bloque tiene su firma: el **código es siempre una losa oscura** en los dos
  temas, la visualización un panel con rejilla de puntos, el razonamiento de
  complejidad y las pistas llevan barra azul a la izquierda.
- Movimiento nativo, sin librerías: view transitions de Astro,
  `animation-timeline: view()` (`.reveal`, `.draw`), entrada escalonada
  (`.stagger`), interpolación de nodos en las visualizaciones, y la visualización
  **se reproduce sola** la primera vez que entra en pantalla.

### Estados en las visualizaciones — un solo azul

`--accent` marca **únicamente lo ACTIVO**: el nodo que la operación toca en el
paso actual. Nunca hay un segundo color de señal. El profesor usa amarillo y
rojo en sus diapositivas (delimitador / respuesta); nosotros traducimos esos
estados a **relleno, contorno, opacidad y trazo**, nunca a tono. El vocabulario
es cerrado — siete estados, definidos en `src/visualizations/canvas-types.ts`
y verificados por `canvas-types.test.ts`:

| estado | relleno | contorno | opacidad | significa |
| --- | --- | --- | --- | --- |
| `idle` | `--paper` | `--rule` fino | 1 | estructura en reposo |
| `active` | `--accent` | `--accent` | 1 | **lo que se toca en este paso — único uso del azul** |
| `marked` | `--paper` | `--ink` + doble contorno | 1 | delimitador / frontera (el amarillo del profesor) |
| `answer` | `--slab` (losa llena) | `--slab` | 1 | respuesta canónica (el rojo del profesor) |
| `shared` | `--sunken` | `--rule` discontinuo | 0.75 | compartido con la versión anterior, no se tocó |
| `copied` | `--paper` | `--ink` grueso | 1 | nodo nuevo de esta versión |
| `muted` | `--fill` | `--rule` discontinuo | 0.45 | descartado / podado |

Aristas: `tree` sólida; `shared` discontinua y curvada (cruza entre versiones);
`pointer` sólida con punta de flecha. Una arista sólo se pinta de azul cuando
une algo activo.

**Doble contorno = frontera. Losa llena = respuesta. Discontinuo = no es tuyo
o ya no cuenta. Opacidad baja = descartado. Azul = ahora.**

Es fiel al material, no una concesión: el profesor ya dibuja los puentes del
fractional cascading con línea punteada, no con color. Como el estado se
codifica en el trazo, cada nodo lleva un `<title>` con su estado en palabras
("hoja 4 — delimitador") para quien usa lector de pantalla.

## Pendiente

- Borrar `demo-bst` y `week-00` cuando entre la primera estructura real.
- Familia de visualización `graph` (`persistent` y `range-tree` ya están
  implementadas — ver `src/visualizations/{persistent,range-tree}/`).
- Ejecutar C++ en el navegador: hoy el editor es editable pero no corre.

## Documentación de Astro

- [Rutas y páginas](https://docs.astro.build/en/guides/routing/)
- [Componentes Astro](https://docs.astro.build/en/basics/astro-components/)
- [Islas de React](https://docs.astro.build/en/guides/framework-components/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Estilos y Tailwind](https://docs.astro.build/en/guides/styling/)
