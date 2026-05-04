import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import LanguageSelector from './components/LanguageSelector.jsx';
import BoxCard from './components/BoxCard.jsx';
import BoxModal from './components/BoxModal.jsx';
import AdminModal from './components/AdminModal.jsx';
import HiddenAdminTrigger from './components/HiddenAdminTrigger.jsx';
import Footer from './components/Footer.jsx';
import { useBoxData } from './store/BoxDataContext.jsx';

export default function App() {
  const { t } = useTranslation();
  const { data, mode, getGuestShareLink } = useBoxData();
  const [activeExchange, setActiveExchange] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [guestEditorOpen, setGuestEditorOpen] = useState(false);



  const shareGuestLink = async () => {
    const link = getGuestShareLink();
    try {
      await navigator.clipboard.writeText(link);
      alert('링크가 복사되었습니다.');
    } catch {
      window.prompt('아래 링크를 복사하세요', link);
    }
  };

  const goHome = () => {
    setActiveExchange(null);
    setAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-full flex flex-col">
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
                {t('app.subtitle')}
              </span>
            </span>
          </button>

          <LanguageSelector />
        </div>
      </header>

      {/* Hero — boxes immediately visible */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14 pb-20">
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-800">
              {t('app.title')}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              {t('app.tapToOpen')}
            </p>
            {mode === 'guest' ? (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button type="button" onClick={() => setGuestEditorOpen(true)} className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-bold">컬쳐박스 생성하기</button>
                <button type="button" onClick={shareGuestLink} className="rounded-xl bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">링크 공유</button>
              </div>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10 sm:gap-12 justify-items-center">
            {data.exchanges.map((ex, i) => (
              <BoxCard
                key={ex.id}
                exchange={ex}
                index={i}
                onOpen={setActiveExchange}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer mode={mode} />

      <BoxModal exchange={activeExchange} onClose={() => setActiveExchange(null)} />
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} title="호스트 관리자" />
      <AdminModal open={guestEditorOpen} onClose={() => setGuestEditorOpen(false)} requireAuth={false} title="컬쳐박스 생성하기" />
      {mode === 'host' ? <HiddenAdminTrigger onClick={() => setAdminOpen(true)} /> : null}
    </div>
  );
}
