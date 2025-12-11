import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import ProblemSolution from './components/ProblemSolution';
import Quiz from './components/Quiz';
import Services from './components/Services';
import Methodology from './components/Methodology';
import Authority from './components/Authority';
import ROICalculator from './components/ROICalculator';
//import ProofOfConcept from './components/ProofOfConcept';
import FAQ from './components/FAQ';
import Resources from './components/Resources';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

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
      <main>
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Quiz />
        <Services />
        <Methodology />
        <Authority />
        <ROICalculator />

        <FAQ />
        <Resources />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
