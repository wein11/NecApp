// Clientes y testimonios. Agregar una entrada SOLO con autorización escrita de la institución.
// Mientras la lista esté vacía, la sección no se muestra.
//
// Ejemplo:
// {
//   institucion: 'Hospital Italiano de Buenos Aires',
//   producto: 'anna',
//   cita: { es: '...', en: '...', pt: '...' },
//   autor: 'Dra. Nombre Apellido',
//   cargo: { es: 'Jefa de Otorrinolaringología', en: 'Head of ENT', pt: 'Chefe de Otorrinolaringologia' },
// },

import type { ProductSlug } from '../config';
import type { Lang } from '../i18n';

export interface Cliente {
  institucion: string;
  producto: ProductSlug;
  cita?: Record<Lang, string>;
  autor?: string;
  cargo?: Record<Lang, string>;
}

export const clientes: Cliente[] = [];
