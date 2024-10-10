import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import clipboard from 'cytoscape-clipboard';
import edgehandles from 'cytoscape-edgehandles';
import undoRedo from 'cytoscape-undo-redo';
import dagre from 'cytoscape-dagre';
import jquery from 'jquery';
import { setupAlwan, setupClipboard, setupCxtMenu, setupEdgehandles, setupUndoRedo, setupPopper } from './cytoscape-extensions';
import { buildStylesheet, getBatchFromJson, createGraphJson } from './extensions/cytoscape-extensions';
import { setTag } from './extensions/element-extensions';
import { getGlobalConfig, getGlobalStyle } from './extensions/local-storage-extensions';
import { getTagEditor } from './editors/tag-editor';

let instance = undefined;
let contextState = {
    clipboard: undefined,
    cytoscape: undefined,
    edgehandles: undefined,
    undoRedo: undefined,
};

class Context {
    constructor() {
        if (instance !== undefined) {
            throw new Error('There\'s already an instance of Context.');
        }

        cytoscape.use(edgehandles);
        cytoscape.use(cxtmenu);
        cytoscape.use(dagre);
        undoRedo(cytoscape);
        clipboard(cytoscape, jquery);

        setupAlwan();
        setupPopper();

        const globalConfig = getGlobalConfig();
        const globalStyle = getGlobalStyle();

        contextState.cytoscape = cytoscape({
            container: document.getElementById('cy'),
            zoomingEnabled: false,
            panningEnabled: false,
            boxSelectionEnabled: true,
            style: buildStylesheet(globalConfig, globalStyle),
            data: {
                animation: false,
                elementToEdit: undefined,
                isDirected: globalConfig?.isDirected ?? true,
                isEdgeWeighted: globalConfig?.isEdgeWeighted ?? false,
                isNodeWeighted: globalConfig?.isNodeWeighted ?? false,
                selectedNodeIds: new Set(),
                sliderSpeed: 1,
            }
        });

        setupCxtMenu(contextState.cytoscape);
        contextState.edgehandles = setupEdgehandles(contextState.cytoscape);
        contextState.undoRedo = setupUndoRedo(contextState.cytoscape);
        contextState.clipboard = setupClipboard(contextState.cytoscape);

        const graphData = sessionStorage.getItem('graph');
        if (graphData) {
            this.loadGraphData(graphData);
        }

        this.registerEvents();

        instance = this;
    }

    getValue(key) {
        return contextState[key];
    }

    registerEvents() {
        contextState.cytoscape.on('changeIsDirected', (evt, val) => {
            contextState.cytoscape.data('isDirected', val);

            const styles = contextState.cytoscape.style().json();
            styles.find(s => s.selector === 'edge').style['target-arrow-shape'] = val ? 'triangle' : 'none';
            contextState.cytoscape.style().fromJson(styles);
        });

        contextState.cytoscape.on('changeIsNodeWeighted', (evt, val) => {
            contextState.cytoscape.data('isNodeWeighted', val);

            const styles = contextState.cytoscape.style().json();
            styles.find(s => s.selector === 'node').style['label'] = val ? 'data(weight)' : '';
            contextState.cytoscape.style().fromJson(styles);
        });

        contextState.cytoscape.on('changeIsEdgeWeighted', (evt, val) => {
            contextState.cytoscape.data('isEdgeWeighted', val);

            const styles = contextState.cytoscape.style().json();
            styles.find(s => s.selector === 'edge').style['label'] = val ? 'data(weight)' : '';
            contextState.cytoscape.style().fromJson(styles);
        });

        contextState.cytoscape.on('afterUndo', (evt, actionName, args) => this.persistGraphData(actionName));
        contextState.cytoscape.on('afterDo', (evt, actionName, args) => this.persistGraphData(actionName));
        contextState.cytoscape.on('afterRedo', (evt, actionName, args) => this.persistGraphData(actionName));
        contextState.cytoscape.on('layoutstop', () => this.persistGraphData('layoutstop'));
        contextState.cytoscape.on('save', _ => this.persistGraphData());

        contextState.cytoscape.on('select', 'node', (evt) => contextState.cytoscape.data('selectedNodeIds').add(evt.target.id()));
        contextState.cytoscape.on('unselect', 'node', (evt) => contextState.cytoscape.data('selectedNodeIds').delete(evt.target.id()));

        const tagEditor = getTagEditor(contextState.cytoscape);
        contextState.cytoscape.on('dblclick', 'node,edge', (evt) => tagEditor.open(evt.target));
    }

    loadGraphData(graphData) {
        contextState.undoRedo.do('batch', getBatchFromJson(graphData));

        contextState.cytoscape.elements()
            .filter(ele => ele.data('tag'))
            .forEach(ele => setTag(ele, ele.data('tag')));
    }

    persistGraphData(actionName) {
        if (actionName == 'animate') {
            return;
        }

        const updatedAt = sessionStorage.getItem('updatedAt');
        if (updatedAt && updatedAt - (Date.now() - 1000) > 0 && actionName !== 'layoutstop') {
            return;
        }

        const jsonData = createGraphJson(contextState.cytoscape);

        sessionStorage.setItem('graph', JSON.stringify(jsonData));
        sessionStorage.setItem('updatedAt', Date.now());
    }

    reset() {
        contextState.cytoscape.style(buildStylesheet());
        contextState.cytoscape.data('animation', false);
        contextState.cytoscape.data('elementToEdit', undefined);
        contextState.cytoscape.data('isDirected', true);
        contextState.cytoscape.data('isEdgeWeighted', false);
        contextState.cytoscape.data('isNodeWeighted', false);
        contextState.cytoscape.data('selectedNodeIds', new Set());
        contextState.cytoscape.data('sliderSpeed', 1);
    }
}

const context = Object.freeze(new Context());

export function getCytoscape() { return context.getValue('cytoscape'); }
export function resetCytoscape() { return context.reset(); }
export function getEdgeHandles() { return context.getValue('edgehandles'); }
export function getUndoRedo() { return context.getValue('undoRedo'); }