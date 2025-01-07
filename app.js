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
var selectedBeats1 = Array(beatsPerMeasure).fill(false);
var selectedBeats2 = Array(beatsPerMeasure).fill(false);
var selectedBeats3 = Array(beatsPerMeasure).fill(false);
var selectedBeats4 = Array(beatsPerMeasure).fill(false);

// Handle beat-box button clicks for beat-boxes
var beatBoxes1 = document.getElementsByClassName('beat-box1');
var beatBoxes2 = document.getElementsByClassName('beat-box2');
var beatBoxes3 = document.getElementsByClassName('beat-box3');
var beatBoxes4 = document.getElementsByClassName('beat-box4');

for (let i = 0; i < beatBoxes1.length; i++) {
    beatBoxes1[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats1[beatIndex] = !selectedBeats1[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats1[beatIndex] ? '#ffcad4' : ''; // Toggle color
    });
}

for (let i = 0; i < beatBoxes2.length; i++) {
    beatBoxes2[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats2[beatIndex] = !selectedBeats2[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats2[beatIndex] ? '#ffcad4' : ''; // Toggle color
    });
}

for (let i = 0; i < beatBoxes3.length; i++) {
    beatBoxes3[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats3[beatIndex] = !selectedBeats3[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats3[beatIndex] ? '#ffcad4' : ''; // Toggle color
    });
}

for (let i = 0; i < beatBoxes4.length; i++) {
    beatBoxes4[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats4[beatIndex] = !selectedBeats4[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats4[beatIndex] ? '#ffcad4' : ''; // Toggle color
    });
}

// Function to play beat-box sounds
function playBeatBoxSounds(beatNumber) {
    if (selectedBeats1[beatNumber]) {
        const audio1 = new Audio('click1.wav'); // Sound for beat-box1
        audio1.currentTime = 0; // Reset playback position
        audio1.play();
    }

    if (selectedBeats2[beatNumber]) {
        const audio2 = new Audio('click2.wav'); // Sound for beat-box2
        audio2.currentTime = 0; // Reset playback position
        audio2.play();
    }

    if (selectedBeats3[beatNumber]) {
        const audio3 = new Audio('click3.wav'); // Sound for beat-box3
        audio3.currentTime = 0; // Reset playback position
        audio3.play();
    }

    if (selectedBeats4[beatNumber]) {
        const audio4 = new Audio('click4.wav'); // Sound for beat-box4
        audio4.currentTime = 0; // Reset playback position
        audio4.play();
    }
}

// Override Metronome scheduleNote method
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

    // Play custom sounds for beat-boxes
    playBeatBoxSounds(beatNumber);
};

metronome.scheduler = function () {
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
        this.scheduleNote(this.currentBeatInBar, this.nextNoteTime); // Schedule the note for each beat
        this.nextNote();
    }
};

//beat-box sounds play according to the tempo
setInterval(() => {
    if (!metronome.isRunning) {
        const beatNumber = metronome.currentBeatInBar;
        playBeatBoxSounds(beatNumber);
        metronome.nextNote();
    }
}, 60000 / metronome.tempo);
