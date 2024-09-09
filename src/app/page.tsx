'use client';
import { Button } from '@fluentui/react-components';
import styles from './page.module.css';
import Link from 'next/link';
import LocaleSwitcher from '@/src/components/LocaleSwitcher/LocaleSwitcher';
import { useTranslations } from 'next-intl';

export default function Home() {
  const translations = useTranslations('ReplyHome');
  return (
    <main className={styles.main}>
      <LocaleSwitcher />
      <Link href={'/reply'}>
        <Button size="large">{translations('ListenButton')}</Button>
      </Link>
    </main>
  );
}
