import { useTranslation } from 'react-i18next';
import { MapPin, Mail, AlertTriangle, Plane } from 'lucide-react';

function Field({ label, children }) {
  return (
    <div className="border-b border-dashed border-amber-300/70 pb-1.5">
      <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/80">
        {label}
      </div>
      <div className="text-[13px] font-semibold text-slate-800 leading-snug">
        {children}
      </div>
    </div>
  );
}

export default function Invoice({ exchange }) {
  const { t } = useTranslation();

  return (
    <div
      className="relative bg-[#FBF6E7] rounded-2xl shadow-lg border border-amber-200/70 p-4 select-none"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(180,140,60,0.05) 0 1px, transparent 1px 22px)',
      }}
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b-2 border-sky-700 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Plane size={18} className="text-sky-700" aria-hidden="true" />
          <div className="font-extrabold text-[11px] tracking-widest text-sky-700">
            {t('invoice.title')}
          </div>
        </div>
        <div
          className="inline-flex items-center justify-center font-extrabold tracking-widest border-[2.5px] rounded-md px-2 py-0.5 text-[10px] border-orange-500 text-orange-500 bg-white"
          style={{ transform: 'rotate(-6deg)' }}
        >
          {t('invoice.express')}
        </div>
      </div>

      {/* Tracking */}
      <div className="mb-3">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700/80">
          {t('invoice.trackingNo')}
        </div>
        <div className="font-mono text-sm font-bold text-slate-900">
          {exchange.trackingNo}
        </div>
        <div
          className="mt-1.5 rounded-sm h-9"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, #111 0 2px, transparent 2px 4px, #111 4px 5px, transparent 5px 9px, #111 9px 11px, transparent 11px 13px)',
          }}
        />
      </div>

      {/* From / To */}
      <div className="space-y-2.5">
        <div className="rounded-xl bg-amber-100/60 p-2.5 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700">
              {t('invoice.from')}
            </span>
            <span className="text-base" aria-hidden="true">{exchange.from.flag}</span>
          </div>
          <div className="mt-1 text-sm font-extrabold text-slate-800">
            {exchange.from.school}
          </div>
          <div className="text-xs text-slate-700">{exchange.from.country}</div>
          {exchange.from.address && (
            <div className="text-[11px] text-slate-500 mt-0.5">{exchange.from.address}</div>
          )}
        </div>

        <div className="relative rounded-xl bg-sky-100/70 p-2.5 border-2 border-sky-500">
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center bg-white rounded-full p-1 border border-orange-400 shadow">
            <MapPin size={14} className="text-orange-500" aria-hidden="true" />
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700">
              {t('invoice.to')}
            </span>
            <span className="text-base" aria-hidden="true">{exchange.to.flag}</span>
          </div>
          <div className="mt-1 text-sm font-extrabold text-slate-800">
            {exchange.to.school}
          </div>
          <div className="text-xs text-slate-700">{exchange.to.country}</div>
          {exchange.to.address && (
            <div className="text-[11px] text-slate-500 mt-0.5">{exchange.to.address}</div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3">
        <Field label={t('invoice.date')}>{exchange.date}</Field>
        <Field label={t('invoice.weight')}>{exchange.weight}</Field>
        <div className="col-span-2">
          <Field label={t('invoice.contents')}>{exchange.contents}</Field>
        </div>
      </div>

      {/* Message */}
      {exchange.message && (
        <div className="mt-3 rounded-xl bg-white border border-dashed border-amber-300 p-2.5">
          <div className="flex items-center gap-1 mb-0.5">
            <Mail size={14} className="text-orange-500" aria-hidden="true" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
              {t('invoice.message')}
            </span>
          </div>
          <p className="text-[12px] whitespace-pre-line leading-relaxed text-slate-800">
            {exchange.message}
          </p>
        </div>
      )}

      {/* Stamps */}
      <div className="flex items-center justify-between mt-3">
        <div
          className="inline-flex items-center gap-1 font-extrabold tracking-widest border-[2.5px] rounded-md px-2 py-0.5 text-[10px] border-red-500 text-red-500 bg-white"
          style={{ transform: 'rotate(-8deg)' }}
        >
          <AlertTriangle size={11} aria-hidden="true" />
          {t('invoice.fragile')}
        </div>
        <div className="text-[10px] text-amber-700/80 font-bold tracking-widest">
          {t('invoice.withCare')}
        </div>
      </div>
    </div>
  );
}
