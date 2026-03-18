import type { Achievement, UserProgress } from '../types'

// Helper: count how many letters reach a given mastery level
const countMastery = (progress: UserProgress, level: number): number =>
  Object.values(progress.letters).filter((l) => l.masteryLevel >= level).length

// Helper: count unique dates (days) across all sessions
const countUniqueDays = (progress: UserProgress): number => {
  const days = new Set(progress.sessions.map((s) => s.date.slice(0, 10)))
  return days.size
}

// Helper: check whether all 5 vowels have been explored
const allVowelsExplored = (progress: UserProgress): boolean =>
  ['a', 'e', 'i', 'o', 'u'].every((v) => progress.letters[v]?.explored)

// Helper: total correct matches across every letter
const totalCorrect = (progress: UserProgress): number =>
  Object.values(progress.letters).reduce(
    (sum, l) => sum + l.matchedCorrectly,
    0
  )

export const ACHIEVEMENTS: Achievement[] = [
  // ── Exploración ──────────────────────────────────────────────────────────────
  {
    id: 'explorador_vocales',
    name: 'Explorador de Vocales',
    description: '¡Conociste todas las vocales: A, E, I, O, U!',
    emoji: '🌟',
    condition: (p: UserProgress) => allVowelsExplored(p),
  },
  {
    id: 'primera_letra',
    name: 'Primera Letra',
    description: '¡Escuchaste el sonido de tu primera letra!',
    emoji: '🔤',
    condition: (p: UserProgress) =>
      Object.values(p.letters).some((l) => l.soundHeard),
  },
  {
    id: 'mitad_abecedario',
    name: 'Medio Camino',
    description: '¡Ya conoces 13 letras del abecedario!',
    emoji: '🗺️',
    condition: (p: UserProgress) =>
      Object.values(p.letters).filter((l) => l.explored).length >= 13,
  },
  {
    id: 'abecedario_completo',
    name: 'Maestro del Abecedario',
    description: '¡Exploraste todas las letras del abecedario!',
    emoji: '🏆',
    condition: (p: UserProgress) =>
      Object.values(p.letters).filter((l) => l.explored).length >= 27,
  },

  // ── Estrellas ─────────────────────────────────────────────────────────────────
  {
    id: 'diez_estrellas',
    name: '10 Estrellas',
    description: '¡Ganaste 10 estrellas jugando!',
    emoji: '⭐',
    condition: (p: UserProgress) => p.totalStars >= 10,
  },
  {
    id: 'cincuenta_estrellas',
    name: 'Cosecha de Estrellas',
    description: '¡Increíble! Tienes 50 estrellas brillantes.',
    emoji: '🌠',
    condition: (p: UserProgress) => p.totalStars >= 50,
  },
  {
    id: 'cien_estrellas',
    name: 'Cielo Estrellado',
    description: '¡100 estrellas! Eres una superestrella.',
    emoji: '🌌',
    condition: (p: UserProgress) => p.totalStars >= 100,
  },

  // ── Rachas de días ─────────────────────────────────────────────────────────
  {
    id: 'racha_3_dias',
    name: 'Racha de 3 Días',
    description: '¡Jugaste 3 días seguidos! ¡Eres muy constante!',
    emoji: '🔥',
    condition: (p: UserProgress) => p.currentStreak >= 3,
  },
  {
    id: 'racha_7_dias',
    name: 'Una Semana Entera',
    description: '¡7 días seguidos aprendiendo! ¡Campeón de la constancia!',
    emoji: '📅',
    condition: (p: UserProgress) => p.currentStreak >= 7,
  },

  // ── Sílabas y palabras ────────────────────────────────────────────────────
  {
    id: 'primera_silaba',
    name: 'Primera Sílaba',
    description: '¡Formaste tu primera sílaba! ¡Así se empieza!',
    emoji: '🔡',
    condition: (p: UserProgress) => p.syllablesCompleted.length >= 1,
  },
  {
    id: 'diez_silabas',
    name: 'Coleccionista de Sílabas',
    description: '¡Completaste 10 sílabas diferentes!',
    emoji: '🧩',
    condition: (p: UserProgress) => p.syllablesCompleted.length >= 10,
  },
  {
    id: 'primera_palabra',
    name: 'Mi Primera Palabra',
    description: '¡Leíste tu primera palabra completa! ¡Qué orgulloso estás!',
    emoji: '📖',
    condition: (p: UserProgress) => p.wordsCompleted.length >= 1,
  },
  {
    id: 'cinco_palabras',
    name: 'Pequeño Lector',
    description: '¡Ya sabes leer 5 palabras! ¡Sigue así!',
    emoji: '📚',
    condition: (p: UserProgress) => p.wordsCompleted.length >= 5,
  },
  {
    id: 'veinte_palabras',
    name: 'Gran Lector',
    description: '¡20 palabras leídas! ¡Eres todo un lector!',
    emoji: '🎓',
    condition: (p: UserProgress) => p.wordsCompleted.length >= 20,
  },

  // ── Maestría de letras específicas ───────────────────────────────────────
  {
    id: 'maestro_m',
    name: 'Maestro de la M',
    description: '¡Dominaste la letra M de mamá!',
    emoji: '👩',
    condition: (p: UserProgress) => p.letters['m']?.masteryLevel === 3,
  },
  {
    id: 'maestro_vocales',
    name: 'Rey de las Vocales',
    description: '¡Dominaste las 5 vocales! ¡Eres increíble!',
    emoji: '👑',
    condition: (p: UserProgress) =>
      ['a', 'e', 'i', 'o', 'u'].every(
        (v) => p.letters[v]?.masteryLevel === 3
      ),
  },

  // ── Aciertos y precisión ──────────────────────────────────────────────────
  {
    id: 'primer_acierto',
    name: '¡Acerté!',
    description: '¡Tu primera respuesta correcta! ¡Muy bien!',
    emoji: '✅',
    condition: (p: UserProgress) => totalCorrect(p) >= 1,
  },
  {
    id: 'cincuenta_aciertos',
    name: 'Sin Parar',
    description: '¡50 respuestas correctas en total! ¡Eres un campeón!',
    emoji: '🎯',
    condition: (p: UserProgress) => totalCorrect(p) >= 50,
  },

  // ── Sesiones jugadas ──────────────────────────────────────────────────────
  {
    id: 'primera_sesion',
    name: '¡A Jugar!',
    description: '¡Completaste tu primera sesión de juego!',
    emoji: '🎮',
    condition: (p: UserProgress) => p.sessions.length >= 1,
  },
  {
    id: 'diez_sesiones',
    name: 'Jugador Dedicado',
    description: '¡10 sesiones completadas! ¡No hay quien te pare!',
    emoji: '🕹️',
    condition: (p: UserProgress) => p.sessions.length >= 10,
  },

  // ── Letras practicadas ────────────────────────────────────────────────────
  {
    id: 'cinco_letras_practicadas',
    name: 'Practicando Fuerte',
    description: '¡Practicaste 5 letras distintas!',
    emoji: '💪',
    condition: (p: UserProgress) => countMastery(p, 2) >= 5,
  },
  {
    id: 'primer_nivel_maestria',
    name: 'Letra Aprendida',
    description: '¡Dominaste tu primera letra por completo!',
    emoji: '🥇',
    condition: (p: UserProgress) => countMastery(p, 3) >= 1,
  },
  {
    id: 'dias_activos',
    name: 'Explorador Activo',
    description: '¡Jugaste en 5 días diferentes! ¡Qué disciplina!',
    emoji: '🗓️',
    condition: (p: UserProgress) => countUniqueDays(p) >= 5,
  },
]
