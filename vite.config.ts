import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const desdeRaiz = (ruta: string) => fileURLToPath(new URL(ruta, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        // La landing.
        main: desdeRaiz('./index.html'),
        // El aviso de privacidad es una página aparte, no una ruta del cliente:
        // Meta exige una URL pública y permanente, y así queda como un archivo
        // real en el servidor, sin depender de reescrituras en Hostinger.
        aviso: desdeRaiz('./aviso-de-privacidad/index.html'),
        // Página de Portero (Vireon Solutions), por la misma razón: una URL real
        // que se puede compartir y abrir directo.
        portero: desdeRaiz('./soluciones/portero/index.html'),
      },
    },
  },
})
