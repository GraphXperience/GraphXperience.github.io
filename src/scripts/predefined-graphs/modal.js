import { createPredefinedGraph } from './index.js';
import { validatePredefinedGraphSpecifications } from './validate.js';

const buttonConfigurationsDict = {
    'complete': { fields: ['nodeCount'] },
    'regular': { fields: ['nodeCount', 'nodeDegree'] },
    'star': { fields: ['nodeCount'] },
    'wheel': { fields: ['nodeCount'] },
    'bipartite': { fields: ['nodeCount', 'nodeCount2'] },
    'complete-bipartite': { fields: ['nodeCount', 'nodeCount2'] },
    'binary-tree': { fields: ['nodeCount', 'height'] },
    'petersen': { fields: [] },
};

const modal = document.getElementById('predefined-graph-specifications-modal');
const closeButton = document.getElementById('predefined-graph-specifications-close-button');
const confirmButton = document.getElementById('predefined-graph-specifications-ok-button');
const cancelButton = document.getElementById('predefined-graph-specifications-cancel-button');
const nodesInput = document.getElementById('predefined-graph-specifications-nodes-input');
const nodesInput2 = document.getElementById('predefined-graph-specifications-nodes-2-input');
const degreeInput = document.getElementById('predefined-graph-specifications-degree-input');
const heightInput = document.getElementById('predefined-graph-specifications-height-input');

let graphType = '';
let config = '';

function setupPredefinedGraphsModal() {
    const closeModal = () => {
        modal.style.display = 'none';
    };
    
    const handleConfirm = () => {
        const nodeCount = parseInt(nodesInput.value, 10);
        const nodeCount2 = parseInt(nodesInput2.value, 10);
        const nodeDegree = parseInt(degreeInput.value, 10);
        const height = parseInt(heightInput.value, 10);

        const errors = validatePredefinedGraphSpecifications(graphType, nodeCount, nodeCount2, nodeDegree, height, buttonConfigurationsDict);

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const paramsDict = {
            'complete': [ nodeCount ],
            'regular': [ nodeCount, nodeDegree ],
            'star': [ nodeCount ],
            'wheel': [ nodeCount ],
            'bipartite': [ nodeCount, nodeCount2 ],
            'complete-bipartite': [ nodeCount, nodeCount2 ],
            'binary-tree': [ nodeCount, height ],
            'petersen': [ nodeCount ],
        }

        let params = paramsDict[graphType];

        createPredefinedGraph(graphType, params);

        closeModal();
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    confirmButton.addEventListener('click', handleConfirm);
}

function openPredefinedGraphsModal(selectedGraphType) {
    graphType = selectedGraphType;

    config = buttonConfigurationsDict[graphType];

    nodesInput.style.display = config.fields.includes('nodeCount') ? 'block' : 'none';
    nodesInput.labels[0].style.display = config.fields.includes('nodeCount') ? 'block' : 'none';
    degreeInput.style.display = config.fields.includes('nodeDegree') ? 'block' : 'none';
    degreeInput.labels[0].style.display = config.fields.includes('nodeDegree') ? 'block' : 'none';
    nodesInput2.style.display = config.fields.includes('nodeCount2') ? 'block' : 'none';
    nodesInput2.labels[0].style.display = config.fields.includes('nodeCount2') ? 'block' : 'none';
    heightInput.style.display = config.fields.includes('height') ? 'block' : 'none';
    heightInput.labels[0].style.display = config.fields.includes('height') ? 'block' : 'none';

    modal.style.display = 'block';
}

export {
    openPredefinedGraphsModal,
    setupPredefinedGraphsModal,
};