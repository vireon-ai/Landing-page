# Rediseño "Producto Vivo" — plan de migración

Dirección acordada: la página deja de *describir* la automatización y la
*ejecuta en pantalla*. El material de referencia vive en esta carpeta.

**Regla que manda sobre todo lo demás:** la marca no se toca. Colibrí,
`--primary` #48A9A6, `--secondary` #4281A4, `--accent` #E4CC37, Outfit e Inter
se quedan exactamente como están. Lo que cambia es estructura, jerarquía,
densidad y movimiento.

El prototipo de referencia está en tema oscuro. **El sitio se queda en claro de
forma permanente** — no es un paso intermedio, es la decisión. Portar una sección
significa traer su estructura, su jerarquía y su movimiento, traduciendo los
colores a las variables claras de `src/styles/index.css`.

## Cómo se trabaja

Una sección por sesión, en su propia rama, con el comando
`/portar-seccion <nombre>`. Nada de portar varias de un jalón: cada sección se
revisa en `localhost:5173` y se aprueba antes de pasar a la siguiente.

---

## Estado

| # | Sección del prototipo | Componente del repo | Estado |
|---|---|---|---|
| 1 | Hero con flujo en vivo | `Hero.tsx` + `LiveFlow.tsx` | ✅ Hecho, en claro |
| — | *(orden sugerido de aquí en adelante: 6 → 2 → 7 → 8 → 4 → 5 → 9)* | | |
| 2 | ¿Qué te está costando? (calculadora arriba) | `ROICalculator.tsx` + orden en `App.tsx` | Pendiente |
| 3 | Dos soluciones reales, con flujo animado | `Solutions.tsx` reemplaza a `SocialProof.tsx` | ✅ Hecho, en claro · faltan números |
| 4 | Servicios con mini-demos | `Services.tsx` | Pendiente |
| 5 | 30 días semana por semana | `Methodology.tsx` | Pendiente |
| 6 | Test con score antes del correo | `Quiz.tsx` | Pendiente · el de mayor impacto |
| 7 | Objeciones reales | `FAQ.tsx` | Pendiente |
| 8 | Cierre con WhatsApp primero | `FinalCTA.tsx` | Pendiente |
| 9 | Footer en español | `Footer.tsx` | Pendiente |

> **Ojo con la 4.** Las dos soluciones reales (la inmobiliaria y la de contenido)
> ya viven en `Solutions.tsx`, arriba. Cuando toque portar `Services.tsx` no las
> repitas ahí: la página las enseñaría dos veces. Servicios tiene que hablar de
> categorías de trabajo, no de estos dos productos. Existe un `servicios.patch`
> que sí los duplicaba y por eso se descartó.

## Por qué ese orden

1. **El quiz primero** (`/portar-seccion quiz`). Enseñar el score antes de pedir
   el correo es el cambio con más efecto de toda la lista, y no depende de que
   consigas contenido nuevo.
2. **La calculadora después** (`/portar-seccion calculadora`), incluyendo subirla
   en `App.tsx` a la posición 2. Ya funciona; lo que cambia es dónde está y cómo
   se ve el resultado.
3. **Objeciones y cierre** son reescrituras de copy sobre estructura existente:
   baratas y de efecto inmediato en conversión.
4. **Servicios y método** piden más trabajo de front (las mini-demos animadas).
5. **Las anatomías al final**, porque dependen de que consigas los tres proyectos
   reales con sus números. Es el único bloque bloqueado por contenido, no por
   código.
6. **El footer** se puede hacer en cualquier momento; es media hora.

## Arreglos sueltos, independientes del rediseño

Ninguno de estos toca el diseño y todos se pueden publicar por separado.

- [ ] `index.html`: `lang="es-MX"`, título real, meta description, Open Graph con
      imagen, canonical. Hoy el título es "Vireon" y no hay una sola etiqueta más:
      compartir la liga en WhatsApp o LinkedIn produce una tarjeta vacía.
- [ ] `Footer.tsx` y el menú móvil de `Navbar.tsx` están en inglés sobre un sitio
      en español ("Services", "Process", "About Us", "Get Started").
- [ ] Los tres botones "Conocer más" de `Services.tsx` no hacen nada. O apuntan a
      páginas reales o se quitan.
- [ ] `Quiz.tsx`: el botón de inicio debe desplazar la vista hasta el test. Hoy el
      quiz se abre en su lugar y si el botón quedó fuera de pantalla parece que
      no pasó nada.
- [ ] No hay analítica de ningún tipo. GA4 + Microsoft Clarity, con eventos
      nombrados en: inicio del test, cada pregunta, abandono, uso de la
      calculadora y clic en cada CTA. Sin esto el rediseño se evalúa a ciegas.
- [ ] No hay WhatsApp en ninguna parte. En B2B PyME mexicana es el canal que
      cierra.
- [ ] No hay aviso de privacidad y `FinalCTA.tsx` y `Quiz.tsx` capturan nombre,
      empresa y correo. La LFPDPPP lo exige.
- [ ] `Quiz.tsx`: las opciones son `<div className="quiz-option">` sin `role` ni
      foco. Deben ser `<button>` para que funcionen con teclado.
- [ ] La escasez de "solo 5 diagnósticos disponibles este mes" está escrita en el
      código y no cambia nunca. O se vuelve real o se quita.

## Lo que no hay que romper

- **La velocidad.** El sitio carga en 351 ms con un solo JS y un solo CSS.
  Todo el movimiento va en SVG y CSS: nada de librerías de animación ni video.
- **Los webhooks de n8n.** `FinalCTA.tsx` y `Quiz.tsx` mandan los leads a
  `n8n.srv946409.hstgr.cloud`. Cualquier rediseño de esas secciones conserva el
  envío tal cual.
- **El build.** `npm run build` corre `tsc -b` primero y un error de TypeScript
  cancela la publicación completa a Hostinger. No hay staging.

## Contenido que hace falta antes de publicar el rediseño completo

- ~~Número real de WhatsApp~~. Ya está: `src/config.ts` trae `5214779086863`.
  Falta que alguien abra los dos CTA de `Solutions.tsx` desde un celular y
  confirme que el chat abre con el mensaje ya escrito.
- **Precio de las suscripciones.** `Solutions.tsx` dice "solo una mensualidad"
  sin cifra, porque no hay una autorizada para publicar. En cuanto definas el
  rango, el bloque `.model` es donde va.
- Números reales de las dos soluciones de `Solutions.tsx`: hoy la sección enseña
  el mecanismo, no resultados. Sin cifras ni permiso de los clientes no se puede
  escribir "subimos X%" ni poner testimonios con nombre.
- La conversación y la publicación de las demos son ejemplos ilustrativos,
  marcados como tal en la interfaz ("una conversación de ejemplo")
- Rango de precios que sí estés dispuesto a publicar
- Liga de calendario y aviso de privacidad publicado
- Fuente y año para cualquier estadística que se conserve
