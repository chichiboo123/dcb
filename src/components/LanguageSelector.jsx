import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SUPPORTED_LANGUAGES.find(
    (l) => l.code === (i18n.resolvedLanguage || i18n.language)
  ) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-white hover:shadow transition-all"
      >
        <Globe size={16} className="text-sky-500" aria-hidden="true" />
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50"
          >
            {SUPPORTED_LANGUAGES.map((lng) => {
              const active = current.code === lng.code;
              return (
                <li key={lng.code}>
                  <button
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      i18n.changeLanguage(lng.code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-sky-50 text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base" aria-hidden="true">{lng.flag}</span>
                    <span className="flex-1 text-left">{lng.label}</span>
                    {active && <Check size={16} className="text-sky-500" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
