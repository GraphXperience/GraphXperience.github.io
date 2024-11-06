function getConnectedComponents(graph) {
    if (graph.nodes.length === 0) {
        throw new Error('O grafo está vazio.');
    }

    let i = 0;
    const colors = ['red', 'green', 'blue', 'yellow', 'black', 'aqua', 'orange'];

    let visitedNodeIds = new Set();
    let connectedComponents = [];
    let actions = [];

    let idToTag = new Map();
    for (const node of graph.nodes) {
        idToTag.set(node.id, node.tag);
    }

    for (const node of graph.nodes) {
        if (!visitedNodeIds.has(node.id)) {
            let currentComponent = [];
            let componentColor = colors[i++ % 7];
            visitComponent(node, currentComponent, componentColor);
            connectedComponents.push(currentComponent);
            actions.push({ type: 'print', message: 'Os componentes ' + currentComponent.map(id => idToTag.get(id)).join(', ') + ' estão conexos.' })
        }
    }

    return actions;

    function visitComponent(currentNode, currentComponent, componentColor) {
        actions.push({ type: 'print', message: 'Visitando o nó ' + currentNode.tag });
        visitedNodeIds.add(currentNode.id);
        currentComponent.push(currentNode.id);

        actions.push({ elementId: currentNode.id, type: 'animate', color: componentColor });

        for (const neighbor of graph.getNeighbors(currentNode)) {
            if (!visitedNodeIds.has(neighbor.id)) {
                visitComponent(neighbor, currentComponent, componentColor);
            }
        }
    }
}

export {
    getConnectedComponents
}