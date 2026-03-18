import { useState } from 'react';
import { SYLLABLE_GROUPS } from '@/data/syllables';
import { CONSONANTS } from '@/data/letters';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgress } from '@/hooks/useProgress';
import { motion, AnimatePresence } from 'motion/react';

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

const VOWEL_COLORS: Record<string, string> = {
  A: 'bg-red-400 hover:bg-red-500 active:bg-red-600',
  E: 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600',
  I: 'bg-green-400 hover:bg-green-500 active:bg-green-600',
  O: 'bg-blue-400 hover:bg-blue-500 active:bg-blue-600',
  U: 'bg-purple-400 hover:bg-purple-500 active:bg-purple-600',
};

const VOWEL_COMPLETED_COLORS: Record<string, string> = {
  A: 'bg-red-200',
  E: 'bg-yellow-200',
  I: 'bg-green-200',
  O: 'bg-blue-200',
  U: 'bg-purple-200',
};

type MergeState = 'idle' | 'merging' | 'showing' | 'celebrating';

export default function SyllableBuilder() {
  const { speakSyllable, speakWord } = useSpeech();
  const { progress, completeSyllable, addStars, checkAndAwardBadges } = useProgress();

  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null);
  const [mergeState, setMergeState] = useState<MergeState>('idle');
  const [activeVowel, setActiveVowel] = useState<string | null>(null);
  const [formedSyllable, setFormedSyllable] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const exploredConsonants = CONSONANTS.filter(
    (c) => progress.letters?.[c.letter]?.explored
  );

  const getCompletedSyllablesForConsonant = (consonant: string): string[] => {
    const groups = SYLLABLE_GROUPS[consonant] ?? [];
    return groups
      .map((s) => s.syllable)
      .filter((syl) => progress.syllablesCompleted?.includes(syl));
  };

  const isSyllableCompleted = (consonant: string, vowel: string): boolean => {
    const groups = SYLLABLE_GROUPS[consonant] ?? [];
    const syllableData = groups.find((s) => s.vowel === vowel);
    if (!syllableData) return false;
    return progress.syllablesCompleted?.includes(syllableData.syllable) ?? false;
  };

  const getExampleData = (consonant: string, vowel: string) => {
    const groups = SYLLABLE_GROUPS[consonant] ?? [];
    return groups.find((s) => s.vowel === vowel) ?? null;
  };

  const handleVowelTap = async (vowel: string) => {
    if (!selectedConsonant || mergeState !== 'idle') return;

    const exampleData = getExampleData(selectedConsonant, vowel);
    const syllable = exampleData?.syllable ?? `${selectedConsonant}${vowel}`.toLowerCase();

    setActiveVowel(vowel);
    setFormedSyllable(syllable);
    setMergeState('merging');

    await new Promise((r) => setTimeout(r, 600));
    setMergeState('showing');

    speakSyllable(syllable);

    if (exampleData?.exampleWord) {
      await new Promise((r) => setTimeout(r, 800));
      speakWord(exampleData.exampleWord);
    }

    completeSyllable(syllable);

    const completedAfter = [
      ...(progress.syllablesCompleted ?? []),
      syllable,
    ];
    const allSyllablesForConsonant = (SYLLABLE_GROUPS[selectedConsonant] ?? []).map(
      (s) => s.syllable
    );
    const allCompleted = allSyllablesForConsonant.every((s) => completedAfter.includes(s));

    if (allCompleted && allSyllablesForConsonant.length > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      setMergeState('celebrating');
      setShowCelebration(true);
      addStars(3);
      checkAndAwardBadges();
      await new Promise((r) => setTimeout(r, 2500));
      setShowCelebration(false);
    } else {
      await new Promise((r) => setTimeout(r, 2000));
    }

    setMergeState('idle');
    setActiveVowel(null);
    setFormedSyllable(null);
  };

  const handleConsonantSelect = (letter: string) => {
    if (mergeState !== 'idle') return;
    setSelectedConsonant(letter === selectedConsonant ? null : letter);
    setActiveVowel(null);
    setFormedSyllable(null);
    setMergeState('idle');
  };

  const exampleData =
    selectedConsonant && activeVowel
      ? getExampleData(selectedConsonant, activeVowel)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-100 flex flex-col items-center px-4 py-6 select-none">
      {/* Header */}
      <motion.h1
        className="text-3xl font-extrabold text-indigo-700 mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Constructor de Sílabas
      </motion.h1>
      <p className="text-indigo-400 text-sm mb-6 text-center">
        Elige una consonante y forma sílabas
      </p>

      {/* Consonant selector */}
      {exploredConsonants.length === 0 ? (
        <motion.div
          className="bg-white rounded-3xl shadow-md px-8 py-10 flex flex-col items-center gap-4 max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-6xl">🔤</span>
          <p className="text-xl font-bold text-indigo-600">
            ¡Primero explora las letras!
          </p>
          <p className="text-gray-500 text-sm">
            Ve a la sección de letras, aprende algunas consonantes y luego regresa aquí para formar sílabas.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Consonant row */}
          <div className="w-full max-w-2xl mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
              {exploredConsonants.map((c) => {
                const completedCount = getCompletedSyllablesForConsonant(c.letter).length;
                const totalCount = (SYLLABLE_GROUPS[c.letter] ?? []).length;
                const isSelected = selectedConsonant === c.letter;
                const allDone = totalCount > 0 && completedCount === totalCount;

                return (
                  <motion.button
                    key={c.letter}
                    onClick={() => handleConsonantSelect(c.letter)}
                    whileTap={{ scale: 0.92 }}
                    className={`
                      flex-shrink-0 w-16 h-16 rounded-2xl font-extrabold text-2xl
                      flex flex-col items-center justify-center relative
                      shadow-md transition-all duration-150
                      ${isSelected
                        ? 'bg-indigo-500 text-white shadow-indigo-300 scale-110'
                        : allDone
                          ? 'bg-green-100 text-green-700 border-2 border-green-400'
                          : 'bg-white text-indigo-700 border-2 border-indigo-200'
                      }
                    `}
                  >
                    {c.letter}
                    {allDone && (
                      <span className="text-xs mt-0.5">⭐</span>
                    )}
                    {!allDone && totalCount > 0 && (
                      <span className="text-[10px] text-indigo-400 font-normal">
                        {completedCount}/{totalCount}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Builder area */}
          <AnimatePresence mode="wait">
            {!selectedConsonant ? (
              <motion.div
                key="prompt"
                className="flex flex-col items-center gap-3 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-7xl">👆</span>
                <p className="text-indigo-400 text-lg font-semibold">
                  Elige una consonante arriba
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedConsonant}
                className="w-full max-w-sm flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Merge animation area */}
                <div className="relative w-full h-36 flex items-center justify-center overflow-visible">
                  {mergeState === 'idle' && (
                    <motion.div
                      key="consonant-idle"
                      className="w-28 h-28 rounded-3xl bg-indigo-500 shadow-xl flex items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <span className="text-6xl font-extrabold text-white">
                        {selectedConsonant}
                      </span>
                    </motion.div>
                  )}

                  {(mergeState === 'merging' || mergeState === 'showing' || mergeState === 'celebrating') && formedSyllable && activeVowel && (
                    <>
                      {mergeState === 'merging' && (
                        <>
                          <motion.div
                            className="absolute w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg"
                            initial={{ x: -80 }}
                            animate={{ x: -10 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          >
                            <span className="text-4xl font-extrabold text-white">
                              {selectedConsonant}
                            </span>
                          </motion.div>
                          <motion.div
                            className={`absolute w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${VOWEL_COLORS[activeVowel].split(' ')[0]}`}
                            initial={{ x: 80 }}
                            animate={{ x: 10 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          >
                            <span className="text-4xl font-extrabold text-white">
                              {activeVowel}
                            </span>
                          </motion.div>
                        </>
                      )}

                      {(mergeState === 'showing' || mergeState === 'celebrating') && (
                        <motion.div
                          key="syllable-display"
                          className="w-40 h-36 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-2xl"
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        >
                          <span className="text-7xl font-extrabold text-white tracking-wide uppercase">
                            {formedSyllable}
                          </span>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>

                {/* Example word */}
                <AnimatePresence>
                  {mergeState === 'showing' && exampleData && (
                    <motion.div
                      className="flex flex-col items-center gap-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-6xl">{exampleData.exampleEmoji}</span>
                      <span className="text-2xl font-bold text-indigo-700 capitalize">
                        {exampleData.exampleWord}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Celebration */}
                <AnimatePresence>
                  {showCelebration && (
                    <motion.div
                      className="flex flex-col items-center gap-2"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className="text-5xl">🎉</span>
                      <p className="text-xl font-extrabold text-yellow-500">
                        ¡Completaste todas las sílabas!
                      </p>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="text-3xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                          >
                            ⭐
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vowel buttons */}
                <div className="grid grid-cols-5 gap-3 w-full mt-2">
                  {VOWELS.map((vowel) => {
                    const completed = isSyllableCompleted(selectedConsonant, vowel);
                    const isActive = activeVowel === vowel && mergeState !== 'idle';
                    const syllableExists = (SYLLABLE_GROUPS[selectedConsonant] ?? []).some(
                      (s) => s.vowel === vowel
                    );

                    return (
                      <motion.button
                        key={vowel}
                        onClick={() => handleVowelTap(vowel)}
                        disabled={mergeState !== 'idle' || !syllableExists}
                        whileTap={mergeState === 'idle' && syllableExists ? { scale: 0.88 } : {}}
                        className={`
                          relative w-full aspect-square rounded-full
                          flex flex-col items-center justify-center
                          font-extrabold text-2xl text-white shadow-lg
                          transition-all duration-150
                          ${!syllableExists
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                            : completed
                              ? `${VOWEL_COMPLETED_COLORS[vowel]} border-2 border-current`
                              : isActive
                                ? `${VOWEL_COLORS[vowel].split(' ')[0]} opacity-60`
                                : VOWEL_COLORS[vowel]
                          }
                          disabled:opacity-60
                        `}
                      >
                        <span className={completed ? 'text-gray-600' : ''}>{vowel}</span>
                        {completed && (
                          <span className="absolute bottom-1 text-xs">✓</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Progress dots */}
                <div className="flex gap-2 mt-1">
                  {VOWELS.map((vowel) => {
                    const completed = isSyllableCompleted(selectedConsonant, vowel);
                    return (
                      <div
                        key={vowel}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          completed ? 'bg-green-400' : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
