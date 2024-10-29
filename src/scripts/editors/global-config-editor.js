import { resetCytoscape } from "../context";
import { resetLocalStorage, setGlobalConfig, setGlobalStyle } from '../extensions/local-storage-extensions';
import { clear, removeBidirectionalEdges } from "../graph";
import { getTagColor, setTagColor, validateMinMax } from "../utils";
import { openPopup } from '../popup';

const configEditor = document.getElementById('config-editor');
const sizeInput = document.getElementById('config-editor-node-size-input');
const edgeThicknessInput = document.getElementById('config-editor-edge-thickness-input');
const directInput = document.getElementById('config-editor-direct-input');
const nodeWeightedInput = document.getElementById('config-editor-node-weighted-input');
const edgeWeightedInput = document.getElementById('config-editor-edge-weighted-input');
const resetButton = document.getElementById('config-editor-reset-button');
const cancelButton = document.getElementById('config-editor-cancel-button');
const okButton = document.getElementById('config-editor-ok-button');

class GlobalConfigEditor {
    constructor(cy) {
        this.cy = cy;

        sizeInput.addEventListener('change', (evt) => validateMinMax(evt, 1, 10));
        edgeThicknessInput.addEventListener('change', (evt) => validateMinMax(evt, 1, 10));

        resetButton.addEventListener('click', () => {
            resetLocalStorage();
            clear();
            resetCytoscape();

            configEditor.style.display = 'none';
        });

        cancelButton.addEventListener('click', () => { configEditor.style.display = 'none'; });

        okButton.addEventListener('click', () => {
            if (cy.data('isDirected') !== directInput.checked) {
                const pairs = new Set();
                for (const edge of cy.edges()) {
                    const reverse_edge = `${edge.target().id()}${edge.source().id()}`;
                    if (pairs.has(reverse_edge)) {
                        openPopup('Para tornar um grafo direcionado em um não direcionado, remova as arestas bidirecionais que possuem peso.');
                        return;
                    }
                    pairs.add(`${edge.source().id()}${edge.target().id()}`);
                }
            }

            if (sizeInput.value < 1 || sizeInput.value > 10) {
                alert('Tamanho do nó deve estar entre 1 e 10.');
                return;
            }

            if (edgeThicknessInput.value < 1 || edgeThicknessInput.value > 10) {
                alert('Espessura da aresta deve estar entre 1 e 10.');
                return;
            }

            const styles = {
                cy: this.cy.style().json(),
                tag: this.cy.data('alwan-ce-tag').getColor().hex
            };
            const nodeStyle = styles.cy.find(x => x.selector === 'node');
            nodeStyle.style['background-color'] = this.cy.data('alwan-ce-node').getColor().rgb;
            nodeStyle.style['height'] = sizeInput.value * 10;
            nodeStyle.style['width'] = sizeInput.value * 10;

            const edgeStyle = styles.cy.find(x => x.selector === 'edge');
            edgeStyle.style['line-color'] = this.cy.data('alwan-ce-edge').getColor().rgb;
            edgeStyle.style['target-arrow-color'] = this.cy.data('alwan-ce-edge').getColor().rgb;
            edgeStyle.style['width'] = edgeThicknessInput.value;

            this.cy.style().fromJson(styles.cy);

            setTagColor(styles.tag)

            setGlobalStyle(styles);
            setGlobalConfig({
                isDirected: directInput.checked,
                isNodeWeighted: nodeWeightedInput.checked,
                isEdgeWeighted: edgeWeightedInput.checked
            });

            this.cy.trigger('changeIsDirected', directInput.checked);
            this.cy.trigger('changeIsNodeWeighted', nodeWeightedInput.checked);
            this.cy.trigger('changeIsEdgeWeighted', edgeWeightedInput.checked);

            if (!nodeWeightedInput.checked) {
                this.cy.nodes().forEach(ele => ele.data('weight', 1));
            }
            if (!edgeWeightedInput.checked) {
                this.cy.edges().forEach(ele => ele.data('weight', 1));
            }

            this.cy.trigger('save');

            configEditor.style.display = 'none';
        });
    }

    open() {
        const styles = this.cy.style().json();
        const nodeStyle = styles.find(style => style.selector === 'node');
        if (nodeStyle) {
            this.cy.data('alwan-ce-node').setColor(nodeStyle.style['background-color']);
            sizeInput.value = parseInt(nodeStyle.style['width']) / 10;
        }


        const edgeStyle = styles.find(style => style.selector === 'edge');
        if (edgeStyle) {
            this.cy.data('alwan-ce-edge').setColor(edgeStyle.style['line-color']);
            edgeThicknessInput.value = parseInt(edgeStyle.style['width']);
        }

        const tagColor = getTagColor();
        this.cy.data('alwan-ce-tag').setColor(tagColor);

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
