import { useEffect, useState } from 'react';
import './LiveFlow.css';

/**
 * Diagrama de operación en vivo.
 *
 * Muestra cómo entran los pedidos por tres canales, pasan por un agente y
 * actualizan los sistemas del cliente. El movimiento va en SVG + CSS: nada de
 * librerías de animación, para no tocar el tiempo de carga del sitio.
 */

const PEDIDOS_INICIALES = 312;

const LiveFlow = () => {
    const [pedidos, setPedidos] = useState(PEDIDOS_INICIALES);

    useEffect(() => {
        const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (sinMovimiento) return;

        const intervalo = window.setInterval(() => {
            setPedidos((previo) => (Math.random() < 0.55 ? previo + 1 : previo));
        }, 3400);

        return () => window.clearInterval(intervalo);
    }, []);

    return (
        <div className="live-flow">
            <div className="live-flow__head">
                <span className="live-flow__eyebrow">Un día cualquiera en un cliente</span>
                <span className="live-flow__live">
                    <i aria-hidden="true" />
                    en vivo
                </span>
            </div>

            <div className="live-flow__canvas">
                <svg
                    viewBox="0 0 520 260"
                    role="img"
                    aria-label="Los pedidos entran por WhatsApp, correo y formulario web, un agente de inteligencia artificial los clasifica y actualiza el CRM, el inventario y el dashboard."
                >
                    <g className="live-flow__wires" fill="none" strokeWidth="1.4">
                        <path d="M110,43 C155,43 155,130 200,130" />
                        <path d="M110,130 L200,130" />
                        <path d="M110,217 C155,217 155,130 200,130" />
                        <path d="M320,130 C365,130 365,43 410,43" />
                        <path d="M320,130 L410,130" />
                        <path d="M320,130 C365,130 365,217 410,217" />
                    </g>

                    <circle className="live-flow__pkt live-flow__pkt--1" r="3.6" />
                    <circle className="live-flow__pkt live-flow__pkt--2" r="3.6" />
                    <circle className="live-flow__pkt live-flow__pkt--3" r="3.6" />
                    <circle className="live-flow__pkt live-flow__pkt--4" r="3.6" />
                    <circle className="live-flow__pkt live-flow__pkt--5" r="3.6" />
                    <circle className="live-flow__pkt live-flow__pkt--6" r="3.6" />

                    <g className="live-flow__nodes">
                        <g className="live-flow__node live-flow__node--d1">
                            <rect x="10" y="20" width="100" height="46" rx="10" />
                            <text x="60" y="47">WhatsApp</text>
                        </g>
                        <g className="live-flow__node live-flow__node--d2">
                            <rect x="10" y="107" width="100" height="46" rx="10" />
                            <text x="60" y="134">Correo</text>
                        </g>
                        <g className="live-flow__node live-flow__node--d3">
                            <rect x="10" y="194" width="100" height="46" rx="10" />
                            <text x="60" y="221">Formulario</text>
                        </g>

                        <g className="live-flow__agent">
                            <rect x="196" y="98" width="128" height="64" rx="14" />
                            <text className="live-flow__agent-name" x="260" y="124">Agente Vireon</text>
                            <text className="live-flow__agent-role" x="260" y="143">lee · clasifica · actúa</text>
                        </g>

                        <g className="live-flow__node live-flow__node--d4">
                            <rect x="410" y="20" width="100" height="46" rx="10" />
                            <text x="460" y="47">CRM</text>
                        </g>
                        <g className="live-flow__node live-flow__node--d5">
                            <rect x="410" y="107" width="100" height="46" rx="10" />
                            <text x="460" y="134">Inventario</text>
                        </g>
                        <g className="live-flow__node live-flow__node--d6">
                            <rect x="410" y="194" width="100" height="46" rx="10" />
                            <text x="460" y="221">Dashboard</text>
                        </g>
                    </g>
                </svg>
            </div>

            <div className="live-flow__foot">
                <span className="live-flow__foot-label">Pedidos atendidos hoy, sin tocar un teclado</span>
                <span className="live-flow__foot-value">{pedidos.toLocaleString('es-MX')}</span>
            </div>
        </div>
    );
};

export default LiveFlow;
