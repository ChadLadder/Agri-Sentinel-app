import { Language } from '../types';

export function speakAdvisoryText(text: string, language: Language = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[TTS] Speech synthesis unavailable in browser.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const langMap: Record<Language, string> = {
    en: 'en-IN',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
  };

  utterance.lang = langMap[language] || 'en-IN';

  // Find matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.includes(langMap[language]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
