function bfs(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        throw new Error('Não há nós selecionados');
    }

    if (selectedNodes.length > 1) {
        throw new Error('Selecione apenas um nó para iniciar a busca');
    }

    let visitedNodeIds = new Set();
    let queue = [{ node: selectedNodes[0], parent: null }];
    let actions = [];

    while (queue.length > 0) {
        let { node: currentNode, parent } = queue.shift();

        if (visitedNodeIds.has(currentNode.id)) {
            continue;
        }

        visitedNodeIds.add(currentNode.id);

        if (parent) {
            let edge = graph.getEdge(parent, currentNode);
            actions.push({ elementId: edge.id, type: 'animate' });
        }

        actions.push({ elementId: currentNode.id, type: 'animate', color: 'red' });
        actions.push({ message: 'Visitando o nó ' + currentNode.tag, type: 'print' });

        let neighbors = graph.getNeighbors(currentNode);

        for (let neighbor of neighbors) {
            if (!visitedNodeIds.has(neighbor.id)) {
                queue.push({ node: neighbor, parent: currentNode });
            }
        }
    }

    return actions;
}

export {
    bfs
}
