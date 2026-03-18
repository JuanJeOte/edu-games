export function getSpanishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null

  const voices = window.speechSynthesis.getVoices()

  // Prefer exact es-ES match, then any Spanish voice
  const esES = voices.find(v => v.lang === 'es-ES')
  if (esES) return esES

  const anySpanish = voices.find(v => v.lang.startsWith('es'))
  return anySpanish ?? null
}

function waitForVoices(): Promise<void> {
  return new Promise(resolve => {
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve()
      return
    }
    window.speechSynthesis.addEventListener('voiceschanged', () => resolve(), { once: true })
  })
}

export interface SpeakOptions {
  rate?: number
  pitch?: number
  voice?: SpeechSynthesisVoice | null
}

export async function speak(text: string, options: SpeakOptions = {}): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  await waitForVoices()

  // Cancel any in-progress speech
  window.speechSynthesis.cancel()

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text)

    const voice = options.voice !== undefined ? options.voice : getSpanishVoice()
    if (voice) utterance.voice = voice

    utterance.lang = 'es-ES'
    utterance.rate = options.rate ?? 0.8
    utterance.pitch = options.pitch ?? 1.1

    utterance.onend = () => resolve()
    utterance.onerror = (event) => {
      // "interrupted" fires when cancel() is called — treat as non-fatal
      if (event.error === 'interrupted') {
        resolve()
      } else {
        reject(new Error(`Error de voz: ${event.error}`))
      }
    }

    window.speechSynthesis.speak(utterance)
  })
}
