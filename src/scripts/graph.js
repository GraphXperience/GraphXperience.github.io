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

        if (!cy.data('isDirected') && !cy.edges('[source="' + targetNodeId + '"][target="' + sourceNodeId + '"]').empty()) {
            continue;
        }

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

function removeBidirectionalEdges() {
    const pairs = new Set();
    const edgeIdsToRemove = new Set();

    for (const edge of cy.edges()) {
        const reverse_edge = `${edge.target().id()}${edge.source().id()}`;
        if (pairs.has(reverse_edge)) {
            edgeIdsToRemove.add(edge.id());
        }
        pairs.add(`${edge.source().id()}${edge.target().id()}`);
    }
    
    for (const edgeId of edgeIdsToRemove) {
        cy.$id(edgeId).remove();
    }
}

export {
    clear,
    connectNodes,
    createNode,
    disconnectEdges,
    removeElement,
    removeElements,
    removeBidirectionalEdges
}