/**
 * Web Audio API procedural sound synthesizer for Greek Legends.
 * Requires no external audio files - fully synthesizes Greek lyre,
 * chimes, thunder, water, and ambient celestial music in real-time.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private masterVolume: number = 0.7;
  private musicGainNode: GainNode | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.setValueAtTime(this.masterVolume * 0.18, this.ctx?.currentTime || 0);
    }
  }

  public getSettings() {
    return {
      soundEnabled: this.soundEnabled,
      musicEnabled: this.musicEnabled,
      volume: this.masterVolume,
    };
  }

  // --- Sound Effects ---

  /** Soft stone/marble tap for tile selection and UI clicks */
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  /** Aquatic bubble pop for Atlantis mode clicks */
  public playBubble() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.28 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  /** Subtle whoosh for tile swap */
  public playSwap() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.18 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  /** Invalid swap buzz */
  public playInvalid() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.setValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  /** Harmonic Greek chime for 3-match (scales up with combo step) */
  public playMatch(comboLevel: number = 1) {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Ancient Greek Dorian scale frequencies (D4, E4, F4, G4, A4, B4, C5, D5)
    const dorianFrequencies = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99];
    const baseIdx = Math.min(dorianFrequencies.length - 3, (comboLevel - 1) * 2);
    const chord = [dorianFrequencies[baseIdx], dorianFrequencies[baseIdx + 2]];

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.03);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.03);
      gain.gain.linearRampToValueAtTime(0.22 * this.masterVolume, ctx.currentTime + i * 0.03 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + i * 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.03);
      osc.stop(ctx.currentTime + 0.4 + i * 0.03);
    });
  }

  /** Zeus lightning strike sound */
  public playLightning() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Thunder noise
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();

    // High electrical zap
    const zap = ctx.createOscillator();
    const zapGain = ctx.createGain();
    zap.type = 'sawtooth';
    zap.frequency.setValueAtTime(1400, ctx.currentTime);
    zap.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);

    zapGain.gain.setValueAtTime(0.2 * this.masterVolume, ctx.currentTime);
    zapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    zap.connect(zapGain);
    zapGain.connect(ctx.destination);

    zap.start();
    zap.stop(ctx.currentTime + 0.2);
  }

  /** Sun supernova blast */
  public playSupernova() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const frequencies = [440, 554.37, 659.25, 880, 1108.73];
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.25 * this.masterVolume, ctx.currentTime + idx * 0.05 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + 0.75);
    });
  }

  /** Marble stone break sound */
  public playBreakMarble() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  /** Level victory fanfare */
  public playVictory() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [
      { f: 392.00, t: 0.00, d: 0.18 }, // G4
      { f: 523.25, t: 0.18, d: 0.18 }, // C5
      { f: 659.25, t: 0.36, d: 0.18 }, // E5
      { f: 783.99, t: 0.54, d: 0.55 }, // G5
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, ctx.currentTime + note.t);

      gain.gain.setValueAtTime(0.28 * this.masterVolume, ctx.currentTime + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.t);
      osc.stop(ctx.currentTime + note.t + note.d);
    });
  }

  /** Level defeat sound */
  public playDefeat() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const notes = [
      { f: 440.00, t: 0.00, d: 0.22 },
      { f: 415.30, t: 0.22, d: 0.22 },
      { f: 392.00, t: 0.44, d: 0.45 },
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, ctx.currentTime + note.t);

      gain.gain.setValueAtTime(0.2 * this.masterVolume, ctx.currentTime + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.t);
      osc.stop(ctx.currentTime + note.t + note.d);
    });
  }

  // --- Ambient Mythological Music (Greek Lyre & Celestial Drone) ---

  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.musicGainNode = ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(this.masterVolume * 0.18, ctx.currentTime);
    this.musicGainNode.connect(ctx.destination);

    // Warm celestial drone pad
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(146.83, ctx.currentTime); // D3
    droneGain.gain.setValueAtTime(0.12, ctx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(this.musicGainNode);
    drone.start();

    // Secondary harmonic fifth drone
    const drone5 = ctx.createOscillator();
    const drone5Gain = ctx.createGain();
    drone5.type = 'sine';
    drone5.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
    drone5Gain.gain.setValueAtTime(0.07, ctx.currentTime);
    drone5.connect(drone5Gain);
    drone5Gain.connect(this.musicGainNode);
    drone5.start();

    // Greek Lyre / Harp arpeggiated motif
    const lyreNotes = [293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 329.63, 293.66];
    let noteIndex = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;
      const freq = lyreNotes[noteIndex % lyreNotes.length];
      noteIndex++;

      const lyreOsc = this.ctx.createOscillator();
      const lyreGain = this.ctx.createGain();

      lyreOsc.type = 'triangle';
      lyreOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      lyreGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      lyreGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      lyreOsc.connect(lyreGain);
      lyreGain.connect(this.musicGainNode);

      lyreOsc.start();
      lyreOsc.stop(this.ctx.currentTime + 1.25);
    }, 1100);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.musicGainNode.disconnect();
      this.musicGainNode = null;
    }
  }
}

export const soundManager = new AudioService();
