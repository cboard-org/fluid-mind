import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { APP_SUPPORTED_LANGUAGES } from '@/src/i18n/config';
import { setUserLocale } from '@/src/services/locale';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={t(locale)}
      items={APP_SUPPORTED_LANGUAGES.map((lang) => ({
        value: lang,
        label: t(lang),
      }))}
      label={t('label')}
      onSetLocaleClick={async (settedLocale) => await setUserLocale(settedLocale)}
    />
  );
}
