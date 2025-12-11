import { FileText, Download } from 'lucide-react';
import './Resources.css';

const Resources = () => {
    return (
        <section className="resources-section">
            <div className="container">
                <div className="resource-card">
                    <div className="resource-preview">
                        <FileText size={64} color="var(--primary)" />
                    </div>
                    <div className="resource-content">
                        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>Recurso Gratuito</div>
                        <h3>Checklist: 15 Procesos que Tu PyME Puede Automatizar Hoy</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Descubre oportunidades ocultas de ahorro y eficiencia. Incluye plantilla de cálculo de ROI.
                        </p>

                        <form className="resource-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Tu correo electrónico" required />
                            <button type="submit" className="btn btn-primary">
                                Descargar <Download size={18} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resources;
