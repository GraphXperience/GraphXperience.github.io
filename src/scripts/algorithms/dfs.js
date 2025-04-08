function dfs(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        throw new Error('Não há nós selecionados.');
    }

    if (selectedNodes.length > 1) {
        throw new Error('Selecione apenas um nó para iniciar a busca.');
    }

    let startNode = graph.nodes.find(node => node.id === selectedNodes[0].id);
    let visitedNodeIds = new Set();
    let actions = [];

    function recursiveSearch(currentNode) {
        if (visitedNodeIds.has(currentNode.id)) {
            return;
        }

        visitedNodeIds.add(currentNode.id);
        actions.push({ elementId: currentNode.id, type: 'animate' });
        actions.push({ type: 'print', message: 'visitou o nó ' + currentNode.tag });

        for (let neighbor of graph.getNeighbors(currentNode)) {
            let edge = graph.getEdge(currentNode, neighbor);

            if (!visitedNodeIds.has(neighbor.id)) {
                actions.push({ elementId: edge.id, type: 'animate' });
                recursiveSearch(neighbor);
            }
        }
    }

    recursiveSearch(startNode);
    return actions;
}

export {
    dfs
}