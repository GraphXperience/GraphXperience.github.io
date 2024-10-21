import { getCytoscape, getUndoRedo } from "./context";
import { removeTag } from "./extensions/element-extensions";
import { getRandomUuid } from "./utils";

var cy = getCytoscape();
var ur = getUndoRedo();

function clear() {
    cy.elements().forEach(element => removeTag(element));
    cy.elements().remove();
    ur.reset();
}

function connectNodes(nodes) {
    if (nodes.size <= 1) {
        return;
    }

    let actions = [];
    const nodeIds = nodes.map(node => node.id());
    for (let i = 0; i < nodeIds.length - 1; i++) {
        var sourceNodeId = nodeIds[i];
        var targetNodeId = nodeIds[i + 1];

        var existingEdge = cy.edges('[source="' + sourceNodeId + '"][target="' + targetNodeId + '"]');

        if (existingEdge.empty()) {
            const newEdgeId = getRandomUuid();

            actions.push({
                name: 'add',
                param: {
                    group: 'edges',
                    data: {
                        id: newEdgeId,
                        source: sourceNodeId,
                        target: targetNodeId,
                        weight: 1,
                    },
                }
            });
        }
    }

    ur.do('batch', actions);
}

function createNode(mousePosition) {
    let nodePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (mousePosition && mousePosition.x > 0 && mousePosition.y > 0) {
        nodePosition = {
            x: mousePosition.x,
            y: mousePosition.y
        };
    }

    const nodeObj = {
        group: 'nodes',
        data: {
            id: getRandomUuid(),
            weight: 1,
        },
        position: nodePosition,
    };

    ur.do('add', nodeObj);
}

function disconnectEdges(nodes) {
    let edges = cy.collection();

    for (const node of nodes) {
        edges = edges.union(node.connectedEdges());
    }

    ur.do('remove', edges);
}

function removeElement(element) {
    removeTag(element);

    ur.do('remove', element);
}

function removeElements(elements) {
    elements.forEach(element => removeTag(element));
    ur.do('remove', elements);
}

export {
    clear,
    connectNodes,
    createNode,
    disconnectEdges,
    removeElement,
    removeElements
}