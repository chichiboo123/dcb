import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { motion } from 'framer-motion';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language;

  return (
    <div
      role="group"
      aria-label={t('language.select')}
      className="flex flex-wrap items-center gap-1.5 rounded-full bg-white/80 backdrop-blur px-2 py-1.5 border border-krds-line shadow-paper"
    >
      <span
        className="material-icons-round text-krds-primary px-1.5"
        aria-hidden="true"
        style={{ fontSize: 20 }}
      >
        language
      </span>
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = current === lng.code;
        return (
          <motion.button
            key={lng.code}
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -1 }}
            onClick={() => i18n.changeLanguage(lng.code)}
            aria-pressed={active}
            className={[
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
              active
                ? 'bg-krds-primary text-white shadow-sm'
                : 'text-krds-primary hover:bg-pastel-blue/60',
            ].join(' ')}
          >
            <span aria-hidden="true">{lng.flag}</span>
            <span>{lng.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
