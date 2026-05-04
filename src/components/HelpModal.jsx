import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Users, Share2, MousePointerClick, ShieldCheck } from 'lucide-react';

const DEVELOPER_URL = 'https://litt.ly/chichiboo';

export default function HelpModal({ open, onClose }) {
  const { t } = useTranslation();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('help.title')}
            className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">{t('help.title')}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('viewer.close')}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 text-sm text-slate-700">

              {/* Guest mode */}
              <section>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Users size={14} className="text-sky-500" />
                  <span className="font-bold text-sky-700 text-xs uppercase tracking-wide">{t('help.guestTitle')}</span>
                </div>
                <ol className="space-y-2">
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[11px] font-bold">1</span>
                    <span>{t('help.guestStep1')}</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[11px] font-bold">2</span>
                    <span>{t('help.guestStep2')}</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[11px] font-bold">3</span>
                    <span>{t('help.guestStep3')}</span>
                  </li>
                </ol>
              </section>

              {/* Host mode */}
              <section>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <ShieldCheck size={14} className="text-amber-500" />
                  <span className="font-bold text-amber-700 text-xs uppercase tracking-wide">{t('help.hostTitle')}</span>
                </div>
                <ol className="space-y-2">
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[11px] font-bold">1</span>
                    <span>{t('help.hostStep1')}</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[11px] font-bold">2</span>
                    <span>{t('help.hostStep2')}</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[11px] font-bold">3</span>
                    <span>{t('help.hostStep3')}</span>
                  </li>
                </ol>
              </section>
            </div>

            {/* Developer footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">{t('help.developerLabel')}</p>
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors underline underline-offset-2"
              >
                {t('help.developerName')}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
