---
name: cerrar-ticket
description: Audita y cierra una tarjeta de ClickUp de la landing de Vireon. Antes del merge corre la verificación completa, lanza los auditores que exige el diff, revisa el cambio en el navegador a 1440/390/320 px, resuelve cada hallazgo, deja el reporte en la tarjeta, la mueve a in review y prepara commit, push y PR. Después del merge confirma que la publicación salió y que el cambio se ve en producción, y solo entonces la marca complete.
argument-hint: [id de ClickUp o liga de la tarjeta]
allowed-tools: Bash(bash scripts/verificar.sh*) Bash(node scripts/contraste.mjs*) Bash(git status*) Bash(git diff*) Bash(git log*) Bash(git branch*) Bash(git fetch*) Bash(gh pr view*) Bash(gh pr list*) Bash(gh run list*) Bash(gh run view*) Bash(npm run *) Bash(curl -s*) Read Edit Grep Glob Agent
disable-model-invocation: true
---

# Cerrar $ARGUMENTS

> Si un bloque `!`…`` de abajo aparece vacío o como texto, tu herramienta no lo ejecuta: corre ese comando tú mismo y usa su salida real, nunca una inventada. `$ARGUMENTS` es lo que sigue al comando; si aparece literal, sustitúyelo.

Diff de la rama:

!`git fetch -q origin 2>/dev/null; echo "rama: $(git branch --show-current)"; git status --short; git diff --stat origin/main 2>/dev/null`

PR de esta tarjeta:

!`gh pr list --state all --search "$ARGUMENTS" --json number,state,title,headRefName,mergedAt 2>/dev/null || echo "gh no disponible"`

Lee la tarjeta con `clickup_get_task` (`include: ["description"]`) y sus comentarios. Sin conector de ClickUp: **alto**.

**¿Qué cierre es?** Si el PR de esta tarjeta ya está `MERGED`, salta a **Después del merge**. Si no, sigue aquí.

---

## Antes del merge

### Verificación

1. Corre `bash scripts/verificar.sh` y **pega la salida tal cual, sin resumirla**. Si sale en rojo, **detente aquí** y di qué falla. No se cierra una tarjeta explicando por qué el script falla: se corrige. Si la tarjeta o la persona aprobaron una dependencia nueva, se corre con `--permitir-dependencias` y el PR dice quién la aprobó.
2. Revisa `git diff origin/main` completo contra los **Pasos** y el **Fuera de alcance** de la tarjeta. Por cada archivo tocado que la tarjeta no explica, di qué es, por qué se tocó y cómo lo verificaste; si no lo sabes explicar, se revierte.
3. **Navegador.** `preview_start` con `landing-dev`. En la sección que cambió y en la página completa:
   - A **1440, 390 y 320 px** (`resize_window`): sin scroll horizontal (`document.documentElement.scrollWidth <= innerWidth` con `javascript_tool`) y nada encimado ni cortado. Toma una captura a 390 px de la sección.
   - Recorre con Tab lo que cambió: todo lo interactivo recibe foco visible y en un orden que tiene sentido.
   - `read_console_messages` con `onlyErrors`: sin errores.
   - Si la tarjeta toca un formulario, **no lo envíes** (mandaría un lead falso a n8n y a la hoja de cálculo): comprueba con `read_page` que el formulario, su validación y la liga al aviso están, y di que el envío real se prueba en producción con datos de prueba si la persona lo pide.

   Si no hay navegador en la sesión, dilo en el reporte y en el PR con estas palabras: "revisión visual NO hecha en esta sesión". La tarjeta no pasa de `in review` sin esa revisión.

### Auditoría

4. Lanza **en paralelo** los subagentes que el script nombró en **Auditorías que exige este diff**. No es criterio tuyo: si los nombró, corren; si no nombró ninguno, no corras ninguno. A cada uno pásale la liga de la tarjeta, su **Objetivo** y sus **Pasos**, y `origin/main` como base del diff. Pega el veredicto de cada uno.
5. **Triage.** Cada hallazgo de los auditores, cada punto del reporte de `/ticket` que quedó sin corregir y cada cosa que viste en el navegador queda resuelto o registrado **una sola vez** (severidades en `docs/flujo-de-tickets.md`):
   - **CRÍTICO o ALTO:** se corrige en esta tarjeta y se vuelve a correr el paso 1. Solo si la persona lo pospone de forma explícita es tarjeta nueva con `/nuevo-ticket`, con prioridad `urgent`.
   - **MEDIO:** se corrige aquí si lo causó esta tarjeta, si está en archivos que ya toca o si cabe en unos 30 minutos. Si no, `/nuevo-ticket` lo suma a una tarjeta abierta de la misma zona, y solo si no hay ninguna crea una.
   - **BAJO:** si no se corrige aquí, una línea en la tarjeta `Deuda de la landing` (formato en `/nuevo-ticket`).

   Lo que el auditor marque como "ya existía" y no esté en archivos que toca la tarjeta, no se corrige aquí: se reparte por severidad.

### Registro

6. Deja en la tarjeta un comentario (`clickup_create_task_comment`) con el reporte de cierre:

   ```
   Auditoría de cierre — <fecha>
   Rama: <rama>
   Verificación: verde (lint, build, peso <N> KB, reglas)
   Navegador: 1440/390/320 sin scroll horizontal; foco visible; consola limpia
   Auditores: auditor-x: sin hallazgos · auditor-y: 1 MEDIO corregido
   Listo cuando: ✓ … / ✓ … / pendiente de producción: …
   Hallazgos: <cada uno con su destino: corregido aquí · sumado a <tarjeta> · tarjeta nueva <liga> · Deuda>
   Decisiones: <cada DECISION MIA>
   ```

7. Redacta el commit: en español y en presente, como el resto del repo (`Agrega el botón flotante de WhatsApp`). En el cuerpo: `Tarjeta: https://app.clickup.com/t/<id>`, los criterios de **Listo cuando** con su estado y las decisiones.

### Comandos: uno por bloque, y los corre la persona

Los comandos de git y `gh` que escriben (`add`, `commit`, `push`, `pr create`, `pr merge`) no los ejecutas tú: los das en bloques `bash` separados, **un comando por bloque**, para que cada uno tenga su botón. Si la persona dice "hazlo tú", los corres en el mismo orden.

8. En este orden:
   - `git add` con los archivos por nombre (nunca `-A` ni `.`).
   - `git commit -m "$(cat <<'EOT' … EOT)"` con el mensaje del paso 7, terminado con la línea de coautoría que pida la sesión.
   - `git push -u origin $(git branch --show-current)`.
   - `gh pr create --base main --title "…" --body "$(cat <<'EOT' … EOT)"`: mismo título que el commit; el cuerpo con la liga a la tarjeta, los criterios, la evidencia del navegador, el veredicto de cada auditor y el destino de cada hallazgo, y la línea `Mergear este PR publica el sitio en vivo.`
9. Cuando el PR exista, mueve la tarjeta a `in review` y agrega la liga del PR en un comentario.
10. **El merge lo decide una persona.** Cuando te lo pidan, da `gh pr merge <número> --squash --delete-branch` en su propio bloque. Después del merge, vuelve a correr `/cerrar-ticket $ARGUMENTS`.

Si algo de lo anterior no se cumple, no muevas la tarjeta ni prepares el commit: di qué falta y qué propones.

---

## Después del merge

Un merge a `main` dispara `.github/workflows/deploy.yml`. La tarjeta se cierra cuando el cambio **se ve en producción**, no cuando se mergea.

1. `gh run list --workflow deploy.yml --branch main --limit 3`. Identifica la corrida del commit del merge.
   - En curso: di que hay que esperar y en cuánto suele tardar (mira la duración de las corridas anteriores). No hagas sondeos en bucle.
   - Falló: **alto**. Pega `gh run view <id> --log-failed | tail -40`. Si falló en el build, Hostinger sigue sirviendo la versión anterior; si falló en la subida por FTP, el sitio puede estar a medias y es lo primero que se arregla.
2. Verifica en https://www.vireonai.com.mx cada punto de **Listo cuando** que se pueda ver en producción. Con navegador: `navigate` y `get_page_text` o `read_page` (recarga sin caché si ves la versión anterior). Sin navegador: `curl -s https://www.vireonai.com.mx/` y busca el cambio en el HTML o en el JS publicado. Lo que solo se puede comprobar fuera de aquí (la vista previa en WhatsApp, GA4 en tiempo real) se pide a la persona y no se da por bueno.
3. Con todo verificado: comentario `En producción desde <fecha>. Verificado: <qué y cómo>.` y estado `complete`. Si algo no se ve o se ve mal, la tarjeta se queda en `in review` con un comentario que dice qué falta, y se arregla en una rama nueva con la misma tarjeta.
