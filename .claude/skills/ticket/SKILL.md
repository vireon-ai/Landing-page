---
name: ticket
description: Abre e implementa una tarjeta del tablero de ClickUp de la landing de Vireon por su id, su liga o su nombre. Se sincroniza con origin/main, lee la tarjeta completa, verifica que nadie más la tenga y que sus dependencias estén en producción, crea la rama, mueve la tarjeta a in progress, implementa exactamente lo que piden sus Pasos y se detiene en Listo cuando. No hace commit.
argument-hint: [id de ClickUp, liga de la tarjeta o parte del nombre]
allowed-tools: Bash(bash scripts/verificar.sh*) Bash(node scripts/contraste.mjs*) Bash(git *) Bash(gh pr list*) Bash(gh pr view*) Bash(npm run *) Bash(npx tsc*) Read Edit Write Glob Grep Agent
disable-model-invocation: true
---

# Ticket $ARGUMENTS

> Si un bloque `!`…`` de abajo aparece vacío o como texto, tu herramienta no lo ejecuta: corre ese comando tú mismo y usa su salida real, nunca una inventada. `$ARGUMENTS` es lo que sigue al comando; si aparece literal, sustitúyelo.

Estado del repo contra `origin/main` recién traído:

!`git fetch -q --prune origin 2>/dev/null && echo "fetch: ok" || echo "fetch: FALLÓ — sin red o sin acceso a origin"; echo "rama actual: $(git branch --show-current)"; echo "HEAD ↔ origin/main (adelante/atrás): $(git rev-list --left-right --count HEAD...origin/main)"; echo "cambios sin commit:"; git status --short`

## Paso 0: la tarjeta

1. **Encuéntrala.** Si `$ARGUMENTS` es una liga, el id es lo que sigue a `/t/`. Si es un id, úsalo. Si es texto, busca con `clickup_filter_tasks` en la lista `901419755322` y elige por nombre; si hay más de una candidata, pregunta cuál. Sin conector de ClickUp en la sesión: **alto**, dilo.
2. **Léela completa**: `clickup_get_task` con `include: ["description", "checklists", "dependencies"]` y `clickup_get_task_comments`. Los comentarios pueden traer decisiones que cambian los Pasos (un `PLAN APROBADO`, un "esto ya no va"); mandan sobre la descripción.
3. **Altos, en este orden. Detente en el primero que aplique y dilo:**
   - `fetch: FALLÓ`: sin `origin/main` al día no sabes si alguien ya cerró o tomó la tarjeta.
   - Estado `complete`: ya está en producción.
   - Estado `in progress` o `in review`, o una rama del remoto o un PR que lleve el id: alguien más la tiene. Busca con `git branch -r --list "*<id>*"` y `gh pr list --state open --search <id>`. Si es tu propia rama en esta sesión, la retomas.
   - Etiqueta `cliente`: no es código. Di qué decisión o contenido pide y a quién le toca.
   - Algo de **Depende de** no está en `complete` (búscalas por nombre en la lista): dilo y propón el orden. Si la tarjeta dice "deja X apuntando a Y mientras no exista", esa dependencia no bloquea.
   - Hay cambios sin commit y no estás en la rama de esta tarjeta: pueden ser de otra sesión. No cambies de rama ni los mezcles.
4. **Contrasta la tarjeta con el código actual.** Las tarjetas se escribieron en una fecha y el sitio siguió cambiando. Por cada afirmación de la descripción que puedas comprobar ("hoy el título dice Vireon", "Quiz.tsx tiene 468 líneas", "no existe X"), compruébala. Si algo ya cambió —un paso ya está hecho, un archivo se movió, la tarjeta contradice `CLAUDE.md`—, **dilo antes de escribir código** y propone cómo ajustar el alcance. Si la tarjeta contradice una regla de `CLAUDE.md`, gana `CLAUDE.md`, salvo que la persona diga otra cosa aquí.

## Paso 1: la rama

La rama nace de `origin/main`, nunca de tu `main` local.

| Rama actual | Adelante · atrás | Qué haces |
|---|---|---|
| `ticket/<id>-…` de esta tarjeta | cualquiera | La retomas. Si va atrás, propón `git merge origin/main` y espera el sí |
| `claude/...` (worktree de Claude Code) | `0 · 0` | Te quedas en ella |
| `claude/...` | `0 · N` | `git merge --ff-only origin/main` y te quedas |
| `claude/...` | `N · …` con N > 0 | **Alto**: esta sesión ya tiene commits de otra cosa, y una tarjeta = un PR |
| cualquier otra (`main`, la de otra tarjeta) | — | `git switch --no-track -c ticket/<id>-<slug> origin/main`, con un slug de dos o tres palabras |

Con la rama lista, mueve la tarjeta a `in progress` (`clickup_update_task`) y deja un comentario de una línea: `En curso en la rama <rama>.`

## Paso 2: proponer antes de escribir

Lee `CLAUDE.md` y `docs/flujo-de-tickets.md`. Si la tarjeta es de rediseño (etiqueta `m1`) y porta una sección del prototipo, sigue además el **Paso 1** (qué leer) y las **Restricciones** de `.claude/commands/portar-seccion.md`: aplican completas.

Antes de tocar código, dile a la persona en pocas líneas:

- qué archivos vas a crear, modificar o borrar, y qué haces en cada uno;
- qué del comportamiento actual se conserva (los envíos a n8n siempre);
- lo que la tarjeta pide y requiere una decisión que no está tomada: contenido que falta, un dato que no existe, una liga que no hay. **No lo inventes.** Si sin eso no se puede avanzar, la tarjeta pasa a `blocked` con un comentario que dice qué falta, y te detienes.

Si la tarjeta es de 1 o 2 puntos y no hay decisiones abiertas, basta una línea y sigues. Si es de 5 puntos o más, **espera el visto bueno**.

## Paso 3: implementar

- El alcance son los **Pasos** de la tarjeta. Lo que diga **Fuera de alcance** no se toca ni de paso.
- **Se corrige aquí** lo que encuentres en el camino si (a) lo rompió o lo destapó esta tarjeta, (b) está en un archivo que la tarjeta ya toca, o (c) cabe en unos 30 minutos. Cada una va al reporte como `CORREGIDO DE PASO:` con archivo y cuál de las tres razones aplica.
- **Nunca de paso**, aunque quepa: dependencias nuevas, cambiar el texto legal del aviso, cambiar un webhook, pasar algo a tema oscuro, contenido de negocio inventado.
- **Lo demás** va al reporte con su severidad (CRÍTICO, ALTO, MEDIO, BAJO; definiciones en `docs/flujo-de-tickets.md`). `/cerrar-ticket` decide su destino.
- Antes de pintar texto de color, comprueba el contraste: `node scripts/contraste.mjs --variable --fondo`.
- Bucle corto mientras trabajas: `bash scripts/verificar.sh --rapido`.

## Paso 4: al terminar

1. Corre `bash scripts/verificar.sh --rapido` y **pega la salida tal cual**. Arregla lo que salga en rojo.
2. Revisa el cambio en el navegador si tienes uno: `preview_start` con `landing-dev` (`.claude/launch.json`), a 1440 y a 390 px. Si no hay navegador en la sesión, dilo; `/cerrar-ticket` lo exige.
3. Comprueba cada punto de **Listo cuando** que se pueda comprobar en local y pega la evidencia.

Repórtame, en este orden:

- **Listo cuando**, punto por punto: cumplido, no cumplido, o verificable solo en producción (por ejemplo, la tarjeta de WhatsApp o LinkedIn al pegar la liga), con la evidencia.
- Archivos creados y modificados.
- Decisiones que la tarjeta no especificaba, cada una con `DECISION MIA:`.
- Lo corregido de paso, con `CORREGIDO DE PASO:`.
- Lo detectado y NO corregido: severidad, `archivo:línea`, por qué importa y por qué no cupo aquí.

**No hagas commit.** El cierre es `/cerrar-ticket <id>`.
