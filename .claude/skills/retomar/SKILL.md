---
name: retomar
description: Arranque de sesión en la landing de Vireon. Lee el estado real del repo (rama, cambios sueltos, último deploy, ramas y PRs sin mergear) y del tablero de ClickUp, cruza los dos, encuentra la siguiente tarjeta que se puede tomar y lo propone. Úsala al empezar cualquier sesión de trabajo sobre la landing, sobre todo después de días sin tocarla.
allowed-tools: Bash(git *) Bash(gh *) Read Grep Glob
disable-model-invocation: true
---

# Retomar

> Si un bloque `!`…`` de abajo aparece vacío o como texto, tu herramienta no lo ejecuta: corre ese comando tú mismo y usa su salida real, nunca una inventada.

Estado del repo:

!`git fetch -q --prune origin 2>/dev/null && echo "fetch: ok" || echo "fetch: FALLÓ"; git status --short; echo "rama actual: $(git branch --show-current)"; echo "HEAD ↔ origin/main (adelante/atrás): $(git rev-list --left-right --count HEAD...origin/main 2>/dev/null)"`

Últimas publicaciones a Hostinger (cada push a `main` es una):

!`gh run list --workflow deploy.yml --limit 3 2>/dev/null || echo "gh no disponible: revisa la pestaña Actions en GitHub"`

PRs abiertos y ramas del remoto sin mergear:

!`gh pr list --state open 2>/dev/null || echo "gh no disponible"; echo "---"; git for-each-ref --format='%(refname:short) · %(committerdate:relative) · %(authorname)' refs/remotes/origin --no-merged origin/main 2>/dev/null | grep -vE '^origin/(HEAD|main) ' || echo "ninguna"`

## Qué hacer

Las reglas del flujo están en `docs/flujo-de-tickets.md`. Léelo si no lo has leído en esta sesión.

1. **Lee el tablero.** Con el conector de ClickUp, `clickup_filter_tasks` sobre la lista `901419755322` con `include_closed: true` (pagina hasta `has_more: false`). Si el conector no está en la sesión, detente y dilo: sin tablero no hay siguiente tarjeta.
2. **Lo que va antes que cualquier tarjeta**, en este orden:
   - Hay cambios sin commit: di cuáles y no sigas sin que la persona decida qué hacer con ellos.
   - La última publicación de `main` falló: el sitio en vivo puede no ser lo que dice `main`. Eso es lo primero.
   - Hay una rama del remoto sin mergear con más de dos semanas: di cuál, de quién y qué tarjeta parece ser. La regla es cerrarla (mergear o descartar), no seguir encima sin decidirlo.
3. **Cruza tablero y repo.** Repórtalo en una tabla corta, solo lo que no cuadra:
   - Tarjeta en `in progress` sin rama ni PR con su id: probablemente abandonada.
   - Tarjeta en `in review` cuyo PR ya se mergeó: falta confirmar producción con `/cerrar-ticket <id>`.
   - Tarjeta en `in review` sin PR abierto.
   - PR o rama con trabajo que ninguna tarjeta describe.
   - Tarjeta `to do` que el código ya resolvió (compruébalo en el código, no lo supongas).
4. **Elige la siguiente tarjeta.** Candidatas: `to do`, sin etiqueta `cliente` ni `deuda`, con todo lo de **Depende de** en `complete`. De esas, la de ola más baja (`_Ola N · …_` al final de la descripción); en empate, la de prioridad más alta; en empate, la de menos puntos. Si la mejor candidata depende de una tarjeta `cliente`, dilo: el siguiente paso puede ser conseguir ese contenido, no escribir código.
5. **Lista lo que espera a una persona**: las tarjetas `cliente` abiertas y las `blocked`, con lo que falta en una línea cada una. Esto es lo que más frena el sitio y la persona tiene que verlo cada vez.
6. Termina con una propuesta de una línea: `/ticket <id>` con el nombre de la tarjeta, o qué hay que resolver antes. **No implementes nada aquí** y no muevas tarjetas.
