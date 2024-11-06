function getStronglyConnectedComponents(graph) {
    if (graph.nodes.length === 0) {
        openPopup('O grafo está vazio.');
        return;
    }

    let actions = [];
    let stack = [];
    let connectedComponents = [];
    let index = 0;
    let indexMap = new Map();
    let lowLinkMap = new Map();

    let i = 0;
    const colors = ['red', 'green', 'blue', 'yellow', 'black', 'aqua', 'orange'];

    for (const node of graph.nodes) {
        if (!indexMap.has(node.id)) {
            tarjanDfs(node);
        }
    }

    return actions;

    function tarjanDfs(node) {
        indexMap.set(node.id, index);
        lowLinkMap.set(node.id, index);

        index++;

        stack.push(node.id);

        for (const neighbor of graph.getNeighbors(node)) {
            if (!indexMap.has(neighbor.id)) {
                tarjanDfs(neighbor);
                lowLinkMap.set(node.id, Math.min(lowLinkMap.get(node.id), lowLinkMap.get(neighbor.id)));
            } else if (stack.includes(neighbor.id)) {
                lowLinkMap.set(node.id, Math.min(lowLinkMap.get(node.id), indexMap.get(neighbor.id)));
            }
        }

        if (lowLinkMap.get(node.id) === indexMap.get(node.id)) {
            let component = [];
            let poppedNodeId;

            do {
                poppedNodeId = stack.pop();
                component.push(poppedNodeId);
            } while (poppedNodeId !== node.id);

            let componentColor = colors[i++ % 7];

            component.forEach(nodeId => {
                actions.push({ elementId: nodeId, type: 'animate', color: componentColor });
            });

            connectedComponents.push(component);
        }
    }
}


export {
    getStronglyConnectedComponents
}