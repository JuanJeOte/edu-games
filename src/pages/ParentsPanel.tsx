import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useProgress } from '@/hooks/useProgress';
import { LETTERS } from '@/data/letters';

const MASTERY_COLORS = ['bg-gray-200', 'bg-yellow-300', 'bg-orange-400', 'bg-green-500'];

export default function ParentsPanel() {
  const { progress, updateSettings, resetProgress } = useProgress();
  const [authenticated, setAuthenticated] = useState(!progress.settings.parentPin);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [settingPin, setSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handlePinSubmit = () => {
    if (pinInput === progress.settings.parentPin) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSetPin = () => {
    if (newPin.length === 4) {
      updateSettings({ parentPin: newPin });
      setSettingPin(false);
      setNewPin('');
    }
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  const lettersExplored = Object.values(progress.letters).filter(l => l.explored).length;
  const lettersMastered = Object.values(progress.letters).filter(l => l.masteryLevel === 3).length;

  // PIN entry screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Panel de Padres</h2>
          <p className="text-gray-500 text-sm mb-6">Ingresa el PIN de 4 dígitos</p>
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={e => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(false); }}
            className="w-full text-center text-3xl tracking-[0.5em] font-mono border-2 border-gray-200 rounded-xl py-3 mb-4 focus:border-indigo-400 focus:outline-none"
            placeholder="····"
          />
          {pinError && <p className="text-red-500 text-sm mb-3">PIN incorrecto</p>}
          <button
            onClick={handlePinSubmit}
            className="w-full py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Entrar
          </button>
          <Link to="/" className="block mt-4 text-indigo-400 text-sm hover:underline">
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Panel de Padres</h1>
          <Link to="/" className="text-indigo-500 font-semibold text-sm hover:underline">
            Volver
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">Resumen</h2>
          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              { label: 'Estrellas', value: progress.totalStars, icon: '⭐' },
              { label: 'Letras exploradas', value: `${lettersExplored}/27`, icon: '🔤' },
              { label: 'Letras dominadas', value: lettersMastered, icon: '🏆' },
              { label: 'Sílabas', value: progress.syllablesCompleted.length, icon: '🧩' },
              { label: 'Palabras', value: progress.wordsCompleted.length, icon: '📖' },
              { label: 'Racha', value: `${progress.currentStreak} días`, icon: '🔥' },
              { label: 'Sesiones', value: progress.sessions.length, icon: '🎮' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl">{s.icon}</div>
                <div className="text-lg font-bold text-gray-800">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Letter Mastery Grid */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">Dominio de Letras</h2>
          <div className="flex gap-1 mb-2 text-xs text-gray-400">
            <span className="w-4 h-4 bg-gray-200 rounded inline-block" /> Nuevo
            <span className="w-4 h-4 bg-yellow-300 rounded inline-block ml-2" /> Visto
            <span className="w-4 h-4 bg-orange-400 rounded inline-block ml-2" /> Practicado
            <span className="w-4 h-4 bg-green-500 rounded inline-block ml-2" /> Dominado
          </div>
          <div className="grid grid-cols-9 gap-1">
            {LETTERS.map(l => {
              const lp = progress.letters[l.letter];
              const level = lp?.masteryLevel ?? 0;
              return (
                <div
                  key={l.letter}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${MASTERY_COLORS[level]} ${level >= 2 ? 'text-white' : 'text-gray-600'}`}
                  title={`${l.uppercase}: nivel ${level}`}
                >
                  {l.uppercase}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">Sesiones Recientes</h2>
          {progress.sessions.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay sesiones registradas</p>
          ) : (
            <ul className="space-y-2">
              {progress.sessions.slice(-10).reverse().map((s, i) => (
                <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                  <span className="text-gray-500">{new Date(s.date).toLocaleDateString('es')}</span>
                  <span className="font-semibold text-gray-700">{s.activityId}</span>
                  <span className="font-bold text-indigo-600">{s.score}/{s.totalQuestions}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow p-5 space-y-4">
          <h2 className="font-bold text-gray-700">Ajustes</h2>

          {/* PIN */}
          <div>
            {settingPin ? (
              <div className="flex gap-2 items-center">
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nuevo PIN"
                  className="border rounded-lg px-3 py-2 text-center tracking-widest font-mono w-32"
                />
                <button onClick={handleSetPin} disabled={newPin.length !== 4} className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm disabled:opacity-50">
                  Guardar
                </button>
                <button onClick={() => setSettingPin(false)} className="px-3 py-2 text-gray-400 text-sm">
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={() => setSettingPin(true)} className="text-indigo-500 font-semibold text-sm hover:underline">
                {progress.settings.parentPin ? 'Cambiar PIN' : 'Establecer PIN'}
              </button>
            )}
          </div>

          {/* Speech rate */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Velocidad del habla: {progress.settings.speechRate.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={progress.settings.speechRate}
              onChange={e => updateSettings({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Speech pitch */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Tono del habla: {progress.settings.speechPitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={progress.settings.speechPitch}
              onChange={e => updateSettings({ speechPitch: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Sound effects */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Efectos de sonido</span>
            <button
              onClick={() => updateSettings({ soundEffects: !progress.settings.soundEffects })}
              className={`w-12 h-7 rounded-full transition-colors ${progress.settings.soundEffects ? 'bg-indigo-500' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mx-1 ${progress.settings.soundEffects ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Reset */}
          <div className="pt-2 border-t">
            {confirmReset ? (
              <div className="space-y-2">
                <p className="text-red-500 text-sm font-semibold">¿Estás seguro? Se borrará todo el progreso.</p>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm">
                    Sí, borrar
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-semibold text-sm">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="text-red-400 font-semibold text-sm hover:underline">
                Reiniciar progreso
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
