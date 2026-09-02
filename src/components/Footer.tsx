import { Instagram } from 'lucide-react';
import vireonLogo from '../assets/vireon-logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <img src={vireonLogo} alt="Vireon Logo" className="logo-img" style={{ height: '30px', width: 'auto' }} />
                            <h3>Vireon</h3>
                        </div>
                        <p>
                            Empowering businesses with intelligent automation and data-driven strategies for the AI era.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#services">Services</a></li>
                            <li><a href="#process">Process</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#roi">ROI Calculator</a></li>
                            <li><a href="#quiz">Quiz</a></li>

                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Vireon. All rights reserved.</p>
                    <a href="/aviso-de-privacidad/" className="footer-legal-link">
                        Aviso de Privacidad
                    </a>
                    <div className="social-links">
                        <a
                            href="https://www.instagram.com/vireon_consulting/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram de Vireon"
                        >
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
