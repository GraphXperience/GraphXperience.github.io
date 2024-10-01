import { getRandomNumber } from '../utils';

function createBipartiteGraph(cy, ur, nodeCount, nodeCount2) {
    cy.elements().remove();
    cy.trigger('changeIsDirected', false);

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

export {
    createBipartiteGraph,
};
