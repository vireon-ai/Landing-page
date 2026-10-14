---
name: nuevo-ticket
description: Registra trabajo nuevo de la landing de Vireon en el tablero de ClickUp. Primero intenta sumarlo a una tarjeta abierta de la misma zona; un hallazgo BAJO va a la tarjeta de Deuda. Solo si nada de eso aplica redacta una tarjeta con la plantilla del tablero, la enseña para aprobación y la crea con etiqueta, prioridad y dependencias. Úsala para convertir un hallazgo de auditoría, una idea de mejora o un pedido de un socio en trabajo ejecutable.
argument-hint: [qué hay que hacer, en una frase]
allowed-tools: Read Grep Glob Bash(git *)
disable-model-invocation: true
---

# Nueva tarjeta: $ARGUMENTS

Las reglas del flujo están en `docs/flujo-de-tickets.md`, incluida la plantilla.

Antes que nada, lee el tablero: `clickup_filter_tasks` sobre la lista `901419755322` con `include_closed: true`, paginando hasta `has_more: false`. Sin conector de ClickUp: **alto**.

## ¿De verdad es una tarjeta?

Una tarjeta nueva es el último recurso, no el primero.

1. **Ya existe.** Busca en el tablero, abiertas y cerradas, algo que pida lo mismo con otras palabras. Si existe abierta, dilo y no crees nada. Si existe cerrada y el problema volvió, se reabre esa (comentario con lo que pasó y estado `to do`).
2. **Es BAJO** (de una auditoría o de un reporte de `/ticket`): no es tarjeta. Va como línea a la tarjeta `Deuda de la landing` (abajo).
3. **Hay una tarjeta abierta de la misma zona** (mismo componente, misma sección o mismo tema) y el trabajo cabe sin pasar de unas 4 horas en total: **se suma a esa tarjeta**. Agrega a su descripción, con `clickup_update_task`, el paso nuevo en **Pasos**, el criterio en **Listo cuando** y, si cambian, los **Puntos** y el **Estimado**, más una línea en **Ojo**: `Se suma <severidad> de <auditor o persona> (<fecha>): …`. Deja un comentario que diga qué se sumó. Si esa tarjeta ya está `in progress`, pregunta antes: le cambia el alcance a alguien que ya está trabajando.
4. Solo si nada de lo anterior aplica se redacta una tarjeta nueva.

## Redactar la tarjeta

1. **Plantilla** de `docs/flujo-de-tickets.md`, con estos campos y en este orden: la línea de puntos, **Objetivo**, **Pasos**, **Listo cuando**, y los opcionales **Fuera de alcance**, **Ojo** y **Depende de**, y al final `_Ola N · Área_`. Toma como modelo de tono una tarjeta existente de la misma etiqueta.
2. **Puntos** en la escala del tablero (1, 2, 3, 5, 8, 13), con el riesgo y la criticidad que los justifican. Una tarjeta de más de 8 puntos o más de 4 horas se parte en dos.
3. **Listo cuando** son hechos que se comprueban en el navegador o con un comando, con valores concretos ("el `<title>` dice X", "a 320 px no hay scroll horizontal"), nunca "se ve bien".
4. **Pasos** nombra archivos y componentes reales. Compruébalos en el repo antes de escribirlos.
5. **Ola**: la de las tarjetas con las que se relaciona. Si nace de un hallazgo CRÍTICO o ALTO pospuesto, va en la ola más baja abierta.
6. **Etiqueta**: `m1` rediseño de secciones, `m2` SEO, `m3` analítica, `m4` canal, legal, credibilidad y accesibilidad, `cliente` si la resuelve una persona y no código.
7. **Prioridad**: `urgent` solo para un CRÍTICO o ALTO pospuesto, o para lo que bloquea una ola; el resto `high`, `normal` o `low` según criticidad.
8. **Si nace de un hallazgo**, el **Objetivo** empieza con `Hallazgo <SEVERIDAD> de <auditor> en <tarjeta>:` y explica el hallazgo con archivo y línea, y por qué no se corrigió en la tarjeta original.
9. **No inventes contenido de negocio** en la tarjeta: si hace falta un dato (precio, cifra, nombre, liga), la tarjeta lo pide y depende de una tarjeta `cliente` que lo consiga; si esa no existe, redáctala también.

## Aprobar y crear

1. **Enseña la tarjeta completa y espera un sí.** El tablero lo ven los socios, así que no se crea nada sin aprobación.
2. Con el sí: `clickup_create_task` en la lista `901419755322`, con nombre, descripción en markdown, etiqueta, prioridad y estado `to do`.
3. Por cada tarjeta de **Depende de**, registra la dependencia con `clickup_add_task_dependency` (la nueva espera a la otra), para que el tablero la enseñe.
4. Responde con la liga de la tarjeta creada.

## La tarjeta de Deuda

Una sola tarjeta, `Deuda de la landing`, con etiqueta `deuda`, que nunca se cierra. Si no existe, se crea (con el mismo sí de arriba) con esta descripción y la primera línea:

```markdown
Hallazgos BAJO que no se corrigieron en su tarjeta. Se revisan con la persona cada tanto: cada línea se corrige, se suma a una tarjeta o se descarta con su razón.

- [ ] BAJO · <tarjeta donde apareció> · <auditor o persona> · `src/components/X.tsx:42` — qué pasa y por qué importa, en una frase.
```

Cada línea nueva se agrega al final de la descripción con `clickup_update_task`. Una línea resuelta se marca `[x]` y termina con su destino: `→ corregido en <tarjeta>`, `→ sumado a <tarjeta>`, `→ tarjeta <liga>` o `→ descartado: <razón>`.
