import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Share2, Check, PackageOpen } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector.jsx';
import BoxCard from './components/BoxCard.jsx';
import BoxModal from './components/BoxModal.jsx';
import AdminModal from './components/AdminModal.jsx';
import GuestCreateModal from './components/GuestCreateModal.jsx';
import HiddenAdminTrigger from './components/HiddenAdminTrigger.jsx';
import Footer from './components/Footer.jsx';
import { useBoxData } from './store/BoxDataContext.jsx';
import { buildShareUrl } from './lib/share.js';

export default function App() {
  const { t } = useTranslation();
  const { mode, data } = useBoxData();
  const [activeExchange, setActiveExchange] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [shareToast, setShareToast] = useState('');

  const isHost = mode === 'host';
  const hasBoxes = data.exchanges.length > 0;

  const goHome = () => {
    setActiveExchange(null);
    setAdminOpen(false);
    setCreateOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onShare = async () => {
    const url = buildShareUrl(data);
    if (url.length > 1800) {
      setShareToast(t('guest.linkTooLong'));
      setTimeout(() => setShareToast(''), 2200);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareToast(t('guest.linkCopied'));
    } catch {
      window.prompt(t('guest.copyManually'), url);
      setShareToast(t('guest.linkCopied'));
    }
    setTimeout(() => setShareToast(''), 1800);
  };

  useEffect(() => {
    document.title = t('app.title');
  }, [t]);

  return (
    <div className="app-shell flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-slate-200/70">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goHome}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1 -mx-2 hover:bg-white/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            aria-label="home"
          >
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #f472b6)' }}
              aria-hidden="true"
            >
              <Package size={18} />
            </span>
            <span className="leading-tight text-left">
              <span className="block text-sm sm:text-base font-extrabold text-slate-800">
                {t('app.title')}
              </span>
              <span className="hidden sm:block text-[11px] text-slate-500">
                {isHost ? t('app.hostSubtitle') : t('app.subtitle')}
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            {/* Mode badge */}
            <span
              className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border ${
                isHost
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-sky-50 text-sky-700 border-sky-200'
              }`}
            >
              {isHost ? t('mode.host') : t('mode.guest')}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14 pb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              {t('app.title')}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              {hasBoxes
                ? t('app.tapToOpen')
                : isHost
                ? t('app.hostEmpty')
                : t('app.guestEmpty')}
            </p>
          </div>

          {/* Guest action buttons */}
          {!isHost && (
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 relative">
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 text-sm shadow-md transition-colors"
              >
                <Plus size={16} />
                {hasBoxes ? t('guest.editCultureBox') : t('guest.createCultureBox')}
              </button>
              <button
                type="button"
                onClick={onShare}
                disabled={!hasBoxes}
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-4 py-2.5 text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 size={16} />
                {t('guest.shareLink')}
              </button>
              <AnimatePresence>
                {shareToast && (
                  <motion.span
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -bottom-7 inline-flex items-center gap-1 text-xs font-bold text-emerald-600"
                  >
                    <Check size={14} /> {shareToast}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Boxes or empty state */}
          {hasBoxes ? (
            <div className="grid sm:grid-cols-2 gap-10 sm:gap-12 justify-items-center">
              {data.exchanges.map((ex, i) => (
                <BoxCard key={ex.id} exchange={ex} index={i} onOpen={setActiveExchange} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md text-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 backdrop-blur px-6 py-10">
              <PackageOpen size={48} className="mx-auto text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                {isHost ? t('app.hostEmptyHint') : t('app.guestEmptyHint')}
              </p>
              {!isHost && (
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 text-sm shadow-md transition-colors"
                >
                  <Plus size={16} />
                  {t('guest.createCultureBox')}
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Modals */}
      <BoxModal exchange={activeExchange} onClose={() => setActiveExchange(null)} />

      {/* AdminModal is accessible from BOTH modes via the hidden trigger.
          On guest mode the trigger navigates to /host so the admin stays in host context. */}
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />

      {/* Hidden gear icon — always visible, very subtle */}
      <HiddenAdminTrigger
        isHost={isHost}
        onClick={() => {
          if (isHost) {
            setAdminOpen(true);
          } else {
            // Navigate to host page for admin access
            window.location.href = '/host';
          }
        }}
      />

      {/* Guest create/edit modal */}
      {!isHost && (
        <GuestCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
