import { getCytoscape } from "../context";
import {
    closeAnimation,
    endAnimation,
    nextAnimation,
    pauseAnimation,
    previousAnimation,
    resumeAnimation,
    startAnimation,
    goToStart,
    goToEnd
} from "./animation";
import { showPlayIcon, showPauseIcon, blockAnimationButtons, unblockAnimationButtons } from "./panel";

var cy = getCytoscape();

function setupAnimationButtons() {
    const closeButton = document.getElementById('ac-close-button');
    closeButton.addEventListener('click', onCloseClick);

    const goToBeginButton = document.getElementById('ac-go-to-begin-button');
    goToBeginButton.addEventListener('click', onGoToBeginClick);

    const previousButton = document.getElementById('ac-previous-button');
    previousButton.addEventListener('click', onPreviousClick);

    const playPauseButton = document.getElementById('ac-play-pause-button');
    playPauseButton.addEventListener('click', onPlayPauseClick);

    const nextButton = document.getElementById('ac-next-button');
    nextButton.addEventListener('click', onNextClick);

    const goToEndButton = document.getElementById('ac-go-to-end-button');
    goToEndButton.addEventListener('click', onGoToEndClick);

    const slider = document.getElementById('ac-slider');
    slider.addEventListener('input', onSliderInput);
}

function onCloseClick(event) {
    endAnimation();
    closeAnimation();
}

async function onGoToBeginClick(event) {
    blockAnimationButtons(true);
    await goToStart();
    unblockAnimationButtons(true);
}

async function onPreviousClick(event) {
    await previousAnimation();
}

async function onPlayPauseClick(event) {
    const playPauseButtonImg = document.getElementById('ac-play-pause-img');

    if (playPauseButtonImg.textContent === 'play_circle') {
        showPauseIcon();
        await resumeAnimation();
        return;
    }

    showPlayIcon();
    pauseAnimation();
}

function onNextClick(event) {
    nextAnimation();
}

async function onGoToEndClick(event) {
    blockAnimationButtons(true);
    await goToEnd();
    unblockAnimationButtons(true);
}

function onSliderInput(event) {
    const speedDisplay = document.getElementById('ac-slider-speed-display');
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

    const speedIndex = parseInt(this.value);
    const speed = speeds[speedIndex];
    speedDisplay.textContent = `${speed.toFixed(2)}x`;
    cy.data('sliderSpeed', speed);
}

export {
    setupAnimationButtons,
    startAnimation
}