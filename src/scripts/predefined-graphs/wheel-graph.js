import { getRandomNumber } from '../utils';
import { getCentralAndOuterPositions } from '../layout-utils';

function createWheelGraph(cy, ur, nodeCount) {
    cy.elements().remove();
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

export {
    createWheelGraph,
};