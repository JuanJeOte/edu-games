import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WORDS } from '@/data/words';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgress } from '@/hooks/useProgress';

interface WordData {
  word: string;
  syllables: string[];
  emoji: string;
  difficulty: 1 | 2 | 3;
}

const DISTRACTOR_SYLLABLES = ['ma', 'lo', 'ti', 'pe', 'ra', 'si', 'no', 'de', 'bu', 'ca'];

function getDistractors(syllables: string[], count: number): string[] {
  const available = DISTRACTOR_SYLLABLES.filter((s) => !syllables.includes(s));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface StarParticle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
}

const STAR_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

function generateStars(count: number): StarParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotate: Math.random() * 360,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));
}

function getDifficultyUnlocked(wordsCompleted: string[]): 1 | 2 | 3 {
  if (wordsCompleted.length >= 10) return 3;
  if (wordsCompleted.length >= 4) return 2;
  return 1;
}

export default function WordBuilder() {
  const { speakWord } = useSpeech();
  const { progress, completeWord, addStars, checkAndAwardBadges } = useProgress();

  const maxDifficulty = getDifficultyUnlocked(progress.wordsCompleted);
  const availableWords = WORDS.filter((w) => w.difficulty <= maxDifficulty);

  const [wordIndex, setWordIndex] = useState(0);
  const [filledSlots, setFilledSlots] = useState<(string | null)[]>([]);
  const [buttonPool, setButtonPool] = useState<{ id: number; syllable: string; used: boolean }[]>([]);
  const [shakingId, setShakingId] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [stars, setStars] = useState<StarParticle[]>([]);
  const [allDone, setAllDone] = useState(false);

  const currentWord: WordData | undefined = availableWords[wordIndex];

  const initWord = useCallback(
    (word: WordData) => {
      setFilledSlots(new Array(word.syllables.length).fill(null));
      setCelebrating(false);
      setStars([]);
      const distractorCount = word.difficulty === 1 ? 1 : 2;
      const distractors = getDistractors(word.syllables, distractorCount);
      const pool = shuffleArray([...word.syllables, ...distractors]).map((syl, idx) => ({
        id: idx,
        syllable: syl,
        used: false,
      }));
      setButtonPool(pool);
    },
    []
  );

  useEffect(() => {
    if (currentWord) {
      initWord(currentWord);
    }
  }, [wordIndex, currentWord, initWord]);

  useEffect(() => {
    if (availableWords.length === 0) {
      setAllDone(true);
    }
  }, [availableWords.length]);

  const handleSyllableTap = (btn: { id: number; syllable: string; used: boolean }) => {
    if (btn.used || celebrating || !currentWord) return;

    const nextSlotIndex = filledSlots.findIndex((s) => s === null);
    if (nextSlotIndex === -1) return;

    const expected = currentWord.syllables[nextSlotIndex];

    if (btn.syllable === expected) {
      const newSlots = [...filledSlots];
      newSlots[nextSlotIndex] = btn.syllable;
      setFilledSlots(newSlots);
      setButtonPool((prev) =>
        prev.map((b) => (b.id === btn.id ? { ...b, used: true } : b))
      );

      const allFilled = newSlots.every((s) => s !== null);
      if (allFilled) {
        handleWordComplete(newSlots as string[]);
      }
    } else {
      setShakingId(btn.id);
      setTimeout(() => setShakingId(null), 600);
    }
  };

  const handleWordComplete = (slots: string[]) => {
    setCelebrating(true);
    setStars(generateStars(18));
    const fullWord = slots.join('');
    speakWord(fullWord);
    completeWord(currentWord!.word);
    addStars(2);
    checkAndAwardBadges();

    setTimeout(() => {
      advanceWord();
    }, 2200);
  };

  const advanceWord = () => {
    const nextIndex = wordIndex + 1;
    if (nextIndex >= availableWords.length) {
      setAllDone(true);
    } else {
      setWordIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    if (celebrating) return;
    advanceWord();
  };

  const handleRestart = () => {
    setAllDone(false);
    setWordIndex(0);
    setCelebrating(false);
  };

  if (allDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm md:max-w-md w-full text-center"
        >
          <div className="text-7xl mb-4">🏆</div>
          <h2 className="text-3xl font-extrabold text-purple-700 mb-2">
            ¡Felicidades!
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            ¡Completaste todas las palabras!
          </p>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                className="text-4xl"
              >
                ⭐
              </motion.span>
            ))}
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Palabras completadas: {progress.wordsCompleted.length}
          </p>
          <button
            onClick={handleRestart}
            className="w-full py-4 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white text-xl font-bold rounded-2xl shadow-lg transition-all"
          >
            ¡Jugar de nuevo!
          </button>
        </motion.div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <p className="text-gray-500 text-lg">Cargando palabras...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100 flex flex-col items-center px-3 py-4 sm:px-4 sm:py-6 relative overflow-hidden">

      {/* Confetti stars */}
      <AnimatePresence>
        {celebrating &&
          stars.map((star) => (
            <motion.div
              key={star.id}
              className="pointer-events-none absolute text-2xl"
              style={{ left: `${star.x}%`, top: `${star.y}%`, color: star.color }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.4, 1, 0],
                rotate: star.rotate,
                y: [-10, -60],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              ★
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full max-w-md md:max-w-lg flex items-center justify-between mb-3 sm:mb-4">
        <div className="bg-white/70 backdrop-blur rounded-2xl px-4 py-2 shadow">
          <p className="text-purple-700 font-bold text-sm">
            Palabra{' '}
            <span className="text-purple-500">{wordIndex + 1}</span>{' '}
            de{' '}
            <span className="text-purple-500">{availableWords.length}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 rounded-2xl px-3 py-2 shadow">
          <span className="text-yellow-500 text-lg">⭐</span>
          <span className="font-bold text-yellow-700 text-sm">{progress.wordsCompleted.length * 2}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md md:max-w-lg bg-white/50 rounded-full h-3 mb-4 sm:mb-6 shadow-inner">
        <motion.div
          className="h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          animate={{ width: `${((wordIndex) / availableWords.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          style={{ minWidth: '8px' }}
        />
      </div>

      {/* Emoji hint */}
      <motion.div
        key={currentWord.word + '-emoji'}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="mb-6"
      >
        <div className="text-8xl sm:text-9xl leading-none select-none drop-shadow-lg">
          {currentWord.emoji}
        </div>
      </motion.div>

      {/* Difficulty badge */}
      <div className="mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            currentWord.difficulty === 1
              ? 'bg-green-100 text-green-700'
              : currentWord.difficulty === 2
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {currentWord.difficulty === 1 ? '⭐ Fácil' : currentWord.difficulty === 2 ? '⭐⭐ Medio' : '⭐⭐⭐ Difícil'}
        </span>
      </div>

      {/* Syllable slots */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {currentWord.syllables.map((_, slotIdx) => {
          const filled = filledSlots[slotIdx];
          return (
            <motion.div
              key={slotIdx}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold border-4 shadow-md transition-colors ${
                filled
                  ? 'bg-purple-400 border-purple-500 text-white'
                  : 'bg-white/80 border-dashed border-purple-300 text-gray-300'
              }`}
              animate={
                filled
                  ? { scale: [1, 1.2, 1], rotate: [0, -4, 4, 0] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.35, type: 'spring' }}
            >
              {filled ?? '_'}
            </motion.div>
          );
        })}
      </div>

      {/* Celebrate overlay */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            key="celebrate"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            className="mb-6 bg-white rounded-3xl px-8 py-4 shadow-xl text-center"
          >
            <p className="text-4xl font-extrabold text-purple-600 tracking-wide">
              {currentWord.word.toUpperCase()}
            </p>
            <p className="text-green-500 font-bold text-lg mt-1">¡Muy bien! 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Syllable buttons */}
      {!celebrating && (
        <div className="flex flex-wrap gap-3 justify-center max-w-md md:max-w-lg mb-6 sm:mb-8">
          {buttonPool.map((btn) => (
            <motion.button
              key={btn.id}
              onClick={() => handleSyllableTap(btn)}
              disabled={btn.used}
              animate={
                shakingId === btn.id
                  ? { x: [0, -10, 10, -8, 8, -4, 4, 0], backgroundColor: ['#f97316', '#fb923c', '#f97316'] }
                  : { x: 0 }
              }
              transition={{ duration: 0.5 }}
              className={`min-w-[64px] h-16 px-5 rounded-2xl text-2xl font-extrabold shadow-lg transition-all select-none
                ${
                  btn.used
                    ? 'bg-gray-100 text-gray-300 border-2 border-gray-200 cursor-not-allowed opacity-40'
                    : 'bg-white text-purple-700 border-2 border-purple-200 hover:bg-purple-50 active:scale-95 active:shadow-inner cursor-pointer'
                }
              `}
            >
              {btn.syllable}
            </motion.button>
          ))}
        </div>
      )}

      {/* Skip button */}
      {!celebrating && (
        <button
          onClick={handleSkip}
          className="mt-auto py-3 px-8 bg-white/70 hover:bg-white active:scale-95 text-gray-500 font-semibold rounded-2xl shadow transition-all text-base border border-gray-200"
        >
          Saltar →
        </button>
      )}
    </div>
  );
}
