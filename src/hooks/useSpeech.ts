import { useCallback, useEffect, useRef, useState } from 'react'
import { speak, getSpanishVoice } from '@/utils/speech'
import type { SpeakOptions } from '@/utils/speech'

const DEFAULT_RATE = 0.8
const DEFAULT_PITCH = 1.1

export function useSpeech() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (!isSupported) return

    const load = () => {
      voiceRef.current = getSpanishVoice()
    }

    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
    }
  }, [isSupported])

  const speakWithDefaults = useCallback(
    async (text: string, overrides: SpeakOptions = {}) => {
      if (!isSupported) return
      setIsSpeaking(true)
      try {
        await speak(text, {
          rate: DEFAULT_RATE,
          pitch: DEFAULT_PITCH,
          voice: voiceRef.current,
          ...overrides,
        })
      } finally {
        setIsSpeaking(false)
      }
    },
    [isSupported],
  )

  /** Habla el sonido fonético de una letra */
  const speakLetter = useCallback(
    (phoneme: string) => speakWithDefaults(phoneme, { rate: 0.7 }),
    [speakWithDefaults],
  )

  /** Habla una palabra completa */
  const speakWord = useCallback(
    (word: string) => speakWithDefaults(word, { rate: 0.75 }),
    [speakWithDefaults],
  )

  /** Habla una sílaba */
  const speakSyllable = useCallback(
    (syllable: string) => speakWithDefaults(syllable, { rate: 0.65 }),
    [speakWithDefaults],
  )

  return {
    speak: speakWithDefaults,
    speakLetter,
    speakWord,
    speakSyllable,
    isSupported,
    isSpeaking,
  }
}
