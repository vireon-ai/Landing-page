import { useEffect, useRef } from 'react';
import { CheckCheck, FileText, Flame } from 'lucide-react';
import './PorteroConversacion.css';

/**
 * Maqueta de una conversación de Portero, hecha en HTML y CSS (no es imagen):
 * así se lee en lectores de pantalla y pesa casi nada.
 *
 * Todo es ficticio: el prospecto, el asesor, el desarrollo y el precio. No lo
 * cambies por nombres o datos de un cliente real.
 *
 * Los mensajes aparecen uno por uno la primera vez que la maqueta entra en
 * pantalla. Si la persona pidió menos movimiento, o el navegador no tiene
 * IntersectionObserver, se ven todos desde el principio.
 */

type Mensaje =
    | { de: 'prospecto' | 'agente'; hora: string; texto: string }
    | { de: 'agente'; hora: string; archivo: string; detalle: string };

const MENSAJES: Mensaje[] = [
    { de: 'prospecto', hora: '21:42', texto: 'Hola, vi el anuncio. ¿Cuánto cuestan los departamentos?' },
    {
        de: 'agente',
        hora: '21:42',
        texto:
            '¡Hola, Andrea! Gracias por escribir a Residencial Arboleda. Tenemos departamentos de 2 y 3 recámaras, desde $2,350,000*. ¿Lo buscas para vivir o para invertir?',
    },
    { de: 'prospecto', hora: '21:44', texto: 'Para vivir, somos 4. ¿Aceptan Infonavit? Compraríamos antes de fin de año.' },
    {
        de: 'agente',
        hora: '21:44',
        texto:
            '¡Claro! Aceptamos Infonavit, cofinanciamiento y crédito bancario. Para una familia de 4 te recomiendo el modelo de 3 recámaras: dos baños, estancia amplia y dos cajones de estacionamiento.',
    },
    { de: 'agente', hora: '21:45', archivo: 'Brochure Residencial Arboleda.pdf', detalle: 'PDF · 12 páginas' },
    {
        de: 'agente',
        hora: '21:45',
        texto:
            'Te presento a Carlos, tu asesor. Él te escribirá para agendar tu visita al desarrollo. ¡Gracias por tu interés, Andrea!',
    },
];

const PERFIL = [
    { dato: 'Nombre', valor: 'Andrea' },
    { dato: 'Campaña de origen', valor: 'Anuncio · Preventa' },
    { dato: 'Para qué', valor: 'Vivir' },
    { dato: 'Personas', valor: '4' },
    { dato: 'Recámaras', valor: '3' },
    { dato: 'Forma de pago', valor: 'Infonavit' },
    { dato: 'Tiempo de compra', valor: 'Antes de fin de año' },
    { dato: 'Asesor asignado', valor: 'Carlos' },
];

const PorteroConversacion = () => {
    const raiz = useRef<HTMLDivElement>(null);
    // Sin clase: todo visible. pconv--espera: oculto hasta entrar en pantalla.
    // pconv--corre: la animación ya arrancó. Se cambia en el DOM, como las
    // animaciones de App.tsx, para no re-renderizar la maqueta.

    useEffect(() => {
        const nodo = raiz.current;
        const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!nodo || sinMovimiento || !('IntersectionObserver' in window)) return;

        // Si ya está en pantalla al cargar, no vale la pena esconderla.
        const caja = nodo.getBoundingClientRect();
        if (caja.top < window.innerHeight * 0.85) return;

        nodo.classList.add('pconv--espera');
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (entrada.isIntersecting) {
                    nodo.classList.replace('pconv--espera', 'pconv--corre');
                    observador.disconnect();
                }
            },
            // Sin umbral por porcentaje: en móvil la maqueta mide más que la
            // pantalla y un 30 % nunca llegaba a verse (se quedaba invisible en
            // pantallas bajas, con zoom o en horizontal). Arranca en cuanto su
            // borde superior pasa del 80 % de la altura.
            { threshold: 0, rootMargin: '0px 0px -20% 0px' },
        );
        observador.observe(nodo);
        return () => observador.disconnect();
    }, []);

    return (
        <div ref={raiz} className="pconv">
            <figure className="pconv-telefono">
                <div className="pconv-barra">
                    <span className="pconv-avatar" aria-hidden="true">RA</span>
                    <span className="pconv-contacto">
                        <span className="pconv-contacto-nombre">Residencial Arboleda</span>
                        <span className="pconv-contacto-estado">Cuenta de empresa · en línea</span>
                    </span>
                </div>

                <ol role="list" className="pconv-mensajes">
                    <li className="pconv-dia" aria-hidden="true">
                        <span>Domingo</span>
                    </li>
                    {MENSAJES.map((mensaje, i) => (
                        <li
                            key={i}
                            className={`pconv-msg pconv-msg--${mensaje.de}`}
                            style={{ '--i': i } as React.CSSProperties}
                        >
                            <span className="pconv-sr">
                                {mensaje.de === 'agente' ? 'Portero: ' : 'Prospecto: '}
                            </span>
                            {'archivo' in mensaje ? (
                                <span className="pconv-archivo">
                                    <span className="pconv-archivo-icono" aria-hidden="true">
                                        <FileText size={20} />
                                    </span>
                                    <span>
                                        <span className="pconv-archivo-nombre">{mensaje.archivo}</span>
                                        <span className="pconv-archivo-detalle">{mensaje.detalle}</span>
                                    </span>
                                </span>
                            ) : (
                                <span>{mensaje.texto}</span>
                            )}
                            <span className="pconv-hora">
                                <span className="pconv-sr">, a las </span>
                                {mensaje.hora}
                                {mensaje.de === 'prospecto' && <CheckCheck size={14} aria-hidden="true" />}
                            </span>
                        </li>
                    ))}
                </ol>

                <figcaption className="pconv-nota">
                    Conversación ilustrativa. Nombres, desarrollo y precio son ficticios (*precio de ejemplo).
                </figcaption>
            </figure>

            {/* div y no section: en esta página `.portero-page section` quita el
                padding, y además no hace falta otra región de navegación. */}
            <div className="pconv-perfil">
                <div className="pconv-perfil-cabeza">
                    <h3 id="pconv-perfil-titulo">Perfil capturado</h3>
                    <span className="pconv-prioridad">
                        <Flame size={14} aria-hidden="true" />
                        Prioridad alta
                    </span>
                </div>
                <dl className="pconv-perfil-datos">
                    {PERFIL.map(({ dato, valor }) => (
                        <div key={dato}>
                            <dt>{dato}</dt>
                            <dd>{valor}</dd>
                        </div>
                    ))}
                </dl>
                <p className="pconv-perfil-resumen">
                    <strong>Resumen para el asesor:</strong> familia de 4, busca para vivir, paga con
                    Infonavit y quiere comprar antes de fin de año. Interés en el modelo de 3 recámaras.
                    Ya recibió el brochure.
                </p>
                <p className="pconv-perfil-accion">
                    <strong>Siguiente paso:</strong> contactar hoy
                </p>
                <p className="pconv-perfil-nota">Perfil de ejemplo con datos ficticios.</p>
            </div>
        </div>
    );
};

export default PorteroConversacion;
