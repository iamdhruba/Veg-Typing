// Singleton AudioContext for typewriter sound effects
// Prevents memory leaks from creating a new context on every keypress

let audioCtx = null;

const getAudioCtx = () => {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a typewriter-style click sound.
 * @param {boolean} isSpace - If true, plays a deeper "carriage" sound
 */
export const playTypewriterClick = (isSpace = false) => {
  try {
    const ctx = getAudioCtx();

    // 1. Noise burst — mechanical "clack"
    const bufferSize = ctx.sampleRate * 0.02;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(isSpace ? 0.03 : 0.06, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Tonal resonance — metallic ring
    const oscillator = ctx.createOscillator();
    const toneGain = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(isSpace ? 150 : 600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(isSpace ? 100 : 300, ctx.currentTime + 0.05);
    toneGain.gain.setValueAtTime(isSpace ? 0.01 : 0.02, ctx.currentTime);
    toneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    oscillator.connect(toneGain);
    toneGain.connect(ctx.destination);

    noiseSource.start();
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.05);
  } catch {
    // AudioContext might be blocked or unsupported
  }
};

/**
 * Play a short error buzz sound.
 */
export const playErrorBuzz = () => {
  try {
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  } catch { /* ignore */ }
};

/**
 * Play a typewriter bell "ding" sound.
 */
export const playTypewriterDing = () => {
  try {
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch { /* ignore */ }
};
