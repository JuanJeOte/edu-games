import { useProgress } from '@/hooks/useProgress';
import { ACHIEVEMENTS } from '@/data/achievements';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const ACHIEVEMENT_MAP = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

const activities = [
  {
    emoji: '🔤',
    title: 'Explorar Letras',
    subtitle: 'Descubre el abecedario',
    href: '/explorar',
    gradient: 'from-pink-400 to-rose-500',
    shadowColor: 'shadow-pink-200',
  },
  {
    emoji: '🎵',
    title: 'Sonidos y Letras',
    subtitle: '¿Qué letra suena así?',
    href: '/emparejar',
    gradient: 'from-violet-400 to-purple-500',
    shadowColor: 'shadow-violet-200',
  },
  {
    emoji: '🧩',
    title: 'Constructor de Sílabas',
    subtitle: 'Junta letras y forma sílabas',
    href: '/silabas',
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-200',
  },
  {
    emoji: '📖',
    title: 'Mis Palabras',
    subtitle: 'Forma tus primeras palabras',
    href: '/palabras',
    gradient: 'from-emerald-400 to-teal-500',
    shadowColor: 'shadow-emerald-200',
  },
];

export default function HomePage() {
  const { progress } = useProgress();

  const lettersExplored = Object.values(progress.letters).filter(
    (l) => l.explored
  ).length;

  const cardProgress = [
    { value: lettersExplored, total: 27, label: 'letras' },
    { value: lettersExplored, total: 27, label: 'letras' },
    { value: progress.syllablesCompleted.length, total: null, label: 'sílabas' },
    { value: progress.wordsCompleted.length, total: null, label: 'palabras' },
  ];

  return (
    <div className="py-3 px-1">

      {/* Header greeting */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-3 flex items-center gap-2"
      >
        <motion.span
          animate={{ rotate: [0, 20, -10, 20, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4 }}
          className="text-3xl"
          aria-label="waving hand"
        >
          👋
        </motion.span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-indigo-700 leading-tight">
            ¡Hola, pequeño explorador!
          </h1>
          <p className="text-xs text-indigo-400 font-medium">¿Qué quieres aprender hoy?</p>
        </div>

        {/* Stars badge inline */}
        <div className="ml-auto flex items-center gap-1 rounded-xl bg-yellow-400 px-3 py-1.5 shadow-md shadow-yellow-200">
          <span className="text-lg">⭐</span>
          <span className="text-base font-extrabold text-yellow-900">{progress.totalStars}</span>
        </div>
      </motion.div>

      {/* Streak badge — only shown when streak > 0 */}
      {progress.currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-3 flex items-center gap-1.5 rounded-xl bg-orange-400 px-3 py-1.5 shadow-md shadow-orange-200 w-fit"
        >
          <span className="text-base">🔥</span>
          <span className="text-sm font-extrabold text-orange-900">
            {progress.currentStreak} días seguidos
          </span>
        </motion.div>
      )}

      {/* Activity cards — always 2 columns */}
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        {activities.map((activity, index) => {
          const prog = cardProgress[index];
          const progressPercent =
            prog.total != null ? Math.round((prog.value / prog.total) * 100) : null;

          return (
            <motion.div
              key={activity.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.08, duration: 0.4, ease: 'easeOut' }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={activity.href}
                className={`flex flex-col rounded-2xl bg-gradient-to-br ${activity.gradient} p-3.5 shadow-lg ${activity.shadowColor} h-full`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl drop-shadow">{activity.emoji}</span>
                  <div>
                    <h2 className="text-sm font-extrabold leading-tight text-white drop-shadow">
                      {activity.title}
                    </h2>
                    <p className="text-xs font-medium text-white/80 leading-tight">
                      {activity.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-auto rounded-lg bg-white/25 px-2 py-1.5">
                  {progressPercent != null ? (
                    <>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-white/90">
                          {prog.value}/{prog.total} {prog.label}
                        </span>
                        <span className="text-xs font-bold text-white">{progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                        <div
                          className="h-1.5 rounded-full bg-white transition-all duration-700"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-white/90">
                      {prog.value} {prog.label}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Badges section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="rounded-2xl bg-white/70 px-4 py-3 shadow-lg backdrop-blur"
      >
        <h2 className="mb-2 text-base font-extrabold text-indigo-700">🏅 Mis Logros</h2>

        {progress.badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {progress.badges.map((badgeId, index) => {
              const achievement = ACHIEVEMENT_MAP[badgeId];
              if (!achievement) return null;
              return (
                <motion.div
                  key={`${badgeId}-${index}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.06,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-md shadow-amber-200 text-xl"
                  title={achievement.name}
                >
                  {achievement.emoji}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <span className="text-2xl">🌟</span>
            <p className="text-xs font-semibold text-indigo-400">
              ¡Completa actividades para ganar tus primeros logros!
            </p>
          </div>
        )}
      </motion.div>

    </div>
  );
}
