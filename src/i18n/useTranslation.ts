/**
 * useTranslation — a tiny i18n hook backed by Zustand.
 *
 * Use:
 *   const { t, lang, setLang } = useTranslation();
 *   <h1>{t('app_title_main')}</h1>
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dictionaries, Lang, TranslationKey } from './translations';

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const browserDefault: Lang =
  typeof navigator !== 'undefined' &&
  (navigator.language || '').slice(0, 2).toLowerCase() === 'en'
    ? 'en'
    : 'pl';

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: browserDefault,
      setLang: (lang) => set({ lang }),
    }),
    { name: 'wvp-lang' },
  ),
);

export function useTranslation() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);

  const t = (key: TranslationKey | string, vars?: Record<string, string | number>) => {
    const dict = dictionaries[lang];
    let s = dict[key as TranslationKey] ?? dictionaries.en[key as TranslationKey] ?? String(key);
    if (vars) {
      for (const k of Object.keys(vars)) {
        s = s.split(`{${k}}`).join(String(vars[k]));
      }
    }
    return s;
  };

  return { t, lang, setLang };
}

/** Use outside of components (in plain functions like exporters). */
export function tStandalone(key: TranslationKey | string): string {
  const lang = useLangStore.getState().lang;
  return dictionaries[lang][key as TranslationKey] ?? dictionaries.en[key as TranslationKey] ?? String(key);
}
