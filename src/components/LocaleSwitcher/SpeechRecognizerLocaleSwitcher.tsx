import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { SUPPORTED_SPEECH_RECOGNITION_LOCALES } from '@/src/speechToText/supportedLocales';
import {
  changeSpeechRecognizerLanguage,
  getSpeechRecognizerLanguage,
} from '@/src/speechToText/speechToText';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function SpeechRecognizerLocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const appLocale = useLocale();

  const sliceLocale = (locale: string) => {
    return locale.slice(0, 2);
  };
  const recognizerAvailableLanguages = useMemo(
    () =>
      SUPPORTED_SPEECH_RECOGNITION_LOCALES.filter(
        ({ locale }) => sliceLocale(locale) === sliceLocale(appLocale),
      ),
    [appLocale],
  );

  useMemo(() => {}, []);
  const [defaultRecognizerLocale, setDefaultRecognizerLocale] = useState(
    getSpeechRecognizerLanguage() ?? recognizerAvailableLanguages[0].locale,
  );

  const handleChangeSpeechRecognizerLanguage = useCallback(
    (locale: string) => {
      changeSpeechRecognizerLanguage(locale);
      const newRecognizerLocale =
        getSpeechRecognizerLanguage() ?? recognizerAvailableLanguages[0].locale;
      setDefaultRecognizerLocale(newRecognizerLocale);
    },
    [recognizerAvailableLanguages],
  );

  useEffect(() => {
    handleChangeSpeechRecognizerLanguage(appLocale);
  }, [appLocale, handleChangeSpeechRecognizerLanguage]);

  return (
    <LocaleSwitcherSelect
      defaultValue={t(defaultRecognizerLocale)}
      items={recognizerAvailableLanguages.map(({ locale }) => ({
        value: locale,
        label: t(locale),
      }))}
      label={t('label')}
      onSetLocaleClick={async (locale) => handleChangeSpeechRecognizerLanguage(locale)}
    />
  );
}
