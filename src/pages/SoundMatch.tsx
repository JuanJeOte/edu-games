import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LETTERS } from '@/data/letters';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgress } from '@/hooks/useProgress';
import type { LetterData, ActivitySession } from '@/types';

type GameState = 'playing' | 'feedback' | 'summary';

interface Round {
  target: LetterData;
  choices: LetterData[];
}

interface RoundResult {
  letter: string;
  correct: boolean;
}

const ROUNDS_PER_SESSION = 5;
const ACTIVITY_ID = 'sound-match';

function getDistinctDistractors(target: LetterData, pool: LetterData[]): LetterData[] {
  // Avoid phonetically similar pairs to keep distractors clearly different
  const similarPairs: Record<string, string[]> = {
    b: ['p', 'd'],
    p: ['b', 'd'],
    d: ['t', 'b'],
    t: ['d'],
    m: ['n'],
    n: ['m', 'ñ'],
    ñ: ['n'],
    s: ['z', 'c'],
    z: ['s', 'c'],
    c: ['s', 'z', 'k'],
    g: ['j'],
    j: ['g'],
    l: ['r', 'rr'],
    r: ['l', 'rr'],
    rr: ['r', 'l'],
    v: ['b'],
  };

  const dissimilar = pool.filter((l) => {
    if (l.letter === target.letter) return false;
    const similarsOfTarget = similarPairs[target.letter] ?? [];
    if (similarsOfTarget.includes(l.letter)) return false;
    return true;
  });

  const candidates = dissimilar.length >= 2 ? dissimilar : pool.filter((l) => l.letter !== target.letter);

  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

function buildAvailablePool(exploredLetters: string[]): LetterData[] {
  const vowels = LETTERS.filter((l: LetterData) => l.group === 'vocal');
  const consonants = LETTERS.filter((l: LetterData) => l.group === 'consonante');

  // Always include vowels
  let pool: LetterData[] = [...vowels];

  // Add consonants that have been explored (appear in progress)
  if (exploredLetters.length > 0) {
    const exploredConsonants = consonants.filter((l: LetterData) =>
      exploredLetters.includes(l.letter)
    );
    pool = [...pool, ...exploredConsonants];
  }

  // Need at least 3 letters to form a round; fall back to full vowel set + first consonants
  if (pool.length < 3) {
    const extra = consonants.slice(0, 3 - pool.length);
    pool = [...pool, ...extra];
  }

  return pool;
}

function buildRound(pool: LetterData[]): Round {
  const target = pool[Math.floor(Math.random() * pool.length)];
  const distractors = getDistinctDistractors(target, pool);
  const choices = [...distractors, target].sort(() => Math.random() - 0.5);
  return { target, choices };
}

function StarBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400 text-2xl"
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 1.5,
            x: Math.cos((i * Math.PI * 2) / 8) * 60,
            y: Math.sin((i * Math.PI * 2) / 8) * 60,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          ★
        </motion.div>
      ))}
    </div>
  );
}

export default function SoundMatch() {
  const { speakLetter, isSpeaking } = useSpeech();
  const { progress, addStars, recordMatch, recordSession, checkAndAwardBadges } = useProgress();

  const [gameState, setGameState] = useState<GameState>('playing');
  const [round, setRound] = useState<Round | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);

  const exploredLetters: string[] = Object.entries(progress.letters)
    .filter(([, lp]) => lp.explored)
    .map(([letter]) => letter);

  const startNewRound = useCallback(() => {
    const pool = buildAvailablePool(exploredLetters);
    const newRound = buildRound(pool);
    setRound(newRound);
    setSelectedLetter(null);
    setIsCorrect(null);
    setShowStarBurst(false);
    setGameState('playing');
  }, [exploredLetters]);

  // Start first round on mount
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak the target phoneme whenever a new round starts
  useEffect(() => {
    if (round && gameState === 'playing') {
      speakLetter(round.target.phoneme);
    }
  }, [round, gameState, speakLetter]);

  const handleChoice = (chosen: LetterData) => {
    if (gameState !== 'playing' || !round) return;

    const correct = chosen.letter === round.target.letter;
    setSelectedLetter(chosen.letter);
    setIsCorrect(correct);
    setGameState('feedback');

    recordMatch(round.target.letter, correct);

    if (correct) {
      addStars(1);
      setStarsEarned((prev) => prev + 1);
      setShowStarBurst(true);
      // Auto-advance after a short celebration
      setTimeout(() => {
        const nextIndex = roundIndex + 1;
        setResults((prev) => [...prev, { letter: round.target.letter, correct: true }]);
        if (nextIndex >= ROUNDS_PER_SESSION) {
          finishSession(nextIndex, starsEarned + 1);
        } else {
          setRoundIndex(nextIndex);
          startNewRound();
        }
      }, 1400);
    } else {
      // Wrong: record result but allow retry — do NOT auto-advance
      setResults((prev) => [...prev, { letter: round.target.letter, correct: false }]);
    }
  };

  const handleRetry = () => {
    if (!round) return;
    setSelectedLetter(null);
    setIsCorrect(null);
    setGameState('playing');
    speakLetter(round.target.phoneme);
  };

  const handleSkip = () => {
    if (!round) return;
    const nextIndex = roundIndex + 1;
    if (nextIndex >= ROUNDS_PER_SESSION) {
      finishSession(nextIndex, starsEarned);
    } else {
      setRoundIndex(nextIndex);
      startNewRound();
    }
  };

  const finishSession = (_total: number, _earnedStars: number) => {
    const correctCount = results.filter((r) => r.correct).length + (isCorrect ? 1 : 0);
    const session: ActivitySession = {
      activityId: ACTIVITY_ID,
      date: new Date().toISOString(),
      score: correctCount,
      totalQuestions: ROUNDS_PER_SESSION,
      lettersWorked: [...new Set(results.map((r) => r.letter))],
    };
    recordSession(session);
    checkAndAwardBadges();
    setGameState('summary');
  };

  const handlePlayAgain = () => {
    setRoundIndex(0);
    setResults([]);
    setStarsEarned(0);
    setSelectedLetter(null);
    setIsCorrect(null);
    setShowStarBurst(false);
    startNewRound();
  };

  const correctCount = results.filter((r) => r.correct).length;

  const encouragingMessage = (score: number): string => {
    if (score === 5) return '¡Perfecto! ¡Eres increible!';
    if (score >= 4) return '¡Casi perfecto! ¡Lo hiciste muy bien!';
    if (score >= 3) return '¡Buen trabajo! ¡Sigue practicando!';
    if (score >= 2) return '¡Vas muy bien! ¡La proxima vez lo lograras!';
    return '¡Animo! ¡Cada vez aprendes mas!';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-9rem)] py-3 select-none">
      <AnimatePresence mode="wait">
        {/* SUMMARY SCREEN */}
        {gameState === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white rounded-3xl shadow-xl p-5 sm:p-7 max-w-sm w-full text-center"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">
              ¡Fin del juego!
            </h2>
            <p className="text-5xl font-black text-yellow-500 mb-1">
              {correctCount}/{ROUNDS_PER_SESSION}
            </p>
            <p className="text-lg text-gray-500 mb-4">respuestas correctas</p>

            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: ROUNDS_PER_SESSION }).map((_, i) => (
                <span
                  key={i}
                  className={`text-3xl ${i < starsEarned ? 'text-yellow-400' : 'text-gray-200'}`}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="text-xl font-bold text-indigo-500 mb-6">
              {encouragingMessage(correctCount)}
            </p>

            <motion.button
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.05 }}
              onClick={handlePlayAgain}
              className="w-full py-4 rounded-2xl bg-indigo-500 text-white text-2xl font-extrabold shadow-md active:shadow-none"
            >
              Jugar de nuevo
            </motion.button>
          </motion.div>
        )}

        {/* GAME SCREEN */}
        {(gameState === 'playing' || gameState === 'feedback') && round && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm flex flex-col items-center gap-3 sm:gap-4"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between px-1">
              <span className="text-base font-bold text-indigo-400">
                Ronda {roundIndex + 1} de {ROUNDS_PER_SESSION}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: ROUNDS_PER_SESSION }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < starsEarned ? 'text-yellow-400' : 'text-gray-200'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-indigo-100 rounded-full h-3">
              <motion.div
                className="bg-indigo-400 h-3 rounded-full"
                animate={{ width: `${((roundIndex) / ROUNDS_PER_SESSION) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Prompt card */}
            <motion.div
              key={`prompt-${roundIndex}`}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-3xl shadow-lg px-5 py-4 text-center w-full"
            >
              <p className="text-lg font-semibold text-gray-500 mb-3">
                ¿Qué letra hace este sonido?
              </p>

              {/* Speak again button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => speakLetter(round.target.phoneme)}
                disabled={isSpeaking}
                className={`mx-auto flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-lg font-bold shadow-md transition-colors ${
                  isSpeaking
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-500 active:bg-indigo-600'
                }`}
              >
                <span className="text-2xl">{isSpeaking ? '🔊' : '🔉'}</span>
                Escuchar sonido
              </motion.button>
            </motion.div>

            {/* Choice buttons */}
            <div className="w-full grid grid-cols-3 gap-3 relative">
              {round.choices.map((choice) => {
                const isSelected = selectedLetter === choice.letter;
                const isTarget = choice.letter === round.target.letter;
                const showCorrectPulse =
                  gameState === 'feedback' && isCorrect === false && isTarget;

                let buttonClass =
                  'flex flex-col items-center justify-center rounded-3xl py-3 px-2 text-center shadow-md font-extrabold text-3xl transition-colors ';

                if (gameState === 'feedback') {
                  if (isSelected && isCorrect) {
                    buttonClass += 'bg-green-400 text-white';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'bg-orange-300 text-white';
                  } else if (showCorrectPulse) {
                    buttonClass += 'bg-indigo-100 text-indigo-700 ring-4 ring-indigo-400';
                  } else {
                    buttonClass += 'bg-white text-gray-600 opacity-60';
                  }
                } else {
                  buttonClass += `bg-white text-gray-700 active:scale-95`;
                }

                return (
                  <div key={choice.letter} className="relative">
                    <motion.button
                      onClick={() => handleChoice(choice)}
                      disabled={gameState === 'feedback'}
                      className={buttonClass}
                      animate={
                        isSelected && isCorrect
                          ? { scale: [1, 1.15, 1] }
                          : isSelected && !isCorrect
                          ? { x: [0, -8, 8, -6, 6, 0] }
                          : showCorrectPulse
                          ? { scale: [1, 1.08, 1, 1.08, 1] }
                          : {}
                      }
                      transition={
                        isSelected && !isCorrect
                          ? { duration: 0.4, ease: 'easeInOut' }
                          : showCorrectPulse
                          ? { duration: 0.8, repeat: Infinity }
                          : { duration: 0.3 }
                      }
                    >
                      <span
                        className="text-5xl leading-none"
                        style={{ color: choice.color ?? undefined }}
                      >
                        {choice.uppercase}
                      </span>
                      <span className="text-sm font-semibold text-gray-400 mt-1 lowercase">
                        {choice.letter}
                      </span>
                    </motion.button>

                    {/* Star burst overlay on correct selection */}
                    {isSelected && isCorrect && showStarBurst && <StarBurst />}
                  </div>
                );
              })}
            </div>

            {/* Feedback actions (wrong answer) */}
            <AnimatePresence>
              {gameState === 'feedback' && isCorrect === false && (
                <motion.div
                  key="wrong-feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <p className="text-orange-500 font-bold text-lg text-center">
                    ¡Casi! Escucha otra vez e intenta de nuevo.
                  </p>
                  <div className="flex gap-3 w-full">
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={handleRetry}
                      className="flex-1 py-3 rounded-2xl bg-indigo-500 text-white text-lg font-extrabold shadow-md"
                    >
                      Intentar de nuevo
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={handleSkip}
                      className="py-3 px-4 rounded-2xl bg-gray-200 text-gray-600 text-lg font-bold shadow-md"
                    >
                      Saltar
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
