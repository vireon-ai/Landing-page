/**
 * Envío de leads a n8n, compartido por los formularios del sitio.
 *
 * Lo usan el formulario del cierre de la landing (`FinalCTA.tsx`) y la lista de
 * espera de Portero (`Portero.tsx`). Los dos llegan al mismo webhook y a la
 * misma hoja; el campo `origen` dice de cuál vino cada registro.
 */

// Endpoint de n8n que recibe los leads de los formularios.
const WEBHOOK_URL = 'https://n8n.srv946409.hstgr.cloud/webhook/a118b68a-92f9-463a-8609-b9f48e9d5b04';

const CLAVE_PENDIENTES = 'vireon_leads_pendientes';
const INTENTOS = 3;
const TIMEOUT_MS = 12000;

// Los nombres de estos campos DEBEN coincidir con el mapeo del nodo
// "Append row in sheet" del flujo "webhook web page" en n8n. Los opcionales
// todavía no tienen columna en la hoja: por eso la lista de espera los repite
// dentro de `message`, para que no se pierdan mientras no se mapeen.
export type Lead = {
    name: string;
    company: string;
    email: string;
    message: string;
    origen: string;
    enviadoEn: string;
    whatsapp?: string;
    leadsMes?: string;
};

// Respaldo local: si n8n no responde, el lead no se pierde.
const leerPendientes = (): Lead[] => {
    try {
        const crudo = localStorage.getItem(CLAVE_PENDIENTES);
        const datos = crudo ? JSON.parse(crudo) : [];
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
};

const guardarPendientes = (leads: Lead[]): void => {
    try {
        localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(leads.slice(-10)));
    } catch {
        // Navegación privada o almacenamiento bloqueado: seguimos sin respaldo.
    }
};

// Dos registros son el mismo si traen los mismos datos, aunque se hayan enviado
// a distinta hora: así un reenvío tras un error no deja dos copias en la cola.
const huella = (lead: Lead): string => JSON.stringify({ ...lead, enviadoEn: undefined });

const quitarPendiente = (lead: Lead): void => {
    const pendientes = leerPendientes();
    const restantes = pendientes.filter((pendiente) => huella(pendiente) !== huella(lead));
    if (restantes.length !== pendientes.length) guardarPendientes(restantes);
};

/** Guarda el lead para reintentarlo la próxima vez que se abra una página con formulario. */
export const guardarPendiente = (lead: Lead): void => {
    guardarPendientes([...leerPendientes().filter((pendiente) => huella(pendiente) !== huella(lead)), lead]);
};

const enviarUnaVez = async (lead: Lead): Promise<boolean> => {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), TIMEOUT_MS);
    try {
        const respuesta = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
            signal: control.signal,
        });
        return respuesta.ok;
    } finally {
        clearTimeout(reloj);
    }
};

export const enviarConReintentos = async (lead: Lead): Promise<boolean> => {
    for (let intento = 1; intento <= INTENTOS; intento++) {
        try {
            if (await enviarUnaVez(lead)) {
                // Si quedaba una copia en la cola (un intento anterior que falló), ya sobra.
                quitarPendiente(lead);
                return true;
            }
        } catch (error) {
            console.error(`Intento ${intento} de ${INTENTOS} fallido al enviar el lead:`, error);
        }
        if (intento < INTENTOS) {
            await new Promise((resolver) => setTimeout(resolver, 600 * 2 ** (intento - 1)));
        }
    }
    return false;
};

/**
 * Reintenta en segundo plano los leads que quedaron guardados. Pensado para un
 * `useEffect` al montar el formulario: devuelve la función de limpieza.
 */
export const reintentarPendientes = (): (() => void) => {
    const pendientes = leerPendientes();
    if (pendientes.length === 0) return () => {};

    // Cada envío que sale bien se quita de la cola en ese momento (dentro de
    // enviarConReintentos). Nunca se reescribe la cola completa: si mientras
    // tanto la persona envía un formulario que falla, su registro se conserva.
    let cancelado = false;
    (async () => {
        for (const lead of pendientes) {
            if (cancelado) return;
            await enviarConReintentos(lead);
        }
    })();

    return () => {
        cancelado = true;
    };
};
