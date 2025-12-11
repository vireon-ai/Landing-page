import { TrendingUp, Clock, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import './ProofOfConcept.css';

const scenarios = [
    {
        industry: 'Restaurante',
        title: 'Automatización de Inventario',
        description: 'Sistema que conecta el POS con proveedores para reabastecimiento automático.',
        result: 'Ahorro de 20 hrs/semana',
        icon: <Clock size={20} />
    },
    {
        industry: 'Despacho Contable',
        title: 'Dashboard Automático',
        description: 'Extracción automática de facturas del SAT y generación de reportes financieros.',
        result: '80% menos errores',
        icon: <CheckCircle2 size={20} />
    },
    {
        industry: 'E-commerce',
        title: 'Chatbot de Ventas IA',
        description: 'Asistente que recomienda productos y resuelve dudas de envío 24/7.',
        result: '50% más ventas',
        icon: <TrendingUp size={20} />
    }
];

const ProofOfConcept = () => {
    return (
        <section className="poc-section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Casos de Uso Reales</h2>
                    <p className="section-subtitle">
                        Así es como transformamos negocios similares al tuyo.
                    </p>
                </div>

                <div className="poc-grid">
                    {scenarios.map((scenario, index) => (
                        <div key={index} className="poc-card">
                            <div className="poc-image">
                                <ImageIcon size={48} style={{ opacity: 0.2 }} />
                            </div>
                            <div className="poc-content">
                                <div className="poc-industry">{scenario.industry}</div>
                                <h3 className="poc-title">{scenario.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    {scenario.description}
                                </p>
                                <div className="poc-result">
                                    {scenario.icon}
                                    {scenario.result}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-xl" style={{ marginTop: '3rem' }}>
                    <button className="btn btn-secondary"
                        onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}>
                        Crea tu caso de éxito con Vireon
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProofOfConcept;
