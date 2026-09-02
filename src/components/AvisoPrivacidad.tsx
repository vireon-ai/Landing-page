import { ArrowLeft, Mail, MapPin, MessageCircle } from 'lucide-react';
import vireonLogo from '../assets/vireon-logo.png';
import './AvisoPrivacidad.css';

/**
 * Aviso de privacidad de Vireon.
 *
 * El texto legal vive también en `docs/legal/aviso-de-privacidad.md`, que es la
 * fuente. Si cambia el aviso, cambia primero ese archivo y sube la fecha de
 * última actualización en los dos lugares.
 *
 * Esta página es una entrada aparte del build (`aviso-de-privacidad/index.html`)
 * para que la URL sea un archivo real en el servidor y no dependa de ruteo del
 * lado del cliente: Meta exige que el aviso viva en una dirección pública,
 * permanente y sin inicio de sesión.
 */

const CORREO = 'vireonconsultores@gmail.com';
const WHATSAPP_DISPLAY = '+52 477 908 6863';
const WHATSAPP_LINK = 'https://wa.me/524779086863';
const ACTUALIZADO = '2 de septiembre de 2026';

const SECCIONES = [
    { id: 'responsable', titulo: 'Identidad y domicilio del responsable' },
    { id: 'alcance', titulo: 'Alcance de este aviso' },
    { id: 'datos', titulo: 'Datos personales que recopilamos' },
    { id: 'finalidades', titulo: 'Finalidades del tratamiento' },
    { id: 'consentimiento', titulo: 'Consentimiento' },
    { id: 'whatsapp', titulo: 'Uso de la Plataforma de WhatsApp Business de Meta' },
    { id: 'encargados', titulo: 'Encargados y transferencias' },
    { id: 'limitar', titulo: 'Medios para limitar el uso o la divulgación de sus datos' },
    { id: 'conservacion', titulo: 'Conservación de los datos' },
    { id: 'seguridad', titulo: 'Seguridad de la información' },
    { id: 'arco', titulo: 'Sus derechos ARCO' },
    { id: 'eliminacion', titulo: 'Eliminación de sus datos' },
    { id: 'cookies', titulo: 'Cookies y tecnologías de seguimiento' },
    { id: 'menores', titulo: 'Menores de edad' },
    { id: 'cambios', titulo: 'Cambios a este aviso de privacidad' },
    { id: 'autoridad', titulo: 'Autoridad competente' },
    { id: 'contacto', titulo: 'Contacto' },
];

const AvisoPrivacidad = () => {
    return (
        <div className="aviso-page">
            <header className="aviso-header">
                <div className="container aviso-header-inner">
                    <a href="/" className="aviso-logo">
                        <img src={vireonLogo} alt="" className="aviso-logo-img" />
                        <span>Vireon</span>
                    </a>
                    <a href="/" className="aviso-volver">
                        <ArrowLeft size={16} />
                        Volver al inicio
                    </a>
                </div>
            </header>

            <main className="aviso-main">
                <div className="container aviso-container">
                    <div className="aviso-intro">
                        <p className="aviso-eyebrow">Documento legal</p>
                        <h1 className="aviso-title">Aviso de Privacidad</h1>
                        <p className="aviso-meta">
                            Última actualización: {ACTUALIZADO} · Versión 1.0
                        </p>
                        <p className="aviso-lead">
                            Este documento explica qué datos personales recaba Vireon a través de su
                            sitio web y de su canal de WhatsApp, para qué los usa, con quién los
                            comparte y cómo puede usted ejercer sus derechos sobre ellos.
                        </p>
                    </div>

                    <nav className="aviso-toc" aria-label="Contenido del aviso">
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
                        <section id="responsable">
                            <h2>1. Identidad y domicilio del responsable</h2>
                            <p>
                                Juan Manuel González Ascencio, en adelante «Vireon», con domicilio en
                                Picacho 112, Jardines del Moral, León, Guanajuato, C.P. 37160, México,
                                es el responsable del tratamiento de los datos personales que usted nos
                                proporciona, conforme a la Ley Federal de Protección de Datos Personales
                                en Posesión de los Particulares (LFPDPPP) vigente en México.
                            </p>
                            <p>Datos de contacto para asuntos de privacidad:</p>
                            <ul>
                                <li>
                                    Correo electrónico: <a href={`mailto:${CORREO}`}>{CORREO}</a>
                                </li>
                                <li>
                                    Sitio web:{' '}
                                    <a href="https://www.vireonai.com.mx">www.vireonai.com.mx</a>
                                </li>
                                <li>WhatsApp oficial: 477 908 6863, 477 720 2176, 442 438 4231</li>
                            </ul>
                        </section>

                        <section id="alcance">
                            <h2>2. Alcance de este aviso</h2>
                            <p>
                                Este aviso aplica a los datos personales que Vireon recaba a través de
                                dos canales:
                            </p>
                            <ul>
                                <li>
                                    El sitio web{' '}
                                    <a href="https://www.vireonai.com.mx">www.vireonai.com.mx</a>,
                                    incluidos su formulario de contacto y su test de madurez.
                                </li>
                                <li>
                                    El canal de WhatsApp de Vireon, operado mediante la Plataforma de
                                    WhatsApp Business de Meta.
                                </li>
                            </ul>
                            <p>
                                Este aviso no cubre el tratamiento de datos personales que Vireon
                                realiza por cuenta de sus clientes cuando desarrolla u opera
                                automatizaciones para ellos. En esos casos el responsable del
                                tratamiento es el cliente y aplica el aviso de privacidad de ese
                                cliente.
                            </p>
                        </section>

                        <section id="datos">
                            <h2>3. Datos personales que recopilamos</h2>
                            <h3>A través del sitio web</h3>
                            <ul>
                                <li>Nombre</li>
                                <li>Correo electrónico</li>
                                <li>Nombre de la empresa</li>
                            </ul>
                            <h3>A través de WhatsApp</h3>
                            <ul>
                                <li>Número de teléfono</li>
                                <li>Nombre de perfil de WhatsApp</li>
                                <li>
                                    Contenido de los mensajes que usted nos envía, incluidos texto y los
                                    archivos que decida compartir
                                </li>
                                <li>Fecha, hora y estado de entrega de los mensajes</li>
                            </ul>
                            <p>
                                Vireon no solicita datos personales sensibles, es decir, aquellos que
                                puedan revelar origen racial o étnico, estado de salud, información
                                genética, creencias religiosas, filosóficas o morales, afiliación
                                sindical, opiniones políticas o preferencia sexual. Le pedimos no
                                compartir este tipo de información por nuestros canales.
                            </p>
                        </section>

                        <section id="finalidades">
                            <h2>4. Finalidades del tratamiento</h2>
                            <h3>Finalidades necesarias</h3>
                            <p>
                                Son indispensables para atenderle y para cumplir la relación que exista
                                con usted:
                            </p>
                            <ul>
                                <li>Responder sus mensajes, dudas y solicitudes de información</li>
                                <li>
                                    Darle seguimiento comercial: cotizar, agendar reuniones y entregarle
                                    el resultado del test de madurez
                                </li>
                                <li>
                                    Prestar, dar soporte y dar mantenimiento a los servicios contratados
                                </li>
                                <li>Cumplir obligaciones legales, contables y fiscales aplicables</li>
                            </ul>
                            <h3>Finalidades que requieren su consentimiento</h3>
                            <p>
                                No son necesarias para atenderle y usted puede negarlas u oponerse a
                                ellas en cualquier momento, sin que eso afecte la prestación de los
                                servicios contratados:
                            </p>
                            <ul>
                                <li>
                                    Enviarle contenido, boletines, invitaciones a eventos y promociones
                                    de Vireon
                                </li>
                                <li>
                                    Elaborar estadísticas internas para mejorar nuestros servicios y
                                    nuestra comunicación
                                </li>
                            </ul>
                            <p>
                                Para negarse a estas finalidades, escriba a{' '}
                                <a href={`mailto:${CORREO}`}>{CORREO}</a>.
                            </p>
                        </section>

                        <section id="consentimiento">
                            <h2>5. Consentimiento</h2>
                            <p>
                                Al enviar el formulario del sitio web, al completar el test de madurez o
                                al iniciar una conversación por WhatsApp con Vireon, usted acepta este
                                aviso de privacidad y consiente el tratamiento de sus datos personales
                                para las finalidades descritas.
                            </p>
                            <p>
                                Vireon únicamente inicia conversaciones por WhatsApp con personas que
                                proporcionaron su número y aceptaron ser contactadas por ese medio.
                            </p>
                        </section>

                        <section id="whatsapp">
                            <h2>6. Uso de la Plataforma de WhatsApp Business de Meta</h2>
                            <p>
                                Nuestra atención por WhatsApp se opera con la Plataforma de WhatsApp
                                Business de Meta Platforms, Inc. y sus filiales. Al escribirnos por ese
                                canal, usted debe considerar lo siguiente:
                            </p>
                            <ul>
                                <li>
                                    Los mensajes viajan por la infraestructura de WhatsApp. Meta actúa
                                    como encargado y procesa los mensajes por cuenta e instrucción de
                                    Vireon.
                                </li>
                                <li>
                                    De acuerdo con la documentación de Meta, la Cloud API conserva los
                                    mensajes por un máximo de 30 días para la operación del servicio, por
                                    ejemplo para retransmisiones, y elimina los identificadores de
                                    usuario dentro de los 30 días posteriores a la última actualización
                                    de estado del mensaje.
                                </li>
                                <li>
                                    El uso de WhatsApp se rige además por los términos y el aviso de
                                    privacidad de WhatsApp, disponibles en{' '}
                                    <a
                                        href="https://www.whatsapp.com/legal/privacy-policy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        whatsapp.com/legal/privacy-policy
                                    </a>
                                    .
                                </li>
                                <li>
                                    Vireon no utiliza el contenido de sus conversaciones de WhatsApp para
                                    segmentar publicidad.
                                </li>
                            </ul>
                        </section>

                        <section id="encargados">
                            <h2>7. Encargados y transferencias</h2>
                            <p>
                                Vireon se apoya en proveedores tecnológicos que tratan datos personales
                                por su cuenta y bajo su instrucción:
                            </p>
                            <ul>
                                <li>Meta Platforms, Inc., para la mensajería por WhatsApp</li>
                                <li>Hostinger, para el hospedaje del sitio web y el correo electrónico</li>
                                <li>
                                    Hojas de cálculo de Google, para el almacenamiento de los mensajes y
                                    de los datos que usted nos envía por el sitio
                                </li>
                                <li>
                                    Google (Gemini) y Anthropic (Claude), como proveedores de
                                    inteligencia artificial
                                </li>
                            </ul>
                            <p>
                                Algunos de estos proveedores se ubican fuera de México, por lo que sus
                                datos pueden almacenarse o procesarse en el extranjero bajo las
                                condiciones de seguridad y confidencialidad que este aviso establece.
                            </p>
                            <p>
                                Vireon no vende, renta ni comercializa sus datos personales. Fuera de
                                los encargados listados, no realizamos transferencias de sus datos a
                                terceros, salvo las que exija una autoridad competente o una obligación
                                legal.
                            </p>
                        </section>

                        <section id="limitar">
                            <h2>8. Medios para limitar el uso o la divulgación de sus datos</h2>
                            <p>
                                Usted puede limitar el uso o la divulgación de sus datos personales por
                                cualquiera de estas vías:
                            </p>
                            <ul>
                                <li>
                                    Escribir a <a href={`mailto:${CORREO}`}>{CORREO}</a> indicando qué
                                    uso desea limitar
                                </li>
                                <li>
                                    Responder <strong>BAJA</strong> por WhatsApp para dejar de recibir
                                    mensajes de Vireon
                                </li>
                                <li>Usar el enlace de baja incluido en nuestros correos, cuando aplique</li>
                            </ul>
                        </section>

                        <section id="conservacion">
                            <h2>9. Conservación de los datos</h2>
                            <ul>
                                <li>
                                    <strong>Datos de clientes:</strong> durante la relación comercial y
                                    hasta 5 años después de su terminación, por obligaciones fiscales y
                                    contables.
                                </li>
                                <li>
                                    <strong>Datos de prospectos que no llegan a contratar:</strong> hasta
                                    24 meses contados a partir del último contacto.
                                </li>
                                <li>
                                    <strong>Conversaciones de WhatsApp:</strong> se conservan bajo los
                                    mismos plazos anteriores, según usted sea prospecto o cliente.
                                </li>
                            </ul>
                            <p>
                                Al concluir el plazo aplicable, los datos se bloquean y posteriormente se
                                suprimen de nuestros sistemas.
                            </p>
                        </section>

                        <section id="seguridad">
                            <h2>10. Seguridad de la información</h2>
                            <p>
                                Vireon aplica medidas de seguridad administrativas, técnicas y físicas
                                razonables para proteger sus datos personales contra daño, pérdida,
                                alteración, destrucción, uso, acceso o tratamiento no autorizados.
                            </p>
                            <p>
                                Ningún sistema es completamente infalible. Si ocurre una vulneración que
                                afecte de forma significativa sus derechos, se lo comunicaremos sin
                                demora por el medio de contacto que tengamos registrado.
                            </p>
                        </section>

                        <section id="arco">
                            <h2>11. Sus derechos ARCO</h2>
                            <p>
                                Usted tiene derecho a <strong>A</strong>cceder a sus datos personales, a{' '}
                                <strong>R</strong>ectificarlos cuando sean inexactos o estén
                                desactualizados, a <strong>C</strong>ancelarlos cuando considere que no
                                se requieren para las finalidades de este aviso y a <strong>O</strong>
                                ponerse a su tratamiento para fines específicos. También puede revocar su
                                consentimiento y oponerse a decisiones automatizadas que le produzcan
                                efectos jurídicos adversos.
                            </p>
                            <h3>Cómo ejercerlos</h3>
                            <p>
                                Envíe su solicitud a <a href={`mailto:${CORREO}`}>{CORREO}</a> con la
                                siguiente información:
                            </p>
                            <ul>
                                <li>Su nombre y un medio para comunicarle la respuesta</li>
                                <li>
                                    Copia de una identificación oficial que acredite su identidad o, en su
                                    caso, la representación legal
                                </li>
                                <li>
                                    Descripción clara y precisa de los datos y del derecho que desea
                                    ejercer
                                </li>
                                <li>Cualquier documento que facilite localizar sus datos</li>
                            </ul>
                            <h3>Plazos</h3>
                            <p>
                                Vireon le comunicará la determinación dentro de los 20 días hábiles
                                siguientes a la recepción de su solicitud y, de resultar procedente, la
                                hará efectiva dentro de los 15 días hábiles posteriores. Ambos plazos
                                pueden ampliarse por una sola vez y por un periodo igual cuando las
                                circunstancias del caso lo justifiquen. El ejercicio de sus derechos ARCO
                                es gratuito.
                            </p>
                        </section>

                        <section id="eliminacion">
                            <h2>12. Eliminación de sus datos</h2>
                            <p>
                                Para solicitar la eliminación de sus datos personales, incluido su
                                historial de conversación por WhatsApp, escriba a{' '}
                                <a
                                    href={`mailto:${CORREO}?subject=Eliminaci%C3%B3n%20de%20datos`}
                                >
                                    {CORREO}
                                </a>{' '}
                                con el asunto «Eliminación de datos» e indique el número de teléfono o el
                                correo electrónico con el que nos contactó. Confirmaremos la eliminación
                                dentro de los plazos señalados en la sección 11.
                            </p>
                            <p>
                                Conservaremos únicamente la información que una obligación legal,
                                contable o fiscal nos exija mantener, y la mantendremos bloqueada hasta
                                que dicho plazo concluya.
                            </p>
                        </section>

                        <section id="cookies">
                            <h2>13. Cookies y tecnologías de seguimiento</h2>
                            <p>
                                El sitio web de Vireon no usa cookies ni tecnologías de seguimiento con
                                fines publicitarios o de analítica.
                            </p>
                        </section>

                        <section id="menores">
                            <h2>14. Menores de edad</h2>
                            <p>
                                Los servicios de Vireon están dirigidos a personas mayores de edad que
                                actúan en un contexto profesional o empresarial. No recabamos de forma
                                intencional datos personales de menores de 18 años.
                            </p>
                        </section>

                        <section id="cambios">
                            <h2>15. Cambios a este aviso de privacidad</h2>
                            <p>
                                Vireon puede modificar este aviso para reflejar cambios en sus servicios,
                                en sus proveedores o en la legislación aplicable. La versión vigente
                                estará siempre publicada en{' '}
                                <a href="https://www.vireonai.com.mx/aviso-de-privacidad/">
                                    www.vireonai.com.mx/aviso-de-privacidad
                                </a>
                                , con la fecha de última actualización al inicio del documento. Cuando el
                                cambio sea sustancial, se lo comunicaremos por correo electrónico o por
                                WhatsApp, según el medio de contacto que tengamos registrado.
                            </p>
                        </section>

                        <section id="autoridad">
                            <h2>16. Autoridad competente</h2>
                            <p>
                                Si considera que su derecho a la protección de datos personales ha sido
                                vulnerado, o que Vireon incumplió la ley en su tratamiento, puede
                                presentar su inconformidad ante la Secretaría Anticorrupción y Buen
                                Gobierno, autoridad que asumió estas funciones tras la desaparición del
                                INAI.
                            </p>
                        </section>

                        <section id="contacto">
                            <h2>17. Contacto</h2>
                            <p>
                                Para cualquier duda sobre este aviso de privacidad o sobre el tratamiento
                                de sus datos personales:
                            </p>
                            <div className="aviso-contacto">
                                <p className="aviso-contacto-nombre">
                                    Juan Manuel González Ascencio
                                    <span>
                                        Persona física con actividad empresarial, que opera comercialmente
                                        como Vireon
                                    </span>
                                </p>
                                <ul className="aviso-contacto-lista">
                                    <li>
                                        <Mail size={18} aria-hidden="true" />
                                        <a href={`mailto:${CORREO}`}>{CORREO}</a>
                                    </li>
                                    <li>
                                        <MessageCircle size={18} aria-hidden="true" />
                                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                                            {WHATSAPP_DISPLAY}
                                        </a>
                                    </li>
                                    <li>
                                        <MapPin size={18} aria-hidden="true" />
                                        <span>
                                            Picacho 112, Jardines del Moral, León, Guanajuato, C.P. 37160,
                                            México
                                        </span>
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
                    <a href="/">Volver al inicio</a>
                </div>
            </footer>
        </div>
    );
};

export default AvisoPrivacidad;
