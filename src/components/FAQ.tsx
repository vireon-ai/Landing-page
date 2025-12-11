import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import './FAQ.css';

const faqs = [
    {
        question: "¿Por qué elegir una consultoría nueva vs una establecida?",
        answer: "Somos ágiles, personalizados y usamos lo más nuevo en IA. Sin burocracia de empresas grandes, nos adaptamos a tu velocidad."
    },
    {
        question: "¿Necesito tener un equipo de sistemas?",
        answer: "No. Nosotros actuamos como tu brazo tecnológico. Diseñamos, implementamos y mantenemos las soluciones para que tú te enfoques en tu negocio."
    },
    {
        question: "¿Es muy caro implementar IA?",
        answer: "Nuestras soluciones se pagan solas con el ahorro generado. Además, empezamos con 'Quick Wins' de bajo costo para demostrar valor inmediato."
    },
    {
        question: "¿Qué pasa si mi proceso es muy específico?",
        answer: "Mejor. Nos especializamos en soluciones a medida, no en plantillas genéricas. Analizamos tu flujo único y lo optimizamos."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq-section">
            <div className="container faq-container">
                <div className="text-center">
                    <h2 className="section-title">Preguntas Frecuentes</h2>
                    <p className="section-subtitle">Resolvemos tus dudas antes de empezar.</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-xl" style={{ marginTop: '3rem' }}>
                    <button className="btn btn-secondary"
                        onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}>
                        <MessageCircle size={20} style={{ marginRight: '0.5rem' }} /> ¿Otra duda? Agenda 15 min
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
