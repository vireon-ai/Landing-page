# Flujo de tickets de la landing

Cada pendiente de la landing es una tarjeta en ClickUp, y ninguna llega a `main`
sin pasar una auditoría. Este documento manda sobre las skills: si una skill y
este archivo dicen cosas distintas, se corrige la skill.

Existe porque aquí **cada merge a `main` se publica solo en Hostinger y no hay
staging**. La auditoría es la única compuerta entre el código y la página que ve
un cliente.

## Dónde vive el backlog

**ClickUp es la fuente de verdad.** El repo guarda las reglas, no la lista.

| Dato | Valor |
|---|---|
| Lista | `Landing Vireon — Rediseño Producto Vivo` |
| `list_id` | `901419755322` |
| Workspace | `90141008024` (espacio Vireon, `90144706382`) |
| Tablero | https://app.clickup.com/90141008024/v/b/li/901419755322 |

Las skills hablan con ClickUp por el conector de ClickUp (herramientas
`clickup_get_task`, `clickup_filter_tasks`, `clickup_update_task`,
`clickup_create_task_comment`, `clickup_create_task`). Si en la sesión no está el
conector, **las skills se detienen**: no se trabaja una tarjeta de memoria ni se
inventa su contenido.

`docs/rediseno/PLAN.md` sigue siendo la referencia de diseño del rediseño (qué
sección del prototipo va en qué componente), pero el estado de cada pendiente es
el de su tarjeta.

## Estados

| Estado | Quién lo pone | Significa |
|---|---|---|
| `to do` | `/nuevo-ticket` | Lista para tomarse si sus dependencias están en `complete` |
| `in progress` | `/ticket` | Hay una rama abierta con este trabajo. Una sola persona a la vez |
| `in review` | `/cerrar-ticket` | La auditoría pasó y hay un PR abierto esperando que una persona lo mergee |
| `blocked` | cualquier skill | Falta algo que no es código (contenido, una decisión, una liga). La tarjeta dice qué en un comentario |
| `complete` | `/cerrar-ticket`, después del merge | El cambio está **en producción** y se verificó en https://www.vireonai.com.mx |

Una tarjeta no pasa a `complete` cuando se mergea, sino cuando se ve en el sitio
en vivo. El merge solo dispara la publicación; la publicación puede fallar.

## Las tarjetas

### Etiquetas

- `m1` rediseño de secciones · `m2` SEO · `m3` analítica · `m4` canal, legal,
  credibilidad y accesibilidad.
- `cliente`: tarea de contenido o decisión que resuelve una persona, no código
  (el número, los precios, los casos reales). `/ticket` no las implementa: las
  reporta como pendientes de ustedes.
- `deuda`: solo la lleva la tarjeta de Deuda (ver abajo).

### Plantilla

Todas las tarjetas de desarrollo siguen la misma forma, en la descripción:

```markdown
**Puntos: N** · Estimado: Xh · Riesgo ×R (por qué) · Criticidad ×C (por qué)

**Objetivo:** qué cambia para el visitante, en una o dos frases.

**Pasos**

1. Pasos concretos, con archivos y componentes por nombre.

**Listo cuando** hechos que se pueden comprobar en el navegador o con un comando.

**Fuera de alcance:** lo que esta tarjeta no toca aunque quede cerca. (Opcional.)

**Ojo:** riesgos, decisiones ya tomadas, trampas. (Opcional.)

**Depende de:** nombres exactos de otras tarjetas, separados por `;`. (Opcional.)

_Ola N · Área_
```

Las de contenido (`cliente`) cambian la primera línea por
`**Tarea de contenido** · Estimado: X · Sin puntos (no es trabajo de desarrollo)`.

**Depende de** cita tarjetas por su nombre exacto. Cuando `/nuevo-ticket` crea una
tarjeta, además registra la dependencia en ClickUp para que el tablero la enseñe.

## El ciclo

```
/retomar ──► /ticket <id> ──► /cerrar-ticket <id> ──► merge ──► /cerrar-ticket <id> (otra vez)
 lee estado     rama + código    verificación + auditoría     una persona   confirma producción
 propone        to do → in progress   → in review + PR                     → complete
```

`/nuevo-ticket` entra cuando aparece trabajo que no cabe en la tarjeta actual.

### Ramas

Una tarjeta = una rama = un PR. La rama nace de `origin/main` y se llama
`ticket/<id>-<slug>`, con el id de ClickUp: `ticket/86bbqm7nb-metadatos`. En una
sesión de Claude Code que ya trae su rama `claude/...` en un worktree, se trabaja
en esa rama y el id va en el PR.

Nunca se hace `push` directo a `main`.

### Commits y PRs

- Mensaje en español y en presente, como el resto del repo:
  `Agrega los metadatos y la tarjeta para compartir la liga`.
- El cuerpo del commit y del PR llevan la liga a la tarjeta
  (`Tarjeta: https://app.clickup.com/t/<id>`), los criterios de **Listo cuando**
  con su estado y el veredicto de cada auditoría.
- Los comandos de git y `gh` los da la skill en bloques, uno por bloque, y los
  corre la persona. Si la persona dice "hazlo tú", se corren.

## La auditoría

Dos capas, y las dos tienen que pasar:

1. **`bash scripts/verificar.sh`**: comprobaciones deterministas. Lint, build
   (`tsc -b` incluido), presupuesto de peso, y las reglas de `CLAUDE.md`
   convertidas en chequeos: tema claro, sin hexadecimales nuevos, webhooks de n8n
   intactos, liga al aviso junto a cada formulario, aviso igual en markdown y en
   componente, páginas declaradas en `vite.config.ts`, sin dependencias nuevas,
   sin secretos. **Si el script sale en rojo, el ticket no se cierra.** No se
   "explica" un fallo: se corrige. CI corre el mismo script en cada PR
   (`.github/workflows/verificar.yml`).
2. **Subagentes auditores**: revisan lo que un script no puede juzgar. El script
   imprime cuáles exige el diff; si los nombró, corren, y si no, no.

| Auditor | Corre cuando el diff toca | Busca |
|---|---|---|
| `auditor-leads` | formularios, `config.ts`, `fetch`, `localStorage`, analítica, el aviso | Leads que se pierden, datos personales mal manejados, aviso que deja de ser cierto |
| `auditor-accesibilidad` | componentes, CSS, estilos globales | Contraste, teclado, foco, lectores de pantalla, movimiento reducido, 320px |
| `auditor-contenido` | texto visible (`.tsx`, `index.html`, aviso) | Inglés, datos de negocio inventados, cifras sin fuente, tono que no suena a empresa seria |
| `auditor-rendimiento` | `package.json`, `vite.config.ts`, `index.html`, `public/`, `src/assets/`, workflows | Peso, imágenes, dependencias, metadatos, que las dos páginas sigan entrando al build |

Además, `/cerrar-ticket` revisa el cambio **en el navegador** a 1440, 390 y
320 px: sin scroll horizontal, foco visible con Tab y consola sin errores.

### Severidades y qué pasa con cada hallazgo

Un hallazgo no es una tarjeta nueva por defecto. En otro proyecto, convertir cada
hallazgo en ticket multiplicó el backlog por cuatro en una fase.

- **CRÍTICO** (se pierden leads, se rompe el sitio, se expone un dato personal,
  algo ilegal) y **ALTO** (una sección no funciona con teclado o en móvil,
  contraste que reprueba en texto principal, el aviso deja de ser cierto): se
  corrigen en esta misma tarjeta antes de cerrar.
- **MEDIO**: se corrige aquí si lo causó esta tarjeta, si está en archivos que ya
  toca o si cabe en unos 30 minutos. Si no, se suma a una tarjeta abierta de la
  misma zona, y solo si no hay ninguna se crea una con `/nuevo-ticket`.
- **BAJO**: si no se corrige aquí, es una línea en la tarjeta de Deuda.

Los hallazgos de las auditorías van en el comentario de cierre de la tarjeta y en
el PR, cada uno con su destino: corregido aquí, sumado a otra tarjeta, tarjeta
nueva o Deuda.

### La tarjeta de Deuda

Una sola tarjeta, `Deuda de la landing`, con etiqueta `deuda`, que nunca se cierra.
Su descripción es la lista de hallazgos BAJO, una línea por hallazgo:

```markdown
- [ ] BAJO · <tarjeta donde apareció> · <auditor> · `src/components/X.tsx:42` — qué pasa y por qué importa.
```

Si no existe, `/nuevo-ticket` la crea con la primera línea. Cada tanto se revisa
con la persona: cada línea se corrige, se suma a una tarjeta o se descarta con su
razón. Descartar está bien: un BAJO que nadie extrañó en un mes casi siempre lo es.

## Lo que ninguna skill hace sola

- Mergear un PR: lo decide una persona.
- Inventar contenido de negocio (cifras, clientes, precios, testimonios, plazos).
  Si falta, la tarjeta pasa a `blocked` con un comentario que dice qué falta.
- Agregar una dependencia de npm sin que la tarjeta o la persona la aprueben de
  forma explícita.
- Cambiar el texto legal del aviso sin que lo pida una persona.
- Borrar tarjetas. Las que sobran se cierran con un comentario que explica por qué.
