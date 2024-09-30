export class Node {
    constructor({ id, weight = 1, tag = '' }) {
        this.id = id;
        this.weight = weight;
        this.tag = tag;
        this.outgoingEdges = [];
        this.incomingEdges = [];
    }

    addOutgoingEdge(edge) {
        this.outgoingEdges.push(edge);
    }

    addIncomingEdge(edge) {
        this.incomingEdges.push(edge);
    }

    getNeighbors(isDirected) {
        const neighbors = [];

        const addNeighbor = (node) => {
            if (!neighbors.includes(node)) {
                neighbors.push(node);
            }
        };

        this.outgoingEdges.forEach(edge => addNeighbor(edge.targetNode));

        if (!isDirected) {
            this.incomingEdges.forEach(edge => addNeighbor(edge.sourceNode));
        }

        return neighbors;
    }
}
