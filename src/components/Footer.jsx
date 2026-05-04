import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="fixed bottom-0 inset-x-0 z-30 pointer-events-none">
      <div className="mx-auto max-w-6xl px-4 pb-3">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-krds-line px-4 py-2 text-xs sm:text-sm text-krds-primary shadow-paper">
          <span className="material-icons-round" style={{ fontSize: 16 }} aria-hidden="true">
            favorite
          </span>
          <span className="font-semibold">{t('footer.credit')}</span>
        </div>
      </div>
    </footer>
  );
}
