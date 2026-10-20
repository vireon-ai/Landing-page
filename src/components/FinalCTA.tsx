import { useState, useEffect } from 'react';
import { Calendar, Check, AlertTriangle, MessageCircle } from 'lucide-react';
import { CORREO_CONTACTO, whatsappUrl } from '../config';
import { enviarConReintentos, guardarPendiente, reintentarPendientes, type Lead } from '../leads';
import './FinalCTA.css';

// El número de la liga vive en src/config.ts; este es sólo el texto visible.
const WHATSAPP_VISIBLE = '477 908 6863';

const FinalCTA = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Al cargar la página reintentamos en segundo plano los leads que quedaron guardados.
    useEffect(() => reintentarPendientes(), []);

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
            guardarPendiente(lead);
            setStatus('error');
        }
    };

    return (
        <section id="final-cta" className="final-cta">
            <div className="fondo fondo--halos" aria-hidden="true" />
            <div className="container">
                <div className="cta-box">
                    <div className="fondo fondo--banda" aria-hidden="true" />
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

                        <p className="cta-whatsapp">
                            ¿Prefieres WhatsApp? Escríbenos al{' '}
                            <a
                                href={whatsappUrl('Hola Vireon, quiero agendar mi diagnóstico gratuito.')}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle size={16} aria-hidden="true" />
                                {WHATSAPP_VISIBLE}
                            </a>
                        </p>

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
