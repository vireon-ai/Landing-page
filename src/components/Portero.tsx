import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
    AlertTriangle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Bot,
    Building2,
    Check,
    CircleCheck,
    Clock,
    FileSpreadsheet,
    FileText,
    Flame,
    ListChecks,
    MessageCircle,
    MessageSquareText,
    Route,
    Scale,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Target,
    TrendingUp,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import vireonLogo from '../assets/vireon-logo.png';
import { CORREO_CONTACTO } from '../config';
import { enviarConReintentos, guardarPendiente, reintentarPendientes, type Lead } from '../leads';
import PorteroConversacion from './PorteroConversacion';
import PorteroTablero from './PorteroTablero';
import './Portero.css';

/**
 * Página de Portero, la primera de Vireon Solutions. Vive en
 * `/soluciones/portero/` como entrada aparte del build (igual que el aviso de
 * privacidad), sin ruteo del lado del cliente.
 *
 * Portero todavía no está a la venta: la página se promociona como
 * "Próximamente" con lista de espera, y todos los botones llevan al formulario.
 * Restricciones del brief: sin fechas de lanzamiento, sin decir que Vireon es
 * Tech Provider ni partner de Meta, sin métricas ni testimonios inventados.
 * Sin precios de Portero ni nada de tarifas, costo por mensaje, ventanas o
 * categorías de mensajes de Meta. Sin nombres de clientes ni de personas reales:
 * el cliente que ya opera es "nuestro primer cliente, una desarrolladora
 * inmobiliaria". Las cifras de las maquetas (chat y tablero) son ilustrativas y
 * así lo dicen en pantalla.
 *
 * Los textos marcados con VALIDAR no venían en el brief; se escribieron para que
 * la página funcione y hay que confirmarlos antes de publicar.
 */

// ---------------------------------------------------------------------------
// Prueba de que funciona. Oculta hasta que el cliente del agente que ya opera
// autorice mostrarlo como caso. No la llenes con cifras inventadas: para
// activarla, escribe el caso real en CASO y cambia MOSTRAR_CASO a true.
// ---------------------------------------------------------------------------
const MOSTRAR_CASO = false;

const CASO: { titulo: string; texto: string; metricas: { valor: string; etiqueta: string }[] } = {
    titulo: '',
    texto: '',
    metricas: [],
};

const PruebaPortero = () => {
    if (!MOSTRAR_CASO) return null;
    return (
        <section className="portero-seccion portero-caso" aria-labelledby="portero-caso-titulo">
            <div className="container portero-angosto">
                <h2 id="portero-caso-titulo" className="portero-h2">{CASO.titulo}</h2>
                <p className="portero-texto">{CASO.texto}</p>
                {CASO.metricas.length > 0 && (
                    <dl className="portero-metricas">
                        {CASO.metricas.map((metrica) => (
                            <div key={metrica.etiqueta}>
                                <dt>{metrica.etiqueta}</dt>
                                <dd>{metrica.valor}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </section>
    );
};

// ---------------------------------------------------------------------------
// Lista de espera
// ---------------------------------------------------------------------------

const RANGOS_LEADS = ['Menos de 50', '50–200', 'Más de 200'];

type Campos = {
    nombre: string;
    empresa: string;
    correo: string;
    whatsapp: string;
    leadsMes: string;
    aviso: boolean;
};

type Errores = Partial<Record<keyof Campos, string>>;

const VACIO: Campos = { nombre: '', empresa: '', correo: '', whatsapp: '', leadsMes: '', aviso: false };

const ORDEN: (keyof Campos)[] = ['nombre', 'empresa', 'correo', 'whatsapp', 'leadsMes', 'aviso'];

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// VALIDAR: mensajes de error del formulario (no venían en el brief).
const validarCampo = (campo: keyof Campos, datos: Campos): string | undefined => {
    switch (campo) {
        case 'nombre':
            return datos.nombre.trim() ? undefined : 'Escribe tu nombre.';
        case 'empresa':
            return datos.empresa.trim() ? undefined : 'Escribe el nombre de tu empresa o desarrolladora.';
        case 'correo':
            if (!datos.correo.trim()) return 'Escribe tu correo.';
            return CORREO_VALIDO.test(datos.correo.trim()) ? undefined : 'Revisa tu correo; parece incompleto.';
        case 'whatsapp': {
            if (!datos.whatsapp.trim()) return undefined;
            const digitos = datos.whatsapp.replace(/\D/g, '').length;
            return digitos >= 10 && digitos <= 13 ? undefined : 'Escribe un número de 10 dígitos, o déjalo vacío.';
        }
        case 'leadsMes':
            return datos.leadsMes ? undefined : 'Elige un rango aproximado.';
        case 'aviso':
            return datos.aviso ? undefined : 'Para enviar, acepta el Aviso de Privacidad.';
    }
};

const validar = (datos: Campos): Errores => {
    const errores: Errores = {};
    for (const campo of ORDEN) {
        const error = validarCampo(campo, datos);
        if (error) errores[campo] = error;
    }
    return errores;
};

const ListaDeEspera = () => {
    const [datos, setDatos] = useState<Campos>(VACIO);
    const [errores, setErrores] = useState<Errores>({});
    const [trampa, setTrampa] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const campos = useRef<Partial<Record<keyof Campos, HTMLInputElement | HTMLSelectElement | null>>>({});
    const confirmacion = useRef<HTMLHeadingElement>(null);
    // El estado tarda un render en cambiar; esto frena un doble clic al instante.
    const enviando = useRef(false);

    // Igual que el formulario de la landing: reintenta lo que quedó guardado.
    useEffect(() => reintentarPendientes(), []);

    useEffect(() => {
        if (status === 'success') confirmacion.current?.focus();
    }, [status]);

    const cambiar = <K extends keyof Campos>(campo: K, valor: Campos[K]) => {
        const siguientes = { ...datos, [campo]: valor };
        setDatos(siguientes);
        // Si el campo ya enseñaba un error, se quita en cuanto queda bien.
        if (errores[campo]) {
            setErrores((previos) => ({ ...previos, [campo]: validarCampo(campo, siguientes) }));
        }
    };

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (enviando.current) return;

        const encontrados = validar(datos);
        // flushSync: el error tiene que estar en el DOM antes de mover el foco, para
        // que el lector de pantalla lo lea junto con la etiqueta del campo.
        flushSync(() => setErrores(encontrados));
        const primero = ORDEN.find((campo) => encontrados[campo]);
        if (primero) {
            campos.current[primero]?.focus();
            return;
        }

        enviando.current = true;
        setStatus('submitting');

        const whatsapp = datos.whatsapp.trim();
        const lead: Lead = {
            name: datos.nombre.trim(),
            company: datos.empresa.trim(),
            email: datos.correo.trim(),
            // La hoja de n8n todavía no tiene columnas para WhatsApp ni volumen:
            // van aquí para que lleguen, y también como campos aparte.
            message: `Lista de espera de Portero · Leads al mes: ${datos.leadsMes} · WhatsApp: ${whatsapp || 'no lo dejó'}`,
            // Campo trampa: una persona no lo ve, un bot lo llena. No se descarta
            // (un autocompletado podría llenarlo a una persona real): se envía
            // marcado para revisarlo en la hoja.
            origen: trampa ? 'portero-lista-espera-posible-spam' : 'portero-lista-espera',
            enviadoEn: new Date().toISOString(),
            whatsapp,
            leadsMes: datos.leadsMes,
        };

        const enviado = await enviarConReintentos(lead);
        enviando.current = false;

        if (enviado) {
            setStatus('success');
            setDatos(VACIO);
        } else {
            // No perdemos el registro: queda guardado y se reintenta al recargar.
            guardarPendiente(lead);
            setStatus('error');
        }
    };

    const describir = (campo: keyof Campos, ayuda?: string) =>
        [ayuda, errores[campo] ? `portero-error-${campo}` : undefined].filter(Boolean).join(' ') || undefined;

    const error = (campo: keyof Campos) =>
        errores[campo] ? (
            <p id={`portero-error-${campo}`} className="portero-campo-error">
                <AlertTriangle size={14} aria-hidden="true" />
                {errores[campo]}
            </p>
        ) : null;

    if (status === 'success') {
        return (
            // VALIDAR: texto de confirmación. No promete acceso anticipado ni fechas.
            // Sin role="status": el foco ya va al encabezado y se leería dos veces.
            <div className="portero-exito">
                <span className="portero-exito-icono" aria-hidden="true">
                    <Check size={32} />
                </span>
                <h3 ref={confirmacion} tabIndex={-1}>Ya estás en la lista de espera</h3>
                <p>Gracias por tu interés en Portero. Recibimos tus datos.</p>
                <button
                    type="button"
                    className="portero-enlace"
                    onClick={() => {
                        flushSync(() => setStatus('idle'));
                        campos.current.nombre?.focus();
                    }}
                >
                    Registrar a otra persona
                </button>
            </div>
        );
    }

    return (
        <form className="portero-form" onSubmit={enviar} noValidate>
            <p className="portero-form-nota">Los campos marcados con * son obligatorios.</p>

            <div className="portero-form-fila">
                <div className="portero-campo">
                    <label htmlFor="portero-nombre">Nombre *</label>
                    <input
                        id="portero-nombre"
                        ref={(el) => { campos.current.nombre = el; }}
                        type="text"
                        autoComplete="name"
                        value={datos.nombre}
                        maxLength={120}
                        onChange={(e) => cambiar('nombre', e.target.value)}
                        aria-required="true"
                        aria-invalid={Boolean(errores.nombre)}
                        aria-describedby={describir('nombre')}
                    />
                    {error('nombre')}
                </div>

                <div className="portero-campo">
                    <label htmlFor="portero-empresa">Empresa o desarrolladora *</label>
                    <input
                        id="portero-empresa"
                        ref={(el) => { campos.current.empresa = el; }}
                        type="text"
                        autoComplete="organization"
                        value={datos.empresa}
                        maxLength={120}
                        onChange={(e) => cambiar('empresa', e.target.value)}
                        aria-required="true"
                        aria-invalid={Boolean(errores.empresa)}
                        aria-describedby={describir('empresa')}
                    />
                    {error('empresa')}
                </div>
            </div>

            <div className="portero-form-fila">
                <div className="portero-campo">
                    <label htmlFor="portero-correo">Correo *</label>
                    <input
                        id="portero-correo"
                        ref={(el) => { campos.current.correo = el; }}
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={datos.correo}
                        maxLength={254}
                        onChange={(e) => cambiar('correo', e.target.value)}
                        aria-required="true"
                        aria-invalid={Boolean(errores.correo)}
                        aria-describedby={describir('correo')}
                    />
                    {error('correo')}
                </div>

                <div className="portero-campo">
                    <label htmlFor="portero-whatsapp">
                        WhatsApp <span className="portero-opcional">(opcional)</span>
                    </label>
                    <input
                        id="portero-whatsapp"
                        ref={(el) => { campos.current.whatsapp = el; }}
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={datos.whatsapp}
                        maxLength={20}
                        onChange={(e) => cambiar('whatsapp', e.target.value)}
                        aria-invalid={Boolean(errores.whatsapp)}
                        aria-describedby={describir('whatsapp', 'portero-ayuda-whatsapp')}
                    />
                    {/* No quitar ni cambiar sin revisar el aviso: esta leyenda es el
                        consentimiento en el que se apoya §5 ("aceptaron ser contactadas por ese
                        medio") para escribir por WhatsApp a quien deja su número. */}
                    <p id="portero-ayuda-whatsapp" className="portero-ayuda">
                        Si lo dejas, podremos escribirte por WhatsApp sobre Portero.
                    </p>
                    {error('whatsapp')}
                </div>
            </div>

            <div className="portero-campo">
                <label htmlFor="portero-leads">Prospectos aproximados al mes *</label>
                <select
                    id="portero-leads"
                    ref={(el) => { campos.current.leadsMes = el; }}
                    value={datos.leadsMes}
                    onChange={(e) => cambiar('leadsMes', e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errores.leadsMes)}
                    aria-describedby={describir('leadsMes')}
                >
                    <option value="" disabled>Elige un rango</option>
                    {RANGOS_LEADS.map((rango) => (
                        <option key={rango} value={rango}>{rango}</option>
                    ))}
                </select>
                {error('leadsMes')}
            </div>

            {/* Campo trampa contra spam: fuera de la vista y del orden de tabulación. */}
            <div className="portero-trampa" aria-hidden="true">
                <label htmlFor="portero-campo-extra">No llenes este campo</label>
                <input
                    id="portero-campo-extra"
                    type="text"
                    name="campo_extra"
                    tabIndex={-1}
                    autoComplete="off"
                    value={trampa}
                    onChange={(e) => setTrampa(e.target.value)}
                />
            </div>

            <div className="portero-campo portero-aviso">
                <div className="portero-aviso-fila">
                    <input
                        id="portero-aviso"
                        ref={(el) => { campos.current.aviso = el; }}
                        type="checkbox"
                        checked={datos.aviso}
                        onChange={(e) => cambiar('aviso', e.target.checked)}
                        aria-required="true"
                        aria-invalid={Boolean(errores.aviso)}
                        aria-describedby={describir('aviso')}
                    />
                    <label htmlFor="portero-aviso">
                        {/* VALIDAR: texto de la casilla. */}
                        He leído y acepto el{' '}
                        <a href="/aviso-de-privacidad/" target="_blank" rel="noopener noreferrer">
                            Aviso de Privacidad
                            <span className="portero-sr"> (se abre en otra pestaña)</span>
                        </a>
                        . *
                    </label>
                </div>
                {error('aviso')}
            </div>

            {/* aria-disabled en vez de disabled: un botón deshabilitado suelta el foco. */}
            <button
                type="submit"
                className="btn btn-primary portero-boton"
                aria-disabled={status === 'submitting'}
            >
                {status === 'submitting' ? 'Enviando…' : 'Unirme a la lista de espera'}
            </button>
            <p className="portero-sr" role="status">
                {status === 'submitting' ? 'Enviando tu registro…' : ''}
            </p>

            {status === 'error' && (
                <div className="portero-form-error" role="alert">
                    <AlertTriangle size={18} aria-hidden="true" />
                    <span>
                        No pudimos enviar tu registro en este momento. Guardamos tus datos en este
                        navegador y volveremos a intentarlo la próxima vez que abras esta página.
                        Si prefieres no esperar, escríbenos a{' '}
                        <a href={`mailto:${CORREO_CONTACTO}?subject=Lista%20de%20espera%20de%20Portero`}>
                            {CORREO_CONTACTO}
                        </a>
                        .
                    </span>
                </div>
            )}
        </form>
    );
};

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------

const LISTA = '#lista-de-espera';

const DATOS = [
    { valor: '24/7', texto: 'Atención inmediata, todos los días' },
    { valor: '100%', texto: 'De los prospectos que escriben por WhatsApp, registrados y trazables' },
    { valor: '0', texto: 'Capturas de pantalla al grupo de WhatsApp para repartir prospectos' },
    { valor: '1', texto: 'Sola fuente de verdad del embudo comercial' },
];

const HOY = [
    'Un teléfono físico que trae quien esté en la oficina.',
    'Mensajes de bienvenida copiados y pegados a mano.',
    'La ruleta de asignación, en un Excel sin dueño.',
    'Reconstruir el historial buscando entre conversaciones.',
    'Cero visibilidad del embudo para la dirección.',
];

const CON_PORTERO = [
    'Un agente de IA responde en segundos, siempre.',
    'Bienvenida personalizada y automática para cada prospecto.',
    'Rotación automática entre los asesores activos.',
    'Resumen, insights y perfil listos antes del primer contacto.',
    'Tablero en vivo de captación, embudo y asesores.',
];

const BENEFICIOS = [
    {
        icono: Clock,
        titulo: 'Ningún prospecto sin respuesta',
        texto: 'Responde en segundos a cualquier hora, incluso en fin de semana.',
    },
    {
        icono: Target,
        titulo: 'Tiempo comercial en lo que vende',
        texto: 'Tus asesores atienden primero a quien tiene más intención de compra.',
    },
    {
        icono: Scale,
        titulo: 'Asignación justa y auditable',
        texto: 'Rotación automática, con registro del momento exacto de cada asignación.',
    },
    {
        icono: Route,
        titulo: 'Trazabilidad completa',
        texto: 'Fecha, fuente, campaña, asesor y etapa de cada prospecto.',
    },
    {
        icono: TrendingUp,
        titulo: 'Decisiones con evidencia',
        texto: 'Sabes qué campaña trae compradores, no solo mensajes.',
    },
    {
        icono: ShieldCheck,
        titulo: 'La rotación de personal deja de doler',
        texto: 'La información vive en el sistema, no en el teléfono de quien se va.',
    },
];

const A_LA_MEDIDA = [
    { icono: Building2, texto: 'La información de sus desarrollos' },
    { icono: MessageSquareText, texto: 'El guion y el tono del agente' },
    { icono: ListChecks, texto: 'Las preguntas de perfilamiento' },
    { icono: SlidersHorizontal, texto: 'Las reglas de prioridad' },
    { icono: Users, texto: 'El catálogo de asesores' },
];

const BotonLista = () => (
    <a href={LISTA} className="btn btn-primary portero-boton">
        Unirme a la lista de espera
        <ArrowDown size={18} aria-hidden="true" />
    </a>
);

/** Etiqueta corta sobre el título de cada sección. */
const Kicker = ({ children }: { children: string }) => (
    <p className="portero-kicker">
        <span aria-hidden="true" />
        {children}
    </p>
);

// Mismo caso ficticio que la conversación de "En acción": Andrea y Carlos.
const PERFILAMIENTO = [
    { pregunta: '¿Para vivir o para invertir?', respuesta: 'Para vivir' },
    { pregunta: '¿Cuántas personas son?', respuesta: '4' },
    { pregunta: '¿Cómo piensas pagar?', respuesta: 'Infonavit' },
    { pregunta: '¿Para cuándo?', respuesta: 'Antes de fin de año' },
];

/**
 * Lo que Portero hace con un prospecto, en cinco pasos sobre un riel: recibe,
 * perfila, califica, recomienda y asigna. El paso de perfilar enseña las
 * preguntas y las respuestas que va juntando, para que se entienda que el agente
 * conversa antes de pasar al asesor.
 *
 * Es una ilustración: un lector de pantalla oye la descripción del aria-label,
 * no los pasos uno por uno. La secuencia (una bolita que recorre el riel, la
 * tarjeta activa resaltada, las respuestas que entran) corre una vez por cada
 * carga de la página, en cuanto el visual entra en pantalla, y dura unos 11 s;
 * después queda quieta con el resultado. Si sale de pantalla a medias, se pausa
 * y sigue al volver.
 *
 * Decisión de producto: sin botón de pausa, a petición del equipo, aunque WCAG
 * 2.2.2 lo pide para movimiento automático de más de 5 s. Lo que la acota: no
 * se repite, y con movimiento reducido o sin IntersectionObserver se ve el
 * estado final, quieto.
 */
const VisualHero = () => {
    const raiz = useRef<HTMLDivElement>(null);

    // Layout y no effect: la clase que esconde los pasos tiene que estar antes
    // del primer pintado, o se verían un instante y luego desaparecerían. Las
    // clases se cambian en el DOM, como en PorteroConversacion, para no
    // re-renderizar el visual.
    useLayoutEffect(() => {
        const nodo = raiz.current;
        const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!nodo || sinMovimiento || !('IntersectionObserver' in window)) return;

        nodo.classList.add('phero--espera');
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (entrada.isIntersecting && nodo.classList.contains('phero--espera')) {
                    nodo.classList.replace('phero--espera', 'phero--corre');
                }
                nodo.classList.toggle('phero--fuera', !entrada.isIntersecting);
            },
            { threshold: 0, rootMargin: '0px 0px -15% 0px' },
        );
        observador.observe(nodo);
        return () => observador.disconnect();
    }, []);

    return (
        <div ref={raiz} className="phero-visual">
            <div className="phero-orbita" aria-hidden="true" />

            <ol
                className="phero-flujo"
                role="img"
                aria-label="Ejemplo ilustrativo del flujo de Portero: recibe el mensaje de WhatsApp, pregunta para qué busca, cuántas personas son, cómo piensa pagar y para cuándo; califica al prospecto con prioridad alta, le recomienda el modelo de 3 recámaras con el brochure y lo asigna a un asesor con el resumen y el perfil."
            >
                <li className="phero-paso">
                    <span className="phero-nodo">
                        <MessageCircle size={16} />
                    </span>
                    <span className="phero-tramo" />
                    <div className="phero-tarjeta">
                        <p className="phero-paso-cabeza">
                            <span className="phero-paso-nombre">1 · Recibe</span>
                            <span className="phero-tarjeta-meta">WhatsApp · 21:42</span>
                        </p>
                        <p className="phero-burbuja">Hola, vi el anuncio. ¿Cuánto cuestan los departamentos?</p>
                        <p className="phero-escribiendo">
                            <Bot size={14} />
                            {/* Primero "escribiendo", luego la respuesta; sin animación
                                solo se ve la segunda. */}
                            <span className="phero-relevo">
                                <span className="phero-relevo-antes">
                                    Portero está escribiendo
                                    <span className="phero-puntos">
                                        <i />
                                        <i />
                                        <i />
                                    </span>
                                </span>
                                <span className="phero-relevo-despues">Portero respondió en segundos</span>
                            </span>
                        </p>
                    </div>
                </li>

                <li className="phero-paso">
                    <span className="phero-nodo">
                        <ListChecks size={16} />
                    </span>
                    <span className="phero-tramo" />
                    <div className="phero-tarjeta">
                        <p className="phero-paso-cabeza">
                            <span className="phero-paso-nombre">2 · Perfila</span>
                            {/* El número lo pinta CSS (cuenta de 0 a 4 con las respuestas). */}
                            <span className="phero-tarjeta-meta">
                                <span className="phero-cuenta" /> de {PERFILAMIENTO.length} datos
                            </span>
                        </p>
                        <span className="phero-avance">
                            <span />
                        </span>
                        <ul className="phero-preguntas">
                            {PERFILAMIENTO.map(({ pregunta, respuesta }, i) => (
                                <li key={pregunta} style={{ '--i': i } as React.CSSProperties}>
                                    <span className="phero-pregunta">{pregunta}</span>
                                    <span className="phero-respuesta">
                                        <Check size={12} />
                                        {respuesta}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>

                <li className="phero-paso">
                    <span className="phero-nodo">
                        <Flame size={16} />
                    </span>
                    <span className="phero-tramo" />
                    <div className="phero-tarjeta phero-tarjeta--fila">
                        <span className="phero-paso-nombre">3 · Califica</span>
                        <span className="phero-prioridad">
                            <Flame size={13} />
                            Prioridad alta
                        </span>
                        <span className="phero-tarjeta-meta phero-motivo">Pago definido · plazo corto</span>
                    </div>
                </li>

                <li className="phero-paso">
                    <span className="phero-nodo">
                        <FileText size={16} />
                    </span>
                    <span className="phero-tramo" />
                    <div className="phero-tarjeta phero-tarjeta--fila">
                        <span className="phero-paso-nombre">4 · Recomienda</span>
                        <span className="phero-dato">Modelo de 3 recámaras</span>
                        <span className="phero-archivo">
                            <FileText size={12} />
                            Brochure
                        </span>
                    </div>
                </li>

                <li className="phero-paso phero-paso--final">
                    <span className="phero-nodo">
                        <UserCheck size={16} />
                    </span>
                    <div className="phero-tarjeta">
                        <p className="phero-paso-cabeza">
                            <span className="phero-paso-nombre">5 · Asigna</span>
                            <span className="phero-tarjeta-meta">Rotación automática</span>
                        </p>
                        <p className="phero-asignado-titulo">
                            Andrea
                            <span className="phero-flecha">
                                <ArrowRight size={16} />
                            </span>
                            <span className="phero-asesor">Carlos</span>
                        </p>
                        <p className="phero-tarjeta-meta">Recibe resumen y perfil antes de escribirle</p>
                    </div>
                </li>
            </ol>

            <p className="phero-nota">Ejemplo ilustrativo</p>
        </div>
    );
};

/**
 * Animación de entrada de los bloques al hacer scroll. Igual que en App.tsx: un
 * solo IntersectionObserver y clases en el DOM. Lo que ya está en pantalla al
 * cargar no se esconde, y con movimiento reducido no se anima nada.
 */
const useRevelar = () => {
    useEffect(() => {
        const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (sinMovimiento || !('IntersectionObserver' in window)) return;

        const pendientes = [...document.querySelectorAll<HTMLElement>('.portero-revelar')].filter(
            (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9,
        );
        if (pendientes.length === 0) return;

        const observador = new IntersectionObserver(
            (entradas) => {
                for (const entrada of entradas) {
                    if (!entrada.isIntersecting) continue;
                    entrada.target.classList.remove('is-pendiente');
                    observador.unobserve(entrada.target);
                }
            },
            // Sin umbral por porcentaje: un bloque más alto que la pantalla
            // nunca llegaría a mostrar el 30 %.
            { threshold: 0, rootMargin: '0px 0px -12% 0px' },
        );
        for (const el of pendientes) {
            el.classList.add('is-pendiente');
            observador.observe(el);
        }
        return () => observador.disconnect();
    }, []);
};

const Portero = () => {
    useRevelar();

    return (
        <div className="portero-page">
            <header className="portero-header">
                <div className="container portero-header-inner">
                    <a href="/" className="portero-logo">
                        <img src={vireonLogo} alt="" className="portero-logo-img" width={32} height={32} />
                        <span>Vireon</span>
                    </a>
                    <a href="/" className="portero-volver">
                        <ArrowLeft size={16} aria-hidden="true" />
                        Volver al inicio
                    </a>
                </div>
            </header>

            <main>
                {/* 1 · Hero */}
                <section className="portero-hero" aria-labelledby="portero-titulo">
                    <div className="portero-fondo portero-fondo--hero" aria-hidden="true" />
                    <div className="container portero-hero-inner">
                        <div className="portero-hero-copy">
                            <p className="portero-eyebrow">
                                <a href="/#soluciones">Vireon Solutions</a>
                            </p>
                            <p className="portero-etiqueta">
                                <span className="portero-etiqueta-pulso" aria-hidden="true" />
                                <span>Inmobiliarias y desarrolladoras</span>
                                <span aria-hidden="true">·</span>
                                <span className="portero-estado">Próximamente</span>
                            </p>
                            <h1 id="portero-titulo" className="portero-titulo">
                                <span className="portero-acento">Portero:</span> ningún prospecto se queda sin
                                respuesta
                            </h1>
                            <p className="portero-frase">
                                Un agente de IA que atiende, perfila y asigna cada prospecto de tus desarrollos por
                                WhatsApp. Sin teléfono compartido. Sin Excel a mano.
                            </p>
                            <BotonLista />
                            <p className="portero-origen">
                                <Sparkles size={16} aria-hidden="true" />
                                Nace de un sistema que ya opera con nuestro primer cliente, una desarrolladora
                                inmobiliaria.
                            </p>
                        </div>

                        <VisualHero />
                    </div>

                    <div className="container">
                        <ul role="list" className="portero-datos">
                            {DATOS.map(({ valor, texto }) => (
                                <li key={valor}>
                                    <strong>{valor}</strong>
                                    <span>{texto}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 2 · De dónde a dónde */}
                <section className="portero-seccion" aria-labelledby="portero-cambio-titulo">
                    <div className="container">
                        <div className="portero-encabezado portero-revelar">
                            <Kicker>El cambio</Kicker>
                            <h2 id="portero-cambio-titulo" className="portero-h2">
                                De dónde <span className="portero-acento">a dónde</span>
                            </h2>
                            <p className="portero-texto">
                                Así se atiende a los prospectos en muchas desarrolladoras hoy, y así cambia con
                                Portero.
                            </p>
                        </div>
                        <div className="portero-comparativo portero-revelar">
                            <div className="portero-columna portero-columna--hoy">
                                <div className="portero-columna-cabeza">
                                    <span className="portero-columna-icono" aria-hidden="true">
                                        <FileSpreadsheet size={20} />
                                    </span>
                                    <div>
                                        <h3>Hoy</h3>
                                        <p>Manual, disperso y sin visibilidad</p>
                                    </div>
                                </div>
                                <ul role="list">
                                    {HOY.map((texto) => (
                                        <li key={texto}>
                                            <X size={18} aria-hidden="true" />
                                            {texto}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <span className="portero-comparativo-flecha" aria-hidden="true">
                                <ArrowRight size={22} />
                            </span>

                            <div className="portero-columna portero-columna--portero">
                                <div className="portero-columna-cabeza">
                                    <span className="portero-columna-icono" aria-hidden="true">
                                        <Sparkles size={20} />
                                    </span>
                                    <div>
                                        <h3>Con Portero</h3>
                                        <p>Automático, ordenado y medible</p>
                                    </div>
                                </div>
                                <ul role="list">
                                    {CON_PORTERO.map((texto) => (
                                        <li key={texto}>
                                            <Check size={18} aria-hidden="true" />
                                            {texto}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3 · Así se ve en la práctica */}
                <section className="portero-seccion portero-seccion--malla" aria-labelledby="portero-practica-titulo">
                    <div className="portero-fondo portero-fondo--puntos" aria-hidden="true" />
                    <div className="container">
                        <div className="portero-encabezado portero-revelar">
                            <Kicker>En acción</Kicker>
                            <h2 id="portero-practica-titulo" className="portero-h2">
                                Así se ve <span className="portero-acento">en la práctica</span>
                            </h2>
                            <p className="portero-texto">
                                Domingo, 9:42 de la noche: Andrea escribe por un anuncio. En este ejemplo, en
                                tres minutos ya tiene respuesta, recomendación, brochure y asesor. Y el asesor ya
                                tiene su perfil.
                            </p>
                        </div>
                        <PorteroConversacion />
                    </div>
                </section>

                {/* 4 · Vista previa del tablero */}
                <section className="portero-seccion portero-seccion--reticula" aria-labelledby="portero-tablero-titulo">
                    <div className="portero-fondo portero-fondo--reticula" aria-hidden="true" />
                    <div className="container portero-medio">
                        <div className="portero-encabezado portero-revelar">
                            <Kicker>Vista previa del tablero</Kicker>
                            <h2 id="portero-tablero-titulo" className="portero-h2">
                                La dirección deja de preguntar cómo va el mes.{' '}
                                <span className="portero-acento">Lo ve.</span>
                            </h2>
                            <p className="portero-texto">
                                Captación, embudo, prioridades y carga por asesor, desde el portal y sin pedirle
                                reportes a nadie.
                            </p>
                        </div>
                        <div className="portero-revelar">
                            <PorteroTablero />
                        </div>
                    </div>
                </section>

                {/* 5 · Beneficios */}
                <section className="portero-seccion portero-seccion--malla" aria-labelledby="portero-beneficios-titulo">
                    <div className="container">
                        <div className="portero-encabezado portero-revelar">
                            <Kicker>Beneficios</Kicker>
                            <h2 id="portero-beneficios-titulo" className="portero-h2">
                                Lo que gana <span className="portero-acento">tu equipo</span>
                            </h2>
                        </div>
                        <ul role="list" className="portero-beneficios portero-revelar">
                            {BENEFICIOS.map(({ icono: Icono, titulo, texto }) => (
                                <li key={titulo} className="portero-beneficio">
                                    <span className="portero-beneficio-icono" aria-hidden="true">
                                        <Icono size={22} />
                                    </span>
                                    <h3>{titulo}</h3>
                                    <p>{texto}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 6 · Hecho a la medida */}
                <section className="portero-seccion" aria-labelledby="portero-medida-titulo">
                    <div className="container portero-medida">
                        <div className="portero-revelar">
                            <Kicker>A tu medida</Kicker>
                            <h2 id="portero-medida-titulo" className="portero-h2">
                                Hecho a la medida de{' '}
                                <span className="portero-acento">cada desarrolladora</span>
                            </h2>
                            <p className="portero-texto">
                                Portero no es un bot genérico. Lo configuramos contigo al arrancar y después tu
                                empresa lo administra desde su portal web, sin depender de nosotros para el día a
                                día.
                            </p>
                        </div>

                        <div className="portero-portal portero-revelar">
                            <div className="portero-portal-barra" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                                <p>Portal · Configuración del agente</p>
                            </div>
                            <p id="portero-medida-lista" className="portero-medida-titulo">
                                Cada empresa define
                            </p>
                            <ul role="list" aria-labelledby="portero-medida-lista">
                                {A_LA_MEDIDA.map(({ icono: Icono, texto }) => (
                                    <li key={texto}>
                                        <span className="portero-medida-icono" aria-hidden="true">
                                            <Icono size={18} />
                                        </span>
                                        <span className="portero-medida-texto">{texto}</span>
                                        <CircleCheck size={20} className="portero-medida-check" aria-hidden="true" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Prueba de que funciona (oculta por defecto) */}
                <PruebaPortero />

                {/* 7 · Cierre y lista de espera */}
                <section
                    id="lista-de-espera"
                    className="portero-seccion portero-final"
                    aria-labelledby="portero-lista-titulo"
                >
                    <div className="portero-fondo portero-fondo--final" aria-hidden="true" />
                    <div className="container portero-angosto">
                        <p className="portero-lema portero-revelar">
                            Cada proceso puede ser más simple, cada decisión más inteligente y{' '}
                            <span className="portero-acento">cada día más productivo.</span>
                        </p>
                        <div className="portero-lista">
                            {/* VALIDAR: encabezado e introducción del formulario. */}
                            <h2 id="portero-lista-titulo" className="portero-h2">Únete a la lista de espera</h2>
                            <p className="portero-texto">
                                Déjanos tus datos para sumarte a la lista de espera de Portero.
                            </p>
                            <ListaDeEspera />
                        </div>
                        <p className="portero-cierre">
                            <a href="/#final-cta">¿Tienes un caso específico? Escríbenos</a>
                        </p>
                    </div>
                </section>
            </main>

            <footer className="portero-footer">
                <div className="container portero-footer-inner">
                    <p>© {new Date().getFullYear()} Vireon. Todos los derechos reservados.</p>
                    <a href="/aviso-de-privacidad/">Aviso de Privacidad</a>
                </div>
            </footer>
        </div>
    );
};

export default Portero;
