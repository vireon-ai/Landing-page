import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/animations.css'
import TerminosServicio from './components/TerminosServicio.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TerminosServicio />
  </StrictMode>,
)
