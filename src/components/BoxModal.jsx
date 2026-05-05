import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight } from 'lucide-react';
import Invoice from './Invoice.jsx';
import EmbedViewer from './EmbedViewer.jsx';

export default function BoxModal({ exchange, onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!exchange) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [exchange, onClose]);

  return (
    <AnimatePresence>
      {exchange && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center px-3 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* modal — box opens upward */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 60, opacity: 0, scale: 0.92, rotateX: 25 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            style={{ transformPerspective: 1200 }}
            className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between gap-2 px-3 sm:px-5 py-3.5 bg-gradient-to-r from-sky-50 via-pink-50 to-amber-50 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-base font-extrabold text-slate-800 min-w-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 sm:px-3 py-1 border border-slate-200 shadow-sm max-w-full">
                  <span aria-hidden="true">{exchange.from.countryCode ? <img src={`https://flagcdn.com/w40/${exchange.from.countryCode.toLowerCase()}.png`} alt="" className="w-4 h-4 rounded-sm inline-block" /> : exchange.from.flag}</span>
                  <span className="truncate">{exchange.from.country}</span>
                </span>
                <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 sm:px-3 py-1 border border-slate-200 shadow-sm max-w-full">
                  <span aria-hidden="true">{exchange.to.countryCode ? <img src={`https://flagcdn.com/w40/${exchange.to.countryCode.toLowerCase()}.png`} alt="" className="w-4 h-4 rounded-sm inline-block" /> : exchange.to.flag}</span>
                  <span className="truncate">{exchange.to.country}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('viewer.close')}
                className="rounded-full p-2 text-slate-500 hover:bg-white hover:text-slate-800 transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="grid lg:grid-cols-[1fr_340px] gap-4 sm:gap-5">
                <EmbedViewer url={exchange.embedUrl} />
                <div>
                  <Invoice exchange={exchange} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
