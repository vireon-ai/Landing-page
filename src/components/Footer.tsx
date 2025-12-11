import { Zap, Twitter, Linkedin, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>
                            <Zap size={24} fill="currentColor" className="logo-icon" />
                            Vireon
                        </h3>
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
                            <li><a href="#">Case Studies</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Vireon. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        <a href="#" aria-label="GitHub"><Github size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
