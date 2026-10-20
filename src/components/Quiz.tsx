import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, Loader2, AlertTriangle, MessageCircle, RotateCcw } from 'lucide-react';
import { whatsappUrl } from '../config';
import { DESTINO_TEST, enviarConReintentos, reintentarPendientes } from '../leads';
import './Quiz.css';

type Pregunta = {
    id: number;
    texto: string;
    // De menos a más madurez: la posición de la opción (0 a 3) es su puntaje.
    opciones: string[];
    area: string;
};

const PREGUNTAS: Pregunta[] = [
    {
        id: 1,
        texto: '¿Cuántas horas a la semana se le van a tu equipo en tareas repetitivas?',
        opciones: ['Más de 30 horas', 'Entre 15 y 30 horas', 'Entre 5 y 15 horas', 'Menos de 5 horas'],
        area: 'Carga manual'
    },
    {
        id: 2,
        texto: '¿Tus sistemas se hablan entre sí? CRM, ERP, correo, WhatsApp.',
        opciones: [
            'Cada uno por su lado, todo se pasa a mano',
            'Algunos, exportando e importando archivos',
            'Los principales ya están conectados',
            'Todo conectado y sincronizado solo'
        ],
        area: 'Conexión entre sistemas'
    },
    {
        id: 3,
        texto: '¿Con qué tomas las decisiones de operación del día a día?',
        opciones: [
            'Con lo que me cuentan y mi experiencia',
            'Con reportes que alguien arma cada semana',
            'Con un tablero, aunque no siempre esté al día',
            'Con datos en tiempo real y alertas automáticas'
        ],
        area: 'Decisiones con datos'
    },
    {
        id: 4,
        texto: '¿Ya usan inteligencia artificial en el día a día?',
        opciones: [
            'No, o alguien probó ChatGPT por su cuenta',
            'Sí, para redactar y buscar cosas sueltas',
            'Tenemos IA metida en uno o dos procesos',
            'Hay agentes conectados a nuestros propios datos'
        ],
        area: 'Uso de IA'
    },
    {
        id: 5,
        texto: '¿Tus procesos operativos están documentados?',
        opciones: [
            'Están en la cabeza de la gente',
            'Hay algo escrito, pero desactualizado',
            'Los principales sí están documentados',
            'Documentados, versionados y se revisan'
        ],
        area: 'Documentación'
    },
    {
        id: 6,
        texto: '¿Quién resuelve hoy los temas de tecnología?',
        opciones: [
            'El que le sabe más de computadoras',
            'Un proveedor externo cuando algo se rompe',
            'Alguien interno, de medio tiempo',
            'Tenemos un responsable de tecnología'
        ],
        area: 'Dueño de la tecnología'
    }
];

const MAX_OPCION = 3;

// Una por pregunta, en el mismo orden. El resultado enseña las de las tres áreas
// con menor puntaje.
const RECOMENDACIONES: { antes: string; fuerte: string; despues: string }[] = [
    { antes: 'Antes de automatizar, ', fuerte: 'mide dos semanas', despues: ': qué tareas repite tu equipo y cuánto tardan. Ese registro te dice qué conviene automatizar primero y evita automatizar lo que no importa.' },
    { antes: 'Conecta primero ', fuerte: 'los dos sistemas entre los que más se copia información a mano', despues: '. Suele ser el cambio con mejor retorno y el más rápido de montar.' },
    { antes: 'Monta un tablero con ', fuerte: 'cinco números, no con treinta', despues: '. Si nadie lo abre a diario, no sirve para decidir.' },
    { antes: 'Arranca con ', fuerte: 'un agente sobre una sola tarea acotada', despues: ' y con datos tuyos. Los pilotos de IA que quieren abarcar todo son los que se abandonan.' },
    { antes: 'Documenta ', fuerte: 'los tres procesos que más ingresos mueven', despues: '. Automatizar sin documentar es congelar el desorden.' },
    { antes: 'Nombra ', fuerte: 'un responsable de tecnología', despues: ', aunque sea de medio tiempo. Sin dueño, las automatizaciones se degradan en meses.' }
];

const NIVELES = [
    { max: 25, nombre: 'Manual', descripcion: 'Tu operación depende de que las personas correctas estén disponibles. Es el punto donde automatizar da el salto más grande, y donde un primer paso pequeño ya se nota.' },
    { max: 50, nombre: 'En transición', descripcion: 'Ya hay piezas sueltas funcionando, pero no se hablan entre sí. El siguiente paso no es más herramientas: es conectar las que ya tienes.' },
    { max: 75, nombre: 'Automatizado', descripcion: 'Lo repetitivo ya corre solo en buena parte. De aquí en adelante el valor está en decidir mejor, no en ejecutar más rápido.' },
    { max: 100, nombre: 'Inteligente', descripcion: 'Lo repetitivo corre solo y decides con datos. El terreno que queda es el de agentes que toman decisiones acotadas y sistemas que se anticipan.' }
];

// Las áreas que el resultado enseña en barras, como en el prototipo. Cada barra
// sale de una sola respuesta: se nombra el escalón, no un porcentaje que
// parecería una medición.
const AREAS_EN_BARRA = [1, 2, 3];
const ESCALONES = ['Inicial', 'Básico', 'Intermedio', 'Avanzado'];

// Circunferencia del arco del score (radio 78 en un lienzo de 180).
const RADIO = 78;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

// --- Progreso guardado -------------------------------------------------------

type Respuestas = (number | null)[];
// `enviado`: este resultado ya llegó a n8n. Al recargar no se vuelve a ofrecer
// el formulario, para no dejar dos filas iguales en la hoja.
type Progreso = { paso: number; respuestas: Respuestas; terminado: boolean; enviado: boolean };

const CLAVE_PROGRESO = 'vireon_test_progreso';
// El test de diez preguntas guardaba aquí su avance. Esas respuestas no
// corresponden a las seis preguntas nuevas: se descartan.
const CLAVES_VIEJAS = ['quizStep', 'quizAnswers'];

const progresoVacio = (): Progreso => ({
    paso: 0,
    respuestas: PREGUNTAS.map(() => null),
    terminado: false,
    enviado: false
});

/** Lee el avance guardado. Si no existe o no cuadra con las preguntas de hoy, devuelve null. */
const leerProgreso = (): Progreso | null => {
    try {
        CLAVES_VIEJAS.forEach((clave) => localStorage.removeItem(clave));
        const crudo = localStorage.getItem(CLAVE_PROGRESO);
        if (!crudo) return null;
        const datos = JSON.parse(crudo);
        const respuestas: unknown = datos?.respuestas;
        if (
            !Array.isArray(respuestas) ||
            respuestas.length !== PREGUNTAS.length ||
            !respuestas.every((r) => r === null || (typeof r === 'number' && Number.isInteger(r) && r >= 0 && r <= MAX_OPCION))
        ) {
            return null;
        }
        const limpias = respuestas as Respuestas;
        const pasoGuardado = typeof datos.paso === 'number' && Number.isInteger(datos.paso) ? datos.paso : 0;
        // Nunca se aterriza más allá de la primera pregunta sin contestar.
        const sinContestar = limpias.indexOf(null);
        const tope = sinContestar === -1 ? PREGUNTAS.length - 1 : sinContestar;
        const terminado = datos.terminado === true && sinContestar === -1;
        return {
            paso: Math.min(Math.max(pasoGuardado, 0), tope),
            respuestas: limpias,
            terminado,
            enviado: terminado && datos.enviado === true
        };
    } catch {
        return null;
    }
};

const guardarProgreso = (progreso: Progreso | null): void => {
    try {
        if (progreso) localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
        else localStorage.removeItem(CLAVE_PROGRESO);
    } catch {
        // Navegación privada o almacenamiento bloqueado: el test funciona igual, sin retomar.
    }
};

// --- Cálculo del resultado ---------------------------------------------------

const calcularScore = (respuestas: Respuestas): number => {
    const suma = respuestas.reduce<number>((total, r) => total + (r ?? 0), 0);
    return Math.round((suma / (PREGUNTAS.length * MAX_OPCION)) * 100);
};

const nivelDe = (score: number) => NIVELES.find((nivel) => score <= nivel.max) ?? NIVELES[NIVELES.length - 1];

/** Índices de las tres preguntas con menor puntaje; en empate, la que va primero. */
const peoresAreas = (respuestas: Respuestas): number[] =>
    respuestas
        .map((r, indice) => ({ r: r ?? 0, indice }))
        .sort((a, b) => a.r - b.r || a.indice - b.indice)
        .slice(0, 3)
        .map(({ indice }) => indice);

const prefiereMenosMovimiento = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// -----------------------------------------------------------------------------

const Quiz = () => {
    const [guardado] = useState(leerProgreso);
    const [iniciado, setIniciado] = useState(guardado !== null);
    const [progreso, setProgreso] = useState<Progreso>(guardado ?? progresoVacio());
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
        () => (guardado?.enviado ? 'success' : 'idle')
    );
    const [scoreVisible, setScoreVisible] = useState(() =>
        guardado?.terminado ? calcularScore(guardado.respuestas) : 0
    );

    // Candado síncrono contra el doble clic: el estado de React tarda un render
    // en actualizarse y dos clics seguidos alcanzarían a mandar dos filas.
    const enviando = useRef(false);
    // A dónde mover el foco después del siguiente render. Solo lo piden las
    // acciones de la persona: al cargar la página no se le mueve nada.
    const focoPendiente = useRef<'pregunta' | 'resultado' | 'estado' | null>(null);
    const preguntaRef = useRef<HTMLHeadingElement>(null);
    const resultadoRef = useRef<HTMLDivElement>(null);
    const estadoRef = useRef<HTMLParagraphElement>(null);

    const { paso, respuestas, terminado } = progreso;
    const pregunta = PREGUNTAS[paso];
    const respuestaActual = respuestas[paso];
    const score = calcularScore(respuestas);
    const nivel = nivelDe(score);

    // Al cargar la página reintentamos en segundo plano los resultados que quedaron guardados.
    useEffect(() => reintentarPendientes(DESTINO_TEST), []);

    useEffect(() => {
        if (iniciado) guardarProgreso(progreso);
    }, [progreso, iniciado]);

    useEffect(() => {
        const destino = focoPendiente.current;
        if (!destino) return;
        focoPendiente.current = null;
        // Al enviar el correo el formulario desaparece: el foco pasa al mensaje
        // de confirmación en vez de perderse en la página.
        if (destino === 'estado') {
            estadoRef.current?.focus();
            return;
        }
        // En el resultado el foco va al puntaje, que va primero: el lector de
        // pantalla lee el número y después el nivel.
        const titulo = destino === 'pregunta' ? preguntaRef.current : resultadoRef.current;
        const tarjeta = titulo?.closest<HTMLElement>('.quiz-card');
        if (!titulo || !tarjeta) return;
        // 'auto' heredaría el scroll-behavior: smooth del html; con movimiento reducido va directo.
        tarjeta.scrollIntoView({ block: 'start', behavior: prefiereMenosMovimiento() ? 'instant' : 'smooth' });
        titulo.focus({ preventScroll: true });
    });

    // El número del score sube de 0 a su valor junto con el arco. Con
    // movimiento reducido aparece directo en su valor final.
    useEffect(() => {
        if (!terminado || prefiereMenosMovimiento()) return;
        let cuadro = 0;
        let inicio: number | null = null;
        const avanzar = (ahora: number) => {
            if (inicio === null) inicio = ahora;
            const avance = Math.min(1, (ahora - inicio) / 1000);
            setScoreVisible(Math.round(score * (1 - Math.pow(1 - avance, 3))));
            if (avance < 1) cuadro = requestAnimationFrame(avanzar);
        };
        cuadro = requestAnimationFrame(avanzar);
        return () => cancelAnimationFrame(cuadro);
    }, [terminado, score]);

    const handleStart = () => {
        focoPendiente.current = 'pregunta';
        setIniciado(true);
    };

    const handleOptionSelect = (opcion: number) => {
        setProgreso((actual) => {
            const nuevas = [...actual.respuestas];
            nuevas[actual.paso] = opcion;
            return { ...actual, respuestas: nuevas };
        });
    };

    const handleNext = () => {
        if (respuestaActual === null) return;
        if (paso < PREGUNTAS.length - 1) {
            focoPendiente.current = 'pregunta';
            setProgreso({ ...progreso, paso: paso + 1 });
        } else {
            focoPendiente.current = 'resultado';
            setScoreVisible(0);
            setProgreso({ ...progreso, terminado: true });
        }
    };

    const handleBack = () => {
        if (paso === 0) return;
        focoPendiente.current = 'pregunta';
        setProgreso({ ...progreso, paso: paso - 1 });
    };

    const handleRestart = () => {
        focoPendiente.current = 'pregunta';
        setProgreso(progresoVacio());
        setEmail('');
        setEmailStatus('idle');
        setScoreVisible(0);
    };

    const handleSendResults = async (e: React.FormEvent) => {
        e.preventDefault();
        if (enviando.current || emailStatus === 'success') return;
        enviando.current = true;
        setEmailStatus('sending');

        // Mismos nombres de campo que siempre, todos en texto, para que la hoja
        // siga llenando las mismas columnas. `score` conserva su escala de 0 a
        // 1000 y `scoreNormalized` la de 0 a 100, como en el test de diez
        // preguntas. `answers` lleva, por número de pregunta, el texto de la
        // opción elegida.
        const resultado = {
            email: email.trim(),
            score: (score * 10).toString(),
            scoreNormalized: score.toString(),
            answers: JSON.stringify(
                Object.fromEntries(PREGUNTAS.map((p, i) => [p.id, p.opciones[respuestas[i] ?? 0]]))
            ),
            submittedAt: new Date().toISOString(),
            badge: nivel.nombre,
            message: nivel.descripcion,
            cta: 'Agenda tu diagnóstico gratuito'
        };

        // enviarConReintentos deja el resultado en la cola antes del primer
        // intento y lo quita solo si n8n lo recibe.
        const enviado = await enviarConReintentos(resultado, DESTINO_TEST);
        if (enviado) {
            focoPendiente.current = 'estado';
            setProgreso((actual) => ({ ...actual, enviado: true }));
        }
        setEmailStatus(enviado ? 'success' : 'error');
        enviando.current = false;
    };

    return (
        <section id="quiz" className="quiz-section" aria-labelledby="quiz-titulo">
            <div className="fondo fondo--halos" aria-hidden="true" />
            <div className="container quiz-container">
                <header className="quiz-header">
                    <p className="quiz-eyebrow">Test de madurez en IA</p>
                    <h2 id="quiz-titulo" className="section-title">Seis preguntas. Tu resultado en pantalla.</h2>
                    <p className="quiz-lede">
                        No pedimos tu correo para enseñarte el resultado. Si lo quieres por correo, te lo
                        pedimos al final.
                    </p>
                </header>

                <div className="quiz-card">
                    {!iniciado ? (
                        <div className="quiz-intro">
                            <h3 className="quiz-intro-titulo">Al terminar ves en pantalla:</h3>
                            <ul className="quiz-intro-lista">
                                <li><CheckCircle2 size={22} aria-hidden="true" /> Tu puntaje de 0 a 100 y tu nivel de madurez</li>
                                <li><CheckCircle2 size={22} aria-hidden="true" /> Cómo vas en tres áreas de tu operación</li>
                                <li><CheckCircle2 size={22} aria-hidden="true" /> Tres recomendaciones para empezar</li>
                            </ul>
                            <button type="button" className="btn btn-primary quiz-comenzar" onClick={handleStart}>
                                Comenzar el test gratuito
                            </button>
                            <p className="quiz-duracion">
                                <Clock size={14} aria-hidden="true" /> Toma menos de dos minutos
                            </p>
                        </div>
                    ) : !terminado ? (
                        <div className="quiz-paso">
                            <ol className="quiz-progreso" aria-hidden="true">
                                {PREGUNTAS.map((p, i) => (
                                    <li key={p.id} className={respuestas[i] !== null ? 'hecho' : ''} />
                                ))}
                            </ol>
                            <h3
                                id="quiz-pregunta"
                                className="quiz-pregunta"
                                ref={preguntaRef}
                                tabIndex={-1}
                            >
                                <span className="quiz-meta">Pregunta {paso + 1} de {PREGUNTAS.length}</span>
                                {pregunta.texto}
                            </h3>

                            <div className="quiz-opciones" role="group" aria-labelledby="quiz-pregunta">
                                {pregunta.opciones.map((opcion, indice) => (
                                    <button
                                        key={`${pregunta.id}-${indice}`}
                                        type="button"
                                        className="quiz-opcion"
                                        aria-pressed={respuestaActual === indice}
                                        onClick={() => handleOptionSelect(indice)}
                                    >
                                        <span className="quiz-marca" aria-hidden="true" />
                                        <span>{opcion}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="quiz-nav">
                                <button
                                    type="button"
                                    className="quiz-atras"
                                    onClick={handleBack}
                                    disabled={paso === 0}
                                >
                                    <ArrowLeft size={16} aria-hidden="true" /> Atrás
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary quiz-siguiente"
                                    onClick={handleNext}
                                    aria-disabled={respuestaActual === null}
                                >
                                    {paso === PREGUNTAS.length - 1 ? 'Ver mi resultado' : 'Siguiente'}
                                    <ArrowRight size={18} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="quiz-resultado">
                            <div className="quiz-score-grid">
                                <div
                                    className="quiz-dial"
                                    role="img"
                                    aria-label={`Tu puntaje: ${score} de 100`}
                                    ref={resultadoRef}
                                    tabIndex={-1}
                                >
                                    <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden="true">
                                        <circle className="quiz-dial-pista" cx="90" cy="90" r={RADIO} />
                                        <circle
                                            className="quiz-dial-arco"
                                            cx="90"
                                            cy="90"
                                            r={RADIO}
                                            strokeDasharray={CIRCUNFERENCIA.toFixed(1)}
                                            strokeDashoffset={(CIRCUNFERENCIA * (1 - score / 100)).toFixed(1)}
                                            style={{ '--circunferencia': CIRCUNFERENCIA.toFixed(1) } as React.CSSProperties}
                                        />
                                    </svg>
                                    <div className="quiz-dial-valor" aria-hidden="true">
                                        <span className="quiz-dial-numero">
                                            {prefiereMenosMovimiento() ? score : scoreVisible}
                                        </span>
                                        <span className="quiz-dial-escala">de 100</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="quiz-meta">Tu nivel</p>
                                    <h3 className="quiz-nivel">
                                        {nivel.nombre}
                                    </h3>
                                    <p className="quiz-nivel-descripcion">{nivel.descripcion}</p>

                                    <ul className="quiz-areas" aria-label="Cómo vas por área">
                                        {AREAS_EN_BARRA.map((indice) => {
                                            const porcentaje = Math.round(((respuestas[indice] ?? 0) / MAX_OPCION) * 100);
                                            return (
                                                <li key={PREGUNTAS[indice].id}>
                                                    <span className="quiz-area-etiqueta">
                                                        <span>{PREGUNTAS[indice].area}</span>
                                                        <span>{ESCALONES[respuestas[indice] ?? 0]}</span>
                                                    </span>
                                                    <span className="quiz-barra" aria-hidden="true">
                                                        <span style={{ width: `${porcentaje}%` }} />
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <h4 className="quiz-recs-titulo">Por dónde empezar</h4>
                            <ol className="quiz-recs">
                                {peoresAreas(respuestas).map((indice, n) => {
                                    const rec = RECOMENDACIONES[indice];
                                    return (
                                        <li key={PREGUNTAS[indice].id}>
                                            <span className="quiz-recs-numero" aria-hidden="true">0{n + 1}</span>
                                            <span>
                                                {rec.antes}<strong>{rec.fuerte}</strong>{rec.despues}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ol>

                            <div className="quiz-gate">
                                <p className="quiz-estado" role="status" ref={estadoRef} tabIndex={-1}>
                                    {emailStatus === 'sending' && 'Enviando tu resultado…'}
                                    {emailStatus === 'success' && (
                                        <>
                                            <Check size={18} aria-hidden="true" />
                                            {email.trim()
                                                ? `Listo. Te enviaremos tu resultado a ${email.trim()}.`
                                                : 'Ya te enviamos este resultado por correo.'}
                                        </>
                                    )}
                                </p>
                                {emailStatus !== 'success' && (
                                    <form className="quiz-form" onSubmit={handleSendResults}>
                                        <label htmlFor="quiz-correo" className="quiz-form-etiqueta">
                                            ¿Te lo mandamos por correo? Recibe este resultado para tenerlo a la mano y
                                            compartirlo con tu equipo.
                                        </label>
                                        <div className="quiz-form-fila">
                                            <input
                                                id="quiz-correo"
                                                type="email"
                                                className="quiz-input"
                                                placeholder="tu@empresa.com"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                aria-disabled={emailStatus === 'sending'}
                                            >
                                                {emailStatus === 'sending' ? (
                                                    <>
                                                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                                                        Enviando…
                                                    </>
                                                ) : emailStatus === 'error' ? 'Volver a enviar' : 'Mándamelo'}
                                            </button>
                                        </div>
                                        <p className="quiz-privacidad">
                                            Al enviar aceptas nuestro{' '}
                                            <a href="/aviso-de-privacidad/" target="_blank" rel="noopener noreferrer">
                                                Aviso de Privacidad
                                                <span className="quiz-sr"> (se abre en otra pestaña)</span>
                                            </a>
                                            .
                                        </p>
                                        {emailStatus === 'error' && (
                                            <div className="quiz-error" role="alert">
                                                <AlertTriangle size={18} className="quiz-error-icon" aria-hidden="true" />
                                                <span>
                                                    No pudimos enviar tu resultado por correo. Quedó guardado en este
                                                    navegador y lo volveremos a enviar la próxima vez que abras esta
                                                    página. Si lo quieres ya,{' '}
                                                    <a
                                                        href={whatsappUrl(`Hola Vireon, hice el test de madurez (resultado: ${score} de 100, nivel ${nivel.nombre}) y no me llegó por correo.`)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label="Escríbenos por WhatsApp (se abre en otra pestaña)"
                                                    >
                                                        <MessageCircle size={16} aria-hidden="true" />
                                                        escríbenos por WhatsApp
                                                    </a>.
                                                </span>
                                            </div>
                                        )}
                                    </form>
                                )}
                                <p className="quiz-nota">
                                    Opcional. Tu resultado ya es tuyo, con correo o sin él.{' '}
                                    <button type="button" className="quiz-repetir" onClick={handleRestart}>
                                        <RotateCcw size={14} aria-hidden="true" /> Repetir el test
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Quiz;
