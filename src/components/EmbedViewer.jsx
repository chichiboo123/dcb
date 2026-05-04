import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function EmbedViewer({ url }) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  const isValid = typeof url === 'string' && /^https?:\/\//.test(url);

  return (
    <div className="relative rounded-3xl bg-white border border-krds-line shadow-paper overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-pastel-blue/40 border-b border-krds-line">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true" />
        </div>
        <div className="text-xs font-bold text-krds-primary truncate max-w-[60%]">
          {isValid ? new URL(url).hostname : 'no-embed'}
        </div>
        <span
          className="material-icons-round text-krds-primary"
          style={{ fontSize: 18 }}
          aria-hidden="true"
        >
          public
        </span>
      </div>

      <div className="relative aspect-[4/3] bg-pastel-yellow/30">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span
              className="material-icons-round text-krds-primary animate-spin"
              style={{ fontSize: 36 }}
              aria-hidden="true"
            >
              autorenew
            </span>
            <p className="text-sm font-bold text-krds-primary">{t('app.loading')}</p>
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
            <span
              className="material-icons-round text-krds-point"
              style={{ fontSize: 40 }}
              aria-hidden="true"
            >
              link_off
            </span>
            <p className="text-sm font-bold text-gray-600">
              관리자 모드에서 임베드 URL을 등록하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
