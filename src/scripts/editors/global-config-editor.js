import { RESET_COLOR } from "../../constants/colors";
import { setGlobalConfig, setGlobalStyle } from '../extensions/local-storage-extensions';
import { rgbStrToHex, validateMinMax } from "../utils";

const configEditor = document.getElementById('config-editor');

const colorInputFactory = () => document.getElementById('config-editor-color-input');
const sizeInput = document.getElementById('config-editor-node-size-input');
const edgeThicknessInput = document.getElementById('config-editor-edge-thickness-input');
const directInput = document.getElementById('config-editor-direct-input');
const nodeWeightedInput = document.getElementById('config-editor-node-weighted-input');
const edgeWeightedInput = document.getElementById('config-editor-edge-weighted-input');
const cancelButton = document.getElementById('config-editor-cancel-button');
const okButton = document.getElementById('config-editor-ok-button');

class GlobalConfigEditor {
    constructor(cy) {
        this.cy = cy;

        sizeInput.addEventListener('change', (evt) => validateMinMax(evt, 1, 10));
        edgeThicknessInput.addEventListener('change', (evt) => validateMinMax(evt, 1, 10));

        cancelButton.addEventListener('click', () => { configEditor.style.display = 'none'; });

        okButton.addEventListener('click', () => {
            if (sizeInput.value < 1 || sizeInput.value > 10) {
                alert('Tamanho do nó deve estar entre 1 e 10.');
                return;
            }

            if (edgeThicknessInput.value < 1 || edgeThicknessInput.value > 10) {
                alert('Espessura da aresta deve estar entre 1 e 10.');
                return;
            }

            const colorInput = colorInputFactory();

            const styles = this.cy.style().json();
            const nodeStyle = styles.find(x => x.selector === 'node');
            nodeStyle.style['background-color'] = rgbStrToHex(colorInput.style.getPropertyValue("--color")) ?? RESET_COLOR;
            nodeStyle.style['height'] = sizeInput.value * 10;
            nodeStyle.style['width'] = sizeInput.value * 10;

            const edgeStyle = styles.find(x => x.selector === 'edge');
            edgeStyle.style['width'] = edgeThicknessInput.value;

            this.cy.style().fromJson(styles);

            setGlobalStyle(styles);
            setGlobalConfig({
                isDirected: directInput.checked,
                isNodeWeighted: nodeWeightedInput.checked,
                isEdgeWeighted: edgeWeightedInput.checked
            });

            this.cy.trigger('changeIsDirected', directInput.checked);
            this.cy.trigger('changeIsNodeWeighted', nodeWeightedInput.checked);
            this.cy.trigger('changeIsEdgeWeighted', edgeWeightedInput.checked);
            this.cy.trigger('save');

            configEditor.style.display = 'none';
        });
    }

    open() {
        const styles = this.cy.style().json();
        const nodeStyle = styles.find(style => style.selector === 'node');
        if (nodeStyle) {
            const colorInput = colorInputFactory();
            colorInput.style.setProperty('--color', rgbStrToHex(nodeStyle.style['background-color']) ?? RESET_COLOR);
            sizeInput.value = parseInt(nodeStyle.style['width']) / 10;
        }

        const edgeStyle = styles.find(style => style.selector === 'edge');
        if (edgeStyle) {
            edgeThicknessInput.value = parseInt(edgeStyle.style['width']);
        }

        directInput.checked = this.cy.data('isDirected');
        nodeWeightedInput.checked = this.cy.data('isNodeWeighted');
        edgeWeightedInput.checked = this.cy.data('isEdgeWeighted');

        configEditor.style.display = 'block';
    }
}

class GlobalConfigEditorSingleton {
    instance;

    getInstance(cy) {
        if (!this.instance) {
            this.instance = new GlobalConfigEditor(cy);
        }

        return this.instance;
    }
}

const singleton = new GlobalConfigEditorSingleton();

export function getGlobalConfigEditor(cy) { return singleton.getInstance(cy); }
