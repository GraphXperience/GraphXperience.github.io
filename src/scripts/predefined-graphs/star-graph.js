import { getRandomUuid } from '../utils';
import { getCentralAndOuterPositions } from '../layout-utils';

function createStarGraph(cy, ur, nodeCount) {
    cy.elements().remove();
    cy.trigger('changeIsDirected', false);

    let nodes = [];
    let edges = [];

    const centralNodeId = getRandomUuid();

    nodes.push({ data: { id: centralNodeId } });

    for (let i = 1; i < nodeCount; i++) {
        const outerNodeId = getRandomUuid();
        nodes.push({ data: { id: outerNodeId } });
        edges.push({ data: { id: getRandomUuid(), source: centralNodeId, target: outerNodeId } });
    }

    ur.do('add', nodes);
    ur.do('add', edges);

    const positions = getCentralAndOuterPositions(nodes);

    cy.layout({ name: 'preset', positions: node => positions[node.id()] }).run();
}

export {
    createStarGraph,
};