import { setWeight } from '../extensions/element-extensions';
import { getGlobalConfig, setGlobalConfig } from '../extensions/local-storage-extensions';
import { validateMinMax } from '../utils';

const weightEditor = document.getElementById('weight-editor');

const newWeightInput = document.getElementById('new-weight-input');

const cancelButton = document.getElementById('weight-editor-cancel-button');
const okButton = document.getElementById('weight-editor-ok-button');


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
                    const globalConfig = getGlobalConfig();
                    setGlobalConfig({ isDirected: globalConfig.isDirected, isNodeWeighted: true, isEdgeWeighted: globalConfig.isEdgeWeighted });
                } else if (element.isEdge() && !this.cy.data('isEdgeWeighted')) {
                    this.cy.trigger('changeIsEdgeWeighted', true);
                    const globalConfig = getGlobalConfig();
                    setGlobalConfig({ isDirected: globalConfig.isDirected, isNodeWeighted: globalConfig.isNodeWeighted, isEdgeWeighted: true });
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
            newWeightInput.value = this.elementsToEdit[0].data('weight');
        } else {
            title = `Editar Peso dos ${this.elementsToEdit.size()} Elementos`;
        }

        weightEditor.querySelector('h3').innerText = title;
        weightEditor.style.display = 'block';
        newWeightInput.focus();
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
