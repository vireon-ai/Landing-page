import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, RefreshCw, Mail, Check, Loader2, AlertTriangle, MessageCircle } from 'lucide-react';
import { whatsappUrl } from '../config';
import { DESTINO_TEST, enviarConReintentos, guardarPendiente, reintentarPendientes } from '../leads';
import './Quiz.css';

interface Question {
    id: number;
    text: string;
    options: { text: string; points: number }[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "¿Cuántas horas semanales dedica tu equipo a tareas repetitivas manuales?",
        options: [
            { text: "0-5 horas", points: 100 },
            { text: "5-15 horas", points: 50 },
            { text: "15-30 horas", points: 25 },
            { text: "+30 horas", points: 10 }
        ]
    },
    {
        id: 2,
        text: "¿Tus reportes y dashboards se generan...?",
        options: [
            { text: "Automáticamente en tiempo real", points: 100 },
            { text: "Semanalmente manual", points: 70 },
            { text: "Mensual manual", points: 40 },
            { text: "No tenemos", points: 10 }
        ]
    },
    {
        id: 3,
        text: "¿Cómo manejan actualmente los datos de clientes?",
        options: [
            { text: "CRM automatizado integrado", points: 100 },
            { text: "Excel/hojas de cálculo", points: 50 },
            { text: "Papel/correos", points: 10 }
        ]
    },
    {
        id: 4,
        text: "¿Cuántos procesos manuales tienen que podrían automatizarse?",
        options: [
            { text: "0-2", points: 100 },
            { text: "3-5", points: 70 },
            { text: "6-10", points: 50 },
            { text: "+10", points: 10 }
        ]
    },
    {
        id: 5,
        text: "¿Qué porcentaje de decisiones se basan en datos vs intuición?",
        options: [
            { text: "+80% datos", points: 100 },
            { text: "50-80% datos", points: 70 },
            { text: "20-50% datos", points: 50 },
            { text: "Casi pura intuición", points: 10 }
        ]
    },
    {
        id: 6,
        text: "¿Tu equipo puede acceder a información crítica del negocio en tiempo real?",
        options: [
            { text: "Sí, desde cualquier lugar", points: 100 },
            { text: "Solo en oficina", points: 50 },
            { text: "Tienen que pedirla", points: 30 },
            { text: "No disponible", points: 10 }
        ]
    },
    {
        id: 7,
        text: "¿Cuánto tiempo toma generar un reporte mensual completo?",
        options: [
            { text: "Menos de 1 hora", points: 100 },
            { text: "2-5 horas", points: 70 },
            { text: "1-2 días", points: 40 },
            { text: "+2 días", points: 10 }
        ]
    },
    {
        id: 8,
        text: "¿Usan alguna herramienta de IA actualmente?",
        options: [
            { text: "Múltiples integradas", points: 100 },
            { text: "1-2 básicas", points: 70 },
            { text: "Solo ChatGPT", points: 30 },
            { text: "Ninguna", points: 10 }
        ]
    },
    {
        id: 9,
        text: "¿Cómo es su proceso de seguimiento a clientes/leads?",
        options: [
            { text: "Automatizado con triggers", points: 100 },
            { text: "Semi-manual con recordatorios", points: 60 },
            { text: "100% manual", points: 30 },
            { text: "No hay seguimiento sistemático", points: 10 }
        ]
    },
    {
        id: 10,
        text: "Si un empleado clave se va, ¿qué tan fácil es transferir su conocimiento?",
        options: [
            { text: "Todo documentado/automatizado", points: 100 },
            { text: "Parcialmente documentado", points: 50 },
            { text: "Está en su cabeza", points: 20 },
            { text: "Se pierde conocimiento crítico", points: 10 }
        ]
    }
];

const Quiz = () => {
    // Load progress from localStorage on first render (resume if progress exists)
    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem('quizStep');
        return savedStep ? parseInt(savedStep) : 0;
    });
    const [answers, setAnswers] = useState<Record<number, number>>(() => {
        const savedAnswers = localStorage.getItem('quizAnswers');
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [score, setScore] = useState(0);
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const [hasStarted, setHasStarted] = useState(() => Boolean(localStorage.getItem('quizStep')));
    // Candado síncrono contra el doble clic: el estado de React tarda un render
    // en actualizarse y dos clics seguidos alcanzarían a mandar dos filas.
    const enviando = useRef(false);

    // Al cargar la página reintentamos en segundo plano los resultados que quedaron guardados.
    useEffect(() => reintentarPendientes(DESTINO_TEST), []);

    // Save progress
    useEffect(() => {
        if (hasStarted) {
            localStorage.setItem('quizStep', step.toString());
            localStorage.setItem('quizAnswers', JSON.stringify(answers));
        }
    }, [step, answers, hasStarted]);

    const handleStart = () => {
        setHasStarted(true);
    };

    const handleOptionSelect = (points: number) => {
        setAnswers({ ...answers, [questions[step].id]: points });
    };

    const handleNext = () => {
        if (step < questions.length) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const calculateScore = () => {
        const totalPoints = Object.values(answers).reduce((a, b) => a + b, 0);
        setScore(totalPoints);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        calculateScore();
        setIsSubmitted(true);
        // Clear storage after submission
        localStorage.removeItem('quizStep');
        localStorage.removeItem('quizAnswers');
    };

    const handleSendResults = async () => {
        if (enviando.current || emailStatus === 'success') return;
        enviando.current = true;
        setEmailStatus('sending');

        const finalScore = score;
        const resultData = getResultContent();
        // Mismos nombres y mismos valores (todos texto) que viajaban antes en la
        // URL, para que la hoja siga llenando las mismas columnas.
        const resultado = {
            email: email.trim(),
            score: finalScore.toString(),
            scoreNormalized: Math.round(finalScore / 10).toString(),
            answers: JSON.stringify(answers),
            submittedAt: new Date().toISOString(),
            badge: resultData.badge,
            message: resultData.message,
            cta: resultData.cta
        };

        const enviado = await enviarConReintentos(resultado, DESTINO_TEST);

        if (enviado) {
            // Se queda en "¡Enviado!": volver a habilitar el botón invitaría a mandar la misma fila otra vez.
            setEmailStatus('success');
        } else {
            // No perdemos el resultado: queda guardado y se reintenta al recargar.
            guardarPendiente(resultado, DESTINO_TEST);
            setEmailStatus('error');
        }
        enviando.current = false;
    };

    const getResultContent = () => {
        if (score <= 250) return {
            badge: "Urgente: Tu competencia te está rebasando",
            color: "badge-red",
            textColor: "#991b1b",
            message: "🚨 CRÍTICO: Tu competencia ya te está rebasando. El 73% de empresas similares pierden tiempo en tareas que la IA automatiza. Actúa YA.",
            cta: "Habla con un especialista HOY"
        };
        if (score <= 500) return {
            badge: "Necesitas Automatización Ya",
            color: "badge-orange",
            textColor: "#9a3412",
            message: "⚠️ Tu empresa necesita automatización ahora. Estás perdiendo competitividad cada día que pasa.",
            cta: "Recupera el tiempo perdido"
        };
        if (score <= 750) return {
            badge: "En Proceso de Transformación",
            color: "badge-yellow",
            textColor: "#854d0e",
            message: "Vas bien, pero hay oportunidades significativas. Estás dejando dinero sobre la mesa en eficiencia.",
            cta: "Agenda tu diagnóstico gratuito"
        };
        return {
            badge: "Líder Digital",
            color: "badge-green",
            textColor: "#166534",
            message: "¡Felicidades! Tu empresa está por encima del promedio. Podemos ayudarte a optimizar aún más con automatizaciones avanzadas.",
            cta: "Optimiza tu ventaja competitiva"
        };
    };



    const result = getResultContent();
    const progress = ((step) / questions.length) * 100;

    return (
        <section id="quiz" className="quiz-section">
            <div className="fondo fondo--halos" aria-hidden="true" />
            <div className="container quiz-container">
                {!hasStarted ? (
                    <div className="quiz-card text-center">
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <RefreshCw size={40} color="var(--primary)" />
                            </div>
                        </div>

                        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                            Tu Reporte Personalizado Incluye:
                        </h2>

                        <ul className="intro-benefits" style={{
                            listStyle: 'none',
                            textAlign: 'left',
                            maxWidth: '400px',
                            margin: '0 auto 2rem auto',
                            padding: 0
                        }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                <CheckCircle2 size={24} color="var(--primary)" />
                                Score de eficiencia operativa (0-100)
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                <CheckCircle2 size={24} color="var(--primary)" />
                                Comparativa con competencia
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                <CheckCircle2 size={24} color="var(--primary)" />
                                3 recomendaciones inmediatas
                            </li>
                        </ul>

                        <button
                            className="btn btn-primary"
                            onClick={handleStart}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                margin: '0 auto'
                            }}
                        >
                            Comenzar Test Gratuito
                        </button>

                        <p style={{
                            marginTop: '1rem',
                            color: 'var(--text-tertiary)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <RefreshCw size={14} /> Toma menos de 3 minutos
                        </p>
                    </div>
                ) : !isSubmitted ? (
                    <>
                        <div className="quiz-header">
                            <h2 className="section-title">Descubre tu Nivel de Madurez en IA</h2>
                            <p className="section-subtitle">10 preguntas | 3 minutos | Resultados inmediatos</p>
                        </div>

                        <div className="quiz-card">
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            </div>

                            {step < questions.length ? (
                                <div className="step-content">
                                    <div className="question-counter">Pregunta {step + 1} de {questions.length}</div>
                                    <h3 className="quiz-question">{questions[step].text}</h3>

                                    <div className="options-grid">
                                        {questions[step].options.map((option, idx) => (
                                            <div
                                                key={idx}
                                                className={`quiz-option ${answers[questions[step].id] === option.points ? 'selected' : ''}`}
                                                onClick={() => handleOptionSelect(option.points)}
                                            >
                                                {option.text}
                                                {answers[questions[step].id] === option.points && <CheckCircle2 size={20} color="var(--primary)" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="quiz-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleBack}
                                            disabled={step === 0}
                                            style={{ opacity: step === 0 ? 0.5 : 1 }}
                                        >
                                            <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Atrás
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleNext}
                                            disabled={!answers[questions[step].id]}
                                            style={{ opacity: !answers[questions[step].id] ? 0.5 : 1 }}
                                        >
                                            Siguiente <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="step-content text-center">
                                    <h3 className="quiz-question">¿Dónde enviamos tu reporte detallado?</h3>
                                    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                                        <input
                                            type="email"
                                            placeholder="Tu correo empresarial"
                                            aria-label="Tu correo empresarial"
                                            className="email-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                marginBottom: '1rem',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-color)'
                                            }}
                                        />
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                            Ver Mis Resultados
                                        </button>
                                        <p className="quiz-privacidad">
                                            Al enviar aceptas nuestro{' '}
                                            <a href="/aviso-de-privacidad/" target="_blank" rel="noopener noreferrer">
                                                Aviso de Privacidad
                                            </a>
                                            .
                                        </p>
                                    </form>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="results-content">
                        <div className="quiz-card" id="quiz-results-card">
                            <div className={`result-badge ${result.color}`}>{result.badge}</div>

                            <div className="score-display">
                                <div className="score-circle">
                                    <span className="score-number" style={{ color: result.textColor }}>{Math.round(score / 10)}</span>
                                    <span className="score-total">/ 100</span>
                                </div>
                            </div>

                            <p className="result-message">{result.message}</p>

                            <div className="comparison-box">
                                <h4>Empresas con score similar vieron:</h4>
                                <ul className="comparison-list">
                                    <li><CheckCircle2 size={16} color="var(--primary)" /> 40% reducción en errores operativos</li>
                                    <li><CheckCircle2 size={16} color="var(--primary)" /> 80% aumento en productividad</li>
                                    <li><CheckCircle2 size={16} color="var(--primary)" /> ROI positivo en menos de 6 meses</li>
                                </ul>
                            </div>

                            <div className="quiz-actions" style={{ flexDirection: 'column', gap: '1rem' }}>
                                <button className="btn btn-primary" style={{ width: '100%' }}>
                                    {result.cta} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                </button>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                                    <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                                        <RefreshCw size={18} style={{ marginRight: '0.5rem' }} /> Reintentar
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleSendResults}
                                        aria-disabled={emailStatus === 'sending' || emailStatus === 'success'}
                                        style={{
                                            minWidth: 'min(200px, 100%)',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: emailStatus === 'success' ? '#dcfce7' : '',
                                            color: emailStatus === 'success' ? '#166534' : '',
                                            borderColor: emailStatus === 'success' ? '#166534' : ''
                                        }}
                                    >
                                        {emailStatus === 'sending' ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" style={{ marginRight: '0.5rem' }} />
                                                Enviando...
                                            </>
                                        ) : emailStatus === 'success' ? (
                                            <>
                                                <Check size={18} style={{ marginRight: '0.5rem' }} />
                                                ¡Enviado!
                                            </>
                                        ) : emailStatus === 'error' ? (
                                            <>
                                                <RefreshCw size={18} style={{ marginRight: '0.5rem' }} />
                                                Error, reintentar
                                            </>
                                        ) : (
                                            <>
                                                <Mail size={18} style={{ marginRight: '0.5rem' }} />
                                                Enviar por correo
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="quiz-estado" role="status">
                                    {emailStatus === 'sending' && 'Enviando tu reporte…'}
                                    {emailStatus === 'success' && `Listo. Te enviaremos el reporte a ${email.trim()}.`}
                                </p>
                                {emailStatus === 'error' && (
                                    <div className="quiz-error" role="alert">
                                        <AlertTriangle size={18} className="quiz-error-icon" aria-hidden="true" />
                                        <span>
                                            No pudimos enviar tu reporte. Tu resultado quedó guardado en este
                                            navegador y lo volveremos a enviar la próxima vez que abras esta
                                            página. Si lo quieres ya,{' '}
                                            <a
                                                href={whatsappUrl(`Hola Vireon, hice el test de madurez (resultado: ${Math.round(score / 10)} de 100, ${result.badge}) y no me llegó el reporte.`)}
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
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Quiz;
