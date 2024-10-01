import { getRandomNumber } from '../utils';

function createRegularGraph(cy, ur, nodeCount, degree) {
    cy.elements().remove();
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

export {
    createRegularGraph
};
