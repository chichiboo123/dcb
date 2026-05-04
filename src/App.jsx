import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/LanguageSelector.jsx';
import CultureBox from './components/CultureBox.jsx';
import Footer from './components/Footer.jsx';
import AdminModal from './components/AdminModal.jsx';

export default function App() {
  const { t } = useTranslation();
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-krds-line">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow"
              style={{
                background: 'linear-gradient(135deg, #FF8A5E, #FF6B35)',
              }}
              aria-hidden="true"
            >
              <span className="material-icons-round" style={{ fontSize: 22 }}>
                redeem
              </span>
            </div>
            <div className="leading-tight">
              <h1 className="text-base sm:text-lg font-extrabold text-krds-primary">
                {t('app.title')}
              </h1>
              <p className="hidden sm:block text-xs text-gray-500">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => setAdminOpen(true)}
              className="btn-ghost"
              aria-label={t('admin.title')}
            >
              <span className="material-icons-round" style={{ fontSize: 18 }} aria-hidden="true">
                settings
              </span>
              <span className="hidden sm:inline">{t('admin.title')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-32 flex flex-col items-center">
          <CultureBox />
        </div>
      </main>

      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
      <Footer />
    </div>
  );
}
