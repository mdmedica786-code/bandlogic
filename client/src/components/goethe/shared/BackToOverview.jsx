import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

/**
 * "Back to the module overview" link shown above each room title.
 * Progress is kept (rooms persist their state), so leaving is safe.
 */
export default function BackToOverview({ className = '' }) {
  const { setSection, setCurrentEvaluation } = useApp();
  return (
    <button
      type="button"
      onClick={() => {
        setCurrentEvaluation(null);
        setSection(null);
      }}
      className={`flex items-center gap-1 mb-2 -ml-1 px-1 py-0.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Alle Module
    </button>
  );
}
