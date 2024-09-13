import { setSize } from "../extensions/element-extensions";
import { validateMinMax } from "../utils";

const sizeEditor = document.getElementById('size-editor');

const sizeInput = document.getElementById('new-size-input');

const cancelButton = document.getElementById('cancel-size-button');
const okButton = document.getElementById('ok-size-button');

class SizeEditor {
    constructor(cy) {
        this.cy = cy;

        sizeInput.addEventListener('change', (evt) => validateMinMax(evt, 1, 10));

        cancelButton.addEventListener('click', () => { sizeEditor.style.display = 'none'; });

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
            sizeEditor.style.display = 'none';
        });
    }

    open(elements) {
        this.elementsToEdit = elements;
        let title = '';

        if (this.elementsToEdit.size() === 1) {
            title = `Editar Tamanho ${this.elementsToEdit[0].isNode() ? 'do Nó' : 'da Aresta'}`;
        } else {
            title = `Editar Tamanho dos ${this.elementsToEdit.size()} Elementos`;
        }

        sizeEditor.querySelector('h3').innerText = title;
        sizeEditor.style.display = 'block';
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
