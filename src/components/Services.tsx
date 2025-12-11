import { useState } from 'react';
import { Bot, BarChart3, Workflow, ArrowRight, CheckCircle2 } from 'lucide-react';
import './Services.css';

const industries = [
    { id: 'retail', label: 'Retail & E-commerce', processes: ['Gestión de inventario', 'Atención al cliente 24/7', 'Procesamiento de pedidos'] },
    { id: 'services', label: 'Servicios Profesionales', processes: ['Onboarding de clientes', 'Generación de contratos', 'Agendamiento de citas'] },
    { id: 'manufacturing', label: 'Manufactura', processes: ['Mantenimiento predictivo', 'Control de calidad visual', 'Logística'] },
    { id: 'finance', label: 'Finanzas & Seguros', processes: ['Detección de fraude', 'Análisis de riesgo', 'Procesamiento de facturas'] }
];

const services = [
    {
        icon: <Workflow size={32} />,
        title: 'Automatización de Procesos',
        description: 'Elimina tareas repetitivas conectando tus aplicaciones actuales (CRM, ERP, Email) para que trabajen solas.',
        benefits: ['Ahorra 20+ horas/semana', '0 errores humanos', 'Escalabilidad inmediata']
    },
    {
        icon: <Bot size={32} />,
        title: 'Agentes de IA Personalizados',
        description: 'Chatbots y asistentes virtuales entrenados con TU información para atender clientes o empleados 24/7.',
        benefits: ['Respuestas instantáneas', 'Soporte multilingüe', 'Aprendizaje continuo']
    },
    {
        icon: <BarChart3 size={32} />,
        title: 'Dashboards Inteligentes',
        description: 'Visualiza tus KPIs en tiempo real y recibe alertas predictivas antes de que ocurran problemas.',
        benefits: ['Toma de decisiones basada en datos', 'Reportes automáticos', 'Visibilidad total']
    }
];

const Services = () => {
    const [activeTab, setActiveTab] = useState('retail');

    const activeIndustry = industries.find(i => i.id === activeTab);

    return (
        <section id="services" className="services">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">Soluciones que Escalan Contigo</h2>
                    <p className="section-subtitle">
                        Tecnología enterprise adaptada a la agilidad de tu PyME.
                    </p>
                </div>

                <div className="services-tabs">
                    {industries.map(industry => (
                        <button
                            key={industry.id}
                            className={`tab-btn ${activeTab === industry.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(industry.id)}
                        >
                            {industry.label}
                        </button>
                    ))}
                </div>

                <div className="industry-processes">
                    <h4>Procesos típicos que automatizamos en {activeIndustry?.label}</h4>
                    <div className="process-tags">
                        {activeIndustry?.processes.map((process, idx) => (
                            <span key={idx} className="process-tag">{process}</span>
                        ))}
                    </div>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-icon-wrapper">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <ul className="service-benefits">
                                {service.benefits.map((benefit, idx) => (
                                    <li key={idx}><CheckCircle2 size={16} color="var(--primary)" /> {benefit}</li>
                                ))}
                            </ul>
                            <button
                                className="btn btn-secondary"
                                style={{ width: '100%', marginTop: 'auto' }}
                                onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Conocer más <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
