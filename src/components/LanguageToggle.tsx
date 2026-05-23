import { LANGS } from '@/i18n/translations';
import { useTranslation } from '@/i18n/useTranslation';

export function LanguageToggle() {
  const { lang, setLang } = useTranslation();
  return (
    <div className="lang-toggle" role="tablist" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className={lang === l ? 'active' : ''}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
