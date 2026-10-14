import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

import vireonLogo from '../assets/vireon-logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <a href="#" className="logo">
                        <img src={vireonLogo} alt="Vireon Logo" className="logo-img" />
                        <span className="logo-text">Vireon</span>
                    </a>

                    <div className="nav-links">
                        <a href="#problem" className="nav-link">Solución</a>
                        <a href="#services" className="nav-link">Servicios</a>
                        <a href="#soluciones" className="nav-link">Vireon Solutions</a>
                        <a href="#methodology" className="nav-link">Metodología</a>
                        <a href="#quiz" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 600 }}>Test de Madurez IA</a>
                        <a href="#roi" className="nav-link">Calculadora ROI</a>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }} onClick={() => document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' })}>Diagnóstico Gratis</button>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={toggleMenu}
                        aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                <a href="#problem" className="nav-link" onClick={toggleMenu}>Solución</a>
                <a href="#services" className="nav-link" onClick={toggleMenu}>Servicios</a>
                <a href="#soluciones" className="nav-link" onClick={toggleMenu}>Vireon Solutions</a>
                <a href="#methodology" className="nav-link" onClick={toggleMenu}>Metodología</a>
                <a href="#quiz" className="nav-link" onClick={toggleMenu}>Test de Madurez IA</a>
                <a href="#roi" className="nav-link" onClick={toggleMenu}>Calculadora ROI</a>
                <a href="#faq" className="nav-link" onClick={toggleMenu}>Preguntas frecuentes</a>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        toggleMenu();
                        document.getElementById('final-cta')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    Diagnóstico Gratis
                </button>
            </div>
        </>
    );
};

export default Navbar;
