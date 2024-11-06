import { getRandomUuid } from '../utils';
import { positionPetersenGraph } from '../layout-utils';

function createPetersenGraph(cy, ur) {
    let innerNodes = [];
    let outerNodes = [];
    let innerEdges = [];
    let outerEdges = [];
    let middleEdges = [];

    for (let i = 0; i < 5; i++) {
        innerNodes.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', innerNodes);

    for (let i = 0; i < 5; i++) {
        outerNodes.push({ data: { id: getRandomUuid() } });
    }

    ur.do('add', outerNodes);

    innerEdges.push({ data: { id: getRandomUuid(), source: innerNodes[0].data.id, target: innerNodes[2].data.id } });
    innerEdges.push({ data: { id: getRandomUuid(), source: innerNodes[0].data.id, target: innerNodes[3].data.id } });
    innerEdges.push({ data: { id: getRandomUuid(), source: innerNodes[1].data.id, target: innerNodes[3].data.id } });
    innerEdges.push({ data: { id: getRandomUuid(), source: innerNodes[1].data.id, target: innerNodes[4].data.id } });
    innerEdges.push({ data: { id: getRandomUuid(), source: innerNodes[2].data.id, target: innerNodes[4].data.id } });

    ur.do('add', innerEdges);
    
    for (let i = 0; i < 5; i++) {
        middleEdges.push({ data: { id: getRandomUuid(), source: innerNodes[i].data.id, target: outerNodes[i].data.id } });
    }

    ur.do('add', middleEdges);

    for (let i = 0; i < 5; i++) {
        outerEdges.push({ data: { id: getRandomUuid(), source: outerNodes[i].data.id, target: outerNodes[(i + 1) % 5].data.id } });
    }

    ur.do('add', outerEdges);

    const positions = positionPetersenGraph(innerNodes, outerNodes);

    cy.layout({ name: 'preset', positions: node => positions[node.id()] }).run();
}
export {
    createPetersenGraph,
};
