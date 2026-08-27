import { ArrowRight, CheckCircle2 } from 'lucide-react';
import './Hero.css';
import DynamicBackground from './DynamicBackground';
import LiveFlow from './LiveFlow';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-bg">
                <DynamicBackground />
            </div>

            <div className="container hero-content">
                <div className="hero-copy">
                    <div className="hero-badge badge badge-primary">
                        <CheckCircle2 size={14} style={{ marginRight: '0.5rem' }} />
                        Especialistas en IA y Automatización
                    </div>

                    <h1 className="hero-title">
                        Tu operación,
                        <br />
                        <span className="hero-title-accent">corriendo sola.</span>
                    </h1>

                    <p className="hero-subtitle">
                        Conectamos las aplicaciones que ya usas y ponemos agentes de IA a hacer
                        el trabajo repetitivo. Tu primer proceso funcionando en 30 días, sin
                        contratar un equipo técnico.
                    </p>

                    <div className="hero-actions">
                        <a href="#quiz" className="btn btn-primary">
                            Evalúa tu madurez en IA
                        </a>
                        <a href="#final-cta" className="btn btn-secondary">
                            Diagnóstico gratuito
                            <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                        </a>
                    </div>

                    <ul className="hero-trust">
                        <li>Primer flujo en 30 días</li>
                        <li>Sin equipo técnico interno</li>
                    </ul>
                </div>

                <div className="hero-visual">
                    <LiveFlow />
                </div>
            </div>
        </section>
    );
};

export default Hero;
