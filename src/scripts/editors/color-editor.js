import { RESET_COLOR } from "../../constants/colors";
import { setColor } from "../extensions/element-extensions";

const colorEditor = document.getElementById('color-editor');

const cancelButton = colorEditor.querySelector('.modal-close');
const okButton = colorEditor.querySelector('.modal-confirm');

class ColorEditor {
    constructor(cy) {
        this.cy = cy;

        cancelButton.addEventListener('click', () => { colorEditor.close(); });

        okButton.addEventListener('click', () => {
            const newColor = cy.data('alwan-ce').getColor().rgb;

            this.elementsToEdit.forEach(element => setColor(element, newColor));

            this.cy.trigger('save');
            colorEditor.close();
        });
    }

    open(elements) {
        this.elementsToEdit = elements;
        let title = '';

        if (this.elementsToEdit.size() === 1) {
            title = `Editar Cor ${this.elementsToEdit[0].isNode() ? 'do Nó' : 'da Aresta'}`;
            if (this.elementsToEdit[0].isNode()) {
                this.cy.data('alwan-ce').setColor(this.elementsToEdit[0].style('background-color'));
            } else {
                this.cy.data('alwan-ce').setColor(this.elementsToEdit[0].style('line-color'));
            }
        } else {
            title = `Editar Cor dos ${this.elementsToEdit.size()} Elementos`;
            this.cy.data('alwan-ce').setColor(RESET_COLOR);
        }

        colorEditor.querySelector('h1').innerText = title;
        colorEditor.showModal();
    }
}

class ColorEditorSingleton {
    instance;

    getInstance(cy) {
        if (!this.instance) {
            this.instance = new ColorEditor(cy);
        }

        return this.instance;
    }
}

const singleton = new ColorEditorSingleton();

export function getColorEditor(cy) { return singleton.getInstance(cy); }
