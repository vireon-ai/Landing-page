import { XCircle, CheckCircle2 } from 'lucide-react';
import './ProblemSolution.css';

const ProblemSolution = () => {
    return (
        <section id="problem" className="problem-solution">
            <div className="fondo fondo--puntos" aria-hidden="true" />
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">¿Por qué las PyMEs luchan <span className="texto-degradado">con la IA?</span></h2>
                    <p className="section-subtitle">
                        La mayoría de las empresas saben que necesitan automatizar, pero el camino tradicional es costoso y lento.
                    </p>
                </div>

                <div className="comparison-container">
                    {/* Problem Side */}
                    <div className="comparison-card problem-card">
                        <div className="card-header">
                            <h3>El Enfoque Tradicional</h3>
                            <p>Consultoras grandes o freelancers</p>
                        </div>
                        <ul className="comparison-list">
                            <li>
                                <div className="icon-wrapper"><XCircle size={20} color="#ef4444" /></div>
                                <div>
                                    <strong>Sin un punto de partida claro</strong>
                                    <p className="text-sm text-secondary">Parálisis por análisis ante tantas herramientas nuevas.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper"><XCircle size={20} color="#ef4444" /></div>
                                <div>
                                    <strong>Equipos técnicos costosos</strong>
                                    <p className="text-sm text-secondary">Requiere contratar ingenieros senior, que cuestan caro.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper"><XCircle size={20} color="#ef4444" /></div>
                                <div>
                                    <strong>Implementaciones de meses</strong>
                                    <p className="text-sm text-secondary">Proyectos largos que pierden relevancia.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Solution Side */}
                    <div className="comparison-card solution-card">
                        <div className="fondo fondo--banda" aria-hidden="true" />
                        <div className="card-header">
                            <h3>El Método Vireon</h3>
                            <p>Agilidad y resultados tangibles</p>
                        </div>
                        <ul className="comparison-list">
                            <li>
                                <div className="icon-wrapper"><CheckCircle2 size={20} color="white" /></div>
                                <div>
                                    <strong>Se ajustan a cómo trabajas</strong>
                                    <p className="text-sm" style={{ opacity: 0.9 }}>Adaptadas a tus procesos actuales, no al revés.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper"><CheckCircle2 size={20} color="white" /></div>
                                <div>
                                    <strong>Sin equipo técnico interno</strong>
                                    <p className="text-sm" style={{ opacity: 0.9 }}>Nosotros somos tu brazo tecnológico experto.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper"><CheckCircle2 size={20} color="white" /></div>
                                <div>
                                    <strong>Implementación en 30 días</strong>
                                    <p className="text-sm" style={{ opacity: 0.9 }}>Empezamos por un proceso concreto y medimos sus resultados desde el arranque.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
