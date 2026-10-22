# NecApp: sitio web

Landing de NecApp, distribuidor oficial de Vicon y NeuroEars en Latinoamérica. Sitio estático hecho con [Astro](https://astro.build) y componentes [React](https://react.dev) (incluidos componentes de [React Bits](https://reactbits.dev)), con animaciones de [GSAP](https://gsap.com) y Motion, en español, inglés y portugués.

## Páginas

| Idioma | Inicio | Productos |
|---|---|---|
| Español | `/` | `/productos/anna/`, `/productos/thera/`, `/productos/nexus/`, `/productos/polygon/` |
| Inglés | `/en/` | `/en/products/...` |
| Portugués | `/pt/` | `/pt/produtos/...` |

## Uso

```bash
npm install
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera el sitio en dist/
npm run preview  # sirve dist/ para revisarlo
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| WhatsApp, email, clave del formulario, Google Analytics | `src/config.ts` |
| Números de registro ANMAT | `src/config.ts` |
| Año de fundación y ciudad de Necod | `src/config.ts` |
| Textos en español / inglés / portugués | `src/i18n/es.ts`, `en.ts`, `pt.ts` |
| Clientes y testimonios (solo con autorización) | `src/data/clientes.ts` |
| Logo | `public/brand/` (originales en `docs/brand/`) |
| Fotos y capturas de producto | `public/img/` (originales en `Necapp/`), asignadas en `src/data/media.ts` |
| Componentes React (monitor, títulos animados, pila de productos) | `src/components/react/` |
| Colores, tipografías y reglas visuales | `DESIGN.md` y `src/styles/global.css` |

## Formularios

Los formularios (demo, cotización y folleto) envían a [Web3Forms](https://web3forms.com), que reenvía cada consulta por email sin necesidad de servidor. Para activarlos: crear la clave gratuita con el email comercial y pegarla en `web3formsKey` dentro de `src/config.ts`. Mientras diga `PENDIENTE`, el formulario muestra un aviso para escribir por WhatsApp o email.

Cada envío exitoso registra el evento `generate_lead` en Google Analytics y cada clic en WhatsApp registra `contact_whatsapp`. Analytics solo se carga si el visitante acepta las cookies.

## Publicación

- **Revisión (Vercel):** importar el repositorio en Vercel; detecta Astro solo. Cada push genera un link de vista previa.
- **Producción (DonWeb):** el workflow `.github/workflows/deploy-donweb.yml` compila y sube `dist/` por FTP en cada push a `main`. Necesita los secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` y `FTP_SERVER_DIR` cargados en GitHub. El archivo `public/.htaccess` configura la página 404 y el caché en el hosting Apache de DonWeb.
- Cuando el dominio esté comprado, actualizar `site` en `astro.config.mjs` y la URL del sitemap en `public/robots.txt`.

## Pendientes antes de publicar

Ver la lista completa en `docs/brief-landing.md`. Lo mínimo para salir:

- [ ] Número de WhatsApp y email en `src/config.ts`
- [ ] Clave de Web3Forms en `src/config.ts`
- [ ] Dominio definitivo en `astro.config.mjs` y `public/robots.txt`
- [ ] Revisar los textos de producto con el equipo comercial
- [ ] Números de registro ANMAT (opcional: si no están, se muestra "Registrado en ANMAT")

Para después:

- [ ] Logo vectorizado (SVG) para reemplazar `public/brand/*.webp`
- [ ] Folletos en PDF de cada producto
- [ ] ID de Google Analytics 4
- [ ] Testimonios autorizados
