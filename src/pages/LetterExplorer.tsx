import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LETTERS } from '@/data/letters';
import { useSpeech } from '@/hooks/useSpeech';
import { useProgress } from '@/hooks/useProgress';
import LetterCard from '@/components/common/LetterCard';
import type { LetterData } from '@/types';

// Sorted alphabetically (Spanish locale: a,b,c,...,ñ,...,z)
const sortedLetters = [...LETTERS].sort((a, b) =>
  a.letter.localeCompare(b.letter, 'es')
);

export default function LetterExplorer() {
  const [uppercase, setUppercase] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);

  const { speakLetter, speakWord, isSpeaking } = useSpeech();
  const { progress, markLetterExplored, markLetterHeard } = useProgress();

  function handleLetterTap(letter: LetterData) {
    speakLetter(letter.phoneme);
    markLetterExplored(letter.letter);
    markLetterHeard(letter.letter);
    setSelectedLetter(letter);
  }

  function handlePlaySound() {
    if (!selectedLetter) return;
    speakLetter(selectedLetter.phoneme);
    markLetterHeard(selectedLetter.letter);
  }

  function handlePlayWord() {
    if (!selectedLetter) return;
    speakWord(selectedLetter.exampleWord);
  }

  function closeDetail() {
    setSelectedLetter(null);
  }

  return (
    <div className="py-3 px-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-extrabold text-indigo-700">
          Explorador de Letras
        </h1>
        <button
          onClick={() => setUppercase((u) => !u)}
          className="px-4 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 transition-transform font-bold text-yellow-900 shadow-md text-sm"
        >
          {uppercase ? 'abc' : 'ABC'}
        </button>
      </div>

      {/* Letter grid — 6 cols on mobile, 7 on sm+ */}
      <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
        {sortedLetters.map((letter) => {
          const isExplored = progress.letters?.[letter.letter]?.explored ?? false;
          return (
            <motion.div
              key={letter.letter}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <LetterCard
                letter={uppercase ? letter.uppercase : letter.letter}
                color={letter.color}
                explored={isExplored}
                onClick={() => handleLetterTap(letter)}
                size="auto"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedLetter && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeDetail}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.7, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 60 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div
                className="pointer-events-auto relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 mx-4 w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-4"
                style={{ borderTop: `6px solid ${selectedLetter.color}` }}
              >
                {/* Close button */}
                <button
                  onClick={closeDetail}
                  className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                  aria-label="Cerrar"
                >
                  ×
                </button>

                {/* Big letter */}
                <div
                  className="text-8xl font-extrabold leading-none select-none"
                  style={{ color: selectedLetter.color }}
                >
                  {uppercase ? selectedLetter.uppercase : selectedLetter.letter.toLowerCase()}
                </div>

                {/* Emoji / image */}
                <span
                  className="text-8xl leading-none"
                  role="img"
                  aria-label={selectedLetter.exampleWord}
                >
                  {selectedLetter.imagePath}
                </span>

                {/* Example word */}
                <p className="text-2xl font-bold text-gray-700 capitalize">
                  {selectedLetter.exampleWord}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={handlePlaySound}
                    disabled={isSpeaking}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-transform text-white font-bold shadow disabled:opacity-60"
                  >
                    <span>🔊</span>
                    <span>Sonido</span>
                  </button>
                  <button
                    onClick={handlePlayWord}
                    disabled={isSpeaking}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-transform text-white font-bold shadow disabled:opacity-60"
                  >
                    <span>💬</span>
                    <span>Palabra</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
