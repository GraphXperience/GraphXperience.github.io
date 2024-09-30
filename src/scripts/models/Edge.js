export class Edge {
    constructor({ id, sourceNode, targetNode, weight = 1, tag = '' }) {
        this.id = id;
        this.sourceNode = sourceNode;
        this.targetNode = targetNode;
        this.weight = weight;
        this.tag = tag;
    }
}
