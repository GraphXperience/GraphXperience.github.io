import { getCytoscape, getUndoRedo } from './context';
import { getCentralAndOuterPositions, centerGraphHorizontallyAndAlignRoot, positionPetersenGraph } from './layout-utils';
import { getRandomNumber } from './utils';

const cy = getCytoscape();
const ur = getUndoRedo();

function clearCytoscape() {
    cy.elements().remove();
}

function createRegularGraph(nodeCount, degree) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let edges = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount; i++) {
        for (let j = 1; j <= degree / 2; j++) {
            const sourceNodeId = nodes[i].data.id;
            const targetNodeId = nodes[(i + j) % nodeCount].data.id;
            edges.push({ data: { id: getRandomNumber(), source: sourceNodeId, target: targetNodeId } });
        }
    }

    ur.do('add', edges);
    cy.layout({ name: 'circle' }).run();
}

function createCompleteGraph(nodeCount) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let edges = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const sourceNodeId = nodes[i].data.id;
            const targetNodeId = nodes[j].data.id;
            edges.push({ data: { id: getRandomNumber(), source: sourceNodeId, target: targetNodeId } });
        }
    }

    ur.do('add', edges);
    cy.layout({ name: 'circle' }).run();
}

function createStarGraph(nodeCount) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let edges = [];

    const centralNodeId = getRandomNumber();

    nodes.push({ data: { id: centralNodeId } });

    for (let i = 1; i < nodeCount; i++) {
        const outerNodeId = getRandomNumber();
        nodes.push({ data: { id: outerNodeId } });
        edges.push({ data: { id: getRandomNumber(), source: centralNodeId, target: outerNodeId } });
    }

    ur.do('add', nodes);
    ur.do('add', edges);

    const positions = getCentralAndOuterPositions(nodes);

    cy.layout({ name: 'preset', positions: node => positions[node.id()] }).run();
}

function createWheelGraph(nodeCount) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let edges = [];

    const centralNodeId = getRandomNumber();

    nodes.push({ data: { id: centralNodeId } });
    
    for (let i = 1; i < nodeCount; i++) {
        const outerNodeId = getRandomNumber();
        nodes.push({ data: { id: outerNodeId } });
        edges.push({ data: { id: getRandomNumber(), source: centralNodeId, target: outerNodeId } });
        const previousOuterNodeId = nodes[i-1].data.id;

        if (i > 1) {
            edges.push({ data: { id: getRandomNumber(), source: outerNodeId, target: previousOuterNodeId } });
        }
    }

    edges.push({ data: { id: getRandomNumber(), source: nodes[nodeCount - 1].data.id, target: nodes[1].data.id } });

    ur.do('add', nodes);
    ur.do('add', edges);

    const positions = getCentralAndOuterPositions(nodes);

    cy.layout({ name: 'preset', positions: node => positions[node.id()] }).run();
}

function createBipartiteGraph(nodeCount, nodeCount2) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let nodes2 = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount2; i++) {
        nodes2.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes2);

    cy.layout({ name: 'grid', rows: 2, columns: Math.max(nodeCount, nodeCount2)}).run();
}

function createCompleteBipartiteGraph(nodeCount, nodeCount2) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let nodes2 = [];
    let edges = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount2; i++) {
        nodes2.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes2);

    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount2; j++) {
            edges.push({ data: { id: getRandomNumber(), source: nodes[i].data.id, target: nodes2[j].data.id } });
        }
    }

    ur.do('add', edges);

    cy.layout({ name: 'grid', rows: 2, columns: Math.max(nodeCount, nodeCount2) }).run();    
}

function createBinaryTreeGraph(nodeCount, height) {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let nodes = [];
    let edges = [];
    
    function addChildren(parentNodeId, currentLevel, currentIndex) {
        if (currentLevel >= height || nodes.length >= nodeCount) {
            return;
        }
        
        const leftChildIndex = 2 * currentIndex;
        const rightChildIndex = 2 * currentIndex + 1;
        
        if (nodes.length < nodeCount) {
            const leftChildId = getRandomNumber();
            nodes.push({ data: { id: leftChildId } });
            edges.push({ data: { id: getRandomNumber(), source: parentNodeId, target: leftChildId } });
            addChildren(leftChildId, currentLevel + 1, leftChildIndex);
        }
        
        if (nodes.length < nodeCount) {
            const rightChildId = getRandomNumber();
            nodes.push({ data: { id: rightChildId } });
            edges.push({ data: { id: getRandomNumber(), source: parentNodeId, target: rightChildId } });
            addChildren(rightChildId, currentLevel + 1, rightChildIndex);
        }
    }
    
    const rootNodeId = getRandomNumber();
    nodes.push({ data: { id: rootNodeId } });
    addChildren(rootNodeId, 1, 1);

    ur.do('add', nodes);
    ur.do('add', edges);

    cy.layout({ name: 'dagre' }).run();

    centerGraphHorizontallyAndAlignRoot(cy);
}

function createPetersenGraph() {
    clearCytoscape();
    cy.trigger('isDirectedOff');

    let innerNodes = [];
    let outerNodes = [];
    let innerEdges = [];
    let outerEdges = [];
    let middleEdges = [];

    for (let i = 0; i < 5; i++) {
        innerNodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', innerNodes);

    for (let i = 0; i < 5; i++) {
        outerNodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', outerNodes);

    innerEdges.push({ data: { id: getRandomNumber(), source: innerNodes[0].data.id, target: innerNodes[2].data.id } });
    innerEdges.push({ data: { id: getRandomNumber(), source: innerNodes[0].data.id, target: innerNodes[3].data.id } });
    innerEdges.push({ data: { id: getRandomNumber(), source: innerNodes[1].data.id, target: innerNodes[3].data.id } });
    innerEdges.push({ data: { id: getRandomNumber(), source: innerNodes[1].data.id, target: innerNodes[4].data.id } });
    innerEdges.push({ data: { id: getRandomNumber(), source: innerNodes[2].data.id, target: innerNodes[4].data.id } });

    ur.do('add', innerEdges);
    
    for (let i = 0; i < 5; i++) {
        middleEdges.push({ data: { id: getRandomNumber(), source: innerNodes[i].data.id, target: outerNodes[i].data.id } });
    }

    ur.do('add', middleEdges);

    for (let i = 0; i < 5; i++) {
        outerEdges.push({ data: { id: getRandomNumber(), source: outerNodes[i].data.id, target: outerNodes[(i + 1) % 5].data.id } });
    }

    ur.do('add', outerEdges);

    const positions = positionPetersenGraph(innerNodes, outerNodes);

    cy.layout({ name: 'preset', positions: node => positions[node.id()] }).run();
}

export {
    createCompleteGraph,
    createRegularGraph,
    createStarGraph,
    createWheelGraph,
    createBipartiteGraph,
    createCompleteBipartiteGraph,
    createBinaryTreeGraph,
    createPetersenGraph,
};
