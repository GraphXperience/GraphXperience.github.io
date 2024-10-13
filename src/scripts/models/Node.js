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
}
