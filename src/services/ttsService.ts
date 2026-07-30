export type Language = 'en' | 'ta' | 'hi' | 'es' | 'te';

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
    es: 'es-ES',
    te: 'te-IN',
  };

  utterance.lang = langMap[language] || 'en-IN';

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
