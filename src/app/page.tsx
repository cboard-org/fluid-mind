'use client';
import { Button, Divider, Label } from '@fluentui/react-components';
import styles from './page.module.css';
import Link from 'next/link';
import LocaleSwitcher from '@/src/components/LocaleSwitcher/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import SpeechRecognizerLocaleSwitcher from '@/src/components/LocaleSwitcher/SpeechRecognizerLocaleSwitcher';
import VoiceSwitcher from '../components/VoiceSwitcher/VoiceSwitcher';

export default function Home() {
  const translations = useTranslations('Home');
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <Divider>{translations('Language')}</Divider>
        <div className={styles.labeledMenu}>
          <Label>{translations('App')}</Label>
          <LocaleSwitcher />
        </div>
        <div className={styles.labeledMenu}>
          <Label>{translations('SpeechRecognition')}</Label>
          <SpeechRecognizerLocaleSwitcher />
        </div>
      </div>
      <Divider>{translations('Speech')}</Divider>
      <div className={`${styles.section} ${styles.speechSection}`}>
        <VoiceSwitcher />
      </div>
      <div className={`${styles.section} ${styles.lastSection}`}>
        <Divider>{translations('Modes')}</Divider>
        <Link href={'/communicator'}>
          <Button size="large">{translations('ListenButton')}</Button>
        </Link>
      </div>
    </main>
  );
}
