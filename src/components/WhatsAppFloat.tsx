import { whatsappUrl } from '../config';
import './WhatsAppFloat.css';

// Mensaje genérico: el botón está en toda la página, no en una sección concreta.
// Distinto del de FinalCTA (agendar diagnóstico) y del del Footer (más información).
const MENSAJE = 'Hola Vireon, quiero saber qué se puede automatizar en mi negocio.';

const WhatsAppFloat = () => {
    return (
        <a
            className="wa-float"
            href={whatsappUrl(MENSAJE)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp (se abre en otra pestaña)"
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.8-.6-3.1-1.3-5.1-4.4-5.3-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7-.1 1.3Z" />
            </svg>
            <span aria-hidden="true">WhatsApp</span>
        </a>
    );
};

export default WhatsAppFloat;
