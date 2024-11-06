function dfs(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        throw new Error('Não há nós selecionados.');
    }
    if (selectedNodes.length > 1) {
        throw new Error('Selecione apenas um nó para iniciar a busca.');
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
        actions.push({ type: 'print', message: 'visitou o nó ' + currentNode.tag });

        for (const neighbor of graph.getNeighbors(currentNode)) {
            if (!visitedNodeIds.has(neighbor.id)) {
                stack.push(neighbor);
                actions.push({ elementId: graph.getEdge(currentNode, neighbor).id, type: 'animate' });
                actions.push({ elementId: neighbor.id, type: 'animate', color: '#DBA404' });
            }
        }
    }

    return actions;
}

export {
    dfs
}