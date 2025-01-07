class Metronome {
    constructor(tempo = 120) {
        this.audioContext = null;
        this.notesInQueue = [];
        this.currentBeatInBar = 0;
        this.beatsPerBar = 4; // Default to 4 beats per measure
        this.tempo = tempo;
        this.lookahead = 25; // How often to check the schedule (ms)
        this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (s)
        this.nextNoteTime = 0.0; // When the next note is due
        this.isRunning = false;
        this.intervalID = null;
    }

    nextNote() {
        const secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += secondsPerBeat;

        // Increment beat and wrap around for 4 beats per measure
        this.currentBeatInBar = (this.currentBeatInBar + 1) % this.beatsPerBar;
    }

    scheduleNote(beatNumber, time) {
        this.notesInQueue.push({ note: beatNumber, time: time });

        // Always play the metronome sound for every beat
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        osc.frequency.value = beatNumber === 0 ? 1000 : 800; // Different frequency for downbeat
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);
        osc.start(time);
        osc.stop(time + 0.03);
    }

    scheduler() {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
        }
    }

    start() {
        if (this.isRunning) return;

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;
        this.currentBeatInBar = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;
        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
    }

    stop() {
        this.isRunning = false;
        clearInterval(this.intervalID);
    }

    startStop() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
}
