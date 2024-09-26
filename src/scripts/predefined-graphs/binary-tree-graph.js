import { getRandomNumber } from '../utils';
import { centerGraphHorizontallyAndAlignRoot } from '../layout-utils';

function createBinaryTreeGraph(cy, ur, nodeCount, height) {
    cy.elements().remove();
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

export {
    createBinaryTreeGraph,
};
