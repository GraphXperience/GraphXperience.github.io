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

const goToBeginButton = document.getElementById('go-to-begin-animation-button');
const previousButton = document.getElementById('previous-animation-button');
const nextButton = document.getElementById('next-animation-button');
const goToEndButton = document.getElementById('go-to-end-animation-button');

function blockAnimationButtons() {
    goToBeginButton.disabled = true;
    previousButton.disabled = true;
    nextButton.disabled = true;
    goToEndButton.disabled = true;
}

function unblockAnimationButtons() {
    goToBeginButton.disabled = false;
    previousButton.disabled = false;
    nextButton.disabled = false;
    goToEndButton.disabled = false;
}

function showPlayIcon() {
    const playPauseButtonImg = document.getElementById('play-pause-button-img');

    playPauseButtonImg.classList.remove('pause');
    playPauseButtonImg.classList.add('play');
    playPauseButtonImg.src = './assets/play.svg';
}

function showPauseIcon() {
    const playPauseButtonImg = document.getElementById('play-pause-button-img');

    playPauseButtonImg.classList.remove('play');
    playPauseButtonImg.classList.add('pause');
    playPauseButtonImg.src = './assets/pause.svg';
}

export {
    showAnimationPanel,
    closeAnimationPanel,
    blockAnimationButtons,
    unblockAnimationButtons,
    showPlayIcon,
    showPauseIcon
};