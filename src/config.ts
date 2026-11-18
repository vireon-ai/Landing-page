/**
 * Configuración compartida del sitio.
 *
 * Formato internacional sin signos: 52 + diez dígitos.
 * 52 + 4426137768 (Querétaro).
 */
export const WHATSAPP_NUMERO = '524426137768';

/** Arma la liga de WhatsApp con un mensaje ya escrito. */
export const whatsappUrl = (mensaje: string): string =>
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

/** A dónde mandamos al visitante si un formulario no logra enviar. */
export const CORREO_CONTACTO = 'juanmanuel.glez@vireonai.com.mx';
