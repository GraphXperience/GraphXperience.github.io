import { openPopup } from '../popup';

function bfs(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        openPopup('Não há nós selecionados');
        return [];
    }
    if (selectedNodes.length > 1) {
        openPopup('Selecione apenas um nó para iniciar a busca');
        return [];
    }
    const startNode = graph.nodes.find(node => node.id === selectedNodes[0].id);

    let visitedNodeIds = new Set();
    let queue = [startNode];
    let actions = [];

    while (queue.length) {
        const currentNode = queue.shift();

        visitedNodeIds.add(currentNode.id);

        actions.push({ elementId: currentNode.id, type: 'animate' });

        let neighbors = currentNode.getNeighbors(graph.isDirected);
        currentNode.outgoingEdges.forEach(edge => actions.push({ elementId: edge.id, type: 'animate' }));

        if (!graph.isDirected) {
            currentNode.incomingEdges.forEach(edge => actions.push({ elementId: edge.id, type: 'animate' }));
        }

        neighbors.forEach((neighbor) => {
            if (!visitedNodeIds.has(neighbor.id)) {
                queue.push(neighbor);
                actions.push({ elementId: neighbor.id, type: 'animate', color: '#DBA404' });
            }
        });
    }

    return actions;
}

export {
    bfs
}