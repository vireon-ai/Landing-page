import { Search, FileText, Code2, Rocket } from 'lucide-react';
import './Methodology.css';

const steps = [
    {
        icon: <Search size={32} />,
        number: 1,
        title: 'Diagnóstico',
        description: 'Analizamos tus procesos actuales para identificar cuellos de botella y oportunidades de automatización de alto impacto.'
    },
    {
        icon: <FileText size={32} />,
        number: 2,
        title: 'Estrategia',
        description: 'Diseñamos una solución a medida que se integra con tus herramientas existentes, sin interrumpir tu operación diaria.'
    },
    {
        icon: <Code2 size={32} />,
        number: 3,
        title: 'Implementación',
        description: 'Desarrollamos y configuramos tus automatizaciones, asegurando que todo funcione perfectamente antes del despliegue.'
    },
    {
        icon: <Rocket size={32} />,
        number: 4,
        title: 'Optimización',
        description: 'Monitoreamos los resultados y ajustamos continuamente para maximizar la eficiencia y el retorno de inversión.'
    }
];

const Methodology = () => {
    return (
        <section id="methodology" className="methodology">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Nuestro Proceso</h2>
                    <p className="section-subtitle">
                        Un enfoque estructurado para transformar tu negocio.
                    </p>
                </div>

                <div className="process-grid">
                    {steps.map((step, index) => (
                        <div key={step.number} className="process-card">
                            <div className="process-icon-wrapper">
                                {step.icon}
                                <div className="process-number">{step.number}</div>
                            </div>
                            <h3 className="process-title">{step.title}</h3>
                            <p className="process-description">{step.description}</p>
                            {index < steps.length - 1 && <div className="process-connector"></div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Methodology;
