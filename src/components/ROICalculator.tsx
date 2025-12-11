import { useState, useMemo } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import './ROICalculator.css';

const ROICalculator = () => {
    const [employees, setEmployees] = useState(5);
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [hourlyRate, setHourlyRate] = useState(150);

    const annualLoss = useMemo(() => {
        return employees * hoursPerWeek * hourlyRate * 52;
    }, [employees, hoursPerWeek, hourlyRate]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <section id="roi" className="roi-section">
            <div className="container roi-container">
                <div className="roi-content">
                    <h2>¿Cuánto dinero estás perdiendo hoy?</h2>
                    <p>
                        El costo de "no hacer nada" es más alto de lo que crees. Usa nuestra calculadora para estimar el impacto de la ineficiencia.
                    </p>

                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <AlertTriangle color="#FCD34D" />
                            <strong>Dato Curioso</strong>
                        </div>
                        <p style={{ fontSize: '0.95rem', margin: 0 }}>
                            Una empresa promedio pierde el 30% de sus ingresos anuales en ineficiencias operativas. (Fuente: IDC)
                        </p>
                    </div>
                </div>

                <div className="roi-calculator-card">
                    <div className="input-group">
                        <label>Número de Empleados Administrativos</label>
                        <div className="range-container">
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={employees}
                                onChange={(e) => setEmployees(parseInt(e.target.value))}
                            />
                            <span className="range-value">{employees} personas</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Horas Manuales/Repetitivas por Semana (por persona)</label>
                        <div className="range-container">
                            <input
                                type="range"
                                min="1"
                                max="40"
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                            />
                            <span className="range-value">{hoursPerWeek} horas</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Costo Promedio por Hora ($ MXN)</label>
                        <div className="range-container">
                            <input
                                type="range"
                                min="50"
                                max="1000"
                                step="50"
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                            />
                            <span className="range-value">${hourlyRate}</span>
                        </div>
                    </div>

                    <div className="roi-results">
                        <div className="roi-result-item">
                            <div className="roi-result-label">Estás perdiendo anualmente:</div>
                            <div className="roi-result-value">{formatCurrency(annualLoss)}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                                *Cálculo estimado base 52 semanas
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }}
                        onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}>
                            Recupera este dinero <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ROICalculator;
