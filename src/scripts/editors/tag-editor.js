import { setTag } from '../extensions/element-extensions';

const tagEditor = document.getElementById("tag-editor");

const editorTitle = tagEditor.querySelector('.modal-title');
const tagInput = document.getElementById('tag-input');
const cancelButton = tagEditor.querySelector('.modal-close');
const okButton = tagEditor.querySelector('.modal-confirm');

class TagEditor {
    constructor(cy) {
        this.cy = cy;

        cancelButton.addEventListener('click', () => { tagEditor.close(); });

        okButton.addEventListener('click', () => {
            this.elementsToEdit.forEach(element => {
                setTag(element, tagInput.value);
            });

            this.cy.trigger('save');
            tagEditor.close();
        });
    }

    open(elements) {
        this.elementsToEdit = elements;
        let title;

        if (this.elementsToEdit.size() === 1) {
            title = `Editar Tag ${this.elementsToEdit[0].isNode() ? 'do Nó' : 'da Aresta'}`;
            tagInput.value = this.elementsToEdit[0].data('tag') ?? '';
        } else {
            title = `Editar Tag dos ${this.elementsToEdit.size()} Elementos`;
            tagInput.value = '';
        }

        editorTitle.innerText = title;
        tagEditor.showModal();
        tagInput.focus();
        tagInput.select();
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
