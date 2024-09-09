import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '@/src/services/locale';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = await getUserLocale();
  const shortLocale = locale.slice(0, 2);
  console.log(shortLocale);
  return {
    locale,
    messages: (await import(`../../messages/${shortLocale}.json`)).default,
  };
});
