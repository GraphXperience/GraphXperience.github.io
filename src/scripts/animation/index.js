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
import { showPlayIcon, showPauseIcon } from "./panel";

var cy = getCytoscape();

function setupAnimationButtons() {
    const closeButton = document.getElementById('close-animation-button');
    closeButton.addEventListener('click', onCloseClick);

    const goToBeginButton = document.getElementById('go-to-begin-animation-button');
    goToBeginButton.addEventListener('click', onGoToBeginClick);

    const previousButton = document.getElementById('previous-animation-button');
    previousButton.addEventListener('click', onPreviousClick);

    const playPauseButton = document.getElementById('play-pause-animation-button');
    playPauseButton.addEventListener('click', onPlayPauseClick);

    const nextButton = document.getElementById('next-animation-button');
    nextButton.addEventListener('click', onNextClick);

    const goToEndButton = document.getElementById('go-to-end-animation-button');
    goToEndButton.addEventListener('click', onGoToEndClick);

    const slider = document.getElementById('animation-control-slider');
    slider.addEventListener('input', onSliderInput);
}

function onCloseClick(event) {
    endAnimation();
    closeAnimation();
}

async function onGoToBeginClick(event) {
    await goToStart();
}

async function onPreviousClick(event) {
    await previousAnimation();
}

async function onPlayPauseClick(event) {
    const playPauseButtonImg = document.getElementById('play-pause-button-img');

    if (playPauseButtonImg.classList.contains('play')) {
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
    await goToEnd();
}

function onSliderInput(event) {
    const speedDisplay = document.getElementById('animation-control-slider-speed-display');
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