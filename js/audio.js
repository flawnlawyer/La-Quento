/**
 * La Quento – Roll the Ball | Audio System
 * Handles all game audio using Web Audio API synthesis
 */

export class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.initialized = false;
        this.muted = false;

        // Audio settings
        this.volume = 0.3;
    }

    /**
     * Initialize audio context (must be called on user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    /**
     * Resume audio context if suspended
     */
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Play a tone
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type
     * @param {number} volume - Volume (0-1)
     */
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.initialized || this.muted) return;

        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.ctx.currentTime + duration);
    }

    /**
     * Play wall collision sound
     */
    playWallHit() {
        if (!this.initialized || this.muted) return;

        // Quick thump sound
        this.playTone(100, 0.1, 'sine', 0.2);
        this.playTone(80, 0.08, 'sine', 0.15);
    }

    /**
     * Play hole fall sound
     */
    playHoleFall() {
        if (!this.initialized || this.muted) return;

        // Descending tone
        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.ctx.currentTime + 0.5);
    }

    /**
     * Play goal reached sound
     */
    playGoalReached() {
        if (!this.initialized || this.muted) return;

        // Victory arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'sine', 0.25);
            }, i * 100);
        });
    }

    /**
     * Play victory fanfare
     */
    playVictory() {
        if (!this.initialized || this.muted) return;

        // Triumphant chord sequence
        const chords = [
            [523.25, 659.25, 783.99],  // C major
            [587.33, 739.99, 880.00],  // D major
            [659.25, 830.61, 987.77],  // E major
            [783.99, 987.77, 1174.66]  // G major
        ];

        chords.forEach((chord, i) => {
            setTimeout(() => {
                chord.forEach(freq => {
                    this.playTone(freq, 0.5, 'sine', 0.15);
                });
            }, i * 200);
        });
    }

    /**
     * Play game over sound
     */
    playGameOver() {
        if (!this.initialized || this.muted) return;

        // Sad descending notes
        const notes = [392.00, 349.23, 329.63, 293.66]; // G4, F4, E4, D4
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.4, 'sine', 0.2);
            }, i * 200);
        });
    }

    /**
     * Play menu select sound
     */
    playSelect() {
        if (!this.initialized || this.muted) return;

        this.playTone(880, 0.1, 'sine', 0.15);
        setTimeout(() => {
            this.playTone(1100, 0.1, 'sine', 0.15);
        }, 50);
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.volume;
        }
        return this.muted;
    }

    /**
     * Set master volume
     * @param {number} value - Volume (0-1)
     */
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        if (this.masterGain && !this.muted) {
            this.masterGain.gain.value = this.volume;
        }
    }
}
