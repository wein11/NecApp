import type { ProductSlug } from '../config';

// Imágenes reales de los fabricantes (kit de distribuidor). Las fotos de Vicon
// están pasadas a duotono con los colores de NecApp; los originales están en Necapp/.

export interface Shot {
  src: string;
  w: number;
  h: number;
}

const img = (name: string, w: number, h: number): Shot => ({ src: `/img/${name}.webp`, w, h });

export const productPhoto: Record<ProductSlug, Shot> = {
  anna: img('anna', 849, 737),
  thera: img('thera', 874, 726),
  nexus: img('vicon6', 540, 540),
  polygon: img('polygon1', 600, 317),
};

// Las leyendas de cada captura están en i18n (product.pages[slug].gallery), en el mismo orden.
export const gallery: Record<ProductSlug, Shot[]> = {
  anna: [1, 2, 3, 4].map((i) => img(`anna_en_${i}`, 1600, 900)).concat(img('anna_en_5', 1080, 608)),
  thera: [1, 2, 3, 4, 5].map((i) => img(`thera_en_${i}`, 1600, 900)),
  nexus: [img('vicon10', 510, 510), img('vicon1', 500, 700), img('vicon8', 510, 510), img('vicon2', 540, 491), img('vicon7', 540, 540)],
  polygon: [img('polygon1', 600, 317), img('vicon4', 540, 540), img('vicon11', 510, 510)],
};

// Tarjetas de la pila de productos de la home.
export const stack: Record<ProductSlug, Shot> = {
  anna: img('anna_en_5', 1080, 608),
  thera: img('thera_en_1', 1600, 900),
  nexus: img('vicon10', 510, 510),
  polygon: img('polygon1', 600, 317),
};

export const logos = {
  vicon: { src: '/brand/vicon-navy.svg', w: 559, h: 144 },
  neuroears: img('neuroears', 384, 69),
  anna: img('neuroearsannalogo', 640, 117),
  thera: img('neurearstheralogo', 640, 113),
};

export const audiencePhoto = img('vicon11', 510, 510);
