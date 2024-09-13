import { setWeight } from '../extensions/element-extensions';
import { validateMinMax } from '../utils';

const weightEditor = document.getElementById('weight-editor');

const newWeightInput = document.getElementById('new-weight-input');

const cancelButton = document.getElementById('cancel-weight-button');
const okButton = document.getElementById('ok-weight-button');


class WeightEditor {
    constructor(cy) {
        this.cy = cy;

        newWeightInput.addEventListener('change', (evt) => validateMinMax(evt, 1, Infinity));

        cancelButton.addEventListener('click', () => { weightEditor.style.display = 'none'; });

        okButton.addEventListener('click', () => {
            const newValue = parseInt(newWeightInput.value);

            if (newValue < 1) {
                alert('O valor deve ser maior que 1');
                return;
            }

            this.elementsToEdit.forEach(element => {
                setWeight(element, newValue);

                if (element.isNode() && !this.cy.data('isNodeWeighted')) {
                    this.cy.trigger('changeIsNodeWeighted', true);
                } else if (!this.cy.data('isEdgeWeighted')) {
                    this.cy.trigger('changeIsEdgeWeighted', true);
                }
            });

            this.cy.trigger('save');
            weightEditor.style.display = 'none';
        });
    }

    open(elements) {
        this.elementsToEdit = elements;
        let title = '';

        if (this.elementsToEdit.size() === 1) {
            title = `Editar Peso ${this.elementsToEdit[0].isNode() ? 'do Nó' : 'da Aresta'}`;
        } else {
            title = `Editar Peso dos ${this.elementsToEdit.size()} Elementos`;
        }

        weightEditor.querySelector('h3').innerText = title;
        weightEditor.style.display = 'block';
    }
}

class WeightEditorSingleton {
    instance;

    getInstance(cy) {
        if (!this.instance) {
            this.instance = new WeightEditor(cy);
        }

        return this.instance;
    }
}

const singleton = new WeightEditorSingleton();

export function getWeightEditor(cy) { return singleton.getInstance(cy); }
