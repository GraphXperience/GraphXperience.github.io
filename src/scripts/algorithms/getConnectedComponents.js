import { openPopup } from '../popup';
import { getRandomColor } from '../utils';

let isDirected, visitedNodeIds, connectedComponents, actions;

function getConnectedComponents(graph, _) {
    if (graph.nodes.length === 0) {
        openPopup('O grafo está vazio.');
        return;
    }

    const nodes = graph.nodes;

    isDirected = graph.isDirected;
    visitedNodeIds = new Set();
    connectedComponents = [];
    actions = [];

    for (const node of nodes) {
        if (!visitedNodeIds.has(node.id)) {
            let currentComponent = [];
            let componentColor = getRandomColor();
            visitComponent(node, currentComponent, componentColor);
            connectedComponents.push(currentComponent);
        }
    }

    return actions;
}

function visitComponent(currentNode, currentComponent, componentColor) {
    visitedNodeIds.add(currentNode.id);
    currentComponent.push(currentNode.id);

    actions.push({ elementId: currentNode.id, type: 'animate', color: componentColor });

    for (const neighbor of currentNode.getNeighbors(isDirected)) {
        if (!visitedNodeIds.has(neighbor.id)) {
            visitComponent(neighbor, currentComponent, componentColor);
        }
    }
}

export {
    getConnectedComponents
}