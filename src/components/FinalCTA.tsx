import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import './FinalCTA.css';

const FinalCTA = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('https://n8n.srv946409.hstgr.cloud/webhook-test/a118b68a-92f9-463a-8609-b9f48e9d5b04', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', company: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            // Helper to extract error message
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            alert(`Error detallado: ${errorMessage}. \n\nNota: Si usas un webhook de prueba de n8n, asegúrate de que el workflow esté en modo "Escuchando" (Execute Workflow). Si es un error de CORS, verifica la configuración del servidor.`);
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
                                {status === 'error' && (
                                    <p style={{ color: '#ffcccc', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                        Hubo un error al enviar. Por favor intenta de nuevo.
                                    </p>
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
