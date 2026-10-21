# Brief de la landing de NecApp

Decisiones tomadas en la entrevista inicial (octubre 2026). Este documento guía el diseño y desarrollo del sitio.

## Empresa

- **NecApp** es distribuidor oficial de software médico, con licencia para vender los productos de Vicon y NeuroEars.
- Es una empresa de **Necod Argentina SRL**.
- Planea sumar otros productos de software en el futuro: el mensaje general no debe quedar atado a los productos actuales.
- Propuesta: **solución llave en mano**. Instalación, capacitación y soporte local en español.

## Productos actuales

| Producto | Fabricante | Qué hace | Público |
|---|---|---|---|
| Nexus | Vicon | Captura y procesamiento de movimiento 3D (cámaras, plataformas de fuerza, EMG). Estándar en análisis de marcha. Modelos Plug-in Gait y CGM2 | Laboratorios de marcha, investigación, deporte |
| Polygon | Vicon | Genera informes clínicos de marcha a partir de los datos de Nexus | Los mismos laboratorios que usan Nexus |
| Anna | NeuroEars | Software médico Clase II para evaluación vestibular. Registra el nistagmo con un visor VR (HMD) con cámara ocular. Pruebas basales, posicionales, oculomotoras, VVS/HVS y calórica | ORL, neurólogos, audiólogos, fonoaudiólogos |
| Thera | NeuroEars | Rehabilitación vestibular personalizada con visor VR. Ejercicios de estabilidad de la mirada verificados con seguimiento ocular. Cuestionarios DHI, VADL y V-Screen 9 con puntaje asistido por IA | Kinesiólogos, centros de rehabilitación |

Relato: **Anna evalúa, Thera rehabilita** (circuito completo del paciente vestibular). **Vicon mide el movimiento.**

### Lenguaje regulatorio

- Los productos NeuroEars **asisten** al profesional. Nunca escribir que "diagnostican", "curan" o "tratan".
- Todos los productos tienen **registro ANMAT**. Mostrar el número en cada página de producto.

## Público

Los cuatro, todos como objetivo de captación de leads:

1. Hospitales y centros de rehabilitación
2. Universidades y laboratorios de investigación
3. Clínicas deportivas y centros de alto rendimiento
4. Profesionales independientes

## Idiomas

- Español neutro (principal), inglés y portugués, con selector de idioma.
- Adaptar los textos a cada idioma, no traducir literal.

## Conversión

| Prioridad | Acción | Ubicación |
|---|---|---|
| 1 | Solicitar demo | Hero y cierre de página |
| 2 | WhatsApp | Botón flotante siempre visible |
| 3 | Pedir cotización | Cada producto, con el producto preseleccionado |
| 4 | Descargar folleto (a cambio del email) | Cada producto |

- Campos del formulario: nombre, institución, rol, país, producto de interés, mensaje.
- Envío por email con Web3Forms o Formspree (sin backend).

## Estructura

**Home**

1. Hero
2. Distribuidor oficial de (logos de Vicon y NeuroEars)
3. Soluciones por área: "Equilibrio y vértigo" (Anna + Thera) y "Análisis de movimiento" (Nexus + Polygon)
4. Para quién: los cuatro públicos
5. Cómo trabajamos: demo, instalación, capacitación, soporte en español
6. Clientes y testimonios (oculta mientras no haya entradas)
7. Quiénes somos: NecApp y Necod, solo datos verificables
8. Contacto: formulario + WhatsApp

**Páginas de producto:** una por producto (Nexus, Polygon, Anna, Thera), con detalle, casos de uso, registro ANMAT, cotización y folleto.

**Footer:** "NecApp es una empresa de Necod Argentina SRL" con datos legales.

## Hero

> **Antetítulo:** HEALTH SOLUTION · SOFTWARE & APPLICATION
> **Título:** Software médico de clase mundial, implementado en Latinoamérica
> **Subtítulo:** Llevamos a hospitales, universidades y consultorios las herramientas que usan los mejores centros del mundo, con instalación, capacitación y soporte en tu idioma.
> **Botones:** Solicitar demo · Ver soluciones

## Identidad visual

- Logo definido (pendiente de vectorizar).
- Azul marino `#032A5F`: texto principal y secciones oscuras.
- Verde turquesa `#039E8A`: acento para botones y elementos grandes. Usar una variante más oscura para links en texto chico, por contraste.
- Dirección: **clínica y precisa** (base clara, mucho aire, tipografía técnica) con una o dos secciones oscuras donde los datos en movimiento sean protagonistas.
- Motivo gráfico: el **pulso** de la "A" del logo. Una línea que se dibuja con el scroll y se transforma en curva de marcha (Vicon) y en trazo de seguimiento ocular (NeuroEars).
- Mientras llega el kit de los fabricantes: ilustraciones y gráficos propios. Logos de las marcas solo en el bloque "Distribuidor oficial de".

## Clientes y testimonios

- Se agregan a medida que haya autorización de cada institución.
- Agregar uno debe ser sumar una entrada a un archivo de datos, sin tocar el diseño.
- Hasta entonces: "Ya en uso en hospitales de referencia de Buenos Aires".

## Tecnología

- **Astro** (sitio estático, i18n nativo, buen SEO) + **GSAP** para animaciones.
- **Vercel** como entorno de revisión (link de vista previa por cada cambio).
- **DonWeb** como producción. Deploy por FTP con GitHub Actions; credenciales como secrets de GitHub.
- **GA4** con eventos por formulario enviado y clic en WhatsApp. Espacio preparado para píxeles de Meta y LinkedIn, desactivados por defecto. Banner de cookies.

## Pendientes del cliente

- [ ] Logo vectorizado (SVG)
- [ ] Comprar dominio en DonWeb (recomendado: necapp.com.ar y necapp.com)
- [ ] Número de WhatsApp comercial
- [ ] Email que recibe los formularios
- [ ] Datos de FTP de DonWeb (cargar como secrets en GitHub, nunca en el código)
- [ ] ID de Google Analytics 4
- [ ] Números de registro ANMAT de cada producto
- [ ] Kit de distribuidor de Vicon y NeuroEars (logos, fotos, capturas)
- [ ] Folletos comerciales en PDF de cada producto
- [ ] Datos de Necod: actividad, año de fundación, ciudad, sitio web
- [ ] Confirmar alcance del servicio: venta de hardware, modalidad de licencia, tipo de demo
- [ ] Autorizaciones de clientes para testimonios (Hospital Italiano y otros)
