import { Language } from '../types';

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text: string, lang: Language = 'en', onEnd?: () => void): void {
  if (!isSpeechSupported()) {
    console.warn('Web Speech API is not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower pace for elderly accessibility
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Set voice language code
    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'as') {
      // Browser support for Assamese TTS may fall back to Bengali or Hindi or Indian English
      utterance.lang = 'bn-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
      if (match) {
        utterance.voice = match;
      }
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Speech synthesis error:', error);
    if (onEnd) onEnd();
  }
}
