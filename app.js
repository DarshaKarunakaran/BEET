var metronome = new Metronome();
var tempo = document.getElementById('tempo');
tempo.textContent = metronome.tempo;

var playPauseIcon = document.getElementById('play-pause-icon');

var playButton = document.getElementById('play-button');
playButton.addEventListener('click', function() {
    metronome.startStop();

    if (metronome.isRunning) {
        playPauseIcon.className = 'pause';
    }
    else {
        playPauseIcon.className = 'play';
    }

});

var button = document.getElementsByClassName('beat-box');
        button.addEventListener('click',
            () => {
                button.style.backgroundColor = 
                    "green";
            });

var tempoChangeButtons = document.getElementsByClassName('tempo-change');
for (var i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function() {
        metronome.tempo += parseInt(this.dataset.change);
        tempo.textContent = metronome.tempo;
    });
}
function changeColor(button) {
    const colors = ['#ff9aa2', 'pink'];

    let colorIndex = button.dataset.colorIndex ? parseInt(button.dataset.colorIndex) : 0;

    colorIndex = (colorIndex + 1) % colors.length;

    button.style.background = colors[colorIndex];

    button.dataset.colorIndex = colorIndex;
}
