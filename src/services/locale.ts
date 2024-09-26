'use server';

import { cookies } from 'next/headers';
import type { Locale, SttLocale } from '@/src/i18n/config';
import { defaultLocale } from '@/src/i18n/config';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';
const STT_LOCALE_COOKIE_NAME = 'STT_LOCALE';
const TTS_VOICE_COOKIE_NAME = 'TTS_VOICE';

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale);
}

export async function setUserSTTLocale(locale: SttLocale) {
  cookies().set(STT_LOCALE_COOKIE_NAME, locale);
}

export async function getUserSTTLocale() {
  return cookies().get(STT_LOCALE_COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserVoice(voiceShortName: string) {
  cookies().set(TTS_VOICE_COOKIE_NAME, voiceShortName);
}

export async function getUserVoice() {
  return cookies().get(TTS_VOICE_COOKIE_NAME)?.value || null;
}
