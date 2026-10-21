import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ROICalculator from './components/ROICalculator';
import SocialProof from './components/SocialProof';
import ProblemSolution from './components/ProblemSolution';
import Solutions from './components/Solutions';
import Services from './components/Services';
import Methodology from './components/Methodology';
import Authority from './components/Authority';
import Quiz from './components/Quiz';
//import ProofOfConcept from './components/ProofOfConcept';
import FAQ from './components/FAQ';
//import Resources from './components/Resources';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

function App() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    // Select all elements to animate
    const elements = document.querySelectorAll('.animate-on-scroll, .stagger-children');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <Navbar />
      {/* La página cuenta una historia en cuatro actos. Los fondos alternan
          claro y gris en este orden (salvo FAQ y el cierre, que comparten el
          gris): si mueves una sección, revisa que no queden dos iguales juntas. */}
      <main>
        {/* 1 · El problema: la promesa, lo que cuesta no actuar, lo que gana
            quien sí lo hace y por qué a las PyMEs se les atora. */}
        <Hero />
        <ROICalculator />
        <SocialProof />
        <ProblemSolution />

        {/* 2 · La solución: primero lo que ya está hecho para un giro (Portero),
            luego lo que construimos a la medida y cómo trabajamos. */}
        <Solutions />
        <Services />
        <Methodology />

        {/* 3 · La confianza. */}
        <Authority />

        {/* 4 · La acción: el test para saber por dónde empezar, las dudas y
            el cierre. */}
        <Quiz />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default App
