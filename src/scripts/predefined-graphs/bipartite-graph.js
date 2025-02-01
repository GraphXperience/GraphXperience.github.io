import { getRandomUuid } from '../utils';

function createBipartiteGraph(cy, ur, nodeCount, nodeCount2) {
    let largerPartitionNodes = [];
    let smallerPartitionNodes = [];

    let largerPartitionCount = Math.max(nodeCount, nodeCount2);
    let smallerPartitionCount = Math.min(nodeCount, nodeCount2);

    for (let i = 0; i < largerPartitionCount; i++) {
        largerPartitionNodes.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', largerPartitionNodes);

    for (let i = 0; i < smallerPartitionCount; i++) {
        smallerPartitionNodes.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', smallerPartitionNodes);

    cy.layout({ name: 'grid', rows: 2, columns: largerPartitionCount}).run();
}

export {
    createBipartiteGraph,
};
