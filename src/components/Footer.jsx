import { useTranslation } from 'react-i18next';

export default function Footer() {
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
    </footer>
  );
}
