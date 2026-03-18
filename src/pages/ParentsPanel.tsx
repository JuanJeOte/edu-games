import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useProgress } from '@/hooks/useProgress';

const ALPHABET = 'abcdefghijklmnñopqrstuvwxyz'.split('');

const masteryColors: Record<number, string> = {
  0: 'bg-gray-200 text-gray-500',
  1: 'bg-yellow-200 text-yellow-800',
  2: 'bg-orange-300 text-orange-900',
  3: 'bg-green-400 text-green-900',
};

const masteryLabels: Record<number, string> = {
  0: 'Sin explorar',
  1: 'Iniciado',
  2: 'Practicando',
  3: 'Dominado',
};

type PinScreenMode = 'verify' | 'set' | 'confirm';

export default function ParentsPanel() {
  const { progress, updateSettings, resetProgress } = useProgress();

  const hasPin = Boolean(progress.settings?.parentPin);

  const [authenticated, setAuthenticated] = useState(false);
  const [pinScreen, setPinScreen] = useState<PinScreenMode>(hasPin ? 'verify' : 'set');
  const [pinInput, setPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [changePinStep, setChangePinStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [changePinCurrent, setChangePinCurrent] = useState('');
  const [changePinNew, setChangePinNew] = useState('');
  const [changePinConfirm, setChangePinConfirm] = useState('');
  const [changePinError, setChangePinError] = useState('');

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'letters' | 'sessions' | 'settings'>('stats');

  const settings = progress.settings ?? {
    parentPin: '',
    timeLimitMinutes: null,
    speechRate: 1,
    speechPitch: 1,
    backgroundMusic: true,
    soundEffects: true,
  };

  // PIN entry helpers
  const handlePinKey = (digit: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      if (next.length === 4) {
        setTimeout(() => handlePinSubmit(next), 100);
      }
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (pinScreen === 'verify') {
      if (pin === progress.settings?.parentPin) {
        setAuthenticated(true);
        setPinError('');
      } else {
        setPinError('PIN incorrecto. Intenta de nuevo.');
        setPinInput('');
      }
    } else if (pinScreen === 'set') {
      if (pin.length === 4) {
        setNewPinInput(pin);
        setPinScreen('confirm');
        setPinInput('');
        setPinError('');
      }
    } else if (pinScreen === 'confirm') {
      if (pin === newPinInput) {
        updateSettings({ parentPin: pin });
        setAuthenticated(true);
        setPinError('');
      } else {
        setPinError('Los PINs no coinciden. Intenta de nuevo.');
        setPinInput('');
        setPinScreen('set');
        setNewPinInput('');
      }
    }
  };

  const handleChangePinSubmit = () => {
    if (changePinStep === 'current') {
      if (changePinCurrent === settings.parentPin || settings.parentPin === '') {
        setChangePinStep('new');
        setChangePinError('');
      } else {
        setChangePinError('PIN actual incorrecto.');
        setChangePinCurrent('');
      }
    } else if (changePinStep === 'new') {
      if (changePinNew.length === 4) {
        setChangePinStep('confirm');
        setChangePinError('');
      } else {
        setChangePinError('El PIN debe tener exactamente 4 dígitos.');
      }
    } else if (changePinStep === 'confirm') {
      if (changePinConfirm === changePinNew) {
        updateSettings({ parentPin: changePinNew });
        setShowChangePinModal(false);
        setChangePinStep('current');
        setChangePinCurrent('');
        setChangePinNew('');
        setChangePinConfirm('');
        setChangePinError('');
      } else {
        setChangePinError('Los PINs no coinciden.');
        setChangePinConfirm('');
      }
    }
  };

  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
    setAuthenticated(false);
    setPinScreen('set');
    setPinInput('');
  };

  // Derived stats
  const lettersData = progress.letters ?? {};
  const lettersExplored = Object.values(lettersData).filter((l: any) => l.timesPlayed > 0).length;
  const lettersMastered = Object.values(lettersData).filter((l: any) => l.masteryLevel === 3).length;
  const sessions = progress.sessions ?? [];
  const recentSessions = [...sessions].reverse().slice(0, 10);

  const syllablesCompleted = Object.values(lettersData).reduce((sum: number, l: any) => {
    return sum + (l.syllablesCompleted ?? 0);
  }, 0);
  const wordsCompleted = Object.values(lettersData).reduce((sum: number, l: any) => {
    return sum + (l.wordsCompleted ?? 0);
  }, 0);

  // PIN Pad subcomponents
  const PinDots = ({ value }: { value: string }) => (
    <div className="flex gap-3 justify-center my-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full border-2 transition-colors ${
            i < value.length ? 'bg-slate-700 border-slate-700' : 'bg-transparent border-slate-400'
          }`}
        />
      ))}
    </div>
  );

  const NumPad = ({ onKey, onDelete }: { onKey: (d: string) => void; onDelete: () => void }) => (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, idx) => (
        <button
          key={idx}
          onClick={() => {
            if (key === '⌫') onDelete();
            else if (key !== '') onKey(key);
          }}
          disabled={key === ''}
          className={`h-14 rounded-lg text-xl font-semibold transition-colors ${
            key === ''
              ? 'invisible'
              : key === '⌫'
              ? 'bg-slate-200 text-slate-600 hover:bg-slate-300 active:bg-slate-400'
              : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 active:bg-slate-100 shadow-sm'
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  );

  // PIN Screen
  if (!authenticated) {
    const title =
      pinScreen === 'verify'
        ? 'Ingresa tu PIN'
        : pinScreen === 'set'
        ? 'Crea un PIN de 4 dígitos'
        : 'Confirma tu PIN';

    const subtitle =
      pinScreen === 'verify'
        ? 'Introduce el PIN para acceder al panel de padres.'
        : pinScreen === 'set'
        ? 'Este PIN protegerá el panel de padres.'
        : 'Vuelve a ingresar el PIN para confirmar.';

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Panel de Padres</h1>
            <p className="text-slate-500 mt-1 text-sm">{title}</p>
            <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
          </div>

          <PinDots value={pinInput} />

          {pinError && (
            <p className="text-red-500 text-sm text-center mb-3">{pinError}</p>
          )}

          <NumPad
            onKey={handlePinKey}
            onDelete={() => setPinInput((p) => p.slice(0, -1))}
          />

          <div className="mt-6 text-center">
            <Link to="/" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
              Cancelar
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated dashboard
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Panel de Padres</h1>
              <p className="text-xs text-slate-400">Seguimiento del progreso</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {([
              { key: 'stats', label: 'Resumen' },
              { key: 'letters', label: 'Letras' },
              { key: 'sessions', label: 'Sesiones' },
              { key: 'settings', label: 'Ajustes' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-700">Resumen General</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Estrellas totales', value: progress.totalStars ?? 0, accent: 'text-yellow-500' },
                { label: 'Letras exploradas', value: `${lettersExplored}/27`, accent: 'text-blue-500' },
                { label: 'Letras dominadas', value: lettersMastered, accent: 'text-green-600' },
                { label: 'Sílabas completadas', value: syllablesCompleted, accent: 'text-purple-500' },
                { label: 'Palabras completadas', value: wordsCompleted, accent: 'text-indigo-500' },
                { label: 'Racha actual', value: `${progress.currentStreak ?? 0} días`, accent: 'text-orange-500' },
                { label: 'Sesiones jugadas', value: sessions.length, accent: 'text-slate-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* LETTERS TAB */}
        {activeTab === 'letters' && (
          <motion.div
            key="letters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-semibold text-slate-700">Dominio de Letras</h2>
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2, 3].map((level) => (
                  <span key={level} className={`text-xs px-2 py-0.5 rounded-full font-medium ${masteryColors[level]}`}>
                    {masteryLabels[level]}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <div className="grid grid-cols-9 gap-2">
                {ALPHABET.map((letter) => {
                  const data = lettersData[letter] as any;
                  const level = data?.masteryLevel ?? 0;
                  return (
                    <div
                      key={letter}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold uppercase transition-colors ${masteryColors[level]}`}
                      title={`${letter.toUpperCase()} — ${masteryLabels[level]}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Detalle por letra</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 uppercase border-b border-slate-100">
                      <th className="text-left py-2 pr-4">Letra</th>
                      <th className="text-right py-2 px-2">Nivel</th>
                      <th className="text-right py-2 px-2">Jugadas</th>
                      <th className="text-right py-2 px-2">Estrellas</th>
                      <th className="text-right py-2 pl-2">Sílabas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALPHABET.filter((letter) => {
                      const data = lettersData[letter] as any;
                      return (data?.timesPlayed ?? 0) > 0 || (data?.masteryLevel ?? 0) > 0;
                    }).map((letter) => {
                      const data = lettersData[letter] as any;
                      const level = data?.masteryLevel ?? 0;
                      return (
                        <tr key={letter} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-2 pr-4 font-semibold uppercase text-slate-700">{letter}</td>
                          <td className="py-2 px-2 text-right">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${masteryColors[level]}`}>
                              {level}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right text-slate-600">{data?.timesPlayed ?? 0}</td>
                          <td className="py-2 px-2 text-right text-slate-600">{data?.starsEarned ?? 0}</td>
                          <td className="py-2 pl-2 text-right text-slate-600">{data?.syllablesCompleted ?? 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {ALPHABET.every((letter) => {
                  const data = lettersData[letter] as any;
                  return !data?.timesPlayed && !data?.masteryLevel;
                }) && (
                  <p className="text-slate-400 text-sm text-center py-6">Aun no se han explorado letras.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-700">Ultimas Sesiones</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              {recentSessions.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-10">Aun no hay sesiones registradas.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentSessions.map((session: any, idx: number) => {
                    const date = session.date ? new Date(session.date) : null;
                    const dateStr = date
                      ? date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                      : '—';
                    const timeStr = date
                      ? date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                      : '';
                    return (
                      <div key={idx} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-700 capitalize">
                              {session.activity ?? session.activityId ?? 'Actividad'}
                              {session.letter ? ` — ${session.letter.toUpperCase()}` : ''}
                            </div>
                            <div className="text-xs text-slate-400">{dateStr} {timeStr}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
                          <span>★</span>
                          <span>{session.starsEarned ?? session.score ?? 0}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-700">Ajustes</h2>

            {/* Audio settings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-5">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Audio</h3>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Velocidad de voz</label>
                  <span className="text-sm text-slate-500 font-mono">{(settings.speechRate ?? 1).toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={settings.speechRate ?? 1}
                  onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Lento (0.5x)</span>
                  <span>Rapido (1.5x)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-slate-700">Tono de voz</label>
                  <span className="text-sm text-slate-500 font-mono">{(settings.speechPitch ?? 1).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={settings.speechPitch ?? 1}
                  onChange={(e) => updateSettings({ speechPitch: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Grave (0.5)</span>
                  <span>Agudo (2.0)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">Efectos de sonido</div>
                  <div className="text-xs text-slate-400">Sonidos al interactuar con la app</div>
                </div>
                <button
                  onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      settings.soundEffects ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Seguridad</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">PIN de acceso</div>
                  <div className="text-xs text-slate-400">Protege el panel de padres</div>
                </div>
                <button
                  onClick={() => {
                    setShowChangePinModal(true);
                    setChangePinStep('current');
                    setChangePinCurrent('');
                    setChangePinNew('');
                    setChangePinConfirm('');
                    setChangePinError('');
                  }}
                  className="text-sm font-medium text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                >
                  Cambiar PIN
                </button>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3">Zona de peligro</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">Restablecer progreso</div>
                  <div className="text-xs text-slate-400">Borra todo el progreso guardado. Esta accion no se puede deshacer.</div>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-sm font-medium text-red-600 border border-red-300 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-1">Cambiar PIN</h3>
            <p className="text-sm text-slate-500 mb-4">
              {changePinStep === 'current' && 'Introduce tu PIN actual.'}
              {changePinStep === 'new' && 'Introduce el nuevo PIN de 4 digitos.'}
              {changePinStep === 'confirm' && 'Confirma el nuevo PIN.'}
            </p>

            {changePinStep === 'current' && (
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={changePinCurrent}
                onChange={(e) => setChangePinCurrent(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="PIN actual"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            )}
            {changePinStep === 'new' && (
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={changePinNew}
                onChange={(e) => setChangePinNew(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Nuevo PIN"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            )}
            {changePinStep === 'confirm' && (
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={changePinConfirm}
                onChange={(e) => setChangePinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Confirmar nuevo PIN"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            )}

            {changePinError && (
              <p className="text-red-500 text-sm mt-2">{changePinError}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowChangePinModal(false);
                  setChangePinError('');
                }}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePinSubmit}
                className="flex-1 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                {changePinStep === 'confirm' ? 'Guardar' : 'Siguiente'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Restablecer progreso?</h3>
            <p className="text-sm text-slate-500 text-center mb-5">
              Se borraran todas las estrellas, letras aprendidas, sesiones y ajustes. Esta accion no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetProgress}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Si, restablecer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
