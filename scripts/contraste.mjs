// Contraste WCAG entre dos colores. Acepta hexadecimales o nombres de variable
// de src/styles/index.css, para comprobar una combinación antes de pintarla.
//
//   node scripts/contraste.mjs --primary-deep "#ffffff"
//   node scripts/contraste.mjs --accent --bg-primary
//
// AA pide 4.5:1 para texto normal y 3:1 para texto grande (24px, o 18.66px en
// negritas) y para bordes, iconos y controles.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/index.css', import.meta.url), 'utf8');

const resolver = (valor, vistos = new Set()) => {
  if (!valor.startsWith('--')) return valor;
  if (vistos.has(valor)) throw new Error(`variable circular: ${valor}`);
  vistos.add(valor);
  const encontrado = css.match(new RegExp(`${valor}\\s*:\\s*([^;]+);`));
  if (!encontrado) throw new Error(`no existe ${valor} en src/styles/index.css`);
  const crudo = encontrado[1].trim();
  const anidada = crudo.match(/^var\((--[\w-]+)\)$/);
  return anidada ? resolver(anidada[1], vistos) : crudo;
};

const aRgb = (hex) => {
  const limpio = hex.replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(limpio)) throw new Error(`no es un hexadecimal sólido: ${hex}`);
  const largo = limpio.length === 3 ? [...limpio].map((c) => c + c).join('') : limpio;
  return [0, 2, 4].map((i) => parseInt(largo.slice(i, i + 2), 16) / 255);
};

const luminancia = (hex) => {
  const [r, g, b] = aRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const [a, b] = process.argv.slice(2);
if (!a || !b) {
  console.error('uso: node scripts/contraste.mjs <color o --variable> <color o --variable>');
  process.exit(2);
}

const [ca, cb] = [resolver(a), resolver(b)];
const [la, lb] = [luminancia(ca), luminancia(cb)].sort((x, y) => y - x);
const razon = (la + 0.05) / (lb + 0.05);
const veredicto = (umbral) => (razon >= umbral ? 'pasa' : 'REPRUEBA');

console.log(`${a} (${ca}) sobre ${b} (${cb}): ${razon.toFixed(2)}:1`);
console.log(`  texto normal (4.5:1): ${veredicto(4.5)}`);
console.log(`  texto grande, bordes e iconos (3:1): ${veredicto(3)}`);
