function showAnimationPanel() {
    const animationControlPanel = document.getElementById('animation-control');

    if (!animationControlPanel.classList.contains('active')) {
        animationControlPanel.classList.toggle('active');
    }
}

function closeAnimationPanel() {
    const animationControlPanel = document.getElementById('animation-control');

    if (animationControlPanel.classList.contains('active')) {
        animationControlPanel.classList.toggle('active');
    }
}

const closeButton = document.getElementById('ac-close-button');
const goToBeginButton = document.getElementById('ac-go-to-begin-button');
const previousButton = document.getElementById('ac-previous-button');
const playPauseButton = document.getElementById('ac-play-pause-button');
const nextButton = document.getElementById('ac-next-button');
const goToEndButton = document.getElementById('ac-go-to-end-button');

function blockAnimationButtons(includePlayPause = false) {
    closeButton.disabled = true;
    goToBeginButton.disabled = true;
    previousButton.disabled = true;
    if (includePlayPause) {
        playPauseButton.disabled = true;
    }
    nextButton.disabled = true;
    goToEndButton.disabled = true;
}

function unblockAnimationButtons(includePlayPause = false) {
    closeButton.disabled = false;
    goToBeginButton.disabled = false;
    previousButton.disabled = false;
    if (includePlayPause) {
        playPauseButton.disabled = false;
    }
    nextButton.disabled = false;
    goToEndButton.disabled = false;
}

const animationCounter = document.getElementById('animation-counter');
function setAnimationCounter(step, total) {
    animationCounter.innerText = `${step} / ${total}`;
}

function showPlayIcon() {
    const playPauseButtonIcon = document.getElementById('ac-play-pause-img');
    playPauseButtonIcon.textContent = 'play_circle';
}

function showPauseIcon() {
    const playPauseButtonIcon = document.getElementById('ac-play-pause-img');
    playPauseButtonIcon.textContent = 'pause_circle';
}

export {
    showAnimationPanel,
    closeAnimationPanel,
    blockAnimationButtons,
    unblockAnimationButtons,
    setAnimationCounter,
    showPlayIcon,
    showPauseIcon
};