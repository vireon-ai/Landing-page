# Landing page de Vireon

Sitio público de Vireon. React 19 + TypeScript + Vite 7.

## Publicación — leer antes de cambiar nada

Cada push a `main` publica el sitio en automático. El workflow
`.github/workflows/deploy.yml` corre `npm ci` y `npm run build` en GitHub Actions
y sube la carpeta `dist/` por FTP a Hostinger. **No hay ambiente de staging.**

- `npm run build` corre `tsc -b` primero: un error de TypeScript cancela la
  publicación completa. Corre `npm run build` y confirma que pasa antes de
  proponer un commit.
- Nunca escribas credenciales en el código. Las de FTP viven como secrets del
  repositorio en GitHub.
- Para cambios grandes, propón trabajar en una rama y abrir un PR en vez de
  empujar directo a `main`.

## Estructura

- `src/App.tsx` — define el orden de las secciones de la página.
- `src/components/` — una sección por componente, cada uno con su `.css` del
  mismo nombre: Navbar, Hero, ProblemSolution, Services, Methodology,
  ProofOfConcept, ROICalculator, Quiz, Authority, SocialProof, Resources, FAQ,
  FinalCTA, Footer.
- `src/styles/index.css` — variables de marca y estilos globales.
- `src/assets/` — logos e imágenes que importa el código.
- `public/` — archivos que se sirven tal cual (favicon).

## Sistema de diseño

Usa siempre las variables CSS de `src/styles/index.css`. No metas hexadecimales
sueltos en los componentes.

- Colores: `--primary` #48A9A6 (turquesa), `--secondary` #4281A4 (azul),
  `--accent` #E4CC37 (amarillo)
- Tipografías: Outfit para títulos, Inter para texto corrido
- Espaciado, radios y sombras: variables `--spacing-*`, `--radius-*`, `--shadow-*`

## Convenciones

- Componentes en TypeScript (`.tsx`), con su CSS en un archivo hermano.
- Todo el contenido visible de la página va en español.
- Mensajes de commit en español y en presente: "Actualiza el copy del hero".
- La landing debe verse bien desde 320px de ancho.

## Antes de dar por terminado un cambio

1. `npm run dev` y revisa el resultado en http://localhost:5173
2. `npm run lint`
3. `npm run build`
