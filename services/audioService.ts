class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    return this.ctx;
  }

  public async init() {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted() {
    return this.isMuted;
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, vol: number = 0.1, startTime: number = 0) {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  }

  public playClick() {
    // Sharp click
    this.createOscillator('square', 400, 0.05, 0.05);
  }

  public playType() {
    // Subtle typewriter click
    this.createOscillator('triangle', 800 + Math.random() * 200, 0.03, 0.02);
  }

  public playAction(category: 'Hero' | 'Civilian') {
    if (category === 'Hero') {
      // Punch sound effect (low freq sweep)
      const ctx = this.getContext();
      if (!ctx || this.isMuted) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else {
      // Civilian paper shuffle sound (noise approximation)
      this.createOscillator('sine', 300, 0.1, 0.05);
    }
  }

  public playFanfare() {
    // Victory major triad
    this.createOscillator('triangle', 523.25, 0.4, 0.1, 0);   // C5
    this.createOscillator('triangle', 659.25, 0.4, 0.1, 0.1); // E5
    this.createOscillator('triangle', 783.99, 0.6, 0.1, 0.2); // G5
    this.createOscillator('square', 1046.50, 0.8, 0.05, 0.3); // C6
  }

  public playDanger() {
    // Discordant warning
    this.createOscillator('sawtooth', 100, 0.5, 0.1);
    this.createOscillator('sawtooth', 105, 0.5, 0.1); // Dissonance
  }
}

export const audio = new AudioService();