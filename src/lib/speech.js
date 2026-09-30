export function findLtVoice() {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return null;
    const voices = synth.getVoices();
    return (
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('lt-lt')) ??
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('lt')) ??
      null
    );
  } catch {
    return null;
  }
}

export function hasSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text, rate = 0.9) {
  try {
    const synth = window.speechSynthesis;
    if (!synth || !text) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'lt-LT';
    const voice = findLtVoice();
    if (voice) u.voice = voice;
    u.rate = rate;
    synth.speak(u);
  } catch {
    // no TTS available
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // nothing to cancel
  }
}