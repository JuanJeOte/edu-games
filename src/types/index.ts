export interface LetterData {
  letter: string          // lowercase: "a"
  uppercase: string       // "A"
  phoneme: string         // how to pronounce for TTS
  exampleWord: string     // "abeja"
  imagePath: string       // emoji initially: "🐝"
  color: string           // hex color for the card
  group: 'vocal' | 'consonante'
  teachOrder: number      // order in which to teach
}

export interface SyllableData {
  consonant: string
  vowel: string
  syllable: string        // "ma"
  exampleWord: string     // "mamá"
  exampleEmoji: string    // "👩"
}

export interface WordData {
  word: string            // "mamá"
  syllables: string[]     // ["ma", "má"]
  emoji: string           // "👩"
  difficulty: 1 | 2 | 3   // 1=easy 2=medium 3=hard
}

export interface Achievement {
  id: string
  name: string            // Spanish
  description: string     // Spanish
  emoji: string
  condition: (progress: UserProgress) => boolean
}

export interface LetterProgress {
  letter: string
  explored: boolean
  soundHeard: boolean
  matchedCorrectly: number
  matchedIncorrectly: number
  masteryLevel: 0 | 1 | 2 | 3  // 0=new 1=seen 2=practiced 3=mastered
}

export interface ActivitySession {
  activityId: string
  date: string
  score: number
  totalQuestions: number
  lettersWorked: string[]
}

export interface ChildProfile {
  id: string
  name: string
  avatarEmoji: string
  createdAt: string
}

export interface UserProgress {
  version: number
  activeProfileId: string
  profiles: ChildProfile[]
  totalStars: number
  currentStreak: number
  lastActiveDate: string
  letters: Record<string, LetterProgress>
  syllablesCompleted: string[]
  wordsCompleted: string[]
  sessions: ActivitySession[]
  badges: string[]
  settings: AppSettings
}

export interface AppSettings {
  parentPin: string
  timeLimitMinutes: number | null
  speechRate: number
  speechPitch: number
  backgroundMusic: boolean
  soundEffects: boolean
}
