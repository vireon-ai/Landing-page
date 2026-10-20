/**
 * Envío de leads a n8n, compartido por los formularios del sitio.
 *
 * Lo usan el formulario del cierre de la landing (`FinalCTA.tsx`), la lista de
 * espera de Portero (`Portero.tsx`) y el test de madurez (`Quiz.tsx`). Los dos
 * primeros llegan al mismo webhook y a la misma hoja; el campo `origen` dice de
 * cuál vino cada registro. El test tiene su propio webhook y su propia hoja.
 *
 * Todos los envíos van por POST con cuerpo JSON, nunca en la URL, para que el
 * correo no quede en los registros de n8n ni de ningún intermediario.
 */

/** A dónde va un envío y dónde se guarda si no sale. */
export type Destino = {
    url: string;
    // Cada destino tiene su propia cola: un registro nunca se reintenta en el
    // webhook equivocado.
    clavePendientes: string;
    // El campo con la hora del envío, que no cuenta para decidir si dos
    // registros son el mismo.
    campoFecha: string;
};

// Endpoint de n8n que recibe los leads de los formularios.
export const DESTINO_LEADS: Destino = {
    url: 'https://n8n.srv946409.hstgr.cloud/webhook/a118b68a-92f9-463a-8609-b9f48e9d5b04',
    clavePendientes: 'vireon_leads_pendientes',
    campoFecha: 'enviadoEn',
};

// Endpoint de n8n que recibe el resultado del test de madurez.
export const DESTINO_TEST: Destino = {
    url: 'https://n8n.srv946409.hstgr.cloud/webhook/e1a1bbba-2b28-4a2a-8942-cb434cd6d280',
    clavePendientes: 'vireon_test_pendientes',
    campoFecha: 'submittedAt',
};

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

type Registro = Record<string, unknown>;

// Respaldo local: si n8n no responde, el registro no se pierde.
const leerPendientes = (destino: Destino): Registro[] => {
    try {
        const crudo = localStorage.getItem(destino.clavePendientes);
        const datos = crudo ? JSON.parse(crudo) : [];
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
};

const guardarPendientes = (registros: Registro[], destino: Destino): void => {
    try {
        localStorage.setItem(destino.clavePendientes, JSON.stringify(registros.slice(-10)));
    } catch {
        // Navegación privada o almacenamiento bloqueado: seguimos sin respaldo.
    }
};

// Dos registros son el mismo si traen los mismos datos, aunque se hayan enviado
// a distinta hora: así un reenvío tras un error no deja dos copias en la cola.
const huella = (registro: Registro, destino: Destino): string =>
    JSON.stringify({ ...registro, [destino.campoFecha]: undefined });

const quitarPendiente = (registro: Registro, destino: Destino): void => {
    const pendientes = leerPendientes(destino);
    const propia = huella(registro, destino);
    const restantes = pendientes.filter((pendiente) => huella(pendiente, destino) !== propia);
    if (restantes.length !== pendientes.length) guardarPendientes(restantes, destino);
};

/** Guarda el registro para reintentarlo la próxima vez que se abra una página con formulario. */
export const guardarPendiente = (registro: Registro, destino: Destino = DESTINO_LEADS): void => {
    const propia = huella(registro, destino);
    guardarPendientes(
        [...leerPendientes(destino).filter((pendiente) => huella(pendiente, destino) !== propia), registro],
        destino,
    );
};

const enviarUnaVez = async (registro: Registro, destino: Destino): Promise<boolean> => {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), TIMEOUT_MS);
    try {
        const respuesta = await fetch(destino.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registro),
            signal: control.signal,
        });
        return respuesta.ok;
    } finally {
        clearTimeout(reloj);
    }
};

export const enviarConReintentos = async (registro: Registro, destino: Destino = DESTINO_LEADS): Promise<boolean> => {
    // A la cola antes del primer intento: si la persona cierra la pestaña o
    // recarga mientras se reintenta, el registro ya quedó a salvo.
    guardarPendiente(registro, destino);
    for (let intento = 1; intento <= INTENTOS; intento++) {
        try {
            if (await enviarUnaVez(registro, destino)) {
                // Si quedaba una copia en la cola (un intento anterior que falló), ya sobra.
                quitarPendiente(registro, destino);
                return true;
            }
        } catch (error) {
            console.error(`Intento ${intento} de ${INTENTOS} fallido al enviar a n8n:`, error);
        }
        if (intento < INTENTOS) {
            await new Promise((resolver) => setTimeout(resolver, 600 * 2 ** (intento - 1)));
        }
    }
    return false;
};

/**
 * Reintenta en segundo plano los registros que quedaron guardados. Pensado para
 * un `useEffect` al montar el formulario: devuelve la función de limpieza.
 */
export const reintentarPendientes = (destino: Destino = DESTINO_LEADS): (() => void) => {
    const pendientes = leerPendientes(destino);
    if (pendientes.length === 0) return () => {};

    // Cada envío que sale bien se quita de la cola en ese momento (dentro de
    // enviarConReintentos). Nunca se reescribe la cola completa: si mientras
    // tanto la persona envía un formulario que falla, su registro se conserva.
    let cancelado = false;
    (async () => {
        for (const registro of pendientes) {
            if (cancelado) return;
            await enviarConReintentos(registro, destino);
        }
    })();

    return () => {
        cancelado = true;
    };
};
