import Timer from './timer.js';

// Variables for the UI elements and the audio file
const tempoSlider = document.querySelector(".tempoSlider");
const tempoDisplay = document.querySelector(".tempoValue");
const click1 = new Audio('click1.wav');

// Set an initial BPM value
let bpm = 120; // Default BPM

// Initialize the metronome
const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });

// Update BPM when slider is adjusted
tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;  // Update bpm from the slider
    tempoDisplay.textContent = bpm;  // Update tempo display
    metronome.timeInterval = 60000 / bpm;  // Update the metronome interval based on BPM
    metronome.stop();  // Stop the previous timer
    metronome.start();  // Start the timer again with the new interval
});

// Function to play the click sound
function playClick() {
    click1.play();
}

// Start the timer for the first time
metronome.start();
