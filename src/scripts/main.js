import { loadGraphJson, saveGraphJson, saveGraphJpeg, saveGraphPng } from './file';
import { clear, connectNodes, createNode, disconnectEdges, generateNodeTags, removeElements } from './graph';
import { ENTER_KEY_CODE, DELETE_KEY_CODE, D_KEY_CODE, E_KEY_CODE, N_KEY_CODE, S_KEY_CODE, Y_KEY_CODE, Z_KEY_CODE, C_KEY_CODE, V_KEY_CODE, A_KEY_CODE } from '../constants/key';
import { openInfoWindow } from './info-window';
import { initializeCustomAlgorithms } from './custom-algorithms';
import { promptCustomAlgorithmsSelection, clearCustomAlgorithms } from './custom-algorithms/custom-algorithms';
import { setupPredefinedGraphsModal } from './predefined-graphs/modal.js';
import { setupAnimationButtons } from './animation';
import { getCytoscape, getUndoRedo, getEdgeHandles } from './context';
import { toggleDrawMode } from './cytoscape-extensions/edgehandles-setup';
import { openPredefinedGraphsModal } from './predefined-graphs/modal.js';
import { run } from './algorithms';
import { getGlobalConfigEditor } from './editors/global-config-editor';
import { isAnyModalOpened, toggleSideBarSection } from './utils';

const mousePosition = {x: 0, y: 0};

const cy = getCytoscape();
const eh = getEdgeHandles();
const ur = getUndoRedo();

handleSlideSpeedDisplayInput();
handleSelectByRightClick();

setupAnimationButtons();
initializeCustomAlgorithms();
setupPredefinedGraphsModal();

document.addEventListener('keydown', handleKeyDownEvent);
document.addEventListener('mousemove', handleMouseMoveEvent);

document.getElementById('sidebar-menu').addEventListener('click', handleMenuClick);
document.getElementById('add-node-button').addEventListener('click', () => createNode(mousePosition));
document.getElementById('remove-elements-button').addEventListener('click', () => removeElements(cy.$(':selected')));
document.getElementById('connect-nodes-button').addEventListener('click', () => connectNodes(Array.from(cy.data('selectedNodeIds')).map(id => cy.$id(id))));
document.getElementById('disconnect-nodes-button').addEventListener('click', () => disconnectEdges(cy.$('node:selected')));
document.getElementById('clear-button').addEventListener('click', () => clear());
document.getElementById('generate-tags-button').addEventListener('click', () => { generateNodeTags(); cy.trigger('save'); });

document.getElementById('upload-button').addEventListener('click', () => loadGraphJson());

const downloadModal = document.getElementById('download-modal');
downloadModal.querySelector('.modal-close').addEventListener('click', () => downloadModal.close());
document.getElementById('download-button').addEventListener('click', () => downloadModal.showModal());
document.getElementById('download-json').addEventListener('click', () => saveGraphJson());
document.getElementById('download-jpeg').addEventListener('click', () => saveGraphJpeg());
document.getElementById('download-png').addEventListener('click', () => saveGraphPng());

const globalConfigEditor = getGlobalConfigEditor(cy);
document.getElementById('global-config-editor-button').addEventListener('click', () => globalConfigEditor.open());
document.getElementById('global-info-button').addEventListener('click', () => openInfoWindow('global-info'));

document.getElementById('as-title').addEventListener('click', () => toggleSideBarSection(document.getElementById('algorithms-section')));
document.getElementById('bfs-button').addEventListener('click', () => run('bfs'));
document.getElementById('dfs-button').addEventListener('click', () => run('dfs'));
document.getElementById('check-cycles-button').addEventListener('click', () => run('checkCycles'));
document.getElementById('get-connected-components-button').addEventListener('click', () => run('getConnectedComponents'));
document.getElementById('get-strongly-connected-components-button').addEventListener('click', () => run('getStronglyConnectedComponents'));
document.getElementById('get-shortest-path-button').addEventListener('click', () => run('getShortestPath'));
document.getElementById('ca-button-add').addEventListener('click', () => promptCustomAlgorithmsSelection());
document.getElementById('ca-button-clear').addEventListener('click', () => clearCustomAlgorithms());

document.getElementById('bfs-info-icon').addEventListener('click', () => openInfoWindow('bfs'));
document.getElementById('dfs-info-icon').addEventListener('click', () => openInfoWindow('dfs'));
document.getElementById('check-cycles-info-icon').addEventListener('click', () => openInfoWindow('check-cycles'));
document.getElementById('get-connected-components-info-icon').addEventListener('click', () => openInfoWindow('get-connected-components'));
document.getElementById('get-strongly-connected-components-info-icon').addEventListener('click', () => openInfoWindow('get-strongly-connected-components'));
document.getElementById('get-shortest-path-info-icon').addEventListener('click', () => openInfoWindow('get-shortest-path'));
document.getElementById('ca-info-icon').addEventListener('click', () => openInfoWindow('custom-algorithms'));

document.getElementById('pg-title').addEventListener('click', () => toggleSideBarSection(document.getElementById('predefined-graphs-section')));
document.getElementById('complete-graph-button').addEventListener('click', () => openPredefinedGraphsModal('complete'));
document.getElementById('regular-graph-button').addEventListener('click', () => openPredefinedGraphsModal('regular'));
document.getElementById('star-graph-button').addEventListener('click', () => openPredefinedGraphsModal('star'));
document.getElementById('wheel-graph-button').addEventListener('click', () => openPredefinedGraphsModal('wheel'));
document.getElementById('bipartite-graph-button').addEventListener('click', () => openPredefinedGraphsModal('bipartite'));
document.getElementById('complete-bipartite-graph-button').addEventListener('click', () => openPredefinedGraphsModal('complete-bipartite'));
document.getElementById('binary-tree-graph-button').addEventListener('click', () => openPredefinedGraphsModal('binary-tree'));
document.getElementById('petersen-graph-button').addEventListener('click', () => openPredefinedGraphsModal('petersen'));

document.getElementById('ca-title').addEventListener('click', () => toggleSideBarSection(document.getElementById('custom-algorithms-section')));
document.getElementById('regular-graph-info-icon').addEventListener('click', () => openInfoWindow('regular-graph'));
document.getElementById('complete-graph-info-icon').addEventListener('click', () => openInfoWindow('complete-graph'));
document.getElementById('star-graph-info-icon').addEventListener('click', () => openInfoWindow('star-graph'));
document.getElementById('wheel-graph-info-icon').addEventListener('click', () => openInfoWindow('wheel-graph'));
document.getElementById('bipartite-graph-info-icon').addEventListener('click', () => openInfoWindow('bipartite-graph'));
document.getElementById('complete-bipartite-graph-info-icon').addEventListener('click', () => openInfoWindow('complete-bipartite-graph'));
document.getElementById('binary-tree-graph-info-icon').addEventListener('click', () => openInfoWindow('binary-tree-graph'));
document.getElementById('petersen-graph-info-icon').addEventListener('click', () => openInfoWindow('petersen-graph'));


function handleKeyDownEvent(event) {
    if (cy.data('animation')) {
        return;
    }

    const isModalOpened = isAnyModalOpened();

    if (event.keyCode === ENTER_KEY_CODE) {
        handleEnterKeyDown(event);
        return;
    }
    
    if (isModalOpened) {
        return;
    }

    switch (event.keyCode) {
        case DELETE_KEY_CODE:
            removeElements(cy.$(':selected'));
            break;
        case A_KEY_CODE:
            if (event.ctrlKey) {
                cy.elements().select();
                event.preventDefault();
            }
            break;
        case N_KEY_CODE:
            createNode(mousePosition);
            break;
        case S_KEY_CODE:
            connectNodes(Array.from(cy.data('selectedNodeIds')).map(id => cy.$id(id)));
            break;
        case D_KEY_CODE:
            disconnectEdges(cy.$('node:selected'));
            break;
        case E_KEY_CODE:
            toggleDrawMode(document.getElementById('draw-mode-button'), eh);
            break;
        case C_KEY_CODE:
            if (event.ctrlKey) {
                cy.clipboard().copy(cy.$(':selected'));
            }
            break;
        case V_KEY_CODE:
            if (event.ctrlKey) {
                ur.do('paste');
            }
            break;
        case Z_KEY_CODE:
            if (event.ctrlKey) {
                ur.undo();
            }
            break;
        case Y_KEY_CODE:
            if (event.ctrlKey) {
                ur.redo();
            }
            break;
        default:
    }
}

function handleMouseMoveEvent(event) {
    const topMenuHeight = document.getElementsByTagName('header')[0].scrollHeight;

    mousePosition.x = event.x;
    mousePosition.y = event.y - topMenuHeight;
}

function handleMenuClick(event) {
    if (event.target.classList.contains('disabled')) {
        return;
    }
    document.getElementById('sidebar-menu-icon').textContent = document.getElementById('sidebar-menu-icon').textContent === 'menu' ? 'menu_open' : 'menu';

    document.getElementById('side-bar').classList.toggle('active');
}

function handleSlideSpeedDisplayInput() {
    const slider = document.getElementById('ac-slider');
    const speedDisplay = document.getElementById('ac-slider-speed-display');
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

    slider.addEventListener('input', function () {
        const speedIndex = parseInt(this.value);
        const speed = speeds[speedIndex];
        speedDisplay.textContent = `${speed.toFixed(2)}x`;
        cy.data('sliderSpeed', speed);
    });
}

function handleSelectByRightClick() {
    cy.on('cxttap', 'node, edge', event => {
        let selectedElements = cy.$(':selected');

        if (!event.target.selected()) {
            selectedElements.unselect();
            event.target.select();
        }

        event.originalEvent.preventDefault();
    });
}

function handleEnterKeyDown(event) {
    for (const modal of document.querySelectorAll('.modal')) {
        if (modal.open) {
            const confirm = modal.querySelector('.modal-confirm');
            if (confirm) {
                confirm.click();
                modal.close();
                event.preventDefault();
                return;
            }
        }
    }
}