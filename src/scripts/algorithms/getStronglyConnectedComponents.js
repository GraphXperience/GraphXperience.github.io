import { openPopup } from '../popup';
import { getRandomColor } from '../utils';

let actions, index, stack, connectedComponents, indexMap, lowLinkMap;

function getStronglyConnectedComponents(graph, _) {
    if (graph.nodes.length === 0) {
        openPopup('O grafo está vazio.');
        return;
    }

    actions = [];
    stack = [];
    connectedComponents = [];
    index = 0;
    indexMap = new Map();
    lowLinkMap = new Map();

    graph.nodes.forEach(node => {
        if (!indexMap.has(node.id)) {
            tarjanDfs(node);
        }
    });

    return actions;
}

function tarjanDfs(node) {
    indexMap.set(node.id, index);
    lowLinkMap.set(node.id, index);

    index++;

    stack.push(node.id);

    node.getNeighbors(true).forEach(neighbor => {
        if (!indexMap.has(neighbor.id)) {
            tarjanDfs(neighbor);
            lowLinkMap.set(node.id, Math.min(lowLinkMap.get(node.id), lowLinkMap.get(neighbor.id)));
        } else if (stack.includes(neighbor.id)) {
            lowLinkMap.set(node.id, Math.min(lowLinkMap.get(node.id), indexMap.get(neighbor.id)));
        }
    });

    if (lowLinkMap.get(node.id) === indexMap.get(node.id)) {
        let component = [];
        let poppedNodeId;

        do {
            poppedNodeId = stack.pop();
            component.push(poppedNodeId);
        } while (poppedNodeId !== node.id);

        let componentColor = getRandomColor();

        component.forEach(nodeId => {
            actions.push({ elementId: nodeId, type: 'animate', color: componentColor });
        });

        connectedComponents.push(component);
    }
}

export {
    getStronglyConnectedComponents
}