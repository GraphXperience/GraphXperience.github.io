import { openPopup } from '../popup';

let previous;

function getShortestPath(graph, selectedNodes) {
    if (selectedNodes.length === 0) {
        openPopup('Não há nós selecionados');
        return;
    }
    if (selectedNodes.length > 2) {
        openPopup('Selecione dois nós: o nó fonte e o nó destino');
        return;
    }
    const actions = [];

    const isDirected = graph.isDirected;
    const nodes = graph.nodes;
    const sourceNode = selectedNodes[0];
    const targetNode = selectedNodes[1];

    const distances = new Map();
    previous = new Map();

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
        actions.push({ elementId: node.id, type: 'animate' });

        if (nodeId === targetNode.id) {
            actions.push({ elementId: nodeId, type: 'animate', color: 'green' });
            break;
        }

        let neighbors;
        if (isDirected) {
            neighbors = node.outgoingEdges;
        } else {
            neighbors = [...node.incomingEdges, ...node.outgoingEdges];
        }

        neighbors.forEach(edge => {
            const neighbor = edge.targetNode.id === nodeId ? edge.sourceNode : edge.targetNode;
            const weight = edge.weight;
            const currentDistance = distances.get(neighbor.id);
            const newDistance = distance + weight;

            if (newDistance < currentDistance) {
                distances.set(neighbor.id, newDistance);
                previous.set(neighbor.id, node);

                priorityQueue.push({ nodeId: neighbor.id, distance: newDistance });
            }
        });
    }

    const shortestPath = reconstructPath(targetNode);
    shortestPath.forEach(nodeId => { actions.push({ elementId: nodeId, type: 'animate', color: 'green' }); });

    return actions;
}

function reconstructPath(targetNode) {
    const path = [];
    let currentNode = targetNode;

    while (currentNode !== null) {
        path.push(currentNode.id);
        currentNode = previous.get(currentNode.id);
    }

    return path;
}

export {
    getShortestPath
}