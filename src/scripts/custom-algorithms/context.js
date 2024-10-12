let instance = undefined;
let contextState = {
    customAlgorithms: JSON.parse(sessionStorage.getItem('customAlgorithms')) ?? [],
    currentFile: undefined,
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
}

const context = Object.freeze(new Context());

export function getCustomAlgorithms() { return context.getValue('customAlgorithms'); }
export function setCustomAlgorithms(value) {
    context.setValue('customAlgorithms', value);
    sessionStorage.setItem('customAlgorithms', JSON.stringify(value));
}
export function getCurrentFile() { return context.getValue('currentFile'); }
export function setCurrentFile(value) { return context.setValue('currentFile', value); }
