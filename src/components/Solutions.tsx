import { ArrowRight, BadgeCheck, Clock, LayoutDashboard, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import './Solutions.css';

/**
 * Vireon Solutions: herramientas prediseñadas para giros concretos.
 *
 * El texto de la sección describe cómo son las soluciones, no si ya están
 * disponibles: eso lo dice el `estado` de cada tarjeta. Al lanzar una solución
 * solo cambia su `estado`.
 *
 * Para sumar otra solución, agrega un objeto a SOLUCIONES. La cuadrícula reparte
 * el ancho sola: con una tarjeta, esa ocupa toda la sección.
 */

type Solucion = {
    id: string;
    giro: string;
    estado: string;
    nombre: string;
    frase: string;
    descripcion: string;
    puntos: { icono: LucideIcon; texto: string }[];
    cta: { texto: string; href: string };
};

const SOLUCIONES: Solucion[] = [
    {
        id: 'portero',
        giro: 'Inmobiliarias',
        estado: 'Próximamente',
        nombre: 'Portero',
        frase: 'El agente de WhatsApp que atiende a tus leads inmobiliarios al instante.',
        descripcion:
            'Pensado para inmobiliarias: Portero responde y da seguimiento a cada prospecto que te escribe por WhatsApp, a cualquier hora, con el tono y la información de tu inmobiliaria. Es personalizable para cada cliente e incluye un portal web para seguir tus conversaciones.',
        // VALIDAR con Luis: que estas funciones coincidan con la primera versión de Portero.
        puntos: [
            { icono: Clock, texto: 'Atención inmediata, las 24 horas' },
            { icono: SlidersHorizontal, texto: 'Configurable con tu información y tu tono' },
            { icono: LayoutDashboard, texto: 'Portal web para seguir conversaciones y leads' },
            { icono: BadgeCheck, texto: 'Basado en un agente que ya opera con leads reales' },
        ],
        cta: { texto: 'Unirme a la lista de espera', href: '/soluciones/portero/#lista-de-espera' },
    },
];

const Solutions = () => {
    return (
        <section id="soluciones" className="soluciones" aria-labelledby="soluciones-titulo">
            <div className="fondo fondo--reticula" aria-hidden="true" />
            <div className="container">
                <div className="text-center">
                    <h2 id="soluciones-titulo" className="section-title">Vireon <span className="texto-degradado">Solutions</span></h2>
                    {/* VALIDAR: copy del brief, con dos cambios para que no se lea como
                        "disponible hoy" junto a la etiqueta "Próximamente": "listas para
                        incorporarse" pasó a "pensadas para incorporarse" y se quitó "para que
                        empieces a usarlas". Sigue chocando con FAQ.tsx ("no en plantillas
                        genéricas"). */}
                    <p className="soluciones-subtitulo">
                        Soluciones prediseñadas para giros específicos, pensadas para incorporarse a tu operación.
                    </p>
                    <p className="soluciones-intro">
                        No todo problema necesita un desarrollo desde cero. Nuestras soluciones ya están
                        pensadas para las necesidades de un giro y se configuran con la información y el
                        estilo de tu empresa, sin meses de desarrollo.
                    </p>
                </div>

                <div className="soluciones-grid">
                    {SOLUCIONES.map((solucion) => (
                        <article
                            key={solucion.id}
                            className="solucion"
                            aria-labelledby={`solucion-${solucion.id}`}
                        >
                            {/* El contenedor de la query es el article; el acomodo va en este div. */}
                            <div className="solucion-interior">
                                <div className="solucion-cuerpo">
                                    <p className="solucion-etiqueta">
                                        <span>{solucion.giro}</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="solucion-estado">{solucion.estado}</span>
                                    </p>
                                    <h3 id={`solucion-${solucion.id}`} className="solucion-nombre">
                                        {solucion.nombre}
                                    </h3>
                                    <p className="solucion-frase">{solucion.frase}</p>
                                    <p className="solucion-descripcion">{solucion.descripcion}</p>
                                    <a className="btn btn-primary solucion-cta" href={solucion.cta.href}>
                                        {solucion.cta.texto}
                                        <ArrowRight size={18} aria-hidden="true" />
                                    </a>
                                </div>

                                <ul className="solucion-puntos">
                                    {solucion.puntos.map(({ icono: Icono, texto }) => (
                                        <li key={texto}>
                                            <span className="solucion-punto-icono" aria-hidden="true">
                                                <Icono size={20} />
                                            </span>
                                            {texto}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Puente a la sección que sigue: lo hecho para un giro, y si no es
                    el tuyo, lo que construimos a la medida. */}
                <p className="soluciones-pie">
                    <a href="#services">¿Tu giro es otro? Conoce lo que hacemos a la medida</a>
                </p>
            </div>
        </section>
    );
};

export default Solutions;
