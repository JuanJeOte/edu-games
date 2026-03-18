import { useCallback, useState } from 'react'
import { getItem, setItem } from '@/utils/storage'
import { LETTERS } from '@/data/letters'
import type {
  UserProgress,
  LetterProgress,
  ActivitySession,
  AppSettings,
} from '@/types'

const STORAGE_KEY = 'progress'
const CURRENT_VERSION = 1

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function createDefaultLetters(): Record<string, LetterProgress> {
  return Object.fromEntries(
    LETTERS.map((l) => [
      l.letter,
      {
        letter: l.letter,
        explored: false,
        soundHeard: false,
        matchedCorrectly: 0,
        matchedIncorrectly: 0,
        masteryLevel: 0,
      } satisfies LetterProgress,
    ]),
  )
}

const DEFAULT_SETTINGS: AppSettings = {
  parentPin: '',
  timeLimitMinutes: null,
  speechRate: 0.8,
  speechPitch: 1.1,
  backgroundMusic: false,
  soundEffects: true,
}

export function createDefaultProgress(): UserProgress {
  return {
    version: CURRENT_VERSION,
    activeProfileId: '',
    profiles: [],
    totalStars: 0,
    currentStreak: 0,
    lastActiveDate: '',
    letters: createDefaultLetters(),
    syllablesCompleted: [],
    wordsCompleted: [],
    sessions: [],
    badges: [],
    settings: DEFAULT_SETTINGS,
  }
}

// ── Badge definitions ─────────────────────────────────────────────────────────

interface BadgeDef {
  id: string
  condition: (p: UserProgress) => boolean
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'primera_estrella',
    condition: (p) => p.totalStars >= 1,
  },
  {
    id: 'diez_estrellas',
    condition: (p) => p.totalStars >= 10,
  },
  {
    id: 'primera_letra',
    condition: (p) => Object.values(p.letters).some((l) => l.explored),
  },
  {
    id: 'todas_vocales',
    condition: (p) =>
      ['a', 'e', 'i', 'o', 'u'].every((v) => p.letters[v]?.explored),
  },
  {
    id: 'racha_tres',
    condition: (p) => p.currentStreak >= 3,
  },
  {
    id: 'primera_silaba',
    condition: (p) => p.syllablesCompleted.length >= 1,
  },
  {
    id: 'primera_palabra',
    condition: (p) => p.wordsCompleted.length >= 1,
  },
  {
    id: 'maestro_letras',
    condition: (p) =>
      Object.values(p.letters).filter((l) => l.masteryLevel === 3).length >= 10,
  },
]

// ── Streak logic ──────────────────────────────────────────────────────────────

function computeStreak(prev: UserProgress): { streak: number; lastActiveDate: string } {
  const today = todayISO()
  if (prev.lastActiveDate === today) {
    return { streak: prev.currentStreak, lastActiveDate: today }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = yesterday.toISOString().slice(0, 10)

  const streak =
    prev.lastActiveDate === yesterdayISO ? prev.currentStreak + 1 : 1

  return { streak, lastActiveDate: today }
}

// ── Mastery helper ────────────────────────────────────────────────────────────

function computeMastery(lp: LetterProgress): LetterProgress['masteryLevel'] {
  const correct = lp.matchedCorrectly
  if (correct >= 10) return 3
  if (correct >= 5) return 2
  if (lp.explored || lp.soundHeard) return 1
  return 0
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = getItem<UserProgress | null>(STORAGE_KEY, null)
    if (!saved || saved.version !== CURRENT_VERSION) return createDefaultProgress()
    return saved
  })

  const save = useCallback((next: UserProgress) => {
    setProgress(next)
    setItem(STORAGE_KEY, next)
  }, [])

  // Touch streak on every meaningful action
  const touchStreak = useCallback(
    (current: UserProgress): UserProgress => {
      const { streak, lastActiveDate } = computeStreak(current)
      return { ...current, currentStreak: streak, lastActiveDate }
    },
    [],
  )

  // ── Public actions ──────────────────────────────────────────────────────────

  const addStars = useCallback(
    (count: number) => {
      setProgress((prev) => {
        const next = touchStreak({
          ...prev,
          totalStars: prev.totalStars + count,
        })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const markLetterExplored = useCallback(
    (letter: string) => {
      setProgress((prev) => {
        const lp = prev.letters[letter]
        if (!lp || lp.explored) return prev
        const updated: LetterProgress = { ...lp, explored: true }
        updated.masteryLevel = computeMastery(updated)
        const next = touchStreak({
          ...prev,
          letters: { ...prev.letters, [letter]: updated },
        })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const markLetterHeard = useCallback(
    (letter: string) => {
      setProgress((prev) => {
        const lp = prev.letters[letter]
        if (!lp || lp.soundHeard) return prev
        const updated: LetterProgress = { ...lp, soundHeard: true }
        updated.masteryLevel = computeMastery(updated)
        const next = touchStreak({
          ...prev,
          letters: { ...prev.letters, [letter]: updated },
        })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const recordMatch = useCallback(
    (letter: string, correct: boolean) => {
      setProgress((prev) => {
        const lp = prev.letters[letter]
        if (!lp) return prev
        const updated: LetterProgress = {
          ...lp,
          matchedCorrectly: lp.matchedCorrectly + (correct ? 1 : 0),
          matchedIncorrectly: lp.matchedIncorrectly + (correct ? 0 : 1),
        }
        updated.masteryLevel = computeMastery(updated)
        const next = touchStreak({
          ...prev,
          letters: { ...prev.letters, [letter]: updated },
        })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const recordSession = useCallback(
    (session: ActivitySession) => {
      setProgress((prev) => {
        // Keep last 50 sessions to avoid unbounded growth
        const sessions = [...prev.sessions, session].slice(-50)
        const next = touchStreak({ ...prev, sessions })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const completeSyllable = useCallback(
    (syllable: string) => {
      setProgress((prev) => {
        if (prev.syllablesCompleted.includes(syllable)) return prev
        const next = touchStreak({
          ...prev,
          syllablesCompleted: [...prev.syllablesCompleted, syllable],
        })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const completeWord = useCallback(
    (word: string) => {
      setProgress((prev) => {
        if (prev.wordsCompleted.includes(word)) return prev
        const next = touchStreak({
          ...prev,
          wordsCompleted: [...prev.wordsCompleted, word],
        })
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [touchStreak],
  )

  const earnBadge = useCallback(
    (badgeId: string) => {
      setProgress((prev) => {
        if (prev.badges.includes(badgeId)) return prev
        const next = { ...prev, badges: [...prev.badges, badgeId] }
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [],
  )

  const checkAndAwardBadges = useCallback(
    () => {
      setProgress((prev) => {
        const newBadges = BADGE_DEFS
          .filter((b) => !prev.badges.includes(b.id) && b.condition(prev))
          .map((b) => b.id)

        if (newBadges.length === 0) return prev

        const next = { ...prev, badges: [...prev.badges, ...newBadges] }
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [],
  )

  const resetProgress = useCallback(
    () => {
      const fresh = createDefaultProgress()
      save(fresh)
    },
    [save],
  )

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setProgress((prev) => {
        const next = { ...prev, settings: { ...prev.settings, ...patch } }
        setItem(STORAGE_KEY, next)
        return next
      })
    },
    [],
  )

  return {
    progress,
    addStars,
    markLetterExplored,
    markLetterHeard,
    recordMatch,
    recordSession,
    completeSyllable,
    completeWord,
    earnBadge,
    checkAndAwardBadges,
    resetProgress,
    updateSettings,
  }
}
