import { getRandomUuid } from '../utils';

function createCompleteGraph(cy, ur, nodeCount) {
    cy.elements().remove();
    cy.trigger('changeIsDirected', false);

    let nodes = [];
    let edges = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const sourceNodeId = nodes[i].data.id;
            const targetNodeId = nodes[j].data.id;
            edges.push({ data: { id: getRandomUuid(), source: sourceNodeId, target: targetNodeId } });
        }
    }

    ur.do('add', edges);
    cy.layout({ name: 'circle' }).run();
}

export {
    createCompleteGraph
};
