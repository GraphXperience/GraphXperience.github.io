import { createCompleteGraph, createRegularGraph, createStarGraph, createWheelGraph, createBipartiteGraph, createCompleteBipartiteGraph, createBinaryTreeGraph, createPetersenGraph } from '../standard-graphs.js';

const buttonConfigurations = {
    'complete': {},
    'regular': { degree: true },
    'star': {},
    'wheel': {},
    'bipartite': { nodes2: true },
    'complete-bipartite': { nodes2: true },
    'binary-tree': { height: true },
    'petersen': {},
};

function showGraphSpecificationsModal(graphType) {
    const modal = document.getElementById('standard-graph-specifications-modal');
    const closeButton = document.getElementById('standard-graph-specifications-close-button');
    const confirmButton = document.getElementById('standard-graph-specifications-ok-button');
    const cancelButton = document.getElementById('standard-graph-specifications-cancel-button');

    const nodesInput = document.getElementById('standard-graph-specifications-nodes-input');
    const nodesInput2 = document.getElementById('standard-graph-specifications-nodes-2-input');
    const degreeInput = document.getElementById('standard-graph-specifications-degree-input');
    const heightInput = document.getElementById('standard-graph-specifications-height-input');

    modal.style.display = 'block';

    const config = buttonConfigurations[graphType];

    nodesInput.style.display = graphType !== 'petersen' ? 'block' : 'none';
    nodesInput.labels[0].style.display = graphType !== 'petersen' ? 'block' : 'none';
    degreeInput.style.display = config.degree ? 'block' : 'none';
    degreeInput.labels[0].style.display = config.degree ? 'block' : 'none';
    nodesInput2.style.display = config.nodes2 ? 'block' : 'none';
    nodesInput2.labels[0].style.display = config.nodes2 ? 'block' : 'none';
    heightInput.style.display = config.height ? 'block' : 'none';
    heightInput.labels[0].style.display = config.height ? 'block' : 'none';

    const closeModal = () => {
        modal.style.display = 'none';
        closeButton.removeEventListener('click', closeModal);
        cancelButton.removeEventListener('click', closeModal);
        confirmButton.removeEventListener('click', handleConfirm);
    };

    const handleConfirm = () => {
        const nodeCount = parseInt(nodesInput.value, 10);
        const nodeCount2 = parseInt(nodesInput2.value, 10);
        const nodeDegree = parseInt(degreeInput.value, 10);
        const height = parseInt(heightInput.value, 10);

        if (nodesInput.style.display !== 'none' && (isNaN(nodeCount) || nodeCount < 1)) {
            alert('Número de nós deve ser válido e maior que 0');
            return;
        }

        if (degreeInput.style.display !== 'none' && (isNaN(nodeDegree) || nodeDegree > nodeCount || nodeDegree % 2 !== 0)) {
            alert('O grau dos nós deve ser válido, par e menor que o número de nós');
            return;
        }

        if (graphType === 'wheel' && nodeCount < 4) {
            alert('Número de nós deve ser maior que 3');
            return;
        }

        if (nodesInput2.style.display !== 'none' && (isNaN(nodeCount2) || nodeCount2 < 1)) {
            alert('Número de nós deve ser válido e maior que 0');
            return;
        }

        if (graphType === 'binary-tree' && (isNaN(height) || height > nodeCount || height <= Math.floor(Math.log2(nodeCount)))) {
            alert('A altura deve ser menor que o número de nós e maior que o piso de log2 do numero de nós');
            return;
        }

        switch (graphType) {
            case 'complete':
                createCompleteGraph(nodeCount);
                break;
            case 'regular':
                createRegularGraph(nodeCount, nodeDegree);
                break;
            case 'star':
                createStarGraph(nodeCount);
                break;
            case 'wheel':
                createWheelGraph(nodeCount);
                break;
            case 'bipartite':
                createBipartiteGraph(nodeCount, nodeCount2);
                break;
            case 'complete-bipartite':
                createCompleteBipartiteGraph(nodeCount, nodeCount2);
                break;
            case 'binary-tree':
                createBinaryTreeGraph(nodeCount, height);
                break;
            case 'petersen':
                createPetersenGraph();
                break;
        }

        closeModal();
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    confirmButton.addEventListener('click', handleConfirm);
}

export {
    showGraphSpecificationsModal,
};
