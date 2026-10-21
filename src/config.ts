// Datos del negocio. Todo lo que dice PENDIENTE se completa antes de publicar
// (ver la lista de pendientes en docs/brief-landing.md).

export const site = {
  // Número de WhatsApp comercial, solo dígitos con código de país (ej: 5491112345678).
  whatsapp: 'PENDIENTE',
  // Email que recibe las consultas.
  email: 'PENDIENTE@necapp.com.ar',
  // Clave de acceso de Web3Forms (https://web3forms.com), gratis, se asocia al email de arriba.
  web3formsKey: 'PENDIENTE',
  // ID de medición de Google Analytics 4 (G-XXXXXXX). Vacío = no se carga GA.
  gaId: '',
  // Píxeles opcionales, solo si hacen campañas pagas. Vacío = desactivado.
  metaPixelId: '',
  linkedinPartnerId: '',
};

export const company = {
  legalName: 'Necod Argentina SRL',
  // Completar cuando estén confirmados. null = no se muestra.
  foundedYear: null as number | null,
  city: null as string | null,
};

export type ProductSlug = 'anna' | 'thera' | 'nexus' | 'polygon';

// Números de registro ANMAT por producto. null = se muestra "Registrado en ANMAT" sin número.
export const anmat: Record<ProductSlug, string | null> = {
  anna: null,
  thera: null,
  nexus: null,
  polygon: null,
};

export const isPending = (v: string) => !v || v.includes('PENDIENTE');
