'use client';
import styles from './page.module.css';
import SpeechRecognition from '@/src/components/SpeechRecognition/SpeechRecognition';

export default function Home() {
  return (
    <main className={styles.main}>
      <SpeechRecognition />
    </main>
  );
}
