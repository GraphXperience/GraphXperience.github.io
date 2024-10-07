import { openPopup } from '../popup';

let visited, stack, actions;

function checkCycles(graph, _) {
    if (graph.nodes.length === 0) {
        openPopup('O grafo está vazio.');
        return [];
    }

    const nodes = graph.nodes;

    visited = new Set();
    stack = [];
    actions = [];

    if (graph.isDirected && nodes.some(detectCyclesDirected)) {
        return actions;
    } else if (nodes.some(detectCyclesUndirected)) {
        return actions;
    }

    if (stack.length === 0) {
        openPopup('O grafo não possui ciclos.');
        return [];
    }

    return actions;
}

let color = '#FF0000';
let stopGreenAt;
function detectCyclesDirected(node) {
    if (stack.includes(node.id)) {
        color = '#008000';
        stopGreenAt = node.id;
        return true;
    }

    if (visited.has(node.id))
        return false;

    visited.add(node.id);
    stack.push(node.id);
    actions.push({ elementId: node.id, type: 'animate' });

    for (const neighbor of node.getNeighbors(true)) {
        if (detectCyclesDirected(neighbor)) {
            actions.push({ elementId: node.id, type: 'animate', color });
            if (stopGreenAt === node.id)
                color = '#FF0000';

            return true;
        }
    }

    stack.pop();

    actions.push({ elementId: node.id, type: 'animate', color: '#808080' });
    return false;
}

function detectCyclesUndirected(node, parent = null) {
    visited.add(node.id);
    actions.push({ elementId: node.id, type: 'animate' });

    for (const neighbor of node.getNeighbors(false)) {
        if (!visited.has(neighbor.id)) {
            if (detectCyclesUndirected(neighbor, node)) {
                actions.push({ elementId: node.id, type: 'animate', color: '#008000' });
                return true;
            }
        } else if (parent.id != neighbor.id) {
            actions.push({ elementId: node.id, type: 'animate', color: '#008000' });
            return true;
        }
    }

    actions.push({ elementId: node.id, type: 'animate', color: '#808080' });
    return false;
}

export {
    checkCycles
}
