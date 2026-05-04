import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maximize2, Minimize2, ExternalLink, Link2Off, Loader2 } from 'lucide-react';

export default function EmbedViewer({ url }) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef(null);

  const isValid = typeof url === 'string' && /^https?:\/\//.test(url);

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const openNewWindow = () => {
    if (isValid) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col ${
        isFs ? 'h-full' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="ml-2 text-xs font-mono text-slate-500 truncate max-w-[160px] sm:max-w-xs">
            {isValid ? new URL(url).hostname : 'no-embed'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleFullscreen}
            disabled={!isValid}
            aria-label={isFs ? t('viewer.exitFullscreen') : t('viewer.fullscreen')}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isFs ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden sm:inline">
              {isFs ? t('viewer.exitFullscreen') : t('viewer.fullscreen')}
            </span>
          </button>
          <button
            type="button"
            onClick={openNewWindow}
            disabled={!isValid}
            aria-label={t('viewer.newWindow')}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">{t('viewer.newWindow')}</span>
          </button>
        </div>
      </div>

      {/* Iframe area */}
      <div
        className={`relative bg-slate-50 ${isFs ? 'flex-1' : 'aspect-[4/3]'}`}
      >
        {!loaded && isValid && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Loader2 size={32} className="text-sky-500 animate-spin" aria-hidden="true" />
            <p className="text-sm font-semibold text-slate-500">{t('app.loading')}</p>
          </div>
        )}
        {isValid ? (
          <iframe
            title="Culture Board Embed"
            src={url}
            className="absolute inset-0 w-full h-full"
            onLoad={() => setLoaded(true)}
            allow="clipboard-write; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
            <Link2Off size={36} className="text-orange-400" aria-hidden="true" />
            <p className="text-sm font-bold text-slate-500">
              {t('viewer.invalidEmbedUrl')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
