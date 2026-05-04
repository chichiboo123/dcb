import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useBoxData } from '../store/BoxDataContext.jsx';
import Invoice from './Invoice.jsx';
import EmbedViewer from './EmbedViewer.jsx';

/**
 * 3D-feel gift box. Click → lid lifts, ribbon parts, content floats up.
 */
export default function CultureBox() {
  const { t } = useTranslation();
  const { data } = useBoxData();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Hint */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-krds-line px-4 py-1.5 text-sm font-bold text-krds-primary shadow-paper animate-float"
          >
            <span
              className="material-icons-round text-krds-point"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              touch_app
            </span>
            {t('app.tapToOpen')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage */}
      <div
        className="relative"
        style={{ perspective: 1400 }}
        aria-live="polite"
      >
        {/* Floor shadow */}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl"
          animate={{
            width: open ? 360 : 280,
            height: open ? 28 : 22,
            opacity: open ? 0.35 : 0.25,
          }}
          style={{ bottom: -28 }}
          transition={{ duration: 0.5 }}
        />

        {/* Box wrapper */}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? t('app.closeBox') : t('app.openBox')}
          whileHover={{ scale: open ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative outline-none"
          style={{
            width: 'min(86vw, 420px)',
            height: 'min(60vw, 300px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Box body (kraft cardboard) */}
          <div
            className="absolute inset-0 rounded-2xl shadow-box-3d"
            style={{
              background:
                'linear-gradient(180deg, #E6CD96 0%, #D4B16A 50%, #B58A45 100%)',
              transform: 'translateZ(0)',
            }}
          >
            {/* Front face highlight */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 35%)',
              }}
            />
            {/* Vertical ribbon (front) */}
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 sm:w-14"
              style={{ background: 'linear-gradient(180deg, #FF8A5E, #FF6B35)' }}
            />
            {/* Side stamps */}
            <div className="absolute top-3 left-3 stamp text-[10px] border-krds-primary text-krds-primary bg-white/90">
              ✈ {t('invoice.express')}
            </div>
            <div
              className="absolute bottom-3 right-3 stamp text-[10px] border-red-500 text-red-500 bg-white/90"
              style={{ transform: 'rotate(8deg)' }}
            >
              {t('invoice.fragile')}
            </div>

            {/* Invoice attached on front (slightly tilted) */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden sm:block">
              <div className="scale-[0.55] origin-top-left">
                <Invoice compact />
              </div>
            </div>
            <div className="absolute inset-x-3 bottom-3 sm:hidden">
              <div className="scale-[0.7] origin-bottom-left">
                <div className="rounded-md bg-[#FBF6E7] border border-kraft-200 p-2 shadow-paper">
                  <div className="text-[9px] font-extrabold uppercase tracking-widest text-krds-primary">
                    {t('invoice.trackingNo')}
                  </div>
                  <div className="font-mono text-[11px] font-bold">{data.trackingNo}</div>
                  <div className="barcode mt-1 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Lid */}
          <motion.div
            className="absolute left-0 right-0 rounded-2xl shadow-box-3d origin-bottom"
            style={{
              top: 0,
              height: '32%',
              background:
                'linear-gradient(180deg, #F2E4C4 0%, #E6CD96 60%, #D4B16A 100%)',
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 100%',
            }}
            animate={{
              rotateX: open ? -130 : 0,
              y: open ? -10 : 0,
            }}
            transition={{ type: 'spring', stiffness: 110, damping: 14 }}
          >
            {/* Tape stripes on lid */}
            <div className="absolute inset-0 tape-stripes opacity-70 rounded-2xl" />
            {/* Lid front edge shadow */}
            <div className="absolute inset-x-0 bottom-0 h-2 bg-black/20 rounded-b-2xl" />
            {/* Horizontal ribbon (lid) */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 sm:h-14"
              style={{ background: 'linear-gradient(90deg, #FF8A5E, #FF6B35)' }}
            />
            {/* Bow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #FFB089, #FF6B35 70%, #C84A1A 100%)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 -translate-x-[120%] -translate-y-1/2 w-10 h-7 rounded-l-full rotate-[-25deg]"
              style={{ background: 'linear-gradient(135deg, #FF8A5E, #FF6B35)' }}
            />
            <div
              className="absolute left-1/2 top-1/2 translate-x-[20%] -translate-y-1/2 w-10 h-7 rounded-r-full rotate-[25deg]"
              style={{ background: 'linear-gradient(225deg, #FF8A5E, #FF6B35)' }}
            />
          </motion.div>

          {/* Inner glow when open */}
          <AnimatePresence>
            {open && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-6 top-4 h-14 rounded-full"
                style={{
                  background:
                    'radial-gradient(ellipse, rgba(255,247,200,0.95) 0%, rgba(255,247,200,0) 70%)',
                  filter: 'blur(8px)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Confetti */}
          <AnimatePresence>
            {open &&
              Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/3 w-2 h-2 rounded-sm"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                  animate={{
                    x: (i - 7) * 22 + (i % 2 ? 10 : -10),
                    y: -120 - (i % 5) * 14,
                    rotate: i * 40,
                    opacity: [0, 1, 0],
                    scale: 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.03 }}
                  style={{
                    background: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'][i % 5],
                  }}
                />
              ))}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Open content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="mt-10 w-full max-w-5xl"
          >
            <div className="grid lg:grid-cols-[1fr_360px] gap-5">
              <EmbedViewer url={data.embedUrl} />
              <div className="hidden lg:block">
                <Invoice />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
