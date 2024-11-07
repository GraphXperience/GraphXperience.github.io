import { setWeight } from '../extensions/element-extensions';
import { getGlobalConfig, setGlobalConfig } from '../extensions/local-storage-extensions';
import { validateMinMax } from '../utils';

const weightEditor = document.getElementById('weight-editor');

const newWeightInput = document.getElementById('new-weight-input');

const cancelButton = weightEditor.querySelector('.modal-close');
const okButton = weightEditor.querySelector('.modal-confirm');


class WeightEditor {
    constructor(cy) {
        this.cy = cy;

        newWeightInput.addEventListener('change', (evt) => validateMinMax(evt, 1, Infinity));

        cancelButton.addEventListener('click', () => { weightEditor.close(); });

        okButton.addEventListener('click', () => {
            const newValue = parseInt(newWeightInput.value);

            if (newValue < 1) {
                alert('O valor deve ser maior que 0');
                return;
            }

            this.elementsToEdit.forEach(element => {
                setWeight(element, newValue);

                if (element.isNode() && !this.cy.data('isNodeWeighted')) {
                    this.cy.elements('node[^weight]').forEach(ele => setWeight(ele, 1));
                    this.cy.trigger('changeIsNodeWeighted', true);
                    setGlobalConfig({
                        isDirected: this.cy.data('isDirected'),
                        isNodeWeighted: true,
                        isEdgeWeighted: this.cy.data('isNodeWeighted'),
                    });
                } else if (element.isEdge() && !this.cy.data('isEdgeWeighted')) {
                    this.cy.elements('edge[^weight]').forEach(ele => setWeight(ele, 1));
                    this.cy.trigger('changeIsEdgeWeighted', true);
                    setGlobalConfig({
                        isDirected: this.cy.data('isDirected'),
                        isNodeWeighted: this.cy.data('isNodeWeighted'),
                        isEdgeWeighted: true
                    });
                }
            });

            this.cy.trigger('save');
            weightEditor.close();
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
            newWeightInput.value = 1;
        }

        weightEditor.querySelector('h1').innerText = title;
        weightEditor.showModal();
        newWeightInput.focus();
        newWeightInput.select();
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
