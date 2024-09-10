import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { APP_SUPPORTED_LANGUAGES, getRecognizerAvailableLanguages } from '@/src/i18n/config';
import { setUserLocale } from '@/src/services/locale';
import { Locale } from '@/src/i18n/config';
import { changeSpeechRecognizerLanguage } from '@/src/speechToText/speechToText';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  const handleSetUserLocale = async (settedLocale: Locale) => {
    await setUserLocale(settedLocale);
    const recognizerAvailableLanguages = getRecognizerAvailableLanguages(settedLocale);
    const defaultRecognizerLocale = recognizerAvailableLanguages[0].locale;
    changeSpeechRecognizerLanguage(defaultRecognizerLocale);
  };

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={APP_SUPPORTED_LANGUAGES.map((lang) => ({
        value: lang,
        label: t(lang),
      }))}
      label={t('label')}
      onSetLocaleClick={handleSetUserLocale}
    />
  );
}
