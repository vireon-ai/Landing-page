import { Award, Zap, ShieldCheck, Users } from 'lucide-react';
import './Authority.css';

const Authority = () => {
    return (
        <section className="authority">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">¿Por qué elegir Vireon?</h2>
                    <p className="section-subtitle">
                        Somos una consultoría ágil diseñada para la velocidad del mercado actual.
                    </p>
                </div>

                <div className="authority-grid">
                    <div className="authority-card">
                        <div className="authority-icon"><Users size={32} /></div>
                        <h3>Expertise Comprobado</h3>
                        <p>Equipo senior con experiencia en implementación de soluciones enterprise.</p>
                    </div>
                    <div className="authority-card">
                        <div className="authority-icon"><Zap size={32} /></div>
                        <h3>Metodología Ágil</h3>
                        <p>Sin la burocracia de las grandes consultoras. Resultados en semanas, no meses.</p>
                    </div>
                    <div className="authority-card">
                        <div className="authority-icon"><Award size={32} /></div>
                        <h3>Tecnología de Punta</h3>
                        <p>Dominamos las últimas herramientas de IA y automatización (OpenAI, Cursor, n8n).</p>
                    </div>
                    <div className="authority-card">
                        <div className="authority-icon"><ShieldCheck size={32} /></div>
                        <h3>colaboración en conjunto</h3>
                        <p>Trabajamos de la mano del cliente en todo momento, creando productos incrementales que garantizan resultados.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Authority;
