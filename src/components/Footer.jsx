import { useTranslation } from 'react-i18next';

export default function Footer({ mode }) {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-6 flex justify-center">
      <a
        href="https://litt.ly/chichiboo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs sm:text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors"
      >
        {t('footer.credit')}
      </a>
      {mode === 'host' ? <span className="ml-3 text-xs text-slate-400">/host</span> : null}
    </footer>
  );
}
