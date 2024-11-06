import { getRandomUuid } from '../utils';
import { centerGraphHorizontallyAndAlignRoot } from '../layout-utils';

function createBinaryTreeGraph(cy, ur, nodeCount, height) {
    let nodes = [];
    let edges = [];
    
    function addChildren(parentNodeId, currentLevel, currentIndex) {
        if (currentLevel >= height || nodes.length >= nodeCount) {
            return;
        }
        
        const leftChildIndex = 2 * currentIndex;
        const rightChildIndex = 2 * currentIndex + 1;
        
        if (nodes.length < nodeCount) {
            const leftChildId = getRandomUuid();
            nodes.push({ data: { id: leftChildId } });
            edges.push({ data: { id: getRandomUuid(), source: parentNodeId, target: leftChildId } });
            addChildren(leftChildId, currentLevel + 1, leftChildIndex);
        }
        
        if (nodes.length < nodeCount) {
            const rightChildId = getRandomUuid();
            nodes.push({ data: { id: rightChildId } });
            edges.push({ data: { id: getRandomUuid(), source: parentNodeId, target: rightChildId } });
            addChildren(rightChildId, currentLevel + 1, rightChildIndex);
        }
    }
    
    const rootNodeId = getRandomUuid();
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
