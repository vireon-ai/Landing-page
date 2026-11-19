import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import vireonLogo from '../assets/vireon-logo.png';
// Mismo diseño que el aviso de privacidad: las dos son páginas legales largas y
// conviene que se lean igual. Las clases `aviso-*` viven en esa hoja.
import './AvisoPrivacidad.css';

/**
 * Términos y Condiciones del Servicio de Vireon y de Portero.
 *
 * El texto legal vive también en `docs/legal/terminos-del-servicio.md`, que es la
 * fuente. Si cambian los términos, cambia primero ese archivo y sube la fecha y
 * la versión en los dos lugares.
 *
 * Es una entrada aparte del build (`terminos-del-servicio/index.html`) por la
 * misma razón que el aviso: Meta pide la URL de las condiciones del servicio en
 * el alta como Tech Provider, y tiene que abrir directo, sin ruteo del cliente.
 */

const CORREO = 'vireonconsultores@gmail.com';
const WHATSAPP_DISPLAY = '+52 442 613 7768';
const WHATSAPP_LINK = 'https://wa.me/524426137768';
const ACTUALIZADO = '19 de noviembre de 2026';
const VERSION = '1.0';

const EXTERNA = { target: '_blank', rel: 'noopener noreferrer' } as const;

const SECCIONES = [
    { id: 'prestador', titulo: 'Quién presta el servicio' },
    { id: 'aceptacion', titulo: 'Aceptación' },
    { id: 'servicios', titulo: 'Descripción de los Servicios' },
    { id: 'cuenta', titulo: 'Cuenta de WhatsApp Business del cliente' },
    { id: 'obligaciones', titulo: 'Obligaciones del cliente' },
    { id: 'ia', titulo: 'Agentes con inteligencia artificial' },
    { id: 'precios', titulo: 'Precios, pagos y cargos de Meta' },
    { id: 'datos', titulo: 'Datos personales y confidencialidad' },
    { id: 'propiedad', titulo: 'Propiedad intelectual' },
    { id: 'responsabilidad', titulo: 'Disponibilidad y limitación de responsabilidad' },
    { id: 'terminacion', titulo: 'Vigencia y terminación' },
    { id: 'cambios', titulo: 'Cambios a estos términos' },
    { id: 'jurisdiccion', titulo: 'Ley aplicable y jurisdicción' },
    { id: 'contacto', titulo: 'Contacto' },
];

const TerminosServicio = () => {
    return (
        <div className="aviso-page">
            <header className="aviso-header">
                <div className="container aviso-header-inner">
                    <a href="/" className="aviso-logo">
                        <img src={vireonLogo} alt="" className="aviso-logo-img" />
                        <span>Vireon</span>
                    </a>
                    <a href="/" className="aviso-volver">
                        <ArrowLeft size={16} aria-hidden="true" />
                        Volver al inicio
                    </a>
                </div>
            </header>

            <main className="aviso-main">
                <div className="container aviso-container">
                    <div className="aviso-intro">
                        <p className="aviso-eyebrow">Documento legal</p>
                        <h1 className="aviso-title">Términos y Condiciones del Servicio</h1>
                        <p className="aviso-meta">
                            Última actualización: {ACTUALIZADO} · Versión {VERSION}
                        </p>
                        <p className="aviso-lead">
                            Estas son las condiciones con las que Vireon presta sus servicios,
                            incluido Portero, su agente de WhatsApp para inmobiliarias: qué hacemos
                            con la cuenta de WhatsApp Business que nos conecta, qué le toca a cada
                            parte y cómo se termina la relación.
                        </p>
                    </div>

                    <nav className="aviso-toc" aria-label="Contenido de los términos">
                        <h2 className="aviso-toc-title">Contenido</h2>
                        <ol className="aviso-toc-list">
                            {SECCIONES.map((seccion) => (
                                <li key={seccion.id}>
                                    <a href={`#${seccion.id}`}>{seccion.titulo}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <article className="aviso-cuerpo">
                        <section id="prestador">
                            <h2>1. Quién presta el servicio</h2>
                            <p>
                                Vireon es una marca operada por{' '}
                                <strong>Juan Manuel González Ascencio</strong>, persona física con
                                actividad empresarial, con domicilio en León, Guanajuato, México. En
                                estos términos, «Vireon», «nosotros» o «nuestro» se refiere a esa marca
                                y a la persona que la opera.
                            </p>
                            <p>
                                Contacto: <a href={`mailto:${CORREO}`}>{CORREO}</a> ·{' '}
                                <a href={WHATSAPP_LINK} {...EXTERNA}>
                                    {WHATSAPP_DISPLAY}
                                </a>{' '}
                                · <a href="https://www.vireonai.com.mx">www.vireonai.com.mx</a>
                            </p>
                        </section>

                        <section id="aceptacion">
                            <h2>2. Aceptación</h2>
                            <p>
                                Estos términos regulan el uso del sitio web{' '}
                                <a href="https://www.vireonai.com.mx">www.vireonai.com.mx</a> y de los
                                servicios y herramientas de Vireon, incluido <strong>Portero</strong>,
                                el agente de WhatsApp para inmobiliarias, y su portal web (en conjunto,
                                los «Servicios»).
                            </p>
                            <p>
                                Al usar el sitio, contratar los Servicios o conectar una cuenta de
                                WhatsApp Business a través de Vireon, usted acepta estos términos. Si
                                actúa en nombre de una empresa, declara que tiene facultades para
                                obligarla. Si no está de acuerdo, no utilice los Servicios.
                            </p>
                            <p>
                                Cuando exista un contrato, propuesta o cotización firmada entre usted y
                                Vireon, sus condiciones prevalecen sobre estos términos en lo que se
                                contradigan.
                            </p>
                        </section>

                        <section id="servicios">
                            <h2>3. Descripción de los Servicios</h2>
                            <p>
                                Vireon ofrece consultoría, automatización de procesos y agentes
                                conversacionales con inteligencia artificial. En el caso de Portero y de
                                los agentes de WhatsApp, Vireon:
                            </p>
                            <ul>
                                <li>
                                    Conecta la cuenta de WhatsApp Business del cliente a nuestra
                                    plataforma mediante el registro integrado (Embedded Signup) de Meta.
                                </li>
                                <li>
                                    Envía y recibe mensajes de WhatsApp en nombre del cliente a través de
                                    la Plataforma de WhatsApp Business (Cloud API) de Meta.
                                </li>
                                <li>
                                    Administra en nombre del cliente sus plantillas de mensajes, números
                                    de teléfono y configuración de la cuenta de WhatsApp Business.
                                </li>
                                <li>
                                    Ofrece un portal web para dar seguimiento a conversaciones,
                                    prospectos y métricas.
                                </li>
                            </ul>
                            <p>
                                Vireon actúa como <strong>proveedor de tecnología</strong> de Meta. No es
                                propietario de WhatsApp ni de la Plataforma de WhatsApp Business, y no
                                controla su disponibilidad.
                            </p>
                        </section>

                        <section id="cuenta">
                            <h2>4. Cuenta de WhatsApp Business del cliente</h2>
                            <ul>
                                <li>
                                    La cuenta de WhatsApp Business (WABA), el número de teléfono y el
                                    portfolio comercial de Meta conectados a Vireon{' '}
                                    <strong>son propiedad del cliente</strong> y permanecen en su
                                    portfolio comercial.
                                </li>
                                <li>
                                    El cliente autoriza a Vireon a acceder a esos recursos y a operarlos
                                    únicamente para prestar los Servicios contratados.
                                </li>
                                <li>
                                    El cliente puede retirar ese acceso en cualquier momento desde la
                                    configuración de su portfolio comercial en Meta Business Suite o
                                    solicitándolo a Vireon. Retirar el acceso detiene los Servicios que
                                    dependen de él.
                                </li>
                                <li>
                                    El cliente es responsable de mantener la seguridad de su cuenta de
                                    Meta y de los usuarios que tienen acceso a ella.
                                </li>
                            </ul>
                        </section>

                        <section id="obligaciones">
                            <h2>5. Obligaciones del cliente</h2>
                            <p>Al usar los Servicios, el cliente se obliga a:</p>
                            <ul>
                                <li>
                                    Cumplir las{' '}
                                    <a href="https://business.whatsapp.com/policy" {...EXTERNA}>
                                        Políticas de WhatsApp Business
                                    </a>
                                    , la{' '}
                                    <a href="https://www.whatsapp.com/legal/commerce-policy" {...EXTERNA}>
                                        Política de Comercio de WhatsApp
                                    </a>
                                    , las{' '}
                                    <a href="https://www.whatsapp.com/legal/business-terms" {...EXTERNA}>
                                        Condiciones del Servicio de WhatsApp Business
                                    </a>{' '}
                                    y las demás condiciones de Meta que resulten aplicables.
                                </li>
                                <li>
                                    Obtener el consentimiento (opt-in) de las personas antes de iniciar
                                    conversaciones con ellas por WhatsApp, y respetar de inmediato las
                                    solicitudes de baja.
                                </li>
                                <li>
                                    Contar con un aviso de privacidad propio y con una base legal válida
                                    para tratar los datos personales de sus prospectos y clientes,
                                    conforme a la Ley Federal de Protección de Datos Personales en
                                    Posesión de los Particulares y demás leyes aplicables.
                                </li>
                                <li>
                                    Proporcionar información veraz sobre su negocio, sus productos y sus
                                    precios para configurar al agente, y mantenerla actualizada.
                                </li>
                                <li>
                                    No usar los Servicios para enviar spam, contenido ilegal, engañoso,
                                    ofensivo o que infrinja derechos de terceros, ni para comercializar
                                    productos o servicios prohibidos por Meta.
                                </li>
                            </ul>
                            <p>
                                Vireon puede suspender los Servicios si detecta un uso que ponga en
                                riesgo la cuenta del cliente, la plataforma de Vireon o el cumplimiento
                                de las políticas de Meta.
                            </p>
                        </section>

                        <section id="ia">
                            <h2>6. Agentes con inteligencia artificial</h2>
                            <p>
                                Los agentes de Vireon generan respuestas automáticas con modelos de
                                inteligencia artificial de terceros (como Google Gemini y Anthropic
                                Claude). Aunque los configuramos con la información y el tono del
                                cliente, sus respuestas pueden contener errores u omisiones. El cliente
                                es responsable de revisar la información que le proporciona al agente y
                                de no basar decisiones críticas únicamente en sus respuestas.
                            </p>
                        </section>

                        <section id="precios">
                            <h2>7. Precios, pagos y cargos de Meta</h2>
                            <ul>
                                <li>
                                    Los precios de los Servicios de Vireon se establecen en la cotización
                                    o propuesta correspondiente.
                                </li>
                                <li>
                                    <strong>
                                        Los cargos por mensajes de WhatsApp los cobra Meta directamente al
                                        cliente
                                    </strong>
                                    , mediante el método de pago que el cliente registre en su cuenta de
                                    WhatsApp Business, salvo que se acuerde otra cosa por escrito.
                                </li>
                                <li>Los precios no incluyen impuestos, salvo que se indique lo contrario.</li>
                            </ul>
                        </section>

                        <section id="datos">
                            <h2>8. Datos personales y confidencialidad</h2>
                            <ul>
                                <li>
                                    El tratamiento de los datos personales que Vireon recaba
                                    directamente se rige por nuestro{' '}
                                    <a href="/aviso-de-privacidad/">Aviso de Privacidad</a>.
                                </li>
                                <li>
                                    Respecto de los datos de los prospectos y clientes del cliente,{' '}
                                    <strong>el cliente es el responsable</strong> y Vireon actúa como
                                    encargado: los trata solo para prestar los Servicios, bajo las
                                    instrucciones del cliente y con medidas de seguridad razonables.
                                </li>
                                <li>Vireon no vende los datos ni los usa para publicidad.</li>
                                <li>
                                    Cada parte mantendrá confidencial la información no pública que
                                    reciba de la otra.
                                </li>
                            </ul>
                            <p>
                                Para solicitar la eliminación de datos, consulte la sección{' '}
                                <a href="/aviso-de-privacidad/#eliminacion">
                                    «Eliminación de sus datos»
                                </a>{' '}
                                del Aviso de Privacidad o escriba a{' '}
                                <a href={`mailto:${CORREO}?subject=Eliminaci%C3%B3n%20de%20datos`}>
                                    {CORREO}
                                </a>{' '}
                                con el asunto «Eliminación de datos».
                            </p>
                        </section>

                        <section id="propiedad">
                            <h2>9. Propiedad intelectual</h2>
                            <p>
                                La plataforma de Vireon, Portero, su portal, su código, sus flujos y la
                                marca Vireon son propiedad de su titular. El cliente conserva la
                                propiedad de su información, su contenido y su marca. Ninguna de las
                                partes adquiere derechos sobre la propiedad intelectual de la otra,
                                salvo la licencia de uso necesaria para prestar o recibir los Servicios.
                            </p>
                        </section>

                        <section id="responsabilidad">
                            <h2>10. Disponibilidad y limitación de responsabilidad</h2>
                            <ul>
                                <li>
                                    Los Servicios dependen de terceros, como Meta, los proveedores de
                                    inteligencia artificial y los de hospedaje. Vireon no garantiza que
                                    funcionen sin interrupciones ni errores, y no es responsable de
                                    caídas, cambios de políticas, restricciones o bloqueos impuestos por
                                    esos terceros.
                                </li>
                                <li>
                                    En la medida que permita la ley, la responsabilidad total de Vireon
                                    frente al cliente se limita al monto que el cliente haya pagado a
                                    Vireon por los Servicios durante los tres meses anteriores al hecho
                                    que la origine.
                                </li>
                                <li>
                                    Vireon no es responsable por pérdidas indirectas, lucro cesante ni
                                    por el contenido de los mensajes que el cliente o sus usuarios
                                    envíen.
                                </li>
                            </ul>
                        </section>

                        <section id="terminacion">
                            <h2>11. Vigencia y terminación</h2>
                            <p>
                                El cliente puede dejar de usar los Servicios en cualquier momento, en los
                                términos de su contrato o cotización. Vireon puede terminarlos o
                                suspenderlos si el cliente incumple estos términos o las políticas de
                                Meta. Al terminar, Vireon dejará de acceder a la cuenta de WhatsApp
                                Business del cliente y, a solicitud de este, eliminará o le entregará sus
                                datos, salvo los que una obligación legal exija conservar.
                            </p>
                        </section>

                        <section id="cambios">
                            <h2>12. Cambios a estos términos</h2>
                            <p>
                                Vireon puede actualizar estos términos. La versión vigente estará
                                publicada en{' '}
                                <a href="https://www.vireonai.com.mx/terminos-del-servicio/">
                                    www.vireonai.com.mx/terminos-del-servicio
                                </a>{' '}
                                con su fecha de última actualización. Cuando un cambio sea sustancial,
                                lo comunicaremos a los clientes por correo electrónico o por WhatsApp.
                            </p>
                        </section>

                        <section id="jurisdiccion">
                            <h2>13. Ley aplicable y jurisdicción</h2>
                            <p>
                                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
                                Para cualquier controversia, las partes se someten a los tribunales
                                competentes de León, Guanajuato, y renuncian a cualquier otro fuero que
                                pudiera corresponderles.
                            </p>
                        </section>

                        <section id="contacto">
                            <h2>14. Contacto</h2>
                            <div className="aviso-contacto">
                                <p className="aviso-contacto-nombre">
                                    Juan Manuel González Ascencio
                                    <span>
                                        Persona física con actividad empresarial, que opera la marca Vireon
                                    </span>
                                </p>
                                <ul className="aviso-contacto-lista">
                                    <li>
                                        <Mail size={18} aria-hidden="true" />
                                        <a href={`mailto:${CORREO}`}>{CORREO}</a>
                                    </li>
                                    <li>
                                        <MessageCircle size={18} aria-hidden="true" />
                                        <a href={WHATSAPP_LINK} {...EXTERNA}>
                                            {WHATSAPP_DISPLAY}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </article>
                </div>
            </main>

            <footer className="aviso-footer">
                <div className="container aviso-footer-inner">
                    <p>© {new Date().getFullYear()} Vireon. Todos los derechos reservados.</p>
                    <a href="/aviso-de-privacidad/">Aviso de Privacidad</a>
                    <a href="/">Volver al inicio</a>
                </div>
            </footer>
        </div>
    );
};

export default TerminosServicio;
