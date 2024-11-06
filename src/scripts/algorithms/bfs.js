function bfs(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        throw new Error('Não há nós selecionados');
    }
    if (selectedNodes.length > 1) {
        throw new Error('Selecione apenas um nó para iniciar a busca');
    }

    let visitedNodeIds = new Set();
    let queue = [selectedNodes[0]];
    let actions = [];

    while (queue.length > 0) {
        const currentNode = queue.shift();

        visitedNodeIds.add(currentNode.id);
        actions.push({ elementId: currentNode.id, type: 'animate', color: 'red' });
        actions.push({ message: 'Visitando o nó ' + currentNode.tag, type: 'print' });

        let neighbors = graph.getNeighbors(currentNode);
        for (let neighbor of neighbors) {
            if (!visitedNodeIds.has(neighbor.id)) {
                queue.push(neighbor);
                actions.push({ elementId: graph.getEdge(currentNode, neighbor).id, type: 'animate' });
                actions.push({ elementId: neighbor.id, type: 'animate', color: '#DBA404' });
            }
        }
    }

    return actions;
}

export {
    bfs
}