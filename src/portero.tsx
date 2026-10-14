import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Portero from './components/Portero.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Portero />
  </StrictMode>,
)
