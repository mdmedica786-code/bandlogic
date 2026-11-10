import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * Centered loading / error state while a room waits for the exam format.
 * After a few seconds it explains the wait (the server may be waking up)
 * instead of leaving the student with a silent spinner.
 */
export default function FormatLoading({ error = null, onRetry }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (error) return undefined;
    const id = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(id);
  }, [error]);

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3 px-6">
        <p className="text-base font-bold text-slate-900">Die Prüfung konnte nicht geladen werden</p>
        <p className="text-sm text-slate-500 max-w-sm">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold"
          >
            <RefreshCw className="w-4 h-4" /> Erneut versuchen
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3 px-6" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      <p className="text-base font-bold text-slate-900">Prüfung wird vorbereitet …</p>
      <p className="text-sm text-slate-500 max-w-sm">
        {slow
          ? 'Der Server wird gerade gestartet. Das kann bis zu einer Minute dauern – bitte die Seite geöffnet lassen.'
          : 'Einen Moment bitte.'}
      </p>
    </div>
  );
}
