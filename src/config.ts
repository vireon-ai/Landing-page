/**
 * Configuración compartida del sitio.
 *
 * Formato internacional sin signos: 52 + 1 + diez dígitos.
 * 521 + 4779086863 (León, Guanajuato).
 */
export const WHATSAPP_NUMERO = '524779086863';

/** Arma la liga de WhatsApp con un mensaje ya escrito. */
export const whatsappUrl = (mensaje: string): string =>
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
