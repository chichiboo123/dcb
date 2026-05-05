import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Save, Plus, Trash2, Check, Search } from 'lucide-react';
import { useBoxData } from '../store/BoxDataContext.jsx';
import { makeEmptyExchange } from '../lib/mode.js';
import { COUNTRIES, codeToFlag, findCountry, getFlagImageUrl, getLocalizedCountryName } from '../lib/countries.js';
import { loadGoogleMapsAPI, HAS_MAPS_KEY, SCHOOL_TYPES } from '../lib/googleMaps.js';

const THEMES = ['blue', 'pink', 'green', 'yellow', 'purple', 'orange'];

// ── School Places Autocomplete ────────────────────────────────────────────────
// Self-contained: loads Google Maps API, initialises Autocomplete, calls onPlace.
function SchoolPlaceSearch({ onPlace, value, onChange, placeholderKey = 'map.searchPlaceholder' }) {
  const { t } = useTranslation();
  const mountRef = useRef(null);
  const placeElRef = useRef(null);
  // Keep a stable ref to the latest onPlace callback
  const onPlaceRef = useRef(onPlace);
  useEffect(() => { onPlaceRef.current = onPlace; });

  useEffect(() => {
    if (!HAS_MAPS_KEY) return;
    let cancelled = false;

    loadGoogleMapsAPI()
      .then(() => {
        if (cancelled || !mountRef.current || placeElRef.current) return;
        const PlaceAutocompleteElement = window.google?.maps?.places?.PlaceAutocompleteElement;
        if (!PlaceAutocompleteElement) throw new Error('PlaceAutocompleteElement is not available.');

        const placeEl = new PlaceAutocompleteElement({
          includedPrimaryTypes: SCHOOL_TYPES,
        });
        placeEl.setAttribute('aria-label', t(placeholderKey));
        placeEl.addEventListener('input', () => {
          onChange?.(placeEl.value || '');
        });
        placeEl.addEventListener('gmp-placeselect', async (evt) => {
          const place = evt.place || (await evt.placePrediction?.toPlace?.());
          if (!place) return;
          await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location', 'id', 'types', 'addressComponents'],
          });

          if (!place.location) return;
          const placeTypes = place.types || [];
          const isSchoolLike = placeTypes.some((type) => SCHOOL_TYPES.includes(type));
          if (!isSchoolLike) return;

          onPlaceRef.current({
            name: place.displayName || placeEl.value || '',
            address: place.formattedAddress || '',
            lat: place.location?.lat || null,
            lng: place.location?.lng || null,
            placeId: place.id || '',
            components: place.addressComponents || [],
          });
        });
        mountRef.current.appendChild(placeEl);
        placeElRef.current = placeEl;
      })
      .catch((err) => {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('[GoogleMaps] autocomplete init failed:', err);
        }
      });

    return () => {
      cancelled = true;
      if (placeElRef.current && mountRef.current?.contains(placeElRef.current)) {
        mountRef.current.removeChild(placeElRef.current);
      }
      placeElRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!placeElRef.current) return;
    if ((placeElRef.current.value || '') !== (value || '')) {
      placeElRef.current.value = value || '';
    }
  }, [value]);

  if (!HAS_MAPS_KEY) return null;

  return (
    <div className="relative">
      <Search
        size={13}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none z-10"
        aria-hidden="true"
      />
      <div
        ref={mountRef}
        className="w-full pl-8 pr-2 py-1.5 text-sm bg-sky-50/60 border border-sky-200 outline-none
          focus-within:border-sky-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-all"
        style={{ borderRadius: '10px' }}
      />
    </div>
  );
}

// ── Country extraction from Places address_components ────────────────────────
function extractCountryPatch(components, lang) {
  if (!Array.isArray(components)) return {};
  const comp = components.find((c) => c.types?.includes('country'));
  if (!comp) return {};
  const code = comp.short_name;
  const found = findCountry(code, lang);
  if (!found) return { country: comp.long_name };
  return {
    country: found.name,
    countryCode: found.code,
    flag: codeToFlag(found.code),
  };
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function GuestCreateModal({ open, onClose }) {
  const { t, i18n } = useTranslation();
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
    const found = findCountry(query, i18n.language);
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
                  {/* Exchange header: country arrows + theme picker + remove */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="text-sm font-bold text-slate-700 truncate">
                      <span aria-hidden="true">
                        {ex.from.countryCode
                          ? <img src={getFlagImageUrl(ex.from.countryCode)} alt="" className="w-4 h-4 rounded-sm inline-block" />
                          : ex.from.flag}
                      </span>{' '}
                      {ex.from.country || '—'}
                      {' '}<span className="text-slate-400">→</span>{' '}
                      <span aria-hidden="true">
                        {ex.to.countryCode
                          ? <img src={getFlagImageUrl(ex.to.countryCode)} alt="" className="w-4 h-4 rounded-sm inline-block" />
                          : ex.to.flag}
                      </span>{' '}
                      {ex.to.country || '—'}
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

                  {/* Embed URL */}
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

                  {/* From / To columns */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {['from', 'to'].map((role) => (
                      <div
                        key={role}
                        className="rounded-xl bg-white border border-slate-200 p-3 space-y-2"
                      >
                        <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                          {role === 'from' ? t('invoice.from') : t('invoice.to')}
                        </div>

                        {/* Quick-select country buttons */}
                        <div className="flex flex-wrap gap-1">
                          {['KR', 'JP', 'ID', 'US'].map((cc) => (
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

                        {/* Country search + flag + country name */}
                        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_64px_1fr] gap-2">
                          <div>
                            <input
                              list={`country-list-${role}`}
                              onBlur={(e) => updateCountryBySearch(ex.id, role, e.target.value)}
                              placeholder={t('guest.countrySearchShort')}
                              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                            />
                            <datalist id={`country-list-${role}`}>
                              {[...new Set(COUNTRIES)].map((code) => {
                                const localized = getLocalizedCountryName(code, i18n.language);
                                return (
                                  <option key={code} value={`${code} - ${localized}`} />
                                );
                              })}
                            </datalist>
                          </div>
                          <input
                            value={ex[role].flag}
                            onChange={(e) =>
                              updateDraftNested(ex.id, role, { flag: e.target.value })
                            }
                            aria-label={t('admin.flag')}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-center text-lg"
                          />
                          <input
                            value={ex[role].country}
                            onChange={(e) =>
                              updateDraftNested(ex.id, role, { country: e.target.value, countryCode: '' })
                            }
                            placeholder={t('admin.country')}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                          />
                        </div>

                        {/* School name */}
                        {HAS_MAPS_KEY ? (
                          <SchoolPlaceSearch
                            key={`${ex.id}-${role}-school`}
                            value={ex[role].school}
                            onChange={(v) => updateDraftNested(ex.id, role, { school: v })}
                            placeholderKey="admin.school"
                            onPlace={(p) => {
                              const countryPatch = extractCountryPatch(p.components, i18n.language);
                              updateDraftNested(ex.id, role, {
                                school: p.name,
                                address: p.address,
                                lat: p.lat,
                                lng: p.lng,
                                placeId: p.placeId,
                                ...countryPatch,
                              });
                            }}
                          />
                        ) : (
                          <input
                            value={ex[role].school}
                            onChange={(e) =>
                              updateDraftNested(ex.id, role, { school: e.target.value })
                            }
                            placeholder={t('admin.school')}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                          />
                        )}

                        {/* Address */}
                        {HAS_MAPS_KEY ? (
                          <SchoolPlaceSearch
                            key={`${ex.id}-${role}-address`}
                            value={ex[role].address}
                            onChange={(v) => updateDraftNested(ex.id, role, { address: v })}
                            placeholderKey="admin.address"
                            onPlace={(p) => {
                              const countryPatch = extractCountryPatch(p.components, i18n.language);
                              updateDraftNested(ex.id, role, {
                                address: p.address,
                                lat: p.lat,
                                lng: p.lng,
                                placeId: p.placeId || ex[role].placeId,
                                ...countryPatch,
                              });
                            }}
                          />
                        ) : (
                          <input
                            value={ex[role].address || ''}
                            onChange={(e) =>
                              updateDraftNested(ex.id, role, { address: e.target.value })
                            }
                            placeholder={t('admin.address')}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                          />
                        )}

                        {/* Coordinate badge — shown after autocomplete fills lat/lng */}
                        {typeof ex[role].lat === 'number' && (
                          <div className="flex items-center gap-1 text-[10px] text-sky-600 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" aria-hidden="true" />
                            {ex[role].lat.toFixed(4)}, {ex[role].lng.toFixed(4)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tracking / date / weight */}
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
