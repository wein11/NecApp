# NecApp landing: guía de traspaso para otro LLM

Este documento resume todo lo necesario para seguir trabajando en el sitio de NecApp sin repetir decisiones ya tomadas. Leelo completo antes de tocar código.

## 1. Reglas del usuario (obligatorias)

- **Prohibido el carácter de raya larga** (U+2014) en cualquier texto, código, comentario, commit o documento. Usar dos puntos, comas o paréntesis. Verificar con `LC_ALL=C.UTF-8 grep -rnP "\x{2014}" src docs *.md` antes de cada commit.
- El usuario habla **español rioplatense** (voseo). Responderle en español.
- Antes de diseñar o animar, el usuario pidió **usar las skills instaladas** en `.claude/skills/` (ver sección 11).
- No inventar datos: clientes, testimonios, cifras, certificaciones, precios. Lo que falta va como placeholder marcado `PENDIENTE` o se omite.
- Lenguaje regulatorio: los productos NeuroEars **asisten** al profesional. Nunca escribir que "diagnostican", "curan" o "tratan".

## 2. El negocio

- **NecApp** es **distribuidor oficial** (con licencia de venta) de software médico en Latinoamérica. Es una empresa de **Necod Argentina SRL**.
- Productos actuales (van a sumar más, así que el mensaje general no debe atarse a estos):
  - **Vicon Nexus**: captura y procesamiento de movimiento 3D (cámaras Vicon, plataformas de fuerza, EMG, video; modelos Plug-in Gait y CGM2). Análisis clínico de marcha, biomecánica, deporte, ergonomía.
  - **Vicon Polygon**: informes clínicos de marcha a partir de datos de Nexus.
  - **NeuroEars Anna**: software médico Clase II de evaluación vestibular con visor VR (HMD) con cámara ocular. Pruebas basales, posicionales, oculomotoras, VVS/HVS, calórica, agudeza visual dinámica y vHIT (prueba de impulso cefálico, vista en las capturas; pedir al usuario que confirme que está en la versión que venden).
  - **NeuroEars Thera**: rehabilitación vestibular con visor VR, ejercicios de estabilidad de la mirada verificados por seguimiento ocular, cuestionarios DHI, VADL y V-Screen 9 con puntaje asistido por IA. Herramienta complementaria, no diagnostica.
- Relato: **Anna evalúa, Thera rehabilita; Vicon mide el movimiento.**
- Todos los productos tienen **registro ANMAT** (números pendientes).
- Ventas reales: Anna al Hospital Italiano, Thera a un profesional particular. **Sin autorización para nombrarlos**: usar "Ya en uso en hospitales de referencia de Buenos Aires" hasta que la haya.
- Posicionamiento: socio local "llave en mano" (instalación, capacitación, soporte en el idioma del cliente). Sin confirmar: si venden hardware, modelo de licencia, modalidad de demo. No afirmarlos.

Más detalle: `PRODUCT.md` y `docs/brief-landing.md` (resultado de la entrevista inicial con el usuario).

## 3. Público, idiomas y conversión

- Público (los cuatro): hospitales y centros de rehabilitación, universidades e investigación, deporte y alto rendimiento, profesionales independientes.
- Idiomas: **español neutro con tuteo** (principal, sin prefijo de URL), **inglés** (`/en/`) y **portugués** (`/pt/`). Adaptar, no traducir literal.
- Acciones, en este orden de prioridad: Solicitar demo (principal), WhatsApp flotante, Pedir cotización (en cada producto, con el producto preseleccionado), Descargar folleto (a cambio del email).

## 4. Stack y comandos

| Pieza | Versión |
|---|---|
| Astro | 5.18 (salida estática, i18n nativo) |
| @astrojs/react | **4.x** (la 7.x no funciona con Astro 5: rompe el render con "React is not defined") |
| React / React DOM | 18.3 |
| GSAP (+ ScrollTrigger) | 3.15 |
| motion | 14.6 (lo usa RotatingText) |
| @astrojs/sitemap | 3.7 |
| Fuentes | @fontsource-variable/lexend y /literata (servidas localmente) |

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
```

`tsconfig.json` tiene `"jsx": "react-jsx"` y `"jsxImportSource": "react"`; sin eso falla el build de los .jsx.

## 5. Estructura

```
src/
  config.ts              WhatsApp, email, clave Web3Forms, GA4, píxeles, ANMAT, datos de Necod (casi todo PENDIENTE)
  i18n/es.ts en.ts pt.ts Todos los textos. en/pt tipan contra es (type Dict). Cambiar los 3 siempre.
  i18n/index.ts          langs, rutas (homePath, productPath), htmlLang
  i18n/stage.ts          Textos del monitor ya resueltos para pasarlos a React
  data/media.ts          Qué imagen va en cada lugar (fotos, galerías, pila de productos, logos)
  data/clientes.ts       Testimonios: vacío; la sección no se muestra mientras esté vacío
  layouts/Base.astro     <head> (SEO, hreflang, OG, JSON-LD), header, footer, WhatsApp flotante, aviso de cookies
  views/Home.astro       La home (se usa desde las 3 páginas de idioma)
  views/Product.astro    Ficha de producto (se usa desde las 3 rutas [slug])
  pages/                 index, en/index, pt/index, productos/[slug], en/products/[slug], pt/produtos/[slug], 404
  components/            Header, Footer, LeadForm (Astro)
  components/react/      Stage (monitor), componentes React Bits y sus envoltorios
  scripts/signals.ts     Generación de las señales del monitor (marcha, nistagmo, fijación, pulso)
  scripts/forms.ts       Validación y envío a Web3Forms, eventos GA4
  scripts/consent.ts     Banner de cookies; GA4 solo carga si se acepta
  scripts/main.ts        Inicializa forms, consent y el menú del teléfono
  styles/global.css      Tokens de color y tipografía, botones, utilidades
public/
  brand/                 Logos NecApp (webp), logos Vicon (svg blanco y azul), og.png, favicon
  img/                   Fotos y capturas optimizadas (ver sección 8)
  .htaccess              404, caché y cabeceras para el hosting Apache de DonWeb
Necapp/                  Originales que subió el usuario (no se sirven)
docs/brand/              Logo original y PNG maestros
```

Rutas generadas: `/`, `/en/`, `/pt/` y `/productos|/en/products|/pt/produtos` + `anna|thera|nexus|polygon`. Las anclas de la home son iguales en todos los idiomas: `#soluciones`, `#para-quien`, `#como-trabajamos`, `#nosotros`, `#contacto`.

## 6. Diseño (no cambiar sin pedirlo)

Fuente de verdad: `DESIGN.md` y `docs/surfaces/landing.md`.

- **Colores del logo**: azul marino `#032A5F` (tinta, monitor, secciones oscuras) y turquesa `#039E8A` (acción principal). Papel `#F3F6F8`, escalón de tono `#E4EBF1`, turquesa para links sobre papel `#00705F`, turquesa claro sobre azul `#4CC9B4`. Sobre el turquesa de marca el texto va en `#021E45`, nunca blanco (no llega a AA).
- **Tipografía**: Lexend (títulos) y Literata (texto). Escala en `global.css`: 15 / 20 / 24 / 32 / 52 / 56 px aprox.
- **Composición "split stage"**: columna de lectura a la izquierda y **monitor fijo azul marino a la derecha** (`Stage.jsx`), `position: sticky` bajo el header. El trazo turquesa (el pulso de la "A" del logo) cambia según la sección que se lee: pulso, marcha (Vicon), nistagmo (Anna), fijación VOR x1 (Thera), informe izquierda/derecha (Polygon). Se puede deslizar sobre la curva para leer valores. Las señales son **ilustrativas** y lo dicen en pantalla.
- En teléfono el monitor queda arriba (56svh) y el contenido se desliza por encima.
- Esquinas rectas, sin degradados, sin sombras en reposo (salvo elementos flotantes), sin etiquetas pequeñas sobre los títulos, sin numeración 01/02/03.
- Las fotos de Vicon se muestran en **duotono azul a turquesa claro** (generadas desde los originales naranjas). El usuario no lo pidió explícitamente; si quiere el naranja original, regenerarlas desde `Necapp/`.

## 7. Animaciones

Feedback del usuario: **le gusta el monitor de la derecha**; **no le gustaron las animaciones anteriores de la columna izquierda** (se eliminaron). Pidió usar estos componentes de **React Bits** (código provisto por el usuario, ahora en `src/components/react/`):

| Componente | Dónde | Envoltorio |
|---|---|---|
| TextType | Título del hero: "Software médico" fijo + segunda línea que se escribe y rota | `HeroTitle.jsx` |
| CardSwap | Sección "Nuestros productos": pila de tarjetas con capturas reales | `ProductStack.jsx` |
| RotatingText | Título de "Para quién": "Para hospitales / universidades / ..." | `AudienceTitle.jsx` |
| ScrollReveal | Primer párrafo de "Quiénes somos" | `RevealText.jsx` |
| AnimatedContent | Entrada de bloques (32px, 0.9s, escalonado 80ms, una vez) | se usa directo desde Astro |

Modificaciones hechas al código original de React Bits (mantenerlas):

- El documento de Google Docs del usuario rompió algunos template strings (`${...}` sin llaves). Se corrigieron en CardSwap (key y transform) y ScrollReveal (translateY).
- **CardSwap**: se quitó `@hugeicons` (solo lo usaban las tarjetas de ejemplo), se agregó el tema `necapp` (tarjetas azul marino) y la prop `ariaLabel`.
- **ScrollReveal**: prop `as` (default `h2`); se usa como `p`.
- **AnimatedContent**: ya no pone `visibility: hidden` inline (el contenido sería invisible sin JavaScript). Usa `data-ac` y la regla `.js [data-ac] { visibility: hidden }` de `global.css`; la clase `js` la agrega un script inline en `Base.astro`. Además, como Astro envuelve los hijos de una isla en `<astro-slot>`, anima los hijos reales de ese elemento.
- Desde Astro, a un componente React se le pasa `className`, no `class`.
- Los componentes que parten texto (ScrollReveal) necesitan recibir un string: por eso existen los envoltorios con prop `text`. Pasar texto como children desde Astro llega como HTML y no se parte.
- El lint de taste-skill marca degradados, sombras y violeta dentro del código de React Bits: son opciones que no se usan o se sobrescriben. La página renderizada pasa el inspector. No "arreglar" el código de terceros sin motivo.

## 8. Imágenes (kit de los fabricantes)

Asignación en `src/data/media.ts`; originales en `Necapp/`; optimizadas a webp en `public/img/`.

- `anna.webp`, `thera.webp`: foto de producto con paciente (se les recortó arriba la franja con el logo).
- `anna_en_1..5`, `thera_en_1..5`: capturas reales del software. Sus leyendas están en `i18n` (`product.pages[slug].gallery`, mismo orden).
- `vicon1, 4, 6, 7, 8, 10, 11`: fotos Vicon en duotono. `vicon2` (cámara Valkyrie) y `vicon3` (render de hardware, sin uso) sin tocar. `polygon1`: captura de Polygon.
- Logos: `brand/vicon-navy.svg`, `brand/vicon-white.svg`, `img/neuroears.webp`, `img/neuroearsannalogo.webp`, `img/neurearstheralogo.webp`.
- El logo de NecApp es raster (pendiente de vectorizar). `logo-mark` es la versión sin el slogan; `logo-light` es la versión clara para fondos azul marino.

## 9. Formularios, analítica y SEO

- Formularios (`LeadForm.astro`, variantes `contact`, `quote`, `brochure`) envían por POST/JSON a **Web3Forms**. Mientras `web3formsKey` sea `PENDIENTE`, muestran un aviso para escribir por WhatsApp o email. Honeypot `botcheck`.
- GA4: solo con consentimiento. Eventos `generate_lead` (formulario enviado) y `contact_whatsapp`. Píxeles de Meta y LinkedIn preparados pero vacíos.
- SEO: un H1 por página, canonical, hreflang (es, en, pt-BR, x-default), sitemap, JSON-LD Organization, SoftwareApplication y BreadcrumbList, meta descripciones de 160 caracteres o menos, `og.png` 1200x630. El `site` en `astro.config.mjs` es `https://necapp.com.ar` (dominio aún no comprado).

## 10. Publicación

- **Repo**: `wein11/NecApp`. Rama de trabajo y por defecto: `claude/jolly-goldberg-uwfys2` (no hay `main` todavía).
- **Revisión**: Vercel importando el repo (detecta Astro solo). Se le explicó al usuario cómo hacerlo; no confirmó si ya lo hizo.
- **Producción**: hosting de **DonWeb** (donde tienen sus otros sitios). Workflow `.github/workflows/deploy-donweb.yml`: build y subida de `dist/` por FTPS con `SamKirkland/FTP-Deploy-Action`, en push a `main`. Necesita los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR`; sin ellos compila pero no publica. Nunca pedir credenciales por chat.

## 11. Skills instaladas (`.claude/skills/`)

claude-webkit (frontend-design, ui-ux-pro-max, apple-design, emil-design-eng, web-design-guidelines, building-components, shadcn-ui, animate, animation-vocabulary, improve-animations, review-animations, find-animation-opportunities, prototype, seo-audit, vercel-deploy, vercel-react-best-practices, playwright-cli, chrome-bridge-automation, deep-research, humanizer, web-reader), impeccable, taste-skill, gsap-* (core, timeline, scrolltrigger, react, frameworks, plugins, utils, performance) y grill-me.

- `grill-me`, `review-animations` y `prototype` tienen `disable-model-invocation`: solo los puede lanzar el usuario con `/nombre`.
- **taste-skill**: dirección elegida "split-stage" (semilla 1305817764). Su `direction.json` quedó con otra tipografía en el sorteo: el aviso `font-not-dealt` es esperado (se cambió a Lexend por coherencia con el logo, documentado en `docs/surfaces/landing.md`).
- **impeccable**: `PRODUCT.md` y `DESIGN.md` existen; el sorteo de dirección corrió sin red (sin desafiantes).

## 12. Cómo verificar (este entorno en la nube)

- El inspector de taste-skill necesita Chrome sin sandbox (corre como root). Crear un envoltorio:
  ```bash
  printf '#!/bin/sh\nexec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox "$@"\n' > /ruta/chrome.sh && chmod +x /ruta/chrome.sh
  npx astro build && npx astro preview --port 4321   # en segundo plano
  CHROME_PATH=/ruta/chrome.sh node .claude/skills/taste-skill/scripts/inspect.mjs http://localhost:4321/
  ```
  Inspeccionar siempre una URL servida, no `dist/index.html` (con archivo local no carga CSS ni imágenes).
- Estado al traspaso: home y fichas con **0 FAIL**. Avisos aceptados: sin video, `font-not-dealt`, y `hero-words` (cuenta las 4 frases del TextType como un solo título).
- Detector de impeccable: `.claude/skills/impeccable/scripts/impeccable detect --json src` (solo marca un easing de rebote en un efecto de TextType que no se usa).
- La red del entorno **bloquea** vicon.com y neuroears.co.kr. La búsqueda de imágenes de taste-skill (`assets.mjs`) tampoco tiene salida.

## 13. Pendientes

Del usuario (bloquean la publicación):
- Número de WhatsApp y email comercial (`src/config.ts`).
- Clave de Web3Forms (`src/config.ts`).
- Dominio (comprar en DonWeb; recomendado necapp.com.ar y necapp.com) y actualizar `astro.config.mjs` y `public/robots.txt`.
- Secrets de FTP en GitHub.

Del usuario (no bloquean):
- Logo vectorizado (SVG).
- Números de registro ANMAT (`anmat` en `src/config.ts`; sin número se muestra "Registrado en ANMAT").
- Datos de Necod: actividad, año, ciudad (`company` en `src/config.ts`).
- Folletos PDF (hoy el formulario de folleto promete enviarlo por email).
- ID de GA4.
- Autorizaciones para testimonios (`src/data/clientes.ts`).
- Confirmar: vHIT en Anna, "PC con Windows" en Polygon, alcance real de "Cómo trabajamos", y si prefiere las fotos de Vicon en naranja original.

Técnicos sugeridos:
- La isla de RotatingText pesa unos 160 KB por `motion`; si importa el peso, reescribirla con GSAP.
- No hay video en el sitio; si el kit trae uno, sumarlo como loop silencioso.

## 14. Historial de decisiones

1. Entrevista inicial (grill-me) con el usuario: todo lo de las secciones 2 y 3.
2. Primera versión en Astro puro con ilustraciones propias de interfaz.
3. Feedback: "se siente rara" por **falta de fotos**; no le gustaron las animaciones de la izquierda; sí las del monitor. Pidió React y los componentes de React Bits.
4. Versión actual: Astro + islas React, componentes React Bits, imágenes reales del kit, ilustraciones de interfaz reemplazadas por capturas reales.
