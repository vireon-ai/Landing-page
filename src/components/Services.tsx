import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './Services.css';

/* Cuenta de 0 al valor final cuando `active` pasa a true. Con
   prefers-reduced-motion salta directo al final. */
const useCountUp = (target: number, active: boolean, duration = 1400) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!active) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ms = reduce ? 0 : duration;

        let frame = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = ms === 0 ? 1 : Math.min((now - start) / ms, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(target * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [active, target, duration]);

    return value;
};

/* Sparkline de un KPI. Los puntos van en un viewBox de 90x20. */
const Spark = ({ points, tone }: { points: string; tone: 'primary' | 'secondary' | 'accent' }) => {
    const [lastX, lastY] = points.trim().split(' ').pop()!.split(',');
    return (
        <svg className={`svc-spark svc-spark--${tone}`} viewBox="0 0 90 20" height="20" aria-hidden="true">
            <polyline points={points} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lastX} cy={lastY} r="2" />
        </svg>
    );
};

const Services = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    const tasks = useCountUp(1847, inView);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="services" ref={sectionRef} className={`services ${inView ? 'in' : ''}`}>
            <div className="container">
                <div className="text-center">
                    <p className="services-eyebrow">Qué construimos</p>
                    <h2 className="section-title">Así llevamos la IA a tu negocio</h2>
                    <p className="section-subtitle">
                        Tres piezas que diseñamos contigo y que corren en tu operación todos los días.
                    </p>
                </div>

                <div className="services-grid">
                    {/* 1 · Automatización de procesos */}
                    <article className="svc">
                        <div className="svc-demo" aria-hidden="true">
                            <div className="svc-apps">
                                <span className="svc-chip">Formulario</span>
                                <span className="svc-line"><i></i></span>
                                <span className="svc-chip svc-chip--vireon">Vireon</span>
                                <span className="svc-line"><i></i></span>
                                <span className="svc-chip">ERP</span>
                            </div>
                            <div className="svc-counter">
                                <span className="svc-counter-n">{tasks.toLocaleString('es-MX')}</span>
                                <span className="svc-counter-l">tareas este mes</span>
                            </div>
                        </div>
                        <h3 className="svc-title">Automatización de procesos</h3>
                        <p className="svc-desc">Tus aplicaciones dejan de necesitar a alguien que copie datos entre ellas.</p>
                        <a className="svc-more" href="#final-cta">
                            Ver cómo funciona <ArrowRight size={16} />
                        </a>
                    </article>

                    {/* 2 · Agentes de IA */}
                    <article className="svc">
                        <div className="svc-demo" aria-hidden="true">
                            <div className="svc-chat">
                                <div className="svc-bub svc-bub--them">¿Tienen la 27 en negro? ¿Cuándo me llega a Mérida?</div>
                                <div className="svc-bub svc-bub--us">
                                    <span className="svc-typing"><i></i><i></i><i></i></span>
                                    <span className="svc-reply">Sí, quedan 4 pares. Pidiendo hoy llega el jueves.</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="svc-title">Agentes de IA</h3>
                        <p className="svc-desc">Atienden a tus clientes y a tu equipo con la información de tu negocio.</p>
                        <a className="svc-more" href="#final-cta">
                            Ver cómo funciona <ArrowRight size={16} />
                        </a>
                    </article>

                    {/* 3 · Dashboards inteligentes */}
                    <article className="svc">
                        <div className="svc-demo" aria-hidden="true">
                            <div className="svc-kpis">
                                <div className="svc-kpi">
                                    <div className="svc-kpi-k">Pedidos hoy</div>
                                    <div className="svc-kpi-v">342</div>
                                    <Spark tone="primary" points="0,16 15,13 30,14 45,9 60,10 75,5 90,3" />
                                </div>
                                <div className="svc-kpi">
                                    <div className="svc-kpi-k">Ticket promedio</div>
                                    <div className="svc-kpi-v">$1,240</div>
                                    <Spark tone="secondary" points="0,12 15,14 30,11 45,12 60,8 75,9 90,7" />
                                </div>
                                <div className="svc-kpi svc-kpi--warn">
                                    <div className="svc-kpi-k">Inventario 27</div>
                                    <div className="svc-kpi-v">4</div>
                                    <Spark tone="accent" points="0,3 15,5 30,8 45,10 60,13 75,15 90,17" />
                                </div>
                                <div className="svc-kpi">
                                    <div className="svc-kpi-k">Respuesta prom.</div>
                                    <div className="svc-kpi-v">1.4 min</div>
                                    <Spark tone="primary" points="0,6 15,7 30,5 45,8 60,6 75,4 90,4" />
                                </div>
                            </div>
                        </div>
                        <h3 className="svc-title">Dashboards inteligentes</h3>
                        <p className="svc-desc">Los números que importan, en una sola pantalla, avisándote antes de que sea un problema.</p>
                        <a className="svc-more" href="#final-cta">
                            Ver cómo funciona <ArrowRight size={16} />
                        </a>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default Services;
