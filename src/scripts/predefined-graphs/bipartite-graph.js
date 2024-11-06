import { getRandomUuid } from '../utils';

function createBipartiteGraph(cy, ur, nodeCount, nodeCount2) {
    let nodes = [];
    let nodes2 = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount2; i++) {
        nodes2.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', nodes2);

    cy.layout({ name: 'grid', rows: 2, columns: Math.max(nodeCount, nodeCount2)}).run();
}

export {
    createBipartiteGraph,
};
