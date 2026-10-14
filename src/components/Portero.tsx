import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AlertTriangle, ArrowDown, ArrowLeft, Check, LayoutDashboard, MessageCircle, MessagesSquare } from 'lucide-react';
import vireonLogo from '../assets/vireon-logo.png';
import { CORREO_CONTACTO } from '../config';
import { enviarConReintentos, guardarPendiente, reintentarPendientes, type Lead } from '../leads';
import './Portero.css';

/**
 * Página de Portero, la primera de Vireon Solutions. Vive en
 * `/soluciones/portero/` como entrada aparte del build (igual que el aviso de
 * privacidad), sin ruteo del lado del cliente.
 *
 * Portero todavía no está a la venta: la página se promociona como
 * "Próximamente" con lista de espera. Restricciones del brief: sin fechas de
 * lanzamiento, sin decir que Vireon es Tech Provider ni partner de Meta, sin
 * métricas ni testimonios inventados.
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
            return datos.empresa.trim() ? undefined : 'Escribe el nombre de tu empresa o inmobiliaria.';
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
                    <label htmlFor="portero-empresa">Empresa o inmobiliaria *</label>
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
                <label htmlFor="portero-leads">Leads aproximados al mes *</label>
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

const PASOS = [
    { icono: MessageCircle, texto: 'El prospecto escribe por WhatsApp.' },
    { icono: MessagesSquare, texto: 'Portero responde y da seguimiento con la información de tu inmobiliaria.' },
    { icono: LayoutDashboard, texto: 'Tu equipo ve las conversaciones y los leads en el portal web.' },
];

const Portero = () => {
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
                    <div className="container portero-angosto">
                        <p className="portero-eyebrow">
                            <a href="/#soluciones">Vireon Solutions</a>
                        </p>
                        <p className="portero-etiqueta">
                            <span>Inmobiliarias</span>
                            <span aria-hidden="true">·</span>
                            <span className="portero-estado">Próximamente</span>
                        </p>
                        <h1 id="portero-titulo" className="portero-titulo">Portero</h1>
                        <p className="portero-frase">
                            El agente de WhatsApp que atiende a tus leads inmobiliarios al instante.
                        </p>
                        <a href="#lista-de-espera" className="btn btn-primary portero-boton">
                            Unirme a la lista de espera
                            <ArrowDown size={18} aria-hidden="true" />
                        </a>
                    </div>
                </section>

                {/* 2 · El problema */}
                <section className="portero-seccion" aria-labelledby="portero-problema-titulo">
                    <div className="container portero-angosto">
                        {/* VALIDAR: encabezado de la sección (el brief no lo trae). */}
                        <h2 id="portero-problema-titulo" className="portero-h2">El problema</h2>
                        <p className="portero-destacado">
                            Los leads inmobiliarios se enfrían cuando la primera respuesta tarda.
                        </p>
                        <p className="portero-texto">
                            Portero responde de inmediato y el equipo humano entra con el prospecto ya atendido.
                        </p>
                    </div>
                </section>

                {/* 3 · Cómo funciona */}
                <section className="portero-seccion portero-seccion--alterna" aria-labelledby="portero-pasos-titulo">
                    <div className="container">
                        <h2 id="portero-pasos-titulo" className="portero-h2 text-center">Cómo funciona</h2>
                        <ol className="portero-pasos">
                            {PASOS.map(({ icono: Icono, texto }, i) => (
                                <li key={texto} className="portero-paso">
                                    <span className="portero-paso-num" aria-hidden="true">{i + 1}</span>
                                    <span className="portero-paso-icono" aria-hidden="true">
                                        <Icono size={22} />
                                    </span>
                                    <p>{texto}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* 4 · Prueba de que funciona (oculta por defecto) */}
                <PruebaPortero />

                {/* 5 · Lista de espera */}
                <section id="lista-de-espera" className="portero-seccion" aria-labelledby="portero-lista-titulo">
                    <div className="container portero-angosto">
                        <div className="portero-lista">
                            {/* VALIDAR: encabezado e introducción del formulario. */}
                            <h2 id="portero-lista-titulo" className="portero-h2">Lista de espera</h2>
                            <p className="portero-texto">
                                Déjanos tus datos para sumarte a la lista de espera de Portero.
                            </p>
                            <ListaDeEspera />
                        </div>
                    </div>
                </section>

                {/* 6 · Cierre */}
                <section className="portero-cierre" aria-label="Contacto">
                    <div className="container">
                        <p>
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
