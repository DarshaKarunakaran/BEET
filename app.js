var metronome = new Metronome();
var tempo = document.getElementById('tempo');
tempo.textContent = metronome.tempo;

var playButton = document.getElementById('play-button');

playButton.addEventListener('click', function () {
    metronome.startStop();

    playButton.classList.toggle('active', metronome.isRunning);

    if (metronome.isRunning) {
        stopBeatBoxPlayback(); 
    } else {
        startBeatBoxPlayback(); // Resume independent playback when metronome stops
    }
});

var tempoChangeButtons = document.getElementsByClassName('tempo-change');
for (var i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function () {
        metronome.tempo += parseInt(this.dataset.change);
        tempo.textContent = metronome.tempo;

        if (beatBoxIntervalID) {
            stopBeatBoxPlayback();
            startBeatBoxPlayback(); // Restart interval with updated tempo
        }
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
        this.style.backgroundColor = selectedBeats1[beatIndex] ? '#831f31' : ''; // Toggle color
    });
}

for (let i = 0; i < beatBoxes2.length; i++) {
    beatBoxes2[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats2[beatIndex] = !selectedBeats2[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats2[beatIndex] ? '#831f31' : ''; // Toggle color
    });
}

for (let i = 0; i < beatBoxes3.length; i++) {
    beatBoxes3[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats3[beatIndex] = !selectedBeats3[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats3[beatIndex] ? '#831f31' : ''; // Toggle color
    });
}

for (let i = 0; i < beatBoxes4.length; i++) {
    beatBoxes4[i].addEventListener('click', function () {
        const beatIndex = i % beatsPerMeasure;
        selectedBeats4[beatIndex] = !selectedBeats4[beatIndex]; // Toggle selection
        this.style.backgroundColor = selectedBeats4[beatIndex] ? '#831f31' : ''; // Toggle color
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

// Independent beat-box playback
let beatBoxIntervalID = null; // Separate interval for beat-box playback

function playBeatBoxBeats() {
    const beatNumber = metronome.currentBeatInBar;

    // Play sounds for selected beat boxes
    playBeatBoxSounds(beatNumber);

    // Move to the next beat
    metronome.nextNote();
}

// Function to start the beat-box playback
function startBeatBoxPlayback() {
    if (beatBoxIntervalID) return; // Prevent multiple intervals

    const interval = 60000 / metronome.tempo; // Calculate interval in ms based on tempo
    beatBoxIntervalID = setInterval(playBeatBoxBeats, interval);
}

// Function to stop the beat-box playback
function stopBeatBoxPlayback() {
    clearInterval(beatBoxIntervalID);
    beatBoxIntervalID = null;
}

// Start beat-box playback on page load
startBeatBoxPlayback();
