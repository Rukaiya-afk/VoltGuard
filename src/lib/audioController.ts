import { AlarmTone } from './types';

class AudioController {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNode: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
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
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
    }

    this.isPlaying = false;
  }

  public playAlarm(tone: AlarmTone, volume: number = 0.8, customAudioDataUrl?: string) {
    this.stopSound();
    const ctx = this.getContext();
    this.isPlaying = true;

    if (tone === 'custom' && customAudioDataUrl) {
      try {
        this.customAudio = new Audio(customAudioDataUrl);
        this.customAudio.volume = volume;
        this.customAudio.loop = true;
        this.customAudio.play().catch((err) => console.warn('Custom audio play failed:', err));
        return;
      } catch (err) {
        console.warn('Fallback to synth due to custom audio error:', err);
      }
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.activeGainNode = masterGain;

    if (tone === 'buzzer') {
      // Industrial Buzzer: Low-frequency square wave with rapid modulation
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(12, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(40, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(masterGain);
      osc.start();
      lfo.start();
      this.activeOscillators.push(osc, lfo);

    } else if (tone === 'siren') {
      // Pulse Siren: Dual alternating high-pitch frequency sweep
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      // Sweep frequency up and down every 0.4s
      const now = ctx.currentTime;
      osc.frequency.linearRampToValueAtTime(1400, now + 0.3);
      osc.frequency.linearRampToValueAtTime(800, now + 0.6);

      const lfo = ctx.createOscillator();
      lfo.type = 'triangle';
      lfo.frequency.setValueAtTime(2.5, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(300, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(masterGain);
      osc.start();
      lfo.start();
      this.activeOscillators.push(osc, lfo);

    } else if (tone === 'chime') {
      // Soft Chime Warning: Harmonic dual bell tone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start();
      osc2.start();
      this.activeOscillators.push(osc1, osc2);

    } else {
      // Custom Frequency Synthesizer: 880Hz / 440Hz rapid pulse
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      const pulseGain = ctx.createGain();
      pulseGain.gain.setValueAtTime(1.0, ctx.currentTime);
      
      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.setValueAtTime(6, ctx.currentTime); // 6 Hz pulse
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
    }, 2500);
  }
}

export const audioController = new AudioController();
