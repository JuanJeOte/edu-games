import { useProgress } from '@/hooks/useProgress';
import { motion } from 'motion/react';
import { Link } from 'react-router';

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
    { value: lettersExplored, total: 27, label: 'letras exploradas' },
    { value: lettersExplored, total: 27, label: 'letras aprendidas' },
    {
      value: progress.syllablesCompleted.length,
      total: null,
      label: 'sílabas completadas',
    },
    {
      value: progress.wordsCompleted.length,
      total: null,
      label: 'palabras formadas',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="mx-auto max-w-2xl">

        {/* Header greeting */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 20, -10, 20, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
              className="text-5xl"
              aria-label="waving hand"
            >
              👋
            </motion.span>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700 sm:text-4xl">
              ¡Hola, pequeño explorador!
            </h1>
          </div>
          <p className="text-base text-indigo-400 font-medium">
            ¿Qué quieres aprender hoy?
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          {/* Total stars */}
          <div className="flex items-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 shadow-lg shadow-yellow-200">
            <span className="text-3xl">⭐</span>
            <span className="text-2xl font-extrabold text-yellow-900">
              {progress.totalStars}
            </span>
            <span className="text-sm font-semibold text-yellow-800">
              estrellas
            </span>
          </div>

          {/* Streak badge — only shown when streak > 0 */}
          {progress.currentStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex items-center gap-2 rounded-2xl bg-orange-400 px-5 py-3 shadow-lg shadow-orange-200"
            >
              <span className="text-2xl">🔥</span>
              <span className="text-lg font-extrabold text-orange-900">
                {progress.currentStreak} días seguidos
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Activity cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {activities.map((activity, index) => {
            const prog = cardProgress[index];
            const progressPercent =
              prog.total != null
                ? Math.round((prog.value / prog.total) * 100)
                : null;

            return (
              <motion.div
                key={activity.href}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + index * 0.1,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 300, damping: 18 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={activity.href}
                  className={`block rounded-3xl bg-gradient-to-br ${activity.gradient} p-5 shadow-xl ${activity.shadowColor} transition-shadow hover:shadow-2xl`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-4xl drop-shadow">{activity.emoji}</span>
                    <div>
                      <h2 className="text-lg font-extrabold leading-tight text-white drop-shadow">
                        {activity.title}
                      </h2>
                      <p className="text-sm font-medium text-white/80">
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="rounded-xl bg-white/25 px-3 py-2">
                    {progressPercent != null ? (
                      <>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-bold text-white/90">
                            {prog.value} / {prog.total} {prog.label}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
                          <div
                            className="h-2 rounded-full bg-white transition-all duration-700"
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-3xl bg-white/70 px-6 py-5 shadow-lg backdrop-blur"
        >
          <h2 className="mb-4 text-xl font-extrabold text-indigo-700">
            🏅 Mis Logros
          </h2>

          {progress.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {progress.badges.map((badge, index) => (
                <motion.div
                  key={`${badge}-${index}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.7 + index * 0.08,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-md shadow-amber-200 text-2xl"
                  title={badge}
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <span className="text-4xl">🌟</span>
              <p className="text-sm font-semibold text-indigo-400">
                ¡Completa actividades para ganar tus primeros logros!
              </p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
