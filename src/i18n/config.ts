import { SUPPORTED_SPEECH_RECOGNITION_LOCALES } from '@/src/speechToText/supportedLocales';

const SUPPORTED_SPEECH_RECOGNITION_LANGUAGES = new Set(
  SUPPORTED_SPEECH_RECOGNITION_LOCALES.map(({ locale }) => locale),
);
export const AVAILABLE_TRANSLATIONS = ['en-US', 'es-ES', 'pt-BR'];

export const APP_SUPPORTED_LANGUAGES = AVAILABLE_TRANSLATIONS.filter((lang) =>
  SUPPORTED_SPEECH_RECOGNITION_LANGUAGES.has(lang),
);

export type Locale = (typeof locales)[number];

export const locales = AVAILABLE_TRANSLATIONS;
export const defaultLocale: Locale = 'en-US';

export const supportedSpeechRecognitionLocales = Array.from(SUPPORTED_SPEECH_RECOGNITION_LANGUAGES);
export type SttLocale = (typeof supportedSpeechRecognitionLocales)[number];
