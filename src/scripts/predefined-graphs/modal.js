import { createPredefinedGraph } from './index.js';
import { validatePredefinedGraphSpecifications } from './validate.js';

const standardGraphsConfigurationDict = {
    'complete': {
        fields: ['nodeCount'],
        validations: ['validNumberOfNodes']
    },
    'regular': {
        fields: ['nodeCount', 'nodeDegree'],
        validations: ['validNumberOfNodes', 'validNodeDegree']
    },
    'star': {
        fields: ['nodeCount'],
        validations: ['validNumberOfNodes']
    },
    'wheel': {
        fields: ['nodeCount'],
        validations: ['validNumberOfNodes', 'wheelNumberOfNodes']
    },
    'bipartite': {
        fields: ['nodeCount', 'nodeCount2'],
        validations: ['validNumberOfNodes']
    },
    'complete-bipartite': {
        fields: ['nodeCount', 'nodeCount2'],
        validations: ['validNumberOfNodes']
    },
    'binary-tree': {
        fields: ['nodeCount', 'height'],
        validations: ['validNumberOfNodes', 'validHeight']
    },
    'petersen': {
        fields: [],
        validations: []
    },
};

const modal = document.getElementById('predefined-graph-specifications-modal');
const nodesInput = document.getElementById('pgs-nodes-input');
const nodesInput2 = document.getElementById('pgs-nodes-2-input');
const degreeInput = document.getElementById('pgs-degree-input');
const heightInput = document.getElementById('pgs-height-input');
const cancelButton = modal.querySelector('.modal-close');
const confirmButton = modal.querySelector('.modal-confirm');

let graphType = '';
let config = '';

function setupPredefinedGraphsModal() {
    const closeModal = () => {
        modal.close();
    };

    const handleConfirm = () => {
        const nodeCount = parseInt(nodesInput.value, 10);
        const nodeCount2 = parseInt(nodesInput2.value, 10);
        const nodeDegree = parseInt(degreeInput.value, 10);
        const height = parseInt(heightInput.value, 10);

        const errors = validatePredefinedGraphSpecifications(graphType, nodeCount, nodeCount2, nodeDegree, height, standardGraphsConfigurationDict);

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const paramsDict = {
            'complete': [nodeCount],
            'regular': [nodeCount, nodeDegree],
            'star': [nodeCount],
            'wheel': [nodeCount],
            'bipartite': [nodeCount, nodeCount2],
            'complete-bipartite': [nodeCount, nodeCount2],
            'binary-tree': [nodeCount, height],
            'petersen': [nodeCount],
        }

        let params = paramsDict[graphType];

        createPredefinedGraph(graphType, params);

        closeModal();
    };

    cancelButton.addEventListener('click', closeModal);
    confirmButton.addEventListener('click', handleConfirm);
}

function openPredefinedGraphsModal(selectedGraphType) {
    graphType = selectedGraphType;

    config = standardGraphsConfigurationDict[graphType];

    document.getElementById('pgs-nodes-section').style.display = config.fields.includes('nodeCount') ? 'flex' : 'none';
    document.getElementById('pgs-nodes-2-section').style.display = config.fields.includes('nodeCount2') ? 'flex' : 'none';
    document.getElementById('pgs-degree-section').style.display = config.fields.includes('nodeDegree') ? 'flex' : 'none';
    document.getElementById('pgs-height-section').style.display = config.fields.includes('height') ? 'flex' : 'none';

    modal.showModal();
}

export {
    openPredefinedGraphsModal,
    setupPredefinedGraphsModal,
};