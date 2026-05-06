import { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Heart, AlertCircle, MessageCircle, User } from 'lucide-react';

const INITIAL = {
  name: '',
  likes: '',
  cautions: '',
  toMeeters: '',
};

const PANEL_MIN = 280;
const PANEL_MAX = 700;
const PANEL_DEFAULT = 360;

export default function CharacterProfileForm() {
  const [fields, setFields] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT);
  const previewRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));

  const saveImage = async () => {
    if (!previewRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: { fontFamily: 'sans-serif' },
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `character-${fields.name || 'profile'}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = panelWidth;

    const onMove = (me) => {
      if (!dragging.current) return;
      const next = Math.min(PANEL_MAX, Math.max(PANEL_MIN, startWidth.current + me.clientX - startX.current));
      setPanelWidth(next);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [panelWidth]);

  return (
    <div className="flex h-full min-h-screen bg-slate-100">
      {/* ── Left input panel ── */}
      <div
        className="flex-none bg-white border-r border-slate-200 overflow-y-auto"
        style={{ width: panelWidth }}
      >
        <div className="p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-slate-700 tracking-wide">캐릭터 정보 입력</h2>

          {/* 이름 */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">이름</label>
            <input
              value={fields.name}
              onChange={set('name')}
              placeholder="캐릭터 이름을 입력하세요"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none"
            />
          </div>

          {/* 좋아하는 것들 */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">좋아하는 것들</label>
            <textarea
              value={fields.likes}
              onChange={set('likes')}
              placeholder="좋아하는 것들을 입력하세요"
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none resize-y"
            />
          </div>

          {/* 주의해주세요 */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">주의해주세요</label>
            <textarea
              value={fields.cautions}
              onChange={set('cautions')}
              placeholder="주의할 점을 입력하세요"
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none resize-y"
            />
          </div>

          {/* 캐릭터를 만날 사람들에게 */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">캐릭터를 만날 사람들에게</label>
            <textarea
              value={fields.toMeeters}
              onChange={set('toMeeters')}
              placeholder="만날 사람들에게 전하고 싶은 말을 입력하세요"
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none resize-y"
            />
          </div>

          {/* Save button */}
          <button
            onClick={saveImage}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-4 py-2.5 text-sm transition-colors"
          >
            <Download size={16} />
            {saving ? '저장 중…' : '이미지로 저장'}
          </button>
        </div>
      </div>

      {/* ── Drag handle ── */}
      <div
        onMouseDown={onMouseDown}
        className="w-1.5 flex-none cursor-col-resize bg-slate-200 hover:bg-sky-400 transition-colors select-none"
        title="드래그하여 너비 조정"
      />

      {/* ── Right preview panel ── */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        <div
          ref={previewRef}
          className="w-full max-w-sm rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden"
          style={{ fontFamily: 'sans-serif' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-sky-400 to-violet-500 px-6 py-6 text-white text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
              <User size={28} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              {fields.name || '이름'}
            </h1>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* 좋아하는 것들 */}
            <div className="rounded-2xl bg-pink-50 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Heart size={14} className="text-pink-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-pink-500">좋아하는 것들</span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {fields.likes || '—'}
              </p>
            </div>

            {/* 주의해주세요 */}
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500">주의해주세요</span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {fields.cautions || '—'}
              </p>
            </div>

            {/* 캐릭터를 만날 사람들에게 */}
            <div className="rounded-2xl bg-sky-50 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageCircle size={14} className="text-sky-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-500">캐릭터를 만날 사람들에게</span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {fields.toMeeters || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
