import { AlarmTone } from './types';

class AudioController {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNode: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
    }
  }

  public getContext(): AudioContext {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx!;
  }

  public async resumeContext(): Promise<AudioContext | null> {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume warning:', err);
      }
    }
    return ctx;
  }

  public stopSound() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored if already stopped
      }
    });
    this.activeOscillators = [];

    if (this.activeGainNode) {
      try {
        this.activeGainNode.disconnect();
      } catch {
        // Ignored
      }
      this.activeGainNode = null;
    }

    if (this.customAudio) {
      try {
        this.customAudio.pause();
        this.customAudio.currentTime = 0;
      } catch {
        // Ignored
      }
    }

    this.isPlaying = false;
  }

  public playAlarm(tone: AlarmTone, volume: number = 0.8, customAudioDataUrl?: string) {
    this.stopSound();
    const ctx = this.getContext();
    if (!ctx) return;
    this.isPlaying = true;

    // Custom audio track file if uploaded
    if (tone === 'custom' && customAudioDataUrl) {
      try {
        this.customAudio = new Audio(customAudioDataUrl);
        this.customAudio.volume = Math.max(0.1, Math.min(1.0, volume));
        this.customAudio.loop = true;
        this.customAudio.play().catch((err) => console.warn('Custom audio playback postponed until interaction:', err));
        return;
      } catch (err) {
        console.warn('Fallback to synth due to custom audio error:', err);
      }
    }

    // Master Output Gain Node (boosted to 0.75 for high-urgency annunciator audibility)
    const masterGain = ctx.createGain();
    const effectiveVol = Math.max(0.15, Math.min(1.0, volume)) * 0.75;
    masterGain.gain.setValueAtTime(effectiveVol, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.activeGainNode = masterGain;

    if (tone === 'buzzer') {
      // Industrial Breaker Buzzer: Harsh dual sawtooth modulated with 4.5Hz aggressive chopper pulse
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(180, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(360, ctx.currentTime);

      // Fast pulsing chopper gain (BZZT - BZZT - BZZT)
      const chopperGain = ctx.createGain();
      chopperGain.gain.setValueAtTime(1.0, ctx.currentTime);

      const chopperLFO = ctx.createOscillator();
      chopperLFO.type = 'square';
      chopperLFO.frequency.setValueAtTime(4.5, ctx.currentTime);
      chopperLFO.connect(chopperGain.gain);

      osc1.connect(chopperGain);
      osc2.connect(chopperGain);
      chopperGain.connect(masterGain);

      osc1.start();
      osc2.start();
      chopperLFO.start();
      this.activeOscillators.push(osc1, osc2, chopperLFO);

    } else if (tone === 'siren') {
      // High-Urgency Emergency Siren: Continuous triangle LFO sweeping 700Hz to 1350Hz
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'triangle';
      lfo.frequency.setValueAtTime(1.8, ctx.currentTime); // 1.8 sweeps per second

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(380, ctx.currentTime); // 950 ± 380 = 570Hz to 1330Hz
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Secondary harmonizing oscillator for realistic horn resonance
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1150, ctx.currentTime);
      const lfo2Gain = ctx.createGain();
      lfo2Gain.gain.setValueAtTime(320, ctx.currentTime);
      lfo.connect(lfo2Gain);
      lfo2Gain.connect(osc2.frequency);

      osc.connect(masterGain);
      osc2.connect(masterGain);

      osc.start();
      osc2.start();
      lfo.start();
      this.activeOscillators.push(osc, osc2, lfo);

    } else if (tone === 'chime') {
      // Harmonic Pulsed Chime: Alternating dual-bell tone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc2.frequency.setValueAtTime(880.00, ctx.currentTime); // A5

      const chimePulse = ctx.createGain();
      const lfo = ctx.createOscillator();
      lfo.type = 'triangle';
      lfo.frequency.setValueAtTime(2.0, ctx.currentTime);
      lfo.connect(chimePulse.gain);

      osc1.connect(chimePulse);
      osc2.connect(chimePulse);
      chimePulse.connect(masterGain);

      osc1.start();
      osc2.start();
      lfo.start();
      this.activeOscillators.push(osc1, osc2, lfo);

    } else {
      // Custom Synthesizer: 880Hz / 440Hz rapid alternating alarm pulse
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      const pulseGain = ctx.createGain();
      pulseGain.gain.setValueAtTime(1.0, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.setValueAtTime(6.0, ctx.currentTime); // 6 Hz rapid beep
      lfo.connect(pulseGain.gain);

      osc.connect(pulseGain);
      pulseGain.connect(masterGain);

      osc.start();
      lfo.start();
      this.activeOscillators.push(osc, lfo);
    }
  }

  public previewTone(tone: AlarmTone, volume: number = 0.8, customAudioDataUrl?: string) {
    this.playAlarm(tone, volume, customAudioDataUrl);
    setTimeout(() => {
      this.stopSound();
    }, 2800);
  }
}

export const audioController = new AudioController();
