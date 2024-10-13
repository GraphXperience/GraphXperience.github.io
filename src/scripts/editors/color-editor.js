import { RESET_COLOR } from "../../constants/colors";
import { setColor } from "../extensions/element-extensions";
import { rgbStrToHex } from "../utils";

const colorEditor = document.getElementById('color-editor');

const cancelButton = document.getElementById('cancel-color-button');
const okButton = document.getElementById('ok-color-button');

class ColorEditor {
    constructor(cy) {
        this.cy = cy;

        cancelButton.addEventListener('click', () => { colorEditor.style.display = 'none'; });

        okButton.addEventListener('click', () => {
            const newColor = cy.data('alwan-ce').getColor().hex;

            this.elementsToEdit.forEach(element => setColor(element, newColor));

            this.cy.trigger('save');
            colorEditor.style.display = 'none';
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

        colorEditor.querySelector('h3').innerText = title;
        colorEditor.style.display = 'block';
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
