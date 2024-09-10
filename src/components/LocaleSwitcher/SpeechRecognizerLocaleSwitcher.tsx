import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { SUPPORTED_SPEECH_RECOGNITION_LOCALES } from '@/src/speechToText/supportedLocales';

export default function SpeechRecognizerLocaleSwitcher() {
  const t = useTranslations('speechRecognizerLocaleSwitcher');
  const appLocale = useLocale();
  const recognizerAvailableLanguages = SUPPORTED_SPEECH_RECOGNITION_LOCALES.filter(
    ({ locale }) => locale.slice(0, 2) === appLocale,
  );

  const defaultRecognizerLocale = recognizerAvailableLanguages[0].language;
  return (
    <LocaleSwitcherSelect
      defaultValue={defaultRecognizerLocale}
      items={recognizerAvailableLanguages.map(({ locale, language }) => ({
        value: locale,
        label: language,
      }))}
      label={t('label')}
    />
  );
}
