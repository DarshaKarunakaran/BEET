var metronome = new Metronome();
var tempo = document.getElementById('tempo');
tempo.textContent = metronome.tempo;

var playPauseIcon = document.getElementById('play-pause-icon');
var playButton = document.getElementById('play-button');

playButton.addEventListener('click', function () {
    metronome.startStop();
    playPauseIcon.className = metronome.isRunning ? 'pause' : 'play';
});

var tempoChangeButtons = document.getElementsByClassName('tempo-change');
for (var i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function () {
        metronome.tempo += parseInt(this.dataset.change);
        tempo.textContent = metronome.tempo;
    });
}

const beatsPerMeasure = 4;
var selectedBeats = Array(beatsPerMeasure).fill(false);

//Handle beat-box button clicks
var beatBoxes = document.getElementsByClassName('beat-box');
for (let i = 0; i < beatBoxes.length; i++) {
    beatBoxes[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats[beatIndex] = !selectedBeats[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats[beatIndex] ? 'green' : ''; // Toggle color
    });
}

//Override Metronome scheduleNote method
metronome.scheduleNote = function (beatNumber, time) {
    this.notesInQueue.push({ note: beatNumber, time: time });

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

    // Play custom sound only if the beat is selected
    if (selectedBeats[beatNumber]) {
        const audio = new Audio(`click${beatNumber + 1}.wav`); // Change 'click' to the desired sound name
        audio.currentTime = 0; // Reset playback position
        audio.play();
    }
};

metronome.scheduler = function () {
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
        this.scheduleNote(this.currentBeatInBar, this.nextNoteTime); // Schedule the note for each beat
        this.nextNote();
    }
};
