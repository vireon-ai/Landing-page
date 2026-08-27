---
description: Porta una sección del prototipo "Producto Vivo" al sitio, en tema claro
argument-hint: [nombre de la sección, p. ej. calculadora | quiz | servicios | metodo | faq | cierre | footer]
---

Vas a portar **una sola sección** del rediseño "Producto Vivo" al sitio.

Sección a portar: **$ARGUMENTS**

## Paso 0 — Situarte

1. Confirma que NO estás en `main`. Cada push a `main` publica el sitio en vivo y
   no hay staging. Si estás en `main`, crea una rama `rediseno/$ARGUMENTS` desde
   `main` actualizado y trabaja ahí.
2. Confirma que el árbol está limpio (`git status`). Si hay cambios sin
   commitear, dime cuáles y espera instrucciones antes de tocar nada.

## Paso 1 — Leer, en este orden

1. `CLAUDE.md` — reglas del proyecto y sistema de diseño.
2. `docs/rediseno/PLAN.md` — busca la sección **$ARGUMENTS** en la tabla de
   estado. Ahí dice qué componente del repo le corresponde y si tiene contenido
   pendiente.
3. `docs/rediseno/prototipo-producto-vivo.html` — el prototipo de referencia
   completo. Localiza el bloque de **$ARGUMENTS** y estudia su marcado, su CSS y
   su comportamiento. Ahí ya está resuelto el problema de diseño.
4. El componente actual del repo y su CSS hermano.

## Paso 2 — Proponer antes de escribir

Antes de tocar una sola línea, dime en pocas líneas:

- qué archivos vas a crear, modificar o borrar, y qué harás en cada uno
- qué se conserva del componente actual y qué se reemplaza
- si detectas algo que el prototipo resuelve pero que aquí requiere una decisión
  que no está tomada (contenido que falta, un dato que no existe, una liga que
  no tenemos), dilo ahora en vez de inventarlo

**Espera mi visto bueno.** No escribas código hasta que te lo dé.

## Restricciones duras

- **El sitio se queda en TEMA CLARO. Siempre.** El prototipo de referencia está
  en oscuro y eso es solo un accidente del prototipo. Nunca conviertas el sitio
  ni una sección a modo oscuro, ni agregues un interruptor de tema, ni uses
  fondos oscuros "solo para esta sección". Lo que se porta del prototipo es la
  estructura, la jerarquía, la densidad y el movimiento. Los colores se traducen
  a las variables claras de `src/styles/index.css`.
- **Una sección a la vez.** No toques ningún otro componente. La única excepción
  es `src/App.tsx` si el plan pide mover esta sección de lugar, y en ese caso lo
  dices en el paso 2.
- **La marca no se toca.** Colibrí, `--primary` #48A9A6, `--secondary` #4281A4,
  `--accent` #E4CC37, Outfit e Inter se quedan como están. No modifiques
  variables existentes de `src/styles/index.css`; si hace falta un valor nuevo,
  agrégalo como variable nueva con un comentario que explique por qué.
- **Sin dependencias nuevas.** El movimiento va en SVG y CSS. Nada de
  framer-motion, GSAP, lottie ni video. El sitio carga en 351 ms y eso no se
  negocia.
- **Los webhooks de n8n se conservan intactos.** `FinalCTA.tsx` y `Quiz.tsx`
  mandan los leads a `n8n.srv946409.hstgr.cloud`. Si rediseñas una de esas
  secciones, el envío sigue funcionando exactamente igual.
- **No inventes contenido de negocio.** Cifras, nombres de clientes, precios,
  testimonios y plazos no se inventan. Si el prototipo trae contenido de ejemplo,
  márcalo claramente como pendiente y avísame en el resumen final.
- **No hagas commit, no hagas push, no abras PR.** Solo propones el mensaje.

## Restricciones técnicas

- TypeScript, un componente por sección con su CSS hermano del mismo nombre.
- Todo el contenido visible en español de México.
- Usa las variables CSS. Nada de hexadecimales sueltos en los componentes.
- Contraste: `--primary` (#48A9A6) da 2.80:1 sobre fondo claro y reprueba WCAG
  AA. Sirve para rellenos, bordes, iconos y puntos decorativos. Para TEXTO
  turquesa sobre fondo claro usa `--primary-deep` (#2F817E), que da 4.60:1.
  Nunca pongas texto blanco sobre `--primary`.
- Lo interactivo se hace con elementos interactivos reales: `<button>`, `<a>`,
  `<input>`. Nunca un `<div>` con `onClick`. Foco de teclado siempre visible.
- Todo SVG informativo lleva `role="img"` y un `aria-label` que lo describa en
  una frase.
- Respeta `prefers-reduced-motion`: con movimiento reducido las animaciones se
  detienen en su estado más informativo, nunca en blanco.
- Debe verse bien desde 320px. La página nunca debe tener scroll horizontal;
  si un bloque ancho no cabe, que se desplace dentro de su propio contenedor.

## Paso 3 — Verificar antes de darlo por terminado

1. `npm run dev` y revisa la sección a 1440px y a 390px de ancho.
2. Confirma que a 390px no hay scroll horizontal en la página.
3. Recorre la sección con Tab: todo lo interactivo debe recibir foco visible.
4. `npm run lint`
5. `npm run build` — `tsc -b` corre primero y un error de TypeScript cancela la
   publicación completa a Hostinger. Tiene que pasar.

## Paso 4 — Cerrar

1. Actualiza la fila de **$ARGUMENTS** en la tabla de `docs/rediseno/PLAN.md`:
   márcala como hecha y anota en una línea qué quedó pendiente, si algo quedó.
2. Resúmeme qué cambió, qué decisiones tomaste y qué contenido real me falta
   entregarte.
3. Propón el mensaje de commit en español y en presente. No lo ejecutes tú.
