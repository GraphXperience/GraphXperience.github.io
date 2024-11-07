import { setSize } from "../extensions/element-extensions";
import { validateMinMax } from "../utils";

const sizeEditor = document.getElementById('size-editor');

const sizeInput = document.getElementById('new-size-input');

const cancelButton = sizeEditor.querySelector('.modal-close');
const okButton = sizeEditor.querySelector('.modal-confirm');

class SizeEditor {
    constructor(cy) {
        this.cy = cy;

        sizeInput.addEventListener('change', (evt) => validateMinMax(evt, 1, 10));

        cancelButton.addEventListener('click', () => { sizeEditor.close(); });

        okButton.addEventListener('click', () => {
            const size = sizeInput.value;

            if (size < 1 || size > 10) {
                alert('O valor deve estar entre 1 e 10.');
                return;
            }

            this.elementsToEdit.forEach(element => {
                setSize(element, size);
            });

            this.cy.trigger('save');
            sizeEditor.close();
        });
    }

    open(elements) {
        this.elementsToEdit = elements;
        let title;

        if (this.elementsToEdit.size() === 1) {
            title = `Editar Tamanho ${this.elementsToEdit[0].isNode() ? 'do Nó' : 'da Aresta'}`;
            if (this.elementsToEdit[0].isNode()) {
                sizeInput.value = parseInt(this.elementsToEdit[0].style('width')) / 10;
            } else {
                sizeInput.value = parseInt(this.elementsToEdit[0].style('width'));
            }
        } else {
            title = `Editar Tamanho dos ${this.elementsToEdit.size()} Elementos`;
            sizeInput.value = 4;
        }

        sizeEditor.querySelector('h1').innerText = title;
        sizeEditor.showModal();
        sizeInput.focus();
        sizeInput.select();
    }
}

class SizeEditorSingleton {
    instance;

    getInstance(cy) {
        if (!this.instance) {
            this.instance = new SizeEditor(cy);
        }

        return this.instance;
    }
}

const singleton = new SizeEditorSingleton();

export function getSizeEditor(cy) { return singleton.getInstance(cy); }
