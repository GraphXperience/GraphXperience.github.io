import { RESET_COLOR } from '../../constants/colors';
import { getCytoscape, getEdgeHandles, getUndoRedo } from '../context';
import { setColor, setSize, setTag, setWeight } from '../extensions/element-extensions';
import { sleep } from '../utils';
import { hideAnimationConsole, showAnimationConsole } from './console';
import { getActions, getCurrentIndex, getEndIndex, getOriginalConfig, getOriginalElements, getPaused, getUndoRedoStack, resetAnimation, setActions, setCurrentIndex, setEndIndex, setOriginalConfig, setOriginalElements, setPaused, setUndoRedoStack } from './context';
import { blockAnimationButtons, closeAnimationPanel, setAnimationCounter, showAnimationPanel, showPlayIcon, unblockAnimationButtons } from './panel';
import { validate } from './validate';

const cy = getCytoscape(), ur = getUndoRedo(), eh = getEdgeHandles();

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
    showAnimationConsole();

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

    if (actions.some(action => action.type === 'print')) {
        document.getElementById('animation-console-toggle').click();
    }

    resetAnimation();

    setCurrentIndex(0);
    setEndIndex(actions.length);
    setActions(actions);
    setOriginalConfig(originalConfig);
    setOriginalElements(cy.elements().map(ele => ({
        id: ele.id(),
        weight: ele.data('weight'),
        overrideColor: ele.data('overrideColor'),
        overrideSize: ele.data('overrideSize'),
        tag: ele.data('tag'),
    })));
    setPaused(true);
    setUndoRedoStack({ undo: ur.getUndoStack(), redo: ur.getRedoStack() });

    showPlayIcon();
    setAnimationCounter(1, actions.length);

    ur.reset();
    cy.elements().forEach(element => setColor(element, RESET_COLOR));
    cy.elements().forEach(element => element.data('readonly', true));
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
        ...document.getElementsByClassName('icon-button'),
    ].forEach(element => element.disabled = true);
}

function hideSideBar() {
    if (document.getElementById('sidebar-menu-icon').textContent === 'menu_open') {
        document.getElementById('sidebar-menu-icon').textContent = 'menu';
        document.getElementById('side-bar').classList.toggle('active');
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
    hideAnimationConsole();
    enableButtons();

    const { undo, redo } = getUndoRedoStack();
    ur.reset(undo, redo);

    cy.data('animation', false);
    cy.elements().forEach(element => element.data('readonly', false));
}

function resetToOriginal() {
    const originalConfig = getOriginalConfig();
    cy.trigger('changeIsNodeWeighted', originalConfig.isNodeWeighted);
    cy.trigger('changeIsEdgeWeighted', originalConfig.isEdgeWeighted);

    const originalElements = getOriginalElements();
    for (const originalElement of originalElements) {
        const element = cy.$id(originalElement.id);

        setWeight(element, originalElement.weight);
        setColor(element, originalElement.overrideColor);
        setSize(element, originalElement.overrideSize);
        setTag(element, originalElement.tag?.toString());
    }
}

function enableButtons() {
    [
        ...document.getElementsByClassName('graph-button'),
        ...document.getElementsByClassName('side-bar-button'),
        ...document.getElementsByClassName('icon-button'),
    ].forEach(element => element.disabled = false);
}

async function goToStart() {
    const current = getCurrentIndex();
    const end = getEndIndex();
    const getUndoStackLength = ur.getUndoStack().length;
    for (let i = 0; i < getUndoStackLength; i++) {
        ur.undo();
        setAnimationCounter(current - i, end);
        await sleep(50);
    }

    setCurrentIndex(0);
    setAnimationCounter(0, end);
}

async function goToEnd() {
    const current = getCurrentIndex();
    const end = getEndIndex();
    const getRedoStackLength = ur.getRedoStack().length;
    for (let i = 0; i < getRedoStackLength; i++) {
        ur.redo();
        setAnimationCounter(current + i, end);
        await sleep(50);
    }

    setCurrentIndex(ur.getUndoStack().length);
    setAnimationCounter(getCurrentIndex(), getEndIndex());

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
        setAnimationCounter(currentIndex + 1, endIndex);
        setCurrentIndex(currentIndex + 1);
        return;
    }

    if (currentIndex >= endIndex) {
        setPaused(true);
        return;
    }
    setAnimationCounter(currentIndex + 1, endIndex);

    const action = actions[currentIndex];
    ur.do(action.type, {
        element: action.elementId ? cy.$id(action.elementId) : undefined,
        ...action
    });

    setCurrentIndex(currentIndex + 1);
}

function getCurrentDurationMultiplier() {
    const speed = cy.data('sliderSpeed');
    return speed != 0 ? 1 / speed : 0;
}

async function previousAnimation(currentIndex = getCurrentIndex()) {
    if (currentIndex === 0) {
        return;
    }

    ur.undo();
    setCurrentIndex(currentIndex - 1);
    setAnimationCounter(currentIndex - 1, getEndIndex());
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