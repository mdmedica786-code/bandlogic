import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpenText,
  Headphones,
  PenLine,
  Mic,
  BookOpen,
  MessageSquareText,
  Check,
  Calendar,
  Calculator,
  ArrowRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { calculateGoetheReadingListeningScore, GOETHE_LEVEL_SPECS } from '../../data/goethe/goetheGradingRules';

export default function GoetheSectionPicker() {
  const { setSection, setCurrentView, setCurrentEvaluation, goetheLevel, setGoetheLevel } = useApp();
  const [activeTab, setActiveTab] = useState('pruefung'); // 'pruefung' | 'leitfaden' | 'rechner'

  const currentLevel = goetheLevel || 'B1';
  const spec = GOETHE_LEVEL_SPECS[currentLevel] || GOETHE_LEVEL_SPECS.B1;

  // Calculator states
  const [calcLesen, setCalcLesen] = useState(spec.lesen?.passRaw || 18);
  const [calcHoeren, setCalcHoeren] = useState(spec.hoeren?.passRaw || 18);
  const [calcSchreiben, setCalcSchreiben] = useState(70);
  const [calcSprechen, setCalcSprechen] = useState(72);

  const lesenScore = calculateGoetheReadingListeningScore(calcLesen, currentLevel);
  const hoerenScore = calculateGoetheReadingListeningScore(calcHoeren, currentLevel, 'hoeren');
  const schreibenPassed = calcSchreiben >= 60;
  const sprechenPassed = calcSprechen >= 60;
  const allModulesPassed = lesenScore.passed && hoerenScore.passed && schreibenPassed && sprechenPassed;

  const pickSection = (secId) => {
    setCurrentEvaluation(null);
    setCurrentView('practice');
    setSection(secId);
  };

  const modules = [
    {
      id: 'lesen',
      name: 'Lesen',
      what: 'Texte lesen und Aufgaben lösen',
      meta: [`${spec.lesen.timeMinutes} Min.`, `${spec.lesen.partsCount} Teile`, `${spec.lesen.totalQuestions} Aufgaben`],
      pass: `Bestanden ab ${spec.lesen.passRaw} richtigen Antworten`,
      icon: BookOpenText,
      accent: 'from-emerald-500 to-teal-700',
      border: 'hover:border-emerald-400 focus-visible:ring-emerald-400',
      partsDesc: spec.lesen.partsDesc,
    },
    {
      id: 'hoeren',
      name: 'Hören',
      what: 'Aufnahmen hören und Aufgaben lösen',
      meta: [`ca. ${spec.hoeren.timeMinutes} Min.`, `${spec.hoeren.partsCount} Teile`, `${spec.hoeren.totalQuestions} Aufgaben`],
      pass: `Bestanden ab ${spec.hoeren.passRaw} richtigen Antworten`,
      icon: Headphones,
      accent: 'from-amber-500 to-orange-700',
      border: 'hover:border-amber-400 focus-visible:ring-amber-400',
      partsDesc: spec.hoeren.partsDesc,
    },
    {
      id: 'schreiben',
      name: 'Schreiben',
      what: 'Texte schreiben, die KI bewertet nach Goethe-Kriterien',
      meta: [`${spec.schreiben.timeMinutes} Min.`, `${spec.schreiben.partsCount} Aufgaben`],
      pass: 'Bestanden ab 60 von 100 Punkten',
      icon: PenLine,
      accent: 'from-sky-500 to-blue-700',
      border: 'hover:border-sky-400 focus-visible:ring-sky-400',
      partsDesc: spec.schreiben.partsDesc,
    },
    {
      id: 'sprechen',
      name: 'Sprechen',
      what: 'Mündliche Prüfung mit KI-Prüferin und KI-Partner',
      meta: [`ca. ${spec.sprechen.timeMinutes} Min.`, `${spec.sprechen.partsCount} Teile`, 'Mikrofon nötig'],
      pass: 'Bestanden ab 60 von 100 Punkten',
      icon: Mic,
      accent: 'from-rose-500 to-red-700',
      border: 'hover:border-rose-400 focus-visible:ring-rose-400',
      partsDesc: spec.sprechen.partsDesc,
    },
  ];

  const tabs = [
    { key: 'pruefung', label: 'Üben' },
    { key: 'leitfaden', label: 'Prüfungsformat' },
    { key: 'rechner', label: 'Notenrechner', Icon: Calculator },
  ];

  const resources = [
    { id: 'themen', title: 'Wortschatz nach Themen', desc: '15 Themen mit wichtigen Wörtern', Icon: BookOpen, tint: 'bg-purple-50 text-purple-700' },
    { id: 'redemittel', title: 'Redemittel', desc: 'Fertige Sätze für Sprechen und Schreiben', Icon: MessageSquareText, tint: 'bg-emerald-50 text-emerald-700' },
    { id: 'plan', title: 'Lernplan', desc: 'Schritt für Schritt zur Prüfung', Icon: Calendar, tint: 'bg-rose-50 text-rose-700' },
  ];

  return (
    <div className="min-h-full flex flex-col items-center px-4 py-6 md:py-8 max-w-5xl mx-auto animate-fade-in text-left">
      {/* Header: title, one-line promise, level choice */}
      <div className="w-full text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          <span className="mr-2" aria-hidden="true">🇩🇪</span>
          Goethe-Zertifikat {currentLevel}
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mt-2">
          Üben Sie alle vier Prüfungsteile im echten Prüfungsformat – mit neuen Aufgaben bei jedem Start.
        </p>

        {/* Step 1: level */}
        <div className="mt-5">
          <p id="goethe-level-label" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            1. Ihr Niveau
          </p>
          <div role="radiogroup" aria-labelledby="goethe-level-label" className="inline-grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            {['A2', 'B1', 'B2', 'C1'].map((lvl) => {
              const isActive = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  title={GOETHE_LEVEL_SPECS[lvl]?.subLabel || lvl}
                  onClick={() => setGoetheLevel(lvl)}
                  className={`min-w-[64px] px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
                    isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">{spec.subLabel} · {spec.targetAudience}</p>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex justify-center mt-5 gap-1 border-b border-slate-200">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2.5 -mb-px text-sm font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                activeTab === key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: practice */}
      {activeTab === 'pruefung' && (
        <div className="w-full flex flex-col gap-6">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">2. Ein Modul üben</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => pickSection(m.id)}
                    className={`group flex flex-col text-left p-5 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 ${m.border}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${m.accent} text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-extrabold text-slate-900 leading-tight">{m.name}</h2>
                        <p className="text-xs text-slate-600 mt-0.5">{m.what}</p>
                      </div>
                      <ArrowRight className="flex-shrink-0 w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {m.meta.map((chip, i) => (
                        <span key={chip} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                          {i === 0 && <Clock className="w-3 h-3 text-slate-400" />}
                          {chip}
                        </span>
                      ))}
                    </div>

                    <ul className="mt-3 space-y-1">
                      {m.partsDesc.split(' · ').map((line) => (
                        <li key={line} className="text-xs text-slate-600 leading-snug">{line}</li>
                      ))}
                    </ul>

                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mt-4 pt-3 border-t border-slate-100 w-full">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> {m.pass}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full mock exam */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Oder: die ganze Prüfung am Stück</p>
            <button
              type="button"
              onClick={() => pickSection('mock')}
              className="group w-full text-left rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 md:p-6 shadow-lg hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>
                <span className="block text-lg md:text-xl font-extrabold">Modellprüfung {currentLevel}</span>
                <span className="block text-sm text-slate-300 mt-1">
                  Lesen, Hören, Schreiben und Sprechen unter Prüfungsbedingungen – am Ende ein Ergebnisbericht für alle vier Module.
                </span>
              </span>
              <span className="inline-flex items-center gap-2 self-start md:self-center whitespace-nowrap px-5 py-2.5 rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-slate-900 text-sm font-extrabold transition-colors">
                <ShieldCheck className="w-4 h-4" /> Modellprüfung starten
              </span>
            </button>
          </div>

          {/* Learning resources */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Lernhilfen</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {resources.map(({ id, title, desc, Icon, tint }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickSection(id)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 text-left transition-all hover:shadow-sm flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                  <span className={`p-2.5 rounded-xl ${tint}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{title}</span>
                    <span className="block text-xs text-slate-500">{desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Guide / Exam Regulations */}
      {activeTab === 'leitfaden' && (
        <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Offizielle Goethe-Prüfungsordnung für Niveau {currentLevel}
              </h2>
              <p className="text-xs text-slate-500">
                Gemeinsamer Europäischer Referenzrahmen (GER)
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
              <span className="font-bold text-slate-900 text-sm">Prüfungsdauer</span>
              <p className="text-slate-600">
                Lesen: {spec.lesen.timeMinutes} Min · Hören: {spec.hoeren.timeMinutes} Min · Schreiben: {spec.schreiben.timeMinutes} Min · Sprechen: ca. {spec.sprechen.timeMinutes} Min.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
              <span className="font-bold text-slate-900 text-sm">Bestehensgrenze</span>
              <p className="text-slate-600">
                In jedem Modul müssen mindestens 60 Punkte (60%) erreicht werden.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Score Calculator */}
      {activeTab === 'rechner' && (
        <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Goethe Noten- &amp; Prädikatsrechner</h2>
              <p className="text-xs text-slate-500">Niveau {currentLevel} · Offizielle Umrechnungstabelle</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${allModulesPassed ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
              {allModulesPassed ? 'Gesamtprüfung Bestanden' : 'Nicht bestanden (mind. ein Modul < 60P)'}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-700 block mb-1">Lesen (Richtige von {spec.lesen.maxRaw})</label>
              <input
                type="number"
                min="0"
                max={spec.lesen.maxRaw}
                value={calcLesen}
                onChange={(e) => setCalcLesen(Math.max(0, Math.min(spec.lesen.maxRaw, parseInt(e.target.value) || 0)))}
                className="w-full p-2 rounded-lg border border-slate-300 text-sm font-bold mb-2"
              />
              <div className="flex justify-between font-bold">
                <span>{lesenScore.points100} / 100 Pkt</span>
                <span className={lesenScore.passed ? 'text-emerald-600' : 'text-rose-600'}>{lesenScore.praedikat.label}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-700 block mb-1">Hören (Richtige von {spec.hoeren.maxRaw})</label>
              <input
                type="number"
                min="0"
                max={spec.hoeren.maxRaw}
                value={calcHoeren}
                onChange={(e) => setCalcHoeren(Math.max(0, Math.min(spec.hoeren.maxRaw, parseInt(e.target.value) || 0)))}
                className="w-full p-2 rounded-lg border border-slate-300 text-sm font-bold mb-2"
              />
              <div className="flex justify-between font-bold">
                <span>{hoerenScore.points100} / 100 Pkt</span>
                <span className={hoerenScore.passed ? 'text-emerald-600' : 'text-rose-600'}>{hoerenScore.praedikat.label}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-700 block mb-1">Schreiben (Punkte von 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={calcSchreiben}
                onChange={(e) => setCalcSchreiben(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                className="w-full p-2 rounded-lg border border-slate-300 text-sm font-bold mb-2"
              />
              <div className="flex justify-between font-bold">
                <span>{calcSchreiben} / 100 Pkt</span>
                <span className={schreibenPassed ? 'text-emerald-600' : 'text-rose-600'}>{schreibenPassed ? 'Bestanden' : 'Nicht bestanden'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="font-bold text-slate-700 block mb-1">Sprechen (Punkte von 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={calcSprechen}
                onChange={(e) => setCalcSprechen(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                className="w-full p-2 rounded-lg border border-slate-300 text-sm font-bold mb-2"
              />
              <div className="flex justify-between font-bold">
                <span>{calcSprechen} / 100 Pkt</span>
                <span className={sprechenPassed ? 'text-emerald-600' : 'text-rose-600'}>{sprechenPassed ? 'Bestanden' : 'Nicht bestanden'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
