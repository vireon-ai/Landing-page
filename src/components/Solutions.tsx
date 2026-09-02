import { Mic, Sparkles, ArrowRight, Check, X, Workflow, Cloud, Database, Cpu } from 'lucide-react';
import './Solutions.css';
import { whatsappUrl } from '../config';

/**
 * Qué construimos.
 *
 * Dos soluciones que ya están en marcha, cada una con su flujo animado y una
 * demo del resultado. El movimiento va en SVG y CSS, igual que el hero, para no
 * tocar el tiempo de carga del sitio.
 *
 * Los textos de las demos (la conversación y la publicación) son ejemplos
 * ilustrativos: enseñan el mecanismo, no resultados medidos de un cliente.
 */

const Solutions = () => {
    return (
        <section id="soluciones" className="solutions-section">
            <div className="container">

                <div className="solutions-head">
                    <p className="solutions-eyebrow">Qué construimos</p>
                    <h2 className="section-title">Dos cosas que ya están corriendo</h2>
                    <p className="section-subtitle">
                        Ya están construidas y corriendo en clientes. No las mandas a hacer
                        ni pagas el desarrollo: entras por una mensualidad y las usas desde
                        el primer día.
                    </p>
                </div>

                <div className="solutions">

                    {/* 1. Inmobiliaria */}
                    <article className="solution">
                        <p className="solution__tag">Inmobiliaria · en marcha</p>
                        <h3 className="solution__title">Ningún prospecto se queda sin respuesta</h3>
                        <p className="solution__desc">
                            Tus campañas mandan gente a WhatsApp a cualquier hora. Un agente
                            responde al instante, contesta sus preguntas, lo evalúa, lo perfila
                            y lo prioriza. Cuando ya está listo para hablar con una persona, lo
                            asigna a un asesor para cerrar la venta.
                        </p>

                        <div className="solution__demo">
                            <p className="demo-label">El flujo</p>
                            <svg
                                className="flowstrip"
                                viewBox="0 0 360 76"
                                role="img"
                                aria-label="Los prospectos que llegan de las campañas escriben por WhatsApp, un agente de inteligencia artificial los atiende, los perfila y los prioriza, y de ahí pasan a un asesor."
                            >
                                <g className="flowstrip__wires" fill="none" strokeWidth="1.3">
                                    <path d="M66,38 L98,38" />
                                    <path d="M168,38 L200,38" />
                                    <path d="M268,38 L300,38" />
                                </g>

                                <circle className="pkt pkt--a1" r="3.2" />
                                <circle className="pkt pkt--a2" r="3.2" />
                                <circle className="pkt pkt--a3" r="3.2" />

                                <g className="flowstrip__chips">
                                    <g><rect x="2" y="24" width="64" height="28" rx="7" /><text x="34" y="42">Campañas</text></g>
                                    <g><rect x="98" y="24" width="70" height="28" rx="7" /><text x="133" y="42">WhatsApp</text></g>
                                    <g className="flowstrip__chip--key"><rect x="200" y="24" width="68" height="28" rx="7" /><text x="234" y="42">Agente IA</text></g>
                                    <g><rect x="300" y="24" width="58" height="28" rx="7" /><text x="329" y="42">Asesor</text></g>
                                </g>
                            </svg>
                            <p className="flow-note">
                                Lo que llega al asesor ya está evaluado,
                                perfilado y priorizado.
                            </p>

                            <p className="demo-label">Una conversación de ejemplo</p>
                            <div className="chat">
                                <div className="bub bub--them d1">Hola, vi el depa de Polanco. ¿Sigue disponible?</div>
                                <div className="bub bub--us d2">
                                    Sí, sigue disponible. ¿Lo buscas para vivir o como inversión?
                                </div>
                                <div className="bub bub--them d3">Para inversión. ¿Me pasas la ficha?</div>
                                <div className="bub bub--us d4">
                                    Va, ahí te va. Y te enlazo con Ana, tu asesora, con todo el
                                    contexto de esta plática.
                                </div>
                                <div className="qualified d5">
                                    <span className="dot" aria-hidden="true" />
                                    Perfilado: inversión · prioridad alta · listo para asesor
                                </div>
                            </div>
                        </div>

                        <a
                            className="btn btn-secondary solution__cta"
                            href={whatsappUrl('Hola Vireon, quiero un agente que atienda mis leads por WhatsApp.')}
                            target="_blank"
                            rel="noopener"
                        >
                            Quiero esto para mis leads
                            <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                        </a>
                    </article>

                    {/* 2. Creación de contenido */}
                    <article className="solution solution--2">
                        <p className="solution__tag">Contenido · en marcha</p>
                        <h3 className="solution__title">Mandas una nota de voz, regresa tu contenido</h3>
                        <p className="solution__desc">
                            Le mandas un mensaje de voz o de texto por WhatsApp o Telegram
                            diciendo qué quieres comunicar. La herramienta genera el contenido
                            para las redes sociales de la empresa. Sin abrir un editor y sin
                            esperar a que alguien tenga el rato libre.
                        </p>

                        <div className="solution__demo">
                            <p className="demo-label">El flujo</p>
                            <svg
                                className="flowstrip"
                                viewBox="0 0 360 90"
                                role="img"
                                aria-label="Mandas una nota de voz o un texto por WhatsApp o por Telegram, el agente creador de contenido lo procesa y regresa el contenido para las redes sociales de la empresa."
                            >
                                <g className="flowstrip__wires" fill="none" strokeWidth="1.3">
                                    <path d="M74,19 C98,19 98,42 122,42" />
                                    <path d="M74,65 C98,65 98,42 122,42" />
                                    <path d="M234,42 L282,42" />
                                </g>

                                <circle className="pkt pkt--b1" r="3.2" />
                                <circle className="pkt pkt--b2" r="3.2" />
                                <circle className="pkt pkt--b3" r="3.2" />

                                <g className="flowstrip__chips">
                                    <g><rect x="2" y="6" width="72" height="26" rx="7" /><text x="38" y="23">WhatsApp</text></g>
                                    <g><rect x="2" y="52" width="72" height="26" rx="7" /><text x="38" y="69">Telegram</text></g>
                                    <g className="flowstrip__chip--key">
                                        <rect x="122" y="22" width="112" height="40" rx="9" />
                                        <text x="178" y="38">Agente creador</text>
                                        <text x="178" y="51">de contenido</text>
                                    </g>
                                    <g><rect x="282" y="29" width="76" height="26" rx="7" /><text x="320" y="46">Tus redes</text></g>
                                </g>
                            </svg>
                            <p className="flow-note">
                                Voz o texto, por el canal que ya usas. Regresa armado.
                            </p>

                            <p className="demo-label">Lo que mandas</p>
                            <div className="voice d1">
                                <span className="voice__icon" aria-hidden="true"><Mic size={15} /></span>
                                <span className="wave" aria-hidden="true">
                                    <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                                </span>
                                <span className="voice__time">0:14</span>
                            </div>
                            <p className="voice__hint d2">
                                “Saca algo del depa nuevo de Condesa, que se vea la terraza al atardecer.”
                            </p>

                            <div className="working d3" aria-hidden="true">
                                <Sparkles size={14} />
                                <span>armando la publicación</span>
                            </div>

                            <p className="demo-label">Lo que regresa</p>
                            <div className="post d4">
                                <div className="post__head">
                                    <span className="post__net">Instagram</span>
                                    <span className="post__ready">listo para publicar</span>
                                </div>
                                <div className="post__art" aria-hidden="true">
                                    <span className="post__sun" />
                                    <span className="post__terrace" />
                                </div>
                                <p className="post__caption">
                                    La terraza que se roba la tarde en Condesa. Dos recámaras,
                                    entrega inmediata y una vista que no se explica, se ve.
                                </p>
                                <p className="post__tags">
                                    <span>#Condesa</span><span>#DepaNuevo</span><span>#CDMX</span>
                                </p>
                            </div>
                        </div>

                        <a
                            className="btn btn-secondary solution__cta"
                            href={whatsappUrl('Hola Vireon, quiero automatizar la creación de contenido de mis redes.')}
                            target="_blank"
                            rel="noopener"
                        >
                            Quiero esto para mis redes
                            <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                        </a>
                    </article>

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

export default Solutions;
