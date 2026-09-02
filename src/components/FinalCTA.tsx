import { useState, useEffect } from 'react';
import { Calendar, Check, AlertTriangle } from 'lucide-react';
import './FinalCTA.css';

// Endpoint de n8n que recibe los leads del formulario final.
const WEBHOOK_URL = 'https://n8n.srv946409.hstgr.cloud/webhook/a118b68a-92f9-463a-8609-b9f48e9d5b04';

// A dónde mandamos al visitante si el webhook no responde.
const CORREO_CONTACTO = 'juanmanuel.glez@vireonai.com.mx';

const CLAVE_PENDIENTES = 'vireon_leads_pendientes';
const INTENTOS = 3;
const TIMEOUT_MS = 12000;

// Los nombres de estos campos DEBEN coincidir con el mapeo del nodo
// "Append row in sheet" del flujo "webhook web page" en n8n.
type Lead = {
    name: string;
    company: string;
    email: string;
    message: string;
    origen: string;
    enviadoEn: string;
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

const enviarConReintentos = async (lead: Lead): Promise<boolean> => {
    for (let intento = 1; intento <= INTENTOS; intento++) {
        try {
            if (await enviarUnaVez(lead)) return true;
        } catch (error) {
            console.error(`Intento ${intento} de ${INTENTOS} fallido al enviar el lead:`, error);
        }
        if (intento < INTENTOS) {
            await new Promise((resolver) => setTimeout(resolver, 600 * 2 ** (intento - 1)));
        }
    }
    return false;
};

const FinalCTA = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Al cargar la página reintentamos en segundo plano los leads que quedaron guardados.
    useEffect(() => {
        const pendientes = leerPendientes();
        if (pendientes.length === 0) return;

        let cancelado = false;
        (async () => {
            const sobrantes: Lead[] = [];
            for (const lead of pendientes) {
                const enviado = await enviarConReintentos(lead);
                if (!enviado) sobrantes.push(lead);
            }
            if (!cancelado) guardarPendientes(sobrantes);
        })();

        return () => {
            cancelado = true;
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        const lead: Lead = {
            name: formData.name.trim(),
            company: formData.company.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            origen: 'landing-final-cta',
            enviadoEn: new Date().toISOString(),
        };

        const enviado = await enviarConReintentos(lead);

        if (enviado) {
            setStatus('success');
            setFormData({ name: '', company: '', email: '', message: '' });
        } else {
            // No perdemos el lead: queda guardado y se reintenta al recargar.
            guardarPendientes([...leerPendientes(), lead]);
            setStatus('error');
        }
    };

    return (
        <section id="final-cta" className="final-cta">
            <div className="container">
                <div className="cta-box">
                    <div className="cta-content">
                        <div className="urgency-badge">
                            <span className="pulsing-dot"></span>
                            Solo 5 diagnósticos gratuitos disponibles este mes
                        </div>

                        <h2 className="cta-title">
                            Tu competencia ya está automatizando.
                            <br />
                            <span style={{ opacity: 0.8 }}>No te quedes atrás.</span>
                        </h2>

                        <p className="cta-subtitle">
                            El 80% de empresas usarán IA integrada en 2026. Empieza hoy.
                        </p>

                        {status === 'success' ? (
                            <div className="success-message">
                                <div className="success-icon">
                                    <Check size={48} />
                                </div>
                                <h3>¡Solicitud Recibida!</h3>
                                <p>Nos pondremos en contacto contigo pronto para agendar tu diagnóstico.</p>
                                <button
                                    className="btn btn-text"
                                    onClick={() => setStatus('idle')}
                                    style={{ color: 'white', textDecoration: 'underline', marginTop: '1rem' }}
                                >
                                    Enviar otra solicitud
                                </button>
                            </div>
                        ) : (
                            <form className="cta-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Tu Nombre *"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="company"
                                            placeholder="Empresa *"
                                            required
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Correo Corporativo *"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="message"
                                        placeholder="¿Cómo te podemos ayudar? (Opcional)"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-input form-textarea"
                                        rows={3}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-secondary submit-btn"
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Enviando...' : (
                                        <>
                                            <Calendar size={20} style={{ marginRight: '0.5rem' }} />
                                            Agenda tu Diagnóstico Gratuito
                                        </>
                                    )}
                                </button>
                                <p className="form-privacidad">
                                    Al enviar aceptas nuestro{' '}
                                    <a href="/aviso-de-privacidad/" target="_blank" rel="noopener noreferrer">
                                        Aviso de Privacidad
                                    </a>
                                    .
                                </p>
                                {status === 'error' && (
                                    <div className="form-error" role="alert">
                                        <AlertTriangle size={18} className="form-error-icon" />
                                        <span>
                                            No pudimos enviar tu solicitud en este momento. Guardamos tus datos
                                            y lo reintentaremos automáticamente. Si prefieres no esperar,
                                            escríbenos a{' '}
                                            <a href={`mailto:${CORREO_CONTACTO}?subject=Solicitud%20de%20diagn%C3%B3stico%20gratuito`}>
                                                {CORREO_CONTACTO}
                                            </a>.
                                        </span>
                                    </div>
                                )}
                            </form>
                        )}

                        <div className="guarantee">
                            <span style={{ margin: '0 0.5rem' }}><Check size={14} style={{ display: 'inline' }} /> Sin compromiso</span>
                            <span style={{ margin: '0 0.5rem' }}><Check size={14} style={{ display: 'inline' }} /> 30 min de tu tiempo</span>
                            <span style={{ margin: '0 0.5rem' }}><Check size={14} style={{ display: 'inline' }} /> 100% Gratuito</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
