import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Package, ArrowRight, Sparkles } from 'lucide-react';

const THEMES = {
  blue: {
    body: 'from-sky-200 via-sky-300 to-sky-400',
    side: 'from-sky-400 to-sky-500',
    bottom: 'from-sky-500 to-sky-600',
    lid: 'from-sky-100 via-sky-200 to-sky-300',
    lidSide: 'from-sky-300 to-sky-400',
    ribbon: 'from-pink-300 to-pink-400',
    accent: 'text-sky-700',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(56,189,248,0.6)]',
  },
  pink: {
    body: 'from-pink-200 via-pink-300 to-pink-400',
    side: 'from-pink-400 to-pink-500',
    bottom: 'from-pink-500 to-pink-600',
    lid: 'from-pink-100 via-pink-200 to-pink-300',
    lidSide: 'from-pink-300 to-pink-400',
    ribbon: 'from-amber-300 to-amber-400',
    accent: 'text-pink-700',
    chip: 'bg-pink-50 text-pink-700 border-pink-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(244,114,182,0.6)]',
  },
  green: {
    body: 'from-emerald-200 via-emerald-300 to-emerald-400',
    side: 'from-emerald-400 to-emerald-500',
    bottom: 'from-emerald-500 to-emerald-600',
    lid: 'from-emerald-100 via-emerald-200 to-emerald-300',
    lidSide: 'from-emerald-300 to-emerald-400',
    ribbon: 'from-pink-300 to-pink-400',
    accent: 'text-emerald-700',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(52,211,153,0.6)]',
  },
  yellow: {
    body: 'from-amber-200 via-amber-300 to-amber-400',
    side: 'from-amber-400 to-amber-500',
    bottom: 'from-amber-500 to-amber-600',
    lid: 'from-amber-100 via-amber-200 to-amber-300',
    lidSide: 'from-amber-300 to-amber-400',
    ribbon: 'from-sky-300 to-sky-400',
    accent: 'text-amber-700',
    chip: 'bg-amber-50 text-amber-800 border-amber-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(251,191,36,0.6)]',
  },
};

const DEPTH = 36; // px depth of the 3D box

export default function BoxCard({ exchange, index = 0, onOpen }) {
  const { t } = useTranslation();
  const [hover, setHover] = useState(false);
  const theme = THEMES[exchange.theme] || THEMES.blue;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onClick={() => onOpen(exchange)}
      aria-label={t('box.openLabel', {
        from: exchange.from.country,
        to: exchange.to.country,
      })}
      className="group relative outline-none focus-visible:ring-4 focus-visible:ring-sky-300/50 rounded-3xl"
      style={{ perspective: 1400 }}
    >
      {/* Header chip — countries */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${theme.chip}`}
        >
          <span aria-hidden="true">{exchange.from.flag}</span>
          {exchange.from.country}
        </span>
        <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${theme.chip}`}
        >
          <span aria-hidden="true">{exchange.to.flag}</span>
          {exchange.to.country}
        </span>
      </div>

      {/* 3D box stage — always shown with isometric tilt */}
      <motion.div
        animate={{
          rotateX: hover ? -22 : -16,
          rotateY: hover ? 22 : 16,
          y: hover ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative mx-auto w-[260px] h-[200px] rounded-2xl ${theme.glow}`}
      >
        {/* Floor shadow */}
        <motion.div
          aria-hidden="true"
          animate={{ scaleX: hover ? 1.15 : 1.05, opacity: hover ? 0.5 : 0.35 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-6 rounded-[50%] bg-slate-900/40 blur-md"
          style={{ transform: 'translateZ(-1px)' }}
        />

        {/* Right side face */}
        <div
          aria-hidden="true"
          className={`absolute top-0 right-0 h-full bg-gradient-to-b ${theme.side}`}
          style={{
            width: `${DEPTH}px`,
            transform: `rotateY(90deg) translateZ(${260 - DEPTH / 2}px) translateX(${DEPTH / 2}px)`,
            transformOrigin: 'left center',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
          }}
        />

        {/* Left side face */}
        <div
          aria-hidden="true"
          className={`absolute top-0 left-0 h-full bg-gradient-to-b ${theme.side}`}
          style={{
            width: `${DEPTH}px`,
            transform: `rotateY(-90deg) translateZ(${DEPTH / 2}px) translateX(-${DEPTH / 2}px)`,
            transformOrigin: 'right center',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
          }}
        />

        {/* Bottom face */}
        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${theme.bottom}`}
          style={{
            height: `${DEPTH}px`,
            transform: `rotateX(-90deg) translateZ(-${DEPTH / 2}px) translateY(${DEPTH / 2}px)`,
            transformOrigin: 'center top',
          }}
        />

        {/* Box body (front face) */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${theme.body} shadow-xl overflow-hidden`}
          style={{ transform: `translateZ(${DEPTH / 2}px)` }}
        >
          {/* glossy highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl opacity-60"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 35%)',
            }}
          />
          {/* vertical ribbon */}
          <div
            className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-9 bg-gradient-to-b ${theme.ribbon}`}
          />
          {/* tracking chip */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur text-[9px] font-mono font-bold text-slate-600">
            {t('box.boxNumber')} {exchange.id.toUpperCase()}
          </div>
          {/* Package icon corner */}
          <Package
            size={16}
            className={`absolute top-2.5 right-2.5 ${theme.accent}`}
            aria-hidden="true"
          />
        </div>

        {/* Lid — has its own depth */}
        <motion.div
          animate={{
            rotateX: hover ? -55 : 0,
            y: hover ? -2 : 0,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          style={{
            transformOrigin: '50% 100%',
            transformStyle: 'preserve-3d',
            transform: `translateZ(${DEPTH / 2}px)`,
          }}
          className={`absolute left-0 right-0 top-0 h-[35%] rounded-2xl bg-gradient-to-b ${theme.lid} shadow-lg`}
        >
          {/* lid right-side */}
          <div
            aria-hidden="true"
            className={`absolute top-0 right-0 h-full bg-gradient-to-b ${theme.lidSide}`}
            style={{
              width: `${DEPTH}px`,
              transform: `rotateY(90deg) translateZ(${260 - DEPTH / 2}px) translateX(${DEPTH / 2}px)`,
              transformOrigin: 'left center',
              borderTopRightRadius: '12px',
            }}
          />
          {/* lid left-side */}
          <div
            aria-hidden="true"
            className={`absolute top-0 left-0 h-full bg-gradient-to-b ${theme.lidSide}`}
            style={{
              width: `${DEPTH}px`,
              transform: `rotateY(-90deg) translateZ(${DEPTH / 2}px) translateX(-${DEPTH / 2}px)`,
              transformOrigin: 'right center',
              borderTopLeftRadius: '12px',
            }}
          />
          {/* lid top */}
          <div
            aria-hidden="true"
            className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${theme.lidSide}`}
            style={{
              height: `${DEPTH}px`,
              transform: `rotateX(90deg) translateZ(${DEPTH / 2}px) translateY(-${DEPTH / 2}px)`,
              transformOrigin: 'center bottom',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl opacity-50"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%)',
            }}
          />
          {/* horizontal ribbon */}
          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-gradient-to-r ${theme.ribbon}`}
          />
          {/* bow */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${theme.ribbon} shadow-md`}
          />
          <div className="absolute inset-x-0 -bottom-1 h-1.5 bg-black/15 rounded-b-2xl" />
        </motion.div>

        {/* Sparkle on hover */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
          className="absolute -top-2 -right-2"
          style={{ transform: `translateZ(${DEPTH}px)` }}
        >
          <Sparkles size={22} className="text-amber-400 drop-shadow" />
        </motion.div>
      </motion.div>

      {/* CTA */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
        <span>{t('box.open')}</span>
        <motion.span
          animate={{ x: hover ? 3 : 0 }}
          className="inline-flex"
          aria-hidden="true"
        >
          <ArrowRight size={16} />
        </motion.span>
      </div>
    </motion.button>
  );
}
