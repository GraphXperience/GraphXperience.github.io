
function getShortestPath(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        throw new Error('Não há nós selecionados');
    }

    if (selectedNodes.length !== 2) {
        throw new Error('Selecione dois nós: o nó fonte e o nó destino');
    }

    const actions = [];
    const nodes = graph.nodes;
    const sourceNode = selectedNodes[0];
    const targetNode = selectedNodes[1];

    const distances = new Map();
    const previous = new Map();
    const priorityQueue = [];

    nodes.forEach(node => {
        distances.set(node.id, Infinity);
        previous.set(node.id, null);
    });

    distances.set(sourceNode.id, 0);
    priorityQueue.push({ nodeId: sourceNode.id, distance: 0 });

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { nodeId, distance } = priorityQueue.shift();

        const node = nodes.find(node => node.id === nodeId);
        actions.push({ type: 'print', message: `Visitou o nó ${node.tag}. Distancia: ${distance}` });
        actions.push({ elementId: node.id, type: 'animate' });

        if (nodeId === targetNode.id) {
            actions.push({ type: 'print', message: 'Achou o nó de destino.' });
            actions.push({ elementId: nodeId, type: 'animate', color: 'green' });
            break;
        }

        for (const neighbor of graph.getNeighbors(node)) {
            const edge = graph.getEdge(node, neighbor);
            const weight = edge.weight;
            const currentDistance = distances.get(neighbor.id);
            const newDistance = distance + weight;

            if (newDistance < currentDistance) {
                distances.set(neighbor.id, newDistance);
                previous.set(neighbor.id, node);

                priorityQueue.push({ nodeId: neighbor.id, distance: newDistance });
            }
        }
    }

    const shortestPath = reconstructPath(targetNode);
    shortestPath.forEach(nodeId => { actions.push({ elementId: nodeId, type: 'animate', color: 'green' }); });

    return actions;

    function reconstructPath(targetNode) {
        const path = [];
        let currentNode = targetNode;

        while (currentNode !== null) {
            path.push(currentNode.id);
            currentNode = previous.get(currentNode.id);
        }

        return path;
    }
}

export {
    getShortestPath
}
