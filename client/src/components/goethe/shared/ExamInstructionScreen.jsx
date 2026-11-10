import { Clock, ListChecks, PlayCircle, Loader2, ShieldCheck, GraduationCap, Lightbulb } from 'lucide-react';
import { useExamMode } from './useExamMode';

const MODES = [
  { key: 'lern', label: 'Lernmodus', hint: 'Mit Hilfen: Übersetzungen, Pause und sofortige Kontrolle. Gut zum Einstieg.', Icon: Lightbulb },
  { key: 'pruefung', label: 'Prüfungsmodus', hint: 'Wie in der echten Prüfung: offizielle Zeit, keine Hilfen, Ergebnis am Ende.', Icon: GraduationCap },
];

/**
 * Start screen of a module: name, time, structure and rules, then
 * "Prüfung starten".
 */
export default function ExamInstructionScreen({
  level,
  moduleName,
  timeMinutes,
  parts = [],
  rules = [],
  onStart,
  starting = false,
  startLabel = 'Prüfung starten',
  modeLocked = false,
  children,
}) {
  const { mode, setMode } = useExamMode();
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <div className="bg-slate-900 text-white px-6 py-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Goethe-Zertifikat {level}</p>
          <h2 className="text-2xl font-extrabold">{moduleName}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Clock className="w-4 h-4 text-emerald-300" /> {timeMinutes} Minuten
        </div>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3">
            <ListChecks className="w-4 h-4 text-emerald-600" /> Aufbau
          </h3>
          <ol className="space-y-2">
            {parts.map((p) => (
              <li key={p.key} className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-14 text-xs font-extrabold text-slate-500 pt-0.5">{p.label}</span>
                <span className="text-slate-800">
                  <span className="font-semibold">{p.title}</span>
                  {p.detail ? <span className="text-slate-500"> · {p.detail}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Regeln
          </h3>
          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
            {rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mode choice with the difference spelled out (no hidden tooltips). */}
      <div className={modeLocked ? 'hidden' : 'px-6 pb-6'}>
        <p className="text-sm font-extrabold text-slate-900 mb-3">Wie möchten Sie üben?</p>
        <div role="radiogroup" aria-label="Modus wählen" className="grid gap-3 sm:grid-cols-2">
          {MODES.map(({ key, label, hint, Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMode(key)}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                  active ? 'border-emerald-500 bg-emerald-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`flex-shrink-0 p-2 rounded-xl ${active ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-slate-900">{label}</span>
                  <span className="block text-xs text-slate-600 mt-0.5 leading-relaxed">{hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {children}

      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-slate-500">
          {starting ? 'Die Aufgaben werden neu erstellt – das dauert einen Moment.' : 'Bei jedem Start erhalten Sie neue Aufgaben.'}
        </p>
        <button
          type="button"
          onClick={onStart}
          disabled={starting}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-md disabled:opacity-60"
        >
          {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
          {startLabel}
        </button>
      </div>
    </div>
  );
}
