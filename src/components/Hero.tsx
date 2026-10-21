import { ArrowRight } from 'lucide-react';
import './Hero.css';
import DynamicBackground from './DynamicBackground';
import LiveFlow from './LiveFlow';

const Hero = () => {
    return (
        <section className="hero">
            <div className="fondo fondo--halos" aria-hidden="true" />
            <div className="hero-bg">
                <DynamicBackground />
            </div>

            <div className="container hero-content">
                <div className="hero-copy">
                    {/* Portero es la solución que más queremos empujar: su anuncio
                        ocupa la pastilla de arriba del título, lo primero que se lee. */}
                    <a className="hero-anuncio" href="/soluciones/portero/">
                        <span className="hero-anuncio-estado">
                            <span className="hero-anuncio-pulso" aria-hidden="true" />
                            Próximamente
                        </span>
                        {/* Sin este espacio, el lector de pantalla junta "PróximamentePortero". */}
                        {' '}
                        <span className="hero-anuncio-texto">
                            <strong>Portero</strong>: agente de WhatsApp para{' '}
                            {/* La flecha va pegada a la última palabra: así nunca baja
                                sola a otro renglón en pantallas angostas. */}
                            <span className="hero-anuncio-final">
                                inmobiliarias
                                <ArrowRight size={16} aria-hidden="true" className="hero-anuncio-flecha" />
                            </span>
                        </span>
                    </a>

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
