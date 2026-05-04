import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Save, Plus, Trash2, Check } from 'lucide-react';
import { useBoxData } from '../store/BoxDataContext.jsx';
import { makeEmptyExchange } from '../lib/mode.js';
import { COUNTRIES, codeToFlag, findCountry } from '../lib/countries.js';

const THEMES = ['blue', 'pink', 'green', 'yellow', 'purple', 'orange'];

export default function GuestCreateModal({ open, onClose }) {
  const { t } = useTranslation();
  const { data, replaceAll } = useBoxData();
  const [draft, setDraft] = useState(data.exchanges);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (open) {
      setDraft(
        data.exchanges.length > 0
          ? data.exchanges
          : [makeEmptyExchange('blue')]
      );
    }
  }, [open, data.exchanges]);

  const updateDraft = (id, patch) =>
    setDraft((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...patch } : ex)));

  const updateDraftNested = (id, key, patch) =>
    setDraft((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [key]: { ...ex[key], ...patch } } : ex))
    );


  const updateCountryBySearch = (id, role, query) => {
    const found = findCountry(query);
    if (!found) return;
    updateDraftNested(id, role, {
      country: found.name,
      countryCode: found.code,
      flag: codeToFlag(found.code),
    });
  };

  const addDraft = () => {
    const theme = THEMES[draft.length % THEMES.length];
    setDraft((prev) => [...prev, makeEmptyExchange(theme)]);
  };

  const removeDraft = (id) =>
    setDraft((prev) => prev.filter((ex) => ex.id !== id));

  const save = () => {
    replaceAll({ exchanges: draft });
    setToast(t('admin.saved'));
    setTimeout(() => {
      setToast('');
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 30, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h2 className="text-base font-extrabold text-slate-800">
                {t('guest.createTitle')}
              </h2>
              <button
                onClick={onClose}
                aria-label={t('viewer.close')}
                className="rounded-full p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {draft.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60"
                >
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="text-sm font-bold text-slate-700 truncate">
                      <span aria-hidden="true">{ex.from.flag}</span> {ex.from.country || '—'}{' '}
                      <span className="text-slate-400">→</span>{' '}
                      <span aria-hidden="true">{ex.to.flag}</span> {ex.to.country || '—'}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1">
                        {THEMES.map((th) => {
                          const dotColor = {
                            blue: 'bg-sky-400',
                            pink: 'bg-pink-400',
                            green: 'bg-emerald-400',
                            yellow: 'bg-amber-400',
                            purple: 'bg-violet-400',
                            orange: 'bg-orange-400',
                          }[th];
                          return (
                            <button
                              key={th}
                              type="button"
                              onClick={() => updateDraft(ex.id, { theme: th })}
                              className={`w-5 h-5 rounded-full ${dotColor} ring-2 transition-all ${
                                ex.theme === th
                                  ? 'ring-slate-700'
                                  : 'ring-transparent hover:ring-slate-300'
                              }`}
                              aria-label={`${t('admin.theme')}: ${th}`}
                            />
                          );
                        })}
                      </div>
                      {draft.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDraft(ex.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                          {t('admin.removeExchange')}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      {t('admin.embedUrl')}
                    </label>
                    <input
                      type="url"
                      value={ex.embedUrl || ''}
                      onChange={(e) => updateDraft(ex.id, { embedUrl: e.target.value })}
                      placeholder="https://padlet.com/embed/..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {['from', 'to'].map((role) => (
                      <div
                        key={role}
                        className="rounded-xl bg-white border border-slate-200 p-3 space-y-2"
                      >
                        <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                          {role === 'from' ? t('invoice.from') : t('invoice.to')}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {['KR','JP','ID','US'].map((cc) => (
                            <button
                              key={cc}
                              type="button"
                              onClick={() => updateCountryBySearch(ex.id, role, cc)}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-sky-50 hover:border-sky-200"
                            >
                              {cc}
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            value={ex[role].flag}
                            onChange={(e) =>
                              updateDraftNested(ex.id, role, { flag: e.target.value })
                            }
                            aria-label={t('admin.flag')}
                            className="w-14 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-lg"
                          />
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              list={`country-list-${role}`}
                              onBlur={(e) => updateCountryBySearch(ex.id, role, e.target.value)}
                              placeholder={t('guest.countrySearch')}
                              className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                            />
                            <input
                              value={ex[role].country}
                              onChange={(e) =>
                                updateDraftNested(ex.id, role, { country: e.target.value, countryCode: '' })
                              }
                              placeholder={t('admin.country')}
                              className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                            />
                            <datalist id={`country-list-${role}`}>
                              {COUNTRIES.map((c) => (
                                <option key={c.code} value={`${c.code} - ${c.name}`}>
                                  {c.code} · {c.name}
                                </option>
                              ))}
                            </datalist>
                          </div>
                        </div>
                        <input
                          value={ex[role].school}
                          onChange={(e) =>
                            updateDraftNested(ex.id, role, { school: e.target.value })
                          }
                          placeholder={t('admin.school')}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        />
                        <input
                          value={ex[role].address || ''}
                          onChange={(e) =>
                            updateDraftNested(ex.id, role, { address: e.target.value })
                          }
                          placeholder={t('admin.address')}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 mt-3">
                    <input
                      value={ex.trackingNo}
                      onChange={(e) => updateDraft(ex.id, { trackingNo: e.target.value })}
                      placeholder={t('admin.trackingNo')}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-mono"
                    />
                    <input
                      type="date"
                      value={ex.date}
                      onChange={(e) => updateDraft(ex.id, { date: e.target.value })}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                    />
                    <input
                      value={ex.weight}
                      onChange={(e) => updateDraft(ex.id, { weight: e.target.value })}
                      placeholder={t('admin.weight')}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <input
                    value={ex.contents}
                    onChange={(e) => updateDraft(ex.id, { contents: e.target.value })}
                    placeholder={t('admin.contents')}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm mt-2"
                  />
                  <textarea
                    value={ex.message}
                    onChange={(e) => updateDraft(ex.id, { message: e.target.value })}
                    placeholder={t('admin.message')}
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm mt-2"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addDraft}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-bold text-slate-500 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              >
                <Plus size={16} />
                {t('admin.addExchange')}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">{t('guest.createHint')}</p>
              <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2">
                <AnimatePresence>
                  {toast && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600"
                    >
                      <Check size={14} /> {toast}
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={save}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 transition-colors"
                >
                  <Save size={16} />
                  {t('guest.saveAndPreview')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
