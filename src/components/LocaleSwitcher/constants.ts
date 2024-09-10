import { SUPPORTED_SPEECH_RECOGNITION_LOCALES } from '@/src/speechToText/supportedLocales';

const SUPPORTED_SPEECH_RECOGNITION_LANGUAGES = new Set(
  SUPPORTED_SPEECH_RECOGNITION_LOCALES.map(({ locale }) => locale.slice(0, 2)),
);
const AVAILABLE_TRANSLATIONS = ['en', 'es'];

export const APP_SUPPORTED_LANGUAGES = AVAILABLE_TRANSLATIONS.filter((lang) =>
  SUPPORTED_SPEECH_RECOGNITION_LANGUAGES.has(lang),
);
