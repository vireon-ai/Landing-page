import { ArrowRight, CheckCircle2 } from 'lucide-react';
import './Hero.css';
import DynamicBackground from './DynamicBackground';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-bg">
                <DynamicBackground />
            </div>

            <div className="container hero-content">
                <div className="hero-badge badge badge-primary">
                    <CheckCircle2 size={14} style={{ marginRight: '0.5rem' }} />
                    Especialistas en IA y Automatización
                </div>

                <h1 className="hero-title">
                    ¿Sabes que tienes que automatizar y usar IA en tu negocio, 
                    <span className="gradient-text"> pero no sabes donde empezar?</span>
                </h1>

                <p className="hero-subtitle">
                    Haz nuestro Test de Madurez IA y descubre cuánto puedes optimizar.
                </p>

                <div className="hero-actions">
                    <a href="#quiz" className="btn btn-primary">
                        Evalúa tu Madurez IA Gratis
                    </a>
                    <a href="#final-cta" className="btn btn-secondary">
                        Diagnóstico Gratuito <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
