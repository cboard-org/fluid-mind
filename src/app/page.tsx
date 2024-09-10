'use client';
import { Button, Divider, Label } from '@fluentui/react-components';
import styles from './page.module.css';
import Link from 'next/link';
import LocaleSwitcher from '@/src/components/LocaleSwitcher/LocaleSwitcher';
import { useTranslations } from 'next-intl';
import SpeechRecognizerLocaleSwitcher from '@/src/components/LocaleSwitcher/SpeechRecognizerLocaleSwitcher';

export default function Home() {
  const translations = useTranslations('ReplyHome');
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <Divider>LANGUAGE</Divider>
        <div className={styles.labeledMenu}>
          <Label>App:</Label>
          <LocaleSwitcher />
        </div>
        <div className={styles.labeledMenu}>
          <Label>Speech Recognition:</Label>
          <SpeechRecognizerLocaleSwitcher />
        </div>
      </div>
      <div className={styles.section}>
        <Divider>APP MODES</Divider>
        <Link href={'/reply'}>
          <Button size="large">{translations('ListenButton')}</Button>
        </Link>
      </div>
    </main>
  );
}
