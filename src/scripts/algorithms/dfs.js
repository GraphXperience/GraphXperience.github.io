import { openPopup } from '../popup';

function dfs(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        openPopup('Não há nós selecionados');
        return [];
    }
    if (selectedNodes.length > 1) {
        openPopup('Selecione apenas um nó para iniciar a busca');
        return [];
    }

    const startNode = graph.nodes.find(node => node.id === selectedNodes[0].id);

    const visitedNodeIds = new Set();
    const stack = [startNode];
    const actions = [];

    while (stack.length) {
        const currentNode = stack.pop();

        if (visitedNodeIds.has(currentNode.id)) {
            continue;
        }

        visitedNodeIds.add(currentNode.id);
        actions.push({ elementId: currentNode.id, type: 'animate' });

        let neighbors = currentNode.getNeighbors(graph.isDirected);

        currentNode.outgoingEdges.forEach(edge => actions.push({ elementId: edge.id, type: 'animate' }));
        if (!graph.isDirected) {
            currentNode.incomingEdges.forEach(edge => actions.push({ elementId: edge.id, type: 'animate' }));
        }

        neighbors.forEach((neighbor) => {
            if (!visitedNodeIds.has(neighbor.id)) {
                stack.push(neighbor);
                actions.push({ elementId: neighbor.id, type: 'animate', color: 'yellow' });
            }
        });
    }

    return actions;
}

export {
    dfs
}