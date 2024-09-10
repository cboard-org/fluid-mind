import { AVAILABLE_TRANSLATIONS } from '@/src/components/LocaleSwitcher/constants';
export type Locale = (typeof locales)[number];

export const locales = AVAILABLE_TRANSLATIONS;
export const defaultLocale: Locale = 'en';
