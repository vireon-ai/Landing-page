import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/animations.css'
import AvisoPrivacidad from './components/AvisoPrivacidad.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AvisoPrivacidad />
  </StrictMode>,
)
