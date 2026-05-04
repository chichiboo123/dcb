import { Settings } from 'lucide-react';

export default function HiddenAdminTrigger({ onClick, isHost }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isHost ? 'admin' : 'host mode'}
      title={isHost ? '' : 'Host mode →'}
      className="fixed bottom-3 right-3 z-30 p-2 rounded-full text-slate-400 opacity-15 hover:opacity-90 hover:text-slate-700 hover:bg-white hover:shadow transition-all duration-200"
    >
      <Settings size={16} aria-hidden="true" />
    </button>
  );
}
