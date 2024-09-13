let instance = undefined;
let contextState = {
    currentIndex: undefined,
    endIndex: undefined,
    actions: undefined,
    originalElements: undefined,
    paused: false,
    undoRedoStack: undefined
};

class Context {
    constructor() {
        if (instance !== undefined) {
            throw new Error('There\'s already an instance of Context.');
        }

        instance = this;
    }

    getValue(key) {
        return contextState[key];
    }

    setValue(key, value) {
        contextState[key] = value;
    }

    reset() {
        contextState = {
            currentIndex: undefined,
            endIndex: undefined,
            actions: undefined,
            originalElements: undefined,
            paused: false,
            undoRedoStack: undefined
        };
    }
}

const context = Object.freeze(new Context());

export function getCurrentIndex() { return context.getValue('currentIndex'); }
export function getEndIndex() { return context.getValue('endIndex'); }
export function getActions() { return context.getValue('actions'); }
export function getOriginalElements() { return context.getValue('originalElements'); }
export function getPaused() { return context.getValue('paused'); }
export function getUndoRedoStack() { return context.getValue('undoRedoStack'); }
export const resetAnimation = context.reset;
export function setCurrentIndex(value) { return context.setValue('currentIndex', value); }
export function setEndIndex(value) { return context.setValue('endIndex', value); }
export function setActions(value) { return context.setValue('actions', value); }
export function setOriginalElements(value) { return context.setValue('originalElements', value); }
export function setPaused(value) { return context.setValue('paused', value); }
export function setUndoRedoStack(value) { return context.setValue('undoRedoStack', value); }