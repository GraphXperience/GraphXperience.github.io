import { getRandomUuid } from '../utils';

function createCompleteBipartiteGraph(cy, ur, nodeCount, nodeCount2) {
    let largerPartitionNodes = [];
    let smallerPartitionNodes = [];
    let edges = [];

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

    for (let i = 0; i < largerPartitionCount; i++) {
        for (let j = 0; j < smallerPartitionCount; j++) {
            edges.push({ data: { id: getRandomUuid(), source: largerPartitionNodes[i].data.id, target: smallerPartitionNodes[j].data.id } });
        }
    }

    ur.do('add', edges);

    cy.layout({ name: 'grid', rows: 2, columns: largerPartitionCount }).run();    
}

export {
    createCompleteBipartiteGraph,
};
