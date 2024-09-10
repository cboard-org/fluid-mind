import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import { APP_SUPPORTED_LANGUAGES } from './constants';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={APP_SUPPORTED_LANGUAGES.map((lang) => ({
        value: lang,
        label: t(lang),
      }))}
      label={t('label')}
    />
  );
}
