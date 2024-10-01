import { getRandomNumber } from '../utils';

function createCompleteBipartiteGraph(cy, ur, nodeCount, nodeCount2) {
    cy.elements().remove();
    cy.trigger('changeIsDirected', false);

    let nodes = [];
    let nodes2 = [];
    let edges = [];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes);

    for (let i = 0; i < nodeCount2; i++) {
        nodes2.push({ data: { id: getRandomNumber() } });
    }

    ur.do('add', nodes2);

    for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount2; j++) {
            edges.push({ data: { id: getRandomNumber(), source: nodes[i].data.id, target: nodes2[j].data.id } });
        }
    }

    ur.do('add', edges);

    cy.layout({ name: 'grid', rows: 2, columns: Math.max(nodeCount, nodeCount2) }).run();    
}

export {
    createCompleteBipartiteGraph,
};
