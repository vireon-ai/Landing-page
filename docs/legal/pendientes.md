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
- **Domicilio.** Se quitó a propósito de §1 y §17 (la versión 1.0 está en el
  historial de git, commit `7d6fdb2`). La LFPDPPP pide que el aviso de
  privacidad indique la identidad *y el domicilio* del responsable, así que
  conviene validar con quien lleve lo legal si se puede publicar sin él, o
  definir un domicilio que sí se pueda hacer público (por ejemplo, un domicilio
  fiscal o de correspondencia distinto del particular) y volver a ponerlo en §1 y
  §17.

**Canal de WhatsApp**

- ¿Cuál de los tres números se da de alta como WhatsApp Business en Meta? §17
  publica hoy el 477 908 6863.
- ¿Vireon iniciará conversaciones con plantillas hacia gente que no escribió
  primero? Si sí, §5 se tiene que redactar distinto.

**Sitio web**

- ¿El test de madurez guarda las respuestas individuales o sólo el resultado? §3
  hoy sólo declara nombre, correo y empresa.
- §13 declara que no hay cookies ni analítica. Si más adelante se instala GA4,
  Clarity o el píxel de Meta, §13 deja de ser cierta y hay que actualizarla.
- ¿Habrá liga de calendario que recabe datos adicionales?

**Operación**

- ¿Se envían boletines de verdad? Si no, se recorta esa parte de §4.
- ¿Qué medidas de seguridad concretas se pueden declarar en §10?
- ¿Quién atiende las solicitudes ARCO y vigila los plazos de 20 y 15 días
  hábiles?
- Conviene un buzón del dominio, `privacidad@vireonai.com.mx`, en vez de la
  cuenta de Gmail. Da mejor impresión ante Meta y ante clientes.
- ¿Hay clientes en la Unión Europea? Eso obliga a lenguaje de GDPR.
- ¿Hace falta una versión en inglés?
