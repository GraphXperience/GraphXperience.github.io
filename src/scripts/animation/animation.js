import { RESET_COLOR } from '../../constants/colors';
import { getCytoscape, getUndoRedo, getEdgeHandles } from '../context';
import { setColor, setTag, setWeight } from '../extensions/element-extensions';
import { sleep } from '../utils';
import { getCurrentIndex, getEndIndex, getActions, getOriginalElements, getPaused, resetAnimation, setCurrentIndex, setEndIndex, setActions, setOriginalElements, setPaused, setUndoRedoStack, getUndoRedoStack, getOriginalConfig, setOriginalConfig } from './context';
import { showAnimationPanel, closeAnimationPanel, showPlayIcon, blockAnimationButtons, unblockAnimationButtons } from './panel';
import { validate } from './validate';

var cy = getCytoscape(), ur = getUndoRedo(), eh = getEdgeHandles();

async function startAnimation(actions) {
    const errors = validate(actions);
    if (errors.length > 0) {
        errors.forEach(err => console.error(err));
        return;
    }

    prepare(actions);

    disableButtons();
    hideSideBar();
    showAnimationPanel();

    cy.data('animation', true);
}

function prepare(actions) {
    const originalConfig = {
        isNodeWeighted: cy.data('isNodeWeighted'),
        isEdgeWeighted: cy.data('isEdgeWeighted')
    };
    if (actions.some(action => action.weight && cy.$id(action.elementId).isNode())) {
        cy.trigger('changeIsNodeWeighted', true);
    }
    if (actions.some(action => action.weight && cy.$id(action.elementId).isEdge())) {
        cy.trigger('changeIsEdgeWeighted', true);
    }

    resetAnimation();

    setCurrentIndex(0);
    setEndIndex(actions.length);
    setActions(actions);
    setOriginalConfig(originalConfig);
    setOriginalElements(cy.elements().map(ele => ({
        id: ele.id(),
        color: ele.isNode() ? ele.style('background-color') : ele.style('line-color'),
        weight: ele.data('weight'),
        size: ele.style('width'),
        tag: ele.data('tag'),
    })));
    setPaused(true);
    setUndoRedoStack({ undo: ur.getUndoStack(), redo: ur.getRedoStack() });

    showPlayIcon();

    ur.reset();
    cy.elements().forEach(element => setColor(element, RESET_COLOR));
}

function disableButtons() {
    const drawModeButton = document.getElementById('draw-mode-button');
    if (drawModeButton.classList.contains('active')) {
        drawModeButton.classList.toggle('active');
        eh.disableDrawMode();
    }

    [
        ...document.getElementsByClassName('graph-button'),
        ...document.getElementsByClassName('side-bar-button'),
        drawModeButton
    ].forEach(element => element.disabled = true);

    hamburger.classList.toggle('disabled');
}

function hideSideBar() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('side-bar');

    if (sidebar.classList.contains('active')) {
        sidebar.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

function pauseAnimation() {
    setPaused(true);
}

async function resumeAnimation() {
    setPaused(false);

    await play(getActions());

    endAnimation();
}

function endAnimation() {
    setPaused(true);
    showPlayIcon();
}

function closeAnimation() {
    resetToOriginal();
    closeAnimationPanel();
    enableButtons();

    document.getElementById('animation-console').replaceChildren();

    const { undo, redo } = getUndoRedoStack();
    ur.reset(undo, redo);

    cy.data('animation', false);
}

function enableButtons() {
    [
        ...document.getElementsByClassName('graph-button'),
        ...document.getElementsByClassName('side-bar-button'),
        document.getElementById('draw-mode-button')
    ].forEach(element => element.disabled = false);

    document.getElementById('hamburger').classList.toggle('disabled');
}

function resetToOriginal() {
    const originalConfig = getOriginalConfig();
    cy.trigger('changeIsNodeWeighted', originalConfig.isNodeWeighted);
    cy.trigger('changeIsEdgeWeighted', originalConfig.isEdgeWeighted);

    const originalElements = getOriginalElements();
    for (const originalElement of originalElements) {
        const element = cy.$id(originalElement.id);

        setColor(element, originalElement.color);
        setWeight(element, originalElement.weight);
        element.style('width', originalElement.size);
        setTag(element, originalElement.tag?.toString());

        if (element.isNode()) {
            element.style('height', originalElement.size);
        }
    }
}

async function goToStart() {
    while (ur.getUndoStack().length > 0) {
        ur.undo();
        await sleep(50);
    }

    setCurrentIndex(0);
}

async function goToEnd() {
    while (ur.getRedoStack().length > 0) {
        ur.redo();
        await sleep(50);
    }

    setCurrentIndex(ur.getUndoStack().length);

    const endIndex = getEndIndex();
    while (getCurrentIndex() < endIndex) {
        const actions = getActions();
        nextAnimation(actions);
        await sleep(50);
    }
}

async function play(actions) {
    if (getPaused()) {
        return;
    }

    blockAnimationButtons();

    nextAnimation(actions);
    await sleep(300 * getCurrentDurationMultiplier());

    unblockAnimationButtons();

    await play(actions);
}

function nextAnimation(actions = getActions()) {
    const currentIndex = getCurrentIndex(), endIndex = getEndIndex();

    if (ur.getRedoStack().length > 0) {
        ur.redo();
        setCurrentIndex(currentIndex + 1);
        return;
    }

    if (currentIndex >= endIndex) {
        setPaused(true);
        return;
    }

    const action = actions[currentIndex];
    ur.do(action.type, {
        element: action.elementId ? cy.$id(action.elementId) : undefined,
        ...action
    });

    setCurrentIndex(currentIndex + 1);
}

function getCurrentDurationMultiplier() {
    const speed = cy.data('sliderSpeed');
    const durationMultiplier = speed != 0 ? 1 / speed : 0;

    return durationMultiplier;
}

async function previousAnimation(currentIndex = getCurrentIndex()) {
    if (currentIndex === 0) {
        return;
    }

    ur.undo();
    setCurrentIndex(currentIndex - 1);
}

export {
    closeAnimation,
    endAnimation,
    goToStart,
    goToEnd,
    nextAnimation,
    pauseAnimation,
    previousAnimation,
    resumeAnimation,
    startAnimation,
}