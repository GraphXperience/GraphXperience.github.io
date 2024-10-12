import { setTag } from '../extensions/element-extensions';

const tagEditor = document.getElementById("tag-editor");

const tagInput = document.getElementById('new-tag-input');

const cancelButton = document.getElementById('tag-editor-cancel-button');
const okButton = document.getElementById('tag-editor-ok-button');

class TagEditor {
    constructor(cy) {
        this.cy = cy;

        cancelButton.addEventListener('click', () => { tagEditor.style.display = 'none'; });

        okButton.addEventListener('click', () => {
            this.elementsToEdit.forEach(element => {
                setTag(element, tagInput.value);
            });

            this.cy.trigger('save');
            tagEditor.style.display = 'none';
        });
    }

    open(elements) {
        this.elementsToEdit = elements;
        let title = '';

        if (this.elementsToEdit.size() === 1) {
            title = `Editar Tag ${this.elementsToEdit[0].isNode() ? 'do Nó' : 'da Aresta'}`;
        } else {
            title = `Editar Tag dos ${this.elementsToEdit.size()} Elementos`;
        }

        tagEditor.querySelector('h3').innerText = title;
        tagEditor.style.display = "block";
        tagInput.focus();
    }
}

class TagEditorSingleton {
    instance;

    getInstance(cy) {
        if (!this.instance) {
            this.instance = new TagEditor(cy);
        }

        return this.instance;
    }
}

const singleton = new TagEditorSingleton();

export function getTagEditor(cy) { return singleton.getInstance(cy); }
