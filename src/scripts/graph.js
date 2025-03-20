import { getCytoscape, getUndoRedo } from "./context";
import { removeTag, setTag } from "./extensions/element-extensions";
import { getRandomUuid } from "./utils";

const cy = getCytoscape();
const ur = getUndoRedo();

function clear() {
    cy.elements().forEach(removeTag);
    cy.elements().remove();
    cy.data('selectedNodeIds').clear();
    ur.reset();
}

function connectNodes(nodes) {
    if (nodes.size <= 1) {
        return;
    }

    let actions = [];
    const nodeIds = nodes.map(node => node.id());
    for (let i = 0; i < nodeIds.length - 1; i++) {
        const sourceNodeId = nodeIds[i];
        const targetNodeId = nodeIds[i + 1];

        if (!cy.data('isDirected') && !cy.edges('[source="' + targetNodeId + '"][target="' + sourceNodeId + '"]').empty()) {
            continue;
        }

        const existingEdge = cy.edges('[source="' + sourceNodeId + '"][target="' + targetNodeId + '"]');
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

function generateEdgeTags() {
    cy.edges().forEach((edge, i) => setTag(edge, i.toString()));
}

function generateNodeTags() {
    cy.nodes().forEach((node, i) => setTag(node, i.toString()));
}

function removeElement(element) {
    removeTag(element);
    cy.data('selectedNodeIds').delete(element.id());
    ur.do('remove', element);
}

function removeElements(elements) {
    elements.forEach(element => { 
        removeTag(element);
        cy.data('selectedNodeIds').delete(element.id());
    });
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
    generateEdgeTags,
    generateNodeTags,
    removeElement,
    removeElements,
    removeBidirectionalEdges
}