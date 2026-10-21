import es from './es';
import en from './en';
import pt from './pt';
import type { ProductSlug } from '../config';

export const langs = ['es', 'en', 'pt'] as const;
export type Lang = (typeof langs)[number];

const dicts = { es, en, pt };
export const t = (lang: Lang) => dicts[lang];

export const htmlLang: Record<Lang, string> = { es: 'es', en: 'en', pt: 'pt-BR' };
export const ogLocale: Record<Lang, string> = { es: 'es_AR', en: 'en_US', pt: 'pt_BR' };

const productBase: Record<Lang, string> = {
  es: '/productos/',
  en: '/en/products/',
  pt: '/pt/produtos/',
};

export const homePath = (lang: Lang) => (lang === 'es' ? '/' : `/${lang}/`);
export const productPath = (lang: Lang, slug: ProductSlug) => `${productBase[lang]}${slug}/`;

export const productSlugs: ProductSlug[] = ['anna', 'thera', 'nexus', 'polygon'];
