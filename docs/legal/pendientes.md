# Aviso de privacidad — lo que falta confirmar

El borrador que llegó traía marcas `[FILL: …]` y una sección de preguntas de
aclaración. Aquí queda el registro de qué se rellenó, con qué base, y qué sigue
abierto. Esta lista **no** se publica.

## Lo que se rellenó y con qué base

| Dónde | Qué se puso | De dónde salió |
|---|---|---|
| Encabezado y §15 | `https://www.vireonai.com.mx/aviso-de-privacidad/` | La URL de ejemplo del propio borrador, que es la que sirve esta implementación |
| §1 | Nombre de la persona física, su actividad empresarial y que Vireon es la marca bajo la que opera | Decisión del responsable (6 de octubre de 2026): el aviso no publica domicilio |
| §7 | Se quitó el `[FILL: confirmar si existe alguna otra transferencia]` | El párrafo ya declara que no hay otras transferencias. **Confírmalo antes de publicar** |
| §17, razón social | Juan Manuel González Ascencio, persona física con actividad empresarial | §1 nombra a la persona física, no a una sociedad |
| §17, WhatsApp | +52 477 908 6863 | Es el número que el sitio usa como oficial (`src/config.ts` en la rama del rediseño) y el primero de los tres de §1 |
| §13 | "no usa cookies ni tecnologías de seguimiento" | El borrador decía "no se usan cookies"; se redactó completo |
| Versión | 1.0, sin la nota "borrador para revisión legal" | Una página pública no se publica marcada como borrador. **Esto supone que ya pasó revisión** |

También se corrigieron erratas de §7: "provedor", "Hojas de calculo de google".

## Lo que sigue abierto

**Identidad legal**

- ¿La razón social es la persona física o existe una sociedad? Si hay una S.A. de
  C.V. o S.A.P.I. de C.V., §1 y §17 cambian.
- **Domicilio.** Se quitó a propósito de §1 y §17 en la versión 1.2 (las
  versiones 1.0 y 1.1, con domicilio, están en el historial de git). La LFPDPPP
  pide que el aviso de privacidad indique la identidad *y el domicilio* del
  responsable, así que conviene validar con quien lleve lo legal si se puede
  publicar sin él, o definir un domicilio que sí se pueda hacer público (por
  ejemplo, un domicilio fiscal o de correspondencia distinto del particular) y
  volver a ponerlo en §1 y §17.
- **Grafía del apellido.** El aviso dice «González Ascencio»; al pedir el cambio
  de la marca se escribió «Asensio». Confirmar contra la Constancia de Situación
  Fiscal o la INE y que coincida letra por letra con el registro de Tech Provider
  en Meta. Se cambia en §1 y §17 del markdown y del componente.
- Desde la versión 1.1 el §1 dice que Vireon es una marca operada por Juan Manuel
  González Ascencio, porque el registro como Tech Provider va a su nombre. Si
  después se constituye una sociedad y se migra el registro, §1 y §17 vuelven a
  cambiar.

**Canal de WhatsApp**

- ¿Cuál de los tres números se da de alta como WhatsApp Business en Meta? §17
  publica hoy el 477 908 6863.
- ~~¿Vireon iniciará conversaciones con plantillas hacia gente que no escribió
  primero?~~ Sí, a quien dejó su número en la lista de espera de Portero; §5 se
  ajustó en la versión 1.3. Falta confirmar que la leyenda bajo el campo de
  WhatsApp del formulario ("Si lo dejas, podremos escribirte por WhatsApp sobre
  Portero.") cumple lo que Meta pide como consentimiento para escribir primero.

**Sitio web**

- ¿El test de madurez guarda las respuestas individuales o sólo el resultado? §3
  no menciona las respuestas del test.
- §13 declara que no hay cookies ni analítica. Si más adelante se instala GA4,
  Clarity o el píxel de Meta, §13 deja de ser cierta y hay que actualizarla.
- ¿Habrá liga de calendario que recabe datos adicionales?
- §7 dice que Hostinger hospeda "el sitio web y el correo electrónico", pero los
  formularios envían a n8n en un VPS de Hostinger. Conviene decir "…del sitio
  web, del correo electrónico y de la automatización que recibe los
  formularios".
- §3 "A través del sitio web" no declara el mensaje libre del formulario de
  contacto (el campo "¿Cómo te podemos ayudar?" de `FinalCTA.tsx`).
- Mientras un envío no sale bien, nombre, correo y WhatsApp (formularios de
  contacto y de Portero) o correo, score y respuestas (test de madurez) quedan en
  el `localStorage` del navegador, sin vencimiento y hasta diez por formulario
  (`src/leads.ts`). Se guardan antes del primer intento y se borran cuando uno
  sale bien. No contradice §13, pero el aviso no lo menciona.
- ~~**Lista de espera de Portero** (`/soluciones/portero/`).~~ Resuelto en la
  versión 1.3 (14 de octubre de 2026): §2 incluye el formulario de la lista de
  espera, §3 suma el WhatsApp opcional y el volumen de prospectos al mes, §4 suma
  la finalidad de contacto sobre la lista de espera y §5 habla de los formularios
  en plural y del consentimiento para escribir por WhatsApp. Falta que lo revise
  quien lleve lo legal, como el resto de la versión vigente.

**Operación**

- ¿Se envían boletines de verdad? Si no, se recorta esa parte de §4.
- ¿Qué medidas de seguridad concretas se pueden declarar en §10?
- ¿Quién atiende las solicitudes ARCO y vigila los plazos de 20 y 15 días
  hábiles?
- Conviene un buzón del dominio, `privacidad@vireonai.com.mx`, en vez de la
  cuenta de Gmail. Da mejor impresión ante Meta y ante clientes.
- ¿Hay clientes en la Unión Europea? Eso obliga a lenguaje de GDPR.
- ¿Hace falta una versión en inglés?
