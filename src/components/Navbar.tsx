import { useState, useEffect, useRef } from 'react';
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

    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);

    // Con el menú abierto: el foco entra a la primera liga, Escape lo cierra y
    // regresa el foco al botón, y Tab no se escapa al contenido que el menú tapa.
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const ligas = () => [...(mobileNavRef.current?.querySelectorAll<HTMLElement>('a, button') ?? [])];
        ligas()[0]?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false);
                menuButtonRef.current?.focus();
            } else if (e.key === 'Tab' && !e.shiftKey && document.activeElement === ligas().at(-1)) {
                e.preventDefault();
                menuButtonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <a href="#" className="logo">
                        <img src={vireonLogo} alt="" className="logo-img" />
                        <span className="logo-text">Vireon</span>
                    </a>

                    <div className="nav-links">
                        {/* Portero va primero y destacado: es la solución que más
                            queremos empujar. El resto sigue el orden de la página. */}
                        <a href="/soluciones/portero/" className="nav-link nav-link--portero">
                            <span className="nav-link-punto" aria-hidden="true" />
                            Portero
                        </a>
                        <a href="#roi" className="nav-link">Calculadora ROI</a>
                        <a href="#services" className="nav-link">Servicios</a>
                        <a href="#methodology" className="nav-link">Metodología</a>
                        <a href="#quiz" className="nav-link">Test de madurez en IA</a>
                        {/* Liga y no botón: así el foco también baja al cierre. */}
                        <a href="#final-cta" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Diagnóstico gratuito</a>
                    </div>

                    <button
                        ref={menuButtonRef}
                        className="mobile-menu-btn"
                        onClick={toggleMenu}
                        aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Overlay. Cerrado queda fuera de pantalla con
                transform; inert lo saca del orden de Tab y del lector de pantalla. */}
            <div
                ref={mobileNavRef}
                className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}
                inert={!isMobileMenuOpen}
            >
                <a href="/soluciones/portero/" className="nav-link nav-link--portero" onClick={toggleMenu}>
                    <span className="nav-link-punto" aria-hidden="true" />
                    Portero
                </a>
                <a href="#roi" className="nav-link" onClick={toggleMenu}>Calculadora ROI</a>
                <a href="#services" className="nav-link" onClick={toggleMenu}>Servicios</a>
                <a href="#methodology" className="nav-link" onClick={toggleMenu}>Metodología</a>
                <a href="#quiz" className="nav-link" onClick={toggleMenu}>Test de madurez en IA</a>
                <a href="#faq" className="nav-link" onClick={toggleMenu}>Preguntas frecuentes</a>
                <a href="#final-cta" className="btn btn-primary" onClick={toggleMenu}>
                    Diagnóstico gratuito
                </a>
            </div>
        </>
    );
};

export default Navbar;
