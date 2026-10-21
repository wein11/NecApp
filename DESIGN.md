# NecApp: sistema visual

Documenta el mundo visual construido para la landing (ver `docs/surfaces/landing.md` para la dirección).

## Idea

El pulso que vive dentro de la "A" del logo es la señal del sitio. Media pantalla es un monitor azul marino fijo donde un único trazo turquesa se transforma en lo que mide cada producto: pulso (marca), flexión de rodilla en el ciclo de marcha (Vicon Nexus y Polygon), nistagmo (Anna) y cabeza y mirada en ejercicio VOR x1 (Thera). Todas las señales son ilustrativas y lo dicen en pantalla.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#032A5F` | Tinta principal, monitor, secciones oscuras, botones secundarios activos |
| `--navy-deep` | `#021E45` | Texto sobre turquesa, fondos de interfaz dentro del monitor |
| `--navy-2` | `#0B3A75` | Escalón de tono dentro del monitor (fase de balanceo) |
| `--teal` | `#039E8A` | Acción principal, bandas normativas, selección |
| `--teal-ink` | `#00705F` | Links y textos turquesa sobre papel (contraste AA) |
| `--teal-light` | `#4CC9B4` | Trazos y textos turquesa sobre azul marino |
| `--paper` | `#F3F6F8` | Fondo |
| `--paper-2` | `#E4EBF1` | Escalón de tono: celdas, listas, contacto |
| `--ink-soft` | `#3B5679` | Texto secundario sobre papel |
| `--on-navy-soft` | `#B9C8DC` | Texto secundario sobre azul marino |

Reglas: un fondo, una tinta, un acento. El turquesa de marca nunca lleva texto blanco encima (no llega a AA); lleva `--navy-deep`.

## Tipografía

- Display: **Lexend** (variable, 500 a 600), tracking -0.02 a -0.04em. Elegida por su parentesco geométrico con el logotipo.
- Texto: **Literata** (variable, 400 y 600), interlineado 1.6. Serif de lectura con aire de publicación clínica.
- Escala: `--step-small` 15px, `--step-body` 20px, `--step-lead` 24px, `--step-sub` 32px, `--step-head` 52px, `--step-display` 56px (88px en el nombre de producto).
- Fuentes servidas desde el propio sitio (paquetes `@fontsource-variable`).

## Composición

- Pantalla dividida: columna de lectura (1.08fr) y monitor fijo (1fr), `position: sticky` bajo el encabezado.
- En el teléfono el monitor queda arriba (56svh) y la columna se desliza por encima.
- Secciones que rompen la división a todo el ancho: Cómo trabajamos (talón impreso sobre azul), Nosotros (carta centrada), Contacto (formulario sobre `--paper-2`), pie con el logo a todo el ancho.
- Márgenes `clamp(16px, 4vw, 56px)`, separación entre secciones `clamp(96px, 12vw, 200px)`.
- Esquinas rectas en todo. Sin sombras en reposo, sin degradados, sin líneas divisorias: los planos se separan por tono.

## Componentes

- **Botón**: rectángulo plano, 56px de alto. Primario turquesa con texto `--navy-deep`; al pasar el mouse pasa a azul marino.
- **Celdas de acción**: pares de rectángulos de 72px (tinta y tono) bajo cada producto.
- **Pestañas**: bloques planos; la activa en azul marino (o turquesa dentro del monitor).
- **Fragmentos de interfaz** (`data-ui`): batería vestibular, cámaras oculares, cuestionario DHI, captura de marcha con marcadores y procesamiento en Nexus. Son ilustraciones con datos de ejemplo, rotuladas como tales; se reemplazan por capturas reales cuando llegue el kit de los fabricantes.
- **Formularios**: campos sin borde sobre `#FBFCFD`, foco con borde turquesa de 2px, errores en texto bajo el campo.

## Movimiento

- Firma: el trazo del monitor se dibuja (`stroke-dashoffset`, 1.4s, power3.out) cada vez que cambia la señal; el pulso corre en bucle continuo.
- Entradas: título, texto y piezas suben 24px con opacidad, escalonadas 70ms, una sola vez (ScrollTrigger).
- Filas de listas: entran en tandas desde la izquierda.
- Talón de "Cómo trabajamos": se "imprime" de arriba hacia abajo con `clip-path`.
- Logo del pie: sube despacio con el scroll.
- Todo usa `transform`, `opacity` o `clip-path`. Con "reducir movimiento" no hay desplazamientos y el monitor muestra la señal completa y quieta.

## Contenido y tono

- Español neutro con tuteo, inglés y portugués adaptados (no traducidos literal).
- Los productos de NeuroEars "asisten" al profesional; nunca "diagnostican" ni "curan".
- Nunca usar el carácter de raya larga en ningún texto.
