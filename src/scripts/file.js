import { getCytoscape, getUndoRedo } from './context';
import { getBatchFromJson, createGraphJson } from './extensions/cytoscape-extensions';
import { setTag } from './extensions/element-extensions';
import { clear } from './graph';

const cy = getCytoscape();
const ur = getUndoRedo();

function loadGraphJson() {
    const inputElement = document.createElement('input');

    inputElement.type = 'file';
    inputElement.accept = '.json,.txt';

    inputElement.addEventListener('change', event => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = e => {
                clear();

                const graphData = JSON.parse(e.target.result);

                if (graphData.isDirected !== cy.data('isDirected'))
                    cy.trigger('changeIsDirected', graphData.isDirected);

                if (graphData.isNodeWeighted !== cy.data('isNodeWeighted'))
                    cy.trigger('changeIsNodeWeighted', graphData.isNodeWeighted);

                if (graphData.isEdgeWeighted !== cy.data('isEdgeWeighted'))
                    cy.trigger('changeIsEdgeWeighted', graphData.isEdgeWeighted);

                ur.do('batch', getBatchFromJson(e.target.result));

                cy.elements()
                    .filter(ele => ele.data('tag'))
                    .forEach(ele => setTag(ele, ele.data('tag')));
            };

            reader.readAsText(file);
        }
    });

    inputElement.click();
}

function saveGraphJson() {
    const targetType = 'json';
    const jsonData = buildJsonData(cy);
    const jsonBlob = new Blob([jsonData], { type: 'application/json' });

    createBlobLink(jsonBlob, targetType);
}

function buildJsonData() {
    const jsonData = createGraphJson(cy);
    jsonData.isDirected = cy.data('isDirected');
    jsonData.isNodeWeighted = cy.data('isNodeWeighted');
    jsonData.isEdgeWeighted = cy.data('isEdgeWeighted');

    return JSON.stringify(jsonData, null, 4);
}

function saveGraphJpeg() {
    const targetType = 'jpg';
    const jpegBlob = cy.jpg({ output: 'blob' });

    createBlobLink(jpegBlob, targetType);
}

function saveGraphPng() {
    const targetType = 'png';
    const pngBlob = cy.png({ output: 'blob' });

    createBlobLink(pngBlob, targetType);
}

function createBlobLink(blob, targetType) {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.style.display = 'none';
    a.href = blobUrl;
    a.download = `graph.${targetType}`;

    a.click();
}

export {
    loadGraphJson,
    saveGraphJson,
    saveGraphJpeg,
    saveGraphPng
};