#!/usr/bin/env bash
# Compuerta de la landing. Da igual quién o qué modelo escribió el cambio: si
# esto no pasa, la tarjeta no se cierra y el PR no se mergea.
#
# Existe porque cada merge a main se publica solo en Hostinger y no hay staging.
# Las reglas de CLAUDE.md que se pueden comprobar con un comando están aquí, para
# que no dependan de que alguien se acuerde de ellas.
#
#   bash scripts/verificar.sh                         lint · build · peso · reglas · auditores
#   bash scripts/verificar.sh --rapido                lint · tsc · reglas (bucle corto, sin build)
#   bash scripts/verificar.sh --permitir-dependencias acepta dependencias nuevas aprobadas
#
# Compara contra origin/main (o main si no hay remoto). Incluye cambios sin commit
# y archivos nuevos sin agregar, para poder correrlo antes de hacer commit.
#
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 2

RAPIDO=0
PERMITIR_DEPS=0
for arg in "$@"; do
  case "$arg" in
    --rapido) RAPIDO=1 ;;
    --permitir-dependencias) PERMITIR_DEPS=1 ;;
    -h|--help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) printf 'opción desconocida: %s\n' "$arg" >&2; exit 2 ;;
  esac
done

FALLOS=0
paso()  { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }
ok()    { printf '  \033[32m✓ %s\033[0m\n' "$1"; }
falla() { printf '  \033[31m✗ %s\033[0m\n' "$1"; FALLOS=$((FALLOS+1)); }
avisa() { printf '  \033[33m· %s\033[0m\n' "$1"; }
lista() { printf '%s\n' "$1" | sed '/^[[:space:]]*$/d; s/^/     /'; }

TMP=$(mktemp -d 2>/dev/null || echo "${TMPDIR:-/tmp}/verificar-$$")
mkdir -p "$TMP"
trap 'rm -rf "$TMP"' EXIT

corre() { # corre <etiqueta> <comando...>
  local etiqueta="$1"; shift
  local log="$TMP/$(printf '%s' "$etiqueta" | tr -c 'a-zA-Z0-9' '-').log"
  if "$@" >"$log" 2>&1; then ok "$etiqueta"
  else falla "$etiqueta"; tail -n 30 "$log" | sed 's/^/     /'; fi
}

# ---------------------------------------------------------------------------
# Qué cambió contra main
# ---------------------------------------------------------------------------
BASE=""
for REF in origin/main main; do
  if git rev-parse --verify --quiet "$REF" >/dev/null; then
    BASE=$(git merge-base HEAD "$REF" 2>/dev/null) && BASE_ETIQUETA="$REF" && break
  fi
done

paso "Diff contra main"
if [ -z "$BASE" ]; then
  falla "no encontré origin/main ni main para comparar"
  TOCADOS=""
else
  TOCADOS=$( { git diff --name-only "$BASE" 2>/dev/null; git ls-files --others --exclude-standard; } | sort -u)
  if [ -z "$TOCADOS" ]; then avisa "sin cambios contra $BASE_ETIQUETA"
  else ok "$(printf '%s\n' "$TOCADOS" | wc -l | tr -d ' ') archivo(s) tocados contra $BASE_ETIQUETA"; lista "$TOCADOS"; fi
fi

# Líneas agregadas: las del diff y todo el contenido de los archivos nuevos.
AGREGADAS="$TMP/agregadas.txt"
: >"$AGREGADAS"
if [ -n "$BASE" ]; then
  git diff -U0 "$BASE" -- . ':(exclude)package-lock.json' 2>/dev/null \
    | awk '/^\+\+\+ /{f=substr($0,7); next} /^\+/{print f ":" substr($0,2)}' >>"$AGREGADAS"
  git ls-files --others --exclude-standard | while read -r f; do
    [ -f "$f" ] && grep -Iv '^$' "$f" 2>/dev/null | sed "s|^|$f:|" >>"$AGREGADAS"
  done
fi
agregadas_en() { grep -E "^($1):" "$AGREGADAS" || true; } # agregadas_en <regex de rutas>

# ---------------------------------------------------------------------------
# 1. Lint y tipos
# ---------------------------------------------------------------------------
paso "Lint y tipos"
corre "npm run lint" npm run lint --silent
if [ "$RAPIDO" -eq 1 ]; then
  corre "tsc -b" npx --no-install tsc -b
fi

# ---------------------------------------------------------------------------
# 2. Build y peso. Es exactamente lo que corre el deploy: si aquí falla, la
#    publicación a Hostinger también.
# ---------------------------------------------------------------------------
if [ "$RAPIDO" -eq 0 ]; then
  paso "Build (lo mismo que corre el deploy)"
  corre "npm run build" npm run build --silent

  if [ -f dist/index.html ] && [ -f dist/aviso-de-privacidad/index.html ]; then
    ok "dist/ trae las dos páginas: la landing y el aviso"
  else
    falla "falta dist/index.html o dist/aviso-de-privacidad/index.html: alguna página no entró al build"
  fi

  paso "Presupuesto de peso"
  # 100 KB gzip de JS en total. Hoy son ~81 KB. El sitio se vende rápido y eso
  # no se negocia: el movimiento va en CSS y SVG, no en librerías.
  JS_GZIP=$(node -e '
    const fs=require("fs"),z=require("zlib"),p=require("path");
    const d="dist/assets"; let t=0;
    for (const f of fs.existsSync(d)?fs.readdirSync(d):[]) if (f.endsWith(".js")) t+=z.gzipSync(fs.readFileSync(p.join(d,f))).length;
    process.stdout.write(String(Math.round(t/1024)));')
  if [ "${JS_GZIP:-0}" -le 100 ]; then ok "JavaScript total: ${JS_GZIP} KB gzip (tope 100 KB)"
  else falla "JavaScript total: ${JS_GZIP} KB gzip, rebasa el tope de 100 KB"; fi

  GRANDES=$(find dist public -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' -o -name '*.gif' -o -name '*.ico' -o -name '*.svg' -o -name '*.mp4' \) -size +150k 2>/dev/null)
  if [ -n "$GRANDES" ]; then
    # Un archivo grande que ya estaba en main avisa; uno que trae este diff falla.
    NUEVOS_GRANDES=""
    for f in $(find public src/assets -type f -size +150k 2>/dev/null); do
      printf '%s\n' "$TOCADOS" | grep -qxF "$f" && NUEVOS_GRANDES="$NUEVOS_GRANDES$f"$'\n'
    done
    if [ -n "$NUEVOS_GRANDES" ]; then falla "este diff agrega o modifica archivos de más de 150 KB:"; lista "$NUEVOS_GRANDES"
    else avisa "archivos de más de 150 KB que ya estaban en main (no bloquean):"; lista "$GRANDES"; fi
  else
    ok "ningún archivo de imagen o video pasa de 150 KB"
  fi
fi

# ---------------------------------------------------------------------------
# 3. Reglas de CLAUDE.md
# ---------------------------------------------------------------------------
paso "Reglas del sitio"

# Tema claro, siempre.
OSCURO=$(agregadas_en 'src/.*|index\.html|aviso-de-privacidad/.*' | grep -E 'prefers-color-scheme|data-theme|theme-toggle|modo-oscuro|dark-mode' || true)
if [ -n "$OSCURO" ]; then falla "el sitio es de tema claro siempre; este diff agrega soporte de tema oscuro:"; lista "$OSCURO"
else ok "tema claro: nada de prefers-color-scheme ni interruptor de tema"; fi

# Colores solo por variable. Se mide sobre lo agregado: lo viejo es deuda aparte.
HEX=$(agregadas_en 'src/components/.*\.(css|tsx)|src/App\.(css|tsx)' | grep -E '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?([^0-9a-zA-Z_-]|$)' | grep -vE 'href="#|href=\{?.#' || true)
if [ -n "$HEX" ]; then falla "hexadecimales sueltos en componentes; usa las variables de src/styles/index.css:"; lista "$HEX"
else ok "sin hexadecimales nuevos en componentes"; fi

# Lo interactivo es un elemento interactivo.
DIVCLICK=$(agregadas_en 'src/.*\.tsx' | grep -E '<(div|span|li|section|article)[^>]*onClick' || true)
if [ -n "$DIVCLICK" ]; then falla "onClick en un elemento que no es interactivo; usa <button> o <a>:"; lista "$DIVCLICK"
else ok "sin onClick en div/span/li"; fi

# Los webhooks de n8n se conservan intactos.
for HOOK in "e1a1bbba-2b28-4a2a-8942-cb434cd6d280:Quiz.tsx (test)" "a118b68a-92f9-463a-8609-b9f48e9d5b04:FinalCTA.tsx (cierre)"; do
  ID=${HOOK%%:*}; DONDE=${HOOK#*:}
  if grep -rqF "$ID" src; then ok "webhook de n8n de $DONDE sigue en src/"
  else falla "desapareció el webhook de n8n de $DONDE ($ID): los leads dejarían de llegar"; fi
done

# Todo formulario que pide datos enseña la liga al aviso. Solo cuentan los
# componentes que algún archivo importa (un import comentado no se publica).
SIN_AVISO=""
for f in $(grep -rlE '<form|type="email"|type="tel"' src --include='*.tsx' 2>/dev/null); do
  case "$f" in *AvisoPrivacidad*) continue ;; esac
  NOMBRE=$(basename "$f" .tsx)
  grep -rqE "^[[:space:]]*import [^;]*['\"][./a-zA-Z]*/$NOMBRE['\"]" src || continue
  grep -q 'aviso-de-privacidad' "$f" || SIN_AVISO="$SIN_AVISO$f"$'\n'
done
if [ -n "$SIN_AVISO" ]; then falla "formularios que piden datos sin liga al aviso de privacidad junto al envío:"; lista "$SIN_AVISO"
else ok "cada formulario enseña la liga al aviso de privacidad"; fi

# El aviso dice lo mismo en markdown y en el componente.
MD=docs/legal/aviso-de-privacidad.md; TSX=src/components/AvisoPrivacidad.tsx
TOCA_MD=$(printf '%s\n' "$TOCADOS" | grep -cxF "$MD" || true)
TOCA_TSX=$(printf '%s\n' "$TOCADOS" | grep -cxF "$TSX" || true)
if [ "$TOCA_MD" != "$TOCA_TSX" ]; then
  falla "el aviso cambió solo en un lado ($MD: $TOCA_MD, $TSX: $TOCA_TSX); los dos tienen que decir lo mismo"
else
  ok "aviso: markdown y componente se tocaron juntos (o ninguno)"
fi
FECHA_MD=$(sed -n 's/^\*\*Última actualización:\*\* *//p' "$MD" | head -1)
FECHA_TSX=$(sed -n "s/^const ACTUALIZADO = '\(.*\)';/\1/p" "$TSX" | head -1)
VER_MD=$(sed -n 's/^\*\*Versión:\*\* *//p' "$MD" | head -1)
VER_TSX=$(grep -oE 'Versión [0-9.]+' "$TSX" | head -1 | sed 's/Versión //')
if [ -n "$FECHA_MD" ] && [ "$FECHA_MD" = "$FECHA_TSX" ] && [ "$VER_MD" = "$VER_TSX" ]; then
  ok "aviso: misma fecha ($FECHA_MD) y versión ($VER_MD) en los dos"
else
  falla "aviso: fecha o versión distintas — markdown \"$FECHA_MD\" v$VER_MD, componente \"$FECHA_TSX\" v$VER_TSX"
fi

# Si llega analítica, el aviso ya no puede decir que no hay seguimiento.
if grep -rqE 'googletagmanager|gtag\(|clarity\.ms|fbq\(|posthog' src index.html 2>/dev/null \
   && grep -q 'no usa cookies ni tecnologías de seguimiento' "$TSX"; then
  falla "hay analítica en el sitio y el §13 del aviso sigue diciendo que no usa cookies ni seguimiento"
else
  ok "analítica y §13 del aviso no se contradicen"
fi

# Cada página real entra al build.
PAGINAS=$(git ls-files --cached --others --exclude-standard -- '*index.html' | grep -vE '^(docs|dist|node_modules|\.claude)/' )
FALTAN=""
for p in $PAGINAS; do
  [ "$p" = "index.html" ] && patron="'./index.html'" || patron="'./$p'"
  grep -qF "$patron" vite.config.ts || FALTAN="$FALTAN$p"$'\n'
done
if [ -n "$FALTAN" ]; then falla "páginas que no están en build.rollupOptions.input de vite.config.ts (no se publicarían):"; lista "$FALTAN"
else ok "las $(printf '%s\n' "$PAGINAS" | wc -l | tr -d ' ') página(s) están declaradas en vite.config.ts"; fi
if grep -qE "base: *'\./'" vite.config.ts; then ok "base: './' sigue en vite.config.ts"
else falla "vite.config.ts ya no tiene base: './'; el aviso depende de rutas relativas"; fi

# Sin dependencias nuevas sin aprobación.
if [ -n "$BASE" ]; then
  NUEVAS=$(node -e '
    const {execSync}=require("child_process");
    const viejo=JSON.parse(execSync("git show '"$BASE"':package.json").toString());
    const nuevo=require("./package.json");
    const k=o=>Object.keys({...(o.dependencies||{}),...(o.devDependencies||{})});
    const antes=new Set(k(viejo));
    process.stdout.write(k(nuevo).filter(d=>!antes.has(d)).join("\n"));' 2>/dev/null)
  if [ -z "$NUEVAS" ]; then ok "sin dependencias nuevas"
  elif [ "$PERMITIR_DEPS" -eq 1 ]; then avisa "dependencias nuevas aceptadas con --permitir-dependencias (van en el PR con quién las aprobó):"; lista "$NUEVAS"
  else falla "dependencias nuevas sin aprobación (si la tarjeta o la persona las aprobó, corre con --permitir-dependencias):"; lista "$NUEVAS"; fi
fi

# Sin secretos en el código.
ENV_NUEVOS=$(printf '%s\n' "$TOCADOS" | grep -E '(^|/)\.env($|\.)' | grep -vE '\.env\.example$' || true)
SECRETOS=$(grep -iE "(password|passwd|secret|api[_-]?key|token|ftp_)[a-z_]*['\"]? *[:=] *['\"][^'\"]{8,}" "$AGREGADAS" || true)
if [ -n "$ENV_NUEVOS$SECRETOS" ]; then falla "posibles credenciales en el diff (las de FTP viven en los secrets de GitHub):"; lista "$ENV_NUEVOS$SECRETOS"
else ok "sin credenciales ni archivos .env en el diff"; fi

# ---------------------------------------------------------------------------
# 4. Qué auditores exige este diff
# ---------------------------------------------------------------------------
paso "Auditorías que exige este diff"
AUDITORES=""
{ printf '%s\n' "$TOCADOS" | grep -qE '^(src/components/(Quiz|FinalCTA|AvisoPrivacidad)\.tsx|src/config\.ts|src/aviso\.tsx|docs/legal/|index\.html)'; } \
  || grep -qE 'fetch\(|localStorage|sessionStorage|gtag|clarity|dataLayer' "$AGREGADAS" \
  && AUDITORES="${AUDITORES}auditor-leads (formularios, envío de datos, analítica o el aviso)"$'\n'
printf '%s\n' "$TOCADOS" | grep -qE '^src/(components/.*\.(tsx|css)|styles/|App\.(tsx|css)|index\.css)' \
  && AUDITORES="${AUDITORES}auditor-accesibilidad (componentes o estilos)"$'\n'
printf '%s\n' "$TOCADOS" | grep -qE '^(src/components/.*\.tsx|src/App\.tsx|index\.html|aviso-de-privacidad/index\.html|docs/legal/)' \
  && AUDITORES="${AUDITORES}auditor-contenido (texto visible)"$'\n'
printf '%s\n' "$TOCADOS" | grep -qE '^(package(-lock)?\.json|vite\.config\.ts|index\.html|aviso-de-privacidad/index\.html|public/|src/assets/|src/main\.tsx|\.github/workflows/)' \
  && AUDITORES="${AUDITORES}auditor-rendimiento (build, dependencias, assets o metadatos)"$'\n'

if [ -n "$AUDITORES" ]; then
  avisa "este diff NO se cierra sin estos subagentes:"
  lista "$AUDITORES"
else
  ok "ningún auditor requerido: el diff no toca el sitio publicado"
fi

printf '\n'
if [ "$FALLOS" -eq 0 ]; then
  printf '\033[32mTodo en verde.\033[0m\n'; exit 0
else
  printf '\033[31m%s comprobación(es) fallaron. La tarjeta no se cierra.\033[0m\n' "$FALLOS"; exit 1
fi
