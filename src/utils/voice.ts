export const playVoiceAlert = (message: string, lang = 'en-US') => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1.2; // Slightly higher pitch for urgency
    utterance.lang = lang;
    
    window.speechSynthesis.speak(utterance);
  }
};
