import { useTranslations } from 'next-intl';
import styles from './keywordsField.module.css';

type Props = {
  keywords: string;
  setKeywords: (keywords: string) => void;
};

export default function KeywordsField({ keywords, setKeywords }: Props) {
  const translations = useTranslations('ReplyDashboard');
  const handleKeywordsChange = (keywords: string) => {
    setKeywords(keywords);
  };

  return (
    <input
      type="text"
      value={keywords}
      onChange={(e) => handleKeywordsChange(e.target.value)}
      placeholder={translations('KeywordInput')}
      className={styles.keywordInput}
    />
  );
}
