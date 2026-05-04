import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useBoxData } from '../store/BoxDataContext.jsx';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '2865';

export default function AdminModal({ open, onClose }) {
  const { t } = useTranslation();
  const { data, update, updateCountry, addCountry, removeCountry, reset } = useBoxData();

  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [draft, setDraft] = useState(data);

  useEffect(() => {
    if (open) {
      setDraft(data);
      setError('');
      setPassword('');
    } else {
      setAuth(false);
    }
  }, [open, data]);

  const tryLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuth(true);
      setError('');
    } else {
      setError(t('admin.wrongPassword'));
    }
  };

  const save = () => {
    update({
      trackingNo: draft.trackingNo,
      date: draft.date,
      weight: draft.weight,
      contents: draft.contents,
      message: draft.message,
      embedUrl: draft.embedUrl,
    });
    draft.countries.forEach((c) => updateCountry(c.id, c));
    setToast(t('admin.saved'));
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-krds-primary/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-title"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-krds-line flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-krds-primary to-krds-secondary text-white">
              <div className="flex items-center gap-2">
                <span className="material-icons-round" aria-hidden="true">
                  admin_panel_settings
                </span>
                <h2 id="admin-title" className="text-lg font-extrabold">
                  {t('admin.title')}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="close"
                className="rounded-full p-1 hover:bg-white/20"
              >
                <span className="material-icons-round" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {!auth ? (
                <form onSubmit={tryLogin} className="max-w-sm mx-auto py-8 space-y-4">
                  <div className="text-center">
                    <span
                      className="material-icons-round text-krds-primary"
                      style={{ fontSize: 56 }}
                      aria-hidden="true"
                    >
                      lock
                    </span>
                    <p className="mt-2 font-bold text-krds-primary">
                      {t('admin.passwordPrompt')}
                    </p>
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    autoFocus
                    maxLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('admin.passwordPlaceholder')}
                    className="field text-center tracking-[0.5em] text-lg"
                  />
                  {error && (
                    <p
                      role="alert"
                      className="text-sm font-bold text-red-600 text-center"
                    >
                      {error}
                    </p>
                  )}
                  <button type="submit" className="btn-primary w-full">
                    {t('admin.login')}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Embed */}
                  <section className="rounded-2xl border border-krds-line p-4 bg-pastel-blue/20">
                    <h3 className="font-extrabold text-krds-primary mb-2 flex items-center gap-1">
                      <span className="material-icons-round" style={{ fontSize: 20 }} aria-hidden>
                        link
                      </span>
                      {t('admin.embedUrl')}
                    </h3>
                    <input
                      className="field"
                      type="url"
                      value={draft.embedUrl || ''}
                      onChange={(e) => setDraft({ ...draft, embedUrl: e.target.value })}
                      placeholder="https://padlet.com/embed/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('admin.embedHint')}</p>
                  </section>

                  {/* Invoice fields */}
                  <section className="rounded-2xl border border-krds-line p-4 bg-pastel-yellow/30">
                    <h3 className="font-extrabold text-krds-primary mb-3 flex items-center gap-1">
                      <span className="material-icons-round" style={{ fontSize: 20 }} aria-hidden>
                        edit_document
                      </span>
                      {t('admin.edit')}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="label">{t('invoice.trackingNo')}</label>
                        <input
                          className="field font-mono"
                          value={draft.trackingNo}
                          onChange={(e) => setDraft({ ...draft, trackingNo: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">{t('invoice.date')}</label>
                        <input
                          className="field"
                          type="date"
                          value={draft.date}
                          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">{t('invoice.weight')}</label>
                        <input
                          className="field"
                          value={draft.weight}
                          onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="label">{t('invoice.contents')}</label>
                        <input
                          className="field"
                          value={draft.contents}
                          onChange={(e) => setDraft({ ...draft, contents: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="label">{t('invoice.message')}</label>
                        <textarea
                          className="field"
                          rows={3}
                          value={draft.message}
                          onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Countries */}
                  <section className="rounded-2xl border border-krds-line p-4 bg-pastel-green/30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-krds-primary flex items-center gap-1">
                        <span
                          className="material-icons-round"
                          style={{ fontSize: 20 }}
                          aria-hidden
                        >
                          public
                        </span>
                        {t('admin.countryList')}
                      </h3>
                      <button onClick={addCountry} className="btn-ghost text-sm">
                        <span
                          className="material-icons-round"
                          style={{ fontSize: 16 }}
                          aria-hidden
                        >
                          add
                        </span>
                        {t('admin.addCountry')}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {draft.countries.map((c, idx) => (
                        <div
                          key={c.id}
                          className="rounded-xl bg-white border border-krds-line p-3"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <select
                              value={c.role}
                              onChange={(e) => {
                                const v = e.target.value;
                                const next = [...draft.countries];
                                next[idx] = { ...c, role: v };
                                setDraft({ ...draft, countries: next });
                              }}
                              className="field !w-auto !py-1.5"
                            >
                              <option value="from">{t('invoice.from')}</option>
                              <option value="to">{t('invoice.to')}</option>
                            </select>
                            <input
                              className="field !w-20 text-center text-xl"
                              value={c.flag}
                              onChange={(e) => {
                                const next = [...draft.countries];
                                next[idx] = { ...c, flag: e.target.value };
                                setDraft({ ...draft, countries: next });
                              }}
                              aria-label="flag emoji"
                            />
                            <button
                              onClick={() => {
                                removeCountry(c.id);
                                setDraft({
                                  ...draft,
                                  countries: draft.countries.filter((x) => x.id !== c.id),
                                });
                              }}
                              className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:underline"
                            >
                              <span
                                className="material-icons-round"
                                style={{ fontSize: 16 }}
                                aria-hidden
                              >
                                delete
                              </span>
                              {t('admin.removeCountry')}
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-3 gap-2">
                            <input
                              className="field"
                              placeholder={t('invoice.school')}
                              value={c.school}
                              onChange={(e) => {
                                const next = [...draft.countries];
                                next[idx] = { ...c, school: e.target.value };
                                setDraft({ ...draft, countries: next });
                              }}
                            />
                            <input
                              className="field"
                              placeholder={t('invoice.country')}
                              value={c.country}
                              onChange={(e) => {
                                const next = [...draft.countries];
                                next[idx] = { ...c, country: e.target.value };
                                setDraft({ ...draft, countries: next });
                              }}
                            />
                            <input
                              className="field"
                              placeholder={t('invoice.address')}
                              value={c.address || ''}
                              onChange={(e) => {
                                const next = [...draft.countries];
                                next[idx] = { ...c, address: e.target.value };
                                setDraft({ ...draft, countries: next });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Footer actions */}
            {auth && (
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-krds-line bg-gray-50">
                <button
                  onClick={() => {
                    if (confirm('Reset to defaults?')) reset();
                  }}
                  className="btn-ghost text-sm"
                >
                  <span className="material-icons-round" style={{ fontSize: 16 }} aria-hidden>
                    restart_alt
                  </span>
                  Reset
                </button>
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {toast && (
                      <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-bold text-green-600"
                      >
                        ✓ {toast}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button onClick={onClose} className="btn-ghost">
                    {t('admin.cancel')}
                  </button>
                  <button onClick={save} className="btn-primary">
                    <span className="material-icons-round" style={{ fontSize: 18 }} aria-hidden>
                      save
                    </span>
                    {t('admin.save')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
