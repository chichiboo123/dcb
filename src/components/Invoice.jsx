import { useTranslation } from 'react-i18next';
import { useBoxData } from '../store/BoxDataContext.jsx';
import { motion } from 'framer-motion';

function Field({ label, children }) {
  return (
    <div className="border-b border-dashed border-kraft-300 pb-1.5">
      <div className="text-[10px] font-extrabold uppercase tracking-widest text-kraft-500">
        {label}
      </div>
      <div className="text-[13px] sm:text-sm font-semibold text-krds-text leading-snug">
        {children}
      </div>
    </div>
  );
}

export default function Invoice({ compact = false }) {
  const { t } = useTranslation();
  const { data } = useBoxData();
  const sender = data.countries.find((c) => c.role === 'from') || data.countries[0];
  const receiver = data.countries.find((c) => c.role === 'to') || data.countries[1];

  return (
    <motion.div
      initial={{ rotate: -2, y: 0 }}
      animate={{ rotate: -2 }}
      whileHover={{ rotate: -1, scale: 1.01 }}
      className={[
        'relative bg-[#FBF6E7] rounded-md shadow-invoice',
        'border border-kraft-200',
        compact ? 'w-[300px] p-3' : 'w-[330px] sm:w-[380px] p-4',
        'select-none',
      ].join(' ')}
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(180,140,60,0.05) 0 1px, transparent 1px 22px)',
      }}
    >
      {/* Top tear strip */}
      <div className="absolute -top-1.5 inset-x-3 h-3 dotted-perforation opacity-60" />

      {/* Title bar */}
      <div className="flex items-center justify-between border-b-2 border-krds-primary pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className="material-icons-round text-krds-primary"
            style={{ fontSize: 22 }}
            aria-hidden="true"
          >
            local_shipping
          </span>
          <div className="font-extrabold text-[11px] sm:text-xs tracking-widest text-krds-primary">
            {t('invoice.title')}
          </div>
        </div>
        <div className="stamp text-[10px] border-krds-point text-krds-point bg-white">
          {t('invoice.express')}
        </div>
      </div>

      {/* Tracking + Barcode */}
      <div className="mb-3">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-kraft-500">
          {t('invoice.trackingNo')}
        </div>
        <div className="font-mono text-sm font-bold text-krds-text">{data.trackingNo}</div>
        <div className="barcode mt-1.5 rounded-sm" aria-hidden="true" />
      </div>

      {/* From / To */}
      <div className="grid grid-cols-1 gap-2.5">
        <div className="rounded-md bg-pastel-yellow/60 p-2.5 border border-kraft-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-krds-primary">
              {t('invoice.from')}
            </span>
            <span className="text-base" aria-hidden="true">
              {sender?.flag}
            </span>
          </div>
          <div className="mt-1 text-sm font-extrabold text-krds-text">
            {sender?.school}
          </div>
          <div className="text-xs text-gray-700">{sender?.country}</div>
          {sender?.address && (
            <div className="text-[11px] text-gray-500 mt-0.5">{sender.address}</div>
          )}
        </div>

        <div className="relative rounded-md bg-pastel-blue/60 p-2.5 border-2 border-krds-secondary">
          <span
            className="absolute -top-2 -right-2 material-icons-round text-krds-point bg-white rounded-full p-0.5 border border-krds-point shadow"
            style={{ fontSize: 18 }}
            aria-hidden="true"
          >
            place
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-krds-secondary">
              {t('invoice.to')}
            </span>
            <span className="text-base" aria-hidden="true">
              {receiver?.flag}
            </span>
          </div>
          <div className="mt-1 text-sm font-extrabold text-krds-text">
            {receiver?.school}
          </div>
          <div className="text-xs text-gray-700">{receiver?.country}</div>
          {receiver?.address && (
            <div className="text-[11px] text-gray-500 mt-0.5">{receiver.address}</div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-3">
        <Field label={t('invoice.date')}>{data.date}</Field>
        <Field label={t('invoice.weight')}>{data.weight}</Field>
        <div className="col-span-2">
          <Field label={t('invoice.contents')}>{data.contents}</Field>
        </div>
      </div>

      {/* Message */}
      <div className="mt-3 rounded-md bg-white border border-dashed border-kraft-300 p-2.5">
        <div className="flex items-center gap-1 mb-0.5">
          <span
            className="material-icons-round text-krds-point"
            style={{ fontSize: 16 }}
            aria-hidden="true"
          >
            mail
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-krds-point">
            {t('invoice.message')}
          </span>
        </div>
        <p className="text-[12px] sm:text-[13px] whitespace-pre-line leading-relaxed text-krds-text">
          {data.message}
        </p>
      </div>

      {/* Bottom: stamps */}
      <div className="flex items-center justify-between mt-3">
        <div className="stamp text-[10px] border-red-500 text-red-500 bg-white">
          {t('invoice.fragile')}
        </div>
        <div className="text-[10px] text-kraft-500 font-bold tracking-widest">
          {t('invoice.withCare')}
        </div>
        <div
          className="stamp text-[10px] border-krds-primary text-krds-primary bg-white"
          style={{ transform: 'rotate(6deg)' }}
        >
          {t('invoice.signature')}
        </div>
      </div>
    </motion.div>
  );
}
