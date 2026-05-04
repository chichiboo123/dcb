import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Package, ArrowRight, Sparkles } from 'lucide-react';
import { codeToFlag, getFlagImageUrl } from '../lib/countries.js';

const THEMES = {
  blue: {
    bodyGrad: ['#7DD3FC', '#38BDF8', '#0EA5E9'],
    sideGrad: ['#0EA5E9', '#0284C7'],
    bottomGrad: ['#0284C7', '#0369A1'],
    lidGrad: ['#E0F2FE', '#BAE6FD', '#7DD3FC'],
    lidSideGrad: ['#7DD3FC', '#38BDF8'],
    ribbonGrad: ['#F9A8D4', '#EC4899'],
    accent: 'text-sky-700',
    chip: 'bg-sky-50 text-sky-700 border-sky-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(14,165,233,0.5)]',
  },
  pink: {
    bodyGrad: ['#FBCFE8', '#F472B6', '#EC4899'],
    sideGrad: ['#EC4899', '#DB2777'],
    bottomGrad: ['#DB2777', '#BE185D'],
    lidGrad: ['#FCE7F3', '#FBCFE8', '#F9A8D4'],
    lidSideGrad: ['#F9A8D4', '#F472B6'],
    ribbonGrad: ['#FDE68A', '#FBBF24'],
    accent: 'text-pink-700',
    chip: 'bg-pink-50 text-pink-700 border-pink-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(236,72,153,0.5)]',
  },
  green: {
    bodyGrad: ['#6EE7B7', '#34D399', '#10B981'],
    sideGrad: ['#10B981', '#059669'],
    bottomGrad: ['#059669', '#047857'],
    lidGrad: ['#D1FAE5', '#A7F3D0', '#6EE7B7'],
    lidSideGrad: ['#6EE7B7', '#34D399'],
    ribbonGrad: ['#F9A8D4', '#EC4899'],
    accent: 'text-emerald-700',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(16,185,129,0.5)]',
  },
  yellow: {
    bodyGrad: ['#FDE68A', '#FBBF24', '#F59E0B'],
    sideGrad: ['#F59E0B', '#D97706'],
    bottomGrad: ['#D97706', '#B45309'],
    lidGrad: ['#FEF9C3', '#FEF08A', '#FDE68A'],
    lidSideGrad: ['#FDE68A', '#FBBF24'],
    ribbonGrad: ['#7DD3FC', '#38BDF8'],
    accent: 'text-amber-700',
    chip: 'bg-amber-50 text-amber-800 border-amber-200',
    glow: 'shadow-[0_30px_50px_-20px_rgba(245,158,11,0.5)]',
  },
  purple: {
    bodyGrad: ['#C4B5FD', '#8B5CF6', '#7C3AED'],
    sideGrad: ['#7C3AED', '#6D28D9'],
    bottomGrad: ['#6D28D9', '#5B21B6'],
    lidGrad: ['#EDE9FE', '#DDD6FE', '#C4B5FD'],
    lidSideGrad: ['#A78BFA', '#8B5CF6'],
    ribbonGrad: ['#F9A8D4', '#EC4899'],
    accent: 'text-violet-700', chip: 'bg-violet-50 text-violet-700 border-violet-200', glow: 'shadow-[0_30px_50px_-20px_rgba(139,92,246,0.5)]',
  },
  orange: {
    bodyGrad: ['#FDBA74', '#FB923C', '#F97316'],
    sideGrad: ['#F97316', '#EA580C'],
    bottomGrad: ['#EA580C', '#C2410C'],
    lidGrad: ['#FFEDD5', '#FED7AA', '#FDBA74'],
    lidSideGrad: ['#FDBA74', '#FB923C'],
    ribbonGrad: ['#7DD3FC', '#38BDF8'],
    accent: 'text-orange-700', chip: 'bg-orange-50 text-orange-700 border-orange-200', glow: 'shadow-[0_30px_50px_-20px_rgba(249,115,22,0.5)]',
  },
};

// Helpers to build CSS linear-gradient strings from color arrays
function grad(colors, dir = '180deg') {
  return `linear-gradient(${dir}, ${colors.join(', ')})`;
}

const D = 28; // box depth in px

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
      {/* Country chips */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${theme.chip}`}>
          <span aria-hidden="true">{exchange.from.countryCode ? <img src={getFlagImageUrl(exchange.from.countryCode)} alt="" className="w-4 h-4 rounded-sm inline-block" onError={(e)=>{e.currentTarget.style.display='none';}} /> : (exchange.from.flag || codeToFlag(exchange.from.countryCode || ''))}</span>
          {exchange.from.country}
        </span>
        <ArrowRight size={14} className="text-slate-400" aria-hidden="true" />
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${theme.chip}`}>
          <span aria-hidden="true">{exchange.to.countryCode ? <img src={getFlagImageUrl(exchange.to.countryCode)} alt="" className="w-4 h-4 rounded-sm inline-block" onError={(e)=>{e.currentTarget.style.display='none';}} /> : (exchange.to.flag || codeToFlag(exchange.to.countryCode || ''))}</span>
          {exchange.to.country}
        </span>
      </div>

      {/* ── 3D scene ── */}
      <motion.div
        animate={{
          rotateX: hover ? -22 : -14,
          rotateY: hover ? 22 : 14,
          y: hover ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative mx-auto w-[260px] h-[200px] ${theme.glow}`}
      >
        {/* Floor shadow */}
        <motion.div
          aria-hidden="true"
          animate={{ scaleX: hover ? 1.12 : 1, opacity: hover ? 0.5 : 0.3 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-6 rounded-[50%] bg-slate-900/40 blur-md"
        />

        {/* ── BODY FRONT FACE ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            transform: `translateZ(${D / 2}px)`,
            background: grad(theme.bodyGrad),
          }}
        >
          {/* glossy top highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 38%)' }}
          />
          {/* vertical ribbon */}
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-9"
            style={{ background: grad(theme.ribbonGrad) }}
          />
          {/* tracking badge */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur text-[9px] font-mono font-bold text-slate-600">
            {t('box.boxNumber')} {exchange.id.toUpperCase()}
          </div>
          <Package size={16} className={`absolute top-2.5 right-2.5 ${theme.accent}`} aria-hidden="true" />
        </div>

        {/* ── BODY RIGHT FACE ──
            Derivation: right:0, pivot at right-center.
            rotateY(-90°) spins face perpendicular; translateZ(D/2) shifts it to front-face edge. */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 rounded-r-2xl"
          style={{
            width: `${D}px`,
            height: '200px',
            transformOrigin: 'right center',
            transform: `rotateY(-90deg) translateZ(${D / 2}px)`,
            background: grad(theme.sideGrad),
          }}
        />

        {/* ── BODY BOTTOM FACE ──
            bottom:0, pivot at center-bottom.
            rotateX(90°) spins face downward; translateZ(D/2) aligns with front face. */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
          style={{
            height: `${D}px`,
            transformOrigin: 'center bottom',
            transform: `rotateX(90deg) translateZ(${D / 2}px)`,
            background: grad(theme.bottomGrad, '90deg'),
          }}
        />

        {/* ── LID ──
            A static wrapper positions the lid D/2 px forward (matching body front).
            The motion.div inside rotates the lid open/closed around its bottom edge. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '70px',
            transform: `translateZ(${D / 2}px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            animate={{ rotateX: hover ? -52 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center bottom',
            }}
          >
            {/* Lid front face */}
            <div
              className="absolute inset-0 rounded-t-2xl overflow-hidden"
              style={{ background: grad(theme.lidGrad) }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 55%)' }}
              />
              {/* horizontal ribbon */}
              <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8"
                style={{ background: grad(theme.ribbonGrad, '90deg') }}
              />
              {/* bow */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full shadow-md"
                style={{ background: grad(theme.ribbonGrad, '135deg') }}
              />
              {/* lid-body separator shadow */}
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/15" />
            </div>

            {/* Lid right face */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 rounded-tr-2xl"
              style={{
                width: `${D}px`,
                height: '70px',
                transformOrigin: 'right center',
                transform: `rotateY(-90deg) translateZ(${D / 2}px)`,
                background: grad(theme.lidSideGrad),
              }}
            />

            {/* Lid top face */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 rounded-t-2xl"
              style={{
                height: `${D}px`,
                transformOrigin: 'center top',
                transform: `rotateX(-90deg) translateZ(${D / 2}px)`,
                background: grad(theme.lidSideGrad, '90deg'),
              }}
            />
          </motion.div>
        </div>

        {/* Sparkle */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
          className="absolute -top-3 -right-3"
          style={{ transform: `translateZ(${D}px)` }}
        >
          <Sparkles size={22} className="text-amber-400 drop-shadow" />
        </motion.div>
      </motion.div>

      {/* CTA */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
        <span>{t('box.open')}</span>
        <motion.span animate={{ x: hover ? 3 : 0 }} className="inline-flex" aria-hidden="true">
          <ArrowRight size={16} />
        </motion.span>
      </div>
    </motion.button>
  );
}
