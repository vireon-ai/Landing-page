import { Database, Cloud, Cpu, Workflow } from 'lucide-react';
import './SocialProof.css';

const SocialProof = () => {
    return (
        <section className="social-proof">
            <div className="container">
                <div className="impact-grid">

                    <div className="impact-item">
                        <div className="impact-icon-wrapper">
                            <h3>70%</h3>
                        </div>
                        <h4>Mayor eficiencia operacional</h4>
                        <p>Las empresas reportan que la IA ha incrementado su eficiencia operativa.</p>
                    </div>
                    <div className="impact-item">
                        <div className="impact-icon-wrapper">
                            <h3>65%</h3>
                        </div>
                        <h4>Mejores decisiones de negocio</h4>
                        <p>Los líderes afirman que la IA mejora la toma de decisiones mediante análisis de datos.</p>
                    </div>
                    <div className="impact-item">
                        <div className="impact-icon-wrapper">
                            <h3>3.7x</h3>
                        </div>
                        <h4>Retorno sobre inversión</h4>
                        <p>Por cada dólar invertido en IA generativa, las empresas logran un retorno promedio de $3.70.</p>
                    </div>
                </div>

                <p className="tech-statement">Potenciamos tu negocio con tecnologías líderes</p>

                <div className="logos-track">
                    <div className="tech-logo"><Workflow size={24} /> n8n</div>
                    <div className="tech-logo"><Cloud size={24} /> Google Antigravity</div>
                    <div className="tech-logo"><Database size={24} /> Cursor</div>
                    <div className="tech-logo"><Cpu size={24} /> OpenAI</div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
