import { Database, Cloud, Cpu, Workflow } from 'lucide-react';
import './SocialProof.css';

const SocialProof = () => {
    return (
        <section className="social-proof">
            <div className="container">
                <div className="impact-grid">
                    <div className="impact-item">
                        <h3>5+</h3>
                        <p>Industrias Atendidas</p>
                    </div>
                    <div className="impact-item">
                        <h3>100+</h3>
                        <p>Procesos Automatizables</p>
                    </div>
                    <div className="impact-item">
                        <h3>80%</h3>
                        <p>Ahorro de Tiempo</p>
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
