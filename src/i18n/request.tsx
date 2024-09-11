import { getRequestConfig } from 'next-intl/server';
import { getUserLocale, setUserLocale } from '@/src/services/locale';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = await getUserLocale();
  const getMessages = async () => {
    try {
      return await import(`../../messages/${locale}.json`);
    } catch {
      console.error('Error setting locale language of the app');
      const defaultLang = 'en-US';
      setUserLocale(defaultLang);
      return await import(`../../messages/${defaultLang}.json`);
    }
  };

  return {
    locale,
    messages: (await getMessages()).default,
  };
});
