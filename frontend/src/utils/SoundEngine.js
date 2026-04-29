class SoundEngine {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.enabled = true;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playKeystroke() {
    if (!this.enabled || !this.audioCtx) return;

    const time = this.audioCtx.currentTime;
    
    // Create an oscillator for the 'thwack'
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    // Create a bandpass filter to make it sound more mechanical/plastic
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000 + Math.random() * 500; // Slight random variation
    filter.Q.value = 1.5;

    osc.type = 'square';
    // Start with a sharp transient
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.05);

    // Envelope for a sharp, percussive click
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.3, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  playError() {
    if (!this.enabled || !this.audioCtx) return;

    const time = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.linearRampToValueAtTime(100, time + 0.1);

    gainNode.gain.setValueAtTime(0.2, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  playDing() {
    if (!this.enabled || !this.audioCtx) return;

    const time = this.audioCtx.currentTime;
    
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.4, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.5);
  }
}

// Export a singleton instance
const soundEngine = new SoundEngine();
export default soundEngine;
