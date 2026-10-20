import { CalendarCheck, Handshake, Info, Users } from 'lucide-react';
import './PorteroTablero.css';

/**
 * Maqueta del tablero de métricas de Portero. Las cifras son de ejemplo y la
 * maqueta lo dice dos veces: en la etiqueta de arriba y en el pie. No las
 * cambies por datos de un cliente real sin su autorización.
 *
 * Todo número está escrito como texto: las barras solo lo dibujan (aria-hidden),
 * así que un lector de pantalla lee lo mismo que se ve. Las barras son de un
 * solo tono porque miden cantidad, no distinguen categorías.
 */

const KPIS = [
    { icono: Users, etiqueta: 'Prospectos nuevos', valor: '248', nota: 'este mes' },
    { icono: CalendarCheck, etiqueta: 'Citas agendadas', valor: '61', nota: '25% de los prospectos' },
    { icono: Handshake, etiqueta: 'Cierres', valor: '14', nota: '23% de las citas' },
];

const EMBUDO = [
    { etapa: 'Asignado', valor: 248 },
    { etapa: 'Contactado', valor: 197 },
    { etapa: 'Cita agendada', valor: 61 },
    { etapa: 'Cerrado', valor: 14 },
];

const PRIORIDAD = [
    { nivel: 'Alta', accion: 'contactar hoy', porcentaje: 31 },
    { nivel: 'Media', accion: 'dar seguimiento', porcentaje: 44 },
    { nivel: 'Baja', accion: 'nutrir', porcentaje: 25 },
];

const ASESORES = [
    { nombre: 'Carlos', activos: 34, citas: 17 },
    { nombre: 'Daniela', activos: 31, citas: 16 },
    { nombre: 'Jorge', activos: 33, citas: 14 },
    { nombre: 'Sofía', activos: 30, citas: 14 },
];

const MAX_EMBUDO = EMBUDO[0].valor;
const MAX_ACTIVOS = Math.max(...ASESORES.map((a) => a.activos));

const Barra = ({ proporcion }: { proporcion: number }) => (
    <span className="ptab-barra" aria-hidden="true">
        <span style={{ width: `${Math.max(proporcion * 100, 2)}%` }} />
    </span>
);

const PorteroTablero = () => {
    return (
        <figure className="ptab">
            {/* Barra de ventana del navegador: adorno. */}
            <div className="ptab-ventana" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>Portal de Portero</p>
            </div>
            <div className="ptab-cabeza">
                <div>
                    <h3 className="ptab-titulo">Tablero comercial</h3>
                    <p className="ptab-periodo">Todos los desarrollos · mes en curso</p>
                </div>
                <span className="ptab-ilustrativo">
                    <Info size={14} aria-hidden="true" />
                    Datos ilustrativos
                </span>
            </div>

            <div className="ptab-cuerpo">
                <ul role="list" className="ptab-kpis">
                    {KPIS.map(({ icono: Icono, etiqueta, valor, nota }) => (
                        <li key={etiqueta} className="ptab-panel ptab-kpi">
                            <span className="ptab-kpi-icono" aria-hidden="true">
                                <Icono size={18} />
                            </span>
                            <span className="ptab-kpi-etiqueta">{etiqueta}</span>
                            <span className="ptab-kpi-valor">{valor}</span>
                            <span className="ptab-kpi-nota">{nota}</span>
                        </li>
                    ))}
                </ul>

                <div className="ptab-panel ptab-embudo">
                    <h4 className="ptab-panel-titulo">Embudo comercial</h4>
                    <ul role="list" className="ptab-filas">
                        {EMBUDO.map(({ etapa, valor }, i) => (
                            <li key={etapa}>
                                <span className="ptab-fila-texto">
                                    <span>{etapa}</span>
                                    <span className="ptab-fila-valor">
                                        {valor}
                                        {i > 0 && (
                                            <span className="ptab-fila-extra">
                                                {' '}· {Math.round((valor / EMBUDO[i - 1].valor) * 100)}% de la etapa anterior
                                            </span>
                                        )}
                                    </span>
                                </span>
                                <Barra proporcion={valor / MAX_EMBUDO} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="ptab-panel ptab-prioridad">
                    <h4 className="ptab-panel-titulo">Prospectos por prioridad</h4>
                    <ul role="list" className="ptab-filas">
                        {PRIORIDAD.map(({ nivel, accion, porcentaje }) => (
                            <li key={nivel}>
                                <span className="ptab-fila-texto">
                                    <span>
                                        <strong>{nivel}</strong> · {accion}
                                    </span>
                                    <span className="ptab-fila-valor">{porcentaje}%</span>
                                </span>
                                <Barra proporcion={porcentaje / 100} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="ptab-panel ptab-asesores">
                    <h4 className="ptab-panel-titulo">Carga por asesor</h4>
                    <ul role="list" className="ptab-filas">
                        {ASESORES.map(({ nombre, activos, citas }) => (
                            <li key={nombre}>
                                <span className="ptab-fila-texto">
                                    <span>{nombre}</span>
                                    <span className="ptab-fila-valor">
                                        {activos} prospectos en curso · {citas} citas
                                    </span>
                                </span>
                                <Barra proporcion={activos / MAX_ACTIVOS} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <figcaption className="ptab-pie">
                Vista previa con datos ilustrativos y nombres ficticios. No corresponde a ningún cliente.
            </figcaption>
        </figure>
    );
};

export default PorteroTablero;
