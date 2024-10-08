import { useLocale, useTranslations } from 'next-intl';
import { getVoicesList, setVoice, speak } from '@/src/textToSpeech/synthesizeSpeech';
import { useEffect, useState } from 'react';
import type { VoiceInfo } from 'microsoft-cognitiveservices-speech-sdk';
import { Spinner } from '@fluentui/react-components';
import VoiceTable from './VoiceTable';
import { getUserVoice, setUserVoice } from '@/src/services/locale';

export default function VoiceSwitcher() {
  const t = useTranslations('VoiceSwitcher');
  const appLocale = useLocale();
  const [voices, setVoices] = useState<VoiceInfo[] | undefined>(undefined);
  const [selectedVoice, setSelectedVoice] = useState<VoiceInfo['name']>('');

  const handleSelectVoice = (shortName: VoiceInfo['shortName']) => {
    setVoice(shortName);
    setSelectedVoice(shortName);
    setUserVoice(shortName);
  };

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const voices = await getVoicesList();
        const localeVoices = voices?.filter(({ locale }) => locale === appLocale);

        const compatibleVoices = voices?.filter(
          ({ locale }) => locale.slice(0, 2) === appLocale.slice(0, 2),
        );

        const secondaryVoices = voices?.filter(({ secondaryLocaleList }) =>
          secondaryLocaleList?.includes(appLocale),
        );

        if (!localeVoices && !compatibleVoices && !secondaryVoices) return;
        const allLocaleVoices = [
          ...(localeVoices ?? []),
          ...(compatibleVoices ?? []),
          ...(secondaryVoices ?? []),
        ];
        const uniqueVoiceList = allLocaleVoices.filter(
          (item, index, self) => self.indexOf(item) === index,
        );
        const userVoice = await getUserVoice();
        setVoices(uniqueVoiceList);
        if (userVoice && uniqueVoiceList.map(({ shortName }) => shortName).includes(userVoice))
          return handleSelectVoice(userVoice);
        if (!userVoice) return handleSelectVoice(uniqueVoiceList[0].shortName);
      } catch {
        console.error('error during fetch voices');
        //show try again button
      }
    };
    fetchVoices();
  }, [appLocale]);

  if (!voices) return <Spinner />;
  return (
    <VoiceTable
      voices={voices}
      selectedVoiceName={selectedVoice}
      onSelectVoice={(shortName: VoiceInfo['shortName']) => {
        handleSelectVoice(shortName);
        speak(t('voiceDemo'));
      }}
    />
  );
}
